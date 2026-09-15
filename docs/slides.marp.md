---
marp: true
title: AI-Powered WhatsApp Sales & Service Assistant
author: BIS Computer Services
paginate: true
size: 16:9
theme: default
style: |
  section {
    font-size: 26px;
    background: #f6f8f7;
    color: #17332e;
  }
  h1 { color: #075e54; }
  h2 { color: #0a6d61; }
  section.lead { text-align: center; }
  section.lead h1 { font-size: 46px; }
  table { font-size: 22px; }
  strong { color: #075e54; }
  section.tier { background: #075e54; color: #fff; }
  section.tier h1, section.tier h2 { color: #fff; }
  footer { color: #6b7c78; }
  .small { font-size: 20px; color: #55606b; }
  .tag { background:#e3f6e8; color:#1b7a3d; padding:2px 10px; border-radius:12px; font-size:18px; }
---

<!-- _class: lead -->
# AI-Powered WhatsApp Sales & Service Assistant
### BIS Computer Services — Hybrid Sales & Service Automation

Presented by: **[Your name]**  ·  [Date]
Team: Alvin (Owner) · Noel (Content) · Puay Sim (Sales) · Peter (DevOps)

`[SCREENSHOT: chat welcome screen as hero]`

<!--
SPEAKER NOTES (30-45s):
Good [morning]. I'm presenting an AI-powered assistant we built to solve a real, everyday pain: the flood of repetitive WhatsApp enquiries our sales reps handle. Over the next 30 slides I'll cover the problem, our objectives, the design, the 21-day delivery plan, live demos, our safety controls, and the results. It's already deployed and running, so most of what you'll see is real, not mock-ups.
-->

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

<!--
SPEAKER NOTES: Here's our flow. I'll start with why this matters to the business, then how we approached it, then show it working, and finish with how we keep it safe and what we measured. Please hold questions to the end, but flag anything urgent.
-->

---

## The Problem

### Managing WhatsApp Sales Enquiries

Sales reps receive a **high volume** of WhatsApp enquiries daily — product availability, pricing, delivery charges, operating hours, and other repetitive questions.

Answering them one by one **consumes much of the workday**, delaying responses to high-value customers and reducing time for actual selling.

<!--
SPEAKER NOTES: This is the assigned problem statement. The key phrase is "repetitive." Reps aren't slow, they're drowning in the same questions over and over: what time do you open, how much is delivery, is this in stock. Every minute on those is a minute not spent closing a sale or helping a serious buyer.
-->

---

## Why It Matters

- Reps spend **hours/day** on repetitive replies
- Slow responses at peak hours → **lost buyers**
- No after-hours coverage → enquiries **missed until next day**
- "Where is my order?" calls **congest the hotline**
- Knowledge locked in individuals → **inconsistent answers**

**Root cause:** no automated first layer to absorb routine enquiries.

<!--
SPEAKER NOTES: Five concrete consequences. The one customers feel most is the hotline during peak hours, no one answers. And notice the root cause: there's no first layer catching the easy questions, so everything hits the human queue at the same priority. That's exactly what we set out to fix.
-->

---

## Main Objective

Take the **repetitive workload off the sales team** by answering routine enquiries **instantly, 24/7**, in the customer's language — while routing genuine sales opportunities and anything uncertain to a human.

> **Guiding principle:** *Solve the human workload first; let technology support it.*

<!--
SPEAKER NOTES: One sentence. We're not replacing reps, we're removing the repetitive load so they can do what only people can do. The guiding principle matters: technology serves the people, not the other way round. Uncertainty always goes to a human.
-->

---

## Objectives Broken Down

- **O1** Auto-answer top FAQs (hours, delivery, payment, warranty)
- **O2** Product price/stock from live data
- **O3** Budget-aware PC packages + itemised quotation
- **O4** Delivery-status self-service (no hotline call)
- **O5** Multilingual (EN / MS / ZH)
- **O6** Safe human escalation + rep dashboard
- **O7** Deploy to production with measurable results

<!--
SPEAKER NOTES: Seven measurable objectives. Notice they map to the exact enquiry types in the problem statement, availability, pricing, delivery, hours, plus the things that reduce hotline load. O7 keeps us honest: it has to be live and measurable, not a prototype.
-->

---

## Solution Overview — Hybrid AI

A **hybrid** design on the WhatsApp line:

- **Deterministic core** — fast, correct answers from approved data (FAQ, catalogue, delivery)
- **AI reasoning layer (OpenClaw)** — interprets natural language & images
- **Human escalation** — people stay in control

`[SCREENSHOT: chat welcome + quick menu]`

<!--
SPEAKER NOTES: The word hybrid is deliberate. A deterministic core gives correct, predictable answers for known questions, it never guesses a price. On top sits OpenClaw, our AI layer, which understands messy, natural wording and images. And a human path is always there. This combination is the key design decision.
-->

---

## The Enquiry Pipeline (Technical Workflow)

`Message → Sanitise → Record → Detect language → Menu/Greeting? → Delivery lookup? → FAQ match → Product/Package/Quotation → else Escalate → Reply + Log`

<span class="small">Every stage is deterministic and testable. AI augments, never overrides. Any uncertainty escalates.</span>

`[SCREENSHOT: pipeline diagram or chat flow]`

<!--
SPEAKER NOTES: Every message flows through this pipeline. We record it first for the audit trail, detect language, then try the cheapest, most certain answer first, menu, delivery, FAQ, product. Only if nothing is confident do we escalate. This ordering is why it's fast AND safe.
-->

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

<!--
SPEAKER NOTES: Deliberately simple and swappable. The channel, the AI provider, and the database each sit behind a stable interface, so we can move from a JSON store to a managed database, or swap the AI, without touching the business logic. That's how a pilot scales to production.
-->

---

## Requirements — Functional

- **R1** Receive & record every enquiry
- **R2** Detect language (EN / MS / ZH)
- **R3** Match FAQ & answer routine questions
- **R4** Product search, budget reasoning, quotation
- **R5** Delivery-status lookup (order no / name / phone)
- **R6** Image identification of items
- **R7** Escalate low-confidence / human requests
- **R8** Rep dashboard: review, converse, assign to human

<!--
SPEAKER NOTES: These are the eight functional requirements we committed to. Each is demonstrable, and I'll show most of them live later. R7 and R8 are the safety net, escalation and the human dashboard.
-->

---

## Requirements — Non-Functional

- **Accuracy:** price/stock always correct — or escalate
- **Availability:** 24/7, after-hours capture
- **Reliability:** one failed enquiry never crashes the pipeline
- **Speed:** first response < 5 seconds
- **Privacy:** PII used only for that customer's enquiry
- **Maintainability:** swappable parts + full test suite

<!--
SPEAKER NOTES: Just as important as features. The headline is accuracy: we would rather escalate than give a wrong price. Reliability is built in, an error on one message is caught and turned into a safe escalation, never a crash. And 264 automated tests keep it maintainable.
-->

---

## Design Principles

- **People before technology** — uncertainty & human requests go to a rep
- **No wrong info** — answer only from approved data
- **Deterministic first, AI second** — predictable core, AI for language
- **Incremental delivery** — each week ships a usable increment
- **Vendor-neutral, swappable** — future-proof integrations

<!--
SPEAKER NOTES: Five principles that guided every decision. "No wrong info" drove a real choice: when source data was unclear, we excluded it rather than guess. Better to say "let me check" than to mislead a customer.
-->

---

## Data Design

- **Catalogue:** 587 items (437 components + 150 PC packages) with price + stock
- **PC packages:** full specs (CPU, motherboard, RAM, SSD, GPU, PSU, cooling, case, OS)
- **Delivery records:** order no, customer, status, ETA, driver
- **FAQ base:** hours, delivery, payment, warranty, location
- Every item: qty 100, in-stock; unclear rows **excluded**

`[SCREENSHOT: catalogue slice / products.json]`

<!--
SPEAKER NOTES: The data is the foundation of trust. 587 real items with prices and stock, and 150 PC packages that each carry a full component list, that's what powers the "what's included" quotation you'll see. Unclear rows were dropped so nothing wrong reaches a customer.
-->

---

<!-- _class: tier -->
## Scope & Approach

### 3 Milestones × 7 days = **21 days**

- **Week 1:** Foundation + instant FAQ automation
- **Week 2:** Product, pricing, quotation & delivery intelligence
- **Week 3:** AI reasoning, image ID, dashboard & production

<span class="small">Each milestone ends with a live demo and sign-off.</span>

<!--
SPEAKER NOTES: We staged the work so each week delivers something usable, not a big-bang at the end. Week 1 removes the biggest repetitive load. Week 2 adds product and delivery intelligence. Week 3 adds the AI polish and takes it to production.
-->

---

## Milestone 1 — Scope (Days 1–7)

**Foundation & Instant FAQ Automation**

- Enquiry pipeline on an always-on host
- Language detection (EN / MS / ZH)
- Branded welcome + numbered quick menu
- FAQ knowledge base (routine questions)
- Rule-based escalation + enquiry log

<span class="small">Assumption: WhatsApp channel available (simulated now); FAQ answers approved.</span>

<!--
SPEAKER NOTES: Week 1 is about absorbing the highest-volume questions immediately, hours, delivery, payment, warranty, and getting a safe escalation path in place. By the end of the week the assistant is answering routine questions 24/7.
-->

---

## Milestone 1 — Subtasks

1. Pipeline skeleton (receive → record → reply)
2. Language detection service
3. Welcome + menu + "type naturally"
4. FAQ matcher + knowledge base
5. Escalation logic + handover
6. Tests + deploy to AWS
7. Demo & sign-off

`[SCREENSHOT: chat greeting + menu buttons]`

<!--
SPEAKER NOTES: Seven concrete subtasks. Note we test and deploy within the week, not later. Every milestone ends deployed and demoable.
-->

---

## Milestone 2 — Scope (Days 8–14)

**Product, Pricing, Quotation & Delivery Intelligence**

- Import & structure catalogue (price + stock)
- Product search + budget-aware reasoning
- PC packages by tier + **itemised quotation**
- Delivery-status self-service (order no / name / phone)

<span class="small">Assumption: data provided & approved; unclear rows excluded, not guessed.</span>

<!--
SPEAKER NOTES: Week 2 tackles the second big source of repetitive work, product and delivery questions, answered from our own live data. This is where "how much is this" and "where's my order" become instant self-service.
-->

---

## Milestone 2 — Subtasks

1. Catalogue ingestion & category mapping
2. Product search + price/stock answers
3. Budget filtering + honest closest-match
4. PC package tiers (collapsed price ranges)
5. Quotation with "What's included" breakdown
6. Delivery lookup service + menu option
7. Tests + deploy + demo

`[SCREENSHOT: quotation with "What's included"]`

<!--
SPEAKER NOTES: The standout here is the quotation, when a customer picks a build, they get a full component breakdown and a subtotal, not a "we'll get back to you." And delivery self-service directly cuts hotline calls.
-->

---

## Milestone 3 — Scope (Days 15–21)

**AI Reasoning, Image ID, Dashboard & Production**

- OpenClaw AI for natural-language enquiries
- Image identification of items
- Rep dashboard (conversation view + assign to human)
- Reporting; WhatsApp Business API cut-over; hardening

<span class="small">Assumption: AI capability available; official channel onboarding can run in parallel.</span>

<!--
SPEAKER NOTES: Week 3 makes it smarter and production-ready. OpenClaw handles messy wording; image ID helps customers who don't know an item's name; the dashboard gives reps full control; and we harden for real traffic.
-->

---

## Milestone 3 — Subtasks

1. Integrate OpenClaw intent extraction
2. AI-assisted budget/category → search
3. Image upload → item shortlist
4. Dashboard: enquiries, conversation, assign to human
5. Reporting (auto-answer %, escalation %)
6. Load test, monitoring, backups
7. Final demo, docs, training/handover

`[SCREENSHOT: rep dashboard]`

<!--
SPEAKER NOTES: We close the project with documentation and a handover session so the team can own it. Monitoring and backups mean it's not just working, it's supportable.
-->

---

## Demo — Quick Menu + Natural Language

Customers reply with a **number** or **type freely**.

Menu option **2** immediately shows real PC packages by budget tier — no "a rep will follow up."

`[SCREENSHOT: option 2 — DIY PC packages by tier]`

<!--
SPEAKER NOTES: [Do this live if possible.] I'll type "2". Notice it instantly returns real packages grouped Entry / Mid / High-end with prices, collapsed so each build shows once with a "from" price. That immediacy is the whole point.
-->

---

## Demo — Budget-Aware Quotation

"I prefer this package, 1 set" → an **itemised quotation**: CPU, motherboard, RAM, SSD, GPU, PSU, cooling, case, OS — disambiguated by price.

`[SCREENSHOT: quotation with reference no + "What's included"]`

<!--
SPEAKER NOTES: [Live.] When the customer confirms a build with its price, the assistant pins the exact package and returns a proper quotation with a reference number and the full component list. This is what a customer actually needs to decide.
-->

---

## Demo — Delivery-Status Self-Service

Enter **order number, name, or handphone** → status, driver **ETA**, arranged window, driver contact.

Removes peak-hour hotline calls.

`[SCREENSHOT: DO202600003 → Out for Delivery + driver + ETA]`

<!--
SPEAKER NOTES: [Live.] I'll type an order number. The customer instantly sees the status, the driver's ETA, and the driver's direct number, so they call the driver, not a jammed hotline. Works by name or phone too.
-->

---

## Demo — Image ID & Multilingual

- Upload a photo (JPG/PNG) → numbered shortlist with prices
- Auto-detects **English, Malay, Chinese**

`[SCREENSHOT: uploaded image + shortlist, or composer with camera icon]`

<!--
SPEAKER NOTES: If a customer doesn't know an item's name, they snap a photo and get a shortlist of matching products with prices. And the whole experience works in three languages automatically, no menu switching.
-->

---

## Rep Dashboard — Human in the Loop

- Enquiries list with status & pagination
- Detail: From / Time / Lang + **full conversation**
- One-click **Assign to Human** for high-value cases

`[SCREENSHOT: dashboard detail — conversation + Assign to Human]`

<!--
SPEAKER NOTES: Reps aren't blind to the bot. The dashboard shows every conversation, the customer message and the AI reply, and lets a rep take over any chat in one click. The human is always in the loop.
-->

---

## Controls — Data & Tools

- **Data:** catalogue, packages, delivery, FAQ, enquiry log — owners & access defined
- **AI/Tools:** OpenClaw (reasoning), deterministic core, vision adapter, language detection, WhatsApp channel
- Each has an **operating constraint** and a **safe fallback**

<!--
SPEAKER NOTES: We documented every data source with an owner and access level, and every tool with its constraint. The recurring theme: each tool has a fallback so no single failure blocks a customer.
-->

---

## Risks, Guardrails & Human Approval

- AI **never** sets price/stock; deterministic fallback; low confidence escalates
- Prices from **approved data**; unclear rows excluded
- PII returned **only** to the matching customer
- Quotations are **indicative**; payment stays a human step
- Approvals: content sign-off · escalation · assign-to-human · order confirmation · milestone & cut-over

<!--
SPEAKER NOTES: This is how we keep it safe. The AI can interpret language but can never invent a price, that comes from approved data or it escalates. Payment is always a human step. And there are explicit approval gates, content, cut-over, order confirmation.
-->

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

<!--
SPEAKER NOTES: How we'll know it worked. The headline target: at least 70% of repetitive enquiries handled without a rep, first responses in seconds, and 100% price accuracy or escalation. We review weekly.
-->

---

## Results & Live Status

- **Deployed live** on AWS: `http://52.77.234.193:3000`
- **587-item** catalogue · **150** PC packages · **60** delivery records
- **264 automated tests** passing across 14 suites
- All features **verified live** (menu, quotation, delivery, dashboard)

`[SCREENSHOT: /health {"status":"ok"} + chat & dashboard]`

<!--
SPEAKER NOTES: This isn't a concept, it's running. Live on AWS, with a real 587-item catalogue and 264 passing tests. Everything I demoed today runs against the deployed system.
-->

---

<!-- _class: lead -->
## Roadmap & Thank You

**Next:** real vision key · confirm → order capture · CRM integration · analytics · more languages

**Summary:** repetitive workload absorbed · faster responses · 24/7 coverage · humans focused on selling

### Thank you — Questions?
<span class="small">Alvin (Owner) · Noel (Content) · Puay Sim (Sales) · Peter (DevOps)</span>

<!--
SPEAKER NOTES: To wrap up: we took the repetitive load off the team, made responses instant and round-the-clock, and kept humans in control of what matters. Next steps are a production vision key, turning quotes into captured orders, and CRM integration. Thank you, happy to take questions.
-->
