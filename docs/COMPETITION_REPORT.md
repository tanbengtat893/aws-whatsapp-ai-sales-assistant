<div style="text-align: center; padding-top: 80px;">

# Business Proposal & Solution Report

## An AI-Powered WhatsApp Sales Assistant for a Computer Retail SME

**BIS Computer Services — Turning After-Hours, Multilingual Enquiries into Always-On Conversational Commerce**

<br>

| | |
|---|---|
| **Business Owner** | Alvin |
| **Content Admin** | Noel |
| **Lead Sales Representative** | Puay Sim |
| **DevOps** | Peter |

<br>

**This report covers:**
1. Problem & Opportunity · 2. Business Value · 3. Impact & Outcomes · 4. Feasibility & Scalability · 5. Proposal Quality

**Live deployment:** AWS Lightsail (Ubuntu + PM2) — `http://52.77.234.193:3000`
**Verified build:** 979 catalogue items · 60 delivery records · 50 warranty records · 348 automated tests across 19 suites · 3 languages (EN / 中文 / BM)
**Date:** September 2026

</div>

<div style="page-break-after: always;"></div>

## How to Read This Report

This report is organised around five themes — Problem & Opportunity, Business Value, Business Impact & Outcomes, Feasibility & Scalability, and Proposal Quality — and it opens with **One Clear Business Story**. Each section combines three things on purpose: **paragraphs** that make the argument for a business stakeholder, **subsections** that keep the structure easy to navigate, and **points form** where a list proves the case faster than prose.

The report is deliberately comprehensive. The first half makes the business case; the second half — the Solution Deep-Dive — proves that the case rests on a real, working, tested system, not a concept. A reader who only wants the business argument can stop at the end of Part 1; a reader who wants to verify the engineering can read on and find the architecture, data design, module-by-module walkthrough, testing evidence, and deployment detail behind every claim.

A note on honesty, which we treat as part of proposal quality. We are a small business preparing a proposal; we do **not** have historical logs of our manual enquiry process. Wherever this report states a "before" figure or a projected outcome, it is clearly labelled as an **assumption** or a **projection**, with the reasoning shown. What is *not* assumed — the working system, its scale, and its test coverage — is stated as verified fact and can be demonstrated live.

Screenshots are the evidence a reader can see at a glance. Every place a screenshot strengthens the story is marked with a bold **[SCREENSHOT n]** tag, a caption, and a short capture instruction. The full list is collected in Appendix A so the images can be dropped in as a set.

<div style="page-break-after: always;"></div>

## Table of Contents

**Part 1 — The Business Case**
- One Clear Business Story (Executive Summary)
- Section 1 — Problem & Opportunity
- Section 2 — Business Value
- Section 3 — Business Impact & Outcomes (KPIs)
- Section 4 — Feasibility & Scalability
- Section 5 — Proposal Quality

**Part 2 — Solution Deep-Dive (Evidence Behind the Case)**
- Section 6 — Solution Overview & Process Flow
- Section 7 — Innovation Technology Stack
- Section 8 — Solution Design & Architecture
- Section 9 — Data Design
- Section 10 — Module & Feature Walkthrough
- Section 11 — Conversational Commerce (Payment → Order → Delivery)
- Section 12 — Service Bookings & Warranty
- Section 13 — Multilingual Support & Navigation
- Section 14 — Human-in-the-Loop Console
- Section 15 — Controls, Risks & Human Oversight
- Section 16 — Testing & Verification
- Section 17 — Deployment & Operations
- Section 18 — Roadmap: Prototype → Pilot → Production
- Conclusion
- Appendix A — Screenshot Capture List
- Appendix B — Verified Figures & Assumptions Register
- Appendix C — Requirements Traceability

<div style="page-break-after: always;"></div>

# Part 1 — The Business Case

## One Clear Business Story (Executive Summary)

> **The Agent turns a costly, after-hours-blind, multilingual enquiry load into an always-on WhatsApp channel that answers routine questions instantly, captures orders and payments around the clock, and hands the customer to a named human the moment judgement is needed.**

The four questions at the heart of this proposal, answered plainly:

