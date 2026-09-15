'use strict';

/**
 * Converter v2: expanded pricelist CSV -> src/data/seed/products.json
 *
 * The v2 pricelist is clean and well-structured (Catalogue_ID, Category, Brand,
 * Model, Unit_Price_SGD, Quantity, ...), so no garbled-row filtering is needed.
 *
 * Special handling for "DIY PC Package" rows: the component build is described
 * in the Notes column, e.g.
 *   "Complete DIY PC package: AMD Ryzen 5 8400F; motherboard with LAN; 64GB
 *    DDR5; 2TB Gen4 NVMe SSD; RTX 5070 Ti 16GB; CPU cooling; 750W 80+ Gold;
 *    chassis with fans; keyboard and mouse; Windows 11 Home 64-bit OEM licence."
 * We parse that into a structured `specs` list (CPU, motherboard, RAM, SSD,
 * GPU, PSU, cooling, case, accessories, OS) so a quotation can show a
 * "What's included" breakdown. We also build a friendly name (CPU + GPU) so the
 * package reads like a product rather than an internal code (DIY-PERFORMANCE-059).
 *
 * Every item: quantity 100, stockStatus in_stock (per request).
 *
 * Usage: node scripts/convert_catalog_v2.js "<path-to-csv>"
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH =
  process.argv[2] ||
  path.join(__dirname, '..', '..', 'catalogue_expanded_2026.csv');
const OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'seed', 'products.json');

// Source category -> app category (matches product.service CATEGORY_SYNONYMS).
const CATEGORY_MAP = {
  'Graphics Card': 'gpu',
  'PC Case': 'case',
  'Power Supply': 'psu',
  'LCD Monitor': 'monitor',
  Software: 'software',
  'CPU Cooler': 'cooler',
  Storage: 'ssd', // refined to storage_hdd below when the name says HDD
  'RAM / Memory': 'ram',
  'DIY PC Package': 'pc_bundle',
  'Network Card': 'networking',
  Router: 'router',
  Switch: 'switch',
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

function idFromCat(catId) {
  return 'prod_' + String(catId).toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

/**
 * Parse the DIY PC Package Notes into a structured component list. The Notes
 * text lists parts separated by ';'. We map each part to a labelled component.
 * Per request: DVD-ROM is intentionally left out. The actual CPU (AMD or Intel)
 * is kept as-is from the data.
 *
 * @returns {{ specs: Array<{label, value}>, cpu: string, gpu: string }}
 */
function parsePackageSpecs(notes) {
  const specs = [];
  let cpu = '';
  let gpu = '';
  if (!notes) return { specs, cpu, gpu };

  // Strip the leading "Complete DIY PC package:" and trailing disclaimer.
  let body = notes.replace(/^\s*Complete DIY PC package:\s*/i, '');
  body = body.replace(/\.\s*Indicative compiled package price.*$/i, '');
  const parts = body.split(';').map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    const p = part.trim();
    const low = p.toLowerCase();

    if (/(ryzen|threadripper|core\s*i\d|core\s*ultra|intel|amd)/i.test(p) && !cpu) {
      cpu = p;
      specs.push({ label: 'Processor (CPU)', value: p });
    } else if (/motherboard|mainboard/i.test(low)) {
      specs.push({ label: 'Motherboard', value: p });
    } else if (/ddr\d|ecc/i.test(low) && /\d+\s*gb/i.test(low)) {
      specs.push({ label: 'Memory (RAM)', value: p });
    } else if (/ssd|nvme|hdd|storage/i.test(low)) {
      specs.push({ label: 'Storage', value: p });
    } else if (/(rtx|rx|radeon|geforce|integrated graphics|rtx pro)/i.test(low)) {
      if (!gpu) gpu = p;
      specs.push({ label: 'Graphics (GPU)', value: p });
    } else if (/\d+\s*w\b|platinum|gold|bronze/i.test(low) && !/ddr/i.test(low)) {
      specs.push({ label: 'Power Supply (PSU)', value: p });
    } else if (/cpu cooling|cooler|cooling|aio/i.test(low)) {
      specs.push({ label: 'CPU Cooling', value: p });
    } else if (/chassis|case|tower|fans/i.test(low)) {
      specs.push({ label: 'Case', value: p });
    } else if (/keyboard|mouse/i.test(low)) {
      specs.push({ label: 'Accessories', value: p });
    } else if (/windows|os\b|operating system/i.test(low)) {
      specs.push({ label: 'Operating System', value: p });
    } else {
      specs.push({ label: 'Included', value: p });
    }
  }
  return { specs, cpu, gpu };
}

