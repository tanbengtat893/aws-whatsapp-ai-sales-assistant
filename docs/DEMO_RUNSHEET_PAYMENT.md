# Demo Run Sheet — Conversational Commerce Payment Journey

**System:** AI-Powered WhatsApp Conversational Commerce Platform — BIS Computer Services
**Live URL (customer chat):** http://52.77.234.193:3000/chat.html
**Rep dashboard:** http://52.77.234.193:3000/dashboard.html
**Health check:** http://52.77.234.193:3000/health → `{"status":"ok"}`
**Payment mode:** `simulated` (no real charge — a secure test gateway for demonstration)

This run sheet walks the whole enquiry → payment → delivery journey end to end. Follow it top to bottom on camera. Approximate time: **6–8 minutes** for the payment segment (fits inside the 30-minute overall video).

---

## 0. Before you start (30 seconds, off-camera)

1. Open the health check in a browser tab to confirm the server is up: `http://52.77.234.193:3000/health` should show `{"status":"ok"}`.
2. Open the customer chat: `http://52.77.234.193:3000/chat.html`.
3. (Optional) Open the rep dashboard in a second tab: `http://52.77.234.193:3000/dashboard.html`.
4. Have this run sheet on a second screen so you can read the lines to type.

> Tip: type the messages exactly as shown in the **"Type this"** column. The system accepts natural wording, but these lines are known-good.

---

## 1. The full happy path (main demo)

| Step | Type this in the chat | What the audience sees / what to say |
|------|-----------------------|--------------------------------------|
| 1. Enquiry | `how much is a keyboard` | A **numbered shortlist** of up to 5 keyboards, each with **price and "100 in stock"**. Say: "The bot recommends options with live stock, in the customer's language." |
| 2. Select | `1` | The bot confirms the item and asks **"How many units?"**. Say: "The customer selects by number — or could type the name loosely." |
| 3. Quantity | `2` | A **Quotation** appears: item, unit price, quantity, **Stock: 100 in stock**, subtotal, and "reply confirm". Point out the quote is built from stored prices, never guessed. |
| 4. Confirm | `confirm` | The bot replies **"your order is confirmed"** with a **quote number `Q-YYYYMMDD-001`** and offers **1. 💳 Pay by Card / 2. 🏦 PayNow / SGQR**. Say: "Here's the shift — confirming now moves the customer into payment." |
| 5. Choose method | `1` | The bot returns a **🔒 Secure Payment** message with the amount, the quote ref, and a **payment link** `http://52.77.234.193:3000/pay/...`. Say: "It generates a secure payment link. This is a simulated gateway for the demo — no real charge." |
| 6. Open the link | *(click the pay link, or copy it into a new browser tab)* | The **payment page** loads: amount, item, a card form (or a PayNow QR if you picked 2), and delivery name/address fields. |
| 7. Pay | On the page: fill **Delivery name** = `Demo Customer`, **Delivery address** = `1 Demo Street, Singapore 123456`, then click **Pay**. | The page shows **✅ Payment received** with the **Order**, **Invoice**, amount paid, and **Delivery** reference. |
| 8. Back to chat | *(return to the chat tab)* | The chat has a new **✅ Payment received** confirmation: **Order `ORD-...`**, **Invoice `INV-...`**, item × qty, amount paid, **Status: Preparing Order**, **Delivery `DO-...`**, driver + ETA, and how to track. Say: "Notice all four references share the same daily number." |
| 9. Track delivery | `7` then, on the next line, the `DO-...` number from step 8 (e.g. `DO-20260911-001`) | The **Delivery Status** reply shows status, ETA, delivery window, address, driver + contact, items, and order total. Say: "The order paid for in chat is instantly trackable through the same delivery lookup — the loop is closed." |

**Key line to say at the end:** *"Enquiry, recommendation, quotation, payment, order, invoice and delivery tracking — the entire customer journey, inside one WhatsApp conversation, 24/7."*

---

## 2. Optional variations (show if you have time)

### 2a. PayNow / SGQR instead of card
Repeat steps 1–4, then at step 5 type `2`. The pay page shows a **PayNow / SGQR** panel (a demo QR block) instead of a card form. Everything else is identical.

### 2b. Invalid payment choice (shows input validation)
After step 4 (the payment offer), type `9`. The bot replies: *"Please reply 1 for Card or 2 for PayNow / SGQR…"* and **stays on the payment step**. Then type `1` to continue. Say: "It won't proceed on an unclear choice."

### 2c. Another language (shows the journey is trilingual)
Start a fresh chat (reload the page). Type the un-numbered **Language** option, pick **中文**, then run the same flow (`how much is a keyboard` → `1` → `2` → `confirm` → `1`). The quotation, payment offer, payment link and confirmation all appear **in Chinese**, while computer terms and the address stay in English. The same works for **Bahasa Melayu**.

### 2d. Product Availability (option 5)
Type `5`. The bot invites the customer to name any item to check stock. Type e.g. `RTX 5070` — it shows the price and **units in stock**. Say: "Option 5 was renamed from Delivery & Payment to Product Availability, because delivery/payment overlapped with option 7."

---

## 3. Honesty points to mention on camera (important for grading)

State these plainly — they show engineering integrity, not weakness:

