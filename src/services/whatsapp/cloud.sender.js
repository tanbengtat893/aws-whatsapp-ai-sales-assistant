'use strict';

/**
 * WhatsApp Business Cloud API sender - phase 2 stub (spec Task 6.2, Req 7.2/7.3).
 *
 * This establishes the seam for the real integration without requiring Meta
 * API approval yet. It implements the same sender interface as the simulated
 * sender, so the enquiry pipeline (language/FAQ/escalation) needs no changes
 * when switching WHATSAPP_MODE from `simulated` to `cloud` (Req 7.3).
 *
 * Until real credentials and the Meta Graph API call are wired in, send()
 * rejects with a clear "not configured" error so misconfiguration is obvious.
 *
 * Interface:
 *   send(to, message) -> Promise<{ delivered, channel }>   (once implemented)
 */

const CHANNEL = 'cloud';

class WhatsAppCloudNotConfiguredError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WhatsAppCloudNotConfiguredError';
    this.code = 'WHATSAPP_CLOUD_NOT_CONFIGURED';
  }
}

/**
 * Phase-2 implementation target:
 *   - read WHATSAPP_TOKEN and WHATSAPP_PHONE_NUMBER_ID from env
 *   - POST to https://graph.facebook.com/<ver>/<phone_number_id>/messages
 *   - map the API response to { delivered, channel }
 *
 * For now it throws so the seam exists but cannot silently no-op.
 */
async function send(_to, _message) {
  throw new WhatsAppCloudNotConfiguredError(
    'WhatsApp Cloud API sender is not configured yet. ' +
      'Set WHATSAPP_MODE=simulated for the demo, or implement cloud.sender with valid Meta credentials.'
  );
}

module.exports = {
  channel: CHANNEL,
  send,
  WhatsAppCloudNotConfiguredError,
};
