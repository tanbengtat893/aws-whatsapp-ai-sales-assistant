'use strict';

/**
 * Product catalogue + quotation service.
 *
 * Supports the sales use case: customers ask about specific computer
 * components ("how much is the RTX 5070 TUF?", "do you have the 9800X3D?") and
 * the assistant answers with price and stock, or builds a simple quotation for
 * multiple items.
 *
 * Pure core (testable):
 *   findProducts(text, products, opts) -> [{ product, score }]
 *   buildQuotation(lines, products)    -> { items, subtotal, currency, ... }
 *
 * Live wrappers load the catalogue from the store.
 *
 * Matching is deliberately simple and deterministic (v1): token overlap across
 * a product's name, brand and category. This is easy to reason about and can be
 * replaced by a smarter matcher later behind the same signature.
 */

const DEFAULT_CURRENCY = 'SGD';

/** Category synonyms so everyday words map to catalogue categories. */
const CATEGORY_SYNONYMS = {
  cpu: ['cpu', 'processor', 'processors', 'chip', 'ryzen', 'threadripper'],
  motherboard: ['motherboard', 'mainboard', 'mobo', 'board'],
  gpu: ['gpu', 'graphics', 'graphic', 'card', 'videocard', 'vga'],
  ssd: ['ssd', 'nvme', 'storage', 'drive', 'disk'],
  ram: ['ram', 'memory', 'ddr5', 'ddr4', 'dimm'],
  case: ['case', 'casing', 'chassis', 'tower'],
  psu: ['psu', 'power', 'supply'],
  cooler: ['cooler', 'cooling', 'aio', 'fan', 'heatsink'],
  monitor: ['monitor', 'screen', 'display', 'lcd'],
  nas: ['nas', 'server'],
  mini_pc: ['mini', 'minipc', 'nuc', 'nucbox'],
  software: ['software', 'windows', 'office', 'os', 'license', 'licence'],
  router: ['router', 'wifi', 'wi-fi', 'mesh'],
  switch: ['switch', 'poe'],
  networking: ['network', 'networking', 'ethernet'],
  keyboard: ['keyboard', 'keyboards', 'keeb'],
  mouse: ['mouse', 'mice'],
  mousepad: ['mousepad', 'mousepads', 'mousemat', 'matpad'],
  sound_card: ['soundcard', 'soundcards', 'dac', 'audio'],
  webcam: ['webcam', 'webcams', 'camera', 'cameras'],
};

function lower(s) {
  return typeof s === 'string' ? s.toLowerCase() : '';
}

/**
 * Interpret a natural-language CPU query into structured attributes so we can
 * match the catalogue precisely. Handles phrasings like:
 *   "Intel processor generation 14", "14th gen i5", "gen 13 i7",
 *   "intel core ultra 7", "ryzen 7 7800x3d", "amd 9000 series".
 *
 * @returns {null | { isCpu, brand, iClass, ultra, generation, model }}
 *   brand: 'intel' | 'amd' | null
 *   iClass: 'i3'|'i5'|'i7'|'i9' | null
 *   ultra: 5|7|9 | null (Intel Core Ultra tier)
 *   generation: number | null (Intel Core i gen: 12/13/14; AMD series: 7000/8000/9000)
 *   model: matched explicit model token (e.g. "9800x3d") or null
 */
