'use strict';

/**
 * FAQ matching service (spec Task 4).
 *
 * Pure at its core: match(text, language, faqs) -> {
 *   matched, faqId, intent, answer, confidence, fallbackLanguageUsed, language
 * }
 *
 * v1 strategy (design "FAQ matching"):
 *   - Keyword/intent matching per language using each FAQ's `keywords`.
 *   - Confidence is normalized 0..1 from how strongly the enquiry hits a FAQ's
 *     keyword set, with the detected language weighted highest and other
 *     languages contributing a smaller cross-language signal (so a Malay
 *     enquiry can still match an FAQ whose English keywords happen to appear).
 *   - The matched FAQ answer is returned in the detected language; if that
 *     language has no answer, fall back to English and flag it (Req 3.3).
 *
 * The `match()` signature is intentionally stable so a smarter matcher
 * (embedding/LLM) can replace the v1 body later without changing callers.
 *
 * Purity: callers pass in the `faqs` array. For convenience a thin `matchLive`
 * helper loads FAQs from the store, but the tested core takes explicit input.
 */

const SUPPORTED_LANGUAGES = ['en', 'ms', 'zh'];
const DEFAULT_LANGUAGE = 'en';

function getThreshold() {
  const raw = parseFloat(process.env.FAQ_MIN_CONFIDENCE);
  return Number.isFinite(raw) ? raw : 0.6;
}

function clamp01(n) {
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

/** Lowercase a string safely. */
function lower(s) {
  return typeof s === 'string' ? s.toLowerCase() : '';
}

/**
 * Count how many keywords from `keywords` appear in the (lowercased) text.
 * Latin keywords are matched as whole-ish substrings; CJK keywords (which have
 * no word boundaries) are matched as plain substrings.
 */
function countKeywordHits(loweredText, keywords) {
  if (!Array.isArray(keywords) || keywords.length === 0) {
    return { hits: 0, total: 0 };
  }
  let hits = 0;
  for (const kw of keywords) {
    const k = lower(kw).trim();
    if (!k) continue;
    if (loweredText.includes(k)) {
      hits += 1;
    }
  }
  return { hits, total: keywords.length };
}

/**
 * Score a single FAQ against the enquiry text for a given detected language.
 * Returns a normalized 0..1 confidence.
 *
 * Scoring model:
 *   - detected-language keyword hits are the primary signal (weight 1.0)
 *   - other-language keyword hits contribute a smaller cross-language signal
 *     (weight 0.4), which helps mixed-language or loanword enquiries
 *   - the score saturates: a couple of solid keyword hits already yields a
 *     confident match, matching how short enquiries behave in practice.
 */
function scoreFaq(loweredText, faq, language) {
  const keywordsByLang = faq.keywords || {};
  const primaryLang = SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;

  const primary = countKeywordHits(loweredText, keywordsByLang[primaryLang]);

  // Cross-language signal from the other supported languages.
  let crossHits = 0;
  for (const lang of SUPPORTED_LANGUAGES) {
    if (lang === primaryLang) continue;
    crossHits += countKeywordHits(loweredText, keywordsByLang[lang]).hits;
  }

  // Weighted hit count. Each primary hit is worth 1.0, each cross hit 0.4.
  const weighted = primary.hits * 1.0 + crossHits * 0.4;

  // Saturating normalization with a smooth diminishing-returns curve:
  //   1 - e^(-k*weighted)
  // With k = 1.0: one solid keyword hit -> ~0.63 (clears the 0.6 threshold),
  // two hits -> ~0.86, three -> ~0.95. This matches how short customer
  // enquiries behave: a single clear keyword is already a confident match.
  const k = 1.0;
  const confidence = weighted > 0 ? clamp01(1 - Math.exp(-k * weighted)) : 0;

  return { confidence, primaryHits: primary.hits, crossHits };
}

/**
 * Resolve which answer to return for a matched FAQ given the detected language.
 * Applies English fallback (Req 3.3).
 */
function resolveAnswer(faq, language) {
  const answers = faq.answers || {};
  const lang = SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;

  if (answers[lang]) {
    return { answer: answers[lang], language: lang, fallbackLanguageUsed: false };
  }
  // Fall back to English and flag it.
  if (answers[DEFAULT_LANGUAGE]) {
    return {
      answer: answers[DEFAULT_LANGUAGE],
      language: DEFAULT_LANGUAGE,
      fallbackLanguageUsed: true,
    };
  }
  // No usable answer at all (should not happen: English is required by Req 6.3).
  return { answer: null, language: lang, fallbackLanguageUsed: false };
}

/**
 * Match enquiry text to the best FAQ.
 *
 * @param {string} text - the enquiry text (already sanitized upstream)
 * @param {'en'|'ms'|'zh'} language - detected language
 * @param {Array} faqs - list of FAQ records to match against
 * @returns {{
 *   matched: boolean,
 *   faqId: string|null,
 *   intent: string|null,
 *   answer: string|null,
 *   confidence: number,
 *   fallbackLanguageUsed: boolean,
 *   language: string
 * }}
 */
function match(text, language, faqs) {
  const threshold = getThreshold();
  const noMatch = {
    matched: false,
    faqId: null,
    intent: null,
    answer: null,
    confidence: 0,
    fallbackLanguageUsed: false,
    language: SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE,
  };

  if (typeof text !== 'string' || text.trim().length === 0) {
    return noMatch;
  }
  if (!Array.isArray(faqs) || faqs.length === 0) {
    return noMatch;
  }

  const loweredText = lower(text);

  // Find the best-scoring FAQ.
  let best = null;
  for (const faq of faqs) {
    const { confidence } = scoreFaq(loweredText, faq, language);
    if (!best || confidence > best.confidence) {
      best = { faq, confidence };
    }
  }

  if (!best || best.confidence < threshold) {
    // Return the best confidence we saw (for observability) but not matched.
    return { ...noMatch, confidence: best ? best.confidence : 0 };
  }

  const { answer, language: answerLang, fallbackLanguageUsed } = resolveAnswer(
    best.faq,
    language
  );

  // If the FAQ has no usable answer, treat as not matched (safe fallback).
  if (answer == null) {
    return { ...noMatch, confidence: best.confidence };
  }

  return {
    matched: true,
    faqId: best.faq.id,
    intent: best.faq.intent || null,
    answer,
    confidence: best.confidence,
    fallbackLanguageUsed,
    language: answerLang,
  };
}

/**
 * Convenience wrapper that loads FAQs from the store, then matches.
 * Kept separate so the core `match` stays pure and easily testable.
 */
function matchLive(text, language) {
  // Lazy require to avoid a hard dependency in unit tests of `match`.
  // eslint-disable-next-line global-require
  const store = require('../data/store');
  const faqs = store.list('faqs');
  return match(text, language, faqs);
}

module.exports = {
  match,
  matchLive,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  _internal: {
    scoreFaq,
    resolveAnswer,
    countKeywordHits,
    getThreshold,
  },
};
