'use strict';

/**
 * Enquiries controller for the rep dashboard (spec Task 10, Req 5).
 *
 * Endpoints (mounted at /api/enquiries):
 *   GET  /              list enquiries (status, language, timestamp) (Req 5.1)
 *   GET  /:id           enquiry detail incl. escalation reason (Req 5.2)
 *   POST /:id/resolve   mark an escalated enquiry resolved (Req 5.3)
 */

const store = require('../data/store');

/**
 * Sales rep roster for assignment. The dashboard offers these as choices, and
 * the round-robin ("assign to next available rep") rotates through them.
 */
const REP_ROSTER = ['Noel', 'Puay Sim', 'Peter', 'Alvin'];

/** Find the escalation record linked to an enquiry, if any. */
function escalationFor(enquiryId) {
  const matches = store.list('escalations', {
    filter: (e) => e.enquiryId === enquiryId,
  });
  // Most recent escalation wins if there are several.
  return matches.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0] || null;
}

/**
 * GET /api/enquiries
 * Optional query: ?status=pending|auto_answered|resolved
 * Returns newest first, with the fields the dashboard needs.
 */
function listEnquiries(req, res) {
  const { status, assignedTo } = req.query;
  let enquiries = store.list('enquiries', {
    sort: (a, b) => String(b.receivedAt).localeCompare(String(a.receivedAt)),
  });
  // Exclude rep→customer outbound messages; the dashboard lists customer enquiries.
  enquiries = enquiries.filter((e) => e.author !== 'rep');
  if (status === 'needs_attention') {
    // The dashboard's default view: only actionable enquiries.
    const active = ['pending', 'assigned', 'in_progress'];
    enquiries = enquiries.filter((e) => active.includes(e.status));
  } else if (status) {
    enquiries = enquiries.filter((e) => e.status === status);
  }
  // "My enquiries" view: filter to a specific rep's assignments.
  if (assignedTo) {
    enquiries = enquiries.filter((e) => e.assignedTo === assignedTo);
  }

  const items = enquiries.map((e) => ({
    id: e.id,
    from: e.from,
    text: e.text,
    language: e.language,
    status: e.status,
    receivedAt: e.receivedAt,
    matchedFaqId: e.matchedFaqId || null,
    assignedTo: e.assignedTo || null,
    assignedAt: e.assignedAt || null,
    resolvedAt: e.resolvedAt || null,
    resolvedBy: e.resolvedBy || null,
    escalationReason:
      e.status === 'pending' || e.status === 'assigned'
        ? (escalationFor(e.id) || {}).reason || null
        : null,
  }));

  return res.status(200).json({ enquiries: items, count: items.length, reps: REP_ROSTER });
}

/**
 * GET /api/enquiries/:id
 * Full detail including the original message, detected language, and why it
 * was escalated (Req 5.2).
 */
function getEnquiry(req, res) {
  const { id } = req.params;
  const enquiry = store.get('enquiries', id);
  if (!enquiry) {
    return res.status(404).json({ error: 'not_found', message: `Enquiry ${id} not found` });
  }
  const escalation = escalationFor(id);
  return res.status(200).json({
    enquiry: {
      ...enquiry,
      escalation: escalation
        ? { id: escalation.id, reason: escalation.reason, status: escalation.status, createdAt: escalation.createdAt }
        : null,
    },
  });
}

/**
 * POST /api/enquiries/:id/resolve
 * Body: { resolvedBy }
 * Marks the enquiry resolved, records who resolved it, and resolves any linked
 * escalation record (Req 5.3).
 */
function resolveEnquiry(req, res) {
  const { id } = req.params;
  const enquiry = store.get('enquiries', id);
  if (!enquiry) {
    return res.status(404).json({ error: 'not_found', message: `Enquiry ${id} not found` });
  }

  const resolvedBy =
    req.body && typeof req.body.resolvedBy === 'string' && req.body.resolvedBy.trim() !== ''
      ? req.body.resolvedBy.trim()
      : 'unknown';
  const resolvedAt = new Date().toISOString();

  const updated = store.update('enquiries', id, {
    status: 'resolved',
    resolvedAt,
    resolvedBy,
  });

  // Resolve the linked escalation record too.
  const escalation = escalationFor(id);
  if (escalation && escalation.status !== 'resolved') {
    store.update('escalations', escalation.id, { status: 'resolved', resolvedAt, resolvedBy });
  }

  return res.status(200).json({ enquiry: updated });
}

