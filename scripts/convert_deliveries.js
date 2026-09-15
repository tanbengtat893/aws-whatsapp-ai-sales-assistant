'use strict';

/**
 * Converter: delivery orders CSV -> src/data/seed/deliveries.json
 *
 * Keeps the fields a customer needs to track a delivery (invoice/DO number,
 * name, phone, address, date, arranged time, ETA, status, driver name+phone,
 * total) plus a short summary of items. Customers can then look up their
 * delivery by invoice number, name, or phone without calling the hotline.
 *
 * Usage: node scripts/convert_deliveries.js "<path-to-csv>"
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH =
  process.argv[2] ||
  path.join(__dirname, '..', '..', 'Dynacore_Onsite_Delivery_Order_Demo_Data.csv');
const OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'seed', 'deliveries.json');

/** CSV parser handling quoted fields. */
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

/** Normalize a phone to digits only (for tolerant matching). */
function normPhone(p) {
  return String(p || '').replace(/\D/g, '');
}

function main() {
  const text = fs.readFileSync(CSV_PATH, 'utf8').replace(/^\uFEFF/, '');
  const rows = parseCsv(text);
  const header = rows[0].map((h) => h.trim());
  const idx = {};
  header.forEach((h, i) => { idx[h] = i; });

  const deliveries = [];
  for (let r = 1; r < rows.length; r += 1) {
    const c = rows[r];
    if (!c || c.length < header.length) continue;
    // This CSV uses Delivery_Order_No (e.g. DO202600001) as the order id;
    // there is no separate invoice number, so we key lookups on the DO number.
    const orderNo = (c[idx.Delivery_Order_No] || '').trim();
    if (!orderNo) continue;

    // Build a short item summary from up to 6 item slots.
    const items = [];
    for (let n = 1; n <= 6; n += 1) {
      const desc = (c[idx[`Item_${n}_Description`]] || '').trim();
      const price = (c[idx[`Item_${n}_Unit_Price_SGD`]] || '').trim();
      const qty = (c[idx[`Item_${n}_Quantity`]] || '').trim();
      if (desc) items.push({ description: desc, unitPrice: parseFloat(price) || null, quantity: parseInt(qty, 10) || 1 });
    }

    deliveries.push({
      orderNo,
      deliveryOrderNo: orderNo,
      customerName: (c[idx.Customer_Name] || '').trim(),
      customerPhone: (c[idx.Customer_Phone] || '').trim(),
      customerPhoneDigits: normPhone(c[idx.Customer_Phone]),
      customerEmail: (c[idx.Customer_Email] || '').trim(),
      deliveryAddress: (c[idx.Delivery_Address] || '').trim(),
      deliveryDate: (c[idx.Delivery_Date] || '').trim(),
      arrangedDeliveryTime: (c[idx.Arranged_Delivery_Time] || '').trim(),
      eta: (c[idx.ETA_Expected_Arrival] || '').trim(),
      status: (c[idx.Delivery_Status] || '').trim(),
      driverName: (c[idx.Driver_Name] || '').trim(),
      driverPhone: (c[idx.Driver_Handphone] || '').trim(),
      itemCount: parseInt(c[idx.Item_Count], 10) || items.length,
      items,
      totalPrice: parseFloat((c[idx.Total_Order_Price_SGD] || '').replace(/[$,]/g, '')) || null,
      currency: (c[idx.Currency] || 'SGD').trim(),
    });
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(deliveries, null, 2) + '\n', 'utf8');
  console.log(`Deliveries imported: ${deliveries.length}`);
  const byStatus = {};
  deliveries.forEach((d) => { byStatus[d.status] = (byStatus[d.status] || 0) + 1; });
  console.log('By status:', JSON.stringify(byStatus));
  console.log('Sample:', deliveries[2].orderNo, '|', deliveries[2].customerName, '|', deliveries[2].status, '|', deliveries[2].driverName, '| ETA', deliveries[2].eta);
}

main();
