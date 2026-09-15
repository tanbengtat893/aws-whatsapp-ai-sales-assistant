<div style="text-align: center; padding-top: 90px;">

# Business Proposal & Technical Write-Up

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
**Verified scale:** 979 catalogue items · 60 delivery records · 50 warranty records · 348 automated tests across 19 suites · 3 languages
**Date:** September 2026

</div>

<div style="page-break-after: always;"></div>

## How to Read This Document

This is a single, comprehensive write-up in two parts. **Part A — Business Proposal** makes the business case: the need, assumptions, chosen domain, mock data, the proposed agent solution, the process flow, justification, and business value. **Part B — Technical Write-Up** proves how it was built and how it works: requirements, architecture, every module and subtask, steering and hooks, the guided flows, testing, deployment, and results. Part A is written for a decision-maker; Part B is written for an implementer or assessor. Read Part A for *why*, Part B for *how*. Screenshot placeholders in Part A show exactly what to capture from the live system.

<div style="page-break-after: always;"></div>

## Table of Contents

**Part A — Business Proposal**
1. Executive Summary
2. The Business Need (Problem Statement)
3. Assumptions
4. Chosen Domain and Scope
5. Mock-up Data
6. The Proposed Solution — Agent Design
7. Innovation Technology Stack (OpenClaw · AWS Lightsail · Kiro)
8. End-to-End Process Flow
9. Feature Walkthrough (with Evidence)
10. Why This Method — Justification
11. Business Value and ROI
12. Controls, Risks and Human Oversight
13. Delivery Plan and Team
14. Success Measures
15. Roadmap and Long-Run Strategy
16. Part A Conclusion

**Part B — Technical Write-Up**
17. Introduction and Problem Statement (Technical)
18. User Requirements (Functional and Non-Functional)
19. Solution Design and Architecture
20. Data Design
21. Steering and Hooks (Kiro Configuration)
22. Modules and Subtasks (Implementation Detail)
23. The Guided Sales and Service Flow
24. Online Booking — Onsite and Carry-in Appointments
25. Warranty Check — Serial Lookup and Service Handoff
26. Conversational Commerce — Payment, Order and Delivery Journey
27. Multilingual Support (i18n) and Navigation
28. Image Recognition and the Honest Fallback
29. Human-in-the-Loop — The Two-Way Reply Console
30. Delivery Plan, Milestones and Team
31. Controls, Risks and Human Approval
32. Success Measures
33. Testing and Verification
34. Deployment
35. Results (Verified Figures)
36. Roadmap and Future Work
37. Overall Conclusion

Appendix — How to capture the screenshots

<div style="page-break-after: always;"></div>

# PART A — BUSINESS PROPOSAL

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

## 7. Innovation Technology Stack (OpenClaw · AWS Lightsail · Kiro)

Digital transformation is not only about *what* the platform does for customers; it is also about the *innovation technologies* that make it feasible for a small business to build, run, and evolve something this capable at low cost and low risk. Three choices stand out, and each was made for a concrete business reason rather than for novelty.

### OpenClaw — the AI reasoning layer

The assistant's intelligence for the harder, non-deterministic cases comes from **OpenClaw**, a Claude-class AI gateway. Its role is deliberately bounded: it interprets natural language that a keyword matcher cannot (for example turning "Intel processor generation 14" or "a gaming rig around two thousand" into a structured search), and it powers image understanding (identifying a product from a customer's photo). What makes this powerful for the business is that it gives the friendliness and flexibility of a modern large-language model **without handing the model control over anything that must be correct** — prices, stock, warranty status, and delivery details always come from the deterministic core and approved data. OpenClaw augments; it never overrides the numbers. This is the innovation applied responsibly: the customer gets a natural conversation, and the business keeps its guarantees. (An honest note: the vision capability is currently rate-limited on the shared gateway, so photo recognition is intermittent and the system falls back to a numbered category picker; a dedicated key or higher quota resolves this, and the code path is already in place.)

### AWS Lightsail — the always-on, low-cost cloud foundation

The platform runs on **AWS Lightsail**, a simple, predictable-cost Ubuntu cloud instance, kept alive around the clock by the PM2 process manager. Lightsail was chosen precisely because it fits an SME: it delivers genuine 24/7 cloud availability — the technical basis for the "the shop never closes on WhatsApp" promise — at a small, fixed monthly cost, without the complexity or unpredictable billing of a full cloud platform. It gives the business a real, internet-reachable deployment (the live demonstration URL) with a controlled security posture (only the app port open, SSH by key only), and it scales up in a contained way when volume grows. In short, Lightsail turns "24/7 service" from an aspiration into a running system the business can point to today.

### Kiro — the spec-driven build environment

The solution was built in the **Kiro IDE** using an AI-assisted, spec-driven workflow: **requirements → design → tasks**, reinforced by **steering files** (coding and behavioural standards captured once and applied consistently) and **automation hooks** (the test suite runs automatically on every file save and after each completed task). The business value of this is maintainability and speed: features were delivered in weekly increments with the full test suite kept green automatically, so the platform could grow — from FAQ answers, to a catalogue, to payments, to bookings, to warranty, to a human console — without regressions. Requirements written as testable acceptance criteria make "done" objective, and the recorded design decisions mean a future developer can change the system safely long after the original build. For a small business, this is what keeps the *cost of future change* low, which is often the difference between a system that thrives and one that quietly rots.

### The AI Assistant — the always-on front line

The most visible pillar of the transformation is the **AI Assistant** itself — the hybrid conversational agent that greets every customer. It is the business's new front line: it answers instantly, 24/7, in three languages, and it does not merely respond to questions but *drives outcomes* — recommending products, building quotations, taking (simulated) payment, booking repairs, checking warranties, and tracking deliveries. In transformation terms, this converts a reactive, human-bottlenecked channel into a **proactive, self-serve commerce and service surface**. The assistant absorbs the repetitive 60–70% of the workload that previously consumed rep time, and because it is deterministic where it matters and AI-assisted where that helps, it does so *without* the reputational risk of a bot that invents answers. The transformation value is threefold: **capacity** (it scales to any message volume without adding headcount), **consistency** (every customer gets the same prompt, correct, on-brand service regardless of the hour or which rep is free), and **conversion** (a ready buyer can complete a purchase in the same chat, at any time, instead of being asked to "wait for a rep").

