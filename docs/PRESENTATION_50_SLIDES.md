# AI-Powered WhatsApp Conversational Commerce Platform
## 55-Slide Presentation Deck — BIS Computer Services

> Screenshot guidance is marked **[SCREENSHOT]**. Capture from the live system at http://52.77.234.193:3000 (chat.html and dashboard.html) unless noted. Verified figures used throughout: 979 catalogue (829 components + 150 packages) · 60 deliveries · 50 warranty records · 348 tests / 19 suites · 3 languages.
> Innovation technology stack: **AI Assistant · Human-in-the-Loop · OpenClaw · AWS Lightsail · Kiro** (Slides 8a–8e).

---

### Slide 1 — Title
**AI-Powered WhatsApp Conversational Commerce Platform**
BIS Computer Services — Enquiry → Sales → Payment → Delivery → Warranty → Booking
Presented by: [Your name] · Date: [Date]
Team: Alvin (Project Owner) · Noel (Content Admin) · Puay Sim (Lead Rep) · Peter (DevOps)
**[SCREENSHOT]** Chat welcome screen (chat.html) as the hero image.

---

### Slide 2 — Agenda
1. Problem & business impact
2. Objectives & success criteria
3. **Innovation technology stack** (AI Assistant · Human-in-the-Loop · OpenClaw · AWS Lightsail · Kiro)
4. Solution overview (hybrid AI) & design
5. Requirements · data design & mock data
6. Scope & 21-day plan (3 milestones)
7. Feature walkthrough with demos
8. Human-in-the-loop & controls
9. Results, roadmap & Q&A

---

### Slide 3 — The Problem Statement
**Managing WhatsApp Sales Enquiries**
Sales reps receive a high volume of WhatsApp enquiries daily — availability, pricing, delivery, hours, warranty, "where is my order". Answering them individually consumes most of the workday, delays high-value customers, and reduces time for selling.

---

### Slide 4 — Why It Matters (Business Impact)
- Reps spend hours/day on repetitive replies
- Slow responses at peak → lost buyers
- No after-hours coverage → enquiries missed until next day
- "Where is my order?" calls congest the hotline
- Knowledge locked in individuals → inconsistent answers
**Root cause:** no automated first layer to absorb routine enquiries and move a buyer to payment + fulfilment.

---

### Slide 5 — Quantifying the Load
- ~120 enquiries/day, ~65% repetitive
- ~3 minutes each → **~3.9 hours/day** of skilled rep time on non-judgement work
- Nearly half a full-time role spent "typing", before context-switching cost
- After-hours silence = a permanent leak in the sales funnel
**The expensive resource (rep time) is spent on the cheapest work.**

---

### Slide 6 — Main Objective
Take the **repetitive workload off the sales team** by answering routine enquiries instantly, 24/7, in the customer's language — while routing genuine opportunities and anything uncertain to a human, and moving ready buyers all the way to a paid, fulfilled order.
**Guiding principle:** *People before technology — solve the human workload first.*

---

### Slide 7 — Objectives Broken Down
- **O1** Auto-answer top FAQs (hours, delivery, payment, warranty)
- **O2** Product price + **live stock** from approved data
- **O3** Budget-aware PC packages + itemised quotation
- **O4** **End-to-end commerce**: quotation → payment → order/invoice → delivery
- **O5** **Online booking** (onsite + carry-in) + **warranty check**
- **O6** Delivery-status self-service · multilingual (EN/MS/ZH, numbered picker) · 0/back navigation
- **O7** Human-in-the-loop dashboard + deploy with measurable results

---

### Slide 8 — What "Digital Transformation" Means Here
- **Automation** — software absorbs the routine load
- **Availability** — the shop is effectively open 24/7 on WhatsApp
- **Data** — every quotation, order, invoice, booking, warranty interaction captured structurally
Not a chatbot bolt-on — a change to the **economics of customer engagement**; humans elevated to judgement work.

---