/** Trim a GPU/CPU descriptor into a short label for the package name. */
function shortPart(s) {
  return String(s || '')
    .replace(/\b(GDDR\d|OEM|64-bit|licence|license|with LAN|motherboard)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function main() {
  const text = fs.readFileSync(CSV_PATH, 'utf8').replace(/^\uFEFF/, '');
  const rows = parseCsv(text);
  const header = rows[0].map((h) => h.trim());
  const idx = {
    catId: header.indexOf('Catalogue_ID'),
    category: header.indexOf('Category'),
    brand: header.indexOf('Brand'),
    model: header.indexOf('Model'),
    price: header.indexOf('Unit_Price_SGD'),
    qty: header.indexOf('Quantity'),
    notes: header.indexOf('Notes'),
  };

  const products = [];
  const seenIds = new Set();
  const unmapped = new Set();
  let packageCount = 0;

  for (let r = 1; r < rows.length; r += 1) {
    const c = rows[r];
    if (!c || c.length < 5) continue;
    const catId = (c[idx.catId] || '').trim();
    if (!catId) continue;

    const srcCat = (c[idx.category] || '').trim();
    let category = CATEGORY_MAP[srcCat];
    if (!category) { unmapped.add(srcCat); category = 'other'; }

    const brand = (c[idx.brand] || '').trim();
    const model = (c[idx.model] || '').trim();
    const price = parsePrice(c[idx.price]);
    if (!Number.isFinite(price) || price <= 0) continue;

    let id = idFromCat(catId);
    while (seenIds.has(id)) id += 'x';
    seenIds.add(id);

    if (category === 'pc_bundle') {
      // Build a friendly name from CPU + GPU, plus structured specs.
      const { specs, cpu, gpu } = parsePackageSpecs(c[idx.notes] || '');
      const cpuShort = shortPart(cpu);
      const gpuShort = shortPart(gpu);
      let friendly;
      if (cpuShort && gpuShort) friendly = `${cpuShort} + ${gpuShort}`;
      else if (cpuShort) friendly = cpuShort;
      else friendly = model;
      products.push({
        id,
        name: `PC Package - ${friendly}`,
        category,
        brand: 'Custom Build',
        price: Math.round(price * 100) / 100,
        currency: 'SGD',
        stockStatus: 'in_stock',
        quantity: 100,
        packageCode: model,
        specs,
      });
      packageCount += 1;
    } else {
      category = refineStorage(category, model);
      products.push({
        id,
        name: model,
        category,
        brand: brand || 'Generic',
        price: Math.round(price * 100) / 100,
        currency: 'SGD',
        stockStatus: 'in_stock',
        quantity: 100,
      });
    }
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(products, null, 2) + '\n', 'utf8');

  console.log(`Total products: ${products.length}`);
  console.log(`  Components: ${products.length - packageCount}`);
  console.log(`  PC packages: ${packageCount}`);
  const byCat = {};
  products.forEach((p) => { byCat[p.category] = (byCat[p.category] || 0) + 1; });
  console.log('Per-category:');
  Object.entries(byCat).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}  ${k}`));
  if (unmapped.size) console.log('Unmapped categories (->other):', [...unmapped].join(', '));
  // Show one sample package with its specs.
  const sample = products.find((p) => p.category === 'pc_bundle');
  if (sample) {
    console.log('\nSample package:', sample.name, '| SGD', sample.price);
    sample.specs.forEach((s) => console.log(`   - ${s.label}: ${s.value}`));
  }
}

main();
