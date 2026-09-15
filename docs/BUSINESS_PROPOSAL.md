<div style="text-align: center; padding-top: 100px;">

# Business Proposal

## AI-Powered WhatsApp Conversational Commerce Platform

**BIS Computer Services — Digital Transformation of Customer Engagement**

<br><br>

| | |
|---|---|
| **Project Owner** | Alvin |
| **Content Admin** | Noel |
| **Lead Sales Rep** | Puay Sim |
| **DevOps** | Peter |

<br><br>

**Prepared for:** Management / Coursework Submission
**Delivery method:** Built in the Kiro IDE (spec-driven: requirements → design → tasks) with steering rules and automation hooks
**Live deployment:** AWS Lightsail (Ubuntu) — `http://52.77.234.193:3000`
**Date:** September 2026

</div>

<div style="page-break-after: always;"></div>

## Table of Contents

1. Executive Summary
2. The Business Need (Problem Statement)
3. Assumptions
4. Chosen Domain and Scope
5. Mock-up Data
6. The Proposed Solution — Agent Design
7. End-to-End Process Flow
8. Feature Walkthrough (with Evidence)
9. Why This Method — Justification
10. Business Value and ROI
11. Controls, Risks and Human Oversight
12. Delivery Plan and Team
13. Success Measures
14. Roadmap and Long-Run Strategy
15. Conclusion

---

## 1. Executive Summary

BIS Computer Services is a computer-hardware retailer and repair business whose customers increasingly prefer to interact over WhatsApp. Today, those conversations are handled manually by a small sales team, one message at a time. This proposal sets out a **digital-transformation initiative**: an AI-powered WhatsApp assistant that absorbs the repetitive enquiry load, operates 24 hours a day and 7 days a week, replies in the customer's own language, and — crucially — carries a customer through the **entire commercial journey inside the chat**: enquiry, product recommendation, quotation, secure payment, order and invoice, delivery tracking, warranty check, and repair booking. When the assistant is uncertain or the customer asks for a person, a human sales representative takes over the same conversation live from a dashboard console.

The core outcome is simple to state: **reduce manpower load on repetitive work, extend service coverage to 24/7, and convert more enquiries into completed sales — without losing the human touch where it matters.** The solution is already built and deployed live, is verified by 348 automated tests across 19 suites, and is designed with swappable edges so the simulated channels used for the demonstration (WhatsApp sender and payment gateway) can be replaced with live providers without rewriting the business logic.

**Why this is digital transformation, not just a chatbot.** A chatbot answers questions. This platform re-shapes how the business operates: it takes a channel that was a manual cost centre (reps typing repetitive replies) and turns it into an automated, always-on revenue and service channel that spans the whole customer lifecycle. The transformation has three dimensions — **automation** (the routine load is absorbed by software), **availability** (the shop is effectively open 24/7 on WhatsApp), and **data** (every quotation, order, invoice, booking, and warranty interaction is now captured structurally, ready to inform future decisions). The human team is not displaced; it is elevated to the work that genuinely needs judgement, with a live console to step into any conversation. In short, the proposal is about changing the economics of customer engagement, not adding a gadget.

> **[SCREENSHOT 1 — Hero / welcome]**
> Capture `http://52.77.234.193:3000/chat.html` showing the branded welcome message and the numbered quick menu (options 1–9 plus Language). This is the customer's first impression of the 24/7 assistant.
> `![Welcome screen and quick menu](../screenshots/01-welcome-menu.png)`

---

## 2. The Business Need (Problem Statement)

**How I understand the need.** BIS's sales representatives receive a high volume of WhatsApp enquiries every day. The large majority are repetitive and clearly answerable: *"How much is this RAM?"*, *"Do you have the RTX 5070 in stock?"*, *"How much is delivery?"*, *"What time do you open?"*, *"Is my graphics card still under warranty?"*, *"Can someone come and fix my PC?"*. Answering each one by hand consumes most of the working day. That creates three concrete business problems:

1. **Manpower load.** Skilled sales staff spend hours retyping the same answers instead of selling. Their time — the most expensive resource in the business — is consumed by low-value, repetitive work.
2. **No after-hours coverage.** Enquiries that arrive in the evening or on weekends sit unanswered until the next working day. In a market where a buyer can message three shops at once, a slow reply is a lost sale.
3. **Language friction.** Customers write in English, Bahasa Melayu, and Chinese, sometimes mixed in one sentence. A rushed human reply in the wrong language slows or loses the sale.

