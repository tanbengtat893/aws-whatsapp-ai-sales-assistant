'use strict';

/**
 * Language detection service (spec Task 3).
 *
 * Pure function of its input: detect(text) -> { language, confidence }
 * where language is one of 'en' | 'ms' | 'zh'.
 *
 * Design notes
 * ------------
 * The three supported languages have very different detection profiles, so we
 * combine several signals rather than trusting one library blindly:
 *
 *   1. Script signal (Chinese)  - Han characters are unambiguous. The ratio of
 *      Han characters to total letters gives a strong, high-confidence signal
 *      for 'zh' and cleanly handles mixed en/zh text (dominant script wins).
 *
 *   2. Keyword signal (ms vs en) - Bahasa Melayu and English share the Latin
 *      script, and general-purpose detectors frequently confuse Malay with
 *      Indonesian. A curated list of common Malay function words / enquiry
 *      terms boosts 'ms' reliably for short customer messages.
 *
 *   3. Letter-frequency backstop - for longer Latin-script text where the
 *      keyword signal is weak, a small character-bigram / letter-frequency
 *      heuristic nudges the ms/en decision. Self-contained, no external
 *      dependency (kept CommonJS-friendly for Jest and simple deployment).
 *
 * Confidence is a 0..1 score. Below LANG_MIN_CONFIDENCE we default to English
 * (Req 2.2). For mixed-language text the dominant detected language wins
 * (Req 2.3).
 *
 * The module reads LANG_MIN_CONFIDENCE at call time so tests and config can
 * change it without reloading.
 */

const SUPPORTED = ['en', 'ms', 'zh'];
const DEFAULT_LANGUAGE = 'en';

/**
 * Malay letter-sequence hints that are comparatively rare in English. Used as
 * a light backstop when keyword hits are ambiguous. Not authoritative on its
 * own - it only adjusts the ms/en balance slightly.
 */
const MALAY_NGRAMS = ['ng', 'kan', 'nya', 'yang', 'lah', 'kah', 'mah'];

/**
 * Common Bahasa Melayu words and customer-enquiry terms. Deliberately words
 * that are rare in English, to avoid false positives. Used as a booster, not
 * the sole signal.
 */
const MALAY_KEYWORDS = [
  'ada', 'adakah', 'apa', 'apakah', 'berapa', 'boleh', 'dengan', 'dan',
  'saya', 'awak', 'anda', 'nak', 'hendak', 'mahu', 'tak', 'tidak', 'tak',
  'harga', 'berapakah', 'bila', 'bilakah', 'mana', 'di', 'ke', 'untuk',
  'barang', 'stok', 'penghantaran', 'bayaran', 'pembayaran', 'waktu',
  'buka', 'tutup', 'kedai', 'pesanan', 'pukal', 'borong', 'terima',
  'kasih', 'tolong', 'minta', 'macam', 'mana', 'kenapa', 'mengapa',
  'orang', 'cakap', 'jumpa', 'lagi', 'juga', 'sudah', 'belum', 'masih',
  'ini', 'itu', 'yang', 'atau', 'kepada', 'daripada', 'produk', 'ejen',
];

/**
 * A few very common English function/enquiry words. English is the default,
 * so this list mainly helps confirm English confidence on short inputs.
 */
const ENGLISH_KEYWORDS = [
  'the', 'is', 'are', 'do', 'does', 'how', 'what', 'when', 'where', 'why',
  'much', 'price', 'delivery', 'available', 'stock', 'open', 'hours',
  'payment', 'pay', 'can', 'you', 'i', 'we', 'have', 'please', 'thanks',
  'thank', 'want', 'need', 'order', 'return', 'refund', 'warranty', 'and',
  'to', 'for', 'a', 'an', 'of', 'this', 'that', 'me', 'my',
];

/** Count Han (CJK) characters in the text. */
function countHanChars(text) {
  const matches = text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g);
  return matches ? matches.length : 0;
}

/** Count Latin letters in the text. */
function countLatinChars(text) {
  const matches = text.match(/[A-Za-z]/g);
  return matches ? matches.length : 0;
}

/** Normalize to lowercase word tokens (Latin words only). */
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/** Count how many tokens appear in a keyword set. */
function countKeywordHits(tokens, keywordSet) {
  let hits = 0;
  for (const token of tokens) {
    if (keywordSet.has(token)) hits += 1;
  }
  return hits;
}

const MALAY_SET = new Set(MALAY_KEYWORDS);
const ENGLISH_SET = new Set(ENGLISH_KEYWORDS);