### Slide 8a — Innovation Technology Stack (Overview)
Five pillars make an enterprise-grade platform feasible at SME cost & risk:
- **AI Assistant** — the always-on front line
- **Human-in-the-Loop** — automation with people in control
- **OpenClaw** — Claude-class AI reasoning (bounded)
- **AWS Lightsail** — always-on, low-cost cloud
- **Kiro** — spec-driven, testable, maintainable build
*Not technology for its own sake — the right tools arranged so a small team serves more customers, around the clock, better.*

---

### Slide 8b — Innovation Pillar: The AI Assistant
The business's new **front line** — greets every customer, 24/7, in 3 languages.
- Doesn't just answer — **drives outcomes**: recommend → quote → pay → book → warranty → track
- Absorbs the repetitive 60–70% of workload without adding headcount
- Transformation value: **Capacity** (scales to any volume) · **Consistency** (same prompt, correct, on-brand service every hour) · **Conversion** (buyer completes purchase in-chat, anytime)
**[SCREENSHOT]** Chat welcome + a completed enquiry.

---

### Slide 8c — Innovation Pillar: Human-in-the-Loop
Automation is **bounded** — a person is always one message away.
- Uncertain / sensitive / "talk to a person" → escalate to a rep
- Two-way console: rep replies **live** into the same chat; customer sees a "human" bubble
- **Re-tasks** the team from repetitive typing to high-value work (sales, complex faults)
- Every handoff attributed & auditable
*Efficiency of automation + trust of human service = competitive advantage.*
**[SCREENSHOT]** Chat + dashboard side by side (rep reply lands in chat).

---

### Slide 8d — Innovation Pillar: OpenClaw + AWS Lightsail
- **OpenClaw (Claude-class AI)** — interprets natural language ("gen 14 i5") & images; **never overrides** price/stock/warranty (those stay deterministic). Powerful *and* safe. (Vision currently rate-limited → honest category-picker fallback.)
- **AWS Lightsail (Ubuntu + PM2)** — genuine 24/7 cloud at small fixed cost; the technical basis for "the shop never closes"; controlled security (app-port only, key-only SSH); scales up in a contained way.
**[SCREENSHOT]** Health endpoint `{"status":"ok"}` = live cloud service.

---

### Slide 8e — Innovation Pillar: Kiro (Spec-Driven Build)
Built in the **Kiro IDE**: requirements → design → tasks, + steering + hooks.
- Steering files = coding/behaviour standards applied consistently
- Hooks = tests run automatically on save & after each task
- Testable acceptance criteria → "done" is objective; recorded decisions → safe future change
**Business value:** features shipped weekly with the suite kept green → low **cost of future change**.
**[SCREENSHOT]** `.kiro/specs` and `.kiro/steering` folders in the editor.

---

### Slide 9 — Solution Overview (Hybrid AI)
- **Deterministic core** — fast, correct answers from approved data (FAQ, catalogue, delivery, warranty)
- **AI reasoning layer (OpenClaw)** — interprets natural language & images; never overrides price/stock
- **Human escalation** — people stay in control, and can take over live
**[SCREENSHOT]** Chat showing welcome + quick menu.

---

### Slide 10 — Why Hybrid (Not Pure AI, Not Rigid Menu)
- A **confidently wrong** price is worse than no answer → prices/stock only from data
- AI used where language is genuinely ambiguous (NL CPU queries, images)
- **Numbered menus + free text** → some tap, some type; both supported
- Uncertainty always escalates to a person

---

### Slide 11 — The Enquiry Pipeline (Technical Workflow)
Message → Sanitise → Record → Detect language → HOME/BACK? → Route (menu / product / booking / payment / warranty / delivery / image) → Confident? → Reply, else Escalate → Log
> Each stage deterministic and testable; AI augments, never overrides.
**[SCREENSHOT]** A pipeline diagram (draw in slides) or the chat flow.

---

