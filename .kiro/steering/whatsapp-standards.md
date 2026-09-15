---
inclusion: manual
---

# Project Standards — WhatsApp Sales Enquiries Assistant

## Guiding Principle
People before technology. For every change, first state the human need it serves (a customer getting a clear answer in their language, or a rep saving repetitive effort). Introduce automation or AI only where it serves that need. When uncertain, escalate to a human rather than guess.

## Code Style (JavaScript)
- CommonJS (`require` / `module.exports`), no ES modules.
- `const` by default, `let` only when reassigning.
- Double quotes for strings; include semicolons.
- 4-space indentation.
- Arrow functions for callbacks.
- Keep services pure and free of Express request/response objects so they can be unit-tested directly.

## Multi-Language Rules
- Support `en`, `ms`, `zh`. Default to `en` when detection is uncertain.
- Store FAQ answers per language. If the detected language has no answer, fall back to `en` and mark the reply as a fallback.
- Never machine-translate a sensitive answer silently; if only English exists for a sensitive topic, prefer escalation.

## Service Patterns
- `language.service` returns `{ language, confidence }`.
- `faq.service` returns `{ matched, faqId, answer, confidence }`.
- `escalation.service` decides based on confidence thresholds and explicit "talk to a human" requests; it records why it escalated.

## Testing (results you can see early)
- Use **Jest** + **supertest**.
- Every service has unit tests; the webhook has an integration test.
- Tests must be runnable with a single `npm test` (no watch mode in automated runs).
- Write a test for each new behavior before or alongside the implementation of that behavior.

## API / Webhook
- Inbound: `POST /webhook` accepts `{ from, text }` (simulated) and returns the bot's reply for easy inspection.
- Validate and sanitize all inbound fields with express-validator.
- Do not expose raw errors to callers; log server-side.

## Security
- Parameterized queries / safe data access; sanitize user input.
- No secrets in the repo. Use `.env` (git-ignored) and `.env.example` for shape.
- Never commit `aws-credential/`.

## Git
- Do not commit `node_modules/`, `.env`, or credentials.
- Small, focused commits with clear messages. Commit only when the user asks.