Underneath these is a single root cause: **there is no automated first layer to absorb routine enquiries and to move a ready buyer through to payment and fulfilment.** Every step currently depends on a human being awake and available.

**Quantifying the load.** Consider a modest daily volume of 120 WhatsApp enquiries. If 65% are repetitive (price, stock, hours, delivery, warranty, "where is my order") and each takes a rep an average of three minutes to read, look up, and answer, that is roughly 78 enquiries × 3 minutes ≈ **3.9 hours of rep time every day** spent on work that does not require judgement — close to half a full-time role, before counting the context-switching cost of being interrupted mid-sale. The remaining 35% (genuine sales conversations, complex faults, negotiations) is exactly the work that *does* deserve a skilled human, yet it competes for attention with the repetitive stream. The business is, in effect, paying premium rates for routine typing while starving high-value work of focus.

**The compounding cost of latency.** In hardware retail the buyer is often price-comparing across several shops in the same chat session. The first shop to give a clear, correct, priced answer frequently wins the order. When a message lands at 9pm and is answered at 10am, the sale is usually already gone. There is no way to quantify lost sales precisely, but every retailer recognises the pattern: after-hours silence is a leak in the funnel that no amount of daytime effort can plug.

**How I resolve the need.** The proposal introduces exactly that automated first layer — a hybrid AI assistant on the WhatsApp line — and then extends it beyond answering into a full commerce and service channel, so the business does not merely deflect questions but **completes transactions and after-sales service 24/7**. The design principle throughout is *people before technology*: automation handles the repetitive and clearly-answerable; anything uncertain, sensitive, or explicitly human-requested is escalated to a rep who can take over the live conversation. The intent is not to remove people from customer service but to **reallocate their time** — from routine typing to selling and solving — and to ensure the shop is "open" on WhatsApp even when the shutters are down.

> **[SCREENSHOT 2 — A repetitive enquiry answered instantly]**
> In the chat, type `how much is a keyboard`. Capture the numbered shortlist of products with prices and live stock. This is the repetitive-enquiry load being absorbed automatically.
> `![Instant product answer with prices and stock](../screenshots/02-product-enquiry.png)`

---

## 3. Assumptions

A proposal is only as sound as the assumptions behind it. These are stated explicitly so management can validate them:

- **Channel.** WhatsApp is the primary customer channel. For the build and demonstration, the WhatsApp connection is **simulated** (a webhook plus a browser chat page) so progress is not blocked on Meta Business API approval; the real WhatsApp Business Cloud API is a swap-in behind the same interface.
- **Languages.** Three languages cover the customer base: **English (default), Bahasa Melayu, and Chinese (Simplified)**. The set can grow without changing the core flow.
- **Catalogue and data ownership.** Product prices, stock, delivery records, and warranty records are provided and approved by the business. Prices are treated as indicative for high-value orders and confirmed by a rep. Unclear or ambiguous records are excluded rather than guessed.
- **Payment.** For the development/coursework build, payment uses a **simulated gateway** (no real money moves). It is designed to swap to a real provider (Stripe, HitPay, or a bank PayNow integration) behind the same interface. Card data, when live, is handled by the PCI-compliant provider, never stored by our app.
- **Single trusted rep for the demo.** The dashboard assumes a trusted internal rep; production would add rep authentication.
- **Runtime and hosting.** Node.js on an AWS Lightsail Ubuntu instance, kept alive by PM2. Only the app port is open; SSH is key-only.
- **Data sensitivity.** All customer and warranty records used in the demonstration are **synthetic** (fictional names, emails, serials), so they are safe to seed and display.
- **Honesty over coverage.** The assistant is allowed to say "I'm not sure, let me get a person" — a deliberate assumption that a correct escalation beats a confident wrong answer.

---

## 4. Chosen Domain and Scope

The brief allows choosing a specific domain to make the solution concrete. I have chosen **computer-hardware retail and repair (BIS Computer Services)** because it exercises the full range of an SME's customer journey — pre-sales enquiry, sales, payment, fulfilment, and after-sales service — which makes it an ideal showcase for digital transformation.

**In scope (built and deployed):**

