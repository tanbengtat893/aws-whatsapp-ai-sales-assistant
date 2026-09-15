'use strict';

/**
 * Booking service — online appointment booking for repair services.
 *
 * Upgrades menu option 4 (Onsite Repair) and option 3 (Carry-in Service) from
 * simple slot-fill acknowledgements into structured BOOKINGS that produce a
 * confirmed booking number and a stored record the service team can act on.
 *
 * Two flows, both driven by numbered choices so they work in plain WhatsApp
 * text (reply "1", "2", ...):
 *
 *   Onsite (OS-YYYYMMDD-NNN):
 *     service type -> date -> time slot -> details (name/address/phone/problem)
 *     -> CONFIRMED, "our technician will contact you before the appointment."
 *
 *   Carry-in (CI-YYYYMMDD-NNN):
 *     date -> device -> problem -> "Awaiting Drop-Off" at the service centre.
 *
 * Pure and testable: option lists, date/slot generation, reference formatting
 * and confirmation building are all plain functions. The controller wires the
 * conversation state (which step we're on) and persists the booking.
 */

const store = require('../data/store');

const ONSITE_FEE = 60;
const CARRY_IN_FEE = 30;

// Onsite service types (numbered).
const ONSITE_SERVICES = [
  { id: 1, key: 'troubleshooting', emoji: '🖥️', en: 'Onsite Troubleshooting', ms: 'Penyelesaian Masalah di Lokasi', zh: '上门故障排查' },
  { id: 2, key: 'hardware_repair', emoji: '🔧', en: 'Hardware Repair', ms: 'Pembaikan Perkakasan', zh: '硬件维修' },
  { id: 3, key: 'setup_install', emoji: '🛠️', en: 'PC Setup & Installation', ms: 'Pemasangan & Persediaan PC', zh: '电脑安装与设置' },
];

// Carry-in device types (numbered).
const CARRY_IN_DEVICES = [
  { id: 1, key: 'laptop', emoji: '💻', en: 'Laptop', ms: 'Komputer Riba', zh: '笔记本电脑' },
  { id: 2, key: 'desktop', emoji: '🖥️', en: 'Desktop', ms: 'Komputer Meja', zh: '台式电脑' },
  { id: 3, key: 'printer', emoji: '🖨️', en: 'Printer', ms: 'Pencetak', zh: '打印机' },
  { id: 4, key: 'other', emoji: '📱', en: 'Other', ms: 'Lain-lain', zh: '其他' },
];

// Appointment time slots (numbered), shared by both flows.
const TIME_SLOTS = [
  { id: 1, label: '9:00–11:00 AM' },
  { id: 2, label: '11:00 AM–1:00 PM' },
  { id: 3, label: '2:00–4:00 PM' },
  { id: 4, label: '4:00–6:00 PM' },
];

// --- Dates ---------------------------------------------------------------

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * The next N calendar days from `now` (default 3), each as a numbered option.
 * @returns {Array<{ id, iso, label }>} e.g. { id:1, iso:'2026-09-12', label:'12 Sep (Sat)' }
 */
function availableDates(now = new Date(), count = 3) {
  const out = [];
  for (let i = 1; i <= count; i += 1) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const label = `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} (${DAY_NAMES[d.getDay()]})`;
    out.push({ id: i, iso, label });
  }
  return out;
}

// --- Reference numbers ---------------------------------------------------

function dateStamp(now = new Date()) {
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
}

/** Next daily sequence number for bookings of a given prefix (OS / CI). */
function nextSequence(prefix, now = new Date()) {
  const stamp = dateStamp(now);
  const bookings = store.list('bookings') || [];
  const todays = bookings.filter((b) => String(b.seqDate || '') === stamp && String(b.ref || '').startsWith(prefix + '-'));
  return { stamp, seq: todays.length + 1 };
}

/** Format a booking reference, e.g. "OS-20260912-001". */
function formatRef(prefix, stamp, seq) {
  return `${prefix}-${stamp}-${String(seq).padStart(3, '0')}`;
}

// --- Lookups -------------------------------------------------------------

function serviceById(id) {
  return ONSITE_SERVICES.find((s) => s.id === Number(id)) || null;
}
function deviceById(id) {
  return CARRY_IN_DEVICES.find((d) => d.id === Number(id)) || null;
}
function slotById(id) {
  return TIME_SLOTS.find((s) => s.id === Number(id)) || null;
}

/** Localized label for a service/device option. */
function label(option, lang) {
  const lng = lang || 'en';
  return option[lng] || option.en;
}

/** Parse a bare numbered choice "1".."max" (tolerates "option 2", "#3"). */
function parseChoice(text, max) {
  const m = String(text || '').trim().match(/^(?:option\s*|#\s*|no\.?\s*)?(\d{1,2})\b\.?$/i);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return n >= 1 && n <= max ? n : null;
}

// --- Creation ------------------------------------------------------------

/**
 * Persist an onsite booking and return the stored record.
 * @param {object} data { from, serviceKey, serviceLabel, dateIso, dateLabel,
 *                        slotLabel, customerName, address, phone, problem, lang }
 */
function createOnsiteBooking(data, now = new Date()) {
  const { stamp, seq } = nextSequence('OS', now);
  const ref = formatRef('OS', stamp, seq);
  return store.create(
    'bookings',
    {
      ref,
      type: 'onsite',
      seqDate: stamp,
      seq,
      from: data.from,
      serviceKey: data.serviceKey || null,
      serviceLabel: data.serviceLabel || null,
      dateIso: data.dateIso || null,
      dateLabel: data.dateLabel || null,
      slotLabel: data.slotLabel || null,
      customerName: data.customerName || null,
      address: data.address || null,
      phone: data.phone || null,
      problem: data.problem || null,
      fee: ONSITE_FEE,
      status: 'CONFIRMED',
      lang: data.lang || 'en',
      createdAt: now.toISOString(),
    },
    'bkg'
  );
}

/**
 * Persist a carry-in booking and return the stored record.
 * @param {object} data { from, deviceKey, deviceLabel, dateIso, dateLabel,
 *                        slotLabel, problem, lang }
 */
function createCarryInBooking(data, now = new Date()) {
  const { stamp, seq } = nextSequence('CI', now);
  const ref = formatRef('CI', stamp, seq);
  return store.create(
    'bookings',
    {
      ref,
      type: 'carry_in',
      seqDate: stamp,
      seq,
      from: data.from,
      deviceKey: data.deviceKey || null,
      deviceLabel: data.deviceLabel || null,
      dateIso: data.dateIso || null,
      dateLabel: data.dateLabel || null,
      slotLabel: data.slotLabel || null,
      problem: data.problem || null,
      fee: CARRY_IN_FEE,
      status: 'Awaiting Drop-Off',
      lang: data.lang || 'en',
      createdAt: now.toISOString(),
    },
    'bkg'
  );
}

module.exports = {
  ONSITE_FEE,
  CARRY_IN_FEE,
  ONSITE_SERVICES,
  CARRY_IN_DEVICES,
  TIME_SLOTS,
  availableDates,
  dateStamp,
  nextSequence,
  formatRef,
  serviceById,
  deviceById,
  slotById,
  label,
  parseChoice,
  createOnsiteBooking,
  createCarryInBooking,
};