function interpretCpuQuery(text) {
  const t = lower(text);
  if (!t) return null;

  // If the customer is clearly asking about a whole PC/package/build, this is
  // NOT a standalone-CPU query - let the normal search handle it.
  if (/\b(pc\s*package|package|build|bundle|rig|desktop|mini\s*pc|nuc)\b/i.test(t)) return null;

  const mentionsCpuWord = /\b(cpu|processor|processors|chip|core|ultra|ryzen|intel|amd|threadripper)\b/.test(t);
  const iClassMatch = t.match(/\bi([3579])\b/) || t.match(/\bcore\s*i([3579])\b/) || t.match(/\bi([3579])[- ]/);
  const ryzenMatch = t.match(/\bryzen\s*([3579])\b/);
  const ultraMatch = t.match(/\b(?:core\s*)?ultra\s*([579])\b/);
  const brand = /\bintel\b/.test(t) ? 'intel' : /\b(amd|ryzen|threadripper)\b/.test(t) ? 'amd' : null;

  if (!mentionsCpuWord && !iClassMatch && !ryzenMatch && !ultraMatch) return null;

  // Generation: "14th gen", "gen 14", "generation 14", "14 gen", or a bare
  // gen number near "gen"/"generation". Intel gens are 12/13/14; treat 12-14.
  let generation = null;
  const genMatch =
    t.match(/\b(?:gen(?:eration)?)\s*(\d{1,4})\b/) ||
    t.match(/\b(\d{1,4})(?:st|nd|rd|th)?\s*gen(?:eration)?\b/);
  if (genMatch) generation = parseInt(genMatch[1], 10);

  // AMD series (7000/8000/9000) if stated.
  const seriesMatch = t.match(/\b(7000|8000|9000)\b/) || t.match(/\b([789])000\s*series\b/);
  let amdSeries = null;
  if (seriesMatch) amdSeries = parseInt(String(seriesMatch[1]).length === 1 ? seriesMatch[1] + '000' : seriesMatch[1], 10);

  // Explicit model token (e.g. "9800x3d", "12400f", "245k").
  const modelMatch = t.match(/\b([0-9]{3,5}[a-z0-9]{0,3})\b/);
  const model = modelMatch ? modelMatch[1] : null;

  return {
    isCpu: true,
    brand,
    iClass: iClassMatch ? 'i' + iClassMatch[1] : null,
    ultra: ultraMatch ? parseInt(ultraMatch[1], 10) : null,
    generation: generation || amdSeries || null,
    model,
  };
}

/**
 * Find CPUs matching an interpreted natural-language query. Filters the CPU
 * catalogue by brand / i-class / Ultra tier / generation / explicit model.
 * Returns products (cheapest first) or [] if the query isn't CPU-specific
 * enough to filter confidently.
 *
 * @param {string} text
 * @param {Array} products
 * @returns {Array<{product, score}>}
 */
function findCpus(text, products) {
  const q = interpretCpuQuery(text);
  if (!q) return [];
  const cpus = (products || []).filter((p) => p.category === 'cpu');
  if (cpus.length === 0) return [];

  let matches = cpus.slice();

  if (q.brand === 'intel') matches = matches.filter((p) => /intel/i.test(p.brand));
  if (q.brand === 'amd') matches = matches.filter((p) => /amd/i.test(p.brand));

  // Intel i-class (i3/i5/i7/i9) via the family field ("Core i5").
  if (q.iClass) {
    const cls = q.iClass.toLowerCase();
    matches = matches.filter((p) => lower(p.family).replace(/\s+/g, '').includes('core' + cls) || lower(p.name).includes(cls + '-'));
  }
  // Intel Core Ultra tier.
  if (q.ultra) {
    matches = matches.filter((p) => new RegExp('ultra\\s*' + q.ultra, 'i').test(p.name));
  }
  // Generation. Intel Core i: model like i5-14400 -> the digits right after
  // the dash start with the generation (12/13/14). AMD series: 7000/8000/9000.
  if (q.generation) {
    const gen = q.generation;
    matches = matches.filter((p) => {
      const name = lower(p.name);
      // Intel Core i-series: "i5-14400" -> gen 14.
      const iGen = name.match(/i[3579]-(\d{2})\d{2,3}/);
      if (iGen) return parseInt(iGen[1], 10) === gen;
      // AMD Ryzen: the SERIES is the first digit of the model number, e.g.
      // "Ryzen 5 7500F" -> 7000, "Ryzen 5 9600X" -> 9000, "Ryzen 7 8700G" -> 8000.
      if (/ryzen/i.test(p.name) && (gen === 7000 || gen === 8000 || gen === 9000)) {
        const m = name.match(/ryzen\s*[3579]\s*(\d)\d{3}/);
        if (m) return parseInt(m[1], 10) * 1000 === gen;
      }
      return false;
    });
  }

  // AMD Ryzen class (Ryzen 5/7/9) when the query says "ryzen 9" etc.
  const ryzenClass = lower(text).match(/\bryzen\s*([3579])\b/);
  if (ryzenClass && q.brand === 'amd') {
    matches = matches.filter((p) => new RegExp('ryzen\\s*' + ryzenClass[1] + '\\b', 'i').test(p.name));
  }
  // Explicit model token narrows further (e.g. "9800x3d").
  if (q.model && matches.length > 1) {
    const exact = matches.filter((p) => lower(p.name).replace(/[^a-z0-9]/g, '').includes(q.model));
    if (exact.length) matches = exact;
  }

  // Only return if we actually narrowed by at least one attribute; otherwise
  // let the generic search handle a bare "cpu".
  const narrowed = q.brand || q.iClass || q.ultra || q.generation || q.model;
  if (!narrowed) return [];

  return matches
    .sort((a, b) => Number(a.price) - Number(b.price))
    .map((p) => ({ product: p, score: 10 }));
}

