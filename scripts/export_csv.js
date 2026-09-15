'use strict';

/**
 * Exports the current inventory/delivery data to CSV files for record-keeping:
 *   1. exports/components.csv     - all catalogue components (non-package items)
 *   2. exports/pc_packages.csv    - all DIY PC packages with their component specs
 *   3. exports/deliveries.csv     - all delivery records
 *   4. exports/warranty.csv       - all customer & warranty records
 *   5. exports/test_suites.csv    - test-suite summary
 *
 * Usage: node scripts/export_csv.js
 */

const fs = require('fs');
const path = require('path');

const SEED = path.join(__dirname, '..', 'src', 'data', 'seed');
const OUT = path.join(__dirname, '..', '..', 'exports');

/** CSV-escape a value (wrap in quotes if it contains comma/quote/newline). */
function esc(v) {
  const s = v == null ? '' : String(v);
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

/** Write rows (array of objects) to a CSV file with the given header order. */
function writeCsv(file, header, rows) {
  const lines = [header.map(esc).join(',')];
  for (const r of rows) {
    lines.push(header.map((h) => esc(r[h])).join(','));
  }
  fs.writeFileSync(file, lines.join('\r\n') + '\r\n', 'utf8');
  return rows.length;
}

function main() {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  const products = JSON.parse(fs.readFileSync(path.join(SEED, 'products.json'), 'utf8'));
  const deliveries = JSON.parse(fs.readFileSync(path.join(SEED, 'deliveries.json'), 'utf8'));
  const warranty = JSON.parse(fs.readFileSync(path.join(SEED, 'warranty.json'), 'utf8'));

  // 1. Components (everything that is NOT a pc_bundle).
  const components = products
    .filter((p) => p.category !== 'pc_bundle')
    .map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      brand: p.brand,
      price_sgd: p.price,
      currency: p.currency || 'SGD',
      stock_status: p.stockStatus,
      quantity: p.quantity,
    }));
  const nComp = writeCsv(
    path.join(OUT, 'components.csv'),
    ['id', 'name', 'category', 'brand', 'price_sgd', 'currency', 'stock_status', 'quantity'],
    components
  );

  // 2. PC packages, with a flattened component spec summary.
  const packages = products
    .filter((p) => p.category === 'pc_bundle')
    .map((p) => {
      const specMap = {};
      if (Array.isArray(p.specs)) {
        for (const s of p.specs) {
          if (s && s.label) specMap[s.label] = s.value;
        }
      }
      return {
        id: p.id,
        name: p.name,
        package_code: p.packageCode || '',
        price_sgd: p.price,
        currency: p.currency || 'SGD',
        quantity: p.quantity,
        cpu: specMap['Processor (CPU)'] || '',
        motherboard: specMap['Motherboard'] || '',
        ram: specMap['Memory (RAM)'] || '',
        storage: specMap['Storage'] || '',
        gpu: specMap['Graphics (GPU)'] || '',
        psu: specMap['Power Supply (PSU)'] || '',
        cooling: specMap['CPU Cooling'] || '',
        case: specMap['Case'] || '',
        accessories: specMap['Accessories'] || '',
        os: specMap['Operating System'] || '',
      };
    });
  const nPkg = writeCsv(
    path.join(OUT, 'pc_packages.csv'),
    ['id', 'name', 'package_code', 'price_sgd', 'currency', 'quantity', 'cpu', 'motherboard', 'ram', 'storage', 'gpu', 'psu', 'cooling', 'case', 'accessories', 'os'],
    packages
  );

  // 3. Delivery records.
  const dels = deliveries.map((d) => ({
    order_no: d.orderNo || d.deliveryOrderNo,
    customer_name: d.customerName,
    customer_phone: d.customerPhone,
    customer_email: d.customerEmail || '',
    delivery_address: d.deliveryAddress,
    delivery_date: d.deliveryDate,
    arranged_time: d.arrangedDeliveryTime,
    eta: d.eta,
    status: d.status,
    driver_name: d.driverName,
    driver_phone: d.driverPhone,
    item_count: d.itemCount,
    total_price_sgd: d.totalPrice,
    currency: d.currency || 'SGD',
  }));
  const nDel = writeCsv(
    path.join(OUT, 'deliveries.csv'),
    ['order_no', 'customer_name', 'customer_phone', 'customer_email', 'delivery_address', 'delivery_date', 'arranged_time', 'eta', 'status', 'driver_name', 'driver_phone', 'item_count', 'total_price_sgd', 'currency'],
    dels
  );

  // 4. Customer & warranty records.
  const warr = warranty.map((w) => ({
    customer_id: w.customerId,
    customer_name: w.customerName,
    mobile: w.mobile,
    email: w.email,
    product_category: w.category,
    brand: w.brand,
    product_model: w.model,
    serial_number: w.serial,
    invoice_number: w.invoice,
    purchase_date: w.purchaseDate,
    warranty_status: w.warrantyStatus,
    warranty_end_date: w.warrantyEndDate,
    warranty_coverage: w.coverageLabel || w.coverage,
    service_type: w.serviceType,
    last_service_status: w.lastService,
  }));
  const nWarr = writeCsv(
    path.join(OUT, 'warranty.csv'),
    ['customer_id', 'customer_name', 'mobile', 'email', 'product_category', 'brand', 'product_model', 'serial_number', 'invoice_number', 'purchase_date', 'warranty_status', 'warranty_end_date', 'warranty_coverage', 'service_type', 'last_service_status'],
    warr
  );

  // 5. Test-suite summary (static snapshot; update counts if the suite changes).
  const suites = [
    { suite: 'ai.intent.test.js', description: 'AI intent extraction + fallback' },
    { suite: 'booking.flow.test.js', description: 'Onsite & carry-in booking flows' },
    { suite: 'delivery.test.js', description: 'Delivery-status lookup + menu' },
    { suite: 'enquiry.api.test.js', description: 'Rep dashboard enquiry API' },
    { suite: 'escalation.service.test.js', description: 'Escalation decision + acknowledgements' },
    { suite: 'faq.api.test.js', description: 'FAQ management API' },
    { suite: 'faq.service.test.js', description: 'FAQ matching' },
    { suite: 'image.identify.test.js', description: 'Image identification' },
    { suite: 'language.service.test.js', description: 'Language detection (EN/MS/ZH)' },
    { suite: 'menu.test.js', description: 'Menu, greeting, language picker, localization' },
    { suite: 'navigation.test.js', description: 'HOME/BACK navigation + numbered picker' },
    { suite: 'payment.flow.test.js', description: 'Payment -> order/invoice/delivery journey' },
    { suite: 'product.service.test.js', description: 'Product search, budget, quotation' },
    { suite: 'quotation.test.js', description: 'Guided selection + quotation flow' },
    { suite: 'smoke.test.js', description: 'App smoke test' },
    { suite: 'warranty.flow.test.js', description: 'Warranty lookup + service handoff' },
    { suite: 'webhook.integration.test.js', description: 'End-to-end webhook pipeline' },
    { suite: 'whatsapp.sender.test.js', description: 'WhatsApp sender (simulated/live)' },
  ];
  const nSuite = writeCsv(path.join(OUT, 'test_suites.csv'), ['suite', 'description'], suites);

  console.log('Exports written to:', OUT);
  console.log('  components.csv    :', nComp, 'rows');
  console.log('  pc_packages.csv   :', nPkg, 'rows');
  console.log('  deliveries.csv    :', nDel, 'rows');
  console.log('  warranty.csv      :', nWarr, 'rows');
  console.log('  test_suites.csv   :', nSuite, 'suites (333 tests total)');
}

main();
