'use strict';

/**
 * Delivery-status lookup service.
 *
 * Lets a customer self-serve their delivery status instead of calling the
 * hotline: they enter their delivery-order number (DO...), their name, or
 * their handphone number, and the assistant replies with the current status,
 * ETA, arranged delivery window, and the driver's name + contact.
 *
 * Pure core (testable):
 *   matchDeliveries(query, deliveries) -> [record]   (0, 1, or many)
 *   formatDelivery(record)             -> string     (customer-facing reply)
 *   formatNotFound(query)              -> string
 *
 * Live wrapper:
 *   lookup(query) -> { found, matches, reply }        (loads from the store)
 */

const store = require('../data/store');

/** Normalize a phone/number string to digits only for tolerant matching. */
function normPhone(p) {
  return String(p || '').replace(/\D/g, '');
}

/**
 * Does the text look like a delivery-order number?
 * Handles both the seeded format "DO202600001" and the new order-journey
 * format "DO-20260911-001" (hyphens optional).
 */
function looksLikeOrderNo(text) {
  return /\bdo[-\s]?\d{4,}(?:-\d{1,4})?\b/i.test(String(text || '').replace(/\s+/g, ' '));
}

/** Extract a normalized order number (uppercase, no spaces) or null. Keeps hyphens. */
function extractOrderNo(text) {
  const m = String(text || '').replace(/\s+/g, '').match(/DO-?\d{4,}(?:-\d{1,4})?/i);
  return m ? m[0].toUpperCase() : null;
}

/** Normalize an order number for comparison: uppercase, strip hyphens/spaces. */
function normOrderNo(s) {
  return String(s || '').toUpperCase().replace(/[-\s]/g, '');
}

/**
 * Match delivery records against a free-text query.
 *
 * Resolution order (most specific first):
 *   1. Delivery-order number (exact, case-insensitive)
 *   2. Handphone number (>= 7 digits, digit-normalized, substring either way)
 *   3. Customer name (case-insensitive substring)
 *
 * @param {string} query
 * @param {Array<object>} deliveries
 * @returns {Array<object>} matching records
 */
function matchDeliveries(query, deliveries) {
  const raw = String(query || '').trim();
  if (!raw || !Array.isArray(deliveries)) return [];

  // 1. Order number (compare hyphen-insensitively so "DO-20260911-001"
  //    matches a stored "DO-20260911-001" or the seeded "DO202600001").
  const orderNo = extractOrderNo(raw);
  if (orderNo) {
    const target = normOrderNo(orderNo);
    const byOrder = deliveries.filter(
      (d) => normOrderNo(d.orderNo || d.deliveryOrderNo || '') === target
    );
    if (byOrder.length) return byOrder;
  }

  // 2. Phone (only if the query is mostly digits and long enough to be a phone)
  const digits = normPhone(raw);
  if (digits.length >= 7) {
    const byPhone = deliveries.filter((d) => {
      const dd = d.customerPhoneDigits || normPhone(d.customerPhone);
      return dd && (dd.endsWith(digits) || digits.endsWith(dd) || dd.includes(digits));
    });
    if (byPhone.length) return byPhone;
  }

  // 3. Name (case-insensitive substring; require at least 3 chars to avoid noise)
  const nameQuery = raw.toLowerCase();
  if (nameQuery.length >= 3) {
    const byName = deliveries.filter((d) =>
      String(d.customerName || '').toLowerCase().includes(nameQuery)
    );
    if (byName.length) return byName;
  }

  return [];
}

/** A friendly one-line status descriptor with an emoji cue. */
function statusLine(status) {
  const s = String(status || '').toLowerCase();
  const icon = s.includes('delivered')
    ? '✅'
    : s.includes('delay')
    ? '⚠️'
    : s.includes('transit') || s.includes('out for')
    ? '🚚'
    : '📦';
  return `${icon} Status: ${status || 'Unknown'}`;
}

/** Build the customer-facing reply for a single delivery record. */
function formatDelivery(d) {
  const lines = [];
  lines.push(`📋 Delivery ${d.orderNo || d.deliveryOrderNo} — ${d.customerName}`);
  lines.push(statusLine(d.status));
  if (d.eta) lines.push(`🕒 Estimated arrival (ETA): ${d.eta}`);
  if (d.arrangedDeliveryTime) lines.push(`📅 Arranged delivery window: ${d.arrangedDeliveryTime}`);
  if (d.deliveryAddress) lines.push(`📍 Delivery to: ${d.deliveryAddress}`);
  if (d.driverName) {
    const phone = d.driverPhone ? ` (${d.driverPhone})` : '';
    lines.push(`🧑‍✈️ Driver: ${d.driverName}${phone}`);
  }
  const itemCount = d.itemCount || (Array.isArray(d.items) ? d.items.length : 0);
  if (itemCount) lines.push(`📦 Items: ${itemCount}`);
  if (d.totalPrice) lines.push(`💵 Order total: ${d.currency || 'SGD'} ${d.totalPrice}`);

  const s = String(d.status || '').toLowerCase();
  lines.push('');
  if (s.includes('delivered')) {
    lines.push('This order has been delivered. If you have not received it, reply "sales" and we will help.');
  } else if (s.includes('delay')) {
    lines.push('We apologise for the delay. Our driver will update you shortly. Reply "sales" if you need help.');
  } else {
    lines.push('Your driver is on schedule. You can call the driver directly using the number above.');
  }
  return lines.join('\n');
}

/** Reply when multiple records match (e.g. a common name). */
function formatMultiple(matches) {
  const lines = ['I found a few deliveries matching that. Please reply with your delivery-order number (e.g. DO202600001):'];
  matches.slice(0, 8).forEach((d, i) => {
    lines.push(`${i + 1}. ${d.orderNo || d.deliveryOrderNo} — ${d.customerName} — ${d.status}`);
  });
  return lines.join('\n');
}

/** Reply when nothing matches. */
function formatNotFound(query) {
  return (
    `Sorry, I couldn't find a delivery matching "${String(query || '').trim()}". ` +
    'Please double-check your delivery-order number (e.g. DO202600001), the name on the order, ' +
    'or the handphone number used at purchase. You can also reply "sales" to talk to our team.'
  );
}

/**
 * Live lookup: match against the deliveries collection and produce a reply.
 * @param {string} query
 * @returns {{ found: boolean, matches: Array<object>, reply: string }}
 */
function lookup(query) {
  const deliveries = store.list('deliveries');
  const matches = matchDeliveries(query, deliveries);
  if (matches.length === 0) {
    return { found: false, matches: [], reply: formatNotFound(query) };
  }
  if (matches.length === 1) {
    return { found: true, matches, reply: formatDelivery(matches[0]) };
  }
  return { found: true, matches, reply: formatMultiple(matches) };
}

module.exports = {
  matchDeliveries,
  formatDelivery,
  formatMultiple,
  formatNotFound,
  looksLikeOrderNo,
  extractOrderNo,
  normOrderNo,
  normPhone,
  lookup,
};
