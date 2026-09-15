# Implementation Plan — WhatsApp Sales Enquiries Assistant

Tasks are ordered so you see results as early as possible: pure, testable core logic first (`npm test`), then the HTTP layer (inspect JSON replies), then the browser UI. Each task lists the requirements it satisfies. Check tasks off as they are completed.

- [ ] 1. Scaffold the project and test harness
  - Create `whatsapp-sales/` (in the new project home) with `package.json`, `src/`, `tests/`, `public/`.
  - Install express, express-validator, jest, supertest, a language-detection library, dotenv.
  - Add `npm test` (jest, single run) and `npm start` scripts; add `.env.example` and `.gitignore`.
  - Add a trivial passing test to confirm the harness runs.
  - _Requirements: 8.1_

- [ ] 2. Define the data store abstraction and seed FAQs
  - [ ] 2.1 Implement `src/data/store.js` with a JSON-file (or SQLite) backend behind a small interface (create/get/list/update for enquiries, faqs, escalations).
    - _Requirements: 1.1, 5.1, 6.2_
  - [ ] 2.2 Create `src/data/seed/faqs.json` with starter FAQs (availability, pricing, delivery charges, operating hours), each with `en`/`ms`/`zh` keywords and answers.
    - _Requirements: 3.1, 3.3, 6.1_

- [ ] 3. Implement language detection (pure, tested)
  - Implement `src/services/language.service.js` → `detect(text)` returns `{ language, confidence }` limited to en/ms/zh, defaulting to `en` below `LANG_MIN_CONFIDENCE`.
  - Unit tests: clear English, clear Bahasa Melayu, clear Chinese, and a low-confidence/short input defaulting to English; dominant language for mixed text.
  - _Requirements: 2.1, 2.2, 2.3, 8.1_

- [ ] 4. Implement FAQ matching (pure, tested)
  - Implement `src/services/faq.service.js` → `match(text, language)` returns `{ matched, faqId, answer, confidence, fallbackLanguageUsed }`.
  - Apply English fallback when the matched FAQ lacks the detected language.
  - Unit tests: matched pricing question returns pricing answer; Malay match returns Malay answer; matched FAQ missing `zh` falls back to English and flags it; unrelated text returns `matched: false`.
  - _Requirements: 3.1, 3.2, 3.3, 8.1_

- [ ] 5. Implement escalation decision (pure, tested)
  - Implement `src/services/escalation.service.js` → `decide({ faqMatch, text, language })` returning `{ escalate, reason }`.
  - Rules: explicit human request (phrase lists per language) → `human_requested`; no confident FAQ match → `low_confidence`.
  - Unit tests: low-confidence match escalates; explicit "talk to a person" (en/ms/zh) escalates even with a match; confident match does not escalate.
  - _Requirements: 4.1, 4.2, 8.1_

- [ ] 6. Implement the WhatsApp sender interface
  - [ ] 6.1 Define `src/services/whatsapp/sender.js` interface and `simulated.sender.js` that records outbound messages and returns them.
    - _Requirements: 7.1_
  - [ ] 6.2 Add a `cloud.sender.js` stub (throws "not configured") selected when `WHATSAPP_MODE=cloud`, so the seam exists without needing the real API yet.
    - _Requirements: 7.2, 7.3_

- [ ] 7. Wire the enquiry pipeline in the webhook (integration-tested)
  - Implement `src/controllers/webhook.controller.js` and `src/routes/webhook.routes.js` for `POST /webhook`.
  - Validate `{ from, text }` (reject if missing), sanitize, record enquiry, run detect → match → decide → send, persist outcome, and return the bot reply in the response.
  - On escalation, send a localized acknowledgement, set enquiry `pending`, create an escalation record.
  - Integration tests (supertest): English pricing → pricing answer; Malay message → Malay reply; unknown question → escalation + acknowledgement; missing field → 400 and no record.
  - _Requirements: 1.1, 1.2, 1.3, 3.4, 4.3, 4.4, 8.2_

- [ ] 8. Build the Express app and server entry
  - Implement `src/app.js` (middleware, route mounting, error handler that logs server-side and escalates on failure) and `src/server.js` (start on `PORT`).
  - Confirm `npm start` boots and `POST /webhook` works via curl/REST.
  - _Requirements: 8.2, Non-Functional: reliability_

- [ ] 9. FAQ management API
  - Implement `src/controllers/faq.controller.js` and `src/routes/faq.routes.js`: `GET /api/faqs`, `POST /api/faqs` (English answer required, else 400), `PUT /api/faqs/:id`.
  - Tests: create with en/ms/zh succeeds; create without English is rejected; edit updates the answer used by subsequent enquiries.
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 10. Enquiries API for the dashboard
  - Implement `src/controllers/enquiry.controller.js` and routes: `GET /api/enquiries` (status, language, timestamp), `GET /api/enquiries/:id` (detail incl. escalation reason), `POST /api/enquiries/:id/resolve`.
  - Tests: list returns recorded enquiries with status; resolve updates status and records who resolved it.
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 11. Simulated chat page (browser result)
  - Add `public/chat.html`: a minimal chat UI that posts to `/webhook` and shows the bot reply, so a customer conversation can be demonstrated in the browser.
  - _Requirements: 8.3, 7.1_

- [ ] 12. Rep dashboard page (browser result)
  - Add `public/dashboard.html`: lists enquiries, highlights pending/escalated, opens detail, and resolves an enquiry via the API.
  - _Requirements: 5.1, 5.2, 5.3, 8.3_

- [ ] 13. Deploy to the Lightsail server
  - Copy the app to the server, `npm install`, start it (background/service), open the chosen port in the Lightsail firewall.
  - Verify the chat page and dashboard load at `http://52.77.234.193:<port>` and the webhook responds.
  - _Requirements: 8.2, 8.3_

- [ ] 14. (Optional, later) Real WhatsApp Business Cloud API
  - Implement `cloud.sender.js` and Meta webhook verification; set `WHATSAPP_MODE=cloud`.
  - Confirm no changes were needed in language/FAQ/escalation logic.
  - _Requirements: 7.2, 7.3_

- [ ] 15. (Optional, later) Smarter answering behind the same interface
  - If keyword matching proves insufficient, add an LLM/embedding matcher (e.g. via the openclaw-gateway) behind `faq.service.match()`, added only where it measurably improves answers.
  - _Requirements: 3.1, 3.2 (people-before-technology principle)_