### Slide 12 — Architecture at a Glance
| Layer | Technology |
|---|---|
| Channel | WhatsApp webhook (Node.js / Express) |
| Deterministic core | FAQ, product/quotation, delivery, warranty, booking, payment |
| AI layer | OpenClaw (Claude-class model) |
| Data store | JSON store (swappable to managed DB) |
| Hosting | AWS Lightsail (Ubuntu, PM2) |
**Swappable edges:** channel, AI, payment, database — each upgradable without rewriting logic.

---

### Slide 13 — Swappable Edges (De-risking Go-Live)
- **WhatsApp**: `simulated` now → `cloud` (Business API) later, same `sender` interface
- **Payment**: `simulated` gateway → Stripe/HitPay/PayNow, same `payment.service`
- **Store**: JSON files → SQLite/managed DB, same `store` interface
Build & demo the full logic now; graduate edges to production later — no core rewrite.

---

### Slide 14 — Requirements (Functional)
- R1 Receive & record every enquiry · detect language (EN/MS/ZH)
- R2 Match FAQ & answer routine questions
- R3 Product search + live stock, budget reasoning, quotation
- R4 **Payment → order → invoice → delivery** (simulated gateway)
- R5 **Online booking** (onsite & carry-in) + **warranty check**
- R6 Delivery-status lookup (order no / name / phone) · image ID
- R7 Escalate low-confidence / human requests
- R8 Rep dashboard: review, **reply to customer (live two-way)**, resolve

---

### Slide 15 — Requirements (Non-Functional)
- **Accuracy:** price/stock always correct or escalate
- **Availability:** 24/7, after-hours capture
- **Reliability:** one failed enquiry never crashes the pipeline
- **Speed:** first response < 5 seconds
- **Privacy:** PII used only for that customer's enquiry; synthetic demo data
- **Maintainability:** swappable components, full test suite

---

### Slide 16 — Design Principles
- **People before technology** — uncertainty & human requests go to a rep
- **No wrong info** — answer only from approved data; exclude unclear records
- **Deterministic first, AI second** — predictable core, AI for language/images
- **Incremental delivery** — each week ships a usable increment
- **Vendor-neutral, swappable** — future-proof integrations

---

### Slide 17 — Spec-Driven Build in Kiro
- Built via **requirements → design → tasks** in the Kiro IDE
- **Steering files** capture coding & behaviour standards applied throughout
- **Hooks** run tests automatically on save and after each task
- Keeps the solution maintainable after the original builder moves on
**[SCREENSHOT]** The `.kiro/specs` and `.kiro/steering` folders in the editor.

---

### Slide 18 — Data Design (Collections)
Ten store collections: enquiries, faqs, escalations, products, deliveries, warranty, orders, invoices, payments, bookings.
- Seeded on first run: FAQs, products, deliveries, warranty
- Created live: orders, invoices, payments, bookings
- All access via one `store` interface (swappable backend)

---

### Slide 19 — Mock Data (Volumes)
- **Catalogue:** 979 items (829 components + 150 PC packages), price + stock
- **CPUs:** 72 (2026 price list) for natural-language queries
- **Deliveries:** 60 records · **Warranty:** 50 records
- Every item: qty **100**, in-stock; unclear rows excluded
- No supplier/third-party name stored — brand/model/price only
**[SCREENSHOT]** A slice of products.json / warranty.csv.

---

### Slide 20 — Five CSV Exports (Records)
- `components.csv` — 829
- `pc_packages.csv` — 150
- `deliveries.csv` — 60
- `warranty.csv` — 50
- `test_suites.csv` — 19
Produced by `scripts/export_csv.js` for record-keeping and audit.

---

### Slide 21 — Scope & Approach (3 Milestones × 7 days = 21 days)
- **Week 1:** Foundation + instant FAQ automation
- **Week 2:** Product, pricing, quotation & delivery intelligence
- **Week 3:** AI reasoning, image ID, dashboard, commerce, booking, warranty, deploy
Each milestone ends with a live demo and sign-off.

---