/** Round-robin: pick the next rep by fewest currently-open assignments. */
function nextRoundRobinRep() {
  const open = store.list('enquiries', {
    filter: (e) => e.assignedTo && (e.status === 'assigned' || e.status === 'in_progress'),
  });
  const load = {};
  for (const rep of REP_ROSTER) load[rep] = 0;
  for (const e of open) if (load[e.assignedTo] != null) load[e.assignedTo] += 1;
  // Choose the rep with the smallest open load; ties resolve by roster order.
  return REP_ROSTER.reduce((best, rep) => (load[rep] < load[best] ? rep : best), REP_ROSTER[0]);
}

/**
 * POST /api/enquiries/:id/assign
 * Body: { assignTo?, roundRobin?, notifyCustomer? }
 * Assigns an escalated enquiry to a named rep (assignTo) or, when roundRobin is
 * true or no name is given, to the next available rep. Sets status 'assigned',
 * records assignedTo/assignedAt, and (optionally) tells the customer who will
 * assist them. This is the pending -> assigned step of the human handoff.
 */
async function assignEnquiry(req, res) {
  // eslint-disable-next-line global-require
  const sender = require('../services/whatsapp/sender');
  // eslint-disable-next-line global-require
  const i18n = require('../services/i18n.service');
  const { id } = req.params;
  const enquiry = store.get('enquiries', id);
  if (!enquiry) {
    return res.status(404).json({ error: 'not_found', message: `Enquiry ${id} not found` });
  }

  const body = req.body || {};
  const named = typeof body.assignTo === 'string' ? body.assignTo.trim() : '';
  let rep;
  if (named && REP_ROSTER.includes(named)) {
    rep = named;
  } else if (body.roundRobin || !named) {
    rep = nextRoundRobinRep();
  } else {
    // A name was given that is not on the roster — accept it as a free-text rep.
    rep = named;
  }

  const assignedAt = new Date().toISOString();
  const updated = store.update('enquiries', id, {
    status: 'assigned',
    assignedTo: rep,
    assignedAt,
  });

  // Keep the linked escalation record pointing at the handling rep.
  const escalation = escalationFor(id);
  if (escalation) {
    store.update('escalations', escalation.id, { assignedTo: rep, assignedAt });
  }

  // Optionally let the customer know who will assist them (default: yes).
  const notify = body.notifyCustomer !== false;
  let noteSent = false;
  if (notify) {
    const lang = enquiry.language || 'en';
    const note = i18n.t(lang, 'assigned_note', { rep });
    try {
      await sender.send(enquiry.from, note);
      // Record the note in the customer's thread so the chat can display it.
      store.create(
        'enquiries',
        {
          from: enquiry.from,
          text: `[assigned→customer] ${note}`,
          reply: note,
          direction: 'outbound',
          author: 'rep',
          repName: rep,
          status: 'auto_answered',
          menuRoute: 'rep_reply',
          inReplyTo: id,
          receivedAt: assignedAt,
        },
        'msg'
      );
      noteSent = true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[enquiry] assigned note send failed:', err.message);
    }
  }

  return res.status(200).json({ ok: true, enquiry: updated, assignedTo: rep, notifiedCustomer: noteSent });
}

/**
 * POST /api/enquiries/clear
 * Body: { scope: 'resolved' | 'closed' }
 * Clears finished enquiries so the dashboard stays short. It is deliberately
 * SAFE — it never removes items that still need action:
 *   - 'resolved' (default): removes only resolved enquiries.
 *   - 'closed': removes resolved AND auto_answered items (the demo/chatter
 *     noise), including rep→customer outbound message records.
 * Active items (pending / assigned / in_progress) are always kept.
 */