/**
 * Tokenize into lowercase alphanumeric words.
 *
 * Also split letter/digit boundaries so glued model codes match spaced queries
 * and vice-versa: "RTX5070" -> "rtx" "5070" "rtx5070". This makes a customer's
 * "rtx 5070" match a product named "ASUS RTX5070 DUAL OC". We keep the glued
 * form too, so exact "rtx5070" still matches.
 */
function tokenize(text) {
  const raw = lower(text)
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const out = [];
  for (const tok of raw) {
    out.push(tok);
    // If the token mixes letters and digits (e.g. rtx5070, ddr5, sn850x),
    // also emit the split pieces so spaced/glued forms match either way.
    if (/[a-z]/.test(tok) && /[0-9]/.test(tok)) {
      const parts = tok.match(/[a-z]+|[0-9]+/g);
      if (parts && parts.length > 1) {
        for (const p of parts) if (p.length >= 2) out.push(p);
      }
    }
  }
  return out;
}

/** Map a query token to a category key if it is a known synonym. */
function categoryForToken(token) {
  for (const [category, words] of Object.entries(CATEGORY_SYNONYMS)) {
    if (words.includes(token)) return category;
  }
  return null;
}

/**
 * Detect that the customer is explicitly asking about a specific COMPONENT
 * category (e.g. "CPU pricelist", "processor for Intel Core Ultra"). Returns
 * the resolved category key (e.g. 'cpu') or null. Used to avoid answering a
 * CPU question with PC packages when we hold no standalone CPUs.
 */
function detectComponentCategory(text) {
  const tokens = tokenize(text);
  for (const token of tokens) {
    const cat = categoryForToken(token);
    if (cat) return cat;
  }
  return null;
}

/** True if the catalogue holds at least one standalone product in a category. */
function categoryHasStock(category, products) {
  if (!category || !Array.isArray(products)) return false;
  return products.some((p) => p.category === category);
}

/**
 * Human-like reply when a customer asks for a component we do NOT stock as a
 * standalone item (e.g. CPUs). Rather than mislead with PC packages, we say so
 * honestly, offer the complete PC builds featuring that component as an
 * alternative, and offer a sales handoff for a specific quote.
 *
 * @param {string} label      friendly component label (e.g. "CPU")
 * @param {string} query      the customer's original text (to match packages)
 * @param {Array} products    catalogue
 * @returns {string}
 */
