'use strict';

/**
 * Escalation decision service (spec Task 5).
 *
 * Pure function of its inputs:
 *   decide({ faqMatch, text, language }) -> { escalate, reason, acknowledgement }
 *
 * Rules (design "Escalation logic", Req 4.1 / 4.2):
 *   1. human_requested - the message contains an explicit request to speak to a
 *      person (phrase lists per supported language). This escalates EVEN IF a
 *      FAQ matched confidently, because the customer asked for a human (Req 4.2).
 *   2. low_confidence  - no FAQ matched at/above the confidence threshold
 *      (faqMatch.matched === false). The safe, humane default: route to a
 *      person rather than guess (Req 4.1).
 *   Otherwise -> do not escalate (the bot auto-answers).
 *
 * When escalating, the service also returns a localized acknowledgement message
 * to send to the customer (Req 4.4), in their detected language.
 *
 * "People before technology": human requests take precedence over automation,
 * and any uncertainty routes to a person.
 */

const SUPPORTED_LANGUAGES = ['en', 'ms', 'zh'];
const DEFAULT_LANGUAGE = 'en';

const REASON_HUMAN_REQUESTED = 'human_requested';
const REASON_LOW_CONFIDENCE = 'low_confidence';

/**
 * Explicit "talk to a human" phrases per language. Lowercased; matched as
 * substrings so conjugations/word order variations are tolerated.
 */
const HUMAN_REQUEST_PHRASES = {
  en: [
    'talk to a person', 'speak to a person', 'talk to a human', 'speak to a human',
    'talk to someone', 'speak to someone', 'real person', 'real human',
    'customer service', 'customer support', 'live agent', 'human agent',
    'speak to an agent', 'talk to an agent', 'speak to a representative',
    'talk to a representative', 'speak to a rep', 'talk to a rep',
    'connect me to', 'transfer me to', 'i want a human', 'need a human',
    'can i speak to', 'can i talk to',
  ],
  ms: [
    'cakap dengan orang', 'bercakap dengan orang', 'cakap dengan manusia',
    'bercakap dengan seseorang', 'cakap dengan seseorang', 'orang sebenar',
    'manusia sebenar', 'khidmat pelanggan', 'sokongan pelanggan', 'ejen',
    'wakil', 'nak cakap dengan orang', 'saya nak jumpa orang',
    'sambungkan saya', 'boleh cakap dengan',
  ],
  zh: [
    '找人工', '真人', '人工服务', '人工客服', '转人工', '客服',
    '跟人说话', '和人说话', '真人客服', '找客服', '要人工', '接人工',
    '联系客服', '人工',
  ],
};

function lower(s) {
  return typeof s === 'string' ? s.toLowerCase() : '';
}

function normalizeLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
}

/**
 * Detect an explicit human request in the text. Checks the detected language's
 * phrases first, then all languages (a customer may type the request in a
 * different language than the bot detected for the rest of the message).
 */
function isHumanRequested(text, language) {
  const loweredText = lower(text);
  if (!loweredText) return false;

  const lang = normalizeLanguage(language);

  // Check detected language first, then the rest for robustness.
  const ordered = [lang, ...SUPPORTED_LANGUAGES.filter((l) => l !== lang)];
  for (const l of ordered) {
    const phrases = HUMAN_REQUEST_PHRASES[l] || [];
    for (const phrase of phrases) {
      if (loweredText.includes(phrase)) return true;
    }
  }
  return false;
}

/** Localized acknowledgement sent to the customer when escalating (Req 4.4). */
const ACKNOWLEDGEMENTS = {
  en: 'Yes, noted with your request. We will get our sales personnel to contact you within 10 minutes.',
  ms: 'Baik, permintaan anda telah diterima. Kami akan meminta wakil jualan kami menghubungi anda dalam masa 10 minit.',
  zh: '好的，已记录您的要求。我们会安排销售人员在10分钟内与您联系。',
};

function acknowledgementFor(language) {
  const lang = normalizeLanguage(language);
  return ACKNOWLEDGEMENTS[lang] || ACKNOWLEDGEMENTS[DEFAULT_LANGUAGE];
}

/**
 * Decide whether to escalate an enquiry.
 *
 * @param {{
 *   faqMatch?: { matched?: boolean },
 *   text?: string,
 *   language?: 'en'|'ms'|'zh'
 * }} input
 * @returns {{
 *   escalate: boolean,
 *   reason: 'human_requested' | 'low_confidence' | null,
 *   acknowledgement: string | null
 * }}
 */
function decide(input = {}) {
  const { faqMatch = {}, text = '', language = DEFAULT_LANGUAGE } = input;
  const lang = normalizeLanguage(language);

  // Rule 1: explicit human request wins, regardless of FAQ match (Req 4.2).
  if (isHumanRequested(text, lang)) {
    return {
      escalate: true,
      reason: REASON_HUMAN_REQUESTED,
      acknowledgement: acknowledgementFor(lang),
    };
  }

  // Rule 2: no confident FAQ match -> escalate (Req 4.1).
  const matched = Boolean(faqMatch && faqMatch.matched);
  if (!matched) {
    return {
      escalate: true,
      reason: REASON_LOW_CONFIDENCE,
      acknowledgement: acknowledgementFor(lang),
    };
  }

  // Otherwise: the bot auto-answers; no escalation.
  return { escalate: false, reason: null, acknowledgement: null };
}

module.exports = {
  decide,
  isHumanRequested,
  acknowledgementFor,
  SUPPORTED_LANGUAGES,
  REASON_HUMAN_REQUESTED,
  REASON_LOW_CONFIDENCE,
  _internal: {
    HUMAN_REQUEST_PHRASES,
    ACKNOWLEDGEMENTS,
    normalizeLanguage,
  },
};
