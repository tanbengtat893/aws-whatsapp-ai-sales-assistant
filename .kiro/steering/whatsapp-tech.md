---
inclusion: manual
---

# Tech Stack — WhatsApp Sales Enquiries Assistant

## Runtime
- **Node.js** (v24 available on the Lightsail server) with **Express 4.x**
- Plain JavaScript, CommonJS modules (`require` / `module.exports`) — consistent with the existing workspace conventions

## Key Libraries
| Library | Purpose |
|---------|---------|
| express | Web framework, webhook endpoint, dashboard routes, REST API |
| body-parser (or express.json) | Parse incoming JSON webhook payloads |
| express-validator | Validate/sanitize inbound data |
| jest | Test runner (unit + integration) for early, visible results |
| supertest | HTTP-level testing of Express endpoints |
| franc / eld (language detection) | Detect en / ms / zh from message text |
| dotenv | Local configuration (no secrets committed) |

Notes:
- A datastore is needed for FAQs, enquiries, and escalations. Start with a simple **JSON file store or SQLite** for zero-setup demoing; the data-access layer is abstracted so it can move to MySQL/DynamoDB later without touching business logic.
- Language detection starts rule-based/library-based. Any heavier AI/LLM answering (e.g. via the openclaw-gateway) is optional and added only behind the same "answer provider" interface, so the core works without it.

## WhatsApp Integration
- **Phase 1 (simulated):** an inbound webhook `POST /webhook` accepts `{ from, text }`; an outbound "sender" is a stub that records what would be sent. A minimal browser chat page posts to the webhook so you can converse with the bot.
- **Phase 2 (real):** implement the WhatsApp Business Cloud API sender and Meta webhook verification behind the same interfaces. No business-logic changes required.

## Multi-Language
- Detect language per inbound message (default English when uncertain).
- FAQ answers are stored per language (en / ms / zh). If an answer is missing in the detected language, fall back to English and flag it.

## How Results Are Seen
1. `npm test` — unit/integration tests (earliest signal).
2. `curl`/REST against the running server — inspect JSON replies.
3. Browser — simulated chat page + rep dashboard at `http://<server-ip>:<port>`.

## Common Commands
```bash
npm install          # install dependencies
npm test             # run Jest tests (single run)
npm start            # start the Express server
```

## Environment Variables
| Variable | Description |
|----------|-------------|
| PORT | Server port (default 3000) |
| DATA_DIR | Location of the JSON/SQLite data store |
| WHATSAPP_MODE | `simulated` (default) or `cloud` |

## Constraints
- Do not commit secrets, tokens, or the `aws-credential/` directory.
- Long-running processes (the dev server) are started by the user or as a background process, never as a blocking command.
