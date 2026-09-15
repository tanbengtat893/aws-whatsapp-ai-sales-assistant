'use strict';

/**
 * Integration tests for POST /webhook (spec Task 7, Req 1.1-1.3, 3.4, 4.3, 4.4, 8.2).
 * Uses supertest against the Express app. The store is reset/reseeded between
 * tests so each case is deterministic.
 */

const request = require('supertest');
const app = require('../src/app');
const store = require('../src/data/store');
const seedFaqs = require('../src/data/seed/faqs.json');
const seedProducts = require('../src/data/seed/products.json');

beforeEach(() => {
  // Deterministic starting state.
  store.reset('faqs', JSON.parse(JSON.stringify(seedFaqs)));
  store.reset('products', JSON.parse(JSON.stringify(seedProducts)));
  store.reset('enquiries', []);
  store.reset('escalations', []);
});

afterAll(() => {
  store.reset('enquiries', []);
  store.reset('escalations', []);
});

describe('POST /webhook - validation (Req 1.2)', () => {
  test('missing text -> 400 and no enquiry recorded', async () => {
    const res = await request(app).post('/webhook').send({ from: 'cust_1' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('invalid_payload');
    expect(store.list('enquiries')).toHaveLength(0);
  });

  test('missing from -> 400 and no enquiry recorded', async () => {
    const res = await request(app).post('/webhook').send({ text: 'hello' });
    expect(res.status).toBe(400);
    expect(store.list('enquiries')).toHaveLength(0);
  });

  test('empty strings are rejected', async () => {
    const res = await request(app).post('/webhook').send({ from: '', text: '' });
    expect(res.status).toBe(400);
    expect(store.list('enquiries')).toHaveLength(0);
  });
});

describe('POST /webhook - auto-answer (Req 3, 8.2)', () => {
  test('English pricing question (no product named) returns the pricing FAQ', async () => {
    const res = await request(app)
      .post('/webhook')
      .send({ from: 'cust_en', text: 'What is your pricing policy?' });
    expect(res.status).toBe(200);
    expect(res.body.escalated).toBe(false);
    expect(res.body.status).toBe('auto_answered');
    expect(res.body.matchedFaqId).toBe('faq_pricing');
    expect(res.body.reply).toBe(seedFaqs.find((f) => f.id === 'faq_pricing').answers.en);
    expect(res.body.language).toBe('en');
  });

  test('Malay message returns a Malay reply', async () => {
    const res = await request(app)
      .post('/webhook')
      .send({ from: 'cust_ms', text: 'Berapa harga barang ini?' });
    expect(res.status).toBe(200);
    expect(res.body.language).toBe('ms');
    expect(res.body.escalated).toBe(false);
    // The reply should be the Malay pricing answer.
    expect(res.body.reply).toBe(seedFaqs.find((f) => f.id === 'faq_pricing').answers.ms);
  });

  test('Chinese message returns a Chinese reply', async () => {
    const res = await request(app)
      .post('/webhook')
      .send({ from: 'cust_zh', text: '请问有现货吗' });
    expect(res.status).toBe(200);
    expect(res.body.language).toBe('zh');
    expect(res.body.escalated).toBe(false);
  });

  test('records the enquiry with auto_answered status (Req 1.1, 3.4)', async () => {
    await request(app)
      .post('/webhook')
      .send({ from: 'cust_rec', text: 'What are your operating hours?' });
    const enquiries = store.list('enquiries');
    expect(enquiries).toHaveLength(1);
    expect(enquiries[0].from).toBe('cust_rec');
    expect(enquiries[0].status).toBe('auto_answered');
    expect(enquiries[0].receivedAt).toBeTruthy();
  });
});

describe('POST /webhook - product quotation path', () => {
  test('a specific product query returns prices and stock', async () => {
    const res = await request(app)
      .post('/webhook')
      .send({ from: 'cust_prod', text: 'samsung 870 evo ssd' });
    expect(res.status).toBe(200);
    expect(res.body.escalated).toBe(false);
    expect(res.body.reply).toMatch(/samsung/i);
    expect(res.body.reply).toMatch(/SGD/);
  });
});

describe('POST /webhook - budget-aware answers (human-like)', () => {
  test('within-budget query lists only affordable items', async () => {
    const res = await request(app)
      .post('/webhook')
      .send({ from: 'cust_budget_ok', text: 'router under $300' });
    expect(res.status).toBe(200);
    expect(res.body.escalated).toBe(false);
    expect(res.body.reply).toMatch(/under SGD 300/i);
  });

  test('when nothing fits the budget, it answers honestly with the cheapest option', async () => {
    const res = await request(app)
      .post('/webhook')
      .send({ from: 'cust_budget_none', text: 'router with less than $10' });
    expect(res.status).toBe(200);
    expect(res.body.escalated).toBe(false);
    // Honest: nothing under the budget, but shows the closest options (numbered).
    expect(res.body.reply).toMatch(/nothing fits under SGD 10|closest options/i);
    // Names a real product with a price.
    expect(res.body.reply).toMatch(/SGD \d+/);
  });
});

describe('POST /webhook - escalation (Req 4.1, 4.2, 4.3, 4.4)', () => {
  test('unknown question escalates with an acknowledgement', async () => {
    const res = await request(app)
      .post('/webhook')
      .send({ from: 'cust_unknown', text: 'Do you sell purple flying unicorns from Mars?' });
    expect(res.status).toBe(200);
    expect(res.body.escalated).toBe(true);
    expect(res.body.reason).toBe('low_confidence');
    expect(res.body.status).toBe('pending');
    expect(typeof res.body.reply).toBe('string');
    expect(res.body.reply.length).toBeGreaterThan(0);

    // An escalation record is created and the enquiry is pending.
    expect(store.list('escalations')).toHaveLength(1);
    expect(store.list('enquiries')[0].status).toBe('pending');
  });

  test('explicit human request escalates as human_requested', async () => {
    const res = await request(app)
      .post('/webhook')
      .send({ from: 'cust_human', text: 'I want to talk to a person please' });
    expect(res.status).toBe(200);
    expect(res.body.escalated).toBe(true);
    expect(res.body.reason).toBe('human_requested');
    expect(store.list('escalations')[0].reason).toBe('human_requested');
  });

  test('escalation acknowledgement is localized (Malay)', async () => {
    const res = await request(app)
      .post('/webhook')
      .send({ from: 'cust_ms_esc', text: 'boleh saya cakap dengan orang' });
    expect(res.body.escalated).toBe(true);
    expect(res.body.language).toBe('ms');
    // Malay acknowledgement (confirms request + contact within 10 minutes).
    expect(res.body.reply).toMatch(/wakil jualan/i);
    expect(res.body.reply).toMatch(/10 minit/i);
  });
});

describe('POST /webhook - input sanitization (Req 1.3)', () => {
  test('control characters are stripped and whitespace collapsed before storing', async () => {
    await request(app)
      .post('/webhook')
      .send({ from: 'cust_san', text: '  How   much\u0000 is\tdelivery?  ' });
    const stored = store.list('enquiries')[0];
    expect(stored.text).toBe('How much is delivery?');
  });
});
