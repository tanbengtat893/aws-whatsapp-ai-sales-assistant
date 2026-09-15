'use strict';

/**
 * Guided sales flow: numbered selection -> quantity -> confirm -> quotation
 * -> sales handoff with an office-hours-aware callback promise.
 *
 * The customer journey (from a product shortlist, e.g. after "RAM price"):
 *   1. Assistant shows a numbered list (1..5) of items with prices.
 *   2. Customer replies with a number -> assistant asks "How many?".
 *   3. Customer replies a quantity -> assistant sends a QUOTATION + "reply confirm".
 *   4. Customer replies "confirm" -> lead routed to the sales team; the customer
 *      gets a callback promise based on operating hours (8am-8pm same day,
 *      otherwise next day at 8am).
 *
 * Conversation state is reconstructed from the customer's recent enquiries
 * (their stored `shortlist`, `pendingSelection`, `pendingQuote`) rather than a
 * separate session store, matching how delivery-status state is handled.
 *
 * Pure, testable helpers here; the controller wires them to the store/sender.
 */

const OPEN_HOUR = 8; // 8am
const CLOSE_HOUR = 20; // 8pm (exclusive)

/**
 * Is the given time within operating hours (08:00-19:59)?
 * @param {Date} [now]
 */
function isWithinOfficeHours(now = new Date()) {
  const h = now.getHours();
  return h >= OPEN_HOUR && h < CLOSE_HOUR;
}

/**
 * Callback promise line based on operating hours.
 * - within hours: a rep will call shortly (today)
 * - after hours:  a rep will call the next day at 8am
 * @param {Date} [now]
 */
function callbackPromise(now = new Date()) {
  if (isWithinOfficeHours(now)) {
    return 'Our sales team is online now (operating hours 8:00am-8:00pm) and a sales representative will contact you shortly.';
  }
  return (
    "We're currently outside operating hours (8:00am-8:00pm). Your request has been logged, " +
    'and a sales representative will call you the next day from 8:00am. ' +
    'You already have your quotation above, so you can review it while you wait.'
  );
}

