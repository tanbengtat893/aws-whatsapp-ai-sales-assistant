# Screenshots — Capture Index

This folder holds the evidence images referenced by **`docs/COMPETITION_REPORT.md`** (and reusable for the other docs).

The report refers to images as `../screenshots/<file>.png`. Save each PNG with the **exact filename** in the table below so the `[SCREENSHOT n]` tags line up. Capture everything from the live system at `http://52.77.234.193:3000` (chat.html and dashboard.html) unless noted.

## How to use

1. Capture each screenshot per the instruction.
2. Save it in this folder with the filename shown (all lowercase, `.png`).
3. In `COMPETITION_REPORT.md`, each `[SCREENSHOT n]` placeholder can be replaced with a normal Markdown image, e.g. `![Chat welcome + menu](../screenshots/01-welcome-menu.png)`.

## Capture list

| # | Filename | Section | What to capture |
|---|---|---|---|
| 1 | `01-welcome-menu.png` | Executive Summary | Chat welcome + full numbered menu (1–9 + language) |
| 2 | `02-before-after.png` | 1.5 Problem | "Before vs After" enquiry journey diagram (make in slides) |
| 3 | `03-product-availability.png` | 2.4 Service | Instant Product Availability / stock answer (menu 5) |
| 4 | `04-multilingual-reply.png` | 2.4 Service | Same answer/menu in 中文 or Bahasa Melayu |
| 5 | `05-dashboard-states.png` | 3.1 KPIs | Dashboard list: statuses + reference numbers |
| 6 | `06-payment-page.png` | 4.1 Feasibility | Simulated payment page — caption: no CVV, no bank, no real charge |
| 7 | `07-assign-rep.png` | 4.1 Feasibility | Dashboard: assign a rep to a pending enquiry |
| 8 | `08-rep-reply-customer.png` | 4.1 Feasibility | Rep reply reaching the customer (in_progress) |
| 9 | `09-booking-confirmation.png` | 4.2 Scalability | Service booking confirmation (OS-/CI- reference) |
| 10 | `10-delivery-warranty.png` | 4.2 Scalability | Delivery status (7) + warranty status (8) answers |
| 11 | `11-diy-pc-package.png` | 6.4 Process Flow | DIY PC package selection + "what's included" |
| 12 | `12-talk-to-sales-ack.png` | 6.4 Process Flow | "Talk to Sales" acknowledgement to the customer |
| 13 | `13-test-suite.png` | 7 Innovation Stack | `npm test` passing (348 tests / 19 suites) |
| 14 | `14-seed-data.png` | 9 Data Design | Slice of products.json / warranty.csv |
| 15 | `15-cpu-query.png` | 10.5 Modules | Natural-language CPU query results |
| 16 | `16-quotation.png` | 10.5 Modules | Itemised quotation with Q- reference |
| 17 | `17-payment-confirmation.png` | 11 Commerce | Payment confirmation with ORD / INV / DO |
| 18 | `18-warranty-lookup.png` | 12.2 Warranty | Warranty lookup with 1/2/3 service handoff |
| 19 | `19-language-picker.png` | 13 Multilingual | Numbered language picker + navigation hint |
| 20 | `20-two-way-console.png` | 14.3 Human-in-loop | Chat + dashboard side by side: rep reply in customer chat |
| 21 | `21-health-check.png` | 17 Deployment | `/health` → `{"status":"ok"}` + live chat/dashboard |

## Quick capture cues (chat commands)

- **5** → search a product (availability)
- **2** → DIY PC packages
- `language` → language picker; pick `2` (中文) or `3` (BM)
- **6** → Talk to Sales (escalation acknowledgement)
- **7** → then `DO202600003` (delivery status)
- **8** → then `SG26-ASU-0003-22173` (warranty lookup)
- **4** → onsite booking; **3** → carry-in booking
- `confirm` → `1` → `/pay` page → payment confirmation
- Dashboard: assign a rep, reply, resolve
