'use strict';

/**
 * One-off converter: Dynacore CSV -> src/data/seed/products.json
 *
 * - Maps source categories to the app's category system.
 * - Sets quantity 100 and stockStatus in_stock for every item (per request).
 * - Parses "$1,234.00" prices safely.
 * - EXCLUDES rows with a price below MIN_PRICE (corrupted/mis-parsed rows where
 *   description text bled into the wrong column) so customers never get a wrong
 *   $2-$4 quote. Excluded SKUs are printed for review.
 * - Generates stable ids from the SKU; dedupes by name.
 *
 * Usage: node scripts/convert_catalog.js "<path-to-csv>"
 */

const fs = require('fs');
const path = require('path');

const MIN_PRICE = 5; // below this = corrupted row, skip

const CSV_PATH =
  process.argv[2] ||
  path.join(__dirname, '..', '..', 'Dynacore_528_Item_Catalog (1).csv');
const OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'seed', 'products.json');

// Source category -> app category.
const CATEGORY_MAP = {
  'Graphics Cards': 'gpu',
  Storage: 'ssd', // refined to storage_hdd below if the name says HDD
  'PC Cases': 'case',
  Peripherals: 'peripheral',
  'Networking - Routers/WiFi': 'networking',
  'Networking - Switches/Adapters': 'networking',
  Memory: 'ram',
  'Cameras/Webcams': 'ip_camera',
  NAS: 'nas',
  Monitors: 'monitor',
  Cooling: 'cooler',
  'Mini PCs': 'mini_pc',
  'Power Supplies': 'psu',
  'Other Computer/IT': 'other',
};

/** Minimal CSV parser handling quoted fields with commas. */
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