### Slide 22 — Milestone 1: Scope (Days 1–7)
**Foundation & Instant FAQ Automation**
- Enquiry pipeline on an always-on host
- Language detection (EN/MS/ZH)
- Branded welcome + numbered quick menu
- FAQ knowledge base + rule-based escalation + enquiry log
**Assumption:** WhatsApp simulated; FAQ answers approved.

---

### Slide 23 — Milestone 1: Subtasks
1. Pipeline skeleton (receive → record → reply)
2. Language detection service
3. Welcome + menu + "type naturally"
4. FAQ matcher + knowledge base
5. Escalation logic + handover
6. Tests + deploy to AWS
7. Demo & sign-off

---

### Slide 24 — Milestone 2: Scope (Days 8–14)
**Product, Pricing, Quotation & Delivery Intelligence**
- Import & structure catalogue (price + stock)
- Product search + budget-aware reasoning
- PC packages by tier + itemised quotation
- Delivery-status self-service (order no / name / phone)
**Assumption:** data approved; unclear rows excluded, not guessed.

---

### Slide 25 — Milestone 2: Subtasks
1. Catalogue ingestion & category mapping
2. Product search + price/stock answers
3. Budget filtering + honest closest-match
4. PC package tiers (collapsed price ranges)
5. Quotation with "What's included" breakdown
6. Delivery lookup service + menu option
7. Tests + deploy + demo

---

### Slide 26 — Milestone 3: Scope (Days 15–21)
**AI, Image ID, Dashboard, Commerce, Booking, Warranty & Production**
- OpenClaw AI + image identification
- Two-way rep dashboard
- Conversational commerce (payment → order → delivery)
- Online booking + warranty check
- Deploy & harden on AWS Lightsail
**Assumption:** AI capability available; official channel onboarding in parallel.

---

### Slide 27 — Milestone 3: Subtasks
1. OpenClaw intent extraction + image ID
2. Dashboard: enquiries, conversation, two-way reply, resolve
3. Conversational commerce: payment → order → invoice → delivery
4. Online booking (onsite & carry-in) + warranty check
5. Numbered language picker + 0/back navigation
6. Reporting, monitoring, backups; final demo & handover

---

### Slide 28 — Feature: Quick Menu + Natural Language
Customers reply with a **number** or **type freely**. Menu option 2 shows real PC packages by budget tier immediately — no "a rep will follow up".
**[SCREENSHOT]** Option 2 reply — DIY PC packages by tier.

---

### Slide 29 — Feature: Product Price + Live Stock
Ask about any item → numbered shortlist with **price and units in stock** (e.g. "100 in stock"). Option 5 (Product Availability) is the dedicated stock entry point.
**[SCREENSHOT]** `how much is a keyboard` → shortlist with stock counts.

---

### Slide 30 — Feature: Natural-Language CPU Queries
"Intel processor generation 14", "i5 14th gen", "ryzen 9 9000 series" → mapped to the right processors from the 72-CPU dataset.
**[SCREENSHOT]** A natural-language CPU query and its results.

---

### Slide 31 — Feature: Budget-Aware Quotation
"I prefer this package, 1 set" → itemised quotation (CPU, motherboard, RAM, SSD, GPU, PSU, cooling, case, OS), disambiguated by price, with a quote reference.
**[SCREENSHOT]** Quotation with reference + "What's included" breakdown.

---

### Slide 32 — Feature: Conversational Commerce (Overview)
The chat carries the **whole journey**, not just enquiries:
Quotation → confirm → **Card / PayNow** → secure pay link → **paid** → order + invoice → delivery.
Reframes the channel from cost centre to revenue channel.

---

### Slide 33 — Commerce: The 9-Step Journey
1. Enquiry → 2. Recommendation → 3. Selection → 4. Quotation (`Q-`) → 5. Confirm → 6. Payment method → 7. Secure pay link → 8. Confirmation (`ORD-` + `INV-`) → 9. Delivery (`DO-`)
All four refs share one daily running number → easy cross-reference.

