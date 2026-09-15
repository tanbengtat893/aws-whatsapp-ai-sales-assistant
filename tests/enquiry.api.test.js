'use strict';

/**
 * Integration tests for the Enquiries API (spec Task 10, Req 5.1-5.3).
 * Enquiries are seeded through the real /webhook so escalation records exist.
 */

const request = require('supertest');
const app = require('../src/app');
const store = require('../src/data/store');
const seedFaqs = require('../src/data/seed/faqs.json');
const seedProducts = require('../src/data/seed/products.json');

async function seedEnquiries() {
  // 1 auto-answered, 1 low-confidence escalation, 1 human-requested escalation.
  await request(app).post('/webhook').send({ from: 'cust_auto', text: 'What is the price?' });
  await request(app)
    .post('/webhook')
    .send({ from: 'cust_unknown', text: 'Do you sell purple flying unicorns from Mars?' });
  await request(app)
    .post('/webhook')
    .send({ from: 'cust_human', text: 'I want to talk to a person' });
}

beforeEach(() => {
  store.reset('faqs', JSON.parse(JSON.stringify(seedFaqs)));
  store.reset('products', JSON.parse(JSON.stringify(seedProducts)));
  store.reset('enquiries', []);
  store.reset('escalations', []);
});

afterAll(() => {
  store.reset('enquiries', []);
  store.reset('escalations', []);
});

describe('GET /api/enquiries (Req 5.1)', () => {
  test('lists enquiries with status, language, and timestamp', async () => {
    await seedEnquiries();
    const res = await request(app).get('/api/enquiries');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(3);
    for (const e of res.body.enquiries) {
      expect(e).toHaveProperty('status');
      expect(e).toHaveProperty('language');
      expect(e).toHaveProperty('receivedAt');
      expect(e.receivedAt).toBeTruthy();
    }
  });

  test('is sorted newest first', async () => {
    await seedEnquiries();
    const res = await request(app).get('/api/enquiries');
    const times = res.body.enquiries.map((e) => e.receivedAt);
    const sorted = [...times].sort((a, b) => String(b).localeCompare(String(a)));
    expect(times).toEqual(sorted);
  });

  test('can filter by status', async () => {
    await seedEnquiries();
    const res = await request(app).get('/api/enquiries?status=pending');
    expect(res.body.enquiries.every((e) => e.status === 'pending')).toBe(true);
    expect(res.body.enquiries.length).toBe(2); // the two escalations
  });

  test('pending enquiries expose an escalation reason', async () => {
    await seedEnquiries();
    const res = await request(app).get('/api/enquiries?status=pending');
    const reasons = res.body.enquiries.map((e) => e.escalationReason).sort();
    expect(reasons).toEqual(['human_requested', 'low_confidence']);
  });
});

