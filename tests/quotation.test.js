'use strict';

/**
 * Tests for purchase-confirmation -> quotation.
 * When a customer selects a specific item (and optional quantity), they get a
 * quotation, not another "Here's what I found" search.
 */

const product = require('../src/services/product.service');
const request = require('supertest');
const app = require('../src/app');
const store = require('../src/data/store');
const seedFaqs = require('../src/data/seed/faqs.json');
const seedProducts = require('../src/data/seed/products.json');
const seedDeliveries = require('../src/data/seed/deliveries.json');

describe('product.detectPurchaseIntent', () => {
  test.each([
    'i prefer this PC Package - Ryzen 5 8400F + RTX5060 8GB, 1 set pls',
    "i'll take the RTX 5070, 2 pcs",
    'i want to buy this',
    'confirm',
    'please quote me for 3 units',
    'order this one',
    'x2',
  ])('treats "%s" as a purchase/confirmation', (t) =>
    expect(product.detectPurchaseIntent(t)).toBe(true)
  );

  test.each([
    'how much is a mouse',
    'do you have RTX 5070',
    'what time do you open',
    'gaming pc around 2000',
  ])('does NOT treat "%s" as a purchase', (t) =>
    expect(product.detectPurchaseIntent(t)).toBe(false)
  );
});

describe('product.parseQuantity', () => {
  test.each([
    ['1 set', 1],
    ['2 sets please', 2],
    ['3 pcs', 3],
    ['qty 5', 5],
    ['x2', 2],
    ['just this one', 1], // no explicit qty -> default 1
  ])('parses "%s" -> %d', (t, n) => expect(product.parseQuantity(t)).toBe(n));
});