- **What problem are we solving?** A computer retail SME receives a steady stream of routine WhatsApp enquiries — "Is this in stock?", "How much is this?", "What's my delivery status?", "Is my repair still under warranty?", "Can I book an on-site visit?" — and a smaller stream of real sales opportunities. Today these arrive faster than a small team can answer them consistently, and they do not stop when the shop closes.
- **Who experiences it, and why does it matter?** The shop owner (Alvin) carries the cost and the risk; the sales representatives (Puay Sim's team) carry the repetitive load; and the customer carries the delay. Every slow or inconsistent reply is a chance for the customer to buy elsewhere. For an SME competing on service, that is revenue leaking out one message at a time.
- **What business value will the Agent create?** It removes the repetitive work from staff, gives every customer a fast and consistent answer in their own language, keeps the sales counter effectively open 24/7, and keeps a human in control of anything that needs a person — all on the channel customers already use.
- **What measurable outcomes do we expect?** The targets are set out in the KPI table in Section 3. In summary, we aim to **automate roughly 60% of routine enquiries**, **cut first-response time from hours to minutes**, **free up staff hours each week**, and **capture after-hours orders that are currently lost** — with human oversight preserved throughout.

**The mindset behind this proposal is the business owner's, not the developer's** — we set out to *think like a business owner, not just an AI developer.* The question we kept asking was not "what can the AI do?" but "what does this save, earn, or protect for the shop?" The technology exists to serve that answer. And critically, this is not a concept awaiting a build — it is a working platform deployed live on AWS, verified by 348 automated tests, that already carries a customer from first message all the way to a paid order, a booked repair, or a human representative.

> **[SCREENSHOT 1] — WhatsApp chat welcome + numbered menu (1–9 + language).**
> *Capture:* Open `http://52.77.234.193:3000/chat.html`, send any greeting, screenshot the welcome message with the full numbered menu (1 Components · 2 DIY PC · 3 Carry-in · 4 On-site · 5 Product Availability · 6 Talk to Sales · 7 Delivery Status · 8 Warranty Status · 9 About Us, plus the language switch). *This is the one image that shows the whole business in a single screen.*

<div style="page-break-after: always;"></div>

## Section 1 — Problem & Opportunity

### 1.1 A meaningful problem, defined

We are deliberately avoiding the weak framing "we want to build an AI chatbot." The problem is operational and specific: **staff repeatedly answer the same routine questions across scattered sources — a stock list, a delivery sheet, a warranty record, a bookings diary — which creates delays, inconsistent answers, and no coverage outside business hours.** An AI chatbot is merely one possible response; the problem is the manual, repetitive, source-hopping enquiry workload that consumes the most expensive resource in the shop — skilled staff time — on the cheapest, most repeatable work.

### 1.2 Who and what

**Target users and stakeholders**

- **The customer** — sends a WhatsApp message expecting a quick, correct answer in their preferred language (English, Chinese, or Bahasa Melayu). They do not care which internal system holds the answer; they care that it is fast and right.
- **The sales representative** — must interrupt other work to look up an answer, then type a reply, dozens of times a day. Every interruption carries a context-switching cost on top of the minutes spent typing.
- **The business owner (Alvin)** — pays for the staff time, wears the cost of missed after-hours sales, and carries the reputational risk of slow or wrong answers.
- **The service team** — receives repair and booking requests that today arrive as free-text messages needing manual triage into a diary.

**Current task or process (stated as an assumption — see 1.5)**

- A message arrives on a shared phone.
- A staff member reads it and decides which "system" holds the answer (stock list, delivery sheet, warranty file, bookings diary, or personal knowledge).
- They search that source, compose a reply, and send it.
- If it is a sale, they manually assemble a quotation, take payment details out-of-band, and arrange delivery.
- Anything they cannot answer waits until someone with the knowledge is free — sometimes the next morning.

**Specific pain points**

- Routine questions consume skilled staff time that should go to actual selling.
- Answers vary between staff members and between shifts — inconsistent service, and occasionally a wrong price or stock claim that the shop then has to honour or retract.
- After hours, nothing is answered at all — the channel simply goes dark during the very window when many consumers shop.
- Non-English enquiries add friction and slow replies further.
- There is no record trail, so nothing is measurable or improvable, and a "where is my order?" question forces a manual lookup or a hotline call.

### 1.3 Why it matters

- **Frequency and scale.** Routine enquiries (stock, price, delivery, warranty, bookings) are, by their nature, the *high-volume* messages. They repeat every day in predictable patterns. The high-value sales enquiries are rarer but are the ones most damaged by delay — a slow reply on a $2,000 build is a lost margin, not just a lost minute.
- **Operational and business consequence.** Slow or inconsistent replies push customers to competitors, burn staff hours on low-value work, congest the phone line with delivery-status calls, and leave the after-hours window completely uncovered.
- **Why solving it is worthwhile.** Because the enquiries repeat in predictable patterns, they are automatable. Automating the routine frees humans for the high-value conversations, and keeping the channel open around the clock converts lost after-hours demand into captured orders. The payback is direct and measurable.

### 1.4 The opportunity

WhatsApp is the channel customers already prefer, so there is nothing new for them to learn or install. The enquiries are structured enough to automate, yet valuable enough that automating them pays back quickly. The opportunity is to meet customers where they already are, answer the routine instantly and consistently in three languages, keep the counter open 24/7, carry a ready buyer all the way to a paid and fulfilled order, and escalate everything else to a named human — capturing revenue and saving time without adding headcount. Framed as the guideline prefers: *staff repeatedly search multiple sources to answer routine enquiries, creating delays and inconsistent responses; the Agent removes that work and keeps the humans for the conversations that actually need them.*

### 1.5 Current situation — evidence and assumptions

We are transparent here because an evidence-based, honest proposal is the only kind worth acting on.

- **What is assumed (no historical logs available):** the manual workflow in 1.2, and every "before" or baseline figure in the KPI table. These are reasonable estimates for a small computer-retail SME, labelled as assumptions so the reader can weigh them fairly. *We would validate every one of these during a two-week pilot by logging real enquiries — turning each assumption into a measured baseline.*
- **What is verified (demonstrable today):** the working system and its scale — a live WhatsApp-style assistant on AWS with **979 catalogue items, 60 delivery records, 50 warranty records, 348 automated tests across 19 suites, and 3 languages.** The current journey the customer experiences with the Agent is real and can be shown live end to end.

> **[SCREENSHOT 2] — "Before vs After" enquiry journey.**
> *Capture:* A simple two-column slide/diagram image — left: manual journey (message → staff searches multiple sources → delayed/inconsistent reply → after-hours = no reply); right: Agent journey (message → instant menu → instant answer in customer's language → human escalation when needed). *Use to visually anchor the problem next to the solution.*

<div style="page-break-after: always;"></div>

## Section 2 — Business Value

This section answers a direct question: *how does the Agent create value across the business?* We map it to six value levers — Productivity, Cost, Revenue, Service, Risk, and Scale — and each lever is backed by a concrete capability that already exists in the deployed system.

### 2.1 Productivity — fewer manual steps and staff hours

The Agent removes the entire "read → decide which source → search → compose → send" loop for routine enquiries. Stock, price, delivery status, warranty status, and bookings are answered from structured data instantly, with zero staff steps. Staff time shifts from *looking things up* to *closing sales and handling exceptions*.

- Routine lookups collapse from a multi-step manual search to a one-tap menu answer.
- Staff are interrupted only when a human is actually needed (escalation), which removes the context-switching tax as well as the typing time.
- Quotations that a rep used to assemble by hand are generated automatically with an itemised breakdown and a reference number.

### 2.2 Cost — lower cost per interaction

Every routine enquiry the Agent handles has a near-zero marginal cost, versus the staff-minute cost of a manual reply. As volume grows, cost per interaction falls rather than rising, because the automated share carries the growth. The hosting is a small fixed monthly cost on AWS Lightsail, so the unit economics improve with every additional automated conversation.

### 2.3 Revenue — more leads, conversions and captured sales

- **24/7 capture.** The sales flow, ordering, and (simulated) card payment run around the clock, so after-hours demand that used to go unanswered can now convert into a paid order.
- **Faster response protects conversion.** In sales, speed correlates with winning the deal; instant acknowledgement and instant answers keep the customer engaged instead of drifting to a competitor.
- **Qualified hand-offs.** When a customer chooses "Talk to Sales", they are captured, acknowledged, and routed to a named representative — a warm, tracked lead rather than a lost message.
- **Higher-value baskets.** The DIY PC package flow presents complete builds with an itemised "what's included" breakdown, nudging customers toward a full configured system rather than a single component.

### 2.4 Service — faster, more consistent experience

- Every customer gets the same correct answer, regardless of which staff member is on shift or whether the shop is open.
- Three languages (English, Chinese, Bahasa Melayu) are served natively, widening the audience served well.
- The numbered menu makes the whole shop navigable in one screen — no waiting, no ambiguity — and universal "menu"/"back" commands mean a customer can never get stuck.

> **[SCREENSHOT 3] — Instant Product Availability answer (stock check).**
> *Capture:* In chat, choose **5 Product Availability**, search a product, and screenshot the instant in-stock reply with quantity. *Shows a routine enquiry answered with zero staff involvement.*

> **[SCREENSHOT 4] — Multilingual reply.**
> *Capture:* Switch language (e.g. to 中文 or BM) and screenshot the same menu/answer rendered in that language. *Proves the "consistent experience in the customer's language" claim.*

### 2.5 Risk — fewer errors and better controls

- Answers about money and stock come from a single source of structured data, so they are consistent — no more "it depends who you ask." The Agent is built to **never guess a price or stock level**.
- Every enquiry, order, booking, and warranty check produces a **reference number** (Q-/ORD-/INV-/DO- for commerce, OS-/CI- for bookings), giving a clean audit trail.
- The Agent is built to **escalate when unsure** rather than guess, so the failure mode is "a human is asked", not "a wrong answer is sent".
- Payment integrity is enforced in code: nothing is marked paid without a gateway callback, amounts always come from the stored quote, and duplicate confirmations cannot create duplicate orders.

### 2.6 Scale — more volume without matching headcount

The automated share absorbs volume growth at near-zero marginal cost. A busy period no longer means "hire more people to answer WhatsApp"; it means the Agent handles more of the routine while the same small team handles the exceptions. This is the core SME advantage: grow service capacity without growing the payroll in step. Because the whole customer journey — sales, payment, delivery, warranty, bookings — already lives in one channel, scaling the channel scales the whole operation, not just the FAQ answering.

<div style="page-break-after: always;"></div>

## Section 3 — Business Impact & Outcomes (KPIs)

A business success metric — a Key Performance Indicator (KPI) — is a measurable indicator of whether the strategy is working. Below are the KPIs we will track. **Baselines are labelled assumptions** (we have no historical logs yet); **targets are projections** we would confirm during the pilot by logging real enquiries. The point is not to claim these numbers as fact today — it is to show that the outcomes are *measurable* and that we know exactly what we are aiming for and how we would measure each one.

### 3.1 KPI table

| Business Outcome | KPI (metric) | Baseline *(assumption)* | Target *(projection)* | How measured |
|---|---|---|---|---|
| **Reduce manual work** | % of routine enquiries handled without staff | 0% automated | **Automate ~60%** of routine enquiries | Count auto-answered vs escalated in enquiry log |
| **Improve productivity** | Staff hours spent on routine replies | Baseline hrs/week *(TBD in pilot)* | **Save ~15 staff hours/week** | Staff time-log before vs after |
| **Improve customer service** | First-response time | ~4 hours *(assumed, incl. after-hours)* | **Reduce to ~30 minutes** (instant for automated) | Timestamp of enquiry vs first reply |
| **Increase sales** | After-hours orders captured | ~0 *(channel dark after hours)* | **Capture after-hours orders** currently lost | Orders created outside business hours |
| **Generate more leads** | Enquiry-to-sale conversion | Baseline *(TBD in pilot)* | **+15% conversion** on tracked leads | "Talk to Sales" hand-offs that convert |
| **Improve accuracy** | Answer consistency / order accuracy | Varies by staff/shift | **98% order-processing accuracy**; consistent answers | Reference-number audit trail |
| **Reduce operating costs** | Cost per routine interaction | Staff-minute cost | **Lower cost per interaction** as volume grows | Automated share × marginal cost |
| **Reduce hotline load** | Delivery-status calls to the phone line | Baseline *(TBD in pilot)* | **Measurable reduction** via self-service | Option-7 self-service lookups vs calls |
| **Improve retention** | Repeat-customer rate | Baseline *(TBD in pilot)* | **+15% repeat customers** | Returning customer identifiers over time |

> The KPI values above use industry-typical ranges adapted to this SME. Every baseline marked *(assumption)* or *(TBD in pilot)* is a candidate for validation with two weeks of real logging.

### 3.2 Why these are the right KPIs

- They tie **directly** to the value levers in Section 2 (each KPI traces back to Productivity, Cost, Revenue, Service, Risk, or Scale).
- They are **measurable with data the Agent already produces** — every interaction is timestamped and reference-numbered, so measuring is a reporting task, not a new project. The dashboard is the raw data source; a simple export turns it into the KPI dashboard.
- They reflect the **owner's language**: hours saved, orders captured, cost per interaction, conversion — not model accuracy or token counts.

### 3.3 How each outcome connects to the proposal claim

The core proposal claim is simple: "*the Agent reduces processing time.*" We make it concrete: the Agent reduces the processing time of a routine enquiry from a multi-minute manual lookup to an instant automated answer, and reduces the processing time of a sale from a manual, out-of-band quotation-and-payment exchange to a single guided in-chat journey. The KPIs above are simply that claim, made measurable.

> **[SCREENSHOT 5] — Rep dashboard showing enquiry states & reference numbers.**
> *Capture:* Open `http://52.77.234.193:3000/dashboard.html` with a few enquiries present; screenshot the list showing statuses (pending / assigned / in_progress / resolved) and reference IDs. *This is the data source behind the KPIs — proof that outcomes are measurable, not hand-waved.*

<div style="page-break-after: always;"></div>

## Section 4 — Feasibility & Scalability

A proposal is only worthwhile if it works **beyond a prototype**. This one already does — it is deployed and running — and the design makes the path to production incremental and low-risk.

### 4.1 Feasibility

**Data / knowledge required to maintain the solution**

- The catalogue and records are structured and already loaded: **979 catalogue items (829 components + 150 DIY PC packages) across 21 categories, 72 CPUs, 60 delivery records, 50 warranty records.** Maintenance is ordinary data upkeep (add products, update stock, edit an FAQ answer), owned by the Content Admin (Noel) — **no machine-learning retraining is required**, because the answers about money and stock are deterministic lookups, not model outputs.

**Systems, tools and APIs**

- **Cloud platform:** AWS Lightsail (Ubuntu) with PM2 keeping the service running and restarting it on failure — a live, verifiable deployment, not a laptop demo.
- **Application stack:** a Node.js / Express application with a pure, testable service core and a JSON data store behind a single `store` interface.
- **AI layer:** OpenClaw (a Claude-class provider) is used only where language is genuinely ambiguous — natural-language CPU queries and image identification — and never overrides a price, stock level, or warranty status.
- **Interfaces are swappable by design.** WhatsApp messaging, payment, and the data store each sit behind a small, stable interface, so a simulated edge can be replaced with a live provider without touching the core logic.

**Human-in-the-loop / escalation**

- When a customer chooses **Talk to Sales**, or the Agent is unsure, or a sensitive case or an order/booking event occurs, the enquiry is escalated. It enters the dashboard as **pending**, is **assigned** to a named rep (manually or round-robin across the roster: Noel, Puay Sim, Peter, Alvin), moves to **in_progress** when that rep replies, and ends at **resolved**. The customer is told, in their language, that a named person will assist them, and the rep's reply appears live in the customer's chat as a clearly-labelled human message.

**Deployment and operating needs (stated honestly, per proposal quality)**

- **WhatsApp** currently runs in a **simulated mode** that mirrors the real message flow through a browser chat page; going live means connecting the WhatsApp Business Cloud API and its tokens behind the same `sender` interface.
- **Payment** currently runs a **simulated / test gateway** — deliberately, there is **no CVV field, no link to a real bank, and no real charge is made.** Going live means connecting a real provider (e.g. Stripe / HitPay / PayNow) behind the same payment interface.
- **Image recognition** uses a vision provider (OpenClaw); when it is rate-limited it **falls back to a numbered category picker**, so the customer is never stuck at a dead end.
- **Operating footprint:** a single small instance, app-port-only firewall, key-only SSH, and `.env`-held secrets kept out of the repository.

**Risk / exposure**

- The honest limitations above (simulated messaging and payment) are the main exposure, and each is contained behind an interface with a clear, low-risk upgrade path. The escalate-when-unsure rule bounds the risk of a wrong automated answer, and the per-enquiry error handling means one bad message can never crash the service for everyone else.

> **[SCREENSHOT 6] — Simulated payment page.**
> *Capture:* Trigger an order to reach `/pay/:id` and screenshot the payment page. *Caption must state clearly: simulated/test gateway — no CVV, not linked to a bank, no real charge.* *Honesty here is a proposal-quality asset, not a weakness.*

> **[SCREENSHOT 7] — Human-in-the-loop: assign a rep.**
> *Capture:* On the dashboard, take a pending "Talk to Sales" enquiry and assign it to a rep (e.g. Noel); screenshot the assigned badge / "assigned to" state. *Shows the escalation path working.*

> **[SCREENSHOT 8] — Rep reply reaching the customer.**
> *Capture:* Screenshot the chat side after the assigned rep replies, showing the customer received the human response as a "(human)" bubble (status in_progress). *Proves the loop closes end to end.*

### 4.2 Scalability

**More users / transactions**

- The automated share carries volume growth at near-zero marginal cost. Peaks are absorbed by the Agent, not by hiring. The stateless request handling and the swappable store mean the same logic runs unchanged whether it is answering ten conversations a day or ten thousand — the only production change is moving the JSON store to a managed database, which is already an interface swap rather than a rewrite.

**Cross-functional workflows / departments**

- The platform already spans the whole customer journey — **sales, ordering, payment, delivery status, warranty status, carry-in and on-site service bookings** — in one channel, with the dashboard shared across roles (Owner, Content Admin, Sales, DevOps). A single conversation can move from a sales enquiry to a warranty check to a repair booking without leaving the chat, and every step lands in the right collection for the right team.

**Monitoring, security and governance**

- PM2 keeps the process alive and observable; every transaction carries a reference number for audit; the dashboard gives a single operational view of who handled what and when. Production hardening (a managed database, dashboard authentication, and a dedicated vision key) is on the roadmap and sits behind the same interfaces, so it can be added without disturbing the proven core.

**Ease of transition prototype → pilot → production**

- Because every external edge is already an interface, moving from simulated to live is a swap, not a rebuild. This is detailed in Section 18 (Roadmap). The 348-test suite is the safety net that makes each of those swaps low-risk: a single `npm test` confirms that adding a live payment gateway has not silently broken the quotation flow.

> **[SCREENSHOT 9] — Service booking (on-site / carry-in) confirmation.**
> *Capture:* Complete an on-site or carry-in booking and screenshot the confirmation with its OS-/CI- reference. *Shows the cross-functional reach beyond just sales.*

> **[SCREENSHOT 10] — Delivery status and warranty status answers.**
> *Capture:* Use **7 Delivery Status** and **8 Warranty Status**, screenshot both instant answers. *Shows two more routine loads fully automated from structured records.*

<div style="page-break-after: always;"></div>

## Section 5 — Proposal Quality

A good proposal is easy to read and act on. This report holds itself to five qualities — Clear, Concise, Evidence-based, Consistent, and Stakeholder-aware. Here is how it meets each, and where the evidence sits.

### 5.1 Clear

Written for a business stakeholder first. The story is stated in one sentence at the top, the structure follows the five business themes, and every technical term is tied back to a business consequence (time saved, orders captured, risk reduced). The Solution Deep-Dive is separated into Part 2 so that a non-technical reader is never forced through the engineering to get the argument.

### 5.2 Concise

Every section proves the case and stops. Points form is used where a list is faster than prose; paragraphs are used where an argument needs to be made. There is no filler and no jargon for its own sake. Where a claim needs proof, it points to a screenshot or to the relevant deep-dive section rather than repeating itself.

### 5.3 Evidence-based

- **Verified facts** (system, scale, tests) are demonstrable live and listed in Appendix B.
- **Assumptions and projections** are explicitly labelled everywhere they appear, with the reasoning shown and a stated plan to validate them in a pilot.
- **Screenshots** (Appendix A) let the reader see the working system, not just read about it.
- **Requirements traceability** (Appendix C) shows that each functional requirement maps to a built, tested capability.

### 5.4 Consistent

The through-line holds from top to bottom: the **problem** (routine, repetitive, after-hours-blind, multilingual enquiries) → the **solution** (an always-on WhatsApp Agent with human escalation) → the **value** (Productivity, Cost, Revenue, Service, Risk, Scale) → the **KPIs** (Section 3) all reference the same story and the same numbers. The deep-dive in Part 2 uses the same figures (979, 60, 50, 348/19, 3 languages) as the business case in Part 1.

### 5.5 Stakeholder-aware

The proposal is written from the SME owner's seat. It names the real people and their roles (Alvin as Owner, Noel as Content Admin, Puay Sim leading Sales, Peter on DevOps), reflects the operating context of a small computer-retail shop, and measures success in the owner's terms. The controls table in Section 15 assigns each risk to a named owner.

### 5.6 One consistent message across proposal and demo

This report and the live demonstration tell the **same** story with the **same** claim: *the Agent reduces processing time, keeps the channel open around the clock, and keeps a human in control.* The demo shows exactly what this report describes — the numbered menu, an instant routine answer, a multilingual reply, a simulated order and payment, a booking, a warranty check, and a human rep stepping in through the dashboard.

<div style="page-break-after: always;"></div>

# Part 2 — Solution Deep-Dive (Evidence Behind the Case)

## Section 6 — Solution Overview & Process Flow

### 6.1 The Agent in one paragraph

A customer messages the shop on WhatsApp and is greeted with a numbered menu covering the whole business. Routine choices — product availability, delivery status, warranty status, service bookings — are answered instantly from structured data in the customer's chosen language. Sales-oriented choices lead through browsing, ordering, and a (simulated) card payment, all available 24/7. At any point the customer can choose **Talk to Sales**, or the Agent can decide it is unsure, and the conversation is escalated to a named human via the rep dashboard — pending, assigned, in progress, resolved.

### 6.2 The menu (the whole shop in one screen)

- **1 Components** · **2 DIY PC** · **3 Carry-in service** · **4 On-site service** · **5 Product Availability** · **6 Talk to Sales** · **7 Delivery Status** · **8 Warranty Status** · **9 About Us** · **+ Language** (1 English · 2 中文 · 3 Bahasa Melayu)

### 6.3 Design philosophy — hybrid, not either/or

The design deliberately avoids two failure modes. A *pure open-ended chatbot* is friendly but will confidently invent a price or stock level — unacceptable for a retailer, because a wrong number erodes trust and can commit the business to a loss. A *rigid keypad menu* is safe but frustrates the large share of customers who simply type what they want. The chosen design is both at once:

- A **numbered menu** for those who tap, and **free-text natural-language understanding** for those who type.
- **Deterministic lookups** for anything involving money or stock.
- An **AI layer** only where language is genuinely ambiguous (natural-language CPU queries, image identification).
- A **human escalation path** as the safe default whenever confidence is low.

### 6.4 Process flow (routine vs commerce vs escalation)

1. **Message in** → welcome + numbered menu (in the customer's language).
2. **Routine path** → structured-data lookup → instant, consistent answer → reference number where relevant. No staff step.
3. **Commerce path** → browse → quotation (Q-) → confirm → payment method → secure pay link → paid → order (ORD-) + invoice (INV-) → delivery order (DO-).
4. **Escalation path** → "Talk to Sales" or Agent-unsure → enquiry created as **pending** → **assigned** to a rep (manual or round-robin) → rep replies (**in_progress**) → **resolved**, with the customer notified by name.

> **[SCREENSHOT 11] — DIY PC package flow.**
> *Capture:* Walk through **2 DIY PC**, screenshot a package selection and its "what's included" details. *Shows the guided commerce path.*

> **[SCREENSHOT 12] — "Talk to Sales" acknowledgement to the customer.**
> *Capture:* Choose **6 Talk to Sales** and screenshot the acknowledgement telling the customer a rep will assist. *Shows the hand-off from the customer's side.*

<div style="page-break-after: always;"></div>

## Section 7 — Innovation Technology Stack

The innovation is not any single component; it is the **combination** — an AI assistant that automates the routine, a human-in-the-loop that owns the exceptions, and a swappable-edge architecture that makes going to production a low-risk swap.

- **AI Assistant** — the business's new front line. It understands the enquiry, serves the right answer from structured data, and drives the guided menu flows (recommend → quote → pay → book → warranty → track). It absorbs the repetitive share of the workload without adding headcount, and is built to **escalate when unsure** rather than guess. Its transformation value is Capacity (scales to any volume), Consistency (the same correct, on-brand answer every hour), and Conversion (a buyer can complete a purchase in-chat, anytime).
- **Human-in-the-Loop** — the rep dashboard with the pending → assigned → in_progress → resolved lifecycle, round-robin assignment across the roster, and customer notification by name. Automation is bounded; a person is always one message away, and every handoff is attributed and auditable. This re-tasks the team from repetitive typing to high-value work (sales, complex faults).
- **OpenClaw (Claude-class AI)** — interprets natural language ("gen 14 i5") and images, but **never overrides** price, stock, or warranty, which stay deterministic. Powerful *and* safe. Vision is currently rate-limited, so it degrades to an honest category-picker fallback.
- **AWS Lightsail (Ubuntu + PM2)** — a genuine 24/7 cloud at a small fixed cost; the technical basis for "the shop never closes"; controlled security (app-port only, key-only SSH). Not a slide mock-up; a running service at `http://52.77.234.193:3000`.
- **Kiro (spec-driven build)** — the platform was built in the Kiro IDE using a requirements → design → tasks workflow, with steering rules (coding and behaviour standards applied consistently) and automation hooks (tests run automatically on save and after each task). This kept the implementation disciplined and testable (**348 tests / 19 suites**) and keeps the cost of future change low.

> **[SCREENSHOT 13] — Test suite passing (348 tests / 19 suites).**
> *Capture:* Run `npm test` and screenshot the passing summary. *Evidence that the core is thoroughly tested — the feasibility claim made visible.*

<div style="page-break-after: always;"></div>

## Section 8 — Solution Design & Architecture

### 8.1 Layered architecture

The design keeps the human-facing logic pure and testable and puts swappable interfaces at the edges.

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

- **Routes** expose the HTTP surface: the inbound webhook, the FAQ management API, the enquiries API (list/detail/resolve/reply/assign), the customer message-polling endpoint, and the payment routes.
- **Controllers** translate HTTP to and from the services and hold no business rules.
- **Services** are the testable core: language, product/FAQ, escalation, sales flow, payment/order, booking, onsite (address recognition), delivery, warranty, i18n, and the AI providers.
- **Edges** are the sender (simulated or cloud) and the store (JSON files now, a managed database later), each behind a small interface.

### 8.2 The enquiry pipeline

Every inbound message flows through the webhook controller: (1) receive and validate — a payload missing the sender id or text is rejected without creating a record; (2) record and sanitize; (3) detect language, where a sticky picker choice overrides auto-detection; (4) handle universal HOME/BACK commands; (5) route by conversation state and content — menu, product/quotation, payment step, booking step, warranty, delivery lookup, image, or FAQ; (6) decide answer vs escalate; (7) respond via the sender; (8) return the reply so it can be inspected. On escalation the pipeline creates an escalation record, sets the enquiry pending, and sends a localized acknowledgement, so the customer is never left waiting silently.

### 8.3 Swappable edges — the key architectural decision

The system has three swappable edges, each behind a small, stable interface. This is the single most important architectural decision because it is what lets the full business logic be built, tested, and demonstrated now while deferring the parts that depend on external approval or contracts.

- **The WhatsApp channel.** The `sender` interface is `send(to, message)`. `simulated.sender` records outbound messages and returns them in the webhook response (no external calls), which the browser chat page reads; `cloud.sender` is the phase-2 path to the WhatsApp Business Cloud API with Meta webhook verification. The mode is selected by `WHATSAPP_MODE`, read at call time so it can switch without a reload. The language, FAQ, escalation, quotation, booking, warranty, and payment logic all depend only on this interface — so switching to the real channel changes nothing in the core.
- **The data store.** The `store` abstraction exposes create/get/list/update per collection over a JSON-file backend. Every service and controller depends only on those functions, never on the file format, so the backend can be replaced with SQLite or a managed database without touching business logic.
- **The payment gateway.** `PAYMENT_MODE=simulated` generates a mock payment link and a test payment page and settles via a callback; `PAYMENT_MODE=live` would swap in a real provider (Stripe, HitPay, or a bank PayNow integration) with no change to the order, invoice, or delivery logic.

This edge-swapping design is the reason the go-live is low-risk: the risky, externally-dependent pieces are isolated at the boundary, and everything valuable — the conversation logic and the commerce/service journeys — is complete and proven behind them.

<div style="page-break-after: always;"></div>

## Section 9 — Data Design

Data is accessed only through the `store` abstraction, which manages ten collections: **enquiries, faqs, escalations, products, deliveries, warranty, orders, invoices, payments, bookings**. Products, deliveries, and the warranty database (and the starter FAQs) are seeded from JSON on first run; orders, invoices, payments, and bookings start empty and are created as customers complete purchases or book repairs.

### 9.1 Verified data volumes

- **979 catalogue items** — 829 components + 150 DIY PC packages — across **21 categories**.
- **72 CPUs** from a 2026 price list, powering natural-language processor queries.
- **60 delivery records** and **50 warranty records**.
- Every catalogue item is `in_stock` at **100 units**. Products carry brand, model, category, price (SGD), stock status, and quantity — **no supplier or third-party name is stored anywhere**.
- **Five CSV exports** are produced for record-keeping and audit: `components.csv` (829), `pc_packages.csv` (150), `deliveries.csv` (60), `warranty.csv` (50), and `test_suites.csv` (19).

### 9.2 Core record shapes

- **Enquiry:** id, sender, sanitized text, detected language and confidence, status (`auto_answered` / `pending` / `assigned` / `in_progress` / `resolved`), matched FAQ id, match confidence, English-fallback flag, who is handling it, and timestamps including who resolved it. Rep-to-customer replies are stored in the same collection as outbound messages (author `rep`) so the customer's chat can display them.
- **FAQ:** id, intent label, per-language keywords, per-language answers (English required), updated-at.
- **Escalation:** id, enquiry id, reason (`low_confidence` / `human_requested` / `order_confirmed` / `warranty_service` / `onsite_booking` / `carry_in_booking`), created-at, status.
- **Payment:** id, sender, method (`card`/`paynow`), status (`pending`/`paid`), mode, quoted product/quantity/amount/currency, quote reference, language, and linked order/invoice/delivery references once settled.
- **Order:** id, order reference (`ORD-YYYYMMDD-NNN`), sender, status, product/quantity/amount, and linked quote/invoice/delivery references.
- **Invoice:** id, invoice reference (`INV-YYYYMMDD-NNN`), order reference, line details, payment method, status (`Paid`).
- **Booking:** id, reference (`OS-`/`CI-YYYYMMDD-NNN`), type, sender, service type or device, date, slot, customer details, problem, fee, status, language.
- **Warranty:** customer id, name, mobile, email, product category, brand, model, serial, invoice, purchase date, status, end date, coverage label, service type, last-service status.

> **[SCREENSHOT 14] — A slice of the seed data.**
> *Capture:* Screenshot a portion of `products.json` or `warranty.csv` showing brand/model/price/stock columns. *Shows the structured data behind the deterministic answers.*

<div style="page-break-after: always;"></div>

## Section 10 — Module & Feature Walkthrough

### 10.1 Core services (pure, tested)

- **Language service** — detects `en` / `ms` / `zh` with a confidence score and a tuned Chinese threshold; defaults to English below threshold; honours a sticky picker preference.
- **FAQ service** — per-language keyword matching with an English fallback flagged when the language is missing.
- **Escalation service** — human-requested and low-confidence rules, each producing a localized acknowledgement.

### 10.2 Product search and quotation

The product service performs natural-language product search and builds quotations. It tokenizes queries — splitting letters from digits so a model number such as "RTX5070" matches a spaced "rtx 5070" — and scores products by name, brand, and category to produce a numbered shortlist. It includes a dedicated **CPU-aware interpretation layer** so that loosely-worded processor queries — "Intel processor generation 14", "i5 14th gen", "core ultra 7", "ryzen 9 9000 series" — are parsed into structured attributes (brand, i-class, Ultra tier, generation, explicit model) and matched precisely against the 72-CPU dataset, falling back to generic search when the query is not CPU-specific. A **budget parser** recognises phrasings like "under $200" or "less than 50" and filters accordingly; when nothing fits, it honestly reports the closest option rather than returning an empty result. A **component-not-stocked guard** prevents a request for a category the shop does not stock as a standalone item from being answered with dressed-up PC packages.

### 10.3 The guided sales flow

The centrepiece converts a casual price question into a confirmed order without the customer needing to know any commands. Asking about an item returns a **numbered shortlist** of up to five matching products, each with its **price and live stock count** ("100 in stock"), and an invitation to reply with a number or type the item name. The customer selects **by number (1–5)** or by a **fuzzy name match** that tolerates filler words ("I want the Logitech K380 please"). The system asks for **quantity**, builds a **quotation** with the line total and units in stock, and invites "confirm", which moves into the payment journey. "Talk to Sales" remains available as the human path at any time.

### 10.4 DIY PC packages and Product Availability

The **DIY PC Package** option (menu 2) presents each package as a whole bundle with its component parts in brackets — CPU, motherboard, RAM, case, power supply — at a single package price. Selecting a package and quantity produces a quotation with the full "what's included" breakdown. Same-specification builds that differ only by price are collapsed into a single "from" line so the shortlist stays readable. A separate **Product Availability** option (menu 5) serves the pure stock enquiry: name an item, get its price and units in stock. Throughout, the "no wrong info" principle holds — the system never guesses a price or stock level.

### 10.5 Image recognition and the honest fallback

Image uploads route to a vision provider that maps a recognition label to a catalogue category and offers the matching priced shortlist. When the AI gateway is rate-limited or cannot confidently identify a photo, the system degrades honestly to a **numbered category picker** rather than fabricating a result — the people-before-technology principle applied to a failure mode.

> **[SCREENSHOT 15] — Natural-language CPU query.**
> *Capture:* Type "Intel processor generation 14" (or similar) and screenshot the matched processor results. *Shows the AI-assisted interpretation layer.*

> **[SCREENSHOT 16] — Itemised quotation with reference.**
> *Capture:* Select a package, choose a quantity, and screenshot the quotation with its Q- reference and "what's included" breakdown.

<div style="page-break-after: always;"></div>

## Section 11 — Conversational Commerce (Payment → Order → Delivery)

The nine-step journey carries the customer from enquiry to a fulfilled, trackable order entirely in chat:

1. Enquiry → 2. Recommendation → 3. Selection → 4. Quotation (`Q-`) → 5. Confirm → 6. Payment method (**1 Card / 2 PayNow / SGQR**) → 7. Secure pay link (`/pay/<id>`) → 8. Payment confirmation (`ORD-` + `INV-`, "Preparing Order") → 9. Delivery order (`DO-`), trackable via option 7.

The four references share one daily running number, so a customer, a rep, and the delivery team can all cross-reference the same transaction easily.

### 11.1 Honest-by-design payment

Payment runs on a **simulated gateway** (`PAYMENT_MODE=simulated`) — there is **no real charge, no CVV field, and no link to a real bank**. It is a secure *test* gateway designed to swap to a real provider (Stripe / HitPay / PayNow) behind the same `payment.service` interface, with no core change. The integrity guardrails are enforced in code and covered by tests:

- Nothing is marked paid without the gateway callback.
- The order, invoice, and delivery records are created only *after* payment confirms.
- Amounts always come from the stored quotation, never re-entered.
- The callback is **idempotent** — completing the same payment twice does not create duplicate orders.

The delivery order is written in the same shape the Delivery Status lookup understands, so a purchase made entirely in chat is immediately trackable — closing the loop between sale and fulfilment.

> **[SCREENSHOT 17] — Payment confirmation with ORD / INV / DO references.**
> *Capture:* Complete a simulated payment and screenshot the "Payment received" confirmation showing the order, invoice, and delivery references. *Caption must restate: simulated gateway, no real charge.*

<div style="page-break-after: always;"></div>

## Section 12 — Service Bookings & Warranty

### 12.1 Online bookings — onsite and carry-in

Options 3 and 4 are structured, numbered, multi-step bookings that each produce a confirmed reference and a pending record so the service team is notified. A booking is created only once every step is complete.

- **Onsite (option 4):** service type (Troubleshooting / Hardware Repair / PC Setup) → date (next three days) → time slot → details → `OS-YYYYMMDD-NNN` CONFIRMED (SGD 60/visit). Typing an address directly also starts it.
- **Carry-in (option 3):** date → slot → device (Laptop / Desktop / Printer / Other) → problem → `CI-YYYYMMDD-NNN` Awaiting Drop-Off (SGD 30, 1–2 working days, with the service-centre address and hours).

### 12.2 Warranty check and service handoff

Menu option 8 handles warranty. A customer picks option 8 or simply pastes a serial/invoice anywhere; the system recognises the pattern and looks it up (serial → invoice → mobile → name). On a single match it replies with the customer, product, serial, status, expiry, and coverage, then offers **1** onsite booking · **2** carry-in booking · **3** talk to service — feeding straight into the booking modules. Serial matching normalizes case, spaces, and repeated dashes (so `SG26-TP--0015` and `sg26-tp-0015` both match); an unknown serial returns an honest "not found"; a record is returned only to a query that matches it. The 50 records are synthetic, and the reply is fully localized.

> **[SCREENSHOT 18] — Warranty lookup with the 1/2/3 service handoff.**
> *Capture:* Send option **8** then a serial (e.g. `SG26-ASU-0003-22173`) and screenshot the warranty reply with the 1/2/3 options.

<div style="page-break-after: always;"></div>

## Section 13 — Multilingual Support & Navigation

The assistant is fully trilingual (English, Bahasa Melayu, Chinese). Localization covers product lists, quotations, selection prompts, confirmations, the full payment journey, the booking flows, warranty replies, and every menu-option response; computer terms (CPU, GPU, RAM, SSD, DDR5) and postal addresses stay English for clarity.

- **Language selection** — automatic detection plus an explicit **numbered picker** (`1 English / 2 中文 / 3 Bahasa Melayu`, or type the name), whose choice is sticky.
- **Universal navigation** — `0` / `menu` / `home` returns to the main menu; `back` steps to the previous screen (with a per-flow step-back mapping) at every step in all three languages.
- **One-tap controls** — the chat page adds persistent 🏠 Menu / ◀ Back buttons, and multi-step prompts carry a localized footer hint, so a customer can never get stuck mid-flow.

> **[SCREENSHOT 19] — Numbered language picker + navigation hint.**
> *Capture:* Send "language" and screenshot the numbered picker, plus a step that shows the 0/back hint.

<div style="page-break-after: always;"></div>

## Section 14 — Human-in-the-Loop Console

The dashboard is a live takeover console, not just a queue, and it is where the "people before technology" principle becomes tangible.

### 14.1 How escalation works

When the bot escalates — because the customer asked for a person, the bot was not confident, a sensitive case arose, or an order/booking event occurred — the enquiry appears **pending** on the dashboard with its full conversation and the escalation reason. The customer, meanwhile, has already received an instant localized acknowledgement, so no one is left waiting silently.

### 14.2 Assignment and the status lifecycle

A rep can be assigned manually or by round-robin across the roster (Noel, Puay Sim, Peter, Alvin). The status lifecycle is **pending → assigned → in_progress → resolved**: assigning sets `assigned` and records the rep; the rep's first reply moves it to `in_progress` and records who is handling it; marking it resolved stores who resolved it and when. The customer receives a localized note that a named person will assist them.

### 14.3 The two-way reply loop

A rep replies to the customer directly from the detail panel. The reply is delivered through the **same swappable sender the bot uses**, stored in the customer's thread as an outbound rep message, and the customer's chat page polls for new messages every few seconds and renders them as a clearly-labelled "(human)" bubble — so from the customer's side, a real person has seamlessly joined the same conversation.

Two implementation details protect the loop's integrity: rep-authored messages are filtered out of both the dashboard's enquiry list and the bot's conversation-state reconstruction, so a human reply never clutters the queue or confuses the bot's flow tracking; and because the reply path reuses the same `sender` interface, it works today in simulated mode and maps directly to a real WhatsApp send when the Cloud API is enabled — with no change to the console.

### 14.4 Reducing dashboard clutter

To keep the console usable as history grows, a **Clear-history** action removes only resolved/closed enquiries and never touches pending, assigned, or in_progress items, and the default dashboard filter is **"Needs attention"** (pending + assigned + in_progress) so reps see the live work first without scrolling past closed threads.

> **[SCREENSHOT 20] — Two-way console: rep reply appears in the customer chat.**
> *Capture:* Chat and dashboard side by side — a reply sent from the dashboard appears as a "(human)" bubble in the customer's chat. *Proves the loop end to end.*

<div style="page-break-after: always;"></div>

## Section 15 — Controls, Risks & Human Oversight

| Risk | Control | Owner |
|---|---|---|
| Confident but wrong answer | Confidence threshold; below it, escalate; English-required FAQs; prices/stock only from data | Noel |
| Wrong language detected | Default-to-English with a flagged fallback | Alvin |
| Outdated FAQ content | Admin API with edit history; periodic review | Noel |
| Payment integrity | Nothing paid without gateway callback; records only after payment; amounts from stored quote; idempotent; PCI provider when live | Alvin / Peter |
| Warranty / PII exposure | Synthetic data; returned only to a matching query; never lists others | Alvin |
| Leaked secrets | `.env` git-ignored; key-only SSH; app-port-only firewall | Peter |
| One enquiry crashing the service | Per-enquiry error → escalate + log, never crash the pipeline | Alvin |
| Prompt / message injection | Untrusted customer text; deterministic matcher; any LLM gated by escalate-when-unsure | Alvin |

**Human approval points:** go-live to real WhatsApp and to a live payment gateway require Project-Owner sign-off; FAQ changes require Content-Admin review; server/firewall changes require DevOps approval; every escalation is closed by a rep with attribution; complaints and sensitive cases always route to a person.

<div style="page-break-after: always;"></div>

## Section 16 — Testing & Verification

Testing is the earliest and most frequent signal of health, and — in a system that quotes prices and takes (simulated) payments — it is a business requirement rather than a nicety. The suite uses **Jest** and **supertest** and is run with a single `npm test`. It covers unit tests for language detection, FAQ matching, escalation, product search, quotation, delivery, warranty, i18n/language, image identification, the WhatsApp sender, and the menu, plus integration tests for the webhook, the enquiry and FAQ APIs, the end-to-end payment journey, the onsite and carry-in booking flows, the warranty lookup and service handoff, the numbered language picker and HOME/BACK navigation, and the two-way rep reply console.

The current verified state is **348 tests passing across 19 test suites**. Representative examples of what the suites assert:

- **Payment journey** — a full drive from enquiry → quotation → confirm → payment method → secure link → simulated gateway callback → order/invoice/delivery creation → delivery tracking, plus that nothing is marked paid without the callback, that amounts come from the stored quote, and that completing the same payment twice does not create duplicate orders (idempotency).
- **Booking** — both the onsite and carry-in flows driven through every step to a confirmed `OS-`/`CI-` booking, with invalid-choice re-prompting and daily-sequenced references verified.
- **Warranty** — serial/invoice lookup including the format-tolerant match (`SG26-TP--0015` ≡ `sg26-tp-0015`), the 1/2/3 service handoff, and an honest "not found" for unknown serials.
- **Navigation** — the numbered language picker (1/2/3 or name) and the universal HOME/BACK commands stepping correctly through every flow.
- **Rep reply console** — a rep reply is delivered to the customer thread, marks the enquiry `in_progress`, is retrievable by the customer's poll, does not leak into the dashboard list, and does not corrupt the conversation state.

Two Kiro hooks keep the suite green automatically: tests run on every source or test file save, and again after each completed task. Because services are pure and free of Express objects, their tests assert specific inputs against expected outputs directly, which is what makes early results meaningful and refactoring safe.

<div style="page-break-after: always;"></div>

## Section 17 — Deployment & Operations

The platform is deployed to an **AWS Lightsail Ubuntu** instance at `52.77.234.193`, kept alive by **PM2**. It runs with `WHATSAPP_MODE=simulated`, `USE_OPENCLAW=true`, `VISION_PROVIDER=openclaw`, `PAYMENT_MODE=simulated`, and `PUBLIC_BASE_URL=http://52.77.234.193:3000`. Only the app port is open in the Lightsail firewall; SSH is key-only. Deployment copies changed files and restarts PM2; data can be reseeded by removing a collection file before restart.

Live, verified endpoints:

- **Customer chat** — `/chat.html`
- **Rep dashboard** — `/dashboard.html`
- **Test payment page** — `/pay/<id>`
- **Health check** — `/health` → `{"status":"ok"}`

> **[SCREENSHOT 21] — Health check + running chat and dashboard.**
> *Capture:* Screenshot `/health` returning `{"status":"ok"}` alongside the running chat and dashboard. *Proof the service is live in the cloud.*

<div style="page-break-after: always;"></div>

## Section 18 — Roadmap: Prototype → Pilot → Production

Because every external edge already sits behind an interface, each step below is an incremental swap at controlled cost and risk — not a rebuild.

**Now — Prototype (verified today)**

- Live on AWS; the full customer journey working; 348 tests passing; 3 languages; simulated WhatsApp and payment edges; human-in-the-loop dashboard with assignment and clear-history.

**Next — Pilot (2–4 weeks)**

- Connect the **WhatsApp Business Cloud API** behind the existing messaging interface.
- **Log real enquiries** to validate the KPI baselines in Section 3 (the assumptions become measured facts).
- Add dashboard **authentication** and a **managed database** for durability.

**Then — Production**

- Connect a **real payment provider** (Stripe / HitPay / PayNow) behind the existing payment interface — the current version has no CVV and no bank link by design, so this is the step that makes payment real.
- Add a **dedicated vision key** for reliable image recognition (removing the rate-limit fallback dependency).
- Feed the captured orders / bookings / warranty data into **CRM and analytics**; broaden languages and matching — always gated by the escalate-when-unsure rule.

<div style="page-break-after: always;"></div>

## Conclusion

This proposal makes the business case first and the engineering case second, in that order, because that is how the owner thinks about it. The business case: a real, costly, after-hours-blind, multilingual enquiry load is turned into an automated, always-on WhatsApp channel that takes the routine off staff, captures revenue around the clock, and keeps humans in control where judgement matters. The engineering case: a thoroughly-tested core (**348 tests / 19 suites**) behind swappable edges, built spec-driven in Kiro and deployed live on AWS, with an incremental and honest path from simulated edges to production.

It is consistent from problem to KPI, honest about what is assumed versus verified, and it is not a mock-up on a slide — it is a working, deployed platform that already carries the whole customer journey (enquiry → sales → payment → delivery → warranty → booking) in one 24/7 channel, ready to graduate its simulated edges to production when the business is ready. Across all five themes, the story holds together: a **meaningful problem**, clear **business value**, **measurable outcomes**, demonstrated **feasibility and scalability**, and a **clear, evidence-based, consistent proposal**.

<div style="page-break-after: always;"></div>

## Appendix A — Screenshot Capture List

Drop the captured PNGs into `../screenshots/` and the tags below will line up with the report.

| # | Section | What to capture |
|---|---|---|
| 1 | Executive Summary | Chat welcome + full numbered menu (1–9 + language) |
| 2 | 1.5 Problem | "Before vs After" enquiry journey diagram |
| 3 | 2.4 Service | Instant Product Availability / stock answer |
| 4 | 2.4 Service | Same answer/menu in another language |
| 5 | 3.1 KPIs | Rep dashboard: statuses + reference numbers |
| 6 | 4.1 Feasibility | Simulated payment page (label: no CVV, no bank, no real charge) |
| 7 | 4.1 Feasibility | Dashboard: assign a rep to a pending enquiry |
| 8 | 4.1 Feasibility | Rep reply reaching the customer (in_progress) |
| 9 | 4.2 Scalability | Service booking confirmation (OS-/CI- reference) |
| 10 | 4.2 Scalability | Delivery status + warranty status instant answers |
| 11 | 6.4 Process Flow | DIY PC package selection + "what's included" |
| 12 | 6.4 Process Flow | "Talk to Sales" acknowledgement to the customer |
| 13 | 7 Innovation Stack | Test suite passing (348 tests / 19 suites) |
| 14 | 9 Data Design | Slice of products.json / warranty.csv |
| 15 | 10.5 Modules | Natural-language CPU query results |
| 16 | 10.5 Modules | Itemised quotation with Q- reference |
| 17 | 11 Commerce | Payment confirmation with ORD / INV / DO |
| 18 | 12.2 Warranty | Warranty lookup with 1/2/3 handoff |
| 19 | 13 Multilingual | Language picker + navigation hint |
| 20 | 14.3 Human-in-loop | Two-way console: rep reply in customer chat |
| 21 | 17 Deployment | Health check `{"status":"ok"}` + live chat/dashboard |

## Appendix B — Verified Figures & Assumptions Register

**Verified (demonstrable live):**

- 979 catalogue items = 829 components + 150 DIY PC packages, across 21 categories (incl. 72 CPUs).
- 60 delivery records; 50 warranty records; all stock quantities at 100 units.
- 348 automated tests across 19 suites, passing.
- 5 CSV exports (components, pc_packages, deliveries, warranty, test_suites).
- 3 languages: English, 中文, Bahasa Melayu.
- Live deployment: AWS Lightsail (Ubuntu + PM2), `http://52.77.234.193:3000`.
- Reference formats: Q-/ORD-/INV-/DO-YYYYMMDD-NNN (commerce), OS-/CI-YYYYMMDD-NNN (bookings).
- Rep roster & lifecycle: Noel, Puay Sim, Peter, Alvin; pending → assigned → in_progress → resolved; round-robin assignment; clear-history keeps active items.

**Assumptions / projections (to validate in pilot):**

- The manual "before" workflow (Section 1.2).
- All KPI baselines and targets in Section 3 (labelled *assumption* / *projection* / *TBD in pilot*).

**Honest limitations (stated deliberately):**

- WhatsApp runs in **simulated mode** (mirrors real flow; live Cloud API is a roadmap swap).
- Payment runs on a **simulated / test gateway** — **no CVV, no bank link, no real charge**.
- Vision (OpenClaw) **falls back to a category picker** when rate-limited.

## Appendix C — Requirements Traceability

| Requirement | Built capability | Evidence |
|---|---|---|
| R1 Receive & record enquiries | Webhook pipeline, sanitize, reject invalid payloads | Webhook integration tests |
| R2 Detect language (EN/MS/ZH) | Language service + sticky picker | Language unit tests, [SCREENSHOT 4] |
| R3 Auto-answer FAQs / product & stock | FAQ + product/quotation services | Product & FAQ tests, [SCREENSHOT 3] |
| R4 Escalate uncertain / human-requested | Escalation service + localized ack | Escalation tests, [SCREENSHOT 12] |
| R5 Rep console (reply / assign / resolve) | Dashboard two-way console + lifecycle | Rep-reply tests, [SCREENSHOT 20] |
| R6 Manage FAQ answers | FAQ admin API (English required) | FAQ API tests |
| R7 Swappable WhatsApp / payment / store | Sender, payment, store interfaces | Payment journey tests, Section 8.3 |
| R8 Visible, testable results | `npm test` + live endpoints | [SCREENSHOT 13], [SCREENSHOT 21] |
