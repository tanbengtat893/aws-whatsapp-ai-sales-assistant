'use strict';

/**
 * Express application (spec Task 7 / Task 8).
 *
 * Wires middleware and mounts routes. The server entry point (src/server.js)
 * imports this app and starts listening; keeping app creation separate makes
 * the webhook integration-testable with supertest without opening a port.
 */

require('dotenv').config();
const express = require('express');
const path = require('path');

const webhookRoutes = require('./routes/webhook.routes');
const faqRoutes = require('./routes/faq.routes');
const enquiryRoutes = require('./routes/enquiry.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();

// Parse JSON bodies (raised limit to accept base64 image uploads on /webhook/image).
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true, limit: '12mb' }));

// Static browser pages (chat + dashboard arrive in Tasks 11/12).
app.use(express.static(path.join(__dirname, '..', 'public')));

// Health check.
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Friendly landing routes.
app.get('/', (_req, res) => res.redirect('/chat.html'));
app.get('/chat', (_req, res) => res.redirect('/chat.html'));
app.get('/dashboard', (_req, res) => res.redirect('/dashboard.html'));

// Inbound enquiry webhook.
app.use('/webhook', webhookRoutes);

// FAQ management API.
app.use('/api/faqs', faqRoutes);

// Enquiries API (rep dashboard).
app.use('/api/enquiries', enquiryRoutes);

// Customer message polling: rep→customer replies for a given customer id.
// The chat page polls this so a rep's reply appears live in the thread.
app.get('/api/messages/:from', require('./controllers/enquiry.controller').getMessagesForCustomer);

// Simulated payment gateway (test payment page + gateway callback).
app.use('/pay', paymentRoutes);

// 404 for unknown API routes.
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/webhook')) {
    return res.status(404).json({ error: 'not_found' });
  }
  return next();
});

// Central error handler: log server-side, never leak internals (reliability).
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error('[app] Unhandled error:', err.message);
  res.status(500).json({ error: 'internal_error' });
});

module.exports = app;