- Auto-answering of FAQs (hours, delivery, payment, warranty, location) in three languages.
- Product price and **live stock** enquiry across a real catalogue.
- Budget-aware **DIY PC package** selection with itemised quotation.
- **Conversational commerce:** quotation → confirm → payment → order → invoice → delivery tracking.
- **Online repair booking:** onsite and carry-in, each producing a confirmed booking reference.
- **Warranty check** by serial/invoice/name, with a direct handoff into repair booking.
- **Delivery-status self-service** by order number, name, or phone.
- **Image identification** of an uploaded product photo (with an honest fallback).
- **Human-in-the-loop:** escalation plus a two-way dashboard console where a rep replies live.
- Numbered language picker and universal `0`/`menu`/`back` navigation.

**Out of scope for now (roadmap):** live WhatsApp Business API cut-over, a live payment gateway, dashboard authentication, and a managed database — all designed for but deferred behind swappable interfaces.

> **[SCREENSHOT 3 — The menu covering the whole journey]**
> Capture the full welcome menu again, this time annotate the nine options (Components, DIY PC, Carry-in, Onsite, Product Availability, Talk to Sales, Delivery Status, Warranty Status, About Us) to show the breadth of the domain covered.
> `![Menu covering sales, service, delivery and warranty](../screenshots/03-menu-scope.png)`

---

## 5. Mock-up Data

To make the demonstration realistic while keeping customer privacy safe, the system is seeded with representative **mock data** across the domain. All personal data is synthetic.

| Dataset | Volume | Purpose | Key fields |
|---|---|---|---|
| **Product catalogue** | **979 items** (829 components + 150 DIY PC packages) | Price and live-stock enquiry, quotation, packages | name, category, brand, price (SGD), stock status, quantity |
| **CPUs** (within components) | **72** processors from a 2026 price list | Natural-language CPU queries ("i5 14th gen") | model, family, brand |
| **Delivery records** | **60** | Delivery-status self-service | order no, customer, status, ETA, driver, items, total |
| **Warranty records** | **50** customer-and-warranty rows | Warranty check + service handoff | serial, invoice, purchase/expiry dates, coverage, service type |
| **FAQ knowledge base** | starter set in en/ms/zh | Auto-answers | intent, per-language keywords and answers |
| **Orders / invoices / payments / bookings** | created live | Generated as customers buy or book | daily-sequenced references |

Every catalogue item is stocked `in_stock` at a uniform **100 units**, which drives the Product Availability feature (a customer can ask about any item and see both price and units in stock). Product records deliberately carry **no supplier or third-party company name** — only brand, model, and price. The 21 product categories span CPUs, motherboards, GPUs, SSDs, RAM, cases, power supplies, coolers, monitors, peripherals, and networking.

Five CSV exports are produced for record-keeping: `components.csv` (829), `pc_packages.csv` (150), `deliveries.csv` (60), `warranty.csv` (50), and `test_suites.csv` (19).

> **[SCREENSHOT 4 — Data evidence]**
> Capture a slice of the exported `warranty.csv` (or `products.json`) open in a spreadsheet/editor, showing the columns and a few rows. This evidences the mock dataset.
> `![Warranty / catalogue mock data](../screenshots/04-mock-data.png)`

---

## 6. The Proposed Solution — Agent Design

The solution is a **hybrid assistant**: a deterministic core for the common, clearly-answerable cases, an AI reasoning layer for the harder ones, and a human escalation path for anything uncertain. It is not a pure open-ended chatbot (which risks confident wrong answers), and not a rigid keypad menu (which frustrates people who type naturally). It is both — a numbered menu *and* free-text understanding — with people always in the loop.

**The layers:**

- **Channel** — a WhatsApp webhook (Node.js / Express). Simulated now, real Cloud API later, behind one `sender` interface.
- **Deterministic core** — FAQ matching, product search and quotation, delivery lookup, warranty lookup, booking, and payment. Pure, testable functions that answer only from approved data.
- **AI reasoning layer** — the OpenClaw gateway interprets natural language and images where deterministic matching is insufficient. It augments; it never overrides price or stock.
- **Human layer** — escalation plus a two-way dashboard console.
- **Data store** — a JSON store behind an abstraction, swappable to a managed database.

**The agent roles** (an agentic-workflow view):