### Human-in-the-Loop — automation with people still in control

The counterpart pillar, and the one that makes the transformation *safe* and *humane*, is the **human-in-the-loop design**. Automation here is explicitly bounded: the moment the assistant is uncertain, encounters a sensitive case, or the customer asks for a person, the conversation escalates to a human rep — and through the **two-way dashboard console**, that rep can reply directly into the same chat, live, with the customer seeing the human's message arrive seamlessly. This is transformative for two reasons. First, it changes *what people spend their day on*: reps are lifted off repetitive typing and redeployed onto the high-value 30–40% — genuine sales conversations, complex faults, negotiations — where human judgement actually earns revenue. The technology does not replace the team; it **re-tasks** it toward its most valuable work. Second, it protects the customer relationship: automation never becomes a wall the customer cannot get past, because a person is always one message away, with the full conversation context already in front of them and every handoff attributed and auditable. This is the "people before technology" principle turned into a competitive advantage — the efficiency of automation with the trust of human service.

### Why the combination is the transformation

Individually, each is a capable tool. Together they are what makes the transformation practical, powerful, and safe for an SME: the **AI Assistant** is the always-on front line that absorbs the routine and closes sales; **human-in-the-loop** keeps people in control and re-tasked to high-value work; **OpenClaw** supplies human-like understanding where it helps, without overriding the numbers that must be correct; **AWS Lightsail** supplies always-on, affordable cloud presence; and **Kiro** supplies a disciplined, testable, maintainable build. The result is an enterprise-grade customer-engagement platform — automated yet human-supervised — delivered at small-business cost and risk. That combination is the essence of accessible digital transformation: not technology for its own sake, but the right technologies arranged so a small team can serve more customers, around the clock, better than before.