---

### Slide 34 — Commerce: Payment Options & Confirmation
- **1. 💳 Pay by Card** · **2. 🏦 PayNow / SGQR**
- Secure (test) pay page → "✅ Payment received": order, invoice, amount, "Preparing Order"
- Delivery order created + trackable via option 7
**[SCREENSHOT]** Payment offer → /pay page → confirmation with ORD/INV/DO.

---

### Slide 35 — Commerce: Simulated Gateway (Honest by Design)
- `PAYMENT_MODE=simulated` (no real charge) — a secure **test** gateway
- Swappable to Stripe/HitPay/PayNow behind the same interface, no core change
- **Guardrails:** nothing paid without gateway callback; order/invoice/delivery only after payment; amounts from stored quote; idempotent

---

### Slide 36 — Feature: Online Booking (Onsite)
Option 4: service type → date → time slot → details → **`OS-YYYYMMDD-NNN` CONFIRMED** (SGD 60/visit). Numbered steps, all 3 languages. Typing an address directly also starts it.
**[SCREENSHOT]** Onsite service-type picker → "✅ Appointment confirmed" card.

---

### Slide 37 — Feature: Online Booking (Carry-in)
Option 3: date → time slot → device → problem → **`CI-YYYYMMDD-NNN` Awaiting Drop-Off** (SGD 30, 1–2 working days), with service-centre address & hours.
**[SCREENSHOT]** Carry-in booking confirmation card.

---

### Slide 38 — Feature: Warranty Check (option 8)
Send a **serial / invoice** (or name/phone) → product, status, valid-until, coverage (e.g. "1 Year Onsite Warranty"), then **1** onsite · **2** carry-in · **3** service.
Format-tolerant serial matching; unknown serial → honest "not found".
**[SCREENSHOT]** `8` → `SG26-ASU-0003-22173` → warranty reply with 1/2/3.

---

### Slide 39 — Feature: Delivery-Status Self-Service (option 7)
Enter order number, name, or handphone → status, driver ETA, arranged window, driver contact. Removes peak-hour hotline calls; also tracks orders paid in-chat.
**[SCREENSHOT]** `7` → `DO202600003` → delivery status.

---

### Slide 40 — Feature: Image Identification & Honest Fallback
Upload a photo → numbered shortlist of matching items with prices. If AI can't confidently identify it, offer a **numbered category picker** instead of a dead end.
**[SCREENSHOT]** Uploaded image → identified shortlist (or the composer).

---

### Slide 41 — Feature: Multilingual (EN / MS / ZH)
Auto-detects the language; a Malay or Chinese question gets a Malay/Chinese reply. Computer terms (CPU/GPU/RAM/SSD) and addresses stay English for clarity.
**[SCREENSHOT]** A Chinese product reply.

---

### Slide 42 — Feature: Numbered Language Picker & Navigation
- **Picker:** reply **1 English · 2 中文 · 3 Bahasa Melayu** (or type the name); explicit choice sticky
- **Navigation:** `0`/`menu`/`home` → main menu; `back` → previous step (any flow, all languages)
- One-tap 🏠 Menu / ◀ Back buttons on the chat page
**[SCREENSHOT]** The numbered picker + a step showing the 0/back hint.

---

### Slide 43 — Human-in-the-Loop: When It Escalates
Escalation triggers: explicit human request · low confidence · order/booking events · errors. Customer gets an instant localized acknowledgement; enquiry goes **pending** with the reason on the dashboard.
**[SCREENSHOT]** "Talk to sales" → the "10 minutes" acknowledgement.

---

### Slide 44 — Human-in-the-Loop: Two-Way Console
Rep opens the pending enquiry, reads the full conversation, and **replies to the customer**. The reply appears **live in the customer's chat** as a "human" bubble; enquiry → `in_progress`, then **Resolve** (attributed). Same swappable sender as the bot.
**[SCREENSHOT]** Chat + dashboard side by side: reply from dashboard appears in chat.

