'use strict';

/**
 * Online booking flows for repair services:
 *   Onsite (menu 4):  service type -> date -> time slot -> details -> OS booking (CONFIRMED)
 *   Carry-in (menu 3): date -> time slot -> device -> problem -> CI booking (Awaiting Drop-Off)
 */

const request = require('supertest');
const app = require('../src/app');
const store = require('../src/data/store');
const booking = require('../src/services/booking.service');
const seedFaqs = require('../src/data/seed/faqs.json');
const seedProducts = require('../src/data/seed/products.json');
const seedDeliveries = require('../src/data/seed/deliveries.json');

beforeEach(() => {
  store.reset('faqs', JSON.parse(JSON.stringify(seedFaqs)));
  store.reset('products', JSON.parse(JSON.stringify(seedProducts)));
  store.reset('deliveries', JSON.parse(JSON.stringify(seedDeliveries)));
  store.reset('enquiries', []);
  store.reset('escalations', []);
  store.reset('bookings', []);
});

afterAll(() => {
  store.reset('enquiries', []);
  store.reset('escalations', []);
  store.reset('bookings', []);
});

describe('booking.service (pure)', () => {
  test('availableDates returns the next 3 numbered days', () => {
    const now = new Date('2026-09-11T10:00:00');
    const dates = booking.availableDates(now, 3);
    expect(dates).toHaveLength(3);
    expect(dates[0].iso).toBe('2026-09-12');
    expect(dates[0].id).toBe(1);
    expect(dates[2].iso).toBe('2026-09-14');
  });

  test('formatRef builds PREFIX-YYYYMMDD-NNN', () => {
    expect(booking.formatRef('OS', '20260912', 1)).toBe('OS-20260912-001');
    expect(booking.formatRef('CI', '20260912', 12)).toBe('CI-20260912-012');
  });

  test('parseChoice accepts valid numbers within range only', () => {
    expect(booking.parseChoice('2', 3)).toBe(2);
    expect(booking.parseChoice('option 3', 3)).toBe(3);
    expect(booking.parseChoice('9', 3)).toBeNull();
    expect(booking.parseChoice('hello', 3)).toBeNull();
  });
});

describe('onsite booking flow (menu 4)', () => {
  test('completes: service -> date -> slot -> details -> CONFIRMED OS booking', async () => {
    const from = 'bk_onsite';
    const start = await request(app).post('/webhook').send({ from, text: '4' });
    expect(start.body.menuRoute).toBe('onsite_book_service');
    expect(start.body.reply).toMatch(/Troubleshooting/i);

    const svc = await request(app).post('/webhook').send({ from, text: '2' }); // Hardware Repair
    expect(svc.body.menuRoute).toBe('onsite_book_date');

    const date = await request(app).post('/webhook').send({ from, text: '1' });
    expect(date.body.menuRoute).toBe('onsite_book_slot');

    const slot = await request(app).post('/webhook').send({ from, text: '3' }); // 2-4 PM
    expect(slot.body.menuRoute).toBe('onsite_book_details');

    const done = await request(app)
      .post('/webhook')
      .send({ from, text: 'Mr Lee, 10 Simei Ave 1 #02-01 S486570, 98765432, no display' });
    expect(done.body.menuRoute).toBe('onsite_book_confirmed');
    expect(done.body.bookingRef).toMatch(/^OS-\d{8}-\d{3}$/);
    expect(done.body.reply).toMatch(/CONFIRMED/i);
    expect(done.body.reply).toMatch(/Hardware Repair/i);

    const rec = store.list('bookings').find((b) => b.ref === done.body.bookingRef);
    expect(rec).toBeTruthy();
    expect(rec.type).toBe('onsite');
    expect(rec.status).toBe('CONFIRMED');
    expect(rec.serviceKey).toBe('hardware_repair');
    expect(rec.slotLabel).toMatch(/2:00/);
    expect(rec.phone).toBe('98765432');
  });

  test('an invalid service choice re-prompts and stays on the service step', async () => {
    const from = 'bk_onsite_bad';
    await request(app).post('/webhook').send({ from, text: '4' });
    const bad = await request(app).post('/webhook').send({ from, text: '9' });
    expect(bad.body.menuRoute).toBe('onsite_book_service');
    expect(bad.body.reply).toMatch(/not a valid choice|Troubleshooting/i);
  });
});

describe('carry-in booking flow (menu 3)', () => {
  test('completes: date -> slot -> device -> problem -> Awaiting Drop-Off CI booking', async () => {
    const from = 'bk_carry';
    const start = await request(app).post('/webhook').send({ from, text: '3' });
    expect(start.body.menuRoute).toBe('carry_in_book_date');

    const date = await request(app).post('/webhook').send({ from, text: '2' });
    expect(date.body.menuRoute).toBe('carry_in_book_slot');

    const slot = await request(app).post('/webhook').send({ from, text: '1' });
    expect(slot.body.menuRoute).toBe('carry_in_book_device');

    const device = await request(app).post('/webhook').send({ from, text: '1' }); // Laptop
    expect(device.body.menuRoute).toBe('carry_in_book_problem');

    const done = await request(app).post('/webhook').send({ from, text: 'very slow performance' });
    expect(done.body.menuRoute).toBe('carry_in_book_confirmed');
    expect(done.body.bookingRef).toMatch(/^CI-\d{8}-\d{3}$/);
    expect(done.body.reply).toMatch(/Awaiting Drop-Off/i);
    expect(done.body.reply).toMatch(/Laptop/i);
    expect(done.body.reply).toMatch(/SGD 30/);

    const rec = store.list('bookings').find((b) => b.ref === done.body.bookingRef);
    expect(rec.type).toBe('carry_in');
    expect(rec.status).toBe('Awaiting Drop-Off');
    expect(rec.deviceKey).toBe('laptop');
    expect(rec.problem).toMatch(/slow/i);
  });
});

describe('booking references are daily-sequenced', () => {
  test('two onsite bookings on the same day get -001 then -002', async () => {
    async function fullOnsite(from) {
      await request(app).post('/webhook').send({ from, text: '4' });
      await request(app).post('/webhook').send({ from, text: '1' });
      await request(app).post('/webhook').send({ from, text: '1' });
      await request(app).post('/webhook').send({ from, text: '1' });
      return request(app).post('/webhook').send({ from, text: 'A Person, 1 Road S123456, 91112222, slow' });
    }
    const b1 = await fullOnsite('seq1');
    const b2 = await fullOnsite('seq2');
    expect(b1.body.bookingRef).toMatch(/-001$/);
    expect(b2.body.bookingRef).toMatch(/-002$/);
  });
});
