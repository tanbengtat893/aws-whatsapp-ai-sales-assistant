'use strict';

/**
 * Unit tests for the FAQ matching service (spec Task 4, Req 3.1-3.3, 8.1).
 *
 * The core `match(text, language, faqs)` is pure: tests pass an explicit FAQ
 * list (the real seed set, plus small purpose-built FAQs for edge cases).
 */

const faqService = require('../src/services/faq.service');
const { match } = faqService;
const seedFaqs = require('../src/data/seed/faqs.json');

const ORIGINAL_THRESHOLD = process.env.FAQ_MIN_CONFIDENCE;

afterEach(() => {
  if (ORIGINAL_THRESHOLD === undefined) {
    delete process.env.FAQ_MIN_CONFIDENCE;
  } else {
    process.env.FAQ_MIN_CONFIDENCE = ORIGINAL_THRESHOLD;
  }
});

describe('faq.service.match - contract', () => {
  test('returns the expected shape', () => {
    const result = match('How much is delivery?', 'en', seedFaqs);
    expect(result).toEqual(
      expect.objectContaining({
        matched: expect.any(Boolean),
        confidence: expect.any(Number),
        fallbackLanguageUsed: expect.any(Boolean),
        language: expect.any(String),
      })
    );
  });

  test('confidence is always within [0,1]', () => {
    for (const text of ['pricing please', '你们几点营业', 'random gibberish xyz']) {
      const r = match(text, 'en', seedFaqs);
      expect(r.confidence).toBeGreaterThanOrEqual(0);
      expect(r.confidence).toBeLessThanOrEqual(1);
    }
  });

  test('is pure: same input yields the same output', () => {
    const a = match('Do you have this in stock?', 'en', seedFaqs);
    const b = match('Do you have this in stock?', 'en', seedFaqs);
    expect(a).toEqual(b);
  });
});

describe('faq.service.match - English matches (Req 3.1, 3.2)', () => {
  test('a pricing question returns the pricing answer', () => {
    const r = match('How much does this cost? What is the price?', 'en', seedFaqs);
    expect(r.matched).toBe(true);
    expect(r.faqId).toBe('faq_pricing');
    expect(r.answer).toBe(seedFaqs.find((f) => f.id === 'faq_pricing').answers.en);
    expect(r.fallbackLanguageUsed).toBe(false);
    expect(r.language).toBe('en');
  });

  test('an availability question returns the availability answer', () => {
    const r = match('Do you have this product in stock?', 'en', seedFaqs);
    expect(r.matched).toBe(true);
    expect(r.faqId).toBe('faq_availability');
  });

  test('an operating-hours question returns the hours answer', () => {
    const r = match('What time do you open and close?', 'en', seedFaqs);
    expect(r.matched).toBe(true);
    expect(r.faqId).toBe('faq_operating_hours');
  });
});

describe('faq.service.match - Malay matches return Malay answers (Req 3.2)', () => {
  test('a Malay pricing question returns the Malay pricing answer', () => {
    const r = match('Berapa harga barang ini?', 'ms', seedFaqs);
    expect(r.matched).toBe(true);
    expect(r.faqId).toBe('faq_pricing');
    expect(r.language).toBe('ms');
    expect(r.fallbackLanguageUsed).toBe(false);
    expect(r.answer).toBe(seedFaqs.find((f) => f.id === 'faq_pricing').answers.ms);
  });

  test('a Malay availability question returns the Malay answer', () => {
    const r = match('Adakah barang ini ada dalam stok?', 'ms', seedFaqs);
    expect(r.matched).toBe(true);
    expect(r.language).toBe('ms');
    expect(r.answer).toBe(seedFaqs.find((f) => f.id === r.faqId).answers.ms);
  });
});

describe('faq.service.match - Chinese matches return Chinese answers (Req 3.2)', () => {
  test('a Chinese availability question returns the Chinese answer', () => {
    const r = match('请问有现货吗', 'zh', seedFaqs);
    expect(r.matched).toBe(true);
    expect(r.language).toBe('zh');
    expect(r.fallbackLanguageUsed).toBe(false);
    expect(r.answer).toBe(seedFaqs.find((f) => f.id === r.faqId).answers.zh);
  });

  test('a Chinese delivery question returns the Chinese answer', () => {
    const r = match('运费多少', 'zh', seedFaqs);
    expect(r.matched).toBe(true);
    expect(r.faqId).toBe('faq_delivery_charges');
    expect(r.language).toBe('zh');
  });
});