describe('GET /api/enquiries/:id (Req 5.2)', () => {
  test('returns full detail including escalation reason', async () => {
    await seedEnquiries();
    const pending = store.list('enquiries').find((e) => e.status === 'pending');
    const res = await request(app).get(`/api/enquiries/${pending.id}`);
    expect(res.status).toBe(200);
    expect(res.body.enquiry.id).toBe(pending.id);
    expect(res.body.enquiry.text).toBeTruthy();
    expect(res.body.enquiry.language).toBeTruthy();
    expect(res.body.enquiry.escalation).toBeTruthy();
    expect(['low_confidence', 'human_requested']).toContain(res.body.enquiry.escalation.reason);
  });

  test('404 for an unknown enquiry id', async () => {
    const res = await request(app).get('/api/enquiries/does_not_exist');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/enquiries/:id/resolve (Req 5.3)', () => {
  test('marks an escalated enquiry resolved and records who resolved it', async () => {
    await seedEnquiries();
    const pending = store.list('enquiries').find((e) => e.status === 'pending');

    const res = await request(app)
      .post(`/api/enquiries/${pending.id}/resolve`)
      .send({ resolvedBy: 'Puay Sim' });
    expect(res.status).toBe(200);
    expect(res.body.enquiry.status).toBe('resolved');
    expect(res.body.enquiry.resolvedBy).toBe('Puay Sim');
    expect(res.body.enquiry.resolvedAt).toBeTruthy();

    // The linked escalation record is resolved too.
    const escalation = store
      .list('escalations')
      .find((e) => e.enquiryId === pending.id);
    expect(escalation.status).toBe('resolved');
  });

  test('defaults resolvedBy to "unknown" when not provided', async () => {
    await seedEnquiries();
    const pending = store.list('enquiries').find((e) => e.status === 'pending');
    const res = await request(app).post(`/api/enquiries/${pending.id}/resolve`).send({});
    expect(res.body.enquiry.resolvedBy).toBe('unknown');
  });

  test('404 when resolving an unknown enquiry', async () => {
    const res = await request(app)
      .post('/api/enquiries/nope/resolve')
      .send({ resolvedBy: 'Noel' });
    expect(res.status).toBe(404);
  });
});

describe('GET /api/enquiries?status=needs_attention', () => {
  test('returns only pending / assigned / in_progress', async () => {
    await seedEnquiries();
    const res = await request(app).get('/api/enquiries?status=needs_attention');
    expect(res.body.enquiries.length).toBeGreaterThan(0);
    expect(res.body.enquiries.every((e) => ['pending', 'assigned', 'in_progress'].includes(e.status))).toBe(true);
    // The auto-answered pricing enquiry is excluded from this view.
    expect(res.body.enquiries.some((e) => e.status === 'auto_answered')).toBe(false);
  });
});

describe('POST /api/enquiries/clear', () => {
  test('scope "resolved" removes only resolved; keeps active + auto-answered', async () => {
    await seedEnquiries();
    const pending = store.list('enquiries').find((e) => e.status === 'pending');
    await request(app).post(`/api/enquiries/${pending.id}/resolve`).send({ resolvedBy: 'Noel' });

    const res = await request(app).post('/api/enquiries/clear').send({ scope: 'resolved' });
    expect(res.status).toBe(200);
    expect(res.body.removed).toBe(1);

    const after = store.list('enquiries');
    expect(after.some((e) => e.status === 'resolved')).toBe(false);
    expect(after.some((e) => e.status === 'pending')).toBe(true); // active kept
    expect(after.some((e) => e.status === 'auto_answered')).toBe(true); // kept in this scope
  });

  test('scope "closed" removes resolved + auto_answered but never active items', async () => {
    await seedEnquiries();
    const pending = store.list('enquiries').find((e) => e.status === 'pending');
    // Assign the other escalation so we have an active 'assigned' item.
    const otherPending = store.list('enquiries').find((e) => e.status === 'pending' && e.id !== pending.id);
    await request(app).post(`/api/enquiries/${pending.id}/resolve`).send({ resolvedBy: 'Noel' });
    await request(app).post(`/api/enquiries/${otherPending.id}/assign`).send({ assignTo: 'Noel', notifyCustomer: false });

    const res = await request(app).post('/api/enquiries/clear').send({ scope: 'closed' });
    expect(res.status).toBe(200);

    const after = store.list('enquiries');
    expect(after.some((e) => e.status === 'resolved')).toBe(false);
    expect(after.some((e) => e.status === 'auto_answered')).toBe(false);
    // The assigned (active) enquiry is always kept.
    expect(after.some((e) => e.status === 'assigned')).toBe(true);
  });

  test('defaults to the "resolved" scope when none given', async () => {
    await seedEnquiries();
    const pending = store.list('enquiries').find((e) => e.status === 'pending');
    await request(app).post(`/api/enquiries/${pending.id}/resolve`).send({ resolvedBy: 'Noel' });
    const res = await request(app).post('/api/enquiries/clear').send({});
    expect(res.body.scope).toBe('resolved');
    expect(store.list('enquiries').some((e) => e.status === 'auto_answered')).toBe(true);
  });
});
