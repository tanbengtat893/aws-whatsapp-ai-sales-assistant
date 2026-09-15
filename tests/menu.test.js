'use strict';

/**
 * Tests for the hybrid menu/greeting experience (BIS Computer Services).
 * Unit tests for menu.service + integration tests through /webhook.
 */

const menu = require('../src/services/menu.service');
const request = require('supertest');
const app = require('../src/app');
const store = require('../src/data/store');
const seedFaqs = require('../src/data/seed/faqs.json');
const seedProducts = require('../src/data/seed/products.json');

describe('menu.service.isGreeting', () => {
  test.each(['hi', 'Hello', 'hey', 'good morning', 'help', 'menu', 'selamat pagi', '你好', '您好'])(
    'treats "%s" as a greeting',
    (t) => expect(menu.isGreeting(t)).toBe(true)
  );

  test.each([
    'how much is the RTX 5070 TUF',
    'do you have 32GB DDR5 RAM in stock right now please',
    'my pc wont turn on what do i do',
  ])('does not treat a real question "%s" as a greeting', (t) =>
    expect(menu.isGreeting(t)).toBe(false)
  );
});

describe('menu.service.detectMenuChoice', () => {
  test.each([
    ['1', 1], ['2', 2], ['7', 7], ['option 3', 3], ['#4', 4], ['5.', 5],
  ])('maps "%s" to option %d', (t, id) => {
    expect(menu.detectMenuChoice(t).id).toBe(id);
  });

  test('maps label keywords', () => {
    expect(menu.detectMenuChoice('repair').id).toBe(3);
    expect(menu.detectMenuChoice('onsite').id).toBe(4);
    expect(menu.detectMenuChoice('talk to sales').id).toBe(6);
  });

  test('returns null for a number out of range or a real question', () => {
    expect(menu.detectMenuChoice('10')).toBeNull();
    expect(menu.detectMenuChoice('how much is 1 rtx 5070')).toBeNull();
  });

  test('option 8 is Warranty Status, option 9 is About Us', () => {
    expect(menu.detectMenuChoice('8').route).toBe('warranty');
    expect(menu.detectMenuChoice('9').route).toBe('about');
  });

  test('option 6 (Talk to Sales) escalates', () => {
    const opt = menu.detectMenuChoice('6');
    const resp = menu.buildMenuResponse(opt);
    expect(resp.escalate).toBe(true);
    expect(resp.reason).toBe('human_requested');
  });
});

describe('menu.service.buildWelcome', () => {
  test('includes the business name and all 7 numbered options', () => {
    const w = menu.buildWelcome();
    expect(w).toMatch(/BIS Computer Services/);
    for (let i = 1; i <= 7; i += 1) expect(w).toMatch(new RegExp('\\n' + i + '\\.'));
  });
});

