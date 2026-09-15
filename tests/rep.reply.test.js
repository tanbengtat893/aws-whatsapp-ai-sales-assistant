'use strict';

/**
 * Two-way human-in-the-loop reply console:
 *   rep sends a reply from the dashboard (POST /api/enquiries/:id/reply)
 *   -> delivered to the customer thread, enquiry marked in_progress
 *   -> customer chat polls (GET /api/messages/:from) and sees the rep message.
 */

const request = require('supertest');
const app = require('../src/app');
const store = require('../src/data/store');
const seedFaqs = require('../src/data/seed/faqs.json');
const seedProducts = require('../src/data/seed/products.json');
const seedDeliveries = require('../src/data/seed/deliveries.json');

beforeEach(() => {
  store.reset('faqs', JSON.parse(JSON.stringify(seedFaqs)));
  store.reset('products', JSON.parse(JSON.stringify(seedProducts)));
  store.reset('deliveries', JSON.parse(JSON.stringify(seedDeliveries)));
  store.reset('enquiries', []);
  store.reset('escalations', []);
});

afterAll(() => {
  store.reset('enquiries', []);
  store.reset('escalations', []);
});

/** Create a customer enquiry that escalates, returning its id + sender. */
async function escalatedEnquiry(from) {
  const res = await request(app).post('/webhook').send({ from, text: 'I want to speak to a person' });
  return { id: res.body.enquiryId, from };
}

describe('rep reply -> customer thread', () => {
  test('a rep reply is delivered and the customer can poll it', async () => {
    const { id, from } = await escalatedEnquiry('rr_basic');
    const rep = await request(app)
      .post(`/api/enquiries/${id}/reply`)
      .send({ text: 'Hi, this is Puay Sim — happy to help!', repName: 'Puay Sim' });
    expect(rep.status).toBe(200);
    expect(rep.body.ok).toBe(true);

    const msgs = await request(app).get(`/api/messages/${from}`);
    expect(msgs.body.count).toBe(1);
    expect(msgs.body.messages[0].text).toMatch(/Puay Sim/);
    expect(msgs.body.messages[0].repName).toBe('Puay Sim');
  });

  test('the enquiry is marked in_progress and records who is handling it', async () => {
    const { id } = await escalatedEnquiry('rr_status');
    await request(app).post(`/api/enquiries/${id}/reply`).send({ text: 'On it.', repName: 'Noel' });
    const detail = await request(app).get(`/api/enquiries/${id}`);
    expect(detail.body.enquiry.status).toBe('in_progress');
    expect(detail.body.enquiry.handledBy).toBe('Noel');
  });

  test('an empty reply is rejected with 400', async () => {
    const { id } = await escalatedEnquiry('rr_empty');
    const res = await request(app).post(`/api/enquiries/${id}/reply`).send({ text: '   ' });
    expect(res.status).toBe(400);
  });

  test('replying to a non-existent enquiry returns 404', async () => {
    const res = await request(app).post('/api/enquiries/nope/reply').send({ text: 'hello' });
    expect(res.status).toBe(404);
  });

  test('rep messages do NOT appear in the dashboard enquiry list', async () => {
    const { id, from } = await escalatedEnquiry('rr_nolist');
    await request(app).post(`/api/enquiries/${id}/reply`).send({ text: 'Reply one', repName: 'Puay Sim' });
    const list = await request(app).get('/api/enquiries');
    const leaked = list.body.enquiries.filter((e) => e.from === from && String(e.text).startsWith('[rep'));
    expect(leaked).toHaveLength(0);
  });

  test('the ?since filter returns only newer messages', async () => {
    const { id, from } = await escalatedEnquiry('rr_since');
    await request(app).post(`/api/enquiries/${id}/reply`).send({ text: 'First', repName: 'Puay Sim' });
    const first = await request(app).get(`/api/messages/${from}`);
    const cutoff = first.body.messages[0].sentAt;
    const none = await request(app).get(`/api/messages/${from}?since=${encodeURIComponent(cutoff)}`);
    expect(none.body.count).toBe(0);
  });

  test('assign to a named rep sets status assigned + notifies the customer; My-enquiries filter works', async () => {
    const { id, from } = await escalatedEnquiry('rr_assign');
    const assign = await request(app).post(`/api/enquiries/${id}/assign`).send({ assignTo: 'Noel' });
    expect(assign.status).toBe(200);
    expect(assign.body.assignedTo).toBe('Noel');
    expect(assign.body.enquiry.status).toBe('assigned');
    expect(assign.body.notifiedCustomer).toBe(true);

    // Customer receives the "assigned to Noel" note.
    const msgs = await request(app).get(`/api/messages/${from}`);
    expect(msgs.body.messages.some((m) => /Noel/.test(m.text))).toBe(true);

    // My-enquiries view returns Noel's assignment.
    const mine = await request(app).get('/api/enquiries?assignedTo=Noel');
    expect(mine.body.enquiries.some((e) => e.id === id)).toBe(true);
    expect(mine.body.reps).toContain('Noel');
  });

  test('assigned rep replying keeps the assignment and moves to in_progress', async () => {
    const { id } = await escalatedEnquiry('rr_assign_reply');
    await request(app).post(`/api/enquiries/${id}/assign`).send({ assignTo: 'Noel' });
    // Reply without passing a name -> falls back to the assigned rep.
    await request(app).post(`/api/enquiries/${id}/reply`).send({ text: 'Noel here, on it.' });
    const detail = await request(app).get(`/api/enquiries/${id}`);
    expect(detail.body.enquiry.status).toBe('in_progress');
    expect(detail.body.enquiry.assignedTo).toBe('Noel');
    expect(detail.body.enquiry.handledBy).toBe('Noel');
  });

  test('round-robin assigns to a roster rep', async () => {
    const { id } = await escalatedEnquiry('rr_roundrobin');
    const assign = await request(app).post(`/api/enquiries/${id}/assign`).send({ roundRobin: true });
    expect(['Noel', 'Puay Sim', 'Peter', 'Alvin']).toContain(assign.body.assignedTo);
    expect(assign.body.enquiry.status).toBe('assigned');
  });

  test('assign with notifyCustomer=false does not message the customer', async () => {
    const { id, from } = await escalatedEnquiry('rr_assign_silent');
    await request(app).post(`/api/enquiries/${id}/assign`).send({ assignTo: 'Peter', notifyCustomer: false });
    const msgs = await request(app).get(`/api/messages/${from}`);
    expect(msgs.body.count).toBe(0);
  });

  test('a rep reply does not corrupt the customer conversation state', async () => {
    const from = 'rr_state';
    // Shortlist -> select -> quantity flow, with a rep reply in between.
    await request(app).post('/webhook').send({ from, text: 'how much is a keyboard' });
    const list = await request(app).get('/api/enquiries?status=auto_answered');
    const shortlistEnq = list.body.enquiries.find((e) => e.from === from);
    await request(app).post(`/api/enquiries/${shortlistEnq.id}/reply`).send({ text: 'Let me help.', repName: 'Puay Sim' });
    // The customer replies "1" -> should still select from the shortlist (not treated as a menu).
    const sel = await request(app).post('/webhook').send({ from, text: '1' });
    expect(sel.body.reply).toMatch(/how many/i);
  });
});
