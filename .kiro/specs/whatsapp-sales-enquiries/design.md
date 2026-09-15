# Design — WhatsApp Sales Enquiries Assistant

## Overview

A hybrid assistant that receives customer WhatsApp enquiries, detects the language (English, Bahasa Melayu, Chinese), auto-answers frequently asked questions in that language, and escalates anything uncertain to a human rep. Reps use a dashboard to see enquiries and manage the FAQ answers the bot draws on.

The design keeps the **human-facing logic pure and testable** (language detection, FAQ matching, escalation decisions) and puts **swappable interfaces at the edges** (the WhatsApp sender and the data store). That way the system can be built and demonstrated with a simulated WhatsApp channel now, and switch to the real WhatsApp Business Cloud API later without touching the core logic.

Design principle: **people before technology.** The flow is built around what the customer and the rep need. Automation only shortcuts the repetitive, clearly-answerable cases; whenever confidence is low, the enquiry goes to a person.

## Architecture

```
                 (simulated chat page  |  real WhatsApp Cloud API)
                              |
                              v
                     POST /webhook  (inbound)
                              |
                     webhook.controller
                              |
                   +----------+-----------+
                   |   Enquiry pipeline    |
                   |  1. record enquiry    |
                   |  2. language.service  |  -> { language, confidence }
                   |  3. faq.service       |  -> { matched, answer, confidence }
                   |  4. escalation.service|  -> escalate? reason?
                   |  5. sender (reply)    |
                   +----------+-----------+
                              |
              +---------------+----------------+
              |                                |
        data store                        sender interface
   (enquiries, faqs, escalations)   simulated.sender | cloud.sender

   Rep dashboard  --->  dashboard.routes / faq.routes  --->  data store
```

### Layers
- **Routes** — HTTP surface: `/webhook`, dashboard pages, FAQ management API.
- **Controllers** — translate HTTP to/from the services; hold no business rules.
- **Services** — the testable core: `language`, `faq`, `escalation`. Pure functions of their inputs; no Express objects.
- **Edges** — `sender` (simulated/cloud) and `store` (JSON/SQLite now, DB later) behind interfaces.

## The enquiry pipeline (message flow)

1. **Receive & validate** — `POST /webhook` accepts `{ from, text }`. Missing `from` or `text` is rejected (Req 1.2). Text is sanitized (Req 1.3).
2. **Record** — persist the enquiry: `{ id, from, text, receivedAt, status: "received" }` (Req 1.1).
3. **Detect language** — `language.service.detect(text)` returns `{ language, confidence }`. Below threshold defaults to `en` (Req 2). Dominant language wins for mixed text.
4. **Match FAQ** — `faq.service.match(text, language)` returns `{ matched, faqId, answer, confidence }`. If matched answer is missing in the detected language, use the English answer and set `fallback: true` (Req 3.3).
5. **Decide** — `escalation.service.decide({ faqMatch, text })`:
   - explicit "talk to a human" phrase in any supported language → escalate (Req 4.2)
   - no FAQ at/above threshold → escalate (Req 4.1)
   - otherwise → auto-answer
6. **Respond** — `sender.send(to, message)`:
   - auto-answer path: send the FAQ answer; record match, language, confidence, `autoAnswered: true` (Req 3.4)
   - escalation path: send a localized acknowledgement, mark enquiry `pending`, create an escalation record with the reason (Req 4.3, 4.4)
7. **Return** — the webhook response echoes the bot's reply so it can be inspected directly (Req 8.2).

## Data model

Stored via the `store` abstraction. Shapes:

### Enquiry
```
{
  id: string,
  from: string,              // customer identifier / phone (simulated: any id)
  text: string,             // sanitized original message
  language: "en"|"ms"|"zh",
  languageConfidence: number,
  status: "auto_answered" | "pending" | "resolved",
  matchedFaqId: string | null,
  matchConfidence: number,
  fallbackLanguageUsed: boolean,
  receivedAt: ISO8601,
  resolvedAt: ISO8601 | null,
  resolvedBy: string | null
}
```

### FAQ
```
{
  id: string,
  intent: string,                 // short label, e.g. "delivery_charges"
  keywords: {                     // matching hints per language
    en: string[], ms: string[], zh: string[]
  },
  answers: {                      // en is required (Req 6.3)
    en: string, ms?: string, zh?: string
  },
  updatedAt: ISO8601
}
```

