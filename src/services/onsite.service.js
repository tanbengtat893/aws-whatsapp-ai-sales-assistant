'use strict';

/**
 * Onsite repair slot-filling flow.
 *
 * Collects three pieces of information, one step at a time, before routing the
 * request to the service team:
 *   1. address (home/office)
 *   2. issue encountered
 *   3. preferred date/time
 *
 * The flow can be entered two ways:
 *   - the customer picks menu option 4 (Onsite Repair), then replies with
 *     details; or
 *   - the customer types an ADDRESS directly (forgetting to pick the option) -
 *     we recognise it as an address, start the flow, and guide them through the
 *     remaining steps.
 *
 * Conversation state (which slots are filled) is stored on the enquiry as
 * `onsite` and reconstructed from the previous message, matching the rest of
 * the pipeline.
 */

const ONSITE_FEE = 60;

/**
 * Heuristic: does this text look like a Singapore address?
 * Signals: a 6-digit postal code, "Singapore 6xxxxx", a unit number "#nn-nn",
 * "blk/block", or a street-type word (street/road/ave/avenue/lane/drive/cres...).
 */
function looksLikeAddress(text) {
  const t = String(text || '').toLowerCase();
  if (!t) return false;
  const hasPostal = /\b\d{6}\b/.test(t) || /singapore\s*\d{6}/.test(t) || /\bs\d{6}\b/.test(t);
  const hasUnit = /#\s*\d+\s*-\s*\d+/.test(t);
  const hasBlk = /\b(blk|block)\s*\d+/.test(t);
  const hasStreetType =
    /\b(street|st|road|rd|avenue|ave|lane|ln|drive|dr|crescent|cres|close|walk|way|boulevard|blvd|terrace|park|place|pl|jalan|lorong|lor|bukit|tampines|jurong|bedok|hougang|yishun|woodlands|sengkang|punggol|clementi|serangoon|toa payoh|ang mo kio|geylang|kallang|queenstown|bishan)\b/.test(t);
  // Require at least a postal code, OR a unit/block, OR a street-type word with
  // some digits (a house/block number) to avoid matching plain product text.
  if (hasPostal || hasUnit || hasBlk) return true;
  if (hasStreetType && /\d/.test(t)) return true;
  return false;
}

/** The step-by-step prompts (localized). */
function promptForIssue(lang) {
  // eslint-disable-next-line global-require
  return require('./i18n.service').t(lang || 'en', 'onsite_ask_issue');
}

function promptForDateTime(lang) {
  // eslint-disable-next-line global-require
  return require('./i18n.service').t(lang || 'en', 'onsite_ask_datetime');
}

function promptForAddress(lang) {
  // eslint-disable-next-line global-require
  return require('./i18n.service').t(lang || 'en', 'onsite_ask_address');
}

/**
 * Build the final confirmation once all three slots are filled (localized).
 * @param {{address, issue, datetime}} data
 * @param {string} [lang]
 */
function buildOnsiteConfirmation(data, lang) {
  // eslint-disable-next-line global-require
  return require('./i18n.service').t(lang || 'en', 'onsite_complete', {
    address: data.address,
    issue: data.issue,
    datetime: data.datetime,
  });
}

module.exports = {
  ONSITE_FEE,
  looksLikeAddress,
  promptForIssue,
  promptForDateTime,
  promptForAddress,
  buildOnsiteConfirmation,
};
