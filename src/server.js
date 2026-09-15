'use strict';

/**
 * Server entry point (spec Task 8).
 *
 * Imports the Express app and starts listening on PORT. Kept separate from
 * app.js so the app can be integration-tested with supertest without opening
 * a port. Run with `npm start`.
 */

require('dotenv').config();
const app = require('./app');
const store = require('./data/store');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const WHATSAPP_MODE = process.env.WHATSAPP_MODE || 'simulated';

// Ensure the data store and seed data exist before accepting traffic.
store.ensureStore();

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`WhatsApp Sales Assistant listening on http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`  WhatsApp mode: ${WHATSAPP_MODE}`);
  // eslint-disable-next-line no-console
  console.log(`  Webhook:   POST http://localhost:${PORT}/webhook`);
  // eslint-disable-next-line no-console
  console.log(`  Health:    GET  http://localhost:${PORT}/health`);
});

// Graceful shutdown.
function shutdown(signal) {
  // eslint-disable-next-line no-console
  console.log(`\n${signal} received, shutting down...`);
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log('Server closed.');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

module.exports = server;
