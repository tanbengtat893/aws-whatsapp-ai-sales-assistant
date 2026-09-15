'use strict';

/**
 * Payment & order service — the "conversational commerce" edge.
 *
 * Turns a confirmed quotation into an end-to-end digital sales journey:
 *   quotation (Q-...) -> customer picks a payment method -> a SIMULATED payment
 *   link/QR -> the (mock) gateway calls back "paid" -> we create the order
 *   (ORD-...), invoice (INV-...) and a delivery order (DO-...), then send the
 *   WhatsApp confirmation. The delivery order is written in the SAME shape the
 *   Delivery Status lookup (menu option 7) already understands, so the journey
 *   closes the loop: enquiry -> sales -> payment -> delivery tracking.
 *
 * Design principle (consistent with the rest of the app): swappable edges.
 * PAYMENT_MODE=simulated (default) never touches a real gateway or any secret;
 * PAYMENT_MODE=live would swap in a real provider (Stripe/HitPay/PayNow) behind
 * the same interface with no change to the sales/order/delivery logic.
 *
 * Honesty guardrails (people-before-technology, "no wrong info to customer"):
 *   - Nothing is marked paid on the customer's say-so; only the gateway
 *     callback (simulated here) confirms payment.
 *   - Order/invoice/delivery records are created only AFTER payment confirms.
 *   - Amounts always come from the stored quotation, never re-typed.
 */

const store = require('../data/store');

// --- Config -------------------------------------------------------------

const PAYMENT_MODE = process.env.PAYMENT_MODE || 'simulated';
// Public base URL for the (test) payment page. Falls back to the deployed IP.
const PUBLIC_BASE_URL =
  process.env.PUBLIC_BASE_URL || 'http://52.77.234.193:3000';
const DEFAULT_CURRENCY = 'SGD';

// Supported (simulated) payment methods.
const PAYMENT_METHODS = [
  { id: 'card', emoji: '💳', label: 'Pay by Card' },
  { id: 'paynow', emoji: '🏦', label: 'PayNow / SGQR' },
];

// A tiny placeholder driver roster for the demo delivery order.
const DRIVERS = [
  { driverName: 'John Tan', driverPhone: '+65 9000 2001' },
  { driverName: 'Siti Rahman', driverPhone: '+65 9000 2002' },
  { driverName: 'Ravi Kumar', driverPhone: '+65 9000 2003' },
];

// --- Reference numbers --------------------------------------------------