function clearHistory(req, res) {
  const scope = req.body && req.body.scope === 'closed' ? 'closed' : 'resolved';
  const all = store.list('enquiries');

  // What counts as "removable" for this scope. Active states are never removed.
  const removable = (e) => {
    if (e.status === 'resolved') return true;
    if (scope === 'closed' && e.status === 'auto_answered') return true;
    return false;
  };
  const keep = all.filter((e) => !removable(e));
  const removed = all.length - keep.length;

  store.reset('enquiries', keep);
  return res.status(200).json({ ok: true, scope, removed, remaining: keep.length });
}

/**
 * POST /api/enquiries/:id/reply
 * Body: { text, repName }
 * A rep sends a message to the customer. The message is delivered via the
 * sender (simulated: recorded; cloud: real WhatsApp) and stored as an outbound
 * rep message in the customer's thread so the chat page can display it. The
 * enquiry is marked `in_progress` (a human is now handling it) and the
 * responding rep is recorded.
 */
async function replyToEnquiry(req, res) {
  // eslint-disable-next-line global-require
  const sender = require('../services/whatsapp/sender');
  const { id } = req.params;
  const enquiry = store.get('enquiries', id);
  if (!enquiry) {
    return res.status(404).json({ error: 'not_found', message: `Enquiry ${id} not found` });
  }

  const text =
    req.body && typeof req.body.text === 'string' && req.body.text.trim() !== ''
      ? req.body.text.trim().slice(0, 2000)
      : null;
  if (!text) {
    return res.status(400).json({ error: 'invalid', message: 'A non-empty reply text is required.' });
  }
  // Prefer an explicit repName; otherwise fall back to the assigned rep.
  const repName =
    req.body && typeof req.body.repName === 'string' && req.body.repName.trim() !== ''
      ? req.body.repName.trim()
      : enquiry.assignedTo || 'Sales Rep';

  const sentAt = new Date().toISOString();

  // Deliver via the active channel (simulated records it; cloud calls the API).
  try {
    await sender.send(enquiry.from, text);
  } catch (err) {
    // Non-fatal for the demo: the message is still stored for the chat to poll.
    // eslint-disable-next-line no-console
    console.error('[enquiry] rep reply send failed:', err.message);
  }

  // Store the rep's message as an outbound record in the customer's thread.
  const message = store.create(
    'enquiries',
    {
      from: enquiry.from,
      text: `[rep→customer] ${text}`,
      reply: text,
      direction: 'outbound',
      author: 'rep',
      repName,
      status: 'auto_answered',
      menuRoute: 'rep_reply',
      inReplyTo: id,
      receivedAt: sentAt,
    },
    'msg'
  );

  // Mark the original enquiry as being handled by a human. Preserve/record the
  // assignment: if it was unassigned, replying claims it for this rep.
  store.update('enquiries', id, {
    status: 'in_progress',
    handledBy: repName,
    handledAt: sentAt,
    assignedTo: enquiry.assignedTo || repName,
    assignedAt: enquiry.assignedAt || sentAt,
  });

  return res.status(200).json({ ok: true, messageId: message.id, from: enquiry.from, text, repName, sentAt });
}

/**
 * GET /api/messages/:from?since=<iso>
 * Returns rep→customer messages for a customer, newest last, optionally only
 * those created after `since`. The customer chat page polls this so a rep's
 * reply appears live in the customer's thread.
 */
function getMessagesForCustomer(req, res) {
  const { from } = req.params;
  const since = req.query && req.query.since ? String(req.query.since) : null;
  const messages = store
    .list('enquiries', {
      filter: (e) => e.from === from && e.author === 'rep' && e.menuRoute === 'rep_reply',
      sort: (a, b) => String(a.receivedAt).localeCompare(String(b.receivedAt)),
    })
    .filter((m) => (since ? String(m.receivedAt) > since : true))
    .map((m) => ({ id: m.id, text: m.reply, repName: m.repName || 'Sales Rep', sentAt: m.receivedAt }));
  return res.status(200).json({ messages, count: messages.length });
}

module.exports = {
  REP_ROSTER,
  listEnquiries,
  getEnquiry,
  resolveEnquiry,
  assignEnquiry,
  clearHistory,
  replyToEnquiry,
  getMessagesForCustomer,
};