---

### Slide 45 — Rep Dashboard (Overview)
- Enquiries list with status (`pending` / `in_progress` / `resolved`) & pagination
- Detail: From / Time / Lang + full conversation + escalation reason
- Reply to customer · Mark Resolved (who & when recorded)
**[SCREENSHOT]** Dashboard list + detail panel.

---

### Slide 46 — Controls, Data & Tools
- **Data:** catalogue, packages, delivery, warranty, FAQ, enquiry log — owners & access defined
- **Tools:** OpenClaw (reasoning), deterministic core, vision adapter, language detection, WhatsApp channel, payment gateway
- Each has an operating constraint and a safe fallback

---

### Slide 47 — Risks, Guardrails & Human Approval
- AI never sets price/stock; low confidence escalates; prices from approved data
- **Payment:** simulated (no charge); nothing paid without callback; amounts from stored quote
- **Warranty/PII:** synthetic; returned only to a matching lookup
- Reliability: per-enquiry error escalates, never crashes
- Approvals: content sign-off · live-WhatsApp & live-payment go-live · assign-to-human · milestone

---

### Slide 48 — Success Measures
| Metric | Target |
|---|---|
| Repetitive enquiries auto-answered | 50–70% |
| First-response time | < 5 seconds |
| After-hours enquiries captured | 100% acknowledged |
| Enquiry-to-order conversion | measurable in-chat orders |
| Price/stock accuracy | 100% correct or escalate |
| Test-suite health | 100% passing (348 / 19) |

---

### Slide 49 — Results & Live Status
- Deployed live on AWS: http://52.77.234.193:3000
- 979-item catalogue (829 + 150) · 60 deliveries · 50 warranty records
- **348 automated tests passing across 19 suites**
- Verified live end-to-end: menu · quotation · payment → order → delivery · booking · warranty · delivery status · two-way rep reply · dashboard
**[SCREENSHOT]** Health check `{"status":"ok"}` + running chat & dashboard.

---

### Slide 50 — Roadmap & Thank You
**Next:** live WhatsApp Business API · live payment gateway · CRM + analytics · reliable vision key · managed DB + dashboard auth · broader languages.
**Summary:** the whole journey — enquiry → sales → payment → delivery → warranty → booking — in one 24/7 channel; humans elevated to judgement work.
**Thank you — Questions?**
Contacts: Alvin (Owner) · Noel (Content) · Puay Sim (Sales) · Peter (DevOps)

---

## Screenshot Capture Checklist
Capture from the live system and drop onto the marked slides:
1. Welcome + menu (Slides 1, 9) — chat.html
2. Option 2 packages (Slide 28) — type `2`
3. Keyboard shortlist + stock (Slide 29) — `how much is a keyboard`
4. NL CPU query (Slide 30) — `Intel processor generation 14`
5. Quotation (Slide 31) — pick a package
6. Payment journey (Slide 34) — `confirm` → `1` → /pay → paid
7. Onsite booking (Slide 36) — `4` → `1` → `1` → `3` → details
8. Carry-in booking (Slide 37) — `3` → `2` → `1` → `1` → problem
9. Warranty (Slide 38) — `8` → `SG26-ASU-0003-22173`
10. Delivery status (Slide 39) — `7` → `DO202600003`
11. Image composer (Slide 40)
12. Chinese reply (Slide 41) — Language → 中文
13. Language picker + nav (Slide 42) — `language`
14. Escalation ack (Slide 43) — `I want to speak to a person`
15. Two-way console (Slide 44) — chat + dashboard side by side
16. Dashboard (Slide 45) — dashboard.html
17. Data slice (Slide 19) — products.json / warranty.csv
18. Specs/steering (Slides 8e, 17) — .kiro folders
19. Health check (Slides 8d, 49) — /health
20. AI Assistant front line (Slide 8b) — welcome + a completed enquiry
21. Human-in-the-loop (Slide 8c) — chat + dashboard side by side
