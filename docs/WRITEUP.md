<div style="text-align: center; padding-top: 120px;">

# WhatsApp Sales & Service Assistant

## Project Write-Up

<br>

**Hybrid AI WhatsApp Sales & Service Assistant for "BIS Computer Services"**

<br><br>

| | |
|---|---|
| **Project Owner** | Alvin |
| **Content Admin** | Noel |
| **Lead Sales Rep** | Puay Sim |
| **DevOps** | Peter |

<br><br>

**Delivery method:** Built in the Kiro IDE using a spec-driven workflow (requirements → design → tasks), with steering rules and automation hooks.

**Deployment:** Live on AWS Lightsail (Ubuntu) at `http://52.77.234.193:3000`

**Date:** September 2026

</div>

<div style="page-break-after: always;"></div>

# WhatsApp Sales & Service Assistant — Project Write-Up

**Project:** Hybrid AI WhatsApp Sales & Service Assistant for "BIS Computer Services"
**Delivery method:** Built in the Kiro IDE using a spec-driven workflow (requirements → design → tasks), with steering rules and automation hooks.
**Deployment:** Live on AWS Lightsail (Ubuntu) at `http://52.77.234.193:3000`
**Guiding principle:** People before technology — automation shortcuts only the repetitive, clearly-answerable cases; whenever the system is uncertain it hands off to a human rather than guessing.

---

## Table of Contents

1. Introduction and Problem Statement
2. Project Objectives
3. Initial Phase — Discovery and Framing
4. User Requirements (Functional and Non-Functional)
5. Solution Design and Architecture
6. Data Design
7. Steering and Hooks (Kiro Configuration)
8. Modules and Subtasks (Implementation Detail)
9. The Guided Sales and Service Flow
10. Online Booking — Onsite and Carry-in Appointments
11. Warranty Check — Serial Lookup and Service Handoff
12. Conversational Commerce — Payment, Order and Delivery Journey
13. Multilingual Support (i18n)
14. Image Recognition and the Honest Fallback
15. Delivery Plan, Milestones and Team
16. Controls, Risks and Human Approval
17. Success Measures
18. Testing and Verification
19. Deployment
20. Results (Verified Figures)
21. Roadmap and Future Work
22. Conclusion

---

## 1. Introduction and Problem Statement

Small and mid-sized computer retailers in Singapore and the wider region run a large share of their customer conversations through WhatsApp. Customers message throughout the day asking the same handful of questions: *"How much is this RAM?"*, *"Do you have the RTX 5070 in stock?"*, *"How much is delivery?"*, *"What time do you open?"*, *"Can I bring my PC in for repair?"*. Each of these is easy to answer, but there are so many of them that a sales representative can spend most of the working day retyping the same replies. That repetitive load has three costs. It delays responses to high-value customers who are ready to buy. It leaves less time for actual selling. And because customers write in several languages — commonly English, Bahasa Melayu, and Chinese, sometimes mixed within a single sentence — a rushed human reply can come back in a language the customer does not read comfortably, which slows the sale further.

The problem, stated in human terms, is therefore not "we need a chatbot." It is: *the sales team's time is consumed by repetitive, multilingual enquiries, which delays high-value customers and reduces selling time, and customers who write in Bahasa Melayu or Chinese risk slower or less clear service.* Everything in this project traces back to that sentence.

The solution is a **hybrid assistant**. It is not a pure AI chatbot that tries to answer everything, and it is not a rigid keypad menu that frustrates people who type naturally. It is a deterministic core that handles the common, clearly-answerable enquiries instantly and correctly, combined with an AI layer for the harder cases (such as identifying an item from a photo or interpreting a loosely-worded processor question), and — crucially — a human escalation path for anything the system is not confident about. The customer gets a fast, correct answer in their own language; the rep only sees what genuinely needs a person.

## 2. Project Objectives

The project set out to achieve the following, in priority order:

- **Reduce repetitive load on sales reps** by auto-answering the high-frequency enquiries (product price and availability, delivery and payment, operating hours, repair options).
- **Answer in the customer's language** — English, Bahasa Melayu, or Chinese — detected automatically, with an explicit language picker as a fallback.
- **Never give a confidently wrong answer.** When the system is uncertain it escalates to a human. It never fabricates a price, a stock level, or a product identification.
- **Turn an enquiry into a completed order** through an end-to-end conversational commerce journey: shortlist → selection → quantity → quotation → confirmation → secure payment → order and invoice → delivery tracking. The chat becomes a full digital sales channel, not just an enquiry answerer.
- **Let customers check live stock** on any item (menu option 5, Product Availability), showing price and units in stock.
- **Cover service as well as sales**: let customers **book repair appointments** in chat — carry-in at the service centre and onsite — each as a structured, numbered booking that produces a confirmed booking number, and **check product warranty** by serial number with a direct handoff into those bookings.
- **Be demonstrable at every stage** through a single `npm test` run, an inspectable webhook response, and browser pages (customer chat and rep dashboard).
- **Be deployable and swappable** — build and demo now on a simulated WhatsApp channel, and switch to the real WhatsApp Business Cloud API later without rewriting the core logic.

## 3. Initial Phase — Discovery and Framing

The initial phase was deliberately spent framing the problem around people rather than jumping to technology. This framing is captured in the project's product steering document, which names the two groups the system serves before describing any feature.

**Customers (enquirers)** send questions over WhatsApp about availability, pricing, delivery charges, operating hours, and repairs. They want a fast, clear answer in their own language, and they feel ignored or frustrated when replies are slow or come back in a language they cannot read comfortably.

**Sales representatives** receive a high daily volume of enquiries and lose selling time retyping the same answers. They want the repetitive load handled automatically while keeping control over anything nuanced, sensitive, or sales-critical.

From this framing came the single most important design principle, applied consistently thereafter: **people before technology.** Every feature had to first answer the question *which human need does this serve?* Automation and any AI capability were introduced only where they measurably reduced the rep's repetitive load or sped up a clear, correct answer. When the bot is unsure, the humane default is to escalate to a person — never to guess.

The initial phase also fixed two pragmatic scope decisions that shaped everything downstream:

- **WhatsApp is simulated first.** Rather than wait for Meta Business API approval, the system was built against a webhook plus a browser test-chat page, with the real WhatsApp Business Cloud API to be swapped in later behind the same interface. This kept progress unblocked.
- **Three languages are in scope for v1:** English (default), Bahasa Melayu, and Chinese (Simplified).

## 4. User Requirements

The requirements were written as user stories with EARS-style acceptance criteria (WHEN/IF/WHERE … THEN the system SHALL …), so each is individually testable. There are eight functional requirements and a set of non-functional requirements.