| Agent / role | Responsibility | Escalates when |
|---|---|---|
| Webhook controller | Receive, validate, sanitize, record, and route each message | Missing fields → reject |
| Language service | Detect en/ms/zh with confidence | Low confidence → default English |
| FAQ / product / warranty / delivery services | Answer from approved data | Below confidence threshold → hand to a person |
| Payment & booking services | Turn a confirmed intent into an order or appointment | Only act on complete, validated input |
| Escalation service | Decide auto-answer vs human | No confident answer, or explicit human request |
| Sender (simulated/cloud) | Deliver the reply | Delivery error → log, mark pending |
| Human sales rep | Take over the conversation via the dashboard | Anything the bot could not confidently handle |

The guiding rule is embedded in the escalation service: an explicit "talk to a person" request **always** wins over automation, and any uncertainty routes to a human rather than a guess.

> **[SCREENSHOT 5 — Hybrid in action: natural language]**
> Type a natural-language query such as `Intel processor generation 14` or `gaming pc around 2000`. Capture the assistant interpreting it and returning relevant results — showing the AI/deterministic hybrid, not just menu taps.
> `![Natural-language understanding](../screenshots/05-natural-language.png)`

---

## 7. End-to-End Process Flow

Every inbound message travels the same pipeline, which keeps behaviour predictable and testable. The high-level flow:

```
Customer message (WhatsApp / chat page)
        │
        ▼
  Receive & sanitize ──► reject if missing sender/text
        │
        ▼
  Record enquiry (timestamp, sender, text)
        │
        ▼
  Detect language (en / ms / zh)  ──► sticky picker choice overrides
        │
        ▼
  HOME / BACK command?  ──► yes ─► main menu / previous step
        │ no
        ▼
  Route by conversation state + content:
   ├─ Menu option (1–9) or greeting
   ├─ Language picker
   ├─ Product / package enquiry ─► shortlist ─► select ─► quantity ─► QUOTATION
   │                                                          │
   │                                              confirm ─► PAYMENT ─► ORDER + INVOICE ─► DELIVERY
   ├─ Booking (onsite / carry-in) ─► service/date/slot/details ─► BOOKING REF
   ├─ Warranty (serial / invoice) ─► record ─► 1 onsite · 2 carry-in · 3 service
   ├─ Delivery status (order no / name / phone) ─► status + ETA + driver
   └─ Image upload ─► identify ─► priced shortlist (or category picker fallback)
        │
        ▼
  Confident answer?  ── no ─► ESCALATE ─► localized ack + dashboard (pending)
        │ yes                                   │
        ▼                                       ▼
  Reply to customer                    Human rep replies live (in_progress ─► resolved)
        │
        ▼
  Log outcome (auto-answered / pending / in_progress / resolved)
```

**The commerce sub-flow** (the heart of the digital transformation) turns an enquiry into a completed order in nine steps: enquiry → recommendation → selection → quotation (`Q-YYYYMMDD-NNN`) → confirm → payment method (Card / PayNow) → secure pay link → payment confirmation (`ORD-` + `INV-`) → delivery order (`DO-`), trackable via option 7. The four references share one daily running number so a customer's quotation, order, invoice, and delivery cross-reference cleanly.

> **[SCREENSHOT 6 — Process flow evidence: quotation]**
> Continue the flow from Screenshot 2: reply `1` then `2` to reach a quotation. Capture the quotation showing item, unit price, quantity, stock, and subtotal.
> `![Quotation step in the commerce flow](../screenshots/06-quotation.png)`

---

## 8. Feature Walkthrough (with Evidence)

This section maps each capability to the business need it serves and points to the evidence to capture.

### 8.1 Conversational commerce (payment → order → delivery)

After a quotation the customer types "confirm" and is offered **Card** or **PayNow / SGQR**. Choosing one returns a secure (test) payment link; completing payment produces an order, an invoice, and a delivery order with a driver and ETA — all in the chat. This is the single biggest transformation: the channel now *closes sales*, not just answers questions.

> **[SCREENSHOT 7 — Payment journey]**
> After a quotation, type `confirm`, then `1` (Card). Capture the payment-method offer and the secure pay link; then open the `/pay/...` page and capture the "✅ Payment received" confirmation with the ORD / INV / DO references.
> `![Payment confirmation with order, invoice, delivery](../screenshots/07-payment-confirmation.png)`

### 8.2 Online repair booking (onsite and carry-in)