function formatComponentNotStocked(label, query, products) {
  const cur = DEFAULT_CURRENCY;
  const lines = [];
  lines.push(
    `We don't carry standalone ${label} units in our current price list. ` +
      `I don't want to quote you the wrong item, so here's what I can offer instead:`
  );

  // Find complete PC builds that feature the requested processor, and collapse
  // same-spec builds (which differ only by price) into one line with a range.
  const buildMatches = findProducts(query, (products || []).filter((p) => p.category === 'pc_bundle'), {
    limit: 20,
    minScore: 2,
  });
  const groups = new Map();
  for (const m of buildMatches) {
    const spec = m.product.name.replace(/^PC Package - /, '');
    if (!groups.has(spec)) groups.set(spec, []);
    groups.get(spec).push(Number(m.product.price));
  }
  const collapsed = [...groups.entries()]
    .map(([spec, prices]) => ({ spec, min: Math.min(...prices), max: Math.max(...prices) }))
    .sort((a, b) => a.min - b.min)
    .slice(0, 3);
  if (collapsed.length > 0) {
    lines.push('');
    lines.push(`Complete PC builds featuring that ${label}:`);
    collapsed.forEach((g, i) => {
      const price = g.min === g.max ? `${cur} ${g.min}` : `from ${cur} ${g.min}`;
      lines.push(`${i + 1}. ${g.spec} — ${price} (complete build)`);
    });
  }
  lines.push('');
  lines.push(
    `If you'd like a price for the ${label} on its own, reply "sales" and our team will send you a quotation.`
  );
  return lines.join('\n');
}

// Friendly labels for component categories (for the not-stocked reply).
const CATEGORY_LABELS = {
  cpu: 'CPU',
  motherboard: 'motherboard',
  mini_pc: 'mini PC',
  nas: 'NAS',
};

/**
 * Score one product against the query tokens.
 * - a token that appears in the product name scores strongly
 * - a token matching the brand scores moderately
 * - a token that resolves to the product's category scores lightly
 * Model numbers (e.g. "5070", "9800x3d") are strong signals when present.
 */
function scoreProduct(queryTokens, product, targetCategory) {
  const nameTokens = new Set(tokenize(product.name));
  const brandTokens = new Set(tokenize(product.brand));
  const category = lower(product.category);

  let score = 0;
  let strongHits = 0;

  for (const token of queryTokens) {
    // Ignore single-character tokens that would match by coincidence.
    if (token.length < 2) continue;
    if (nameTokens.has(token)) {
      score += 2;
      strongHits += 1;
      // Numeric/model tokens are especially telling.
      if (/\d/.test(token)) score += 1.5;
      continue;
    }
    // Brand match must be a whole token ("asus"), not a substring — otherwise
    // "the" would wrongly match inside "thermaltake".
    if (brandTokens.has(token)) {
      score += 1.5;
      strongHits += 1;
      continue;
    }
    const cat = categoryForToken(token);
    if (cat && cat === category) {
      score += 1;
      continue;
    }
  }

  // Category preference: when the customer asks for a specific component
  // category (e.g. GPU, RAM), boost standalone items IN that category and
  // penalise PC bundles, so "rtx 5070 price" returns graphics cards rather
  // than complete builds that merely mention the card.
  if (targetCategory && targetCategory !== 'pc_bundle' && strongHits > 0) {
    if (category === targetCategory) score += 3;
    else if (category === 'pc_bundle') score -= 2;
  }

  return { score, strongHits };
}

/**
 * Parse a maximum-price (budget) constraint from free text.
 * Recognises phrasings like:
 *   "less than $10", "under 50", "below $200", "cheaper than 30",
 *   "within $80", "max 100", "budget of $150", "up to $60".
 * Returns a number (the ceiling) or null if no budget is expressed.
 */