describe('POST /webhook - hybrid menu flow', () => {
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

  test('a greeting returns the welcome menu and does NOT escalate', async () => {
    const res = await request(app).post('/webhook').send({ from: 'g1', text: 'hi' });
    expect(res.status).toBe(200);
    expect(res.body.escalated).toBe(false);
    expect(res.body.greeting).toBe(true);
    expect(res.body.reply).toMatch(/BIS Computer Services/);
    expect(res.body.reply).toMatch(/Quick options/);
  });

  test('a Chinese greeting also welcomes (not escalate)', async () => {
    const res = await request(app).post('/webhook').send({ from: 'g2', text: '你好' });
    expect(res.body.escalated).toBe(false);
    expect(res.body.reply).toMatch(/BIS Computer Services/);
  });

  test('welcome menu shows the un-numbered Language option below the numbered list', async () => {
    const res = await request(app).post('/webhook').send({ from: 'lang0', text: 'hi' });
    expect(res.body.reply).toMatch(/🌐 Language/);
    // Menu labels stay in English.
    expect(res.body.reply).toMatch(/Computer Components/);
  });

  test('typing "language" shows the language picker', async () => {
    const res = await request(app).post('/webhook').send({ from: 'lang1', text: 'language' });
    expect(res.body.languagePicker).toBe(true);
    expect(res.body.reply).toMatch(/中文/);
    expect(res.body.reply).toMatch(/Bahasa Melayu/);
    expect(res.body.reply).toMatch(/English/);
  });

  test('choosing 中文 sets a sticky preference; later English text still replies in Chinese', async () => {
    const from = 'lang2';
    await request(app).post('/webhook').send({ from, text: 'language' });
    const set = await request(app).post('/webhook').send({ from, text: '中文' });
    expect(set.body.langSet).toBe('zh');
    expect(set.body.language).toBe('zh');
    // A later ENGLISH message should still be answered in Chinese (pref wins).
    const later = await request(app).post('/webhook').send({ from, text: 'how much is ram' });
    expect(later.body.language).toBe('zh');
    expect(later.body.reply).toMatch(/以下是我为您找到的|回复编号/);
  });

  test('About Us (option 9) is localized when the customer chose Chinese', async () => {
    const from = 'about_zh';
    await request(app).post('/webhook').send({ from, text: 'language' });
    await request(app).post('/webhook').send({ from, text: '中文' });
    const res = await request(app).post('/webhook').send({ from, text: '9' });
    expect(res.body.reply).toMatch(/关于 BIS Computer Services/);
    expect(res.body.reply).toMatch(/营业时间/);
    expect(res.body.reply).not.toMatch(/Who we are/);
  });

  test('components (option 1) intro localizes but keeps computer terms in English', async () => {
    const from = 'comp_zh';
    await request(app).post('/webhook').send({ from, text: 'language' });
    await request(app).post('/webhook').send({ from, text: '中文' });
    const res = await request(app).post('/webhook').send({ from, text: '1' });
    // Terms stay English.
    expect(res.body.reply).toMatch(/CPU/);
    expect(res.body.reply).toMatch(/GPU/);
    expect(res.body.reply).toMatch(/RAM/);
    // But the sentence is Chinese.
    expect(res.body.reply).toMatch(/配件|预算/);
  });

  test('choosing Bahasa Melayu sets the preference', async () => {
    const from = 'lang3';
    await request(app).post('/webhook').send({ from, text: 'language' });
    const set = await request(app).post('/webhook').send({ from, text: 'Bahasa Melayu' });
    expect(set.body.langSet).toBe('ms');
    expect(set.body.reply).toMatch(/Bahasa Melayu/i);
  });

  test('language picker is numbered and accepts a number (2 -> Chinese)', async () => {
    const from = 'lang_num';
    const picker = await request(app).post('/webhook').send({ from, text: 'language' });
    expect(picker.body.reply).toMatch(/1\.\s.*English/);
    expect(picker.body.reply).toMatch(/2\.\s.*中文/);
    expect(picker.body.reply).toMatch(/3\.\s.*Bahasa Melayu/);
    const set = await request(app).post('/webhook').send({ from, text: '2' });
    expect(set.body.langSet).toBe('zh');
  });

  test('language picker number 3 selects Bahasa Melayu, 1 selects English', async () => {
    const a = 'lang_num_ms';
    await request(app).post('/webhook').send({ from: a, text: 'language' });
    expect((await request(app).post('/webhook').send({ from: a, text: '3' })).body.langSet).toBe('ms');
    const b = 'lang_num_en';
    await request(app).post('/webhook').send({ from: b, text: 'language' });
    expect((await request(app).post('/webhook').send({ from: b, text: '1' })).body.langSet).toBe('en');
  });

  test('a Malay product query replies in Malay (localized product list)', async () => {
    const res = await request(app).post('/webhook').send({ from: 'ms1', text: 'berapa harga RAM' });
    expect(res.body.language).toBe('ms');
    // Malay intro + Malay select footer, not the English versions.
    expect(res.body.reply).toMatch(/Ini yang saya jumpa|pilihan kami/i);
    expect(res.body.reply).toMatch(/Balas dengan nombor/i);
    expect(res.body.reply).not.toMatch(/Here's what I found/);
  });

  test('Malay flow keeps language through selection and quotation', async () => {
    const from = 'ms2';
    await request(app).post('/webhook').send({ from, text: 'berapa harga RAM' });
    const sel = await request(app).post('/webhook').send({ from, text: '2' });
    expect(sel.body.reply).toMatch(/Anda pilih|Berapa unit/i); // Malay ask-quantity
    const qty = await request(app).post('/webhook').send({ from, text: '3' });
    expect(qty.body.quoted).toBe(true);
    expect(qty.body.reply).toMatch(/Sebut Harga|Jumlah kecil/i); // Malay quotation
  });

  test('menu "4" onsite starts the booking with a service-type picker and the SGD 60 note', async () => {
    const res = await request(app).post('/webhook').send({ from: 'onsite1', text: '4' });
    expect(res.body.menu).toBe(4);
    expect(res.body.menuRoute).toBe('onsite_book_service');
    expect(res.body.reply).toMatch(/SGD 60/);
    expect(res.body.reply).toMatch(/Troubleshooting/i);
    expect(res.body.reply).toMatch(/1\.|2\.|3\./);
  });

  test('onsite booking: service -> date -> slot -> details -> CONFIRMED booking, no product list', async () => {
    const from = 'onsite2';
    await request(app).post('/webhook').send({ from, text: '4' });
    const s1 = await request(app).post('/webhook').send({ from, text: '1' }); // service
    expect(s1.body.reply).not.toMatch(/Here's what I found|PC Package/i);
    expect(s1.body.reply).toMatch(/date/i);
    const s2 = await request(app).post('/webhook').send({ from, text: '1' }); // date
    expect(s2.body.reply).toMatch(/time/i);
    const s3 = await request(app).post('/webhook').send({ from, text: '3' }); // slot
    expect(s3.body.reply).toMatch(/name|address|contact|problem/i);
    const s4 = await request(app)
      .post('/webhook')
      .send({ from, text: 'Mr Tan, 10 Simei Ave 1 #02-01 S486570, 91234567, PC wont start' });
    expect(s4.body.reason).toBe('onsite_booking');
    expect(s4.body.escalated).toBe(true);
    expect(s4.body.bookingRef).toMatch(/^OS-\d{8}-\d{3}$/);
    expect(s4.body.reply).toMatch(/CONFIRMED/i);
    expect(s4.body.reply).toMatch(/SGD 60/);
  });

  test('a direct address (no menu) is recognised and starts the onsite booking', async () => {
    const res = await request(app)
      .post('/webhook')
      .send({ from: 'onsite3', text: 'Blk 123 Bedok North Ave 1 #05-06 Singapore 460123' });
    expect(res.body.menuRoute).toBe('onsite_book_service');
    expect(res.body.reply).not.toMatch(/Here's what I found|PC Package/i);
    expect(res.body.reply).toMatch(/Troubleshooting|service/i);
  });

  test('menu "1" routes to the components prompt', async () => {
    const res = await request(app).post('/webhook').send({ from: 'm1', text: '1' });
    expect(res.body.escalated).toBe(false);
    expect(res.body.menu).toBe(1);
    expect(res.body.reply).toMatch(/component/i);
  });

  test('menu "3" starts the carry-in booking with a date picker', async () => {
    const res = await request(app).post('/webhook').send({ from: 'm3', text: '3' });
    expect(res.body.menu).toBe(3);
    expect(res.body.menuRoute).toBe('carry_in_book_date');
    expect(res.body.reply).toMatch(/date/i);
    expect(res.body.reply).toMatch(/1\.|2\.|3\./);
  });

  test('menu "6" escalates to sales (human_requested)', async () => {
    const res = await request(app).post('/webhook').send({ from: 'm6', text: '6' });
    expect(res.body.escalated).toBe(true);
    expect(res.body.reason).toBe('human_requested');
    expect(store.list('escalations')).toHaveLength(1);
  });

  test('a specific product question returns REAL prices, not the generic pricing FAQ', async () => {
    const res = await request(app)
      .post('/webhook')
      .send({ from: 'p1', text: 'do you sell a router? how much does it cost?' });
    expect(res.body.escalated).toBe(false);
    // Should list an actual router with a price, not "prices depend on the product".
    expect(res.body.reply).toMatch(/router/i);
    expect(res.body.reply).toMatch(/SGD \d+/);
    expect(res.body.reply).not.toMatch(/prices depend on the product/i);
  });

  test('a generic "what is the price?" (no product) still falls back to the pricing FAQ', async () => {
    const res = await request(app).post('/webhook').send({ from: 'p2', text: 'what is the price?' });
    expect(res.body.escalated).toBe(false);
    expect(res.body.reply).toMatch(/prices depend on the product/i);
  });

  test.each(['10', '99', '11'])(
    'invalid menu number "%s" shows an invalid-option alert + the menu (not a product answer)',
    async (num) => {
      const res = await request(app).post('/webhook').send({ from: 'inv_' + num, text: num });
      expect(res.status).toBe(200);
      expect(res.body.escalated).toBe(false);
      expect(res.body.invalidOption).toBe(num);
      expect(res.body.reply).toMatch(/isn't a valid option/i);
      expect(res.body.reply).toMatch(/Quick options/); // menu re-shown
    }
  );

  test('"0" is the HOME command: it returns the main menu (not an invalid-option alert)', async () => {
    const res = await request(app).post('/webhook').send({ from: 'home_zero', text: '0' });
    expect(res.body.home).toBe(true);
    expect(res.body.reply).toMatch(/Quick options/);
    expect(res.body.reply).not.toMatch(/isn't a valid option/i);
  });

  test('a number inside free text is NOT treated as an invalid menu pick', async () => {
    const res = await request(app)
      .post('/webhook')
      .send({ from: 'freenum', text: 'how much is 1 RTX 5070 TUF' });
    expect(res.body.invalidOption).toBeUndefined();
    expect(res.body.reply).toMatch(/RTX\s?5070/i);
  });
});

describe('menu.service.detectInvalidMenuNumber (unit)', () => {
  test.each(['0', '10', '99', 'option 11', '#0'])('flags "%s" as invalid', (t) => {
    expect(menu.detectInvalidMenuNumber(t)).not.toBeNull();
  });
  test.each(['1', '7', '8', '9', 'hello', 'how much is 1 rtx'])('does not flag "%s"', (t) => {
    expect(menu.detectInvalidMenuNumber(t)).toBeNull();
  });
});
