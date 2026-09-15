'use strict';

/**
 * WhatsApp sender factory (spec Task 6, Req 7).
 *
 * Selects the outbound channel by WHATSAPP_MODE:
 *   - "simulated" (default) -> simulated.sender  (no external calls; Req 7.1)
 *   - "cloud"               -> cloud.sender       (real API; phase 2, Req 7.2)
 *
 * Both implementations share the same interface:
 *   send(to, message) -> Promise<{ delivered, channel, ... }>
 *
 * The enquiry pipeline depends only on this factory, so changing the mode
 * requires no changes to the language/FAQ/escalation logic (Req 7.3).
 *
 * Mode is read at call time so tests and config can switch without reloading.
 */

const simulatedSender = require('./simulated.sender');
const cloudSender = require('./cloud.sender');

const DEFAULT_MODE = 'simulated';

/** Resolve the configured mode, defaulting to simulated. */
function getMode() {
  const mode = (process.env.WHATSAPP_MODE || DEFAULT_MODE).toLowerCase();
  return mode === 'cloud' ? 'cloud' : DEFAULT_MODE;
}

/** Return the active sender implementation for the current mode. */
function getSender() {
  return getMode() === 'cloud' ? cloudSender : simulatedSender;
}

/**
 * Send a message via the active channel.
 * @param {string} to
 * @param {string} message
 * @returns {Promise<object>}
 */
function send(to, message) {
  return getSender().send(to, message);
}

module.exports = {
  send,
  getSender,
  getMode,
  DEFAULT_MODE,
  // direct access for callers/tests that need a specific channel
  simulated: simulatedSender,
  cloud: cloudSender,
};