describe('faq.service.match - English fallback (Req 3.3)', () => {
  test('matched FAQ missing the detected language falls back to English and flags it', () => {
    const faqs = [
      {
        id: 'faq_x',
        intent: 'test_intent',
        keywords: { en: ['widget', 'gadget'], ms: ['widget'], zh: ['小工具'] },
        answers: { en: 'English only answer' }, // no ms/zh
      },
    ];
    const r = match('do you have a widget gadget', 'zh', faqs);
    expect(r.matched).toBe(true);
    expect(r.answer).toBe('English only answer');
    expect(r.language).toBe('en');
    expect(r.fallbackLanguageUsed).toBe(true);
  });

  test('detected language present -> no fallback', () => {
    const faqs = [
      {
        id: 'faq_y',
        intent: 'test_intent',
        keywords: { en: ['widget', 'gadget'], ms: ['alat', 'peranti'], zh: [] },
        answers: { en: 'EN', ms: 'MS' },
      },
    ];
    const r = match('ada alat peranti', 'ms', faqs);
    expect(r.matched).toBe(true);
    expect(r.answer).toBe('MS');
    expect(r.language).toBe('ms');
    expect(r.fallbackLanguageUsed).toBe(false);
  });
});

describe('faq.service.match - no match (Req 3.1 escalation feed)', () => {
  test('unrelated text returns matched:false', () => {
    const r = match('The weather is lovely and I enjoy hiking', 'en', seedFaqs);
    expect(r.matched).toBe(false);
    expect(r.faqId).toBeNull();
    expect(r.answer).toBeNull();
  });

  test('gibberish returns matched:false with zero confidence', () => {
    const r = match('asdfghjkl qwerty zxcvbn', 'en', seedFaqs);
    expect(r.matched).toBe(false);
    expect(r.confidence).toBe(0);
  });

  test('empty text returns matched:false', () => {
    expect(match('', 'en', seedFaqs).matched).toBe(false);
    expect(match('   ', 'en', seedFaqs).matched).toBe(false);
  });

  test('empty FAQ list returns matched:false', () => {
    expect(match('pricing', 'en', []).matched).toBe(false);
    expect(match('pricing', 'en', undefined).matched).toBe(false);
  });
});

describe('faq.service.match - threshold behavior', () => {
  test('raising the threshold turns a weak match into no match', () => {
    // A single-keyword hit scores ~0.63. A threshold above that -> no match.
    process.env.FAQ_MIN_CONFIDENCE = '0.9';
    const r = match('delivery', 'en', seedFaqs);
    expect(r.matched).toBe(false);
  });

  test('lowering the threshold lets a weak match through', () => {
    process.env.FAQ_MIN_CONFIDENCE = '0.3';
    const r = match('delivery', 'en', seedFaqs);
    expect(r.matched).toBe(true);
  });

  test('threshold defaults to 0.6 when unset or invalid', () => {
    process.env.FAQ_MIN_CONFIDENCE = 'nope';
    expect(faqService._internal.getThreshold()).toBe(0.6);
    delete process.env.FAQ_MIN_CONFIDENCE;
    expect(faqService._internal.getThreshold()).toBe(0.6);
  });
});

describe('faq.service internal helpers', () => {
  test('countKeywordHits counts substring hits', () => {
    const { hits, total } = faqService._internal.countKeywordHits(
      'do you have it in stock now',
      ['stock', 'available', 'have']
    );
    expect(hits).toBe(2); // "stock" and "have"
    expect(total).toBe(3);
  });

  test('resolveAnswer returns detected language when present', () => {
    const faq = { answers: { en: 'EN', ms: 'MS', zh: 'ZH' } };
    expect(faqService._internal.resolveAnswer(faq, 'zh')).toEqual({
      answer: 'ZH',
      language: 'zh',
      fallbackLanguageUsed: false,
    });
  });

  test('resolveAnswer falls back to English when language missing', () => {
    const faq = { answers: { en: 'EN' } };
    expect(faqService._internal.resolveAnswer(faq, 'ms')).toEqual({
      answer: 'EN',
      language: 'en',
      fallbackLanguageUsed: true,
    });
  });
});
