'use strict';

/**
 * Integration tests for the FAQ management API (spec Task 9, Req 6.1-6.3).
 */

const request = require('supertest');
const app = require('../src/app');
const store = require('../src/data/store');
const seedFaqs = require('../src/data/seed/faqs.json');
const seedProducts = require('../src/data/seed/products.json');

beforeEach(() => {
  store.reset('faqs', JSON.parse(JSON.stringify(seedFaqs)));
  store.reset('products', JSON.parse(JSON.stringify(seedProducts)));
  store.reset('enquiries', []);
  store.reset('escalations', []);
});

afterAll(() => {
  store.reset('enquiries', []);
  store.reset('escalations', []);
});

describe('GET /api/faqs', () => {
  test('lists the seeded FAQs', async () => {
    const res = await request(app).get('/api/faqs');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.faqs)).toBe(true);
    expect(res.body.faqs.length).toBe(seedFaqs.length);
  });
});

describe('POST /api/faqs (Req 6.1, 6.3)', () => {
  test('creates a FAQ with en/ms/zh answers', async () => {
    const res = await request(app)
      .post('/api/faqs')
      .send({
        intent: 'gift_wrapping',
        keywords: { en: ['gift', 'wrap'], ms: ['hadiah'], zh: ['礼品'] },
        answers: { en: 'Yes, we offer gift wrapping.', ms: 'Ya, kami sediakan pembungkusan hadiah.', zh: '是的，我们提供礼品包装。' },
      });
    expect(res.status).toBe(201);
    expect(res.body.faq.id).toBeTruthy();
    expect(res.body.faq.intent).toBe('gift_wrapping');
    expect(res.body.faq.answers.en).toBeTruthy();
    expect(res.body.faq.updatedAt).toBeTruthy();

    // Persisted.
    expect(store.list('faqs').some((f) => f.intent === 'gift_wrapping')).toBe(true);
  });

  test('rejects a FAQ without an English answer (Req 6.3)', async () => {
    const res = await request(app)
      .post('/api/faqs')
      .send({
        intent: 'no_english',
        answers: { ms: 'Hanya Melayu', zh: '只有中文' },
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
    // Not persisted.
    expect(store.list('faqs').some((f) => f.intent === 'no_english')).toBe(false);
  });

  test('rejects a FAQ without an intent', async () => {
    const res = await request(app)
      .post('/api/faqs')
      .send({ answers: { en: 'Some answer' } });
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/faqs/:id (Req 6.2)', () => {
  test('updates an answer and the change is used by subsequent enquiries', async () => {
    const pricing = seedFaqs.find((f) => f.id === 'faq_pricing');
    const newEnAnswer = 'Updated pricing: please share the exact model for a firm quote.';

    const putRes = await request(app)
      .put(`/api/faqs/${pricing.id}`)
      .send({ answers: { en: newEnAnswer } });
    expect(putRes.status).toBe(200);
    expect(putRes.body.faq.answers.en).toBe(newEnAnswer);
    // Other languages preserved.
    expect(putRes.body.faq.answers.ms).toBe(pricing.answers.ms);

    // A subsequent English pricing enquiry should get the new answer.
    const webhookRes = await request(app)
      .post('/webhook')
      .send({ from: 'cust_after_edit', text: 'What is the price?' });
    expect(webhookRes.body.reply).toBe(newEnAnswer);
  });

  test('rejects an update that removes the English answer', async () => {
    const pricing = seedFaqs.find((f) => f.id === 'faq_pricing');
    const res = await request(app)
      .put(`/api/faqs/${pricing.id}`)
      .send({ answers: { en: '' } });
    expect(res.status).toBe(400);
  });

  test('returns 404 for an unknown FAQ id', async () => {
    const res = await request(app)
      .put('/api/faqs/does_not_exist')
      .send({ answers: { en: 'x' } });
    expect(res.status).toBe(404);
  });
});
