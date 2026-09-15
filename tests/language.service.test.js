'use strict';

/**
 * Unit tests for the language detection service (spec Task 3, Req 2.1-2.3, 8.1).
 *
 * The service is a pure function, so tests assert specific inputs -> expected
 * language, plus confidence bounds and the low-confidence default rule.
 */

const language = require('../src/services/language.service');
const { detect, SUPPORTED, DEFAULT_LANGUAGE } = language;

// Keep the threshold deterministic across tests unless a test overrides it.
const ORIGINAL_THRESHOLD = process.env.LANG_MIN_CONFIDENCE;

afterEach(() => {
  if (ORIGINAL_THRESHOLD === undefined) {
    delete process.env.LANG_MIN_CONFIDENCE;
  } else {
    process.env.LANG_MIN_CONFIDENCE = ORIGINAL_THRESHOLD;
  }
});

describe('language.service.detect - contract', () => {
  test('always returns a supported language and a numeric confidence in [0,1]', () => {
    const samples = [
      'How much is delivery?',
      'Berapa harga barang ini?',
      '请问有现货吗',
      '',
      '12345',
      'ok',
    ];
    for (const s of samples) {
      const result = detect(s);
      expect(SUPPORTED).toContain(result.language);
      expect(typeof result.confidence).toBe('number');
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    }
  });

  test('is pure: same input yields the same output', () => {
    const input = 'Berapa harga penghantaran ke kawasan ini?';
    expect(detect(input)).toEqual(detect(input));
  });
});

describe('language.service.detect - clear English (Req 2.1)', () => {
  const englishInputs = [
    'How much is the delivery charge to my area?',
    'What are your operating hours today?',
    'Do you have this product in stock?',
    'Can I pay by credit card or bank transfer?',
    'I would like to return a faulty item, please help.',
  ];

  test.each(englishInputs)('detects English for: "%s"', (input) => {
    const result = detect(input);
    expect(result.language).toBe('en');
    expect(result.confidence).toBeGreaterThanOrEqual(0.5);
  });
});

describe('language.service.detect - clear Bahasa Melayu (Req 2.1)', () => {
  const malayInputs = [
    'Berapa harga penghantaran untuk kawasan ini?',
    'Adakah barang ini ada dalam stok?',
    'Boleh saya cakap dengan orang?',
    'Saya nak beli produk ini, macam mana?',
    'Bila waktu kedai buka dan tutup?',
  ];

  test.each(malayInputs)('detects Malay for: "%s"', (input) => {
    const result = detect(input);
    expect(result.language).toBe('ms');
    expect(result.confidence).toBeGreaterThanOrEqual(0.5);
  });
});

describe('language.service.detect - clear Chinese (Req 2.1)', () => {
  const chineseInputs = [
    '请问这个产品有现货吗？',
    '你们的营业时间是几点？',
    '这个多少钱',
    '我想退货，可以吗？',
    '送货到我这里要运费吗',
  ];

  test.each(chineseInputs)('detects Chinese for: "%s"', (input) => {
    const result = detect(input);
    expect(result.language).toBe('zh');
    expect(result.confidence).toBeGreaterThanOrEqual(0.5);
  });

  test('detects Chinese even with a few Latin characters mixed in (dominant script wins)', () => {
    const result = detect('你好，我想问 iPhone 有现货吗？'); // mostly Han
    expect(result.language).toBe('zh');
  });
});

describe('language.service.detect - mixed language (Req 2.3, dominant wins)', () => {
  test('Han-dominant mixed text resolves to Chinese', () => {
    const result = detect('你好 hi');
    expect(result.language).toBe('zh');
  });

  test('mixed English product name + Chinese question resolves to Chinese', () => {
    // A customer typing Chinese wants a Chinese reply, even with an English
    // product name (e.g. "Keyboard多少钱?"). Any meaningful Chinese wins.
    expect(detect('Keyboard多少钱?').language).toBe('zh');
    expect(detect('RTX 5070 多少钱').language).toBe('zh');
  });

  test('a single stray Han character in Latin text stays Latin', () => {
    // One lone Han char is treated as noise; the Latin signals decide.
    const result = detect('Price 价 for this multi item now');
    expect(result.language).toBe('en');
  });
});

describe('language.service.detect - low confidence defaults to English (Req 2.2)', () => {
  test('short ambiguous input defaults to English when threshold is high', () => {
    process.env.LANG_MIN_CONFIDENCE = '0.95';
    const result = detect('ok');
    expect(result.language).toBe('en');
    expect(result.defaulted).toBe(true);
  });

  test('a low-confidence non-English guess is overridden to English', () => {
    // Force an aggressive threshold so any sub-1.0 confidence trips the default.
    process.env.LANG_MIN_CONFIDENCE = '1.01';
    const result = detect('ada'); // single Malay-ish token, low confidence
    expect(result.language).toBe(DEFAULT_LANGUAGE);
    expect(result.defaulted).toBe(true);
  });

  test('threshold defaults to 0.5 when env var is unset or invalid', () => {
    process.env.LANG_MIN_CONFIDENCE = 'not-a-number';
    expect(language._internal.getThreshold()).toBe(0.5);
    delete process.env.LANG_MIN_CONFIDENCE;
    expect(language._internal.getThreshold()).toBe(0.5);
  });
});

describe('language.service.detect - empty and non-textual input', () => {
  test.each([
    ['empty string', ''],
    ['whitespace only', '   '],
    ['numbers only', '12345'],
    ['punctuation only', '!!!???'],
  ])('%s -> defaults to English with confidence 0', (_label, input) => {
    const result = detect(input);
    expect(result.language).toBe('en');
    expect(result.confidence).toBe(0);
    expect(result.defaulted).toBe(true);
  });

  test('non-string input is handled safely', () => {
    expect(detect(undefined).language).toBe('en');
    expect(detect(null).language).toBe('en');
    expect(detect(42).language).toBe('en');
  });
});

describe('language.service internal helpers', () => {
  test('countHanChars counts CJK characters only', () => {
    expect(language._internal.countHanChars('你好abc')).toBe(2);
    expect(language._internal.countHanChars('hello')).toBe(0);
  });

  test('countLatinChars counts Latin letters only', () => {
    expect(language._internal.countLatinChars('你好abc')).toBe(3);
    expect(language._internal.countLatinChars('12345')).toBe(0);
  });

  test('tokenize lowercases and strips non-letters', () => {
    expect(language._internal.tokenize('Hello, World! 123')).toEqual(['hello', 'world']);
  });
});
