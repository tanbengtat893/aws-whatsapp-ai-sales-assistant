'use strict';

/**
 * Simulated WhatsApp sender (spec Task 6.1, Req 7.1).
 *
 * Implements the sender interface without any external API calls. It records
 * every outbound message in memory and returns it, so:
 *   - the webhook can echo the bot's reply in its HTTP response (Req 8.2)
 *   - the browser chat page can read the conversation (Req 8.3)
 *
 * Interface:
 *   send(to, message) -> Promise<{ delivered, channel, to, message, id, sentAt }>
 *
 * The recorded log is exposed for the dashboard/tests via getSent()/clear().
 */

const crypto = require('crypto');

const CHANNEL = 'simulated';

// In-memory outbound log. Kept module-scoped so the simulated channel behaves
// like a single conversation store for the demo.
const sentMessages = [];

function generateId() {
  return `sim_${Date.now().toString(36)}${crypto.randomBytes(3).toString('hex')}`;
}

/**
 * "Send" a message by recording it. Never throws for normal input; validation
 * failures resolve to a not-delivered result so one bad send cannot crash the
 * pipeline (Non-Functional: reliability).
 *
 * @param {string} to - recipient identifier (phone/sender id)
 * @param {string} message - message body
 * @returns {Promise<{delivered:boolean, channel:string, to:string, message:string, id:string, sentAt:string, error?:string}>}
 */
async function send(to, message) {
  const sentAt = new Date().toISOString();

  if (typeof to !== 'string' || to.trim() === '') {
    return { delivered: false, channel: CHANNEL, to, message, id: null, sentAt, error: 'missing_recipient' };
  }
  if (typeof message !== 'string' || message.trim() === '') {
    return { delivered: false, channel: CHANNEL, to, message, id: null, sentAt, error: 'empty_message' };
  }

  const record = {
    id: generateId(),
    to,
    message,
    channel: CHANNEL,
    sentAt,
    delivered: true,
  };
  sentMessages.push(record);
  return record;
}

/** Return recorded outbound messages, optionally filtered by recipient. */
function getSent(to) {
  if (typeof to === 'string' && to.length > 0) {
    return sentMessages.filter((m) => m.to === to);
  }
  return [...sentMessages];
}

/** Clear the outbound log (used by tests and demo resets). */
function clear() {
  sentMessages.length = 0;
}

module.exports = {
  channel: CHANNEL,
  send,
  getSent,
  clear,
};
