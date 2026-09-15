# Proposal: AI-Assisted WhatsApp Sales Enquiry Assistant
### BIS Computer Services — Hybrid Sales & Service Assistant

---

## 1. Problem Statement

> Sales representatives receive a high volume of customer enquiries through WhatsApp every day. Many questions relate to product availability, pricing, delivery charges, operating hours, and other frequently requested information. Responding individually to repetitive enquiries consumes a significant portion of the workday, delaying responses to high-value customers and reducing the team's ability to focus on sales activities.

### 1.1 Why this matters (business impact)

| Symptom | Consequence |
|---|---|
| Repetitive questions (price, stock, hours, delivery) answered manually | Reps spend hours/day on low-value replies |
| Slow response during peak hours | High-value / ready-to-buy customers wait or drop off |
| No after-hours coverage | Enquiries outside 8am–8pm go unanswered until next day |
| Delivery/ETA calls to hotline | Hotline congestion; "no one answers during peak hours" |
| Knowledge locked in reps' heads | Inconsistent answers; hard to scale the team |

### 1.2 Root cause

There is **no automated first layer** to absorb the repetitive, well-structured questions. Every message — from "what time do you open?" to "I want to buy a $3,000 gaming PC" — lands in the same human queue with the same priority.

---

## 2. Proposed Solution Overview

A **hybrid AI assistant** that sits on the business WhatsApp line and answers the repetitive enquiries instantly, 24/7, while intelligently routing genuine sales opportunities and anything uncertain to a human rep.

The word **hybrid** is deliberate: the system combines a fast, predictable **deterministic core** with an **AI reasoning layer**, and always keeps a **human escalation path**. This is the key design decision — it gives instant, *correct* answers for known questions without risking the AI "making things up" about prices or stock.

### 2.1 How a message flows (the enquiry pipeline)

```
Customer WhatsApp message
        │
        ▼
1. Sanitize & record the enquiry        (audit trail, analytics)
        │
        ▼
2. Detect language  (English / Malay / Chinese)
        │
        ▼
3. Menu / greeting?  ──► branded welcome + quick menu (1–8)
        │
        ▼
4. Delivery-status query?  ──► look up by order no / name / phone → status + ETA + driver
        │
        ▼
5. Known FAQ?  ──► instant answer (hours, delivery, payment, warranty…)
        │
        ▼
6. Product / package question?  ──► real price + stock from live catalogue
        │        (AI interprets vague/natural wording, budget reasoning)
        ▼
7. Uncertain OR "talk to a human"?  ──► escalate to a rep with a polite ack
        │
        ▼
8. Reply sent  +  outcome logged
```

**Design principle — "People before technology":** any low-confidence match or an explicit request for a person is routed to a human. The bot never guesses about price, stock, or a customer's order.

### 2.2 Core capabilities

1. **Quick menu + natural language.** Customers can reply with a number (1–8) *or* just type their question in plain language. Both work.
2. **Product availability & pricing** answered instantly from a **live catalogue of 524 real products** (459 components + 65 PC packages), with price and in-stock status.
3. **DIY PC packages by budget.** Menu option 2 immediately shows real build packages grouped into Entry (<$1,500), Mid-range ($1,500–3,000), and High-end (>$3,000) tiers with prices — no "a rep will follow up" delay.
4. **Budget-aware reasoning.** "Gaming PC around $2,000" returns options that actually fit the budget; if nothing fits, it says so honestly and names the closest option.
5. **Frequently asked questions** — operating hours, delivery charges, payment methods, warranty, location — answered consistently every time.
6. **Delivery-status self-service.** Customers check their own delivery by **order number, name, or handphone number** and get the current status, **driver ETA**, arranged delivery window, and the driver's direct contact — removing hotline calls during peak hours.
7. **Image identification.** A customer who doesn't know an item's name can upload a photo (JPG/JPEG/PNG/PDF); the assistant identifies the item and offers a numbered shortlist of matching products with different brands/models and unit prices.
8. **Multilingual** — English, Bahasa Melayu, and Chinese, detected automatically.
9. **Smart human handover.** Genuine sales opportunities and anything the bot is unsure about are escalated to a rep, with the enquiry logged.
10. **24/7 availability** — the repetitive layer never sleeps, so after-hours enquiries are captured and answered.

### 2.3 Architecture at a glance

| Layer | Technology | Purpose |
|---|---|---|
| Channel | WhatsApp webhook (Node.js / Express) | Receives and replies to messages |
| Deterministic core | FAQ matcher, product/catalogue search, menu, delivery lookup | Fast, predictable, always-available answers |
| AI reasoning layer | OpenClaw gateway (Claude Sonnet) | Interprets vague/natural phrasing, image ID, budget intent |
| Data store | JSON store today (swappable to SQLite / managed DB) | Catalogue, FAQs, deliveries, enquiry log |
| Escalation | Rule-based decision + logged handover | Routes to humans safely |
| Hosting | AWS Lightsail (Ubuntu), PM2 process manager | Always-on, low-cost deployment |

**Swappable edges:** the WhatsApp channel, the AI provider, and the database each sit behind a stable internal interface, so any one can be upgraded later (e.g. JSON → managed DB, or the official WhatsApp Business API) without rewriting the business logic.

