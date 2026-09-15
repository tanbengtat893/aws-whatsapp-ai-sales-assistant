'use strict';

/**
 * Payment routes — the SIMULATED payment gateway edge.
 *
 *   GET  /pay/:id          -> the test payment page (renders amount + method)
 *   GET  /pay/:id/info     -> JSON details for the page to render
 *   POST /pay/:id/complete -> the (mock) gateway callback: marks the payment
 *                             paid, creates order + invoice + delivery, and
 *                             sends the WhatsApp confirmation to the customer.
 *
 * No real gateway, no secrets, no real charge. Swapping PAYMENT_MODE=live would
 * replace this with a real provider's redirect + webhook, with no change to the
 * order/invoice/delivery logic in payment.service.
 */

const express = require('express');
const path = require('path');
const store = require('../data/store');
const payment = require('../services/payment.service');
const sender = require('../services/whatsapp/sender');
const i18n = require('../services/i18n.service');

const router = express.Router();

/** Serve the test payment page. */
router.get('/:id', (req, res) => {
  const rec = store.get('payments', req.params.id);
  if (!rec) return res.status(404).send('Payment not found.');
  return res.sendFile(path.join(__dirname, '..', '..', 'public', 'pay.html'));
});

/** JSON details so the page can show the amount, method and current status. */
router.get('/:id/info', (req, res) => {
  const rec = store.get('payments', req.params.id);
  if (!rec) return res.status(404).json({ error: 'not_found' });
  const method = payment.PAYMENT_METHODS.find((m) => m.id === rec.method) || payment.PAYMENT_METHODS[0];
  return res.json({
    id: rec.id,
    status: rec.status,
    method: rec.method,
    methodLabel: method.label,
    amount: rec.amount,
    currency: rec.currency,
    quoteRef: rec.quoteRef,
    productName: rec.productName,
    quantity: rec.quantity,
    orderRef: rec.orderRef || null,
    invoiceRef: rec.invoiceRef || null,
    deliveryRef: rec.deliveryRef || null,
  });
});

/**
 * Simulated gateway callback: complete the payment.
 * Marks paid, creates order/invoice/delivery, sends the WhatsApp confirmation.
 */
router.post('/:id/complete', async (req, res) => {
  const rec = store.get('payments', req.params.id);
  if (!rec) return res.status(404).json({ error: 'not_found' });

  // Optional customer details the page may collect (name/address/phone).
  const opts = {
    customerName: (req.body && req.body.customerName) || undefined,
    deliveryAddress: (req.body && req.body.deliveryAddress) || undefined,
    customerPhone: (req.body && req.body.customerPhone) || undefined,
  };

  const settled = payment.settlePayment(rec.id, opts);
  if (!settled) return res.status(500).json({ error: 'settle_failed' });

  const { payment: paid, order, invoice, delivery } = settled;

  // Send the WhatsApp confirmation (Step 8) in the customer's language.
  const lang = paid.lang || 'en';
  const confirmation = i18n.t(lang, 'pay_received', {
    orderRef: order.orderRef,
    invoiceRef: invoice.invoiceRef,
    productName: paid.productName || order.productName,
    qty: paid.quantity,
    cur: paid.currency,
    amount: paid.amount,
    deliveryRef: delivery.deliveryOrderNo,
    driverName: delivery.driverName,
    driverPhone: delivery.driverPhone,
    eta: delivery.arrangedDeliveryTime || delivery.eta,
  });

  // Record the confirmation as an outbound enquiry-style message so it appears
  // in the customer's chat thread (simulated sender records it in-store).
  try {
    store.create(
      'enquiries',
      {
        from: paid.from,
        text: `[payment ${paid.id} completed]`,
        status: 'auto_answered',
        menuRoute: 'payment_confirmed',
        reply: confirmation,
        receivedAt: new Date().toISOString(),
      },
      'enq'
    );
  } catch (e) {
    // Non-fatal: the confirmation is still returned + sent below.
  }
  await sender.send(paid.from, confirmation);

  return res.json({
    ok: true,
    status: 'paid',
    orderRef: order.orderRef,
    invoiceRef: invoice.invoiceRef,
    deliveryRef: delivery.deliveryOrderNo,
    amount: paid.amount,
    currency: paid.currency,
    confirmation,
  });
});

module.exports = router;
