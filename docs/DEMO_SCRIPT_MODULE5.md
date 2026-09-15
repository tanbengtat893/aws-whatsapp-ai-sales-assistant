# Module 5 — Product Availability + Payment by Card
## Full Demonstration Script with Customer Simulation

> This is the complete Module 5 walkthrough: check stock → shortlist → select → quantity → quotation → confirm → **pay by card** → payment received. **SAY** = read aloud. **DO** = type/click on screen. *Customer says* / *Assistant replies* show the simulated conversation so you know exactly what will appear. Target time for this module: about **3 to 3.5 minutes**.
> Before you start: have the customer chat open, and be ready to open a second browser tab for the secure payment page.

---

### Step 0 — Introduce the module (SAY)

**SAY:**
"Now let me show you Module 5 — **Product Availability**. On the surface it lets a customer check the price and live stock of any item. But I'll use it to demonstrate the most powerful part of our whole platform — the **complete payment journey**. We'll take a customer from a simple question all the way to a **paid order, with an invoice and a delivery**, entirely inside the WhatsApp chat. Let me play the customer."

---

### Step 1 — Open Product Availability

**DO:** Tap the **Availability** button, or type `5`.

*Customer types:* **5**

*Assistant replies:*
> Sure! I can check live stock for any item. Just tell me the product you're interested in — for example "RTX 5070", "32GB DDR5 RAM", or "Intel Core i5". I'll show you the price and how many units we have in stock.

**SAY:**
"The assistant invites me to name any product, and promises to show the price **and the live stock**. Let me ask about a keyboard."

---

### Step 2 — Ask for a product

**DO:** Type `how much is a keyboard`

*Customer types:* **how much is a keyboard**

*Assistant replies:*
> Here's what I found:
> 1. Logitech K120 (Wired USB) — SGD 19 · 100 in stock
> 2. Dell KB216 (Wired USB) — SGD 25 · 100 in stock
> 3. Logitech K380 (Bluetooth) — SGD 49 · 100 in stock
> 4. Logitech K580 (Wireless) — SGD 69 · 100 in stock
> 5. Keychron B6 Pro (Ultra-slim Wireless) — SGD 70 · 100 in stock
> Reply with the number (1-5), or just type the item name — I'll prepare a quotation right away.

**SAY:**
"Instantly I get a numbered shortlist — five keyboards, each with its **price** and its **live stock count**, one hundred in stock. Every one of these prices comes straight from our approved catalogue, so it's always correct. I'll just reply with a number to pick one."

---

### Step 3 — Select an item

**DO:** Type `1`

*Customer types:* **1**

*Assistant replies:*
> You selected: Logitech K120 (Wired USB) — SGD 19.
> How many units would you like? (e.g. "2")
> (Reply 0 for the main menu, or "back" to go back a step.)

**SAY:**
"I selected the Logitech K120, and the assistant confirms my choice and asks how many I want. Notice it also reminds me I can type zero for the menu, or 'back' to go back a step — so the customer is never stuck. Let me order one."

---

### Step 4 — Enter the quantity → get the quotation

**DO:** Type `1`

*Customer types:* **1**

*Assistant replies (Quotation):*
> 🧾 Quotation
> Ref: Q-20260913-009
> Item: Logitech K120 (Wired USB)
> Unit price: SGD 19
> Quantity: 1
> Stock: 100 in stock
> Subtotal: SGD 19
> (Delivery is a flat SGD 5, free above SGD 80. Prices include GST where applicable.)
> Reply "confirm" to proceed and our sales team will finalise your order.

**SAY:**
"And here's a proper **quotation** — with its own quote reference, the item, the unit price, the quantity, the stock, and the subtotal, including the delivery and GST note. This is exactly the kind of quote a sales rep used to type out by hand; now it's instant and consistent. To go ahead, the customer simply types 'confirm'."

---

### Step 5 — Confirm → choose how to pay

**DO:** Type `confirm`

*Customer types:* **confirm**

