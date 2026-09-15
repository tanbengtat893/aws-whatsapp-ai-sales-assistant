'use strict';

/**
 * Tests for OpenClaw AI intent understanding (spec Task 15).
 *
 * The OpenClaw client is mocked so these run anywhere (no gateway needed).
 * We test: the client's parsing/normalization helpers directly, and the
 * webhook pipeline's use of AI intent with deterministic fallback.
 */

const openclaw = require('../src/services/ai/openclaw.client');

describe('openclaw.client - parsing & normalization (pure helpers)', () => {
  const { parseIntentJson, normalizeIntent } = openclaw._internal;

  test('parses plain JSON', () => {
    expect(parseIntentJson('{"domain":"product","category":"gpu"}')).toEqual({
      domain: 'product',
      category: 'gpu',
    });
  });

  test('parses JSON wrapped in markdown fences and prose', () => {
    const raw = 'Here you go:\n```json\n{"domain":"repair","category":null}\n```\nHope this helps';
    expect(parseIntentJson(raw)).toEqual({ domain: 'repair', category: null });
  });

  test('returns null for non-JSON', () => {
    expect(parseIntentJson('no json here')).toBeNull();
    expect(parseIntentJson('')).toBeNull();
  });

  test('normalizeIntent clamps to known values and shapes', () => {
    const out = normalizeIntent({
      domain: 'product',
      category: 'peripheral',
      maxPrice: 150,
      keywords: ['Quiet', ' Keyboard ', 42, ''],
      wantsHuman: true,
    });
    expect(out).toEqual({
      domain: 'product',
      category: 'peripheral',
      maxPrice: 150,
      keywords: ['quiet', 'keyboard'],
      wantsHuman: true,
    });
  });

  test('normalizeIntent defaults unknown domain/category safely', () => {
    const out = normalizeIntent({ domain: 'nonsense', category: 'flux-capacitor', maxPrice: -5 });
    expect(out.domain).toBe('general');
    expect(out.category).toBeNull();
    expect(out.maxPrice).toBeNull();
    expect(out.keywords).toEqual([]);
    expect(out.wantsHuman).toBe(false);
  });
});

describe('openclaw.client - extractIntent gating', () => {
  const ORIGINAL = process.env.USE_OPENCLAW;
  afterEach(() => {
    if (ORIGINAL === undefined) delete process.env.USE_OPENCLAW;
    else process.env.USE_OPENCLAW = ORIGINAL;
  });

  test('returns null when disabled (no gateway call)', async () => {
    delete process.env.USE_OPENCLAW;
    expect(await openclaw.extractIntent('anything')).toBeNull();
  });

  test('returns null for empty message even when enabled', async () => {
    process.env.USE_OPENCLAW = 'true';
    expect(await openclaw.extractIntent('   ')).toBeNull();
  });
});

describe('webhook pipeline with mocked AI intent', () => {
  // Mock the AI client before requiring the app/controller.
  jest.mock('../src/services/ai/openclaw.client');
  const mockedOpenclaw = require('../src/services/ai/openclaw.client');
  const request = require('supertest');
  const store = require('../src/data/store');
  const seedFaqs = require('../src/data/seed/faqs.json');
  const seedProducts = require('../src/data/seed/products.json');
  let app;

  beforeAll(() => {
    app = require('../src/app');
  });

  beforeEach(() => {
    store.reset('faqs', JSON.parse(JSON.stringify(seedFaqs)));
    store.reset('products', JSON.parse(JSON.stringify(seedProducts)));
    store.reset('enquiries', []);
    store.reset('escalations', []);
    mockedOpenclaw.isEnabled.mockReturnValue(true);
    mockedOpenclaw.extractIntent.mockReset();
  });

  afterAll(() => {
    store.reset('enquiries', []);
    store.reset('escalations', []);
    jest.resetModules();
  });

  test('vague "boost my home wifi" -> AI maps to router, answers with a real router', async () => {
    mockedOpenclaw.extractIntent.mockResolvedValue({
      domain: 'product',
      category: 'router',
      maxPrice: null,
      keywords: ['router', 'wifi'],
      wantsHuman: false,
    });
    const res = await request(app)
      .post('/webhook')
      .send({ from: 'ai_cust', text: 'my home internet is weak everywhere, what can help?' });
    expect(res.status).toBe(200);
    expect(res.body.escalated).toBe(false);
    expect(res.body.aiUsed).toBe(true);
    // Should surface a router, not escalate.
    expect(res.body.reply).toMatch(/router|wi-?fi/i);
  });

  test('AI detects a budget: "gaming pc around 2k" -> pc_bundle within budget', async () => {
    mockedOpenclaw.extractIntent.mockResolvedValue({
      domain: 'product',
      category: 'pc_bundle',
      maxPrice: 2000,
      keywords: ['gaming', 'pc', 'bundle'],
      wantsHuman: false,
    });
    const res = await request(app)
      .post('/webhook')
      .send({ from: 'ai_cust2', text: 'need gaming pc 2k' });
    expect(res.body.aiUsed).toBe(true);
    expect(res.body.escalated).toBe(false);
    // Reply should reference a bundle and stay within budget context.
    expect(res.body.reply).toMatch(/bundle|under SGD 2000/i);
  });

  test('AI wantsHuman -> escalates as human_requested', async () => {
    mockedOpenclaw.extractIntent.mockResolvedValue({
      domain: 'human',
      category: null,
      maxPrice: null,
      keywords: [],
      wantsHuman: true,
    });
    const res = await request(app)
      .post('/webhook')
      .send({ from: 'ai_cust3', text: 'can someone actually call me back about this' });
    expect(res.body.escalated).toBe(true);
    expect(res.body.reason).toBe('human_requested');
  });

  test('AI returns null (failure) -> deterministic fallback still handles known queries', async () => {
    mockedOpenclaw.extractIntent.mockResolvedValue(null);
    const res = await request(app)
      .post('/webhook')
      .send({ from: 'ai_cust4', text: 'rtx 5070' });
    expect(res.status).toBe(200);
    expect(res.body.escalated).toBe(false);
    expect(res.body.reply).toMatch(/rtx\s?5070/i);
  });

  test('confident FAQ short-circuits before AI (AI not called)', async () => {
    mockedOpenclaw.extractIntent.mockResolvedValue(null);
    const res = await request(app)
      .post('/webhook')
      .send({ from: 'ai_cust5', text: 'What are your operating hours?' });
    expect(res.body.escalated).toBe(false);
    expect(mockedOpenclaw.extractIntent).not.toHaveBeenCalled();
  });
});