function parseBudget(text) {
  if (typeof text !== 'string') return null;
  const t = text.toLowerCase();

  // Phrases that clearly express an upper bound, followed by an amount.
  const patterns = [
    /(?:less than|under|below|cheaper than|within|at most|max(?:imum)?|up to|no more than|budget(?: of)?)\s*\$?\s*(\d+(?:\.\d{1,2})?)/,
  ];
  for (const re of patterns) {
    const m = t.match(re);
    if (m) {
      const val = parseFloat(m[1]);
      if (Number.isFinite(val) && val > 0) return val;
    }
  }
  return null;
}

/**
 * Find products matching free-text, optionally within a budget.
 *
 * @param {string} text
 * @param {Array} products
 * @param {{ limit?: number, minScore?: number, maxPrice?: number }} [opts]
 * @returns {Array<{ product: object, score: number }>}
 */
function findProducts(text, products, opts = {}) {
  const { limit = 5, minScore = 2, maxPrice = null } = opts;
  if (typeof text !== 'string' || text.trim().length === 0) return [];
  if (!Array.isArray(products) || products.length === 0) return [];

  const queryTokens = tokenize(text);
  if (queryTokens.length === 0) return [];

  // CPU-aware path: interpret natural-language processor queries ("Intel
  // processor generation 14", "i5 14th gen", "core ultra 7", "ryzen 7 7800x3d")
  // and return precisely-filtered CPUs. Falls through to generic search when
  // the query isn't CPU-specific.
  const cpuHits = findCpus(text, products);
  if (cpuHits.length > 0) {
    return cpuHits.slice(0, limit);
  }

  // Decide whether to prefer standalone components over PC bundles.
  // 1) Explicit category word ("gpu", "ram", "router", ...).
  let targetCategory = null;
  for (const token of queryTokens) {
    const cat = categoryForToken(token);
    if (cat) { targetCategory = cat; break; }
  }
  // 2) No explicit category word, but the customer clearly isn't asking for a
  //    whole build (no "pc/package/build/bundle/rig"): infer the component
  //    category from the best-matching STANDALONE product. This makes
  //    "rtx 5070 price" surface graphics cards rather than complete builds.
  const wantsBuild = /\b(pc|package|build|bundle|rig|desktop|system|set\s?up|setup)\b/i.test(text);
  if (!targetCategory && !wantsBuild) {
    let best = null;
    for (const p of products) {
      if (p.category === 'pc_bundle') continue;
      const { score, strongHits } = scoreProduct(queryTokens, p, null);
      if (strongHits > 0 && (!best || score > best.score)) best = { score, category: p.category };
    }
    if (best) targetCategory = best.category;
  }

  const scored = [];
  for (const product of products) {
    const { score, strongHits } = scoreProduct(queryTokens, product, targetCategory);
    // Require at least one strong (name/brand) hit to avoid category-only noise
    // returning the whole catalogue.
    if (score >= minScore && strongHits > 0) {
      if (maxPrice != null && Number(product.price) > maxPrice) continue;
      scored.push({ product, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  // Category-only fallback: a customer may ask "how much is a monitor?" or just
  // "ram" / "router". Those words are CATEGORY synonyms, not product-name
  // tokens, so the strong-hit rule above finds nothing. Rather than return an
  // empty result (which reads as "we don't have it"), list the cheapest items
  // in the requested category so the customer sees real options and prices.
  if (scored.length === 0) {
    const cats = new Set();
    for (const token of queryTokens) {
      const cat = categoryForToken(token);
      if (cat) cats.add(cat);
    }
    if (cats.size > 0) {
      const inCats = products
        .filter((p) => cats.has(p.category))
        .filter((p) => maxPrice == null || Number(p.price) <= maxPrice)
        .sort((a, b) => Number(a.price) - Number(b.price))
        .map((p) => ({ product: p, score: 1 }));
      return inCats.slice(0, limit);
    }
  }

  return scored.slice(0, limit);
}

/**
 * Budget-aware search that also reports what happened, so the caller can give a
 * human-like answer. When a budget is set and nothing fits, it returns the
 * cheapest relevant item(s) that DO match the query (ignoring the budget) so
 * the reply can honestly say "our cheapest is $X".
 *
 * @returns {{
 *   budget: number|null,
 *   withinBudget: Array<{product, score}>,
 *   overBudget: Array<{product, score}>,   // relevant items above the budget
 *   matched: boolean                        // any relevant items at all
 * }}
 */
function findProductsWithBudget(text, products, opts = {}) {
  const budget = parseBudget(text);
  const allRelevant = findProducts(text, products, { ...opts, maxPrice: null });
  if (budget == null) {
    return { budget: null, withinBudget: allRelevant, overBudget: [], matched: allRelevant.length > 0 };
  }
  const withinBudget = allRelevant.filter((r) => Number(r.product.price) <= budget);
  const overBudget = allRelevant
    .filter((r) => Number(r.product.price) > budget)
    .sort((a, b) => Number(a.product.price) - Number(b.product.price));
  return {
    budget,
    withinBudget,
    overBudget,
    matched: allRelevant.length > 0,
  };
}

/**
 * List up to `limit` products in a category, cheapest first, preferring a
 * spread across brands so the customer sees variety. Used by image-based
 * identification to offer "5 same items, different brand/model & price".
 *
 * @returns {Array<object>} product records (not wrapped)
 */
function listByCategory(category, products, limit = 5) {
  if (!category || !Array.isArray(products)) return [];
  const inCat = products
    .filter((p) => p.category === category)
    .sort((a, b) => Number(a.price) - Number(b.price));

  // Prefer one-per-brand first for variety, then fill with the rest.
  const seenBrand = new Set();
  const primary = [];
  const rest = [];
  for (const p of inCat) {
    const brand = String(p.brand || '').toLowerCase();
    if (!seenBrand.has(brand)) {
      seenBrand.add(brand);
      primary.push(p);
    } else {
      rest.push(p);
    }
  }
  return [...primary, ...rest].slice(0, limit);
}

/** Human-readable stock label. */
function stockLabel(product) {
  switch (product.stockStatus) {
    case 'in_stock':
      return 'In stock';
    case 'low_stock':
      return 'Low stock';
    case 'made_to_order':
      return 'Made to order';
    default:
      return 'Check availability';
  }
}

/** True if the product can be quoted as immediately purchasable. */
function isAvailable(product) {
  return product.stockStatus === 'in_stock' || product.stockStatus === 'low_stock';
}

/**
 * Build a quotation from requested line items.
 *
 * @param {Array<{ productId: string, quantity?: number }>} lines
 * @param {Array} products - catalogue to resolve product ids against
 * @returns {{
 *   items: Array<{ productId, name, unitPrice, quantity, lineTotal, stockStatus, available }>,
 *   subtotal: number,
 *   currency: string,
 *   unavailable: Array<string>,
 *   notFound: Array<string>
 * }}
 */
function buildQuotation(lines, products) {
  const result = {
    items: [],
    subtotal: 0,
    currency: DEFAULT_CURRENCY,
    unavailable: [],
    notFound: [],
  };

  if (!Array.isArray(lines) || lines.length === 0) return result;
  const catalogue = Array.isArray(products) ? products : [];
  const byId = new Map(catalogue.map((p) => [p.id, p]));

  for (const line of lines) {
    const productId = line && line.productId;
    const qty = Math.max(1, parseInt(line && line.quantity, 10) || 1);
    const product = byId.get(productId);

    if (!product) {
      result.notFound.push(productId);
      continue;
    }

    const unitPrice = Number(product.price) || 0;
    const lineTotal = unitPrice * qty;
    const available = isAvailable(product);

    result.items.push({
      productId: product.id,
      name: product.name,
      unitPrice,
      quantity: qty,
      lineTotal,
      stockStatus: product.stockStatus,
      stockLabel: stockLabel(product),
      available,
    });

    result.subtotal += lineTotal;
    if (!available) {
      result.unavailable.push(product.id);
    }
    // Keep the currency consistent; use the product's if set.
    if (product.currency) result.currency = product.currency;
  }

  // Round subtotal to 2 dp to avoid floating point noise.
  result.subtotal = Math.round(result.subtotal * 100) / 100;
  return result;
}

/**
 * Detect that the customer is confirming/selecting a specific item to buy
 * (as opposed to browsing). Phrasings like: "I prefer this", "I'll take the",
 * "I want to buy", "confirm", "book this", "order", "get me", "please quote",
 * "quotation please", or a clear quantity ("1 set", "2 pcs", "x3").
 * Returns true when the message reads like a purchase/confirmation.
 */
function detectPurchaseIntent(text) {
  const t = lower(text);
  if (!t) return false;
  const phrases = [
    'i prefer this', 'i prefer', 'i want this', 'i want to buy', 'i want to order',
    "i'll take", 'i will take', 'i would like this', 'i would like to buy',
    'i choose', 'i pick', 'go with this', 'take this one', 'this one',
    'confirm', 'confirmed', 'proceed', 'book this', 'book it', 'reserve',
    'order this', 'place order', 'buy this', 'buy it', 'purchase',
    'get me', 'quote me', 'please quote', 'quotation', 'give me a quote',
    'checkout', 'check out',
  ];
  if (phrases.some((p) => t.includes(p))) return true;
  // A quantity expression is also a strong buy signal ("1 set", "2 pcs", "x3").
  if (/\b\d+\s*(set|sets|pc|pcs|piece|pieces|unit|units|qty|nos?)\b/.test(t)) return true;
  if (/\bx\s*\d+\b/.test(t)) return true;
  return false;
}

/**
 * Parse a purchase quantity from free text. Recognises "1 set", "2 pcs",
 * "3 units", "qty 5", "x2". Defaults to 1 when no quantity is stated.
 * @returns {number} a positive integer quantity
 */
function parseQuantity(text) {
  const t = lower(text);
  let m =
    t.match(/\b(\d+)\s*(?:set|sets|pc|pcs|piece|pieces|unit|units|nos?)\b/) ||
    t.match(/\b(?:qty|quantity)\s*[:=]?\s*(\d+)\b/) ||
    t.match(/\bx\s*(\d+)\b/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return 1;
}

/**
 * Extract a price the customer typed (e.g. "SGD 1449", "$1,449", "1449").
 * Returns the number, or null. Ignores small numbers that are clearly
 * quantities ("1 set") by requiring 3+ digits or a currency marker.
 */
function parseMentionedPrice(text) {
  const t = String(text || '');
  // Prefer a currency-marked amount: "SGD 1449", "$1,449", "1449 sgd".
  let m = t.match(/(?:sgd|s\$|\$)\s*([\d,]{3,})/i) || t.match(/([\d,]{3,})\s*(?:sgd|dollars?)\b/i);
  if (m) {
    const n = parseFloat(m[1].replace(/,/g, ''));
    if (Number.isFinite(n)) return n;
  }
  // Otherwise any standalone 3+ digit number (a plausible price).
  m = t.match(/\b(\d{3,}(?:\.\d{1,2})?)\b/);
  if (m) {
    const n = parseFloat(m[1]);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

/**
 * Resolve which product a purchase/confirmation message refers to.
 *
 * @param {string} text       the customer message
 * @param {Array<{product,score}>} matches  scored candidates (findProducts)
 * @returns {object|null} the chosen product, or null if too ambiguous
 *
 * Resolution:
 *   1. If the message contains a price and exactly one candidate matches that
 *      price, choose it (disambiguates same-named packages by price).
 *   2. Else if the top candidate clearly outscores the next, choose it.
 *   3. Else null (caller falls back to a normal search/list).
 */
function resolvePurchaseChoice(text, matches) {
  if (!Array.isArray(matches) || matches.length === 0) return null;

  const price = parseMentionedPrice(text);
  if (price != null) {
    const exact = matches.filter((m) => Number(m.product.price) === price);
    if (exact.length === 1) return exact[0].product;
    if (exact.length > 1) return exact[0].product; // same price+name: any is fine
  }

  if (matches.length === 1) return matches[0].product;
  // Clear top match by score.
  if (matches[0].score - matches[1].score >= 1.5) return matches[0].product;
  // Tie on score but identical product name -> still fine to quote the first
  // (they only differ by price; without a stated price we take the cheapest).
  const topName = String(matches[0].product.name).toLowerCase();
  const sameName = matches.filter((m) => String(m.product.name).toLowerCase() === topName);
  if (sameName.length === matches.length) {
    return sameName.sort((a, b) => Number(a.product.price) - Number(b.product.price))[0].product;
  }
  return null;
}

/**
 * Build a customer-facing quotation reply for a single selected product.
 * @param {object} product   the resolved catalogue product
 * @param {number} quantity
 * @param {string} [ref]     a quote reference to show (optional)
 * @returns {string}
 */
function formatQuotationReply(product, quantity, ref) {
  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  const cur = product.currency || DEFAULT_CURRENCY;
  const unit = Number(product.price) || 0;
  const lineTotal = Math.round(unit * qty * 100) / 100;
  const lines = [];
  lines.push('🧾 Quotation');
  if (ref) lines.push(`Ref: ${ref}`);
  lines.push('');
  lines.push(`Item: ${product.name}`);
  lines.push(`Unit price: ${cur} ${unit}`);
  lines.push(`Quantity: ${qty}`);
  lines.push(`Stock: ${stockLabel(product)}`);

  // For a PC package, show the full component breakdown ("What's included")
  // so the customer knows exactly what the build contains.
  if (product.category === 'pc_bundle' && Array.isArray(product.specs) && product.specs.length) {
    lines.push('');
    lines.push("What's included in this package:");
    for (const s of product.specs) {
      // specs may be objects {label, value} (v2) or plain strings (legacy).
      if (s && typeof s === 'object' && s.label) lines.push(`  • ${s.label}: ${s.value}`);
      else if (s) lines.push(`  • ${s}`);
    }
  }

  lines.push('');
  lines.push(`Subtotal: ${cur} ${lineTotal}`);
  lines.push('(Delivery is a flat SGD 5, or free for orders above SGD 80. Prices include GST where applicable.)');
  lines.push('');
  lines.push('To proceed, reply "confirm" and we will arrange payment (PayNow / bank transfer / card) and delivery.');
  lines.push('Need to change the quantity or item? Just let me know, or reply "sales" to speak with our team.');
  return lines.join('\n');
}

// ---- Live wrappers (load catalogue from the store) ----

function findProductsLive(text, opts) {
  // eslint-disable-next-line global-require
  const store = require('../data/store');
  return findProducts(text, store.list('products'), opts);
}

function buildQuotationLive(lines) {
  // eslint-disable-next-line global-require
  const store = require('../data/store');
  return buildQuotation(lines, store.list('products'));
}

module.exports = {
  findProducts,
  findProductsWithBudget,
  parseBudget,
  listByCategory,
  buildQuotation,
  detectPurchaseIntent,
  parseQuantity,
  parseMentionedPrice,
  resolvePurchaseChoice,
  formatQuotationReply,
  detectComponentCategory,
  categoryHasStock,
  formatComponentNotStocked,
  CATEGORY_LABELS,
  interpretCpuQuery,
  findCpus,
  findProductsLive,
  buildQuotationLive,
  DEFAULT_CURRENCY,
  _internal: {
    tokenize,
    scoreProduct,
    categoryForToken,
    stockLabel,
    isAvailable,
  },
};