- **Simulated payment gateway.** Payment is a secure **test** gateway for this development/coursework build; it processes **no real money**. It is designed as a swappable edge, so a real provider (Stripe / HitPay / PayNow) can be added later behind the same interface **without changing** the order, invoice, or delivery logic.
- **Nothing is faked as paid.** An order, invoice, and delivery are created **only after** the gateway confirms payment — never on the customer merely saying "paid".
- **Amounts are trustworthy.** The paid amount always comes from the stored quotation, never re-typed, so quote and payment always match.
- **Idempotent.** Completing the same payment twice does not create duplicate orders.

---

## 4. If something goes wrong (quick recovery)

| Symptom | Fix |
|---------|-----|
| Chat shows a menu instead of continuing the flow | You may have reloaded mid-flow (state is per conversation). Restart from step 1. |
| The pay link 404s ("Payment not found") | The payment id is per order; use the exact link the bot just sent in step 5. |
| The confirmation didn't appear in chat | It is still returned on the pay page; you can also re-open the chat — the confirmation is recorded in the thread. |
| Server not responding | Check `http://52.77.234.193:3000/health`. If down, restart on the server: `pm2 restart whatsapp-sales`. |

---

## 5. One-line reference-number cheat sheet

For a single purchase, all four share the same daily running number `YYYYMMDD-NNN`:

- **Q-**`YYYYMMDD-NNN` — quotation
- **ORD-**`YYYYMMDD-NNN` — order
- **INV-**`YYYYMMDD-NNN` — invoice
- **DO-**`YYYYMMDD-NNN` — delivery order (trackable via option 7)

---

# Demo Run Sheet — Online Booking Journeys (Onsite & Carry-in)

This section covers the two repair-booking journeys. It complements the payment journey above and adds about **4–5 minutes** to the demo. Both flows are numbered, so the customer just replies with numbers.

## 6. Onsite Repair booking (menu option 4) → `OS-...`

| Step | Type this in the chat | What the audience sees / what to say |
|------|-----------------------|--------------------------------------|
| 1. Start | `4` | The bot opens the **Onsite Repair Booking** with a **service-type picker** (1. Onsite Troubleshooting / 2. Hardware Repair / 3. PC Setup & Installation) and the SGD 60 fee note. Say: "Option 4 is now a full booking, not just an acknowledgement." |
| 2. Service | `1` | The bot shows a **date picker** — the next 3 days, numbered and generated live. |
| 3. Date | `1` | The bot shows a **time-slot picker** (9–11, 11–1, 2–4, 4–6). |
| 4. Slot | `3` | The bot asks for **name, address, contact number, and problem** in one message. |
| 5. Details | `Mr Tan, 10 Simei Ave 1 #02-01 S486570, 91234567, PC won't start` | The bot replies **✅ Appointment confirmed** with a **Booking `OS-YYYYMMDD-001`**, the service, date, time, name, address, contact, problem, **Status: CONFIRMED**, and "our technician will contact you before the appointment." |

**Say at the end:** *"The customer booked an onsite technician visit end to end, in chat, and got a confirmed booking number."*

**Shortcut to show (optional):** start a fresh chat and type an address directly, e.g. `Blk 123 Bedok North Ave 1 #05-06 Singapore 460123`. The bot recognises it as an address, starts the onsite booking, and pre-fills it — then asks for the service type.

## 7. Carry-in Service booking (menu option 3) → `CI-...`

| Step | Type this in the chat | What the audience sees / what to say |
|------|-----------------------|--------------------------------------|
| 1. Start | `3` | The bot opens the **Carry-in Service** booking with a **date picker**. |
| 2. Date | `2` | The bot shows the **time-slot picker** (drop-off window). |
| 3. Slot | `1` | The bot shows a **device picker** (1. Laptop / 2. Desktop / 3. Printer / 4. Other). |
| 4. Device | `1` | The bot asks you to **describe the problem**. |
| 5. Problem | `very slow performance` | The bot replies **✅ Carry-in service booked** with a **Booking `CI-YYYYMMDD-001`**, device, problem, drop-off date + time, **Status: Awaiting Drop-Off**, the service-centre address and hours, and the SGD 30 charge / 1–2 working-day note. |

**Say at the end:** *"Two service types, two booking numbers — onsite is CONFIRMED, carry-in is Awaiting Drop-Off — both handled entirely in the chat."*

## 8. Optional booking variations

- **Invalid choice** — at any picker step, type a number out of range (e.g. `9`). The bot replies "that's not a valid choice" and **re-shows the same picker**. Then continue with a valid number. Say: "It won't proceed on an invalid selection."
- **Another language** — reload the chat, choose **中文** (or Bahasa Melayu) via the Language option, then run option `4`. The whole booking — service picker, dates, slots, confirmation — appears in that language, while "SGD" and the postal address stay in English.

## 9. Booking honesty points to mention on camera

- **A booking is only created after every step is complete** — the confirmed booking number appears only at the final step, never earlier.
- **The confirmation promises human follow-up** ("our technician will contact you" / "please bring your device to our service centre"), so the system never over-promises what it can do automatically.
- **Each booking notifies the service team** — a pending record is created so a rep acts on it, consistent with the people-before-technology principle.

## 10. Booking reference cheat sheet

- **OS-**`YYYYMMDD-NNN` — Onsite Repair booking (status: CONFIRMED)
- **CI-**`YYYYMMDD-NNN` — Carry-in Service booking (status: Awaiting Drop-Off)

Both share the same daily running-number style as the sales references (`Q-`/`ORD-`/`INV-`/`DO-`), so every appointment and order for a day is easy to cross-reference.
