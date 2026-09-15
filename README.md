# WhatsApp Sales Enquiries Assistant

A hybrid assistant that receives customer WhatsApp enquiries, detects the language
(English, Bahasa Melayu, Chinese), auto-answers frequently asked questions in that
language, and escalates anything uncertain to a human rep.

See the full spec in `.kiro/specs/whatsapp-sales-enquiries/`.

## Live demo & evidence (for reviewers)

Deployed and running on an AWS **Ubuntu** (Lightsail) instance, with AI reasoning via the **OpenClaw** gateway, built using the **Kiro** IDE (spec-driven).

- **Customer chat:** http://52.77.234.193:3000/chat.html
- **Rep dashboard:** http://52.77.234.193:3000/dashboard.html
- **Health check:** http://52.77.234.193:3000/health

Supporting material in this repo:
- **Main report:** `docs/COMPETITION_REPORT.md`
- **OpenClaw / Ubuntu setup & verification:** `OPENCLAW_SETUP.md`
- **Deployment steps:** `DEPLOY.md`
- **Screenshots (visual evidence):** `screenshots/evidence/`
- **Kiro spec-driven build:** `.kiro/specs/`, `.kiro/steering/`, `.kiro/hooks/`

> WhatsApp and payment run in **simulated** mode for the demo (secure test gateway — no CVV, no bank link, no real charge).

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