function getThreshold() {
  const raw = parseFloat(process.env.LANG_MIN_CONFIDENCE);
  return Number.isFinite(raw) ? raw : 0.5;
}

function clamp01(n) {
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

/**
 * Detect the language of a message.
 *
 * @param {string} text
 * @returns {{ language: 'en'|'ms'|'zh', confidence: number, defaulted?: boolean }}
 */
function detect(text) {
  const threshold = getThreshold();

  // Guard: empty / non-string / whitespace-only -> default English, low confidence.
  if (typeof text !== 'string' || text.trim().length === 0) {
    return { language: DEFAULT_LANGUAGE, confidence: 0, defaulted: true };
  }

  const trimmed = text.trim();
  const hanCount = countHanChars(trimmed);
  const latinCount = countLatinChars(trimmed);
  const scriptTotal = hanCount + latinCount;

  // --- Signal 1: Chinese by presence of Han script.
  // A customer who types Chinese wants a Chinese reply, even when they include
  // an English product name (e.g. "Keyboard多少钱?", "RTX 5070 多少钱").
  // Chinese is written compactly, so a few Han characters can be a full
  // question ("多少钱" = "how much"). We therefore treat Chinese as intended
  // when EITHER there are 2+ Han characters, OR Han makes up a meaningful
  // share (>= 20%) of the letters.
  if (hanCount > 0) {
    const hanRatio = scriptTotal > 0 ? hanCount / scriptTotal : 1;
    if (hanCount >= 2 || hanRatio >= 0.2) {
      // Confidence scales with how dominant Han script is, floored sensibly.
      const confidence = clamp01(0.7 + 0.3 * hanRatio);
      return { language: 'zh', confidence };
    }
    // A single stray Han char in otherwise-Latin text: fall through to the
    // Latin (ms/en) signals below.
  }

  // If there are no Latin letters at all but we had some Han, call it zh.
  if (latinCount === 0 && hanCount > 0) {
    return { language: 'zh', confidence: 0.7 };
  }

  // If there are no letters at all (numbers/punctuation/emoji) -> default en.
  if (scriptTotal === 0) {
    return { language: DEFAULT_LANGUAGE, confidence: 0, defaulted: true };
  }

  // --- Signal 2: Malay vs English keyword boosting (Latin script)
  const tokens = tokenize(trimmed);
  const tokenCount = tokens.length || 1;
  const msHits = countKeywordHits(tokens, MALAY_SET);
  const enHits = countKeywordHits(tokens, ENGLISH_SET);
  const msScore = msHits / tokenCount;
  const enScore = enHits / tokenCount;

  // --- Signal 3: self-contained Malay n-gram backstop over the Latin text
  const lowered = trimmed.toLowerCase();
  let ngramHits = 0;
  for (const gram of MALAY_NGRAMS) {
    if (lowered.includes(gram)) ngramHits += 1;
  }
  // Normalize to a small 0..~0.3 contribution.
  const ngramSignal = Math.min(ngramHits, 3) * 0.1;

  // Combine signals. Keyword hits are strong for short messages; the n-gram
  // backstop nudges longer text where keywords are sparse.
  let msConfidence = msScore * 1.6 + (msHits > 0 ? ngramSignal : ngramSignal * 0.5);
  let enConfidence = enScore * 1.2;

  // A small English prior: English is the house default language.
  enConfidence += 0.15;

  // Decide between ms and en (Han was not dominant here).
  if (msConfidence > enConfidence && msHits > 0) {
    const confidence = clamp01(0.5 + msConfidence / 2);
    const result = { language: 'ms', confidence };
    return applyThreshold(result, threshold);
  }

  // Default path: English.
  const confidence = clamp01(0.5 + enConfidence / 2);
  const result = { language: 'en', confidence };
  return applyThreshold(result, threshold);
}

/**
 * Apply the low-confidence rule: below threshold, default to English (Req 2.2).
 * If already English, just flag that it was low-confidence.
 */
function applyThreshold(result, threshold) {
  if (result.confidence < threshold) {
    if (result.language === DEFAULT_LANGUAGE) {
      return { ...result, defaulted: true };
    }
    return { language: DEFAULT_LANGUAGE, confidence: result.confidence, defaulted: true };
  }
  return result;
}

module.exports = {
  detect,
  SUPPORTED,
  DEFAULT_LANGUAGE,
  // exposed for testing / reuse
  _internal: {
    countHanChars,
    countLatinChars,
    tokenize,
    getThreshold,
  },
};