describe('product.formatQuotationReply', () => {
  const item = { name: 'PC Package - Test Build', price: 1449, currency: 'SGD', stockStatus: 'in_stock' };

  test('renders a quotation with unit price, quantity, and subtotal', () => {
    const reply = product.formatQuotationReply(item, 2, 'Q-ABC123');
    expect(reply).toMatch(/Quotation/i);
    expect(reply).toMatch(/Q-ABC123/);
    expect(reply).toMatch(/PC Package - Test Build/);
    expect(reply).toMatch(/Unit price: SGD 1449/);
    expect(reply).toMatch(/Quantity: 2/);
    expect(reply).toMatch(/Subtotal: SGD 2898/);
    expect(reply).not.toMatch(/Here's what I found/);
  });

  test('defaults quantity to 1 and computes the right subtotal', () => {
    const reply = product.formatQuotationReply(item, 1);
    expect(reply).toMatch(/Quantity: 1/);
    expect(reply).toMatch(/Subtotal: SGD 1449/);
  });
});

describe('POST /webhook - confirmation returns a quotation', () => {
  beforeEach(() => {
    store.reset('faqs', JSON.parse(JSON.stringify(seedFaqs)));
    store.reset('products', JSON.parse(JSON.stringify(seedProducts)));
    store.reset('deliveries', JSON.parse(JSON.stringify(seedDeliveries)));
    store.reset('enquiries', []);
    store.reset('escalations', []);
  });
  afterAll(() => {
    store.reset('enquiries', []);
    store.reset('escalations', []);
  });

  // Pick a real package name from the seed so the test is catalogue-agnostic.
  const pkg = seedProducts.find((p) => p.category === 'pc_bundle');

  test('selecting a specific package + quantity returns a Quotation (not a search)', async () => {
    const text = `i prefer this ${pkg.name}: SGD ${pkg.price}, 1 set pls`;
    const res = await request(app).post('/webhook').send({ from: 'q1', text });
    expect(res.body.escalated).toBe(false);
    expect(res.body.quoted).toBe(true);
    expect(res.body.quotedQuantity).toBe(1);
    expect(res.body.reply).toMatch(/Quotation/i);
    expect(res.body.reply).toMatch(new RegExp(`Subtotal: SGD ${pkg.price}`));
    expect(res.body.reply).not.toMatch(/Here's what I found/);
  });

  test('quantity is honored in the subtotal', async () => {
    const text = `i want to buy ${pkg.name} 2 sets`;
    const res = await request(app).post('/webhook').send({ from: 'q2', text });
    expect(res.body.quoted).toBe(true);
    expect(res.body.quotedQuantity).toBe(2);
    expect(res.body.reply).toMatch(new RegExp(`Subtotal: SGD ${pkg.price * 2}`));
  });

  test('a plain browse question still returns a search, not a quote', async () => {
    const res = await request(app).post('/webhook').send({ from: 'q3', text: 'how much is a router' });
    expect(res.body.quoted).toBeUndefined();
    expect(res.body.reply).toMatch(/Here's what I found|under SGD/);
  });

  test('a PC package quotation shows the "What\'s included" component breakdown', async () => {
    const text = `i prefer this ${pkg.name}: SGD ${pkg.price}, 1 set pls`;
    const res = await request(app).post('/webhook').send({ from: 'q4', text });
    expect(res.body.quoted).toBe(true);
    expect(res.body.reply).toMatch(/What's included/i);
    expect(res.body.reply).toMatch(/Processor \(CPU\)/i);
    expect(res.body.reply).toMatch(/Memory \(RAM\)/i);
    expect(res.body.reply).toMatch(/Storage/i);
    expect(res.body.reply).toMatch(/Graphics \(GPU\)/i);
    expect(res.body.reply).toMatch(/Power Supply \(PSU\)/i);
    // DVD-ROM was intentionally excluded.
    expect(res.body.reply).not.toMatch(/DVD/i);
  });

  test('asking for a CPU now returns real standalone CPUs (they are stocked)', async () => {
    const res = await request(app)
      .post('/webhook')
      .send({ from: 'q5', text: 'provide CPU pricelist for Intel Core Ultra' });
    expect(res.body.escalated).toBe(false);
    // CPUs are in the catalogue now, so it lists real processors, not packages.
    expect(res.body.notStocked).toBeUndefined();
    const firstItemLine = (res.body.reply || '').split('\n').find((l) => /^\s*1\.\s/.test(l));
    expect(firstItemLine).toBeDefined();
    expect(firstItemLine).not.toMatch(/PC Package/i);
    expect(firstItemLine).toMatch(/Intel|Ultra|Core/i);
  });

  test('replying "confirm" after a quotation offers the payment methods (Card / PayNow)', async () => {
    const from = 'q_confirm';
    await request(app)
      .post('/webhook')
      .send({ from, text: `i prefer this ${pkg.name}: SGD ${pkg.price}, 1 set` });
    const res = await request(app).post('/webhook').send({ from, text: 'confirm' });
    expect(res.body.menuRoute).toBe('payment_method');
    expect(res.body.reply).toMatch(/Pay by Card/i);
    expect(res.body.reply).toMatch(/PayNow/i);
    expect(res.body.quoteRef).toMatch(/^Q-\d{8}-\d{3}$/);
  });

  test('a bare "confirm" with no prior quotation does NOT trigger the payment flow', async () => {
    const res = await request(app).post('/webhook').send({ from: 'q_noquote', text: 'confirm' });
    expect(res.body.menuRoute).not.toBe('payment_method');
    expect(res.body.reason).not.toBe('order_confirmed');
  });

  test('after a priced shortlist, replying a NUMBER asks quantity then quotes', async () => {
    const from = 'q_sel_num';
    const list = await request(app).post('/webhook').send({ from, text: 'how much is a keyboard' });
    expect(list.body.reply).toMatch(/1\.\s/);
    // Live availability is shown alongside the price in the shortlist.
    expect(list.body.reply).toMatch(/in stock/i);
    const sel = await request(app).post('/webhook').send({ from, text: '2' });
    expect(sel.body.reply).toMatch(/how many/i);
    const qty = await request(app).post('/webhook').send({ from, text: '3' });
    expect(qty.body.quoted).toBe(true);
    expect(qty.body.quotedQuantity).toBe(3);
    expect(qty.body.reply).toMatch(/Quotation/i);
    expect(qty.body.reply).toMatch(/Subtotal/i);
    // Quotation reports units in stock.
    expect(qty.body.reply).toMatch(/in stock/i);
  });

  test('after a priced shortlist, typing the item NAME loosely quotes 1 unit immediately', async () => {
    const from = 'q_sel_name';
    await request(app).post('/webhook').send({ from, text: 'how much is a keyboard' });
    const res = await request(app).post('/webhook').send({ from, text: 'i want the logitech k380 please' });
    expect(res.body.quoted).toBe(true);
    expect(res.body.quotedQuantity).toBe(1);
    expect(res.body.reply).toMatch(/Quotation/i);
    expect(res.body.reply).toMatch(/K380/i);
  });

  test('menu 2 shows a numbered package list with component brackets, selectable like option 1', async () => {
    const from = 'q_pkg_flow';
    const list = await request(app).post('/webhook').send({ from, text: '2' });
    // Numbered lines with a bracketed component summary and a single price.
    expect(list.body.reply).toMatch(/1\.\s/);
    expect(list.body.reply).toMatch(/\(.*motherboard.*\)/i);
    expect(list.body.reply).toMatch(/SGD \d+/);
    // Select #1 -> asks quantity.
    const sel = await request(app).post('/webhook').send({ from, text: '1' });
    expect(sel.body.reply).toMatch(/how many/i);
    // Quantity 1 -> quotation with the "What's included" breakdown.
    const qty = await request(app).post('/webhook').send({ from, text: '1' });
    expect(qty.body.quoted).toBe(true);
    expect(qty.body.reply).toMatch(/What's included/i);
    expect(qty.body.reply).toMatch(/Processor \(CPU\)/i);
    // Confirm -> offer payment methods (conversational commerce).
    const conf = await request(app).post('/webhook').send({ from, text: 'confirm' });
    expect(conf.body.menuRoute).toBe('payment_method');
    expect(conf.body.reply).toMatch(/payment|Pay by Card/i);
  });

  test('a component we DO stock (GPU) returns real standalone items, not packages', async () => {
    const res = await request(app).post('/webhook').send({ from: 'q6', text: 'rtx 5070 price' });
    expect(res.body.escalated).toBe(false);
    expect(res.body.quoted).toBeUndefined();
    // Top result should be a graphics card, not a "PC Package - ...".
    const firstItemLine = (res.body.reply || '').split('\n').find((l) => /^\s*1\.\s/.test(l));
    expect(firstItemLine).toBeDefined();
    expect(firstItemLine).not.toMatch(/PC Package/i);
    expect(firstItemLine).toMatch(/RTX\s?5070/i);
  });
});
