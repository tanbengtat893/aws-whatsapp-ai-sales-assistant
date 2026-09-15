# AI-Powered WhatsApp Conversational Commerce Platform
## Presentation Deck — BIS Computer Services

> Screenshot guidance is marked **[SCREENSHOT]** on each slide. Capture from the live system at http://52.77.234.193:3000 (chat.html and dashboard.html) unless noted otherwise.

---

### Slide 1 — Title
**AI-Powered WhatsApp Conversational Commerce Platform**
BIS Computer Services — Enquiry → Sales → Payment → Delivery → Booking
Presented by: [Your name] · Date: [Date]
Team: Alvin (Project Owner) · Noel (Content Admin) · Puay Sim (Lead Rep) · Peter (DevOps)
**[SCREENSHOT]** Chat welcome screen (chat.html) as the hero image.

---

### Slide 2 — Agenda
1. The problem & business impact
2. Objectives & success criteria
3. Solution overview (hybrid AI)
4. Requirements & design
5. Scope & 21-day plan (3 milestones)
6. Build walkthrough with demos
7. Controls, risks & human approval
8. Results, roadmap & Q&A

---

### Slide 3 — The Problem Statement
**Managing WhatsApp Sales Enquiries**
Sales reps receive a high volume of WhatsApp enquiries daily — product availability, pricing, delivery charges, operating hours, and other repetitive questions. Answering them individually consumes much of the workday, delaying responses to high-value customers and reducing time for actual selling.

---

### Slide 4 — Why It Matters (Business Impact)
- Reps spend hours/day on repetitive replies
- Slow responses during peak hours → lost buyers
- No after-hours coverage → enquiries missed until next day
- "Where is my order?" calls congest the hotline
- Knowledge locked in individuals → inconsistent answers
**Root cause:** no automated first layer to absorb routine enquiries.

---

### Slide 5 — Main Objective
Build an assistant that **takes the repetitive workload off the sales team** by answering routine enquiries instantly, 24/7, in the customer's language — while routing genuine sales opportunities and anything uncertain to a human.
**Guiding principle:** *Solve the human workload first; let technology support it.*

---

### Slide 6 — Objectives Broken Down
- **O1:** Auto-answer top repetitive questions (hours, delivery, payment, warranty)
- **O2:** Answer product price + **live stock** from approved data
- **O3:** Budget-aware PC package selection + itemised quotation
- **O4:** **End-to-end commerce** — quotation → payment → order/invoice → delivery
- **O5:** **Online repair booking** (onsite + carry-in) + **warranty check** (serial → service)
- **O6:** Delivery-status self-service · Multilingual (EN/MS/ZH, numbered picker) · easy 0/back navigation
- **O7:** Safe human escalation + rep dashboard · deploy with measurable results

---

### Slide 7 — Solution Overview (Hybrid AI)
A hybrid design on the WhatsApp line:
- **Deterministic core** — fast, correct answers from approved data (FAQ, catalogue, delivery)
- **AI reasoning layer (OpenClaw)** — interprets natural language & images
- **Human escalation** — people stay in control
**[SCREENSHOT]** Chat showing welcome + quick menu.

---

### Slide 8 — The Enquiry Pipeline (Technical Workflow)
Message → Sanitise → Record → Detect language → Menu/Greeting? → Booking / Payment step? → Delivery lookup? → FAQ match → Product/Quotation → else Escalate → Reply + Log
> Each stage is deterministic and testable; AI augments, never overrides. Any uncertainty escalates.
**[SCREENSHOT]** A simple pipeline diagram (draw in slides) or the chat flow.

---

### Slide 9 — Architecture at a Glance
| Layer | Technology |
|---|---|
| Channel | WhatsApp webhook (Node.js / Express) |
| Deterministic core | FAQ, product/quotation, delivery lookup |
| AI layer | OpenClaw (Claude-class model) |
| Data store | JSON store (swappable to managed DB) |
| Hosting | AWS Lightsail (Ubuntu, PM2) |
**Swappable edges:** channel, AI provider, database can each be upgraded without rewriting logic.

---