### Escalation
```
{
  id: string,
  enquiryId: string,
  reason: "low_confidence" | "human_requested",
  createdAt: ISO8601,
  status: "pending" | "resolved"
}
```

## Language detection

- Start with a library (`franc`/`eld`) constrained to the three supported languages plus a threshold.
- Chinese is script-detectable (Han characters); English vs Bahasa Melayu is handled by the library plus a small keyword boost list.
- Output `{ language, confidence }`. Confidence below `LANG_MIN_CONFIDENCE` → default `en` (Req 2.2).
- The service is pure, so tests assert specific inputs → expected language (Req 8.1).

## FAQ matching

- v1: keyword/intent matching per language using the FAQ `keywords`, producing a normalized confidence (e.g. proportion of matched keywords / presence of intent terms).
- Threshold `FAQ_MIN_CONFIDENCE` decides auto-answer vs escalate.
- Interface is designed so a smarter matcher (embedding/LLM via the openclaw-gateway) can replace the v1 matcher later behind the same `match()` signature — added only if it demonstrably improves answers.

## Escalation logic

- `human_requested`: message contains an explicit request for a person (phrase list per language, e.g. EN "talk to a person/agent", MS "cakap dengan orang/ejen", ZH equivalents).
- `low_confidence`: no FAQ match at/above `FAQ_MIN_CONFIDENCE`.
- On escalation, the customer receives a localized acknowledgement; the enquiry becomes `pending` and an escalation record captures the reason.

## WhatsApp integration (swappable)

`sender` interface: `send(to, message) -> Promise<{ delivered, channel }>`.
- `simulated.sender` records outbound messages in memory/store and returns them in the webhook response; the browser chat page reads them. No external calls (Req 7.1).
- `cloud.sender` (phase 2) calls the WhatsApp Business Cloud API and implements Meta webhook verification. Selected by `WHATSAPP_MODE=cloud` (Req 7.2). No change to language/FAQ/escalation logic (Req 7.3).

## API surface

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/webhook` | Inbound enquiry `{ from, text }`; returns bot reply (Req 1, 8.2) |
| GET | `/api/enquiries` | List enquiries for the dashboard (Req 5.1) |
| GET | `/api/enquiries/:id` | Enquiry detail incl. escalation reason (Req 5.2) |
| POST | `/api/enquiries/:id/resolve` | Mark escalated enquiry resolved (Req 5.3) |
| GET | `/api/faqs` | List FAQs |
| POST | `/api/faqs` | Create FAQ (English answer required) (Req 6.1, 6.3) |
| PUT | `/api/faqs/:id` | Edit FAQ answers (Req 6.2) |
| GET | `/` , `/chat` | Simulated chat page (Req 8.3) |
| GET | `/dashboard` | Rep dashboard (Req 5, 8.3) |

## Configuration

| Variable | Default | Purpose |
|----------|---------|---------|
| PORT | 3000 | Server port |
| DATA_DIR | ./data | JSON/SQLite store location |
| WHATSAPP_MODE | simulated | `simulated` or `cloud` |
| LANG_MIN_CONFIDENCE | 0.5 | Below this, default to English |
| FAQ_MIN_CONFIDENCE | 0.6 | Below this, escalate |

## Error handling

- Validation failures at the webhook return a 400 without creating a record (Req 1.2).
- An error while answering one enquiry is caught, logged server-side, and results in an escalation (safe fallback) rather than a crash (Non-Functional: reliability, humane fallback).
- Raw errors are never returned to callers.

## Testing strategy (visible results)

- **Unit** — `language.service` (en/ms/zh + low-confidence default), `faq.service` (match, language fallback), `escalation.service` (low confidence, human requested).
- **Integration** — `POST /webhook` with supertest: an English pricing question returns the pricing answer; a Malay message returns a Malay reply; an unknown question escalates and acknowledges.
- All runnable via a single `npm test` (Req 8.1).

## Traceability

| Requirement | Design element |
|-------------|----------------|
| 1 Receive | `/webhook`, validation, enquiry record |
| 2 Language | `language.service`, thresholds |
| 3 Auto-answer | `faq.service`, fallback rule, reply record |
| 4 Escalation | `escalation.service`, escalation record, ack |
| 5 Dashboard | enquiries API + dashboard page |
| 6 FAQ mgmt | faqs API, English-required validation |
| 7 Swappable WhatsApp | `sender` interface + simulated/cloud |
| 8 Visible results | tests, webhook echo, browser pages |
