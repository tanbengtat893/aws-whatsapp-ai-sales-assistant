'use strict';

/**
 * Replace ALL CPU products in products.json with the authoritative processor
 * pricelist (Intel + AMD). Removes existing category==='cpu' items and adds the
 * new list with clean names and fixed prices. Non-CPU products are untouched.
 *
 * Usage: node scripts/replace_cpus.js "<path-to-processors-csv>"
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH = process.argv[2] || path.join(__dirname, '..', '..', 'processors_2026.csv');
const OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'seed', 'products.json');

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i += 1; } else inQuotes = false; }
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c === '\r') { /* skip */ }
    else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function main() {
  const text = fs.readFileSync(CSV_PATH, 'utf8').replace(/^\uFEFF/, '');
  const rows = parseCsv(text);
  const header = rows[0].map((h) => h.trim());
  const idx = {
    no: header.indexOf('No'),
    brand: header.indexOf('Brand'),
    family: header.indexOf('Family'),
    gen: header.indexOf('Generation'),
    model: header.indexOf('Model'),
    price: header.indexOf('Price'),
  };

  const all = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'));
  const beforeCpu = all.filter((p) => p.category === 'cpu').length;
  const kept = all.filter((p) => p.category !== 'cpu'); // drop old CPUs

  const cpus = [];
  const seen = new Set();
  for (let r = 1; r < rows.length; r += 1) {
    const c = rows[r];
    if (!c || c.length < 6) continue;
    const no = (c[idx.no] || '').trim();
    if (!no) continue;
    const brand = (c[idx.brand] || '').trim();
    const family = (c[idx.family] || '').trim();
    const model = (c[idx.model] || '').trim();
    const price = parseFloat(String(c[idx.price] || '').replace(/[$,]/g, ''));
    if (!model || !Number.isFinite(price) || price <= 0) continue;

    // Build a clean, searchable name. The model already carries the identifier
    // (e.g. "i5-12400F", "Ryzen 7 9800X3D", "Ultra 5 225F"). Prefix brand and,
    // for Intel Core lines, the "Core" word so "core i5" queries match.
    let name;
    if (brand === 'Intel' && /^i\d-/i.test(model)) {
      name = `Intel Core ${model}`; // "Intel Core i5-12400F"
    } else if (brand === 'Intel' && /^ultra/i.test(model)) {
      name = `Intel Core ${model}`; // "Intel Core Ultra 5 225F"
    } else if (model.toLowerCase().startsWith(brand.toLowerCase())) {
      name = model; // "Ryzen..." already? (AMD models start with "Ryzen")
      if (brand === 'AMD') name = `AMD ${model}`;
    } else {
      name = `${brand} ${model}`;
    }

    let id = 'prod_cpu_' + no;
    while (seen.has(id)) id += 'x';
    seen.add(id);

    cpus.push({
      id,
      name,
      category: 'cpu',
      brand,
      price: Math.round(price * 100) / 100,
      currency: 'SGD',
      stockStatus: 'in_stock',
      quantity: 20,
      family, // for reference/filtering
    });
  }

  const merged = kept.concat(cpus);
  fs.writeFileSync(OUT_PATH, JSON.stringify(merged, null, 2) + '\n', 'utf8');

  console.log(`Old CPUs removed: ${beforeCpu}`);
  console.log(`New CPUs added: ${cpus.length}`);
  console.log(`Total products now: ${merged.length}`);
  console.log('Sample:');
  cpus.slice(0, 3).concat(cpus.slice(-3)).forEach((p) => console.log(`  ${p.name} — SGD ${p.price}`));
  const intel = cpus.filter((p) => p.brand === 'Intel').length;
  const amd = cpus.filter((p) => p.brand === 'AMD').length;
  console.log(`Intel: ${intel} | AMD: ${amd}`);
}

main();