### Slide 10 — Requirements (Functional)
- R1 Receive & record every enquiry · detect language (EN/MS/ZH)
- R2 Match FAQ & answer routine questions
- R3 Product search + live stock, budget reasoning, quotation
- R4 **Payment → order → invoice → delivery** (simulated gateway)
- R5 **Online booking** (onsite & carry-in) + **warranty check** (serial/invoice → service)
- R6 Delivery-status lookup (order no / name / phone) · image ID
- R7 Escalate low-confidence / human requests
- R8 Rep dashboard: review, **reply to customer (live two-way)**, resolve

---

### Slide 11 — Requirements (Non-Functional)
- **Accuracy:** price/stock always correct or escalate
- **Availability:** 24/7, after-hours capture
- **Reliability:** one failed enquiry never crashes the pipeline
- **Speed:** first response < 5 seconds
- **Privacy:** customer PII used only for that customer's enquiry
- **Maintainability:** swappable components, full test suite

---

### Slide 12 — Design Principles
- **People before technology** — uncertainty & human requests go to a rep
- **No wrong info** — answer only from approved data; exclude unclear records
- **Deterministic first, AI second** — predictable core, AI for natural language
- **Incremental delivery** — each week ships a usable increment
- **Vendor-neutral, swappable** — future-proof integrations

---

### Slide 13 — Data Design
- **Catalogue:** 979 items (829 components + 150 PC packages), price + stock
- **PC packages:** full component specs (CPU, motherboard, RAM, SSD, GPU, PSU, cooling, case, OS)
- **Delivery records:** order no, customer, status, ETA, driver
- **Warranty database:** 50 records (serial, invoice, purchase/expiry, coverage) for warranty lookup
- **Orders / invoices / payments / bookings:** created live as customers buy or book
- **FAQ knowledge base:** hours, delivery, payment, warranty, location
- Every item: **quantity 100, in-stock**; unclear rows excluded
**[SCREENSHOT]** A slice of the catalogue CSV or products.json.

---

### Slide 14 — Scope & Approach (3 Milestones × 7 days = 21 days)
- **Week 1:** Foundation + instant FAQ automation
- **Week 2:** Product, pricing, quotation & delivery intelligence
- **Week 3:** AI reasoning, image ID, dashboard & production hardening
Each milestone ends with a live demo and sign-off.

---

### Slide 15 — Milestone 1: Scope (Days 1–7)
**Foundation & Instant FAQ Automation**
- Enquiry pipeline on always-on host
- Language detection (EN/MS/ZH)
- Branded welcome + numbered quick menu
- FAQ knowledge base (routine questions)
- Rule-based escalation + enquiry log
**Assumption:** WhatsApp channel available (simulated now); FAQ answers approved.

---

### Slide 16 — Milestone 1: Subtasks
1. Pipeline skeleton (receive→record→reply)
2. Language detection service
3. Welcome + menu + "type naturally" support
4. FAQ matcher + knowledge base
5. Escalation logic + handover
6. Tests + deploy to AWS
7. Demo & sign-off
**[SCREENSHOT]** Chat greeting + menu buttons.

---

### Slide 17 — Milestone 2: Scope (Days 8–14)
**Product, Pricing, Quotation & Delivery Intelligence**
- Import & structure catalogue (price + stock)
- Product search + budget-aware reasoning
- PC packages by tier + itemised quotation
- Delivery-status self-service (order no / name / phone)
**Assumption:** data provided & approved; unclear rows excluded, not guessed.

---

### Slide 18 — Milestone 2: Subtasks
1. Catalogue ingestion & category mapping
2. Product search + price/stock answers
3. Budget filtering + closest-match honesty
4. PC package tiers (collapsed price ranges)
5. Quotation with "What's included" breakdown
6. Delivery lookup service + menu option
7. Tests + deploy + demo
**[SCREENSHOT]** Quotation reply with "What's included" list.

---

### Slide 19 — Milestone 3: Scope (Days 15–21)
**AI Reasoning, Image ID, Dashboard & Production**
- OpenClaw AI for natural-language enquiries
- Image identification of items
- Rep dashboard (conversation view + two-way reply to customer)
- Reporting; WhatsApp Business API cut-over; hardening
**Assumption:** AI capability available; official channel onboarding can run in parallel.

---

### Slide 20 — Milestone 3: Subtasks
1. Integrate OpenClaw intent extraction + image ID
2. Dashboard: enquiries, conversation, **two-way reply to customer**, resolve
3. **Conversational commerce:** payment → order → invoice → delivery
4. **Online booking:** onsite & carry-in appointments
5. Reporting (auto-answer %, escalation %) · monitoring · backups
6. Final demo, docs, training/handover
**[SCREENSHOT]** Rep dashboard (dashboard.html).

