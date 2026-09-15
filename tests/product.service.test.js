'use strict';

/**
 * Unit tests for the product catalogue + quotation service.
 * Core functions are pure: tests pass an explicit catalogue.
 */

const productService = require('../src/services/product.service');
const { findProducts, buildQuotation, parseBudget, findProductsWithBudget } = productService;
const catalogue = require('../src/data/seed/products.json');

describe('product.service.findProducts', () => {
  test('finds a relevant GPU near the top for an RTX query', () => {
    const results = findProducts('rtx 5070', catalogue);
    expect(results.length).toBeGreaterThan(0);
    // Top results should be RTX 5070 items (product or bundle).
    expect(results[0].product.name.toLowerCase()).toMatch(/rtx\s*5070/);
  });

  test('finds items by brand + type', () => {
    const results = findProducts('samsung ssd', catalogue);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => /samsung/i.test(r.product.name))).toBe(true);
  });

  test('matches by brand and capacity for storage', () => {
    const results = findProducts('samsung ssd 1tb', catalogue);
    expect(results.some((r) => /samsung/i.test(r.product.name) && r.product.category.includes('ssd'))).toBe(true);
  });

  test('returns results sorted by descending score', () => {
    const results = findProducts('samsung ssd 1tb', catalogue);
    for (let i = 1; i < results.length; i += 1) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  test('respects the limit option', () => {
    const results = findProducts('gaming', catalogue, { limit: 3 });
    expect(results.length).toBeLessThanOrEqual(3);
  });

  test('unrelated text returns no products', () => {
    expect(findProducts('the weather is lovely today', catalogue)).toEqual([]);
  });

  test('empty or invalid input returns no products', () => {
    expect(findProducts('', catalogue)).toEqual([]);
    expect(findProducts('   ', catalogue)).toEqual([]);
    expect(findProducts('rtx', [])).toEqual([]);
    expect(findProducts('rtx', undefined)).toEqual([]);
  });

  test('is pure: repeated calls return equal results', () => {
    const a = findProducts('corsair psu 850w', catalogue);
    const b = findProducts('corsair psu 850w', catalogue);
    expect(a).toEqual(b);
  });
});

describe('product.service.buildQuotation', () => {
  // Pick two real products from the current catalogue for math tests.
  const a = catalogue[0];
  const b = catalogue[1];

  test('computes line totals and subtotal correctly', () => {
    const q = buildQuotation(
      [
        { productId: a.id, quantity: 1 },
        { productId: b.id, quantity: 2 },
      ],
      catalogue
    );
    expect(q.items).toHaveLength(2);
    expect(q.items[1].lineTotal).toBe(b.price * 2);
    expect(q.subtotal).toBe(a.price + b.price * 2);
    expect(q.currency).toBe('SGD');
  });

  test('defaults quantity to 1 and enforces a minimum of 1', () => {
    const q = buildQuotation(
      [
        { productId: a.id }, // no qty -> 1
        { productId: b.id, quantity: 0 }, // -> 1
        { productId: catalogue[2].id, quantity: -3 }, // -> 1
      ],
      catalogue
    );
    expect(q.items.every((i) => i.quantity >= 1)).toBe(true);
  });

  test('reports unknown product ids in notFound', () => {
    const q = buildQuotation([{ productId: 'does_not_exist', quantity: 2 }], catalogue);
    expect(q.items).toHaveLength(0);
    expect(q.notFound).toContain('does_not_exist');
    expect(q.subtotal).toBe(0);
  });

  test('empty lines returns an empty quotation', () => {
    const q = buildQuotation([], catalogue);
    expect(q.items).toHaveLength(0);
    expect(q.subtotal).toBe(0);
  });

  test('in_stock items are treated as available', () => {
    const inStock = catalogue.filter((p) => p.stockStatus === 'in_stock').slice(0, 2);
    const q = buildQuotation(inStock.map((p) => ({ productId: p.id })), catalogue);
    expect(q.unavailable).toHaveLength(0);
    expect(q.items.every((i) => i.available)).toBe(true);
  });
});

describe('product.service.parseBudget', () => {
  test.each([
    ['less than $10', 10],
    ['under 50', 50],
    ['below $200', 200],
    ['cheaper than 30', 30],
    ['within $80', 80],
    ['up to 60', 60],
    ['budget of $150', 150],
    ['max 100', 100],
    ['no more than $250', 250],
  ])('parses "%s" -> %d', (text, expected) => {
    expect(parseBudget(text)).toBe(expected);
  });

  test.each([['just a mouse'], ['gaming pc'], [''], ['price of the rtx 5070']])(
    'returns null for "%s" (no budget expressed)',
    (text) => {
      expect(parseBudget(text)).toBeNull();
    }
  );
});

describe('product.service.findProductsWithBudget', () => {
  test('filters to items within budget', () => {
    // Use a category that exists with items under the ceiling (routers span
    // ~$75-$635, so plenty fit under $300).
    const r = findProductsWithBudget('router under $300', catalogue);
    expect(r.budget).toBe(300);
    expect(r.withinBudget.length).toBeGreaterThan(0);
    expect(r.withinBudget.every((m) => m.product.price <= 300)).toBe(true);
  });

  test('when nothing fits, reports overBudget cheapest-first and matched=true', () => {
    // Routers start around $75, so an unrealistic "$10" ceiling fits nothing
    // but should still report the cheapest options over budget.
    const r = findProductsWithBudget('router less than $10', catalogue);
    expect(r.budget).toBe(10);
    expect(r.withinBudget).toHaveLength(0);
    expect(r.overBudget.length).toBeGreaterThan(0);
    expect(r.matched).toBe(true);
    // Cheapest first.
    for (let i = 1; i < r.overBudget.length; i += 1) {
      expect(r.overBudget[i - 1].product.price).toBeLessThanOrEqual(r.overBudget[i].product.price);
    }
  });

  test('no budget behaves like a normal search', () => {
    const r = findProductsWithBudget('gaming mouse', catalogue);
    expect(r.budget).toBeNull();
    expect(r.withinBudget.length).toBeGreaterThan(0);
  });

  test('clearly unrelated gibberish -> matched false', () => {
    const r = findProductsWithBudget('qwerty zxcvbn asdfgh', catalogue);
    expect(r.matched).toBe(false);
  });
});

describe('product.service internal helpers', () => {
  test('categoryForToken maps synonyms', () => {
    expect(productService._internal.categoryForToken('processor')).toBe('cpu');
    expect(productService._internal.categoryForToken('graphics')).toBe('gpu');
    expect(productService._internal.categoryForToken('banana')).toBeNull();
  });

  test('stockLabel is human readable', () => {
    expect(productService._internal.stockLabel({ stockStatus: 'in_stock' })).toBe('In stock');
    expect(productService._internal.stockLabel({ stockStatus: 'made_to_order' })).toBe(
      'Made to order'
    );
  });
});
