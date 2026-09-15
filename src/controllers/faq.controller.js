'use strict';

/**
 * FAQ management controller (spec Task 9, Req 6).
 *
 * Endpoints (mounted at /api/faqs):
 *   GET    /            list FAQs
 *   POST   /            create a FAQ (English answer required, Req 6.1/6.3)
 *   PUT    /:id         edit a FAQ's answers/keywords (Req 6.2)
 *
 * The store persists changes so subsequent enquiries use the updated content.
 */

const store = require('../data/store');

const SUPPORTED_LANGUAGES = ['en', 'ms', 'zh'];

/** Keep only supported-language keys from an object of string arrays/strings. */
function pickLanguages(obj, { arrays } = {}) {
  const out = {};
  if (!obj || typeof obj !== 'object') return out;
  for (const lang of SUPPORTED_LANGUAGES) {
    if (obj[lang] == null) continue;
    if (arrays) {
      out[lang] = Array.isArray(obj[lang]) ? obj[lang].map(String) : [];
    } else if (typeof obj[lang] === 'string' && obj[lang].trim() !== '') {
      out[lang] = obj[lang];
    }
  }
  return out;
}

/** GET /api/faqs */
function listFaqs(_req, res) {
  const faqs = store.list('faqs', {
    sort: (a, b) => String(a.intent).localeCompare(String(b.intent)),
  });
  return res.status(200).json({ faqs });
}

/**
 * POST /api/faqs
 * Requires `intent` and an English answer (Req 6.1, 6.3).
 */
function createFaq(req, res) {
  const { intent, keywords, answers } = req.body || {};

  if (typeof intent !== 'string' || intent.trim() === '') {
    return res.status(400).json({ error: 'invalid_faq', message: 'intent is required' });
  }

  const cleanedAnswers = pickLanguages(answers);
  if (!cleanedAnswers.en) {
    return res
      .status(400)
      .json({ error: 'invalid_faq', message: 'an English (en) answer is required' });
  }

  const faq = store.create(
    'faqs',
    {
      intent: intent.trim(),
      keywords: pickLanguages(keywords, { arrays: true }),
      answers: cleanedAnswers,
      updatedAt: new Date().toISOString(),
    },
    'faq'
  );

  return res.status(201).json({ faq });
}

/**
 * PUT /api/faqs/:id
 * Merges provided answers/keywords/intent and refreshes updatedAt (Req 6.2).
 * If updating answers, the English answer must remain present.
 */
function updateFaq(req, res) {
  const { id } = req.params;
  const existing = store.get('faqs', id);
  if (!existing) {
    return res.status(404).json({ error: 'not_found', message: `FAQ ${id} not found` });
  }

  const { intent, keywords, answers } = req.body || {};
  const changes = { updatedAt: new Date().toISOString() };

  if (typeof intent === 'string' && intent.trim() !== '') {
    changes.intent = intent.trim();
  }

  if (answers && typeof answers === 'object') {
    // Explicitly attempting to blank the English answer is rejected: a FAQ must
    // always retain an English answer (Req 6.3).
    if (
      Object.prototype.hasOwnProperty.call(answers, 'en') &&
      (typeof answers.en !== 'string' || answers.en.trim() === '')
    ) {
      return res
        .status(400)
        .json({ error: 'invalid_faq', message: 'an English (en) answer is required' });
    }
    const mergedAnswers = { ...existing.answers, ...pickLanguages(answers) };
    if (!mergedAnswers.en) {
      return res
        .status(400)
        .json({ error: 'invalid_faq', message: 'an English (en) answer is required' });
    }
    changes.answers = mergedAnswers;
  }

  if (keywords && typeof keywords === 'object') {
    changes.keywords = { ...existing.keywords, ...pickLanguages(keywords, { arrays: true }) };
  }

  const updated = store.update('faqs', id, changes);
  return res.status(200).json({ faq: updated });
}

module.exports = {
  listFaqs,
  createFaq,
  updateFaq,
  SUPPORTED_LANGUAGES,
};