---

### Slide 21 — Feature: Quick Menu + Natural Language
Customers reply with a number **or** type freely. Menu option 2 immediately shows real PC packages by budget tier — no "a rep will follow up."
**[SCREENSHOT]** Option 2 reply — DIY PC packages by tier (from SGD 500 / mid / high-end).

---

### Slide 22 — Feature: Budget-Aware Quotation
"I prefer this package, 1 set" → an itemised quotation (CPU, motherboard, RAM, SSD, GPU, PSU, cooling, case, OS), disambiguated by price.
**[SCREENSHOT]** Quotation with reference number + "What's included" breakdown.

---

### Slide 23 — Feature: Delivery-Status Self-Service
Customer enters order number, name, or handphone → status, driver ETA, arranged window, and driver contact. Removes peak-hour hotline calls.
**[SCREENSHOT]** Delivery lookup reply (e.g. DO202600003 → Out for Delivery + Jason Lim + ETA).

---

### Slide 24 — Feature: Conversational Commerce (Payment → Order → Delivery)
The chat carries the **whole journey**, not just enquiries:
Quotation → confirm → **💳 Card / 🏦 PayNow** → secure pay link → **✅ paid**
- Creates matching **Q- / ORD- / INV- / DO-** references (one daily number)
- Confirmation shows order, invoice, amount, "Preparing Order"; delivery is instantly **trackable via option 7**
- Payment is a **simulated gateway** for the demo (no real charge) — swappable to Stripe/HitPay/PayNow with no core change
**[SCREENSHOT]** Payment offer in chat → the /pay page → the "✅ Payment received" confirmation with ORD/INV/DO refs.

---

### Slide 25 — Feature: Online Booking (Onsite & Carry-in)
Book a repair appointment **entirely in chat** — numbered steps, all 3 languages.
- **Onsite (option 4):** service type → date → time slot → details → **`OS-...` CONFIRMED** (SGD 60/visit)
- **Carry-in (option 3):** date → slot → device → problem → **`CI-...` Awaiting Drop-Off** (SGD 30, 1–2 working days)
- Booking created only when every step is complete; confirmation promises technician follow-up
**[SCREENSHOT]** Onsite service-type picker → the "✅ Appointment confirmed" `OS-...` card.

---

### Slide 26 — Feature: Warranty Check (option 8)
Customer sends a **serial or invoice number** (or name/phone) → the assistant returns the warranty record: customer, product, **serial, status, valid-until, coverage** (e.g. "1 Year Onsite Warranty"). It then offers **1** book onsite · **2** carry-in repair · **3** talk to service — feeding straight into the booking flows.
- Serial matching is **format-tolerant** (`SG26-TP--0015` ≡ `sg26-tp-0015`); unknown serial → honest "not found"
- Backed by a **50-record warranty database** (synthetic demo data); PII returned only to a matching lookup
**[SCREENSHOT]** Warranty reply for `SG26-ASU-0003-22173` (Mohamed Faizal / ASUS RTX 4060) with the 1/2/3 options.

---

### Slide 27 — Feature: Language Picker & Easy Navigation
- **Numbered language picker** — reply **1 English · 2 中文 · 3 Bahasa Melayu** (or type the name); explicit choice is sticky
- **Universal navigation**, any step, all 3 languages: **`0`/`menu`/`home`** → main menu; **`back`** → previous step
- Localized footer hint on multi-step prompts + one-tap **🏠 Menu / ◀ Back** buttons on the chat page
**[SCREENSHOT]** The numbered language picker, and a booking step showing the "Reply 0 for menu / back" hint.

---

### Slide 28 — Feature: Image Identification & Multilingual
- Upload a photo (JPG/PNG) → numbered shortlist of matching items with prices
- Auto-detects English, Malay, Chinese
**[SCREENSHOT]** Chat with an uploaded image + identified shortlist (or the composer with camera/attach icons).

---

