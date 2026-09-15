'use strict';

/**
 * Warranty check: serial/invoice/name lookup + service handoff.
 *   menu 8 -> prompt -> serial -> warranty details + 1/2/3 options
 *   1 -> onsite booking · 2 -> carry-in booking · 3 -> talk to service
 * Also: serial pasted directly triggers the lookup anywhere.
 */

const request = require('supertest');
const app = require('../src/app');
const store = require('../src/data/store');
const warranty = require('../src/services/warranty.service');
const seedFaqs = require('../src/data/seed/faqs.json');
const seedProducts = require('../src/data/seed/products.json');
const seedDeliveries = require('../src/data/seed/deliveries.json');
const seedWarranty = require('../src/data/seed/warranty.json');

beforeEach(() => {
  store.reset('faqs', JSON.parse(JSON.stringify(seedFaqs)));
  store.reset('products', JSON.parse(JSON.stringify(seedProducts)));
  store.reset('deliveries', JSON.parse(JSON.stringify(seedDeliveries)));
  store.reset('warranty', JSON.parse(JSON.stringify(seedWarranty)));
  store.reset('enquiries', []);
  store.reset('escalations', []);
  store.reset('bookings', []);
});

afterAll(() => {
  store.reset('enquiries', []);
  store.reset('escalations', []);
  store.reset('bookings', []);
});

describe('warranty.service (pure)', () => {
  test('normalizeSerial collapses repeated dashes / spaces / case', () => {
    expect(warranty.normalizeSerial('sg26-tp--0015-10865')).toBe('SG26-TP-0015-10865');
    expect(warranty.normalizeSerial('SG26-TP--0015-10865')).toBe('SG26-TP-0015-10865');
  });

  test('looksLikeSerial / looksLikeInvoice detect the formats', () => {
    expect(warranty.looksLikeSerial('serial SG26-ASU-0003-22173 please')).toBe(true);
    expect(warranty.looksLikeSerial('how much is a keyboard')).toBe(false);
    expect(warranty.looksLikeInvoice('INV-26003')).toBe(true);
  });

  test('matchWarranty resolves by serial (hyphen-tolerant)', () => {
    const recs = store.list('warranty');
    const m = warranty.matchWarranty('sg26-tp-0015-10865', recs);
    expect(m).toHaveLength(1);
    expect(m[0].customerName).toBe('Muhammad Irfan');
  });
});

describe('warranty lookup via chat', () => {
  test('menu 8 shows the warranty prompt', async () => {
    const res = await request(app).post('/webhook').send({ from: 'w_menu', text: '8' });
    expect(res.body.menu).toBe(8);
    expect(res.body.reply).toMatch(/Warranty/i);
    expect(res.body.reply).toMatch(/Serial number/i);
  });

  test('a pasted serial returns the warranty details with 1/2/3 options', async () => {
    const res = await request(app)
      .post('/webhook')
      .send({ from: 'w_serial', text: 'check warranty for Serial number SG26-ASU-0003-22173' });
    expect(res.body.warrantyFound).toBe(true);
    expect(res.body.reply).toMatch(/Mohamed Faizal/);
    expect(res.body.reply).toMatch(/ASUS Dual GeForce RTX 4060/);
    expect(res.body.reply).toMatch(/1 Year Onsite Warranty/);
    expect(res.body.reply).toMatch(/2027-04-04/);
    expect(res.body.reply).toMatch(/1️⃣|Book an onsite/);
  });

  test('an unknown serial returns an honest not-found message', async () => {
    await request(app).post('/webhook').send({ from: 'w_nf', text: '8' });
    const res = await request(app).post('/webhook').send({ from: 'w_nf', text: 'SG26-XXX-9999-00000' });
    expect(res.body.warrantyFound).toBe(false);
    expect(res.body.reply).toMatch(/couldn't find/i);
  });
});

describe('warranty -> service handoff', () => {
  async function reachWarrantyResult(from) {
    await request(app).post('/webhook').send({ from, text: '8' });
    return request(app).post('/webhook').send({ from, text: 'SG26-ASU-0003-22173' });
  }

  test('reply 1 starts the onsite booking', async () => {
    const from = 'w_to_onsite';
    await reachWarrantyResult(from);
    const res = await request(app).post('/webhook').send({ from, text: '1' });
    expect(res.body.menuRoute).toBe('onsite_book_service');
    expect(res.body.fromWarranty).toBe(true);
  });

  test('reply 2 starts the carry-in booking', async () => {
    const from = 'w_to_carry';
    await reachWarrantyResult(from);
    const res = await request(app).post('/webhook').send({ from, text: '2' });
    expect(res.body.menuRoute).toBe('carry_in_book_date');
    expect(res.body.fromWarranty).toBe(true);
  });

  test('reply 3 escalates to the service team', async () => {
    const from = 'w_to_service';
    await reachWarrantyResult(from);
    const res = await request(app).post('/webhook').send({ from, text: '3' });
    expect(res.body.escalated).toBe(true);
    expect(res.body.reason).toBe('warranty_service');
  });

  test('an invalid option after the result re-prompts', async () => {
    const from = 'w_bad_opt';
    await reachWarrantyResult(from);
    const res = await request(app).post('/webhook').send({ from, text: '9' });
    expect(res.body.menuRoute).toBe('warranty_result');
    expect(res.body.reply).toMatch(/1|onsite|carry-in|service/i);
  });
});