/** Is this text just a bare number 1..max (a shortlist selection)? */
function parseSelectionNumber(text, max) {
  const t = String(text || '').trim();
  const m = t.match(/^(?:option\s*|#\s*|no\.?\s*)?(\d{1,2})\b\.?$/i);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  if (n >= 1 && n <= max) return n;
  return null;
}

/** Parse a quantity from a reply like "2", "2 sets", "qty 3", "x4". Default null. */
function parseQuantityReply(text) {
  const t = String(text || '').toLowerCase().trim();
  let m =
    t.match(/\b(\d+)\s*(?:set|sets|pc|pcs|piece|pieces|unit|units|nos?)\b/) ||
    t.match(/\b(?:qty|quantity)\s*[:=]?\s*(\d+)\b/) ||
    t.match(/\bx\s*(\d+)\b/) ||
    t.match(/^(\d{1,3})$/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

/** Does the message read as a confirmation to proceed? */
function isConfirm(text) {
  const t = String(text || '').toLowerCase().trim();
  return /\b(confirm|confirmed|proceed|yes\s*please|go\s*ahead|place\s*order|okay\s*confirm|ok\s*confirm)\b/.test(t) ||
    t === 'yes' || t === 'ok' || t === 'okay';
}

/**
 * Build a numbered shortlist reply (1..N) from product records, and return the
 * shortlist ids so the caller can store them for the follow-up selection.
 *
 * @param {string} label   e.g. "RAM"
 * @param {Array<object>} products  the matched products (already ranked/limited)
 * @returns {{ reply: string, shortlist: Array<{id,name,price,currency}> }}
 */
function buildNumberedShortlist(label, products) {
  const items = products.slice(0, 5);
  const shortlist = items.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    currency: p.currency || 'SGD',
    priceNote: p.priceNote || null,
  }));
  const lines = [`Here are our top ${shortlist.length} ${label} options:`];
  shortlist.forEach((it, i) => {
    const priceStr = `${it.currency} ${it.price}${it.priceNote === 'from' ? ' (from)' : ''}`;
    lines.push(`${i + 1}. ${it.name} — ${priceStr}`);
  });
  lines.push('');
  lines.push('Reply with the number (1-' + shortlist.length + ') of the item you want, and I\'ll prepare a quotation.');
  return { reply: lines.join('\n'), shortlist };
}

/**
 * Fuzzy-match the customer's free text against a shortlist by token overlap,
 * so they can type the item name loosely (not exact) to pick it. Returns the
 * best-matching shortlist item, or null if nothing is a confident match.
 *
 * @param {string} text
 * @param {Array<{id,name,price,currency,priceNote}>} shortlist
 */
function matchShortlistByName(text, shortlist) {
  const tokens = String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2);
  if (!tokens.length || !Array.isArray(shortlist) || !shortlist.length) return null;

  // Ignore filler words so "I want the logitech k380 please" focuses on "logitech k380".
  const stop = new Set(['the', 'this', 'that', 'want', 'like', 'get', 'buy', 'give', 'please', 'pls', 'one', 'set', 'sets', 'pc', 'pcs', 'unit', 'units', 'prefer', 'take', 'and', 'for', 'with']);
  const qTokens = tokens.filter((w) => !stop.has(w));
  if (!qTokens.length) return null;

  let best = null;
  for (const it of shortlist) {
    const nameTokens = new Set(
      String(it.name || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
    );
    let hits = 0;
    for (const w of qTokens) if (nameTokens.has(w)) hits += 1;
    if (hits > 0 && (!best || hits > best.hits)) best = { item: it, hits };
  }
  // Require at least one strong token hit to avoid a random pick.
  return best && best.hits >= 1 ? best.item : null;
}

/** Ask for quantity after a selection (localized). */
function askQuantity(item, lang) {
  // eslint-disable-next-line global-require
  const i18n = require('./i18n.service');
  const priceStr = `${item.price}${item.priceNote === 'from' ? ' (from)' : ''}`;
  return i18n.t(lang || 'en', 'selected_ask_qty', {
    name: item.name,
    cur: item.currency || 'SGD',
    price: priceStr,
  });
}

/**
 * Build the quotation for a selected item + quantity, ready for confirmation.
 * @param {object} item  { name, price, currency, priceNote }
 * @param {number} qty
 * @param {string} ref
 */
function buildQuotation(item, qty, ref, lang) {
  // eslint-disable-next-line global-require
  const i18n = require('./i18n.service');
  const lng = lang || 'en';
  const cur = item.currency || 'SGD';
  const unit = Number(item.price) || 0;
  const unitStr = `${unit}${item.priceNote === 'from' ? ' (from)' : ''}`;
  const lineTotal = Math.round(unit * qty * 100) / 100;
  const lines = [];
  lines.push(i18n.t(lng, 'quotation_title'));
  if (ref) lines.push(`Ref: ${ref}`);
  lines.push('');
  lines.push(i18n.t(lng, 'quo_item', { name: item.name }));
  lines.push(i18n.t(lng, 'quo_unit', { cur, price: unitStr }));
  lines.push(i18n.t(lng, 'quo_qty', { qty }));
  // Live stock line: show units available when known.
  const stockQty = Number(item.quantity);
  const stocked = item.stockStatus === 'in_stock' || item.stockStatus === 'low_stock';
  if (stocked && Number.isFinite(stockQty) && stockQty > 0) {
    lines.push(i18n.t(lng, 'quo_stock', { qty: stockQty }));
  }
  lines.push(i18n.t(lng, 'quo_subtotal', { cur, total: lineTotal }));
  lines.push('');
  lines.push(i18n.t(lng, 'quo_delivery_note', { cur }));
  lines.push('');
  lines.push(i18n.t(lng, 'quo_confirm_cta'));
  return lines.join('\n');
}

/**
 * Build the final confirmation + sales-handoff message (office-hours aware).
 * @param {object} item
 * @param {number} qty
 * @param {string} ref
 * @param {Date} [now]
 */
function buildConfirmationHandoff(item, qty, ref, now = new Date()) {
  const cur = item.currency || 'SGD';
  const lineTotal = Math.round((Number(item.price) || 0) * qty * 100) / 100;
  const lines = [];
  lines.push('✅ Order request confirmed and sent to our sales team.');
  if (ref) lines.push(`Ref: ${ref}`);
  lines.push('');
  lines.push(`Item: ${item.name}`);
  lines.push(`Quantity: ${qty}`);
  lines.push(`Estimated total: ${cur} ${lineTotal}`);
  lines.push('');
  lines.push(callbackPromise(now));
  return lines.join('\n');
}

module.exports = {
  OPEN_HOUR,
  CLOSE_HOUR,
  isWithinOfficeHours,
  callbackPromise,
  parseSelectionNumber,
  parseQuantityReply,
  matchShortlistByName,
  isConfirm,
  buildNumberedShortlist,
  askQuantity,
  buildQuotation,
  buildConfirmationHandoff,
};
