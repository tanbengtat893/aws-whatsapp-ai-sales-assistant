'use strict';

/**
 * Universal navigation commands:
 *   HOME: "0" / "menu" / "home" (+ MS/ZH) -> main menu from any step
 *   BACK: "back" / "previous" (+ MS/ZH)   -> previous step in a multi-step flow
 */

const request = require('supertest');
const app = require('../src/app');
const store = require('../src/data/store');
const menu = require('../src/services/menu.service');
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

describe('menu.isHomeCommand / isBackCommand (pure)', () => {
  test.each(['0', 'menu', 'home', 'main menu', 'MENU', '菜单', 'menu utama'])(
    'treats "%s" as HOME',
    (t) => expect(menu.isHomeCommand(t)).toBe(true)
  );
  test.each(['how do I use the menu today', 'homepage design help', '2'])(
    'does NOT treat "%s" as HOME',
    (t) => expect(menu.isHomeCommand(t)).toBe(false)
  );
  test.each(['back', 'previous', 'go back', '返回', 'kembali'])(
    'treats "%s" as BACK',
    (t) => expect(menu.isBackCommand(t)).toBe(true)
  );
  test('does NOT treat "my screen is black" as BACK', () => {
    expect(menu.isBackCommand('my screen is black')).toBe(false);
  });
});

describe('HOME command returns to the main menu from any step', () => {
  test('"0" mid-booking returns the welcome menu', async () => {
    const from = 'nav_home_book';
    await request(app).post('/webhook').send({ from, text: '4' }); // onsite -> service step
    const res = await request(app).post('/webhook').send({ from, text: '0' });
    expect(res.body.home).toBe(true);
    expect(res.body.reply).toMatch(/Quick options|Welcome/i);
  });

  test('"menu" mid-quantity returns the welcome menu', async () => {
    const from = 'nav_home_qty';
    await request(app).post('/webhook').send({ from, text: 'how much is a keyboard' });
    await request(app).post('/webhook').send({ from, text: '1' }); // awaiting quantity
    const res = await request(app).post('/webhook').send({ from, text: 'menu' });
    expect(res.body.home).toBe(true);
    expect(res.body.reply).toMatch(/Quick options|Welcome/i);
  });
});

describe('BACK command steps to the previous step', () => {
  test('onsite: slot -> back -> date -> back -> service -> back -> menu', async () => {
    const from = 'nav_back_onsite';
    await request(app).post('/webhook').send({ from, text: '4' }); // service step
    await request(app).post('/webhook').send({ from, text: '1' }); // date step
    await request(app).post('/webhook').send({ from, text: '1' }); // slot step
    const b1 = await request(app).post('/webhook').send({ from, text: 'back' });
    expect(b1.body.menuRoute).toBe('onsite_book_date');
    const b2 = await request(app).post('/webhook').send({ from, text: 'back' });
    expect(b2.body.menuRoute).toBe('onsite_book_service');
    const b3 = await request(app).post('/webhook').send({ from, text: 'back' });
    expect(b3.body.home).toBe(true); // first step -> menu
  });

  test('carry-in: device -> back -> slot -> back -> date', async () => {
    const from = 'nav_back_carry';
    await request(app).post('/webhook').send({ from, text: '3' }); // date step
    await request(app).post('/webhook').send({ from, text: '1' }); // slot step
    await request(app).post('/webhook').send({ from, text: '1' }); // device step
    const b1 = await request(app).post('/webhook').send({ from, text: 'back' });
    expect(b1.body.menuRoute).toBe('carry_in_book_slot');
    const b2 = await request(app).post('/webhook').send({ from, text: 'back' });
    expect(b2.body.menuRoute).toBe('carry_in_book_date');
  });

  test('product: quantity -> back -> shortlist', async () => {
    const from = 'nav_back_qty';
    await request(app).post('/webhook').send({ from, text: 'how much is a keyboard' });
    await request(app).post('/webhook').send({ from, text: '1' }); // awaiting quantity
    const back = await request(app).post('/webhook').send({ from, text: 'back' });
    expect(back.body.menuRoute).toBe('product_shortlist');
    expect(back.body.reply).toMatch(/1\.\s/);
  });
});

describe('nav hint appears on multi-step prompts', () => {
  test('the onsite service picker shows the 0/back hint', async () => {
    const res = await request(app).post('/webhook').send({ from: 'nav_hint', text: '4' });
    expect(res.body.reply).toMatch(/Reply 0 for the main menu|back/i);
  });
});
