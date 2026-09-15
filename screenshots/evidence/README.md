# Evidence Screenshots

Real screenshots captured from the working WhatsApp Sales Assistant, grouped by feature. These support the claims in `docs/COMPETITION_REPORT.md`.

## Live system (for hands-on checking)

The application is deployed and running on an AWS **Ubuntu** (Lightsail) instance. Reviewers can try it directly:

- **Customer chat:** http://52.77.234.193:3000/chat.html
- **Rep dashboard:** http://52.77.234.193:3000/dashboard.html
- **Health check:** http://52.77.234.193:3000/health

> Note: WhatsApp and payment run in **simulated** mode for the demo (secure test gateway, no CVV, no bank link, no real charge). The AI layer uses the OpenClaw gateway on the instance (see `../../OPENCLAW_SETUP.md`).

## What the images show

- **Main menu & languages** — `Chat-Mainmenu.png`, `mainmenu-3languageselection.jpg`, `Mainscreen-languageselectionoption-*.jpg`, `language-*` (English / 中文 / Bahasa Melayu)
- **Option 1 — Components / sales & quotation** — `Option1-*` (keyboard & RAM price lists, quotation, confirmed order)
- **Option 2 — DIY PC packages** — `Option2-*` (selection, quotation, talk-to-sales)
- **Option 3 — Carry-in service booking** — `Option3-*`, `new/Option3/*` (date, time, device, confirmed booking)
- **Option 4 — On-site service booking** — `option4-*`, `new/option4-*` (step-by-step selection, confirmation)
- **Option 5 — Product availability** — `option5-*`
- **Option 6 — Talk to Sales (escalation)** — `Option6-Talk toSales.png`, `Option2-prefer talk to sales.png`
- **Option 7 — Delivery status** — `new/Option 7/*` (enter DO number, delivery status)
- **Option 8 — Warranty & About Us** — `new/Option 8/*`, `Option8-*`
- **Payment journey** — `new/Option1/1-3..1-5`, `new/*payment*`, `new/*paynow*`, `new/do_invoice.jpg` (card / PayNow, secure link, payment received, order + delivery order + invoice)
- **Human-in-the-loop** — `new/Mainscreen/human-in-the-loop.png`
- **Validation** — `InvalidOption-10Sep2026.jpg` (invalid choice re-prompt)

The `new/` subfolder contains the most recent, higher-resolution captures.
