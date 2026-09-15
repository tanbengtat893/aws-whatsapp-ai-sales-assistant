---
inclusion: manual
---

# Project Structure — WhatsApp Sales Enquiries Assistant

Proposed layout (created during the development phase, not yet on disk):

```
whatsapp-sales/
├── package.json
├── .env.example                 # sample config, no real secrets
├── src/
│   ├── server.js                # entry point: Express app + start
│   ├── app.js                   # Express app wiring (middleware, routes)
│   ├── config/
│   │   └── config.js            # reads env vars, defaults
│   ├── routes/
│   │   ├── webhook.routes.js     # inbound message webhook
│   │   ├── dashboard.routes.js   # rep-facing pages
│   │   └── faq.routes.js         # FAQ management API
│   ├── controllers/
│   │   ├── webhook.controller.js
│   │   ├── enquiry.controller.js
│   │   └── faq.controller.js
│   ├── services/
│   │   ├── language.service.js    # detect en/ms/zh
│   │   ├── faq.service.js         # match question -> answer (per language)
│   │   ├── escalation.service.js  # decide + record escalations
│   │   └── whatsapp/
│   │       ├── sender.js          # interface
│   │       ├── simulated.sender.js
│   │       └── cloud.sender.js    # phase 2
│   ├── data/
│   │   ├── store.js               # data-access abstraction
│   │   └── seed/faqs.json         # seed FAQs in en/ms/zh
│   └── models/
│       ├── enquiry.model.js
│       └── faq.model.js
├── public/                       # simulated chat UI + dashboard assets
│   ├── chat.html
│   └── dashboard.html
└── tests/
    ├── language.service.test.js
    ├── faq.service.test.js
    ├── escalation.service.test.js
    └── webhook.integration.test.js
```

## Architecture Pattern
- **Layered**: routes → controllers → services → data store.
- **Services hold the human-facing logic** (detect language, find the right answer, decide to escalate). They are pure and testable, which is what makes early `npm test` results meaningful.
- **Interfaces at the edges** (WhatsApp sender, data store) so the simulated pieces can be replaced by real ones without rewriting logic.

## Naming Conventions
- File names: lowercase with dots (e.g. `faq.service.js`).
- Functions/variables: camelCase.
- Constructors/classes: PascalCase.
- Route paths: lowercase with hyphens.

## Key Patterns
- Language codes use ISO short forms: `en`, `ms`, `zh`.
- Every auto-answer records: detected language, matched FAQ (or none), confidence, and whether it escalated.
- Escalation is the safe default when confidence is low.