/** Today's date as YYYYMMDD (server local time). */
function dateStamp(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

/**
 * Next daily sequence number for a given prefix, shared across orders so the
 * same customer journey can carry matching numbers, e.g.
 *   Q-20260911-001 / ORD-20260911-001 / INV-20260911-001 / DO-20260911-001
 *
 * We derive the sequence from how many ORDERS already exist for today, so all
 * four references for one order share the same running number. Quotations are
 * numbered independently (they may not all become orders).
 */
function nextSequence(collection, now = new Date()) {
  const stamp = dateStamp(now);
  const records = store.list(collection) || [];
  const todays = records.filter((r) => String(r.seqDate || '') === stamp);
  return { stamp, seq: todays.length + 1 };
}

/** Format a reference like "Q-20260911-001". */
function formatRef(prefix, stamp, seq) {
  return `${prefix}-${stamp}-${String(seq).padStart(3, '0')}`;
}

/** Generate a fresh quotation reference (does not persist anything). */
function newQuoteRef(now = new Date()) {
  const { stamp, seq } = nextSequence('orders', now);
  return { ref: formatRef('Q', stamp, seq), stamp, seq };
}

// --- Payment record + link ---------------------------------------------

/**
 * Create a pending payment record for a confirmed quote and return it plus the
 * (test) payment link the customer opens to "pay".
 *
 * @param {object} args
 *   from        customer id
 *   method      'card' | 'paynow'
 *   productId   the quoted product id
 *   productName the quoted product name
 *   quantity    number
 *   unitPrice   number
 *   amount      number (line total the customer confirmed)
 *   currency    e.g. 'SGD'
 *   quoteRef    the quotation reference (Q-...)
 *   lang        'en'|'ms'|'zh'
 * @returns {{ payment: object, payUrl: string }}
 */
function createPayment(args, now = new Date()) {
  const method = PAYMENT_METHODS.some((m) => m.id === args.method) ? args.method : 'card';
  const { stamp, seq } = nextSequence('payments', now);
  const payment = store.create(
    'payments',
    {
      seqDate: stamp,
      seq,
      from: args.from,
      method,
      status: 'pending', // pending -> paid (only via gateway callback)
      mode: PAYMENT_MODE,
      productId: args.productId || null,
      productName: args.productName || null,
      quantity: args.quantity || 1,
      unitPrice: Number(args.unitPrice) || 0,
      amount: Number(args.amount) || 0,
      currency: args.currency || DEFAULT_CURRENCY,
      quoteRef: args.quoteRef || null,
      lang: args.lang || 'en',
      createdAt: now.toISOString(),
      paidAt: null,
    },
    'pay'
  );
  const payUrl = `${PUBLIC_BASE_URL}/pay/${payment.id}`;
  return { payment, payUrl };
}

// --- Order / invoice / delivery creation (post-payment) -----------------

/** Pick a deterministic-ish driver from the roster. */
function pickDriver(seq) {
  return DRIVERS[(seq - 1) % DRIVERS.length];
}

/** A same-day delivery window a few hours out (demo ETA). */
function deliveryWindow(now = new Date()) {
  const start = new Date(now.getTime() + 3 * 60 * 60 * 1000); // +3h
  const end = new Date(now.getTime() + 5 * 60 * 60 * 1000); // +5h
  const hh = (d) => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  const dateStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
  return {
    etaText: `Today, ${hh(start)}–${hh(end)}`,
    etaIso: `${dateStr} ${hh(start)}`,
    windowText: `${dateStr} ${hh(start)}–${hh(end)}`,
  };
}

/**
 * Settle a pending payment: mark it paid and create the matching order,
 * invoice and delivery-order records. Idempotent — if the payment is already
 * paid, the existing linked records are returned rather than duplicated.
 *
 * @param {string} paymentId
 * @param {object} [opts]  { customerName, deliveryAddress, customerPhone }
 * @returns {null | { payment, order, invoice, delivery }}
 */
function settlePayment(paymentId, opts = {}, now = new Date()) {
  const payment = store.get('payments', paymentId);
  if (!payment) return null;

  // Idempotency: already settled -> return the linked records.
  if (payment.status === 'paid' && payment.orderId) {
    return {
      payment,
      order: store.get('orders', payment.orderId),
      invoice: payment.invoiceId ? store.get('invoices', payment.invoiceId) : null,
      delivery: payment.deliveryId ? store.get('deliveries', payment.deliveryId) : null,
    };
  }

  const { stamp, seq } = nextSequence('orders', now);
  const orderRef = formatRef('ORD', stamp, seq);
  const invoiceRef = formatRef('INV', stamp, seq);
  const deliveryRef = formatRef('DO', stamp, seq);
  const driver = pickDriver(seq);
  const win = deliveryWindow(now);

  const customerName = opts.customerName || 'WhatsApp Customer';
  const customerPhone = opts.customerPhone || String(payment.from || '');
  const deliveryAddress = opts.deliveryAddress || 'To be confirmed with customer';

  // 1. Order.
  const order = store.create(
    'orders',
    {
      seqDate: stamp,
      seq,
      orderRef,
      from: payment.from,
      status: 'Preparing Order',
      productId: payment.productId,
      productName: payment.productName,
      quantity: payment.quantity,
      unitPrice: payment.unitPrice,
      amount: payment.amount,
      currency: payment.currency,
      quoteRef: payment.quoteRef,
      paymentId: payment.id,
      invoiceRef,
      deliveryRef,
      createdAt: now.toISOString(),
    },
    'ord'
  );

  // 2. Invoice.
  const invoice = store.create(
    'invoices',
    {
      seqDate: stamp,
      seq,
      invoiceRef,
      orderRef,
      from: payment.from,
      productName: payment.productName,
      quantity: payment.quantity,
      unitPrice: payment.unitPrice,
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
      status: 'Paid',
      issuedAt: now.toISOString(),
    },
    'inv'
  );

  // 3. Delivery order — SAME shape the Delivery Status lookup understands, so
  //    the customer can immediately track it via menu option 7.
  const delivery = store.create(
    'deliveries',
    {
      orderNo: deliveryRef,
      deliveryOrderNo: deliveryRef,
      seqDate: stamp,
      seq,
      customerName,
      customerPhone,
      customerPhoneDigits: String(customerPhone).replace(/\D/g, ''),
      deliveryAddress,
      deliveryDate: win.etaIso.slice(0, 10),
      arrangedDeliveryTime: win.windowText,
      eta: win.etaIso,
      status: 'Preparing Order',
      driverName: driver.driverName,
      driverPhone: driver.driverPhone,
      itemCount: payment.quantity,
      items: [
        {
          description: payment.productName,
          unitPrice: payment.unitPrice,
          quantity: payment.quantity,
        },
      ],
      totalPrice: payment.amount,
      currency: payment.currency,
      orderRef,
      from: payment.from,
    },
    'del'
  );

  // Link everything back onto the payment and mark it paid.
  const paid = store.update('payments', payment.id, {
    status: 'paid',
    paidAt: now.toISOString(),
    orderId: order.id,
    invoiceId: invoice.id,
    deliveryId: delivery.id,
    orderRef,
    invoiceRef,
    deliveryRef,
  });

  return { payment: paid, order, invoice, delivery };
}

module.exports = {
  PAYMENT_MODE,
  PUBLIC_BASE_URL,
  PAYMENT_METHODS,
  DEFAULT_CURRENCY,
  dateStamp,
  nextSequence,
  formatRef,
  newQuoteRef,
  createPayment,
  settlePayment,
  deliveryWindow,
  pickDriver,
};
