'use strict';

/**
 * Tests for the delivery-status lookup feature.
 * Unit tests for delivery.service (pure core) + integration through /webhook.
 */

const delivery = require('../src/services/delivery.service');
const menu = require('../src/services/menu.service');
const request = require('supertest');
const app = require('../src/app');
const store = require('../src/data/store');
const seedFaqs = require('../src/data/seed/faqs.json');
const seedProducts = require('../src/data/seed/products.json');
const seedDeliveries = require('../src/data/seed/deliveries.json');

// A small, deterministic delivery fixture (independent of the seed file).
const FIXTURE = [
  {
    orderNo: 'DO202600001',
    deliveryOrderNo: 'DO202600001',
    customerName: 'Aaron Tan',
    customerPhone: '+65 80000000',
    customerPhoneDigits: '6580000000',
    deliveryAddress: '101 Bukit Panjang Road, Singapore 560123',
    deliveryDate: '2026-09-09',
    arrangedDeliveryTime: '2026-09-09 09:00',
    eta: '2026-09-09 08:30',
    status: 'Scheduled',
    driverName: 'Daniel Wong',
    driverPhone: '+65 9000 1001',
    itemCount: 6,
    items: [],
    totalPrice: 3318,
    currency: 'SGD',
  },
  {
    orderNo: 'DO202600003',
    deliveryOrderNo: 'DO202600003',
    customerName: 'Cheryl Ng',
    customerPhone: '+65 80000002',
    customerPhoneDigits: '6580000002',
    deliveryAddress: '115 Tampines Avenue, Singapore 520345',
    deliveryDate: '2026-09-09',
    arrangedDeliveryTime: '2026-09-09 13:00',
    eta: '2026-09-09 12:30',
    status: 'Out for Delivery',
    driverName: 'Jason Lim',
    driverPhone: '+65 9000 1003',
    itemCount: 6,
    items: [],
    totalPrice: 5844,
    currency: 'SGD',
  },
  {
    orderNo: 'DO202600010',
    deliveryOrderNo: 'DO202600010',
    customerName: 'Aaron Lee', // shares first name "Aaron" with DO...001
    customerPhone: '+65 81112222',
    customerPhoneDigits: '6581112222',
    deliveryAddress: '5 Clementi Road, Singapore 120005',
    deliveryDate: '2026-09-09',
    arrangedDeliveryTime: '2026-09-09 16:00',
    eta: '2026-09-09 15:30',
    status: 'Delivered',
    driverName: 'Ravi Kumar',
    driverPhone: '+65 9000 1010',
    itemCount: 2,
    items: [],
    totalPrice: 900,
    currency: 'SGD',
  },
];

describe('delivery.service.matchDeliveries', () => {
  test('matches by delivery-order number (case-insensitive, with/without space)', () => {
    expect(delivery.matchDeliveries('DO202600003', FIXTURE)).toHaveLength(1);
    expect(delivery.matchDeliveries('do202600003', FIXTURE)[0].customerName).toBe('Cheryl Ng');
    expect(delivery.matchDeliveries('my order is DO 202600003 thanks', FIXTURE)).toHaveLength(1);
  });

  test('matches by exact customer name (case-insensitive)', () => {
    const m = delivery.matchDeliveries('cheryl ng', FIXTURE);
    expect(m).toHaveLength(1);
    expect(m[0].orderNo).toBe('DO202600003');
  });

  test('a shared name substring returns MULTIPLE matches', () => {
    const m = delivery.matchDeliveries('aaron', FIXTURE);
    expect(m.length).toBeGreaterThan(1);
  });

  test('matches by phone with spaces / +65 prefix normalized to digits', () => {
    expect(delivery.matchDeliveries('80000002', FIXTURE)).toHaveLength(1);
    expect(delivery.matchDeliveries('+65 8000 0002', FIXTURE)[0].customerName).toBe('Cheryl Ng');
    expect(delivery.matchDeliveries('6580000002', FIXTURE)).toHaveLength(1);
  });

  test('returns [] when nothing matches', () => {
    expect(delivery.matchDeliveries('DO999999', FIXTURE)).toEqual([]);
    expect(delivery.matchDeliveries('Nonexistent Person', FIXTURE)).toEqual([]);
  });

  test('empty / junk query returns []', () => {
    expect(delivery.matchDeliveries('', FIXTURE)).toEqual([]);
    expect(delivery.matchDeliveries('  ', FIXTURE)).toEqual([]);
  });
});

