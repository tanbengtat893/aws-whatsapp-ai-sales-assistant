'use strict';

/**
 * Appends the additional-components pricelist to src/data/seed/products.json.
 *
 * - Maps the pasted categories to the app's category keys (adds CPU + peripherals).
 * - Parses prices that may carry "S$", commas, or a range "370–420"/"370-420"
 *   (for a range we take the LOWER bound, the honest "from" price).
 * - Keeps the file's quantity (20). Skips exact duplicate names already present.
 * - New ids use the prefix prod_add_<ItemNo> to avoid clashing with prod_cat_*.
 *
 * Usage: node scripts/add_components.js "<path-to-csv>"
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH =
  process.argv[2] || path.join(__dirname, '..', '..', 'additional_components_2026.csv');
const OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'seed', 'products.json');

// Source category -> app category. Peripherals (keyboard/mouse/mousepad) and
// webcams/sound cards are new component types the search now understands.
const CATEGORY_MAP = {
  'Graphics Cards': 'gpu',
  Storage: 'ssd', // refined to storage_hdd below when the name says HDD
  'PC Cases': 'case',
  Keyboard: 'keyboard',
  Mouse: 'mouse',
  Mousepad: 'mousepad',
  'Routers / WiFi': 'router',
  'Sound Cards': 'sound_card',
  'Cameras / Webcams': 'webcam',
  'Switches / Adapters': 'switch', // switches + network adapters
  Memory: 'ram',
  NAS: 'nas',
  Cooling: 'cooler',
  'LCD Monitors': 'monitor',
  'Mini PCs': 'mini_pc',
  'Power Supplies': 'psu',
  CPU: 'cpu',
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 1; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c === '\r') { /* skip */ }
    else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

/**
 * Parse a price that may be "S$156.78", "1139", "1,139", or a range
 * "370–420" / "370-420" (en-dash or hyphen). Returns { price, isRange }.
 */
function parsePrice(raw) {
  let s = String(raw || '').replace(/S\$|SGD|\$/gi, '').replace(/,/g, '').trim();
  const rangeMatch = s.match(/^(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)$/);
  if (rangeMatch) {
    return { price: parseFloat(rangeMatch[1]), isRange: true };
  }
  const n = parseFloat(s);
  return { price: Number.isFinite(n) ? n : NaN, isRange: false };
}

function refineStorage(category, name) {
  if (category !== 'ssd') return category;
  return /\b(hdd|hard\s*disk|hard\s*drive)\b/i.test(name) ? 'storage_hdd' : 'ssd';
}

function main() {
  const text = fs.readFileSync(CSV_PATH, 'utf8').replace(/^\uFEFF/, '');
  const rows = parseCsv(text);
  const header = rows[0].map((h) => h.trim());
  const idx = {
    no: header.indexOf('Item No.'),
    category: header.indexOf('Category'),
    brand: header.indexOf('Brand'),
    model: header.indexOf('Model'),
    spec: header.indexOf('Key Specification'),
    qty: header.indexOf('Quantity'),
    price: header.indexOf('Singapore Price (SGD)'),
  };

  const existing = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'));
  const existingNames = new Set(existing.map((p) => String(p.name).toLowerCase()));
  const existingIds = new Set(existing.map((p) => p.id));

  const added = [];
  const skipped = [];
  const unmapped = new Set();

  for (let r = 1; r < rows.length; r += 1) {
    const c = rows[r];
    if (!c || c.length < 6) continue;
    const no = (c[idx.no] || '').trim();
    if (!no) continue;

    const srcCat = (c[idx.category] || '').trim();
    let category = CATEGORY_MAP[srcCat];
    if (!category) { unmapped.add(srcCat); category = 'other'; }

    const brand = (c[idx.brand] || '').trim();
    let model = (c[idx.model] || '').trim();
    const spec = (c[idx.spec] || '').trim();
    const qty = parseInt(c[idx.qty], 10) || 20;
    const { price, isRange } = parsePrice(c[idx.price]);
    if (!Number.isFinite(price) || price <= 0) { skipped.push({ no, reason: 'bad_price', model }); continue; }

    // Build a clean, human name. Prefix the brand if the model doesn't already
    // start with it, and append the key spec (capacity/variant) when it adds
    // distinguishing info (e.g. "990 PRO 2TB NVMe").
    let name = model;
    if (brand && !name.toLowerCase().startsWith(brand.toLowerCase())) {
      name = `${brand} ${name}`;
    }
    if (spec && !name.toLowerCase().includes(spec.toLowerCase()) && spec.length <= 40) {
      // Only append short, meaningful specs (skip long ones already implied).
      name = `${name} (${spec})`;
    }

    category = refineStorage(category, `${name} ${spec}`);

    let id = 'prod_add_' + no;
    while (existingIds.has(id)) id += 'x';
    existingIds.add(id);

    // Skip exact duplicate names to avoid confusing repeats.
    if (existingNames.has(name.toLowerCase())) { skipped.push({ no, reason: 'dup_name', model: name }); continue; }
    existingNames.add(name.toLowerCase());

    const product = {
      id,
      name,
      category,
      brand: brand || 'Generic',
      price: Math.round(price * 100) / 100,
      currency: 'SGD',
      stockStatus: 'in_stock',
      quantity: qty,
    };
    // For CPU price ranges, note it so a quote can say "from".
    if (isRange) product.priceNote = 'from';
    added.push(product);
  }

  const merged = existing.concat(added);
  fs.writeFileSync(OUT_PATH, JSON.stringify(merged, null, 2) + '\n', 'utf8');

  console.log(`Existing products: ${existing.length}`);
  console.log(`Added: ${added.length}`);
  console.log(`Skipped: ${skipped.length}`);
  console.log(`Total now: ${merged.length}`);
  const byCat = {};
  added.forEach((p) => { byCat[p.category] = (byCat[p.category] || 0) + 1; });
  console.log('Added per-category:');
  Object.entries(byCat).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${String(v).padStart(3)}  ${k}`));
  if (unmapped.size) console.log('Unmapped (->other):', [...unmapped].join(', '));
  if (skipped.length) console.log('Skipped:', JSON.stringify(skipped.slice(0, 10)));
  // Sample CPUs.
  console.log('\nSample CPUs added:');
  added.filter((p) => p.category === 'cpu').slice(0, 5).forEach((p) => console.log(`  ${p.name} — SGD ${p.price}${p.priceNote === 'from' ? ' (from)' : ''}`));
}

main();