Options 4 and 3 are structured, numbered bookings. Onsite: service type → date → slot → details → `OS-` CONFIRMED. Carry-in: date → slot → device → problem → `CI-` Awaiting Drop-Off. This moves appointment-setting off the phone and into 24/7 self-service.

> **[SCREENSHOT 8 — Booking confirmation]**
> Type `4` and step through `1` → `1` → `3` → details. Capture the "✅ Appointment confirmed" card with the `OS-` reference.
> `![Onsite booking confirmation](../screenshots/08-onsite-booking.png)`

### 8.3 Warranty check with service handoff

A customer sends a serial (e.g. `SG26-ASU-0003-22173`) and instantly sees the product, status, expiry, and coverage, then can book service directly. This turns a common after-sales phone call into a self-service interaction.

> **[SCREENSHOT 9 — Warranty lookup]**
> Type `8`, then `SG26-ASU-0003-22173`. Capture the warranty reply with the 1/2/3 service options.
> `![Warranty check result](../screenshots/09-warranty-check.png)`

### 8.4 Delivery-status self-service

Entering an order number, name, or phone returns the current status, driver ETA, arranged window, and driver contact — removing peak-hour hotline calls.

> **[SCREENSHOT 10 — Delivery status]**
> Type `7`, then `DO202600003`. Capture the delivery-status reply.
> `![Delivery status lookup](../screenshots/10-delivery-status.png)`

### 8.5 Multilingual service and easy navigation

The whole experience is trilingual. A numbered language picker (reply 1/2/3) makes switching effortless, and universal `0`/`menu`/`back` commands let a customer navigate from any step.

> **[SCREENSHOT 11 — Chinese / Malay reply]**
> Choose 中文 from the language picker, then run a product enquiry. Capture the reply in Chinese (computer terms stay in English).
> `![Multilingual reply](../screenshots/11-multilingual.png)`

### 8.6 Human-in-the-loop two-way console

When the bot escalates, the enquiry appears on the rep dashboard with the full conversation. The rep **replies directly**, and the message appears live in the customer's chat as a "human" bubble; the enquiry moves to `in_progress` and is later resolved with attribution.

> **[SCREENSHOT 12 — Live human takeover]**
> Open the chat and the dashboard side by side. In the chat type `I want to speak to a person`; in the dashboard open the pending enquiry and send a reply. Capture both windows showing the rep's reply arriving in the customer's chat.
> `![Two-way human-in-the-loop console](../screenshots/12-human-in-the-loop.png)`

---

## 9. Why This Method — Justification

Several design choices deserve justification, because each was a deliberate trade-off in service of the business need.

**Why hybrid (deterministic + AI), not pure AI.** For a retailer, a *confidently wrong* price or stock answer is worse than no answer — it erodes trust and can commit the business to a loss. So prices, stock, warranty, and delivery come only from approved data through deterministic lookups; the AI layer is used where language is genuinely ambiguous (natural-language CPU queries, image identification) and never overrides the numbers. This gives the friendliness of AI with the reliability of a database.

**Why simulated edges (WhatsApp + payment) for now.** Waiting on Meta Business approval or a payment-provider contract would have blocked all progress. By building against simulated edges behind clean interfaces, the full business logic was completed, tested, and demonstrated end-to-end — and switching to live providers later touches only the edge, not the core. This is standard, defensible engineering that de-risks the go-live.

**Why numbered menus *and* free text.** Some customers tap; some type. Supporting both maximises accessibility and speed while the numbered structure keeps flows unambiguous and testable.

**Why human-in-the-loop is central, not optional.** The goal is to *reduce* manpower load, not eliminate the human relationship. Automating the repetitive 60–70% frees reps to spend their time on the high-value 30–40% — and the two-way console means the handoff is seamless from the customer's perspective. This is the "people before technology" principle operationalised.

**Why 348 automated tests.** In a system that quotes prices and takes (simulated) payments, correctness is a business requirement, not a nicety. A single `npm test` proves every flow — commerce, booking, warranty, navigation, and human handoff — still works after each change, which is what makes the platform safe to evolve. This matters commercially: the ability to add a feature (say, a live payment gateway) *without fear of silently breaking the quotation flow* is what keeps the cost of future change low.

