'use strict';

/**
 * Data store abstraction (spec Task 2.1).
 *
 * A small, dependency-light JSON-file backend hidden behind a stable interface.
 * The rest of the app only depends on the exported functions, so the backend
 * (JSON now, SQLite/managed DB later) can be swapped without touching business
 * logic (design: "swappable edges").
 *
 * Collections: enquiries, faqs, escalations.
 * Operations per collection: create / get / list / update.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const COLLECTIONS = ['enquiries', 'faqs', 'escalations', 'products', 'deliveries', 'orders', 'invoices', 'payments', 'bookings', 'warranty'];

// Collections that seed from a JSON file on first run.
const SEEDED_COLLECTIONS = {
  faqs: path.join(__dirname, 'seed', 'faqs.json'),
  products: path.join(__dirname, 'seed', 'products.json'),
  deliveries: path.join(__dirname, 'seed', 'deliveries.json'),
  warranty: path.join(__dirname, 'seed', 'warranty.json'),
};

// Resolve the data directory from env (default ./data), relative to project root.
const DATA_DIR = path.resolve(
  process.env.DATA_DIR || path.join(__dirname, '..', '..', 'data')
);

/** Build the on-disk path for a collection file. */
function fileFor(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

/** Ensure the data directory and each collection file exist. */
function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  for (const collection of COLLECTIONS) {
    const file = fileFor(collection);
    if (!fs.existsSync(file)) {
      const seeded = SEEDED_COLLECTIONS[collection]
        ? loadSeed(collection)
        : [];
      writeAll(collection, seeded);
    }
  }
}

/** Load seed data for a seeded collection; otherwise start empty. */
function loadSeed(collection) {
  const seedPath = SEEDED_COLLECTIONS[collection];
  if (!seedPath) return [];
  try {
    if (fs.existsSync(seedPath)) {
      const raw = fs.readFileSync(seedPath, 'utf8');
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (err) {
    // A malformed seed file should not crash the store; log and start empty.
    // eslint-disable-next-line no-console
    console.error(`[store] Failed to load seed for ${collection}:`, err.message);
  }
  return [];
}

/** Read all records for a collection. Returns [] if the file is missing/corrupt. */
function readAll(collection) {
  assertCollection(collection);
  const file = fileFor(collection);
  try {
    if (!fs.existsSync(file)) return [];
    const raw = fs.readFileSync(file, 'utf8');
    if (!raw.trim()) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[store] Failed to read ${collection}:`, err.message);
    return [];
  }
}

/** Persist the full set of records for a collection. */
function writeAll(collection, records) {
  assertCollection(collection);
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const file = fileFor(collection);
  fs.writeFileSync(file, JSON.stringify(records, null, 2), 'utf8');
  return records;
}

function assertCollection(collection) {
  if (!COLLECTIONS.includes(collection)) {
    throw new Error(`Unknown collection: ${collection}`);
  }
}

/** Generate a short, unique, sortable-ish id. */
function generateId(prefix) {
  const stamp = Date.now().toString(36);
  const rand = crypto.randomBytes(4).toString('hex');
  return `${prefix}_${stamp}${rand}`;
}

/**
 * Create a record in a collection.
 * If the record has no `id`, one is generated using the given prefix.
 */
function create(collection, record, idPrefix = collection.slice(0, 3)) {
  const records = readAll(collection);
  const toStore = { ...record };
  if (!toStore.id) {
    toStore.id = generateId(idPrefix);
  }
  records.push(toStore);
  writeAll(collection, records);
  return toStore;
}

/** Get a single record by id, or null if not found. */
function get(collection, id) {
  const records = readAll(collection);
  return records.find((r) => r.id === id) || null;
}

/**
 * List records in a collection.
 * Optional `filter` is a predicate function; optional `sort` is a comparator.
 */
function list(collection, { filter, sort } = {}) {
  let records = readAll(collection);
  if (typeof filter === 'function') {
    records = records.filter(filter);
  }
  if (typeof sort === 'function') {
    records = [...records].sort(sort);
  }
  return records;
}

/**
 * Update a record by id with a shallow merge of `changes`.
 * Returns the updated record, or null if the id was not found.
 */
function update(collection, id, changes) {
  const records = readAll(collection);
  const index = records.findIndex((r) => r.id === id);
  if (index === -1) return null;
  const updated = { ...records[index], ...changes, id };
  records[index] = updated;
  writeAll(collection, records);
  return updated;
}

/**
 * Reset a collection to a known state. Primarily for tests.
 * Passing no records clears the collection.
 */
function reset(collection, records = []) {
  return writeAll(collection, records);
}

/** Reseed a seeded collection from its seed file (overwrites current data). */
function reseed(collection) {
  return writeAll(collection, loadSeed(collection));
}

/** Reseed FAQs from the seed file. Kept for backward compatibility. */
function reseedFaqs() {
  return reseed('faqs');
}

/** Reseed products from the seed file. */
function reseedProducts() {
  return reseed('products');
}

// Initialize on load so callers can use the store immediately.
ensureStore();

module.exports = {
  COLLECTIONS,
  DATA_DIR,
  ensureStore,
  create,
  get,
  list,
  update,
  reset,
  reseed,
  reseedFaqs,
  reseedProducts,
  generateId,
  // exposed for advanced/test use
  _readAll: readAll,
  _writeAll: writeAll,
};