> **[SCREENSHOT 13 — Technology evidence]**
> Optional: capture the health endpoint `http://52.77.234.193:3000/health` returning `{"status":"ok"}` (proof it's a live cloud service), and/or the `.kiro/specs` and `.kiro/steering` folders in the editor (proof of the spec-driven build).
> `![Live on AWS + Kiro spec-driven build](../screenshots/13-tech-stack.png)`

---

## 8. End-to-End Process Flow

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

## 9. Feature Walkthrough (with Evidence)

This section maps each capability to the business need it serves and points to the evidence to capture. (Part B, Sections 22–28, describes how each is implemented.)

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

## 10. Why This Method — Justification

Several design choices deserve justification, because each was a deliberate trade-off in service of the business need.

**Why hybrid (deterministic + AI), not pure AI.** For a retailer, a *confidently wrong* price or stock answer is worse than no answer — it erodes trust and can commit the business to a loss. So prices, stock, warranty, and delivery come only from approved data through deterministic lookups; the AI layer is used where language is genuinely ambiguous (natural-language CPU queries, image identification) and never overrides the numbers. This gives the friendliness of AI with the reliability of a database.

**Why simulated edges (WhatsApp + payment) for now.** Waiting on Meta Business approval or a payment-provider contract would have blocked all progress. By building against simulated edges behind clean interfaces, the full business logic was completed, tested, and demonstrated end-to-end — and switching to live providers later touches only the edge, not the core. This is standard, defensible engineering that de-risks the go-live.

**Why numbered menus *and* free text.** Some customers tap; some type. Supporting both maximises accessibility and speed while the numbered structure keeps flows unambiguous and testable.

**Why human-in-the-loop is central, not optional.** The goal is to *reduce* manpower load, not eliminate the human relationship. Automating the repetitive 60–70% frees reps to spend their time on the high-value 30–40% — and the two-way console means the handoff is seamless from the customer's perspective. This is the "people before technology" principle operationalised.

**Why 348 automated tests.** In a system that quotes prices and takes (simulated) payments, correctness is a business requirement, not a nicety. A single `npm test` proves every flow — commerce, booking, warranty, navigation, and human handoff — still works after each change, which is what makes the platform safe to evolve. This matters commercially: the ability to add a feature (say, a live payment gateway) *without fear of silently breaking the quotation flow* is what keeps the cost of future change low.

**Why a spec-driven build in Kiro.** The system was built through an explicit requirements → design → tasks workflow, reinforced by steering rules (coding and behavioural standards captured once and applied throughout) and automation hooks (tests run automatically on every file save and after each task). For a small business this is not bureaucracy — it is how a solution stays maintainable when the person who built it moves on. The requirements are written as testable acceptance criteria, so "done" is objective, and the design documents record *why* each decision was made, so a future developer can change the system safely.

**Why the store is abstracted behind an interface.** Today the data lives in simple JSON files, which is perfect for a zero-setup demonstration and low volume. Rather than hard-code that choice everywhere, all data access goes through one small `store` interface. The justification is purely economic: when volume grows, moving to SQLite or a managed database is a change in one file, not a rewrite — so the initial simplicity does not become a future liability.

---

## 11. Business Value and ROI

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

## 12. Controls, Risks and Human Oversight

The safety story is built in, not bolted on:

- **Confident wrong answer** → confidence threshold; below it, always escalate. Prices/stock only from approved data. Owner: Content Admin.
- **Wrong language** → default-to-English with a flagged fallback. Owner: Project Owner.
- **Payment integrity** → nothing is marked paid without the (simulated) gateway callback; order/invoice/delivery are created only after payment; amounts always come from the stored quotation; the callback is idempotent. Live go-live delegates card handling to a PCI-compliant provider.
- **Warranty / PII** → synthetic demo data; a record is returned only to a query that matches it; the system never lists other customers' records.
- **Reliability** → an error on one enquiry escalates and logs rather than crashing the service.
- **Secrets** → kept in `.env`, never committed; SSH key-only; only the app port open.

**Human approval points** are explicit: go-live to real WhatsApp and to a live payment gateway require Project-Owner sign-off; FAQ content changes require Content-Admin review; server/firewall changes require DevOps approval; every escalation is closed by a rep with attribution; and any complaint or sensitive case is always routed to a person. Section 30 gives the full risk register.

---

## 13. Delivery Plan and Team

Delivered in three one-week increments (21 days), each producing a usable result:

- **Week 1 — Tested core:** pipeline, language detection, FAQ matching, escalation; verified by `npm test`.
- **Week 2 — Running app with UI:** webhook pipeline, product/quotation, delivery lookup, the chat and dashboard pages.
- **Week 3 — Deploy and enhance:** AWS deployment; then the conversational-commerce journey, online booking, warranty check, image ID, multilingual picker, navigation, and the two-way human console.

The team: **Alvin** (Project Owner — delivery, go-live sign-off, thresholds), **Noel** (Content Admin — FAQ knowledge base), **Puay Sim** (Lead Sales Rep — escalations and live takeover), **Peter** (DevOps — server, deployment, secrets). Section 29 expands the milestone subtasks.

---

## 14. Success Measures

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

## 15. Roadmap and Long-Run Strategy

The long-run strategy is to graduate each simulated edge to production and to turn the captured data into intelligence:

- **Live WhatsApp Business Cloud API** — swap the sender, add Meta webhook verification.
- **Live payment gateway** — Stripe / HitPay / PayNow behind the same `payment.service` interface.
- **CRM and analytics** — feed orders, bookings, and warranty interactions into a CRM; report on auto-answer rate, conversion, and rep time saved.
- **Reliable image recognition** — a dedicated vision key so photo-to-product works consistently.
- **Managed database and dashboard authentication** — as volume and the team grow.
- **Broader languages and smarter matching** — added only where they measurably improve answers, always gated by the escalate-when-unsure rule.

Because every one of these sits behind an interface the current system already uses, the business can adopt them incrementally, at controlled cost and risk.

---

## 16. Part A Conclusion

This proposal addresses a real, costly business need — the manual, after-hours-blind, multilingual enquiry load on a small sales team — with a solution that does more than deflect questions. It moves the **entire customer journey**, from first enquiry to payment, delivery, warranty, and repair booking, into a single 24/7 conversational channel, while keeping a human able to step in and take over at any moment. The method is justified by a hybrid design that pairs AI friendliness with database reliability, swappable edges that de-risk go-live, and 348 automated tests that make correctness auditable. The business value is direct: less manpower spent on the repetitive, more revenue captured around the clock, faster and more consistent service, and a data foundation for the future. It is not a prototype on a slide — it is a working, deployed platform. Part B now sets out, in engineering detail, exactly how it was built and how it works.

<div style="page-break-after: always;"></div>

# PART B — TECHNICAL WRITE-UP

## 17. Introduction and Problem Statement (Technical)

Part A framed the business problem. This part documents the implementation. In technical terms, the requirement was to build a hybrid WhatsApp assistant with a **pure, testable core** (language detection, matching, escalation, quotation, booking, payment, warranty) and **swappable interfaces at the edges** (the WhatsApp sender, the data store, and the payment gateway), so the system can be demonstrated on a simulated channel now and switched to the real WhatsApp Cloud API and a real payment gateway later without touching the core logic. The guiding principle — *people before technology* — is enforced in code: automation shortcuts only the repetitive, clearly-answerable cases, and any uncertainty routes to a human rather than a guess.

The problem, restated for an implementer, was to avoid two common failure modes. The first is the *pure open-ended chatbot*, which is friendly but will confidently invent a price or a stock level — unacceptable for a retailer, because a wrong number erodes trust and can commit the business to a loss. The second is the *rigid keypad menu*, which is safe but frustrates the large share of customers who simply type what they want. The chosen design is deliberately both at once: a numbered menu for those who tap, free-text natural-language understanding for those who type, deterministic lookups for anything involving money or stock, an AI layer only where language is genuinely ambiguous, and a human escalation path as the safe default whenever confidence is low. Each of these choices is reflected directly in the module structure described in Section 21.

The system is a Node.js/Express application. Its human-facing logic is written as plain functions of their inputs (no Express request/response objects), which is what makes early and continuous `npm test` results meaningful. The whole thing is deployed live on AWS Lightsail and verified by 348 automated tests across 19 suites.

## 18. User Requirements (Functional and Non-Functional)

Requirements were written as user stories with EARS-style acceptance criteria (WHEN/IF/WHERE … THEN the system SHALL …), so each is individually testable.

### Functional Requirements

**R1 — Receive customer enquiries.** Record each enquiry with a timestamp, sender, and original text; reject payloads missing the sender id or text without creating a record; sanitize text before storing or processing.

**R2 — Detect the customer's language.** Detect `en`, `ms`, or `zh` with a confidence score; default to `en` below threshold; select the dominant language for mixed messages.

**R3 — Auto-answer frequently asked questions.** Match to a stored FAQ intent with a confidence score; reply in the detected language; fall back to English (flagged) when the language is missing; record the match, language, confidence, and that it was auto-answered.

**R4 — Escalate uncertain or human-requested enquiries.** If no FAQ matches at/above threshold, or the customer asks for a person, escalate, record the reason, mark the enquiry pending, and send a localized acknowledgement.

**R5 — Rep dashboard (human-in-the-loop console).** List enquiries with status, language, and timestamp; show the full conversation and escalation reason; let a rep **reply directly to the customer** (delivered to the customer's chat thread); mark the enquiry `in_progress` and record who is handling it; and mark it resolved with attribution.

**R6 — Manage FAQ answers.** Store answers per language (English required); use edits for subsequent enquiries; reject a FAQ without an English answer.

**R7 — Swappable WhatsApp integration.** In `simulated` mode accept messages via a test chat page and record outbound replies without external calls; in `cloud` mode send via the WhatsApp Business Cloud API through the same sender interface; changing modes requires no change to language, FAQ, or escalation logic.

**R8 — Visible, testable results.** `npm test` runs unit and integration tests; the running webhook returns the bot's reply for inspection; the chat page and dashboard are reachable in a browser.

### Non-Functional Requirements

- **Privacy:** store only what is needed; keep secrets out of the repository.
- **Reliability:** an error answering one enquiry must not crash the server or block others.
- **Extensibility:** the language set and knowledge base can grow without changing the core flow.
- **Humane fallback:** uncertainty always routes to a person, never to a silent wrong guess.

## 19. Solution Design and Architecture

The design keeps the human-facing logic pure and testable and puts swappable interfaces at the edges.

### Layered architecture

```
        (simulated chat page  |  real WhatsApp Cloud API)
                          |
                          v
                 POST /webhook  (inbound)
                          |
                 webhook.controller
                          |
            +-------------+--------------+
            |     Enquiry pipeline        |
            |  1. record enquiry          |
            |  2. detect language         |
            |  3. route: menu / product / |
            |     booking / payment /     |
            |     warranty / delivery /   |
            |     image / FAQ             |
            |  4. decide: answer or       |
            |     escalate                |
            |  5. reply via sender        |
            +-------------+--------------+
                          |
          +---------------+----------------+
          |                                |
     data store                        sender interface
 (10 collections)                simulated.sender | cloud.sender
```

- **Routes** expose the HTTP surface: the inbound webhook, the FAQ management API, the enquiries API (list/detail/resolve/**reply**), the customer message-polling endpoint, and the payment routes.
- **Controllers** translate HTTP to and from the services and hold no business rules.
- **Services** are the testable core: language, product/FAQ, escalation, sales flow, payment/order, booking, onsite (address recognition), delivery, warranty, i18n, and the AI providers.
- **Edges** are the sender (simulated or cloud) and the store (JSON files now, a managed database later), each behind a small interface.

### The enquiry pipeline

Every inbound message flows through `webhook.controller.js`: (1) receive and validate; (2) record; (3) detect language (sticky picker choice overrides auto-detection); (4) handle universal HOME/BACK commands; (5) route by conversation state and content — menu, product/quotation, payment step, booking step, warranty, delivery lookup, image, or FAQ; (6) decide answer vs escalate; (7) respond via the sender; (8) return the reply so it can be inspected. On escalation the pipeline creates an escalation record, sets the enquiry pending, and sends a localized acknowledgement.

### Swappable edges

The system has three swappable edges, each behind a small, stable interface, and this is the single most important architectural decision because it is what lets the full business logic be built, tested, and demonstrated now while deferring the parts that depend on external approval or contracts.

- **The WhatsApp channel.** The `sender` interface is `send(to, message)`. `simulated.sender` records outbound messages and returns them in the webhook response (no external calls), which the browser chat page reads; `cloud.sender` is the phase-2 path to the WhatsApp Business Cloud API with Meta webhook verification. The mode is selected by `WHATSAPP_MODE`, read at call time so it can switch without a reload. Crucially, the language, FAQ, escalation, quotation, booking, warranty, and payment logic all depend only on this interface — so switching to the real channel changes nothing in the core.
- **The data store.** The `store` abstraction exposes create/get/list/update per collection over a JSON-file backend. Every service and controller depends only on those functions, never on the file format, so the backend can be replaced with SQLite or a managed database without touching business logic. Seeded collections load from JSON on first run; other collections start empty.
- **The payment gateway.** `PAYMENT_MODE=simulated` generates a mock payment link and a test payment page and settles via a callback; `PAYMENT_MODE=live` would swap in a real provider (Stripe, HitPay, or a bank PayNow integration) — a redirect plus a real gateway webhook — with no change to the order, invoice, or delivery logic.

This edge-swapping design is the direct implementation of Requirement 7 and the reason the go-live is low-risk: the risky, externally-dependent pieces are isolated at the boundary, and everything valuable — the conversation logic and the commerce/service journeys — is complete and proven behind them.

## 20. Data Design

Data is accessed only through the `store` abstraction, which manages ten collections: **enquiries, faqs, escalations, products, deliveries, warranty, orders, invoices, payments, bookings**. Products, deliveries, and the warranty database (and the starter FAQs) are seeded from JSON on first run; orders, invoices, payments, and bookings start empty and are created as customers complete purchases or book repairs.

Verified figures: **979 catalogue items** (829 components + 150 DIY PC packages) across **21 categories**; **72 CPUs** from a 2026 price list; **60 delivery records**; **50 warranty records**; every catalogue item `in_stock` at **100 units**. Products carry brand, model, category, price (SGD), stock status, and quantity — **no supplier/third-party name** anywhere.

Core record shapes:

- **Enquiry:** id, sender, sanitized text, detected language and confidence, status (`auto_answered` / `pending` / `in_progress` / `resolved`), matched FAQ id, match confidence, English-fallback flag, who is handling it, and timestamps including who resolved it. Rep-to-customer replies are stored in the same collection as outbound messages (author `rep`) so the customer's chat can display them.
- **FAQ:** id, intent label, per-language keywords, per-language answers (English required), updated-at.
- **Escalation:** id, enquiry id, reason (`low_confidence` / `human_requested` / `order_confirmed` / `warranty_service` / `onsite_booking` / `carry_in_booking`), created-at, status.
- **Payment:** id, sender, method (`card`/`paynow`), status (`pending`/`paid`), mode, quoted product/quantity/amount/currency, quote reference, language, and linked order/invoice/delivery references once settled.
- **Order:** id, order reference (`ORD-YYYYMMDD-NNN`), sender, status, product/quantity/amount, and linked quote/invoice/delivery references.
- **Invoice:** id, invoice reference (`INV-YYYYMMDD-NNN`), order reference, line details, payment method, status (`Paid`).
- **Booking:** id, reference (`OS-`/`CI-YYYYMMDD-NNN`), type, sender, service type or device, date, slot, customer details, problem, fee, status, language.
- **Warranty:** customer id, name, mobile, email, product category, brand, model, serial, invoice, purchase date, status, end date, coverage label, service type, last-service status.

## 21. Steering and Hooks (Kiro Configuration)

The project was built in the Kiro IDE using **steering** (persistent guidance) and **hooks** (event automation) under `.kiro/`.

**Steering files** (four, manual inclusion): a Product Summary (people-first framing and the "people before technology" principle); Project Standards (CommonJS, pure Express-free services, multi-language rules, service return-shape contracts, Jest+supertest, sanitize inputs, no secrets in the repo); Project Structure (layered routes → controllers → services → store, naming conventions, escalation-as-safe-default); and Tech Stack (Node/Express, express-validator, Jest, supertest, a language-detection library, dotenv; JSON-store-now/managed-DB-later; two-phase WhatsApp plan).

**Hooks** (two): `run-tests-on-save` (a `PostFileSave` hook that runs `npm test --silent` on any `.js` change under `src/` or `tests/`) and `verify-after-task` (a `PostTaskExec` hook that runs the suite after each completed task). Together they operationalize R8 — results you can see — and keep the suite green automatically.

## 22. Modules and Subtasks (Implementation Detail)

**Data layer.** `src/data/store.js` — the ten-collection abstraction with seeding of faqs, products, deliveries, and warranty. `src/data/seed/` — seed data.

**Core services (pure, tested).** `language.service.js` (en/ms/zh detection with a tuned Chinese threshold and sticky preference); `faq.service.js` (per-language matching with English fallback); `escalation.service.js` (human-requested and low-confidence rules, localized acknowledgements).

**Product and quotation.** `product.service.js` — natural-language product search and quotation building. It tokenizes queries (splitting letters from digits so model numbers such as "RTX5070" match a spaced "rtx 5070"), scores products by name, brand, and category, and formats a numbered shortlist and a quotation reply. It includes a dedicated CPU-aware interpretation layer so that loosely-worded processor queries in natural language — "Intel processor generation 14", "i5 14th gen", "core ultra 7", "ryzen 9 9000 series" — are parsed into structured attributes (brand, i-class, Ultra tier, generation, explicit model) and matched precisely against the 72-CPU dataset, falling back to generic search when the query is not CPU-specific. A budget parser recognises phrasings like "under $200" or "less than 50" and filters accordingly; when nothing fits a budget, the service honestly reports the closest option rather than returning an empty result that would read as "we don't have it". A component-not-stocked guard prevents a request for a category the shop does not stock as a standalone item from being answered with dressed-up PC packages.

**Guided flows.** `salesflow.service.js` (shortlist → quantity → quotation with a live stock line); `payment.service.js` (the daily-sequenced `Q-`/`ORD-`/`INV-`/`DO-` references, the pending payment plus secure test-pay link, and — on gateway confirmation — creation of the order, invoice, and delivery records); `booking.service.js` (available dates, numbered service/device pickers, `OS-`/`CI-` references, onsite and carry-in booking records); `onsite.service.js` (address recognition so a typed address starts the onsite booking); `delivery.service.js` (status lookup recognizing both `DO202600001` and `DO-YYYYMMDD-NNN`); `warranty.service.js` (serial/invoice detection, normalized matching, localized reply with the 1/2/3 handoff).

**Menu, i18n and language.** `menu.service.js` — the nine-option menu (1 Components, 2 DIY PC, 3 Carry-in, 4 Onsite, 5 Product Availability, 6 Talk to Sales, 7 Delivery Status, 8 Warranty Status, 9 About Us, plus Language), a numbered language-picker interpreter, and the universal `isHomeCommand`/`isBackCommand` navigation helpers. `i18n.service.js` — the `t(lang, key, vars)` translation function and the en/ms/zh string tables, keeping computer terms and addresses in English.

**AI providers.** `services/ai/openclaw.client.js` (the AI gateway client) and `services/ai/vision.provider.js` (image identification with a numbered category-picker fallback).

**HTTP layer.** `controllers/webhook.controller.js` (the pipeline and all conversational state, including HOME/BACK and the `handleBack` step-back helper); `controllers/enquiry.controller.js` (list/detail/resolve/**reply** + the `/api/messages/:from` polling endpoint); `controllers/faq.controller.js`; the route files; and `src/app.js`/`src/server.js`.

**Browser pages.** `public/chat.html` (numbered menu buttons, Language button, persistent 🏠 Menu / ◀ Back nav bar, and a 4-second poll that renders rep replies as "human" bubbles); `public/dashboard.html` (the two-way console — conversation, reply box, resolve); `public/pay.html` (the secure test-payment page).

**Scripts.** Catalogue/delivery converters, a CPU loader (the 72 processors), and `export_csv.js` (the five CSV exports).

## 23. The Guided Sales and Service Flow

The centrepiece of the product is a guided flow that converts a casual price question into a confirmed order without the customer needing to know any commands. When a customer asks about an item — for example the price of RAM — the system responds with a **numbered shortlist** of up to five matching products, each with its **price and its live stock count** (for example "100 in stock"), and an invitation to reply with a number or simply type the item name (no exact wording needed). The customer selects either **by number (1–5)** or by a **fuzzy name match** that tolerates filler words, so "I want the Logitech K380 please" resolves to the right item. The system then asks for the **quantity**, builds a **quotation** with the line total, subtotal, and the units in stock, and invites the customer to type "confirm". On confirmation the flow moves into the payment journey (Section 25); the "Talk to Sales" option remains available as the human path at any time.

The **DIY PC Package** option (menu 2) follows the same shape, but each package is presented as a whole bundle with its component parts shown in brackets — CPU, motherboard, RAM, case, power supply, and so on — at a single package price, so the customer can evaluate and buy a complete build in one step. Selecting a package and quantity produces a richer quotation that shows the full "What's included" component breakdown. Same-specification builds that differ only by price are collapsed into a single line with a "from" price so the shortlist stays readable.

A separate menu option, **Product Availability (option 5)**, serves the pure stock enquiry: the customer names an item and the assistant returns its price together with how many units are in stock. This replaced a former "Delivery & Payment" option whose content duplicated the Delivery Status feature; consolidating delivery/payment information under option 7 removed the overlap and gave stock its own clear entry point. Throughout every path, the "no wrong info to customer" principle holds: the system never guesses a price or stock level, and anything uncertain is escalated to a rep.

## 24. Online Booking — Onsite and Carry-in Appointments

Options 3 and 4 are structured, numbered, multi-step bookings that each produce a confirmed reference. **Onsite (option 4):** service type (Troubleshooting / Hardware Repair / PC Setup) → date (next three days) → time slot → details → `OS-YYYYMMDD-NNN` CONFIRMED (SGD 60/visit). Typing an address directly also starts it. **Carry-in (option 3):** date → slot → device (Laptop / Desktop / Printer / Other) → problem → `CI-YYYYMMDD-NNN` Awaiting Drop-Off (SGD 30, 1–2 working days, with the service-centre address and hours). Bookings live in the `bookings` collection, share the daily-sequenced reference style, and each creates a pending record so the service team is notified. A booking is created only once every step is complete.

## 25. Warranty Check — Serial Lookup and Service Handoff

Menu option 8 (which moved About Us to 9). A customer picks option 8 or simply pastes a serial/invoice anywhere; the system recognises the pattern and looks it up (serial → invoice → mobile → name). On a single match it replies with the customer, product, serial, status, expiry, and coverage, then offers **1** onsite booking · **2** carry-in booking · **3** talk to service — feeding straight into the booking modules. Serial matching normalizes case, spaces, and repeated dashes (so `SG26-TP--0015` and `sg26-tp-0015` both match); an unknown serial returns an honest "not found"; a record is returned only to a query that matches it. The 50 records are synthetic, and the reply is fully localized.

## 26. Conversational Commerce — Payment, Order and Delivery Journey

The nine-step journey: enquiry → recommendation → selection → quotation (`Q-`) → confirm → payment method (**1 Card / 2 PayNow / SGQR**) → secure pay link (`/pay/<id>`) → payment confirmation (`ORD-` + `INV-`, "Preparing Order") → delivery order (`DO-`), trackable via option 7. The four references share one daily running number. Payment is a **simulated gateway** (`PAYMENT_MODE=simulated`, no real charge) designed to swap to a real provider behind the same `payment.service` interface. Honesty guardrails: nothing is marked paid without the gateway callback; order/invoice/delivery are created only after payment confirms; amounts always come from the stored quotation; the callback is idempotent. The delivery order is written in the same shape the Delivery Status lookup understands, so a purchase made entirely in chat is immediately trackable — closing the loop.

## 27. Multilingual Support (i18n) and Navigation

The assistant is fully trilingual (English, Bahasa Melayu, Chinese). Localization covers product lists, quotations, selection prompts, confirmations, the full payment journey, the booking flows, warranty replies, and every menu-option response; computer terms (CPU, GPU, RAM, SSD, DDR5) and postal addresses stay English. Language is handled by automatic detection and by an explicit **numbered picker** (`1 English / 2 中文 / 3 Bahasa Melayu`, or type the name), whose choice is sticky. Universal navigation commands work at every step in all three languages: `0`/`menu`/`home` returns to the main menu; `back` steps to the previous screen (with a `handleBack` mapping per flow). Multi-step prompts carry a localized footer hint, and the chat page adds one-tap Menu/Back buttons.

## 28. Image Recognition and the Honest Fallback

Image uploads route to a vision provider that maps a recognition label to a catalogue category and offers the matching priced shortlist. When the AI gateway is rate-limited or cannot confidently identify a photo, the system degrades honestly to a **numbered category picker** rather than fabricating a result — the people-before-technology principle applied to a failure mode. The code path and fallback are in place; the remaining work is a dedicated vision key or higher quota.

## 29. Human-in-the-Loop — The Two-Way Reply Console

The dashboard is a live takeover console, not just a queue, and it is where the "people before technology" principle becomes tangible in the product. When the bot escalates — because the customer asked for a person, the bot was not confident, a sensitive case arose, or an order/booking event occurred — the enquiry appears **pending** on the dashboard with its full conversation (the customer's message, the AI's reply) and the escalation reason. The customer, meanwhile, has already received an instant localized acknowledgement, so no one is left waiting silently.

A rep opens the enquiry and **replies to the customer directly** from the detail panel (`POST /api/enquiries/:id/reply`). The reply is delivered through the same swappable sender the bot uses, and stored in the customer's thread as an outbound rep message. The customer's chat page polls `GET /api/messages/:from?since=<timestamp>` every few seconds and renders any new rep replies as a clearly-labelled "(human)" bubble — so from the customer's side, a real person has seamlessly joined the same conversation. Sending the first reply moves the enquiry to a new **`in_progress`** status and records which rep is handling it; when the matter is settled the rep marks it **resolved**, and the system stores who resolved it and when.

Two implementation details protect the integrity of this loop. First, rep-authored messages are stored in the enquiries collection but are filtered out of both the dashboard's enquiry list and the bot's conversation-state reconstruction, so a human reply never clutters the queue or confuses the bot's flow tracking. Second, because the reply path reuses the same `sender` interface, it works today in simulated mode (delivered via the chat's polling) and maps directly to a real WhatsApp send when the Cloud API is enabled — with no change to the console. The result is a clean, auditable handoff loop: bot → escalate → human takes over → reply → resolve, with every human action attributed. This is precisely the "reduce manpower load without losing the human touch" promise of Part A, realised in software: the bot absorbs the repetitive volume, and when a person is needed, the handoff is instant, contextual, and invisible to the customer.

## 30. Delivery Plan, Milestones and Team

Three one-week milestones (21 days). **Week 1 (Tasks 1–5):** scaffold with a Jest harness; the store with seeded FAQs; and three pure, unit-tested services (language, FAQ, escalation). **Week 2 (Tasks 6–12):** the webhook pipeline integration-tested; the swappable sender; the Express app; the FAQ and enquiries APIs; the chat and dashboard pages. **Final week (Tasks 13+):** AWS deployment, then the conversational-commerce journey, online booking, warranty check, image ID, multilingual picker, navigation, and the two-way console. Team as in Section 12.

## 31. Controls, Risks and Human Approval

| Risk | Control | Owner |
|---|---|---|
| Confident but wrong answer | Confidence threshold; below it, escalate; English-required FAQs | Noel |
| Wrong language detected | Default-to-English with flagged fallback | Alvin |
| Outdated FAQ content | Admin API with edit history; periodic review | Noel |
| Payment integrity | Nothing paid without gateway callback; records only after payment; amounts from stored quote; idempotent; PCI provider when live | Alvin / Peter |
| Warranty / PII exposure | Synthetic data; returned only to a matching query; never lists others | Alvin |
| Leaked secrets | `.env` git-ignored; key-only SSH; app-port-only | Peter |
| One enquiry crashing the service | Per-enquiry error → escalate + log, never crash | Alvin |
| Prompt/message injection | Untrusted customer text; deterministic matcher; any LLM gated by escalate-when-unsure | Alvin |

**Human approval points:** go-live to real WhatsApp and to a live payment gateway require Project-Owner sign-off; FAQ changes require Content-Admin review; server/firewall changes require DevOps approval; every escalation is closed by a rep with attribution; complaints/sensitive cases always route to a person.

## 32. Success Measures

As in Section 14: auto-answer rate 50–70%; first response < 5 seconds; 100% of after-hours enquiries acknowledged; measurable enquiry-to-order conversion; measurable reduction in delivery hotline calls; 100% price/stock accuracy or escalate; 100% of tests passing (348/19).

## 33. Testing and Verification

Testing is the earliest and most frequent signal of health, and — in a system that quotes prices and takes (simulated) payments — it is a business requirement rather than a nicety. The suite uses **Jest** and **supertest**, and is run with a single `npm test`. It covers unit tests for language detection, FAQ matching, escalation, product search, quotation, delivery, warranty, i18n/language, image identification, the WhatsApp sender, and the menu, plus integration tests for the webhook, the enquiry and FAQ APIs, the end-to-end payment journey, the onsite and carry-in booking flows, the warranty lookup and service handoff, the numbered language picker and HOME/BACK navigation, and the two-way rep reply console.

The current verified state is **348 tests passing across 19 test suites**. Representative examples of what the suites assert:

- **Payment journey** — a full drive from enquiry → quotation → confirm → payment method → secure link → simulated gateway callback → order/invoice/delivery creation → delivery tracking, plus that nothing is marked paid without the callback, that amounts come from the stored quote, and that completing the same payment twice does not create duplicate orders (idempotency).
- **Booking** — both the onsite and carry-in flows driven through every step to a confirmed `OS-`/`CI-` booking, with invalid-choice re-prompting and daily-sequenced references verified.
- **Warranty** — serial/invoice lookup including the format-tolerant match (`SG26-TP--0015` ≡ `sg26-tp-0015`), the 1/2/3 service handoff, and an honest "not found" for unknown serials.
- **Navigation** — the numbered language picker (1/2/3 or name) and the universal HOME/BACK commands stepping correctly through every flow.
- **Rep reply console** — a rep reply is delivered to the customer thread, marks the enquiry `in_progress`, is retrievable by the customer's poll, does not leak into the dashboard list, and does not corrupt the conversation state.

The two Kiro hooks keep this green automatically: tests run on every source or test file save, and again after each completed spec task. Because services are pure and free of Express objects, their tests assert specific inputs against expected outputs directly, which is what makes early results meaningful and refactoring safe. A practical operational note learned during development: the JSON data files must be cleared before and after a test run, because concurrent processes touching the shared data files can otherwise produce false failures. This is why `npm test` is always bracketed by a data-directory cleanup in the project's workflow.

## 34. Deployment

Deployed to an **AWS Lightsail Ubuntu** instance at `52.77.234.193`, kept alive by **PM2**. It runs with `WHATSAPP_MODE=simulated`, `USE_OPENCLAW=true`, `VISION_PROVIDER=openclaw`, `PAYMENT_MODE=simulated`, and `PUBLIC_BASE_URL=http://52.77.234.193:3000`. Only the app port is open in the Lightsail firewall; SSH is key-only. Deployment copies changed files and restarts PM2; data can be reseeded by removing a collection file before restart. Live endpoints (all verified): customer chat `/chat.html`, rep dashboard `/dashboard.html`, test payment page `/pay/<id>`, and health `/health` → `{"status":"ok"}`. A custom domain was considered and reverted to avoid the domain fee, so the system stays on the public IP over HTTP — appropriate as demonstration evidence.

## 35. Results (Verified Figures)

- **979 catalogue items** (829 components + 150 DIY PC packages), 21 categories, each at 100 units with live availability.
- **60 seed delivery records** plus new delivery orders from completed purchases.
- **50 warranty records**; **72 CPUs** powering natural-language processor queries.
- **348 tests passing across 19 suites.**
- **3 languages** across the entire experience, with a numbered picker and universal `0`/`back` navigation.
- **Complete conversational commerce journey** (`Q-`/`ORD-`/`INV-`/`DO-`), **two booking journeys** (`OS-`/`CI-`), **warranty check**, **delivery-status self-service**, and a **two-way human-in-the-loop console** — all verified live end-to-end.
- **Five CSV exports** for records.
- **Deployed live** on AWS Lightsail with chat, dashboard, payment page, and health endpoint reachable.

## 36. Roadmap and Future Enhancement Work

What we have built and tested is a complete, working platform — but we want to be honest about where it stands today and where it goes next. This section describes both: the current limitations of the tested application, and the roadmap that turns each of them into a production-ready capability. The important point is that we planned for all of this from the start, so none of it requires a rewrite — each enhancement simply slots in behind an interface the system already uses.

**Being honest about what the demonstration version does and does not do.** For this build, several parts of the system are deliberately *simulated* so that we could complete and prove the full business logic without waiting on external approvals, contracts, or sensitive credentials. In practice, this means:

- **The payment page is a safe test gateway, not a real one.** When you pay by card in the demonstration, the page does not ask for a security code (the CVV), it does not connect to any bank or card network, and no real money ever moves. It simply records that a test payment was completed and then creates the order, invoice, and delivery. This was a conscious choice: handling real card numbers safely requires a certified payment provider, and we did not want to store or touch card data ourselves.
- **The WhatsApp channel is simulated** through a browser chat page and a webhook, rather than the official WhatsApp Business line, because the official channel needs Meta business verification and approval.
- **Image recognition is intermittent**, because the shared AI vision service we use is rate-limited; when it cannot confidently identify a photo, the assistant honestly falls back to a numbered category picker instead of guessing.
- **The rep dashboard has no login yet**, because the demonstration assumes a single trusted staff member.
- **Data is stored in simple files** rather than a full database, which is ideal for a demonstration and low volume but would need upgrading as the business grows.

None of these are accidental gaps — they are the edges we intentionally left swappable. Here is how each becomes production-grade.

**1. A real, secure payment gateway.** The biggest enhancement is to connect a certified payment provider — for example Stripe, HitPay, or a bank's PayNow integration. In that live version, the customer would enter their full card details, including the security code, on the *provider's* secure page, and the bank would actually authorise and charge the payment. Our system never sees or stores the card number — the provider handles that, which is what keeps us compliant and safe. Because our payment step already sits behind a single, well-defined interface, switching from the test gateway to a real one changes only that edge; the quotation, order, invoice, and delivery logic all stay exactly as they are.

**2. The real WhatsApp Business Cloud API.** Next, we would connect to the official WhatsApp Business line so that real customers on their own phones can message the business directly, with Meta's message verification in place. Again, because the messaging channel is already behind a swappable "sender," this is a change at the edge only — everything the assistant says and does stays the same.

**3. CRM and analytics.** Every quotation, order, invoice, booking, and warranty check the system creates is already captured as structured data. The natural next step is to feed that into a customer-relationship-management system and a simple analytics dashboard, so the business can see, at a glance, how many enquiries the bot handled on its own, how many turned into sales, and how much staff time was saved. This turns the platform from a service tool into a source of business intelligence.

**4. Reliable image recognition.** With a dedicated vision service key or a higher usage quota, the photo-to-product feature would work consistently rather than intermittently — a customer could simply snap a picture of a part and get an instant priced match. The code path is already built; it only needs the upgraded service behind it.

**5. A managed database and dashboard security.** As volume grows, we would move from simple file storage to a managed database for reliability and scale, and add a proper login for the rep dashboard so only authorised staff can view conversations and take over chats. Both are contained changes because data access already goes through one interface.

**6. Broader languages and smarter answers.** Finally, we can add more languages beyond English, Malay, and Chinese, and introduce smarter AI matching for harder questions — but always under the same firm rule that governs the whole system: if the assistant is not confident, it hands the conversation to a human rather than guessing.

In short, the demonstration proves the *whole journey works*; the roadmap swaps each simulated edge for its live equivalent. Because we designed the system this way from the beginning, the business can adopt these enhancements one at a time, at a controlled cost and with very little risk — growing the platform steadily rather than rebuilding it.

## 37. Overall Conclusion

Let us bring the whole story together. This document set out to do two things at once — to make the *business case* and the *engineering case* for an AI-powered WhatsApp assistant for BIS Computer Services — and we believe it has done both.

The business case is straightforward. A small sales team was drowning in repetitive WhatsApp questions — prices, stock, delivery, warranty, "where is my order" — arriving all day, in three different languages, and going completely unanswered after hours. That is expensive in two ways: it burns the team's most valuable time on routine typing, and it quietly loses the sales that come in when nobody is at the desk. Our platform turns that same WhatsApp line into an automated, always-on channel. It absorbs the repetitive load, so the team is freed to focus on real selling and complex problems. It stays open 24 hours a day, so an evening or weekend enquiry can now be answered — and even paid for — instead of being lost. And it does all of this while keeping people firmly in control: whenever the assistant is unsure, or a customer simply asks for a person, a real sales rep can step straight into the conversation. In short, we reduce the manpower spent on the routine, capture more revenue around the clock, and give faster, more consistent, multilingual service — without losing the human touch.

The engineering case is just as clear. Underneath the friendly conversation is a deterministic, thoroughly-tested core — **348 automated tests across 19 suites** — that answers questions about money and stock only from approved data, never by guessing. Around that core sit deliberately *swappable edges* — the messaging channel, the payment gateway, and the data store — so the parts that depend on outside approvals or sensitive credentials are isolated at the boundary and can be switched on later without touching the logic we have already built and proven. The whole thing was built in a disciplined, spec-driven way in the Kiro environment, with steering rules and automatic testing keeping it healthy at every step, and it is deployed and running live on AWS Lightsail today.

The result is that the *entire customer journey* — enquiry, product recommendation, quotation, payment, order and invoice, delivery tracking, warranty check, and repair booking — now lives inside one 24/7 conversational channel, with a two-way console that lets a rep join any conversation live. We have been honest throughout about what is simulated for this demonstration — the test payment gateway with no real card charge, the simulated WhatsApp channel, the intermittent image recognition — and we have shown exactly how each of those becomes production-ready, one contained step at a time.

That honesty is the point we want to leave you with. This is **not a mock-up or a set of slides describing something we hope to build** — it is a working, deployed platform that you can open and use right now. It has real data, a real cloud deployment, a full test suite, and every function demonstrated end to end. It is ready to graduate its simulated edges to production whenever the business decides to take that step. For a small computer shop, that is what accessible digital transformation looks like in practice: powerful, safe, and within reach.

We are Team ITE BIS Innovators, and this is our answer to the challenge of managing WhatsApp sales enquiries. Thank you.

---

## Appendix — How to capture the screenshots

All screenshots are captured from the live system. Put the PNGs in a `screenshots/` folder next to this document (create `whatsapp-sales/docs/screenshots/`) using the file names referenced in Part A, then export to PDF.

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