*Assistant replies:*
> Great — your order is confirmed. ✅
> Quote Q-20260913-009 · Amount: SGD 19
> How would you like to pay?
> 1. 💳 Pay by Card
> 2. 🏦 PayNow / SGQR
> Reply with 1 or 2 to receive your secure payment link.

**SAY:**
"This is the exciting part. Instead of saying 'a rep will call you back', the assistant now takes payment right here. It offers two options — **Pay by Card**, or **PayNow / SGQR**. I'll choose option one, Pay by Card."

---

### Step 6 — Choose Pay by Card → receive the secure link

**DO:** Type `1`

*Customer types:* **1**

*Assistant replies:*
> 🔒 Secure Payment — Pay by Card
> Amount: SGD 19
> Quote: Q-20260913-009
> Tap the link below to complete your payment:
> http://52.77.234.193:3000/pay/pay_xxxxxxxx
> Once payment is received, I'll send your order and invoice details right here.
> (This is a secure test payment for demonstration — no real charge is made.)

**SAY:**
"The assistant sends me a **secure payment link**. I want to be clear and honest here — this is a **safe test payment gateway** built for the demonstration. In a real deployment it connects to a proper provider like Stripe or PayNow, but for today, no real money is charged. Let me open the payment link."

---

### Step 7 — Complete the payment on the secure page

**DO:** Copy the payment link, open it in a **new browser tab**. On the secure payment page, fill in:
- **Delivery name:** `Beng Tan`
- **Card number:** a sample number, e.g. `4242 4242 4242 4242`
- **Delivery address:** `10 Simei Ave 1 #02-01, Singapore 486570`

Then click **Pay**.

**SAY:**
"This opens the secure payment page. I enter my name, my card number — just a sample number for this test — and my delivery address, including the postal code. And I click **Pay**."

*The pay page shows:* **✅ Payment received** with the order, invoice, amount, and delivery references.

---

### Step 8 — Back in WhatsApp: the confirmation

**DO:** Switch back to the WhatsApp chat tab. The confirmation appears automatically.

*Assistant replies (in the chat):*
> ✅ Payment received. Thank you!
> Order: ORD-20260913-009
> Invoice: INV-20260913-009
> Item: Logitech K120 (Wired USB) × 1
> Amount Paid: SGD 19
> Status: Preparing Order
> 🚚 Delivery Order: DO-20260913-009
> Driver: Ravi Kumar (+65 9000 2003)
> Estimated delivery: 2026-09-13 15:16–17:16
> You can track your delivery anytime — reply "7" (Delivery Status) and enter DO-20260913-009.

**SAY:**
"And back in WhatsApp, the customer instantly gets a full confirmation — **payment received**, with an **order number**, an **invoice number**, the amount paid, and the status 'Preparing Order'. It even creates a **delivery order** and tells me the driver's name and the estimated delivery time.

Notice how everything ties together with matching reference numbers — the quote, the order, the invoice, and the delivery all share the same running number. And if there's ever a delay, I can simply reply with option 7 to track the delivery."

---

### Step 9 — Close the module (SAY)

**SAY:**
"So think about what just happened. In a single WhatsApp conversation — with no staff involved, at any time of the day or night — a customer went from a simple question, 'how much is a keyboard', all the way to a **paid order with an invoice and a scheduled delivery**. That is the heart of our digital transformation: the channel doesn't just answer questions — it closes sales, 24 by 7."

**DO:** Type `0` to return to the main menu, ready for the next module.

---

## Quick command sequence (cheat card for this module)

```
5
how much is a keyboard
1
1
confirm
1
→ open the /pay/... link in a new tab
→ fill name + card number + address → click Pay
→ switch back to chat to show the confirmation
0
```

## Notes for a smooth take
- The quote/order/invoice/delivery reference numbers change each run (e.g. `Q-20260913-009`) — that's normal; don't read the exact digits, just say "a quote reference / an order number".
- Do a dry run so the payment link opens quickly; have the second browser tab ready.
- If you prefer a live example that always has 5 options, use **keyboard** (as scripted). A **mouse** currently returns only one option.
- The "no real charge / test gateway" sentence is important — it shows honesty and keeps you credible.
