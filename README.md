# WhatsApp Sales Enquiries Assistant

A hybrid assistant that receives customer WhatsApp enquiries, detects the language
(English, Bahasa Melayu, Chinese), auto-answers frequently asked questions in that
language, and escalates anything uncertain to a human rep.

See the full spec in `../.kiro/specs/whatsapp-sales-enquiries/`.

## Getting started

```bash
npm install          # install dependencies
cp .env.example .env # create your local config (use `copy` on Windows)
npm test             # run the test suite
npm start            # start the server (default http://localhost:3000)
```

## Project layout

```
whatsapp-sales/
  src/
    controllers/   # translate HTTP <-> services (no business rules)
    routes/        # HTTP surface: /webhook, dashboard, FAQ API
    services/      # testable core: language, faq, escalation
      whatsapp/    # swappable sender interface (simulated | cloud)
    data/          # store abstraction + seed data
  tests/           # unit + integration tests (jest, supertest)
  public/          # browser pages: chat + dashboard
  data/            # runtime JSON store (gitignored)
```

## Configuration

| Variable | Default | Purpose |
|----------|---------|---------|
| PORT | 3000 | Server port |
| DATA_DIR | ./data | JSON/SQLite store location |
| WHATSAPP_MODE | simulated | `simulated` or `cloud` |
| LANG_MIN_CONFIDENCE | 0.5 | Below this, default to English |
| FAQ_MIN_CONFIDENCE | 0.6 | Below this, escalate |