**Why a spec-driven build in Kiro.** The system was built through an explicit requirements → design → tasks workflow, reinforced by steering rules (coding and behavioural standards captured once and applied throughout) and automation hooks (tests run automatically on every file save and after each task). For a small business this is not bureaucracy — it is how a solution stays maintainable when the person who built it moves on. The requirements are written as testable acceptance criteria, so "done" is objective, and the design documents record *why* each decision was made, so a future developer can change the system safely.

**Why the store is abstracted behind an interface.** Today the data lives in simple JSON files, which is perfect for a zero-setup demonstration and low volume. Rather than hard-code that choice everywhere, all data access goes through one small `store` interface. The justification is purely economic: when volume grows, moving to SQLite or a managed database is a change in one file, not a rewrite — so the initial simplicity does not become a future liability.

---

## 10. Business Value and ROI

The value proposition maps directly to the three problems in Section 2.

**1. Reduced manpower load.** If the assistant auto-answers even 50–60% of routine enquiries (a conservative target), reps reclaim a large share of each day for selling and complex service. The saving compounds: every quotation, booking, warranty check, and delivery lookup the customer self-serves is a task a rep did not have to do.

**2. 24/7 coverage and captured revenue.** The assistant never sleeps. Evening and weekend enquiries — previously lost or delayed — are now answered instantly and can proceed all the way to a paid order. In a competitive market, being the shop that replies (and can transact) at 11pm is a direct revenue advantage.

**3. Faster, consistent, multilingual service.** First responses are effectively instant, always in the customer's language, and always consistent (no variation between reps or moods). Consistency also protects the brand: the bot never gives a rude or off-brand reply.

**4. A digital-transformation platform, not a point tool.** Because the channel now spans enquiry → sales → payment → delivery → after-sales, the business gains structured data at every step (orders, invoices, bookings, warranty interactions) that can later feed a CRM and analytics — the foundation for data-driven decisions.

**5. Low, controllable cost.** It runs on a single low-cost Lightsail instance with a JSON store; there is no heavy infrastructure to justify. Costs scale only when volume does, and the swappable data layer means scaling up is a contained change.

**A concrete ROI illustration.** Using the Section 2 figures — roughly 3.9 hours of rep time per day on repetitive enquiries — automating 60% of that recovers about **2.3 hours per day**, or over **11 hours per working week**, of skilled sales time. Redirected to selling and complex service, that is time that directly generates revenue rather than consuming it. On the cost side, the platform runs on a single low-cost cloud instance; there is no per-seat licensing and no heavy infrastructure. Even before counting captured after-hours sales, the labour reallocation alone typically pays for the running cost many times over. The after-hours capture is upside on top: enquiries that previously reached no one are now answered — and can be paid — around the clock.

**Strategic value beyond the numbers.** Three less obvious benefits matter in the long run. First, **brand consistency**: the assistant always replies promptly, politely, and in the correct language, so the quality of service no longer varies with which rep is on shift or how busy the day is. Second, **resilience**: the business is no longer dependent on a single person's availability to keep the WhatsApp line moving; the automated layer carries the routine load even during staff leave or peak periods. Third, **institutional knowledge**: answers, prices, warranty terms, and service policies are captured in one maintained knowledge base rather than living in individual reps' heads, which reduces onboarding time for new staff and protects the business when people leave.

Qualitatively, the "hard to reverse a bad first reply" risk is mitigated by the honesty guardrails; quantitatively, the measures in Section 13 make the returns auditable.

---

## 11. Controls, Risks and Human Oversight

The safety story is built in, not bolted on:

- **Confident wrong answer** → confidence threshold; below it, always escalate. Prices/stock only from approved data. Owner: Content Admin.
- **Wrong language** → default-to-English with a flagged fallback. Owner: Project Owner.
- **Payment integrity** → nothing is marked paid without the (simulated) gateway callback; order/invoice/delivery are created only after payment; amounts always come from the stored quotation; the callback is idempotent. Live go-live delegates card handling to a PCI-compliant provider.
- **Warranty / PII** → synthetic demo data; a record is returned only to a query that matches it; the system never lists other customers' records.
- **Reliability** → an error on one enquiry escalates and logs rather than crashing the service.
- **Secrets** → kept in `.env`, never committed; SSH key-only; only the app port open.

**Human approval points** are explicit: go-live to real WhatsApp and to a live payment gateway require Project-Owner sign-off; FAQ content changes require Content-Admin review; server/firewall changes require DevOps approval; every escalation is closed by a rep with attribution; and any complaint or sensitive case is always routed to a person.