### Functional Requirements

**R1 — Receive customer enquiries.** As a customer, I want to send a question over WhatsApp and have it received reliably. The system records each enquiry with a timestamp, sender, and original text; rejects payloads missing the sender id or text without creating a record; and sanitizes text before storing or processing it.

**R2 — Detect the customer's language.** As a customer who writes in Bahasa Melayu or Chinese, I want replies in my own language. The system detects the language as `en`, `ms`, or `zh` with a confidence score; defaults to `en` when confidence is below threshold; and selects the dominant language for mixed-language messages.

**R3 — Auto-answer frequently asked questions.** As a customer, I want an immediate answer to common questions. The system matches the enquiry to a stored FAQ intent with a confidence score, replies with the answer in the detected language, falls back to the English answer (flagged) if the detected language is missing, and records the matched FAQ, language, confidence, and that it was auto-answered.

**R4 — Escalate uncertain or human-requested enquiries.** As a customer with a complex question I want to reach a real person; as a rep I want only what the bot cannot confidently handle. If no FAQ matches at or above the confidence threshold, or the customer explicitly asks for a person, the system escalates, records the reason, marks the enquiry pending, and sends a localized acknowledgement that a rep will follow up.

**R5 — Rep dashboard (human-in-the-loop console).** As a rep, I want to see incoming enquiries, which ones need me, and to take over the conversation. The dashboard lists enquiries with status, language, and timestamp; shows the full conversation and the escalation reason; lets a rep **reply directly to the customer** (the message is delivered to the customer's chat thread); marks the enquiry `in_progress` and records who is handling it; and lets a rep mark it resolved, recording who resolved it.

**R6 — Manage FAQ answers.** As a rep or admin, I want to add and edit FAQ answers per language. The system stores answers per language (requiring at least English), uses edits for subsequent enquiries, and rejects a FAQ created without an English answer.

**R7 — Swappable WhatsApp integration.** As the project owner, I want to build and demo now without WhatsApp API approval and switch to the real API later. In `simulated` mode the system accepts messages via a test chat page and records outbound replies without any external call; in `cloud` mode it sends via the WhatsApp Business Cloud API through the same sender interface; changing modes requires no change to language, FAQ, or escalation logic.

**R8 — Visible, testable results.** As the project owner, I want to see results at each stage. `npm test` runs unit tests for language detection, FAQ matching, and escalation, plus a webhook integration test; the running webhook returns the bot's reply for direct inspection; and the chat page and dashboard are reachable in a browser.

### Non-Functional Requirements

- **Privacy:** store only what is needed to answer and escalate; keep secrets out of the repository.
- **Reliability:** an error answering one enquiry must not crash the server or block other enquiries.
- **Extensibility:** the language set and FAQ set can grow without code changes to the core flow.
- **Humane fallback:** uncertainty always routes to a person, never to a silent wrong guess.

## 5. Solution Design and Architecture

The design keeps the **human-facing logic pure and testable** — language detection, product/FAQ matching, and escalation decisions are plain functions of their inputs — and puts **swappable interfaces at the edges** — the WhatsApp sender and the data store. This is what lets the system be demonstrated on a simulated channel now and switched to the real WhatsApp Cloud API later without touching the core.

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
            |     service / FAQ / image   |
            |  4. decide: answer or       |
            |     escalate                |
            |  5. reply via sender        |
            +-------------+--------------+
                          |
          +---------------+----------------+
          |                                |
     data store                        sender interface
 (enquiries, faqs, products,     simulated.sender | cloud.sender
  deliveries, escalations)
```

- **Routes** expose the HTTP surface: the inbound webhook, the FAQ management API, and the enquiries API used by the dashboard.
- **Controllers** translate HTTP to and from the services and hold no business rules.
- **Services** are the testable core: language, product/FAQ, escalation, sales flow, payment/order, onsite, delivery, i18n, and the AI providers. They take plain inputs and return plain results — no Express request/response objects.
- **Edges** are the sender (simulated or cloud) and the store (JSON files now, a managed database later), each behind a small interface.

### The enquiry pipeline

Every inbound message flows through the same pipeline in `webhook.controller.js`:

1. **Receive and validate** — `POST /webhook` accepts `{ from, text }`. A payload missing `from` or `text` is rejected; text is sanitized.
2. **Record** — the enquiry is persisted with an id, sender, sanitized text, and timestamp.
3. **Detect language** — the language service returns `{ language, confidence }`; low confidence defaults to English; an explicit language preference (from the picker) overrides per-message detection.
4. **Route** — the controller determines the enquiry type using conversational state (the customer's prior turn) and the message content: a menu-option selection, a natural-language product enquiry, a step in the guided sales flow, a step in the payment journey, a step in an onsite or carry-in booking, a delivery-status lookup, an image upload, or a general FAQ.
5. **Decide** — for FAQ-style enquiries the escalation service decides between auto-answering and handing off to a person, based on match confidence and any explicit request for a human.
6. **Respond** — the sender delivers the reply (recorded in the store in simulated mode); escalations create an escalation record, set the enquiry to pending, and send a localized acknowledgement.
7. **Return** — the webhook echoes the bot's reply so it can be inspected directly, which is what makes browser and test-level verification possible.

### Swappable edges

The `sender` interface is `send(to, message)`. The `simulated.sender` records outbound messages and returns them in the webhook response (no external calls); the `cloud.sender` is the phase-2 path to the WhatsApp Business Cloud API. The `store` abstraction exposes create/get/list/update per collection over a JSON-file backend that can be replaced with SQLite or a managed database without touching business logic. This edge-swapping design is the direct implementation of Requirement 7.

## 6. Data Design

Data is accessed only through the `store` abstraction, which manages ten collections: **enquiries**, **faqs**, **escalations**, **products**, **deliveries**, **warranty**, **orders**, **invoices**, **payments**, and **bookings**. Products, deliveries, and the warranty database (and the starter FAQs) are seeded from JSON on first run, so a fresh deployment comes up fully populated; orders, invoices, payments, and bookings start empty and are created as customers complete purchases (Section 12) or book repair appointments (Section 10).

The catalogue is the heart of the sales capability. The verified live figures are:

- **979 catalogue items** in total, made up of **829 components** and **150 DIY PC packages** (`pc_bundle`).
- **21 product categories** spanning CPUs, motherboards, GPUs, SSDs, RAM, cases, power supplies, coolers, monitors, peripherals, networking, and more.
- **60 seed delivery records** used by the delivery-status lookup (new delivery orders are appended as customers complete purchases).
- **50 customer-and-warranty records** used by the warranty check (Section 11), each with a unique serial number, invoice, purchase and expiry dates, and coverage.
- Every catalogue item is stocked `in_stock` with a uniform quantity of **100 units**, which drives the Product Availability feature (menu option 5): a customer can ask about any item and see both its price and the number of units in stock.

Among the components, **72 CPUs** were loaded from a 2026 processor price list, which is what powers the natural-language CPU queries described later.

Each product carries brand, model, category, price (SGD), and stock — deliberately **no supplier or third-party company name** is stored or shown anywhere. Prices are treated as indicative: for high-value orders the final price, delivery, and availability are confirmed by a human rep through the escalation path. This is a direct expression of the "no confidently wrong answer" principle applied to data.

The core record shapes are:

- **Enquiry:** id, sender, sanitized text, detected language and confidence, status (`auto_answered` / `pending` / `in_progress` / `resolved`), matched FAQ id, match confidence, whether an English fallback was used, who is handling it, and timestamps including who resolved it. Rep-to-customer replies are stored in the same collection as outbound messages (author `rep`, keyed to the customer) so the customer's chat can display them.
- **FAQ:** id, intent label, per-language keyword hints, per-language answers (English required), and an updated-at timestamp.
- **Escalation:** id, enquiry id, reason (`low_confidence` / `human_requested` / `order_confirmed`), created-at, and status.
- **Payment:** id, sender, method (`card` / `paynow`), status (`pending` / `paid`), mode (`simulated`), the quoted product/quantity/amount/currency, quote reference, language, and — once settled — the linked order, invoice, and delivery references.
- **Order:** id, order reference (`ORD-YYYYMMDD-NNN`), sender, status (`Preparing Order`), product/quantity/amount, and the linked quote, invoice, and delivery references.
- **Invoice:** id, invoice reference (`INV-YYYYMMDD-NNN`), the order reference, line details, payment method, and status (`Paid`).
- **Booking:** id, booking reference (`OS-`/`CI-YYYYMMDD-NNN`), type (`onsite` / `carry_in`), sender, the chosen service type or device, date, time slot, customer details (name/address/phone for onsite), problem description, fee, status (`CONFIRMED` for onsite / `Awaiting Drop-Off` for carry-in), and language.
- **Warranty:** customer id, name, mobile, email, product category, brand, model, unique serial number, invoice number, purchase date, warranty status, warranty end date, coverage label, service type, and last-service status.

Products carry brand, model, category, price (SGD), stock status, and quantity — deliberately **no supplier or third-party company name** is stored or shown anywhere.

## 7. Steering and Hooks (Kiro Configuration)

Because the project was built in the Kiro IDE, two Kiro mechanisms shaped how it was developed: **steering** (persistent guidance included in the agent's context) and **hooks** (automation triggered by IDE events). These are stored in the workspace under `.kiro/`.

### Steering files

Four steering documents live in `.kiro/steering/`, each set to manual inclusion so they are pulled in when relevant:

- **`whatsapp-product.md` (Product Summary)** — the people-first framing: who the customers and reps are, the problem in human terms, the hybrid-assistant product definition, and the "people before technology" principle. This kept every feature anchored to a human need.
- **`whatsapp-standards.md` (Project Standards)** — the coding and behavioural rules: CommonJS modules, `const` by default, double quotes, semicolons, 4-space indentation; services kept pure and free of Express objects so they can be unit-tested; multi-language rules (support en/ms/zh, default to English when uncertain, English fallback flagged, never silently machine-translate a sensitive answer); the service return-shape contracts; Jest + supertest testing with a single `npm test`; validate and sanitize inbound data and never expose raw errors; and no secrets in the repository.
- **`whatsapp-structure.md` (Project Structure)** — the layered layout (routes → controllers → services → store), naming conventions (dotted lowercase file names, camelCase functions, ISO language codes), and the rule that escalation is the safe default when confidence is low.
- **`whatsapp-tech.md` (Tech Stack)** — the runtime and libraries (Node.js with Express, express-validator, Jest, supertest, a language-detection library, dotenv), the JSON-store-now/managed-DB-later note, the two-phase WhatsApp integration plan, and the three ways results are seen (`npm test`, REST against the server, browser pages).

Together these steering files acted as a persistent contract: the agent implementing the code was consistently guided toward pure testable services, swappable edges, multilingual correctness, and the people-first escalation default.

### Hooks

Two automation hooks live in `.kiro/hooks/`, both of which enforce the "results you can see" discipline by running the test suite automatically:

- **`run-tests-on-save.kiro.hook`** — a `PostFileSave` hook matching any `.js` file under `src/` or `tests/`. When a source or test file is saved, it runs `npm test --silent`. This gives immediate feedback that a change did not break anything.
- **`verify-after-task.kiro.hook`** — a `PostTaskExec` hook that runs `npm test --silent` after a spec task is completed, so every finished task is verified against the full suite before moving on.

These hooks operationalize Requirement 8 (visible, testable results) and the standards-file rule that tests must always be runnable and passing.

## 8. Modules and Subtasks (Implementation Detail)

The implementation followed the spec's task plan, which was ordered so results appear as early as possible: pure testable core first, then the HTTP layer, then the browser UI, then deployment. Below is each module and the subtasks it delivers.

### Data layer

- **`src/data/store.js`** — the data-access abstraction (spec Task 2). A dependency-light JSON-file backend behind a stable create/get/list/update interface over ten collections (enquiries, faqs, escalations, products, deliveries, warranty, orders, invoices, payments, bookings). It ensures the data directory and each collection file exist, and seeds faqs, products, deliveries, and warranty from JSON on first run. Swapping the backend later touches nothing else.
- **`src/data/seed/`** — seed data for FAQs (in en/ms/zh), the product catalogue (829 components + 150 packages), 60 delivery records, and 50 customer-and-warranty records.

### Core services (pure, tested)

- **`language.service.js`** (spec Task 3) — detects `en` / `ms` / `zh` with a confidence score, defaulting to English below threshold and choosing the dominant language for mixed text. The Chinese-detection threshold was tuned so that a message with two or more Han characters (or roughly a fifth of the text in Han) is treated as Chinese, which correctly handles a mixed line like a product word followed by a Chinese question.
- **`faq.service.js`** (spec Task 4) — matches an enquiry to a stored FAQ intent per language and produces a normalized confidence, applying the English fallback (flagged) when the detected language has no answer.
- **`escalation.service.js`** (spec Task 5) — decides auto-answer versus hand-off. It escalates on an explicit human request (phrase lists per language) or when no FAQ matches confidently, recording the reason. The acknowledgement sent to the customer on a "talk to sales" request is a fixed, localized message promising follow-up within ten minutes.

### Product and quotation

- **`product.service.js`** — natural-language product search and quotation building. It tokenizes queries (splitting letters from digits so model numbers match), finds products by name, brand, and category, and formats a numbered shortlist and a quotation reply. It includes CPU-aware interpretation so that loosely-worded processor queries in natural language — for example a request phrased as "Intel processor generation 14", "i5 14th gen", or "ryzen 9 9000 series" — are mapped to the right processors.

### Guided sales and service flow

- **`salesflow.service.js`** — the state machine that turns an enquiry into a quotation: asking for quantity, building the quotation (now including a live stock line), and matching a shortlist selection either by its number or by a fuzzy name match. Every step takes the active language so the whole flow stays in the customer's language.
- **`payment.service.js`** — the conversational-commerce engine (described in full in Section 10). It generates the daily-sequenced references (`Q-`, `ORD-`, `INV-`, `DO-YYYYMMDD-NNN`), creates a pending payment plus its secure test-payment link, and — once the simulated gateway confirms payment — creates the order, invoice, and delivery records and links them together. It is a swappable edge: `PAYMENT_MODE=simulated` never touches a real gateway or any secret.
- **`booking.service.js`** — the online-booking engine (described in full in Section 10). A pure, testable module that generates the next available dates, the numbered service-type and device pickers, the daily-sequenced `OS-`/`CI-YYYYMMDD-NNN` references, and the onsite and carry-in booking records. The controller wires the multi-step conversation state to it.
- **`onsite.service.js`** — retained for its address-recognition helper (`looksLikeAddress`), which lets a customer who types an address directly drop straight into the onsite booking flow. It also states the onsite fee (SGD 60 per visit, excluding parts).
- **`delivery.service.js`** — the delivery-status lookup used by the dashboard and the customer flow, backed by the delivery records. It recognizes both the seeded order-number format (`DO202600001`) and the new order-journey format (`DO-YYYYMMDD-NNN`), comparing them hyphen-insensitively, so an order paid for in chat is immediately trackable.
- **`warranty.service.js`** — the warranty lookup (Section 11). It detects serial (`SG26-…`) and invoice (`INV-…`) patterns, matches a record by serial → invoice → phone → name with a normalized (hyphen/space/case-tolerant) serial comparison, and builds the localized warranty reply with the 1/2/3 service options.

### Menu, i18n and language

- **`menu.service.js`** — the numbered main menu and welcome message, the per-option responses, and the helpers that detect a language request, interpret a numbered language-picker choice (`detectLanguageChoice` accepts `1`/`2`/`3` or a name/flag), and recognise the universal navigation commands (`isHomeCommand` for `0`/`menu`/`home`, `isBackCommand` for `back`/`previous`, both with Malay/Chinese variants). The final menu order is: 1. Computer Components, 2. DIY PC Package, 3. Carry-in Service, 4. Onsite Repair, 5. Product Availability, 6. Talk to Sales, 7. Delivery Status, 8. Warranty Status, 9. About Us, plus an un-numbered Language item. Option 5 was renamed from "Delivery & Payment" to **Product Availability** because delivery/payment information overlapped with option 7 (Delivery Status); the new option lets a customer name any item and see its price and live stock count. Delivery and payment keywords now route to option 7. Warranty Status was added as option 8 (moving About Us to 9) so serial-based warranty checks have a clear entry point.
- **`i18n.service.js`** — the translation function `t(lang, key, vars)` and the string tables for English, Bahasa Melayu, and Chinese. It localizes product lists, quotations, selection prompts, confirmations, and every menu-option response, while deliberately keeping computer terms (CPU, GPU, RAM, SSD, DDR5) and postal addresses in English for clarity.
- **`language.service.js`** also backs the sticky language preference: once a customer explicitly chooses a language from the picker, that choice wins over per-message auto-detection until they change it.

### AI providers

- **`services/ai/openclaw.client.js`** — the client for the OpenClaw AI gateway used for the harder, non-deterministic cases.
- **`services/ai/vision.provider.js`** — image identification. It maps recognition labels to catalogue categories, and when it cannot confidently identify an uploaded photo it degrades gracefully to a numbered category picker rather than a dead end.

### HTTP layer

- **`controllers/webhook.controller.js`** — orchestrates the entire pipeline and holds the conversational state helpers (the prior enquiry, the sticky language preference, whether the last turn was the language picker or a delivery-status lookup) and the menu-route states (product shortlist, awaiting quantity, quotation, payment method, payment pending, order confirmed, the onsite booking steps `onsite_book_service`/`date`/`slot`/`details`, the carry-in booking steps `carry_in_book_date`/`slot`/`device`/`problem`, the warranty prompt and `warranty_result` handoff, language picker, image category pick, delivery status). It also runs the universal HOME and BACK handlers before the flow-specific logic: HOME returns the welcome menu from any step, and a `handleBack` helper maps each flow step to its previous prompt so `back` reliably steps the customer one screen back.
- **`controllers/enquiry.controller.js`** and **`controllers/faq.controller.js`** — the dashboard enquiries API (list, detail, resolve, and **reply**) and the FAQ management API (list, create with English required, edit). The reply endpoint (`POST /api/enquiries/:id/reply`) delivers a rep's message to the customer via the sender and stores it in the thread; a companion `GET /api/messages/:from?since=` endpoint lets the customer chat poll for those replies.
- **`routes/webhook.routes.js`, `routes/enquiry.routes.js`, `routes/faq.routes.js`, `routes/payment.routes.js`** (plus the `GET /api/messages/:from` polling route) — the HTTP surface mounting those controllers. The payment routes serve the test payment page (`GET /pay/:id`), its detail JSON (`GET /pay/:id/info`), and the simulated gateway callback (`POST /pay/:id/complete`) that settles the payment and sends the WhatsApp confirmation.
- **`src/app.js`** and **`src/server.js`** — the Express app wiring (middleware, route mounting, an error handler that logs server-side and escalates on failure rather than crashing) and the server entry point.

### Browser pages

- **`public/chat.html`** — the simulated customer chat used for the demo and as deployment evidence. It includes the numbered quick-menu buttons, an un-numbered Language button, and a persistent navigation bar with one-tap 🏠 Menu and ◀ Back buttons (which send the `0` and `back` commands).
- **`public/dashboard.html`** — the rep dashboard and **two-way reply console**: it lists enquiries, highlights escalated ones, opens the full conversation, lets a rep **reply to the customer** (shown as a human bubble in both the dashboard and the customer's chat), and mark the enquiry resolved. The customer chat page polls for these replies every few seconds and renders them as "(human)" bubbles, so a rep taking over is visible live in the customer's thread.
- **`public/pay.html`** — the secure test-payment page: it reads the payment detail, renders the amount, method (card form or PayNow/SGQR QR), collects a delivery name and address, and on "Pay" calls the simulated gateway callback, then shows the order, invoice, and delivery references. It is clearly marked as a demonstration payment that makes no real charge.

### Supporting scripts

The `scripts/` directory holds the data-preparation and utility scripts: catalogue converters, a delivery-record converter, a component loader, a CPU replacement script that loaded the 72 processors from the 2026 price list, a CSV exporter that produces the five record files (components, PC packages, deliveries, warranty, test suites), and a vision test harness.

## 9. The Guided Sales and Service Flow

The centrepiece of the product is a guided flow that converts a casual price question into a confirmed order without the customer needing to know any commands.

When a customer asks about an item — for example the price of RAM — the system responds with a **numbered shortlist** of up to five matching products, each with its **price and its live stock count** (for example "100 in stock"), and an invitation to reply with a number or simply type the item name (no exact wording needed). The customer selects either **by number (1–5)** or by a **fuzzy name match**. The system then asks for the **quantity**, builds a **quotation** with line total, subtotal, and the units in stock, and invites the customer to type "confirm". On confirmation the flow moves into the **payment journey** described in Section 10 — the customer is offered a payment method and, once payment is completed, receives their order, invoice, and delivery details. (The "Talk to Sales" option remains available as the human path at any time.)

The **DIY PC Package** option follows the same shape, but each package is presented as a whole bundle with its component parts shown in brackets (CPU, motherboard, RAM, case, power supply, and so on) at a single package price, so the customer can evaluate and buy a complete build in one step.

For service, the flow splits cleanly into two distinct options, each of which is a **structured online booking** (detailed in Section 10):

- **Option 3 — Carry-in Service:** a guided booking (date → time slot → device → problem) that ends with a confirmed booking number and reminds the customer of the standard charge (SGD 30, excluding parts), the 1–2 working-day turnaround, and the service-centre address (10 Simei Avenue 1, Tech Block, #02-01, Singapore 486570) with operating hours (Monday to Friday, 8:00am to 5:30pm; closed Sundays and public holidays).
- **Option 4 — Onsite Repair:** a guided booking (service type → date → time slot → contact details) that ends with a confirmed appointment number and states the onsite fee (SGD 60 per visit, excluding parts). It also triggers automatically if a customer types an address directly without choosing the option. Onsite deliberately does **not** show a product price list, because that is not relevant to a repair visit.

Throughout, the "no wrong info to customer" principle holds: the system never guesses a price or stock level, and anything uncertain is escalated to a rep.

A separate menu option, **Product Availability (option 5)**, serves the pure stock enquiry: the customer names an item and the assistant returns its price together with how many units are in stock. This option was introduced in place of the former "Delivery & Payment" option, whose content duplicated the Delivery Status feature (option 7); consolidating delivery and payment information under option 7 removed that overlap and gave stock its own clear entry point.

### Universal navigation (Home and Back)

Because a WhatsApp conversation has no persistent on-screen button bar, navigation is provided as **universal text commands** that work at every step and in all three languages — the established best practice for conversational interfaces:

- **`0`, `menu`, or `home`** (and the Malay/Chinese equivalents) returns the customer to the main menu from anywhere, clearing whatever flow they were in. This is the "escape hatch" if a customer gets stuck partway through a booking or quotation.
- **`back`** (or `previous`) steps one screen back within a multi-step flow — for example from the time-slot picker back to the date picker in a booking, or from the quantity prompt back to the product shortlist. From the first step of a flow, `back` simply returns to the main menu, which keeps the behaviour predictable.

Multi-step prompts carry a short localized footer hint, `(Reply 0 for the main menu, or "back" to go back a step.)`, so customers discover the commands without any clutter. On the chat page these are additionally exposed as one-tap **🏠 Menu** and **◀ Back** buttons, but the text commands are what make the navigation work universally — including on the real WhatsApp channel.

## 10. Online Booking — Onsite and Carry-in Appointments

Beyond answering enquiries, the assistant lets customers **book repair appointments directly in the chat**, so a request like "my computer cannot start, I need someone to check it" becomes a confirmed appointment without a phone call. Options 3 and 4 were upgraded from simple information-and-acknowledgement flows into **structured, numbered, multi-step bookings** that each produce a confirmed booking number and a stored record the service team can act on — the same digital-journey pattern used for payment.

Every step is presented as a **numbered choice**, so the flow works in plain WhatsApp text (the customer replies "1", "2", "3", …), and the whole booking is available in all three languages.

### Onsite Repair booking (option 4) → `OS-YYYYMMDD-NNN`

1. **Service type** — 🖥️ Onsite Troubleshooting, 🔧 Hardware Repair, or 🛠️ PC Setup & Installation.
2. **Date** — the next three available days, shown as a numbered list generated live from the current date.
3. **Time slot** — 9:00–11:00 AM, 11:00 AM–1:00 PM, 2:00–4:00 PM, or 4:00–6:00 PM.
4. **Details** — the customer provides name, address, contact number, and a brief problem description in one message.
5. **Confirmation** — the system creates a booking `OS-YYYYMMDD-NNN` with status **CONFIRMED**, echoes the full summary, reminds the customer of the SGD 60 onsite fee (excluding parts), and states that a technician will contact them before the appointment.

If a customer types an address directly (forgetting to pick option 4), the system recognises it, starts the onsite booking, and pre-fills the address before asking for the service type.

### Carry-in Service booking (option 3) → `CI-YYYYMMDD-NNN`

1. **Date** — the next three available days.
2. **Time slot** — the same four drop-off windows.
3. **Device** — 💻 Laptop, 🖥️ Desktop, 🖨️ Printer, or 📱 Other.
4. **Problem** — a short description.
5. **Confirmation** — the system creates a booking `CI-YYYYMMDD-NNN` with status **Awaiting Drop-Off**, shows the service-centre address and hours, and reminds the customer of the SGD 30 charge (excluding parts) and the 1–2 working-day turnaround.

Bookings live in a dedicated **`bookings`** store collection, use the same daily-sequenced reference style as orders (`OS-`/`CI-YYYYMMDD-NNN`), and each completed booking also creates a pending record so the service team is notified. Consistent with the project's honesty principle, a booking is only created once every step is complete, and the confirmation promises human follow-up rather than over-committing the system.

## 11. Warranty Check — Serial Lookup and Service Handoff

After-sales support is a large share of a computer retailer's WhatsApp traffic: *"is my card still under warranty?"*, *"how long is left?"*, *"who do I contact if it fails?"*. The assistant answers these instantly through a **warranty check** (menu **option 8**, which pushed About Us to option 9), backed by a customer-and-warranty database of 50 records.

### How a customer checks a warranty

A customer can either pick option 8, or simply paste a serial or invoice number at any point in the conversation — the system recognises the pattern and looks it up automatically, exactly as a delivery-order number triggers a delivery lookup. The lookup resolves in order of specificity: **serial number → invoice number → mobile → name**. On a single match it replies with the record:

```
Hi Mohamed Faizal 👋
📦 Product: ASUS Dual GeForce RTX 4060 8GB
🔢 Serial Number: SG26-ASU-0003-22173
🛡️ Warranty: 1 Year Onsite Warranty
✅ Status: Active
📅 Warranty Valid Until: 2027-04-04
1️⃣ Book an onsite service  2️⃣ Arrange a carry-in repair  3️⃣ Speak to our service team
```

### Integration with the other modules

The three options at the end are the key integration point: replying **1** starts the **onsite booking** flow, **2** starts the **carry-in booking** flow, and **3** escalates to the service team — so the warranty check flows straight into the booking modules built earlier, closing the loop from *"am I covered?"* to *"my repair is booked."* This reuse is deliberate: the warranty feature adds a new entry point without duplicating the service-scheduling logic.

### Data quality and honesty guardrails

The 50 records are **synthetic demo data** (fictional names, emails, and serials), so they are safe to seed and show. Two data-handling decisions reflect the project's "no wrong information" principle:

- **Format-tolerant serial matching.** The source serials include quirky formats such as `SG26-TP--0015-…` (a doubled dash). The lookup normalizes case, spaces, and repeated dashes, so a customer's `sg26-tp-0015-…` still matches — no failed lookups from formatting differences.
- **Read the real fields, never guess.** The reply is built from the stored status, expiry, and coverage, so it stays correct if Expired or Void records are added later; an unknown serial returns an honest "I couldn't find that" rather than a fabricated result. As with delivery status, a warranty record is only returned to a query that actually matches it — the system never lists other customers' records.

Warranty data lives in its own seeded **`warranty`** store collection, and the reply is fully localized (English, Bahasa Melayu, Chinese), while the product model, serial, and dates stay in English for clarity.

## 12. Conversational Commerce — Payment, Order and Delivery Journey

The project's most significant advance beyond a conventional enquiry bot is a complete **conversational commerce journey**: the WhatsApp conversation now carries the customer all the way from enquiry through recommendation, quotation, secure payment, order and invoice generation, and delivery tracking — the whole customer journey in one 24/7 digital channel. This reframes the system from "a chatbot that reduces phone enquiries" into a digital-transformation platform that moves enquiry → sales → payment → delivery online.

### The nine-step journey

1. **Enquiry** — the customer asks for something ("I need a gaming PC under $2,000", or "how much is a keyboard").
2. **Recommendation** — the assistant returns a numbered shortlist with prices and stock.
3. **Selection** — the customer picks by number or by name.
4. **Quotation** — the assistant issues a quotation with a quote reference (`Q-YYYYMMDD-NNN`), the line total, subtotal, and stock.
5. **Confirmation** — the customer types "confirm" / "proceed".
6. **Payment method** — the assistant offers **1. 💳 Pay by Card** and **2. 🏦 PayNow / SGQR**.
7. **Secure payment** — the chosen method returns a secure payment link (`/pay/<id>`); the customer opens the payment page and pays.
8. **Payment confirmation** — once the gateway confirms, the assistant replies in chat with **✅ Payment received**, the **Order** (`ORD-YYYYMMDD-NNN`), **Invoice** (`INV-YYYYMMDD-NNN`), amount paid, and status "Preparing Order".
9. **Delivery** — a **delivery order** (`DO-YYYYMMDD-NNN`) is created with an assigned driver and an estimated delivery window, immediately trackable through the existing Delivery Status feature (option 7).

The four references for a single purchase share the same daily running number — `Q-`, `ORD-`, `INV-`, and `DO-YYYYMMDD-NNN` — so a customer's quotation, order, invoice, and delivery are easy to cross-reference.

### The simulated payment gateway (a swappable edge)

Because this is a development and coursework build, payment is deliberately implemented as a **simulated gateway** rather than a live card processor. This is the same "swappable edge" pattern the project already uses for the WhatsApp channel (simulated sender versus cloud sender):

- With **`PAYMENT_MODE=simulated`** (the deployed default), the system generates a mock payment link and a test payment page. Completing the payment triggers a callback that settles the payment. No real gateway is contacted, no card is charged, and no payment secret is stored anywhere. The payment page states plainly that it is a demonstration payment.
- Switching to **`PAYMENT_MODE=live`** would swap in a real provider (for example Stripe, HitPay, or a bank PayNow integration) behind the same `payment.service` interface — a redirect plus a real gateway webhook — **without any change** to the order, invoice, or delivery logic.

### Honesty and integrity guardrails

The payment flow follows the same "people before technology / no wrong information" discipline as the rest of the system:

- **Nothing is marked paid on the customer's word.** A payment is only settled when the (simulated) gateway calls back; the customer typing "paid" does not create an order.
- **Order, invoice, and delivery records are created only after payment confirms**, never on confirmation of the quotation alone.
- **Amounts always come from the stored quotation**, never re-typed by the customer, so the paid amount always matches the quoted amount.
- **The gateway callback is idempotent** — completing the same payment twice does not create duplicate orders or invoices.

This closes the loop end-to-end: a purchase made entirely inside WhatsApp produces a real order, invoice, and delivery order, and that delivery is then trackable through the same option-7 lookup a customer would use for any other delivery — enquiry, sales, payment, and fulfilment unified in one conversational channel.

## 13. Multilingual Support (i18n)

The assistant is fully trilingual across English, Bahasa Melayu, and Chinese. Localization covers product lists, quotations (including the stock line), selection prompts, order confirmations, the full payment journey (payment-method choice, secure payment link, and the payment-received confirmation with order/invoice/delivery details), and every menu-option response including the "About Us" and Product Availability information. Two categories of text stay in English on purpose: **computer terms** (CPU, GPU, RAM, SSD, DDR5) and **postal addresses**, because translating those reduces rather than improves clarity for a technical purchase.

Language is handled two ways. First, **automatic detection** per message routes a Malay question such as a request for RAM prices to a Malay reply, and a Chinese question to a Chinese reply. Second, an **explicit language picker** — an un-numbered "Language" item below option 8, with its own button on the chat page — lets a customer choose their language directly. The picker is **numbered** for speed: it presents `1. English`, `2. 中文`, `3. Bahasa Melayu`, and accepts either the number **or** the language name/flag, so it works the same way as every other menu in the system. The explicit choice is **sticky**: once selected it wins over per-message auto-detection and carries through the whole conversation until the customer changes it. This was a deliberate decision — an explicit choice should not be silently overridden by a detector reading a single English brand name in an otherwise Malay message.

## 14. Image Recognition and the Honest Fallback

Customers sometimes photograph an item (a mouse, a keyboard) and send the picture asking for its price. The system routes image uploads to a vision provider that maps a recognition label to a catalogue category and then offers the matching priced shortlist, re-joining the normal guided sales flow.

At the time of writing, the underlying AI gateway used for vision is **rate-limited**, so live photo recognition is intermittent. Rather than fabricate a result — which would violate the project's core principle — the system degrades honestly: when it cannot confidently identify a photo, it presents a **numbered category picker** (Mouse, Keyboard, and so on) so the customer can pick the category and continue to a priced shortlist. This is the people-before-technology principle applied to a failure mode: an honest, useful fallback beats a confident wrong guess. The remaining work here is a quota reset or a dedicated vision API key; the code path and fallback are already in place.

## 15. Delivery Plan, Milestones and Team

The work was scoped into three one-week milestones (21 days total), each producing a usable increment.

- **Week 1 — Tested core (spec Tasks 1–5):** project scaffold with a Jest harness; the store abstraction with seeded FAQs; and three pure, unit-tested services — language detection, FAQ matching, and escalation — all verified by a single `npm test`. Success this week is measured by passing unit tests, with no UI or deployment expected yet.
- **Week 2 — Running app with UI (spec Tasks 6–12):** the webhook pipeline wired end-to-end and integration-tested; the swappable WhatsApp sender (simulated live, cloud stubbed); the Express app and server entry; the FAQ management API; the enquiries API; and the two browser pages (chat and dashboard).
- **Final week — Deployment and enhancements (spec Tasks 13–15):** deploy to the Lightsail Ubuntu server, run it as a background service, open the app port in the firewall, and verify reachability. Optional stretch goals were the real WhatsApp Business Cloud API and a smarter LLM/embedding FAQ matcher behind the same interface.

The team and their responsibilities were defined up front: **Alvin** as Project Owner (overall delivery, go-live sign-off, privacy and threshold decisions); **Noel** as Content Admin (owns the FAQ knowledge base, authors and approves answers in en/ms/zh); **Puay Sim** as Lead Sales Rep (triages and resolves escalated enquiries via the dashboard); and **Peter** as DevOps (owns the Lightsail server, deployment, firewall and port changes, SSH keys and secrets, OS patching).

## 16. Controls, Risks and Human Approval

The safety story is built into the design, not bolted on. The key risks and their controls:

- **Confident but wrong answer** → a FAQ confidence threshold below which the system always escalates, plus mandatory English answers for FAQs. Owner: Noel.
- **Wrong language detected** → a language-confidence default-to-English rule with the English fallback flagged for review. Owner: Alvin.
- **Outdated FAQ content** → an admin API with edit history and periodic content review. Owner: Noel.
- **Leaked secrets** → secrets kept in `.env`, never committed (enforced by `.gitignore`), the SSH key locked to owner-only permissions, and no secrets in enquiry records. Owner: Peter / Alvin.
- **PII over-collection** → store only what is needed to answer or escalate, sanitize input, no unnecessary retention. Owner: Alvin.
- **One enquiry error crashing the service** → per-enquiry error handling that escalates and logs rather than crashing, with raw errors never returned to callers. Owner: Alvin.
- **Message/prompt injection** → customer text treated as untrusted; the deterministic matcher is not manipulable; any LLM addition stays gated by the confidence-to-escalate rule and human review. Owner: Alvin.

Explicit **human approval points** were defined: go-live to the real WhatsApp channel requires the Project Owner's sign-off; FAQ publication and edits require the Content Admin's review; firewall or server changes require DevOps approval; every escalated enquiry is reviewed and closed by a rep with the resolver recorded; adding the LLM matcher requires proof it improves answers plus owner approval; and any customer complaint or sensitive case is always routed to a person, never auto-closed.

### Human-in-the-loop: the two-way reply console

The dashboard is not just a queue — it is a **live takeover console**, which is where the "people before technology" principle becomes tangible. When the bot escalates (a customer asks for a person, the bot is not confident, or a sensitive case arises), the enquiry appears as **pending** with its full conversation and the escalation reason. A rep opens it and can **reply to the customer directly**: the message is delivered through the same swappable sender the bot uses, and the customer sees it arrive in their chat thread as a clearly-labelled human reply within a few seconds. Sending the first reply moves the enquiry to **`in_progress`** and records which rep is handling it; when the matter is settled the rep marks it **resolved**, recording who and when.

This gives a clean, auditable handoff loop — bot → escalate → human takes over → reply → resolve — with the customer never left waiting silently and every human action attributed. Because the reply path uses the same `sender` interface, it works today in simulated mode (delivered via the chat's polling) and maps directly to a real WhatsApp send when the Cloud API is enabled, with no change to the console.

## 17. Success Measures

Success is measured against clear targets reviewed weekly:

- **Auto-answer rate:** from 0% (all manual today) toward 50–60% of common enquiries answered without a rep, counted from `auto_answered` versus total enquiries.
- **Correct-language reply rate:** at least 95% of replies in the customer's detected language (or a flagged English fallback).
- **Escalation accuracy:** 100% of low-confidence or human-requested enquiries escalated, with zero silent wrong guesses.
- **First-response time:** an instant auto-reply, with escalations acknowledged immediately.
- **Rep time saved:** the auto-answer count multiplied by the average handling time saved.
- **Test-suite health:** 100% of tests passing on every change.
- **Deployment reachability:** the chat page, dashboard, and webhook reachable at the server's public IP.

## 18. Testing and Verification

Testing is the earliest and most frequent signal of health. The suite uses **Jest** and **supertest**, and is run with a single `npm test`. It covers unit tests for language detection, FAQ matching, escalation, product search, quotation, delivery, i18n/language, image identification, the WhatsApp sender, and the menu, plus integration tests for the webhook, the enquiry and FAQ APIs, the end-to-end payment journey, the onsite and carry-in booking flows, the warranty lookup and service handoff, the numbered language picker and HOME/BACK navigation, the two-way rep reply console, and a smoke test.

The current verified state is **348 tests passing across 19 test suites**, including a dedicated end-to-end payment-journey suite (enquiry → quotation → confirm → payment method → secure link → simulated gateway callback → order/invoice/delivery creation → delivery tracking, with idempotency and honesty guardrails), a booking suite that drives both the onsite and carry-in flows through every step to a confirmed `OS-`/`CI-` booking, a warranty suite that verifies serial/invoice lookup (including format-tolerant matching) and the 1/2/3 service handoff, a navigation suite that verifies the numbered language picker and the universal HOME/BACK commands, and a rep-reply suite that verifies a rep's reply is delivered to the customer thread, marks the enquiry `in_progress`, is retrievable by the customer's poll, and does not corrupt the conversation state. The two hooks described earlier keep this green automatically: tests run on every source or test file save, and again after each completed spec task. Because services are pure and free of Express objects, their tests assert specific inputs against expected outputs directly, which is what makes early results meaningful and refactoring safe. A practical operational note learned during development: the JSON data files must be cleared before and after a test run, because concurrent processes touching the shared data files can otherwise produce false failures.

## 19. Deployment

The application is deployed to an **AWS Lightsail Ubuntu** instance at `52.77.234.193` and kept alive by **PM2** as a background service, so it survives restarts. It runs in `simulated` WhatsApp mode with the OpenClaw AI features enabled and the payment gateway in simulated mode (`WHATSAPP_MODE=simulated`, `USE_OPENCLAW=true`, `VISION_PROVIDER=openclaw`, `PAYMENT_MODE=simulated`, `PUBLIC_BASE_URL=http://52.77.234.193:3000`). Only the application port is opened in the Lightsail firewall, and SSH access is by key only. Deployment is a matter of copying changed files to the server and restarting the PM2 process; data can be reseeded by removing the relevant collection file before restart.

The live endpoints, all verified reachable, are:

- **Customer chat:** `http://52.77.234.193:3000/chat.html`
- **Rep dashboard:** `http://52.77.234.193:3000/dashboard.html`
- **Test payment page:** `http://52.77.234.193:3000/pay/<paymentId>` (generated per order during the payment journey)
- **Health check:** `http://52.77.234.193:3000/health` → returns `{"status":"ok"}`

A custom domain was considered and then reverted to avoid the domain fee, so the system stays on the public IP over HTTP — appropriate as demonstration evidence.

## 20. Results (Verified Figures)

The delivered, verified results are:

- **979 catalogue items** live (**829 components** + **150 DIY PC packages**), across **21 categories**, each stocked at **100 units** and shown with live availability.
- **60 seed delivery records** for the status-lookup feature, plus new delivery orders created automatically by completed purchases.
- **72 CPUs** loaded from the 2026 processor price list, powering natural-language processor queries.
- **348 tests passing across 19 suites.**
- **Human-in-the-loop two-way console** — a rep replies from the dashboard and the message appears live in the customer's chat; the enquiry moves to `in_progress` and is resolved with attribution — verified live end-to-end.
- **3 languages** fully supported (English, Bahasa Melayu, Chinese) across the entire customer experience, including the payment journey and the booking flows, with a **numbered language picker** (reply 1/2/3 or type the name).
- **Universal navigation** — `0`/`menu`/`home` returns to the main menu and `back` steps to the previous screen, working across every flow in all three languages, with one-tap Menu and Back buttons on the chat page.
- A **complete conversational commerce journey** — shortlist → select → quantity → quotation → confirm → secure (simulated) payment → order + invoice → delivery tracking — verified live end-to-end, producing matching `Q-`/`ORD-`/`INV-`/`DO-` references.
- **Two online booking journeys** — onsite (`OS-YYYYMMDD-NNN`, CONFIRMED) and carry-in (`CI-YYYYMMDD-NNN`, Awaiting Drop-Off) — verified live end-to-end, each a numbered multi-step flow available in all three languages.
- **Warranty check** over a **50-record** database — serial/invoice/name lookup with format-tolerant matching and a direct 1/2/3 handoff into the booking flows — verified live (e.g. `SG26-ASU-0003-22173`).
- **Five CSV exports** for records: components (829), PC packages (150), deliveries (60), warranty (50), and the test-suite summary (18).
- **Deployed live** on AWS Lightsail with the customer chat, rep dashboard, test payment page, and health endpoint all reachable.

## 21. Roadmap and Future Work

- **Real WhatsApp Business Cloud API** — swap the simulated sender for the cloud sender behind the same interface, with Meta webhook verification, after Project Owner sign-off.
- **Live payment gateway** — swap the simulated gateway for a real provider (Stripe, HitPay, or a bank PayNow integration) behind the same `payment.service` interface, adding the provider's redirect and webhook, with no change to the order/invoice/delivery logic. Go-live requires Project Owner sign-off and PCI-aware handling of any card data on the provider side.
- **Restore reliable image recognition** — provision a dedicated vision API key or a higher AI quota so photo-to-product identification works consistently; the fallback picker already keeps the feature usable in the meantime.
- **Smarter FAQ matching** — an LLM or embedding matcher behind the existing `match()` interface, added only where it measurably beats keyword matching and still gated by the confidence-to-escalate rule.
- **Authentication for the dashboard** — the demo assumes a single trusted rep; a production deployment would add rep login.
- **Managed database** — move the JSON store to SQLite or a managed database behind the same `store` interface as volume grows.

## 22. Conclusion

The project delivers a working, deployed **AI-powered WhatsApp conversational commerce platform** grounded in a single principle: people before technology. It answers the high-frequency, multilingual enquiries instantly and correctly, lets customers check live stock, carries them through the full digital sales journey — recommendation, quotation, secure payment, order and invoice, and delivery tracking — lets them **book onsite or carry-in repair appointments** directly in chat, and lets them **check warranty by serial number** with a direct handoff into those bookings, while still handing off to a human whenever it is uncertain — and when it does, a rep can take over the conversation live from a two-way dashboard console. Rather than merely reducing phone enquiries, it moves the entire customer journey — enquiry, sales, payment, delivery, warranty, and service booking — into a single 24/7 digital channel, with a human always able to step in. The deterministic core is pure and thoroughly tested (348 tests across 19 suites), the edges are swappable so the real WhatsApp API and a real payment gateway can be added without rewriting logic, and the whole system is live on AWS Lightsail with a customer chat, a rep dashboard, and working (simulated) payment and booking flows. The spec-driven build in Kiro — requirements, design, and tasks, reinforced by steering rules and test-running hooks — kept the implementation honest to the plan and the plan honest to the people it serves.
