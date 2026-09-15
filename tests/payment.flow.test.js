'use strict';

/**
 * End-to-end conversational-commerce journey (simulated payment gateway):
 *   enquiry -> shortlist -> select -> quantity -> quotation -> confirm
 *   -> choose payment method -> secure pay link -> gateway callback (paid)
 *   -> order + invoice + delivery created -> WhatsApp confirmation
 *   -> delivery trackable via the Delivery Status lookup.
 */

const request = require('supertest');
const app = require('../src/app');
const store = require('../src/data/store');
const payment = require('../src/services/payment.service');
const seedFaqs = require('../src/data/seed/faqs.json');
const seedProducts = require('../src/data/seed/products.json');
const seedDeliveries = require('../src/data/seed/deliveries.json');

beforeEach(() => {
  store.reset('faqs', JSON.parse(JSON.stringify(seedFaqs)));
  store.reset('products', JSON.parse(JSON.stringify(seedProducts)));
  store.reset('deliveries', JSON.parse(JSON.stringify(seedDeliveries)));
  store.reset('enquiries', []);
  store.reset('escalations', []);
  store.reset('orders', []);
  store.reset('invoices', []);
  store.reset('payments', []);
});

afterAll(() => {
  store.reset('enquiries', []);
  store.reset('escalations', []);
  store.reset('orders', []);
  store.reset('invoices', []);
  store.reset('payments', []);
});

/** Drive the chat up to a quotation for a keyboard, returning the qty reply. */
async function reachQuotation(from) {
  await request(app).post('/webhook').send({ from, text: 'how much is a keyboard' });
  await request(app).post('/webhook').send({ from, text: '1' }); // select item 1
  return request(app).post('/webhook').send({ from, text: '2' }); // quantity 2 -> quotation
}

describe('reference number format', () => {
  test('formats a daily-sequenced reference like PREFIX-YYYYMMDD-NNN', () => {
    const ref = payment.formatRef('Q', '20260911', 1);
    expect(ref).toBe('Q-20260911-001');
  });
});

describe('confirm -> payment method offer', () => {
  test('confirming a quotation offers Card and PayNow, not a sales handoff', async () => {
    const from = 'pay_confirm';
    const quo = await reachQuotation(from);
    expect(quo.body.quoted).toBe(true);

    const confirm = await request(app).post('/webhook').send({ from, text: 'confirm' });
    expect(confirm.body.menuRoute).toBe('payment_method');
    expect(confirm.body.reply).toMatch(/Pay by Card/i);
    expect(confirm.body.reply).toMatch(/PayNow/i);
    expect(confirm.body.quoteRef).toMatch(/^Q-\d{8}-\d{3}$/);
    expect(confirm.body.amount).toBeGreaterThan(0);
  });
});

describe('choose method -> secure pay link', () => {
  test('replying 1 (Card) returns a /pay/ link and a pending payment', async () => {
    const from = 'pay_card';
    await reachQuotation(from);
    await request(app).post('/webhook').send({ from, text: 'confirm' });
    const method = await request(app).post('/webhook').send({ from, text: '1' });

    expect(method.body.menuRoute).toBe('payment_pending');
    expect(method.body.payUrl).toMatch(/\/pay\//);
    expect(method.body.reply).toMatch(/Secure Payment/i);
    expect(method.body.paymentId).toBeTruthy();

    const rec = store.get('payments', method.body.paymentId);
    expect(rec.status).toBe('pending');
    expect(rec.method).toBe('card');
    expect(rec.amount).toBeGreaterThan(0);
  });

  test('an invalid method reply re-prompts and stays on the payment step', async () => {
    const from = 'pay_bad_method';
    await reachQuotation(from);
    await request(app).post('/webhook').send({ from, text: 'confirm' });
    const bad = await request(app).post('/webhook').send({ from, text: '9' });
    expect(bad.body.menuRoute).toBe('payment_method');
    expect(bad.body.reply).toMatch(/1 for|Card/i);
  });
});

describe('gateway callback -> order + invoice + delivery + confirmation', () => {
  test('completing payment creates matching ORD/INV/DO and sends confirmation', async () => {
    const from = 'pay_full';
    await reachQuotation(from);
    await request(app).post('/webhook').send({ from, text: 'confirm' });
    const method = await request(app).post('/webhook').send({ from, text: '2' }); // PayNow
    const paymentId = method.body.paymentId;

    // The (simulated) gateway completes the payment.
    const done = await request(app)
      .post(`/pay/${paymentId}/complete`)
      .send({ customerName: 'Test Buyer', deliveryAddress: '1 Test Road, Singapore 100001' });

    expect(done.status).toBe(200);
    expect(done.body.ok).toBe(true);
    expect(done.body.orderRef).toMatch(/^ORD-\d{8}-\d{3}$/);
    expect(done.body.invoiceRef).toMatch(/^INV-\d{8}-\d{3}$/);
    expect(done.body.deliveryRef).toMatch(/^DO-\d{8}-\d{3}$/);
    expect(done.body.confirmation).toMatch(/Payment received/i);
    expect(done.body.confirmation).toMatch(/Preparing Order/i);

    // Records exist.
    expect(store.list('orders').length).toBe(1);
    expect(store.list('invoices').length).toBe(1);

    // The payment is now paid and linked.
    const rec = store.get('payments', paymentId);
    expect(rec.status).toBe('paid');
    expect(rec.orderRef).toBe(done.body.orderRef);

    // The new delivery order is trackable via the Delivery Status lookup.
    const track = await request(app).post('/webhook').send({ from: 'pay_track', text: done.body.deliveryRef });
    expect(track.body.deliveryFound).toBe(true);
    expect(track.body.reply).toMatch(new RegExp(done.body.deliveryRef));
  });

  test('completing the same payment twice is idempotent (no duplicate orders)', async () => {
    const from = 'pay_idem';
    await reachQuotation(from);
    await request(app).post('/webhook').send({ from, text: 'confirm' });
    const method = await request(app).post('/webhook').send({ from, text: '1' });
    const paymentId = method.body.paymentId;

    await request(app).post(`/pay/${paymentId}/complete`).send({});
    await request(app).post(`/pay/${paymentId}/complete`).send({});

    expect(store.list('orders').length).toBe(1);
    expect(store.list('invoices').length).toBe(1);
  });
});