---

## 12. Delivery Plan and Team

Delivered in three one-week increments (21 days), each producing a usable result:

- **Week 1 — Tested core:** pipeline, language detection, FAQ matching, escalation; verified by `npm test`.
- **Week 2 — Running app with UI:** webhook pipeline, product/quotation, delivery lookup, the chat and dashboard pages.
- **Week 3 — Deploy and enhance:** AWS deployment; then the conversational-commerce journey, online booking, warranty check, image ID, multilingual picker, navigation, and the two-way human console.

The team: **Alvin** (Project Owner — delivery, go-live sign-off, thresholds), **Noel** (Content Admin — FAQ knowledge base), **Puay Sim** (Lead Sales Rep — escalations and live takeover), **Peter** (DevOps — server, deployment, secrets).

---

## 13. Success Measures

| Metric | Baseline | Target | How measured |
|---|---|---|---|
| Repetitive enquiries auto-answered | 0% (all manual) | 50–70% | auto-answered vs total |
| First-response time | minutes–hours | < 5 seconds | timestamp difference |
| After-hours enquiries captured | missed until next day | 100% acknowledged | out-of-hours logs |
| Enquiry-to-order conversion | phone/manual only | measurable in-chat orders | order records created |
| Delivery-status hotline calls | high at peak | measurable reduction | lookup counts |
| Price/stock accuracy | rep-dependent | 100% correct or escalate | audit vs data |
| Test-suite health | none | 100% passing | `npm test` (348/19) |

---

## 14. Roadmap and Long-Run Strategy

The long-run strategy is to graduate each simulated edge to production and to turn the captured data into intelligence:

- **Live WhatsApp Business Cloud API** — swap the sender, add Meta webhook verification.
- **Live payment gateway** — Stripe / HitPay / PayNow behind the same `payment.service` interface.
- **CRM and analytics** — feed orders, bookings, and warranty interactions into a CRM; report on auto-answer rate, conversion, and rep time saved.
- **Reliable image recognition** — a dedicated vision key so photo-to-product works consistently.
- **Managed database and dashboard authentication** — as volume and the team grow.
- **Broader languages and smarter matching** — added only where they measurably improve answers, always gated by the escalate-when-unsure rule.

Because every one of these sits behind an interface the current system already uses, the business can adopt them incrementally, at controlled cost and risk.

---

## 15. Conclusion

This proposal addresses a real, costly business need — the manual, after-hours-blind, multilingual enquiry load on a small sales team — with a solution that does more than deflect questions. It moves the **entire customer journey**, from first enquiry to payment, delivery, warranty, and repair booking, into a single 24/7 conversational channel, while keeping a human able to step in and take over at any moment. The method is justified by a hybrid design that pairs AI friendliness with database reliability, swappable edges that de-risk go-live, and 348 automated tests that make correctness auditable. The business value is direct: less manpower spent on the repetitive, more revenue captured around the clock, faster and more consistent service, and a data foundation for the future. It is not a prototype on a slide — it is a working, deployed platform, ready to graduate its simulated edges to production when the business is ready.

---

### Appendix — How to capture the screenshots

All screenshots are captured from the live system. Put the PNGs in a `screenshots/` folder next to this document (create `whatsapp-sales/docs/screenshots/`) using the file names referenced above, then export to PDF.

| # | Where | Action |
|---|---|---|
| 1 | `chat.html` | Open the page — welcome + menu |
| 2 | `chat.html` | Type `how much is a keyboard` |
| 3 | `chat.html` | Welcome menu (annotate the 9 options) |
| 4 | editor/spreadsheet | Open `exports/warranty.csv` |
| 5 | `chat.html` | Type `Intel processor generation 14` |
| 6 | `chat.html` | Reply `1` then `2` → quotation |
| 7 | `chat.html` + `/pay/...` | `confirm` → `1` → open pay link → paid |
| 8 | `chat.html` | `4` → `1` → `1` → `3` → details |
| 9 | `chat.html` | `8` → `SG26-ASU-0003-22173` |
| 10 | `chat.html` | `7` → `DO202600003` |
| 11 | `chat.html` | Language → 中文 → a product enquiry |
| 12 | `chat.html` + `dashboard.html` | `I want to speak to a person` → reply from dashboard |
