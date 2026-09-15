# Scope and Proposed Approach — WhatsApp Sales Enquiries Assistant

Define a staged scope with explicit assumptions and estimates. The scope is staged so that each week produces a usable decision or increment. Total: 21 days across 3 weeks (7 days each).

## Mental model (how the pieces fit)

- **Lightsail Ubuntu server** (`52.77.234.193`) — a cloud computer; where the app *runs*.
- **WhatsApp Sales Assistant app** — the Node.js app described by the spec; what we *build*, then *deploy* to the server.
- **OpenClaw / openclaw-gateway** — an optional AI/LLM gateway for smarter FAQ answering. Not required for v1 (keyword matching). A week-3 stretch goal only.

Flow: build locally in Kiro → test (`npm test`) → deploy to Lightsail → launch (`npm start` on the server).

---

## Milestone table

| Milestone | Scope / Deliverables | Assumptions | Estimated Effort (days) |
|-----------|----------------------|-------------|--------------------------|
| **1st Week Scope** | Working, testable core running locally. Project scaffold (Node/Express, Jest test harness). Data store abstraction with seeded FAQs (availability, pricing, delivery, operating hours) in English, Bahasa Melayu, Chinese. Three pure, unit-tested services: language detection (en/ms/zh with confidence threshold), FAQ keyword matching (with English fallback), and escalation decision (low-confidence and explicit human-request routing). All verified via a single `npm test`. Covers spec Tasks 1–5. | Development happens locally in Kiro, not on the server. WhatsApp integration is simulated (no Meta API approval needed this week). The three supported languages are fixed at en/ms/zh. FAQ matching is keyword-based, no AI/LLM. Node.js LTS is the runtime. Success is measured by passing unit tests; no UI or deployment expected yet. | 7 |
| **2nd Week Scope** | End-to-end running application with browser interfaces. Webhook pipeline (`POST /webhook`) wiring record → detect → match → decide → reply, integration-tested with supertest. Swappable WhatsApp sender interface (simulated sender live, cloud sender stubbed). Express app + server entry (`npm start`). FAQ management API (create/edit, English answer required). Enquiries API for the dashboard (list, detail, resolve). Two browser pages: a simulated chat page and a rep dashboard. Covers spec Tasks 6–12. | Week 1 core is complete and passing tests. Still running locally / in simulated WhatsApp mode. Dashboard has no login/auth yet (single trusted rep assumed for the demo). Data persists via the JSON/SQLite store from week 1. UI is minimal and functional, not styled for production. | 7 |
| **Final Scope** | Deployed, demonstrable system on the Lightsail Ubuntu server plus optional enhancements. Deploy the app to the server, run it as a background service, open the chosen port in the Lightsail firewall, and verify the chat page, dashboard, and webhook are reachable at the server's public IP (spec Task 13). Optional stretch goals as time allows: real WhatsApp Business Cloud API integration with Meta webhook verification (Task 14), and a smarter LLM/embedding-based FAQ matcher behind the same interface, optionally via the OpenClaw gateway (Task 15). Final documentation and demo walkthrough. | Weeks 1–2 delivered a working, tested app. The Lightsail instance (Ubuntu, `52.77.234.193`) is available and SSH access works. Deployment uses simulated WhatsApp mode unless Meta Business/API approval is already granted. Real WhatsApp API and the OpenClaw/LLM matcher are stretch goals, not guaranteed — dependent on approvals and remaining time. Firewall changes to open the app port are permitted on the instance. | 7 |

---

## 1st Week Scope

**Scope / Deliverables:** Working, testable core of the WhatsApp Sales Assistant running locally. Project scaffold (Node/Express, Jest test harness). Data store abstraction with seeded FAQs (availability, pricing, delivery, operating hours) in English, Bahasa Melayu, Chinese. Three pure, unit-tested services: language detection (en/ms/zh with confidence threshold), FAQ keyword matching (with English fallback), and escalation decision (low-confidence and explicit human-request routing). All verified via a single `npm test`. Covers spec Tasks 1–5.

**Assumptions:** Development happens locally in Kiro, not on the server. WhatsApp integration is simulated (no Meta API approval needed this week). The three supported languages are fixed at en/ms/zh. FAQ matching is keyword-based, no AI/LLM. Node.js LTS is the runtime. Success is measured by passing unit tests; no UI or deployment expected yet.