### 2.4 What is intentionally *not* automated

- Final quotations, negotiations, and closing — these stay with reps (the bot hands over warm leads).
- Any answer the bot isn't confident about — routed to a human rather than guessed.
- Payment collection — the bot informs, a human/existing process transacts.

---

## 3. Scope

### 3.1 In scope
- WhatsApp enquiry automation for the enquiry types named in the problem statement: **product availability, pricing, delivery charges, operating hours**, plus payment methods, warranty, PC packages, and **delivery status/ETA**.
- Live product & package catalogue with real prices and stock.
- Multilingual (EN / MS / ZH) responses.
- Image-based item identification.
- Human escalation with an enquiry/analytics log.
- Deployment to the customer's AWS instance.

### 3.2 Out of scope (this engagement)
- Full order-taking / payment processing inside WhatsApp.
- CRM / accounting system integration (can be a follow-on phase).
- Voice-call handling.
- Marketing broadcast / campaign blasting.

### 3.3 Assumptions
- A WhatsApp number/channel is available for integration (simulated webhook now; official WhatsApp Business API onboarding in Milestone 3).
- Product, package, and delivery data are provided as CSV/exports and refreshed on an agreed cadence.
- The AI gateway (OpenClaw) is available on the hosting instance.

---

## 4. Delivery Plan — 3 Milestones × 7 days = 21 days

Each milestone is one week and ends with a working, demoable increment.

### Milestone 1 (Days 1–7): Foundation & Instant FAQ Automation
**Goal:** absorb the highest-volume repetitive questions.

| Day | Activity |
|---|---|
| 1 | Requirements confirmation, success metrics, WhatsApp channel plan |
| 2 | Enquiry pipeline skeleton (receive → record → reply), hosting setup |
| 3 | Language detection (EN/MS/ZH) + branded welcome + quick menu |
| 4 | FAQ knowledge base: hours, delivery charges, payment, warranty, location |
| 5 | Escalation logic + human handover + enquiry logging |
| 6 | Test suite; deploy to AWS Lightsail |
| 7 | **Demo & sign-off:** greeting, menu, FAQs, escalation working live |

**Deliverables:** Live assistant answering FAQs 24/7; multilingual menu; escalation path; deployed on AWS.

---

### Milestone 2 (Days 8–14): Product, Pricing & Delivery Intelligence
**Goal:** answer product/price/stock and delivery-status questions from live data.

| Day | Activity |
|---|---|
| 8 | Import & clean product catalogue (components + PC packages) |
| 9 | Product search + price/stock answers |
| 10 | Budget-aware reasoning; PC packages by budget tier (menu option 2) |
| 11 | Delivery data import; delivery-status lookup by order no / name / phone |
| 12 | Delivery menu option + driver ETA / contact replies |
| 13 | Test suite expansion; deploy & reseed data |
| 14 | **Demo & sign-off:** "how much is a mouse?", "$2k gaming PC", "where is my order?" answered live |

**Deliverables:** 500+ product catalogue with real prices; budget shortlisting; delivery self-service (status + ETA + driver) — removing peak-hour hotline calls.

---

### Milestone 3 (Days 15–21): AI Reasoning, Image ID & Production Hardening
**Goal:** handle vague/natural language and images, and prepare for production traffic.

| Day | Activity |
|---|---|
| 15 | Integrate AI reasoning layer (OpenClaw) for natural/vague enquiries |
| 16 | AI-assisted intent + budget extraction feeding the product search |
| 17 | Image upload → item identification → numbered shortlist with prices |
| 18 | Analytics/reporting: enquiry volumes, auto-answer rate, escalation rate |
| 19 | Official WhatsApp Business API onboarding & channel cutover plan |
| 20 | Load/robustness testing, error handling, monitoring, backups |
| 21 | **Final demo, handover, documentation & training** |

**Deliverables:** AI-enhanced natural-language handling; image identification; usage analytics; production-ready deployment with docs & training.

---

## 5. Success Metrics

| Metric | Target |
|---|---|
| Repetitive enquiries auto-answered without a rep | ≥ 70% |
| First-response time for common questions | < 5 seconds (from minutes/hours) |
| After-hours enquiries captured & answered | 100% |
| Delivery-status hotline calls | Measurable reduction |
| Rep time reclaimed for high-value selling | Significant weekly hours |
| Answer accuracy on price/stock (no wrong info) | 100% correct or escalate |

---

## 6. Why This Approach Solves the Problem

- **Removes the repetitive load** — the deterministic core instantly answers the exact enquiry types named in the problem statement (availability, pricing, delivery, hours), freeing reps.
- **Protects high-value customers** — because the bot clears the routine queue, reps respond faster to buyers; the bot also escalates real opportunities straight to a person.
- **Never gives wrong information** — prices/stock come from live data, and anything uncertain is escalated. Trust is preserved.
- **Works around the clock and in 3 languages** — enquiries are captured even outside operating hours.
- **Cuts hotline congestion** — delivery-status self-service handles the "where is my order?" peak-hour calls.
- **Built to grow** — swappable channel/AI/database edges mean the same solution scales from pilot to production.

---

*Prepared for BIS Computer Services. This proposal reflects a working system already deployed for demonstration.*
