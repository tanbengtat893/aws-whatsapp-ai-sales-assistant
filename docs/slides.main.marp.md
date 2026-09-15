---
marp: true
title: AI-Powered WhatsApp Sales & Service Assistant
author: BIS Computer Services
paginate: true
size: 16:9
theme: default
style: |
  section {
    font-size: 27px;
    background: #f6f8f7;
    color: #17332e;
  }
  h1 { color: #075e54; }
  h2 { color: #0a6d61; }
  section.lead { text-align: center; }
  section.lead h1 { font-size: 46px; }
  table { font-size: 23px; }
  strong { color: #075e54; }
  section.tier { background: #075e54; color: #fff; }
  section.tier h1, section.tier h2, section.tier h3 { color: #fff; }
  .small { font-size: 20px; color: #55606b; }
---

<!-- _class: lead -->
# AI-Powered WhatsApp Conversational Commerce Platform
### BIS Computer Services — Enquiry → Sales → Payment → Delivery → Booking

Presented by: **[Your name]**  ·  [Date]
Team: Alvin (Owner) · Noel (Content) · Puay Sim (Sales) · Peter (DevOps)

---

## Agenda

1. The problem & business impact
2. Objectives & success criteria
3. Solution overview (hybrid AI)
4. Requirements & design
5. Scope & 21-day plan (3 milestones)
6. Build walkthrough with live demos
7. Controls, risks & human approval
8. Results, roadmap & Q&A

---

## The Problem

### Managing WhatsApp Sales Enquiries

Sales reps receive a **high volume** of WhatsApp enquiries daily — product availability, pricing, delivery charges, operating hours, and other repetitive questions.

Answering them one by one **consumes much of the workday**, delaying responses to high-value customers and reducing time for actual selling.

---

## Why It Matters

- Reps spend **hours/day** on repetitive replies
- Slow responses at peak hours → **lost buyers**
- No after-hours coverage → enquiries **missed until next day**
- "Where is my order?" calls **congest the hotline**
- Knowledge locked in individuals → **inconsistent answers**

**Root cause:** no automated first layer to absorb routine enquiries.

---

## Main Objective

Take the **repetitive workload off the sales team** by answering routine enquiries **instantly, 24/7**, in the customer's language — while routing genuine sales opportunities and anything uncertain to a human.

> **Guiding principle:** *Solve the human workload first; let technology support it.*

---

## Objectives Broken Down

- **O1** Auto-answer top FAQs (hours, delivery, payment, warranty)
- **O2** Product price + **live stock** from approved data
- **O3** Budget-aware PC packages + itemised quotation
- **O4** **End-to-end commerce:** quotation → payment → order/invoice → delivery
- **O5** **Online repair booking** (onsite + carry-in) + **warranty check** (serial lookup → service)
- **O6** Delivery-status self-service · Multilingual (EN / MS / ZH, numbered picker) · easy 0/back navigation
- **O7** Safe human escalation + rep dashboard · deploy with measurable results

---

## Solution Overview — Hybrid AI

A **hybrid** design on the WhatsApp line:

- **Deterministic core** — fast, correct answers from approved data (FAQ, catalogue, delivery)
- **AI reasoning layer (OpenClaw)** — interprets natural language & images
- **Human escalation** — people stay in control

---

## The Enquiry Pipeline (Technical Workflow)

`Message → Sanitise → Record → Detect language → Menu/Greeting? → Booking / Payment step? → Delivery lookup? → FAQ match → Product/Quotation → else Escalate → Reply + Log`

<span class="small">Every stage is deterministic and testable. AI augments, never overrides. Any uncertainty escalates.</span>

---

## Architecture at a Glance

| Layer | Technology |
|---|---|
| Channel | WhatsApp webhook (Node.js / Express) |
| Deterministic core | FAQ, product/quotation, delivery lookup |
| AI layer | OpenClaw (Claude-class model) |
| Data store | JSON store (swappable to managed DB) |
| Hosting | AWS Lightsail (Ubuntu, PM2) |

**Swappable edges:** channel, AI, database each upgradable without rewriting logic.

---

## Requirements — Functional

- **R1** Receive & record every enquiry · detect language (EN / MS / ZH)
- **R2** Match FAQ & answer routine questions
- **R3** Product search + live stock, budget reasoning, quotation
- **R4** **Payment → order → invoice → delivery** (simulated gateway)
- **R5** **Online booking** (onsite & carry-in) + **warranty check** (serial/invoice → service)
- **R6** Delivery-status lookup (order no / name / phone) · image ID
- **R7** Escalate low-confidence / human requests
- **R8** Rep dashboard: review, **reply to customer (live two-way)**, resolve

---

## Requirements — Non-Functional

- **Accuracy:** price/stock always correct — or escalate
- **Availability:** 24/7, after-hours capture
- **Reliability:** one failed enquiry never crashes the pipeline
- **Speed:** first response < 5 seconds
- **Privacy:** PII used only for that customer's enquiry
- **Maintainability:** swappable parts + full test suite

---

## Design Principles

- **People before technology** — uncertainty & human requests go to a rep
- **No wrong info** — answer only from approved data
- **Deterministic first, AI second** — predictable core, AI for language
- **Incremental delivery** — each week ships a usable increment
- **Vendor-neutral, swappable** — future-proof integrations

---

## Data Design

- **Catalogue:** 979 items (829 components + 150 PC packages) with price + stock
- **PC packages:** full specs (CPU, motherboard, RAM, SSD, GPU, PSU, cooling, case, OS)
- **Delivery records:** order no, customer, status, ETA, driver
- **Warranty DB:** 50 records (serial, invoice, purchase/expiry, coverage) for warranty lookup
- **Orders / invoices / payments / bookings:** created live as customers buy or book
- Every item: **qty 100, in-stock**; unclear rows **excluded**

---

<!-- _class: tier -->
## Scope & Approach

### 3 Milestones × 7 days = **21 days**

- **Week 1:** Foundation + instant FAQ automation
- **Week 2:** Product, pricing, quotation & delivery intelligence
- **Week 3:** AI reasoning, image ID, dashboard & production

<span class="small">Each milestone ends with a live demo and sign-off.</span>

---

## Milestone 1 — Scope (Days 1–7)

**Foundation & Instant FAQ Automation**

- Enquiry pipeline on an always-on host
- Language detection (EN / MS / ZH)
- Branded welcome + numbered quick menu
- FAQ knowledge base (routine questions)
- Rule-based escalation + enquiry log

<span class="small">Assumption: WhatsApp channel available (simulated now); FAQ answers approved.</span>

---

## Milestone 1 — Subtasks

1. Pipeline skeleton (receive → record → reply)
2. Language detection service
3. Welcome + menu + "type naturally"
4. FAQ matcher + knowledge base
5. Escalation logic + handover
6. Tests + deploy to AWS
7. Demo & sign-off

---

## Milestone 2 — Scope (Days 8–14)

**Product, Pricing, Quotation & Delivery Intelligence**

- Import & structure catalogue (price + stock)
- Product search + budget-aware reasoning
- PC packages by tier + **itemised quotation**
- Delivery-status self-service (order no / name / phone)

<span class="small">Assumption: data provided & approved; unclear rows excluded, not guessed.</span>

---

## Milestone 2 — Subtasks

1. Catalogue ingestion & category mapping
2. Product search + price/stock answers
3. Budget filtering + honest closest-match
4. PC package tiers (collapsed price ranges)
5. Quotation with "What's included" breakdown
6. Delivery lookup service + menu option
7. Tests + deploy + demo

---

## Milestone 3 — Scope (Days 15–21)

**AI Reasoning, Image ID, Dashboard & Production**

- OpenClaw AI for natural-language enquiries
- Image identification of items
- Rep dashboard (conversation view + two-way reply to customer)
- Reporting; WhatsApp Business API cut-over; hardening

<span class="small">Assumption: AI capability available; official channel onboarding can run in parallel.</span>

---

## Milestone 3 — Subtasks

1. Integrate OpenClaw intent extraction + image ID
2. Dashboard: enquiries, conversation, **two-way reply to customer**, resolve
3. **Conversational commerce:** payment → order → invoice → delivery
4. **Online booking:** onsite & carry-in appointments
5. Reporting (auto-answer %, escalation %) · monitoring · backups
6. Final demo, docs, training/handover

---

## Feature — Quick Menu + Natural Language

Customers reply with a **number** or **type freely**.

Menu option **2** immediately shows real PC packages by budget tier — no "a rep will follow up."

Entry (from SGD 500) · Mid-range · High-end — each build shown once with a "from" price.

---

## Feature — Budget-Aware Quotation

"I prefer this package, 1 set" → an **itemised quotation**:

CPU · Motherboard · RAM · SSD · GPU · PSU · Cooling · Case · OS

Disambiguated by price · includes a quote reference · subtotal + next steps.

---

## Feature — Delivery-Status Self-Service

Enter **order number, name, or handphone** →

- Current status
- Driver **ETA** + arranged delivery window
- Driver name & direct contact

**Removes peak-hour hotline calls.**

---

## Feature — Conversational Commerce (Payment)

The chat carries the **whole journey**, not just enquiries:

`Quotation → confirm → 💳 Card / 🏦 PayNow → secure pay link → ✅ paid`

- Creates matching **Q- / ORD- / INV- / DO-** references (one daily number)
- Confirmation shows order, invoice, amount, "Preparing Order"
- Delivery order is instantly **trackable via option 7**

<span class="small">Payment is a **simulated gateway** for the demo (no real charge); swappable to Stripe/HitPay/PayNow with no core change.</span>

---

## Feature — Online Booking (Onsite & Carry-in)

Book a repair appointment **entirely in chat** — numbered steps, all 3 languages.

- **Onsite (option 4):** service type → date → time slot → details → **`OS-...` CONFIRMED** (SGD 60/visit)
- **Carry-in (option 3):** date → slot → device → problem → **`CI-...` Awaiting Drop-Off** (SGD 30, 1–2 days)

<span class="small">Booking created only when every step is complete; confirmation promises technician follow-up (never over-promises).</span>

---

## Feature — Warranty Check (option 8)

Customer sends a **serial or invoice number** (or name/phone) → the assistant returns the warranty record:

- Customer · product · **serial · status · valid-until · coverage** (e.g. "1 Year Onsite Warranty")
- Then offers: **1** book onsite · **2** carry-in repair · **3** talk to service — feeding the booking flows
- Serial matching is **format-tolerant** (`SG26-TP--0015` ≡ `sg26-tp-0015`); unknown serial → honest "not found"

<span class="small">50-record warranty database (synthetic demo data). PII returned only to a matching lookup — never listed.</span>

---

## Feature — Image ID & Multilingual

- Upload a photo (JPG/PNG) → **numbered shortlist** of matching items with prices
- Auto-detects **English, Malay, Chinese**
- Low confidence → confirm with customer or escalate

---

## Feature — Language Picker & Easy Navigation

- **Numbered language picker** — reply **1 English · 2 中文 · 3 Bahasa Melayu** (or type the name); explicit choice is sticky
- **Universal navigation** (works at any step, all 3 languages):
  - **`0` / `menu` / `home`** → back to the main menu (escape hatch)
  - **`back`** → previous step in a booking / payment / quotation flow
- Localized footer hint on every multi-step prompt + one-tap **🏠 Menu / ◀ Back** buttons on the chat page

<span class="small">Text commands work in real WhatsApp too — not just the demo page.</span>

---

## Rep Dashboard — Human in the Loop (Two-Way Console)

- Enquiries list with status (`pending` · `in_progress` · `resolved`) & pagination
- Detail: **From / Time / Lang** + full conversation + escalation reason
- **Reply to customer** → the rep's message appears **live in the customer's chat** (as a "human" bubble); enquiry → `in_progress`, then **Resolve** (attributed)
- Same swappable sender as the bot → works now (simulated) and maps to real WhatsApp send

<span class="small">Loop: bot → escalate → human takes over → reply → resolve. Customer never left waiting; every action attributed.</span>

---

## Controls — Data & Tools

- **Data:** catalogue, packages, delivery, FAQ, enquiry log — owners & access defined
- **AI/Tools:** OpenClaw (reasoning), deterministic core, vision adapter, language detection, WhatsApp channel
- Each has an **operating constraint** and a **safe fallback**

---

## Risks, Guardrails & Human Approval

- AI **never** sets price/stock; deterministic fallback; low confidence escalates
- Prices from **approved data**; unclear rows excluded
- PII returned **only** to the matching customer
- Quotations are **indicative**; payment stays a human step
- Approvals: content sign-off · escalation · assign-to-human · order confirmation · milestone & cut-over

---

## Success Measures

| Metric | Target |
|---|---|
| Repetitive enquiries auto-answered | **≥ 70%** |
| First-response time | **< 5 seconds** |
| After-hours enquiries captured | **100%** |
| Delivery-status hotline calls | **Measurable reduction** |
| Price/stock accuracy | **100% correct or escalate** |
| Rep time reclaimed | **Significant weekly hours** |

---

## Results & Live Status

- **Deployed live** on AWS: `http://52.77.234.193:3000`
- **979-item** catalogue (829 components + **150** PC packages) · **60** delivery records
- **348 automated tests** passing across **19 suites**
- Verified live end-to-end: menu · quotation · **payment → order → delivery** · **onsite & carry-in booking** · **warranty check** · **two-way rep reply** · dashboard

---

<!-- _class: lead -->
## Roadmap & Thank You

**Next:** real payment gateway (Stripe/HitPay/PayNow) · real WhatsApp Business API · real vision key · CRM integration · analytics

**Summary:** the whole journey — enquiry → sales → payment → delivery → **service booking** — in one 24/7 channel; humans focused on selling

### Thank you — Questions?
<span class="small">Alvin (Owner) · Noel (Content) · Puay Sim (Sales) · Peter (DevOps)</span>