describe('delivery.service.formatDelivery', () => {
  test('includes status, ETA, arranged window, and driver name+phone', () => {
    const reply = delivery.formatDelivery(FIXTURE[1]);
    expect(reply).toMatch(/DO202600003/);
    expect(reply).toMatch(/Out for Delivery/);
    expect(reply).toMatch(/2026-09-09 12:30/); // ETA
    expect(reply).toMatch(/2026-09-09 13:00/); // arranged window
    expect(reply).toMatch(/Jason Lim/);
    expect(reply).toMatch(/\+65 9000 1003/);
  });

  test('delivered orders get a delivered-specific note', () => {
    const reply = delivery.formatDelivery(FIXTURE[2]);
    expect(reply).toMatch(/delivered/i);
  });
});

describe('delivery.service.looksLikeOrderNo / extractOrderNo', () => {
  test('recognizes DO numbers', () => {
    expect(delivery.looksLikeOrderNo('DO202600001')).toBe(true);
    expect(delivery.looksLikeOrderNo('do 202600001')).toBe(true);
    expect(delivery.looksLikeOrderNo('hello there')).toBe(false);
  });
  test('extracts a normalized order number', () => {
    expect(delivery.extractOrderNo('my order DO 202600001')).toBe('DO202600001');
    expect(delivery.extractOrderNo('nothing here')).toBeNull();
  });
});

describe('menu.service - Delivery Status (option 7)', () => {
  test('bare "7" maps to the delivery_status route', () => {
    const opt = menu.detectMenuChoice('7');
    expect(opt).not.toBeNull();
    expect(opt.route).toBe('delivery_status');
  });

  test('"delivery status" / "track my order" map to option 7 (not option 5)', () => {
    expect(menu.detectMenuChoice('delivery status').id).toBe(7);
    expect(menu.detectMenuChoice('track my order').id).toBe(7);
  });

  test('plain "delivery" now maps to option 7 (Delivery Status); option 5 is Product Availability', () => {
    expect(menu.detectMenuChoice('delivery').id).toBe(7);
  });

  test('"availability" / "in stock" map to option 5 (Product Availability)', () => {
    expect(menu.detectMenuChoice('availability').id).toBe(5);
    expect(menu.detectMenuChoice('in stock').id).toBe(5);
    const opt = menu.detectMenuChoice('5');
    expect(opt.route).toBe('product_availability');
  });

  test('10 is an invalid number (range is now 1-9); 8 and 9 are valid', () => {
    expect(menu.detectInvalidMenuNumber('8')).toBeNull();
    expect(menu.detectInvalidMenuNumber('9')).toBeNull();
    expect(menu.detectInvalidMenuNumber('10')).toBe('10');
  });

  test('the delivery_status prompt asks for order no / name / phone', () => {
    const resp = menu.buildMenuResponse(menu.detectMenuChoice('7'));
    expect(resp.escalate).toBe(false);
    expect(resp.reply).toMatch(/DO\d/);
    expect(resp.reply).toMatch(/name/i);
    expect(resp.reply).toMatch(/handphone|phone/i);
  });
});

describe('POST /webhook - delivery-status flow', () => {
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

  test('option 7 returns the delivery-status prompt', async () => {
    const res = await request(app).post('/webhook').send({ from: 'd1', text: '7' });
    expect(res.body.escalated).toBe(false);
    expect(res.body.menu).toBe(7);
    expect(res.body.reply).toMatch(/DO\d/);
  });

  test('a delivery-order number is looked up wherever it appears (no menu needed)', async () => {
    const res = await request(app).post('/webhook').send({ from: 'd2', text: 'DO202600003' });
    expect(res.body.escalated).toBe(false);
    expect(res.body.deliveryFound).toBe(true);
    expect(res.body.reply).toMatch(/Out for Delivery/);
    expect(res.body.reply).toMatch(/Jason Lim/);
  });

  test('after choosing option 7, a name is looked up', async () => {
    await request(app).post('/webhook').send({ from: 'd3', text: '7' });
    const res = await request(app).post('/webhook').send({ from: 'd3', text: 'Cheryl Ng' });
    expect(res.body.deliveryFound).toBe(true);
    expect(res.body.reply).toMatch(/DO202600003/);
  });

  test('an unknown order number returns a graceful not-found (no escalation)', async () => {
    const res = await request(app).post('/webhook').send({ from: 'd4', text: 'DO000000' });
    expect(res.body.escalated).toBe(false);
    expect(res.body.deliveryFound).toBe(false);
    expect(res.body.reply).toMatch(/couldn't find|could not find/i);
  });

  test('free text (not a delivery query) is NOT hijacked by delivery lookup', async () => {
    const res = await request(app).post('/webhook').send({ from: 'd5', text: 'how much is a mouse' });
    expect(res.body.deliveryFound).toBeUndefined();
  });
});
