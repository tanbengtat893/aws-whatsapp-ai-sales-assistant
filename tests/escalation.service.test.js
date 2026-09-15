'use strict';

/**
 * Unit tests for the escalation decision service (spec Task 5, Req 4.1, 4.2, 8.1).
 * Pure function: decide({ faqMatch, text, language }).
 */

const escalation = require('../src/services/escalation.service');
const {
  decide,
  isHumanRequested,
  acknowledgementFor,
  REASON_HUMAN_REQUESTED,
  REASON_LOW_CONFIDENCE,
} = escalation;

const confidentMatch = { matched: true, faqId: 'faq_pricing', confidence: 0.9 };
const noMatch = { matched: false, confidence: 0.2 };

describe('escalation.service.decide - contract', () => {
  test('returns escalate, reason, acknowledgement', () => {
    const r = decide({ faqMatch: confidentMatch, text: 'hello', language: 'en' });
    expect(r).toHaveProperty('escalate');
    expect(r).toHaveProperty('reason');
    expect(r).toHaveProperty('acknowledgement');
  });

  test('is pure: same input yields the same output', () => {
    const input = { faqMatch: noMatch, text: 'something odd', language: 'en' };
    expect(decide(input)).toEqual(decide(input));
  });

  test('handles missing/empty input safely (defaults to escalate, low confidence)', () => {
    const r = decide();
    expect(r.escalate).toBe(true);
    expect(r.reason).toBe(REASON_LOW_CONFIDENCE);
  });
});

describe('escalation.service.decide - no escalation (Req 3 auto-answer path)', () => {
  test('confident FAQ match without a human request does not escalate', () => {
    const r = decide({ faqMatch: confidentMatch, text: 'How much is delivery?', language: 'en' });
    expect(r.escalate).toBe(false);
    expect(r.reason).toBeNull();
    expect(r.acknowledgement).toBeNull();
  });
});

describe('escalation.service.decide - low confidence (Req 4.1)', () => {
  test('no FAQ match escalates with low_confidence', () => {
    const r = decide({ faqMatch: noMatch, text: 'a very unusual custom request', language: 'en' });
    expect(r.escalate).toBe(true);
    expect(r.reason).toBe(REASON_LOW_CONFIDENCE);
    expect(typeof r.acknowledgement).toBe('string');
    expect(r.acknowledgement.length).toBeGreaterThan(0);
  });

  test('missing faqMatch is treated as no match', () => {
    const r = decide({ text: 'hello there', language: 'en' });
    expect(r.escalate).toBe(true);
    expect(r.reason).toBe(REASON_LOW_CONFIDENCE);
  });
});

describe('escalation.service.decide - human requested (Req 4.2)', () => {
  test('English human request escalates even with a confident match', () => {
    const r = decide({
      faqMatch: confidentMatch,
      text: 'This is fine but I want to speak to a person',
      language: 'en',
    });
    expect(r.escalate).toBe(true);
    expect(r.reason).toBe(REASON_HUMAN_REQUESTED);
  });

  test('Malay human request escalates even with a confident match', () => {
    const r = decide({
      faqMatch: confidentMatch,
      text: 'boleh saya cakap dengan orang?',
      language: 'ms',
    });
    expect(r.escalate).toBe(true);
    expect(r.reason).toBe(REASON_HUMAN_REQUESTED);
  });

  test('Chinese human request escalates even with a confident match', () => {
    const r = decide({
      faqMatch: confidentMatch,
      text: '我要转人工',
      language: 'zh',
    });
    expect(r.escalate).toBe(true);
    expect(r.reason).toBe(REASON_HUMAN_REQUESTED);
  });

  test('human request takes precedence over low confidence', () => {
    const r = decide({ faqMatch: noMatch, text: 'talk to a rep', language: 'en' });
    expect(r.reason).toBe(REASON_HUMAN_REQUESTED);
  });

  test('a human request typed in another language than detected is still caught', () => {
    // Detected as en, but the customer wrote the request in Chinese.
    const r = decide({ faqMatch: confidentMatch, text: '找客服', language: 'en' });
    expect(r.escalate).toBe(true);
    expect(r.reason).toBe(REASON_HUMAN_REQUESTED);
  });
});

describe('escalation.service.decide - localized acknowledgement (Req 4.4)', () => {
  test('acknowledgement is in the detected language', () => {
    const en = decide({ faqMatch: noMatch, text: 'xyz', language: 'en' });
    const ms = decide({ faqMatch: noMatch, text: 'xyz', language: 'ms' });
    const zh = decide({ faqMatch: noMatch, text: 'xyz', language: 'zh' });
    expect(en.acknowledgement).toBe(acknowledgementFor('en'));
    expect(ms.acknowledgement).toBe(acknowledgementFor('ms'));
    expect(zh.acknowledgement).toBe(acknowledgementFor('zh'));
    // The three should differ.
    expect(new Set([en.acknowledgement, ms.acknowledgement, zh.acknowledgement]).size).toBe(3);
  });

  test('unknown language falls back to English acknowledgement', () => {
    const r = decide({ faqMatch: noMatch, text: 'xyz', language: 'fr' });
    expect(r.acknowledgement).toBe(acknowledgementFor('en'));
  });
});

describe('escalation.service.isHumanRequested', () => {
  test.each([
    ['talk to a person', 'en'],
    ['can I speak to someone', 'en'],
    ['I need a human agent', 'en'],
    ['cakap dengan orang', 'ms'],
    ['nak cakap dengan orang', 'ms'],
    ['转人工', 'zh'],
    ['真人客服', 'zh'],
  ])('detects a human request: "%s"', (text, lang) => {
    expect(isHumanRequested(text, lang)).toBe(true);
  });

  test.each([
    ['How much is the RTX 5070?', 'en'],
    ['Berapa harga barang ini?', 'ms'],
    ['请问有现货吗', 'zh'],
    ['', 'en'],
  ])('does not falsely flag: "%s"', (text, lang) => {
    expect(isHumanRequested(text, lang)).toBe(false);
  });
});
