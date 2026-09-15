'use strict';

/**
 * Warranty lookup service.
 *
 * Lets a customer self-check the warranty on a product they bought, by entering
 * their serial number, invoice number, mobile, or name. The assistant replies
 * with the product, purchase date, warranty status, expiry and coverage, then
 * offers to book onsite service, arrange a carry-in repair, or talk to the
 * service team.
 *
 * Pure core (testable):
 *   normalizeSerial(s)                 -> canonical serial for tolerant matching
 *   looksLikeSerial(text)              -> boolean (SG26-... pattern)
 *   looksLikeInvoice(text)             -> boolean (INV-... pattern)
 *   matchWarranty(query, records)      -> [record]  (serial > invoice > phone > name)
 *   formatWarranty(record, lang)       -> string    (customer-facing reply)
 *   formatNotFound(query, lang)        -> string
 *
 * Live wrapper:
 *   lookup(query) -> { found, matches, reply }   (loads from the store)
 *
 * Design guardrails (people-before-technology / "no wrong info"):
 *   - Reads the actual stored fields (status, end date, coverage) so the reply
 *     stays correct if Expired/Void records are added later.
 *   - Only returns a record to a query that matches it; never lists everyone.
 *   - Serial matching normalizes case/spaces/repeated dashes so quirky formats
 *     like "SG26-TP--0015-..." still match a customer's "sg26-tp-0015-...".
 */

const store = require('../data/store');

/** Digits-only for tolerant phone matching. */
function normPhone(p) {
  return String(p || '').replace(/\D/g, '');
}

/** Canonical serial: uppercase, no spaces, collapse repeated dashes. */
function normalizeSerial(s) {
  return String(s || '')
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Does the text contain a serial number? e.g. SG26-ASU-0003-22173 */
function looksLikeSerial(text) {
  return /\bSG\d{2}-[A-Z-]{1,5}-\d{3,4}-\d{3,6}\b/i.test(String(text || '').replace(/\s+/g, ' '));
}

/** Extract a normalized serial from free text, or null. */
function extractSerial(text) {
  const m = String(text || '').toUpperCase().replace(/\s+/g, '').match(/SG\d{2}-[A-Z-]+-\d{3,4}-\d{3,6}/);
  return m ? normalizeSerial(m[0]) : null;
}

/** Does the text contain an invoice number? e.g. INV-26003 */
function looksLikeInvoice(text) {
  return /\bINV-?\d{3,}\b/i.test(String(text || '').replace(/\s+/g, ' '));
}

/** Extract a normalized invoice number (uppercase, no spaces), or null. */
function extractInvoice(text) {
  const m = String(text || '').toUpperCase().replace(/\s+/g, '').match(/INV-?\d{3,}/);
  return m ? m[0].replace(/^INV-?/, 'INV-') : null;
}

/**
 * Match warranty records against a free-text query.
 * Resolution order (most specific first): serial -> invoice -> phone -> name.
 */
function matchWarranty(query, records) {
  const raw = String(query || '').trim();
  if (!raw || !Array.isArray(records)) return [];

  // 1. Serial number (normalized, hyphen/space tolerant).
  const serial = extractSerial(raw);
  if (serial) {
    const bySerial = records.filter((r) => normalizeSerial(r.serial) === serial);
    if (bySerial.length) return bySerial;
  }

  // 2. Invoice number.
  const invoice = extractInvoice(raw);
  if (invoice) {
    const byInvoice = records.filter((r) => String(r.invoice || '').toUpperCase() === invoice);
    if (byInvoice.length) return byInvoice;
  }

  // 3. Phone (query mostly digits, >= 7 digits).
  const digits = normPhone(raw);
  if (digits.length >= 7) {
    const byPhone = records.filter((r) => {
      const dd = r.mobileDigits || normPhone(r.mobile);
      return dd && (dd.endsWith(digits) || digits.endsWith(dd) || dd.includes(digits));
    });
    if (byPhone.length) return byPhone;
  }

  // 4. Name (case-insensitive substring; >= 3 chars).
  const nameQuery = raw.toLowerCase();
  if (nameQuery.length >= 3) {
    const byName = records.filter((r) => String(r.customerName || '').toLowerCase().includes(nameQuery));
    if (byName.length) return byName;
  }

  return [];
}

/** Status emoji cue. */
function statusIcon(status) {
  const s = String(status || '').toLowerCase();
  if (s.includes('active')) return '✅';
  if (s.includes('expire') || s.includes('void')) return '⚠️';
  return 'ℹ️';
}

/**
 * Build the customer-facing warranty reply for a single record (localized).
 * Product model, serial, brand and dates stay in English; the framing text and
 * the option prompts are localized.
 */
function formatWarranty(record, lang) {
  // eslint-disable-next-line global-require
  const i18n = require('./i18n.service');
  const lng = lang || 'en';
  const icon = statusIcon(record.warrantyStatus);
  return i18n.t(lng, 'warranty_found', {
    name: record.customerName,
    product: `${record.brand} ${record.model}`,
    serial: record.serial,
    coverage: record.coverageLabel || record.coverage || '-',
    statusIcon: icon,
    status: record.warrantyStatus,
    end: record.warrantyEndDate,
  });
}

/** Reply when multiple records match (e.g. a common name): ask for the serial. */
function formatMultiple(matches, lang) {
  // eslint-disable-next-line global-require
  const i18n = require('./i18n.service');
  const lng = lang || 'en';
  const lines = [i18n.t(lng, 'warranty_multiple')];
  matches.slice(0, 8).forEach((r, i) => {
    lines.push(`${i + 1}. ${r.brand} ${r.model} — ${r.serial}`);
  });
  return lines.join('\n');
}

/** Reply when nothing matches. */
function formatNotFound(query, lang) {
  // eslint-disable-next-line global-require
  const i18n = require('./i18n.service');
  return i18n.t(lang || 'en', 'warranty_not_found', { query: String(query || '').trim() });
}

/**
 * Live lookup: match against the warranty collection and produce a reply.
 * @returns {{ found, matches, reply, record }}
 */
function lookup(query, lang) {
  const records = store.list('warranty');
  const matches = matchWarranty(query, records);
  if (matches.length === 0) {
    return { found: false, matches: [], reply: formatNotFound(query, lang), record: null };
  }
  if (matches.length === 1) {
    return { found: true, matches, reply: formatWarranty(matches[0], lang), record: matches[0] };
  }
  return { found: true, matches, reply: formatMultiple(matches, lang), record: null };
}

module.exports = {
  normalizeSerial,
  normPhone,
  looksLikeSerial,
  extractSerial,
  looksLikeInvoice,
  extractInvoice,
  matchWarranty,
  formatWarranty,
  formatMultiple,
  formatNotFound,
  lookup,
};