**Estimated Effort:** 7 days

## 2nd Week Scope

**Scope / Deliverables:** End-to-end running application with browser interfaces. Webhook pipeline (`POST /webhook`) wiring record → detect → match → decide → reply, integration-tested with supertest. Swappable WhatsApp sender interface (simulated sender live, cloud sender stubbed). Express app + server entry (`npm start`). FAQ management API (create/edit, English answer required). Enquiries API for the dashboard (list, detail, resolve). Two browser pages: a simulated chat page and a rep dashboard. Covers spec Tasks 6–12.

**Assumptions:** Week 1 core is complete and passing tests. Still running locally / in simulated WhatsApp mode. Dashboard has no login/auth yet (single trusted rep assumed for the demo). Data persists via the JSON/SQLite store from week 1. UI is minimal and functional, not styled for production.

**Estimated Effort:** 7 days

## Final Scope

**Scope / Deliverables:** Deployed, demonstrable system on the Lightsail Ubuntu server plus optional enhancements. Deploy the app to the server, run it as a background service, open the chosen port in the Lightsail firewall, and verify the chat page, dashboard, and webhook are reachable at the server's public IP (spec Task 13). Optional stretch goals as time allows: real WhatsApp Business Cloud API integration with Meta webhook verification (Task 14), and a smarter LLM/embedding-based FAQ matcher behind the same interface, optionally via the OpenClaw gateway (Task 15). Final documentation and demo walkthrough.

**Assumptions:** Weeks 1–2 delivered a working, tested app. The Lightsail instance (Ubuntu, `52.77.234.193`) is available and SSH access works. Deployment uses simulated WhatsApp mode unless Meta Business/API approval is already granted. Real WhatsApp API and the OpenClaw/LLM matcher are stretch goals, not guaranteed — dependent on approvals and remaining time. Firewall changes to open the app port are permitted on the instance.

**Estimated Effort:** 7 days

---

## Proposed Solution Overview

A hybrid WhatsApp sales assistant that auto-answers common customer questions (availability, pricing, delivery, hours) in the customer's own language (English, Bahasa Melayu, Chinese) and escalates anything uncertain to a human rep. Built with a pure, testable core (language detection, FAQ matching, escalation) and swappable edges (WhatsApp sender, data store), so it can be demoed now with a simulated channel and switched to the real WhatsApp Cloud API later without changing the core logic. Reps use a simple dashboard to manage enquiries and FAQ answers. Delivered in three weekly increments: tested core, running app with UI, then deployment to AWS Lightsail with optional AI and real-WhatsApp enhancements. Guiding principle: people before technology — uncertainty always routes to a person rather than a wrong guess.

---

## Scope addition — Product catalogue & quotation (computer components)

**Decision:** The business sells computer components, so the assistant answers not only category FAQs but also **specific product enquiries** ("How much is the RTX 5070 TUF? Do you have it?") and can **build simple quotations** for multiple items. This directly targets the high-volume, repetitive pricing/availability enquiries described in the problem statement.

**Deliverables (added, folded into Week 1 core and Week 2 pipeline):**
- A product catalogue seed of representative computer components across all major categories: CPUs, motherboards, GPUs, SSDs, RAM, cases, PSUs, coolers, monitors, NAS, mini-PCs, and software.
- A pure, tested `product.service` providing:
  - `findProducts(text)` — token/model-number search by name, brand, and category.
  - `buildQuotation(lines)` — line totals, subtotal, currency, and stock flags.
- Catalogue stored behind the same `store` abstraction as FAQs/enquiries, auto-seeded on first run.

**Assumptions:**
- Prices are in SGD and are sample/reference values; they can change and are confirmed by a rep for high-value orders.
- **Stock is modelled realistically** (`in_stock` / `low_stock` / `made_to_order` with sensible quantities), **not** a flat large number, so the bot never gives a misleading "thousands in stock" answer. This respects the "confident but wrong answer" risk (owner: Noel).
- The product list is a **representative subset** for demonstration; it can be expanded without code changes by editing the catalogue seed.
- No third-party company or supplier name is stored or shown anywhere; product entries carry brand/model and price only.
- Quotations are indicative; final pricing, delivery, and availability for large or high-value orders are confirmed by a human rep (escalation path).
