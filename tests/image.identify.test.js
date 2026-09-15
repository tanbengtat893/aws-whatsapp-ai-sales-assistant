'use strict';

/**
 * Tests for image-based product identification (Option B).
 * Uses the mock vision provider (VISION_PROVIDER defaults to "mock").
 */

const request = require('supertest');
const app = require('../src/app');
const store = require('../src/data/store');
const vision = require('../src/services/ai/vision.provider');
const product = require('../src/services/product.service');
const seedProducts = require('../src/data/seed/products.json');

const fakeImage = Buffer.from('not-a-real-image-just-bytes');
const fakeB64 = fakeImage.toString('base64');

beforeEach(() => {
  store.reset('products', JSON.parse(JSON.stringify(seedProducts)));
  store.reset('enquiries', []);
  store.reset('escalations', []);
});
afterAll(() => {
  store.reset('enquiries', []);
  store.reset('escalations', []);
});

describe('vision.provider (mock)', () => {
  test('validateImage accepts jpg/png, flags bmp/pdf, rejects others', () => {
    expect(vision.validateImage(fakeImage, 'image/jpeg')).toMatchObject({ ok: true, limited: false });
    expect(vision.validateImage(fakeImage, 'image/png')).toMatchObject({ ok: true, limited: false });
    expect(vision.validateImage(fakeImage, 'image/bmp')).toMatchObject({ ok: true, limited: true });
    expect(vision.validateImage(fakeImage, 'application/pdf')).toMatchObject({ ok: true, limited: true });
    expect(vision.validateImage(fakeImage, 'image/gif').ok).toBe(false);
    expect(vision.validateImage(Buffer.alloc(0), 'image/jpeg').ok).toBe(false);
  });

  test('mock identifies a category from a hint', async () => {
    const r = await vision.identifyImage(fakeImage, 'image/jpeg', 'photo of an rtx graphics card');
    expect(r.category).toBe('gpu');
    expect(r.provider).toBe('mock');
  });

  test('mock returns null when it cannot infer (honest)', async () => {
    const r = await vision.identifyImage(fakeImage, 'image/jpeg', 'blurry unknown object');
    expect(r).toBeNull();
  });
});

describe('product.listByCategory', () => {
  test('returns up to 5 items in the category, cheapest first, brand-varied', () => {
    const items = product.listByCategory('gpu', seedProducts, 5);
    expect(items.length).toBeGreaterThan(0);
    expect(items.length).toBeLessThanOrEqual(5);
    expect(items.every((p) => p.category === 'gpu')).toBe(true);
  });

  test('unknown category returns empty', () => {
    expect(product.listByCategory('flux', seedProducts)).toEqual([]);
  });
});

describe('POST /webhook/image', () => {
  test('identifies a category and returns up to 5 numbered items with prices', async () => {
    const res = await request(app)
      .post('/webhook/image')
      .send({ from: 'img_cust', image: fakeB64, mime: 'image/jpeg', hint: 'a graphics card, looks like rtx' });
    expect(res.status).toBe(200);
    expect(res.body.identified).toBe(true);
    expect(res.body.category).toBe('gpu');
    expect(res.body.itemCount).toBeGreaterThan(0);
    // Numbered list "1." "2." with SGD prices.
    expect(res.body.reply).toMatch(/1\..*SGD/);
    expect(res.body.reply).toMatch(/2\./);
  });

  test('honest fallback when the item cannot be identified', async () => {
    const res = await request(app)
      .post('/webhook/image')
      .send({ from: 'img_cust2', image: fakeB64, mime: 'image/jpeg', hint: 'blurry unknown thing' });
    expect(res.status).toBe(200);
    expect(res.body.identified).toBe(false);
    expect(res.body.escalated).toBe(false);
    expect(res.body.reply).toMatch(/couldn't confidently identify/i);
  });

  test('accepts a data: URL image', async () => {
    const res = await request(app)
      .post('/webhook/image')
      .send({ from: 'img_cust3', image: `data:image/png;base64,${fakeB64}`, hint: 'ram stick ddr5' });
    expect(res.body.identified).toBe(true);
    expect(res.body.category).toBe('ram');
  });

  test('rejects an unsupported image type gracefully', async () => {
    const res = await request(app)
      .post('/webhook/image')
      .send({ from: 'img_cust4', image: fakeB64, mime: 'image/gif', hint: 'gpu' });
    expect(res.status).toBe(200);
    expect(res.body.identified).toBe(false);
    expect(res.body.reply).toMatch(/JPG, JPEG or PNG/i);
  });

  test('400 when from or image missing', async () => {
    expect((await request(app).post('/webhook/image').send({ image: fakeB64 })).status).toBe(400);
    expect((await request(app).post('/webhook/image').send({ from: 'x' })).status).toBe(400);
  });

  test('records an image enquiry in the store', async () => {
    await request(app)
      .post('/webhook/image')
      .send({ from: 'img_rec', image: fakeB64, mime: 'image/jpeg', hint: 'ssd nvme' });
    const e = store.list('enquiries').find((x) => x.from === 'img_rec');
    expect(e).toBeTruthy();
    expect(e.isImage).toBe(true);
  });
});