function parsePrice(raw) {
  const n = parseFloat(String(raw).replace(/[$,"\s]/g, ''));
  return Number.isFinite(n) ? n : NaN;
}

function refineStorage(category, name) {
  if (category !== 'ssd') return category;
  return /\b(hdd|hard\s*disk|hard\s*drive)\b/i.test(name) ? 'storage_hdd' : 'ssd';
}

function idFromSku(sku) {
  return 'prod_' + String(sku).toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

const PACKAGES_PATH =
  process.argv[3] ||
  path.join(__dirname, '..', '..', 'Dynacore_PC_Packages_August_and_ASUS_NUC_Promotion (1).csv');

/**
 * Convert the PC packages CSV into pc_bundle products. Each row is a complete
 * build with a total price and component breakdown, ideal for budget-based
 * selection ("gaming PC under $1500").
 */
function loadPackages() {
  if (!fs.existsSync(PACKAGES_PATH)) return [];
  const rows = parseCsv(fs.readFileSync(PACKAGES_PATH, 'utf8'));
  const header = rows[0].map((h) => h.trim());
  const col = (name) => header.indexOf(name);
  const iNo = col('Package_No');
  const iModel = col('Model');
  const iCpu = col('CPU');
  const iGpu = col('GPU');
  const iRam = col('RAM');
  const iSsd = col('SSD');
  const iPrice = col('Total_Price_SGD');

  const bundles = [];
  const seen = new Set();
  for (let r = 1; r < rows.length; r += 1) {
    const c = rows[r];
    if (!c || c.length < header.length) continue;
    const pkgNo = (c[iNo] || '').trim();
    const model = (c[iModel] || '').trim();
    const price = parsePrice(c[iPrice]);
    if (!pkgNo || !model || !Number.isFinite(price) || price < MIN_PRICE) continue;

    const id = 'prod_pkg_' + pkgNo.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    if (seen.has(id)) continue;
    seen.add(id);

    // Short component summary for the reply / detail.
    const specs = [];
    if (c[iCpu]) specs.push(c[iCpu].trim());
    if (c[iGpu]) specs.push(c[iGpu].trim());
    if (c[iRam]) specs.push(c[iRam].trim());
    if (c[iSsd]) specs.push(c[iSsd].trim());

    bundles.push({
      id,
      name: `PC Package - ${model}`,
      category: 'pc_bundle',
      brand: 'Custom Build',
      price: Math.round(price * 100) / 100,
      currency: 'SGD',
      stockStatus: 'in_stock',
      quantity: 100,
      specs: specs.join(' | '),
    });
  }
  return bundles;
}

function main() {
  const text = fs.readFileSync(CSV_PATH, 'utf8');
  const rows = parseCsv(text);
  const header = rows[0].map((h) => h.trim());
  const idx = {
    sku: header.indexOf('SKU'),
    category: header.indexOf('Category'),
    brand: header.indexOf('Brand'),
    model: header.indexOf('Model'),
    variant: header.indexOf('Variant'),
    name: header.indexOf('Product_Name'),
    price: header.indexOf('Price (SGD)'),
    qty: header.indexOf('Quantity'),
  };

  const products = [];
  const excluded = [];
  const seenNames = new Set();
  const seenIds = new Set();
  const unmappedCats = new Set();

  for (let r = 1; r < rows.length; r += 1) {
    const cols = rows[r];
    if (!cols || cols.length < header.length) continue;
    const sku = cols[idx.sku].trim();
    if (!sku) continue;

    const srcCat = cols[idx.category].trim();
    let category = CATEGORY_MAP[srcCat];
    if (!category) { unmappedCats.add(srcCat); category = 'other'; }

    let name = cols[idx.name].trim();
    const brand = cols[idx.brand].trim();
    const variant = cols[idx.variant] != null ? cols[idx.variant].trim() : '';
    const price = parsePrice(cols[idx.price]);

    // Append the variant (e.g. capacity "1TB") so different-capacity SKUs are
    // distinct products, not wrongly-merged duplicates.
    if (variant && !name.toLowerCase().includes(variant.toLowerCase())) {
      name = `${name} (${variant})`;
    }

    category = refineStorage(category, name);

    // Skip corrupted / non-real rows (bad price).
    if (!name || !Number.isFinite(price) || price < MIN_PRICE) {
      excluded.push({ sku, srcCat, name: name.slice(0, 50), price: cols[idx.price], reason: 'bad_price' });
      continue;
    }

    // Skip garbled names where multiple products' text merged into one cell
    // (source Excel artifact). Signals: an embedded price like "163" or "$183"
    // followed by more words, or an extra "K9"/model code mid-name. These would
    // show customers nonsense, so we drop them rather than guess.
    // Robust misalignment detection. The source CSV has some row-shifted /
    // merged rows (e.g. Brand="714", Model="...Storage869 Razer Basilisk...").
    // Rather than salvage scrambled data (risking wrong info to customers), we
    // exclude any row showing a clear misalignment signal:
    const combined = `${brand} ${name}`;
    const BRANDS = 'Razer|Logitech|Asus|Cisco|Aruba|Ubiquiti|Windows|Samsung|Crucial|Synology|Kingston|Kioxia|Netgear|Elgato|Dell|MSI|Gigabyte|Corsair|Intel|AMD';
    const looksGarbled =
      name.length > 95 || // two products merged into one long name
      /^\d+$/.test(brand.trim()) || // brand is purely a number (price landed here)
      /\b(?:Nas|Storage|Switch|Casing)\d{2,4}\s/i.test(combined) || // "Storage869 " word glued to a number
      new RegExp('\\b\\d{2,4}\\s+(?:' + BRANDS + ')\\b', 'i').test(combined) || // "407 Razer..." embedded price+brand
      /^\d{2,4}\s/.test(name) || // name starts with a stray number "714 Razer..."
      /^\d/.test(name) || // any name starting with a digit ("16GB Ram +...", "2.5''/M.2...")
      /(CAMERA|LIDOR|MONITORING|SWITCH|PLUG)[A-Z]/.test(name) || // glued caps run "76CAMERAAsus"
      /\d{2,4}\s+Ezviz|\d{2,4}\s+ASUS\b/.test(name) || // embedded price+brand caps
      /^\d?-?PACK\b/i.test(name) || /\b\d{3}\s+Ezviz/.test(name) ||
      /\b(PRICE|MODEM|ROUTER MODEM)\b.*[A-Z][a-z]/.test(name) || // Excel section header bled into name
      /\$\s*[\d,]+/.test(name); // an embedded price like "$ 1789" means merged text
    if (looksGarbled) {
      excluded.push({ sku, srcCat, name: name.slice(0, 60), price: cols[idx.price], reason: 'garbled_name' });
      continue;
    }

    let id = idFromSku(sku);
    while (seenIds.has(id)) id += 'x';
    seenIds.add(id);

    // Dedupe by exact name (keep first).
    if (seenNames.has(name.toLowerCase())) {
      excluded.push({ sku, srcCat, name: name.slice(0, 50), price: cols[idx.price], reason: 'duplicate_name' });
      continue;
    }
    seenNames.add(name.toLowerCase());

    products.push({
      id,
      name,
      category,
      brand: brand || 'Generic',
      price: Math.round(price * 100) / 100,
      currency: 'SGD',
      stockStatus: 'in_stock',
      quantity: 100,
    });
  }

  // Merge in PC packages as pc_bundle products.
  const bundles = loadPackages();
  for (const b of bundles) {
    if (seenIds.has(b.id)) continue;
    seenIds.add(b.id);
    products.push(b);
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(products, null, 2) + '\n', 'utf8');

  // Report.
  console.log(`Catalogue items: ${products.length - bundles.length}`);
  console.log(`PC packages (bundles): ${bundles.length}`);
  console.log(`Total products: ${products.length}`);
  console.log(`Excluded: ${excluded.length}`);
  const byCat = {};
  products.forEach((p) => { byCat[p.category] = (byCat[p.category] || 0) + 1; });
  console.log('Per-category:');
  Object.entries(byCat).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}  ${k}`));
  if (unmappedCats.size) console.log('Unmapped source categories (->other):', [...unmappedCats].join(', '));
  console.log('\nExcluded SKUs:');
  excluded.forEach((e) => console.log(`  ${e.sku} | ${e.srcCat} | ${e.price} | ${e.reason || 'bad_price'} | ${e.name}`));
}

main();