### Slide 29 — Rep Dashboard: Human in the Loop (Two-Way Console)
- Enquiries list with status (`pending` / `in_progress` / `resolved`) & pagination
- Detail: From / Time / Lang + full conversation + escalation reason
- **Reply to customer** → the rep's message appears **live in the customer's chat** as a "human" bubble; enquiry moves to `in_progress`, then **Resolve** (attributed to the rep)
- Uses the same swappable sender as the bot — works now in simulated mode, maps to a real WhatsApp send later
- Loop: bot → escalate → human takes over → reply → resolve; customer never left waiting, every action attributed
**[SCREENSHOT]** Chat + dashboard side by side: type "talk to sales" in chat → reply from the dashboard → the reply appears in the customer's chat.

---

### Slide 30 — Controls, Data & Tools
- **Data:** catalogue, packages, delivery, FAQ, enquiry log — owners & access defined
- **AI/tools:** OpenClaw (reasoning), deterministic core, vision adapter, language detection, WhatsApp channel
- Each has an operating constraint and a safe fallback.

---

### Slide 31 — Risks, Guardrails & Human Approval
- AI never sets price/stock; deterministic fallback; low confidence escalates
- Prices from approved data; unclear rows excluded
- PII returned only to the matching customer
- **Payment:** simulated gateway (no real charge); nothing marked paid without the gateway callback; order/invoice/delivery created only after payment; amounts always from the stored quote
- **Booking:** created only when every step is complete; promises human follow-up
- **Warranty:** reads actual stored fields (status/expiry/coverage), never guesses; PII returned only to a matching lookup; synthetic demo data
- Approval points: content sign-off, escalation, assign-to-human, live-payment go-live, milestone & cut-over approval

---

### Slide 32 — Success Measures
| Metric | Target |
|---|---|
| Repetitive enquiries auto-answered | ≥ 70% |
| First-response time | < 5 seconds |
| After-hours enquiries captured | 100% |
| Delivery-status hotline calls | Measurable reduction |
| Price/stock accuracy | 100% correct or escalate |
| Rep time reclaimed | Significant weekly hours |

---

### Slide 33 — Results & Live Status
- Deployed live on AWS: http://52.77.234.193:3000
- 979-item catalogue (829 components + 150 PC packages), 60 delivery records, 50 warranty records
- **348 automated tests passing across 19 suites**
- Verified live end-to-end: menu · quotation · **payment → order → delivery** · **onsite & carry-in booking** · **warranty check** · **two-way rep reply** · dashboard
**[SCREENSHOT]** Health check `{"status":"ok"}` and/or the running chat + dashboard side by side.

---

### Slide 34 — Roadmap & Thank You
**Next steps:** real payment gateway (Stripe/HitPay/PayNow) · real WhatsApp Business API · real vision key for image ID · CRM integration · analytics dashboard.
**Summary:** the whole journey — enquiry → sales → payment → delivery → **service booking** — in one 24/7 channel; humans focused on selling.
**Thank you — Questions?**
Contacts: Alvin (Owner) · Noel (Content) · Puay Sim (Sales) · Peter (DevOps)

---

## Screenshot Capture Checklist
Capture these from the live system (or your local run) and drop them onto the marked slides:
1. **Chat welcome + menu** (Slides 1, 7, 16) — open http://52.77.234.193:3000/chat.html
2. **Option 2 packages by tier** (Slide 21) — type `2` in chat
3. **Quotation with breakdown** (Slides 18, 22) — pick a package, e.g. "i prefer this PC Package - Intel Core Ultra 5 225F + RTX 5060 8GB: SGD 1040, 1 set"
4. **Delivery lookup** (Slide 23) — type `DO202600003`
5. **Payment journey** (Slide 24) — confirm a quotation → reply `1` (Card) → open the `/pay/...` link → capture the "✅ Payment received" confirmation with ORD/INV/DO refs
6. **Onsite booking** (Slide 25) — type `4` → `1` → `1` → `3` → details → capture the "✅ Appointment confirmed" `OS-...` card (and/or the carry-in `CI-...` card via `3`)
7. **Warranty check** (Slide 26) — type `8` → `SG26-ASU-0003-22173` → capture the warranty reply with the 1/2/3 options
8. **Language picker & navigation** (Slide 27) — type `language` (numbered picker), and a booking step showing the "Reply 0 / back" hint
9. **Image upload / composer** (Slide 28) — show the attach/camera composer
10. **Dashboard** (Slides 20, 29) — open http://52.77.234.193:3000/dashboard.html and click an enquiry
11. **Catalogue data** (Slide 13) — a slice of products.json or the CSV
12. **Health check** (Slide 33) — http://52.77.234.193:3000/health
