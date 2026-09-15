# 25-Minute Demonstration Script — Spoken English
## AI-Powered WhatsApp Conversational Commerce Platform · Team ITE BIS Innovators

> **How to use this script.** Read the *"SAY"* lines aloud; do the *"DO"* actions on screen. Times are cumulative targets — if you fall behind, trim the words, not the demo. Total budget: **25:00**. Keep the customer chat (`http://52.77.234.193:3000/chat.html`) open; for the finale also open the dashboard (`/dashboard.html`) in a second window.
> Tip: type the exact commands shown in `code`. After each option, click **🏠 Menu** (or type `0`) to return to a clean menu before the next option.

---

## 0. Opening (0:00 – 1:30)

**SAY:**
"Hi, we are **Team ITE BIS Innovators**, and we're here to show you our project — an AI-powered assistant for **Managing WhatsApp Sales Enquiries** for a computer shop we call BIS Computer Services.

The problem is simple: a small sales team gets flooded with repetitive WhatsApp questions all day — prices, stock, delivery, warranty, 'where is my order' — in three different languages. Answering them by hand eats up the whole day, and after office hours, nobody replies at all, so sales are lost.

Our solution turns that WhatsApp line into a smart, 24/7 assistant that not only answers instantly, but takes the customer all the way through **enquiry, quotation, payment, delivery, warranty, and repair booking** — and when a human is needed, a real sales rep can step in live. It's deployed on the cloud on AWS Lightsail, it speaks English, Malay, and Chinese, and it's backed by 348 automated tests.

Let me show you the customer's view."

**DO:** Show the chat page with the welcome message and the numbered menu (options 1–9 plus Language).

**SAY:**
"This is what the customer sees on WhatsApp — a friendly welcome and a quick menu. They can tap a number, or just type naturally in their own words. Let's go through each option."

---

## 1. Option 1 — Computer Components (1:30 – 3:30)

**SAY:**
"Option 1 is our product catalogue — 829 components, from CPUs to graphics cards. The customer doesn't need to know exact names. Watch — I'll just type a normal question."

**DO:** Type `how much is a keyboard`

**SAY:**
"Instantly, the assistant gives a numbered shortlist of matching keyboards — each with its **price and live stock count**, '100 in stock'. This is the repetitive work that used to eat up a rep's day, now answered in under a second, 24/7.

Notice it's numbered, so the customer just replies with a number. Let me pick one and buy it."

**DO:** Type `1`  → then type `2`

**SAY:**
"I selected item one, it asked how many, I said two — and here's a proper **quotation**: item, unit price, quantity, stock, and subtotal, with a quote reference. Everything here — the price, the stock — comes from our approved catalogue data, never guessed. We'll come back to what 'confirm' does in a moment.

One more thing this option does well — natural language for tricky items like processors."

**DO:** Type `0` (menu), then type `Intel processor generation 14`

**SAY:**
"A customer wrote 'Intel processor generation 14' — not a model number. Our AI layer understands that means 14th-generation Intel, and returns the right processors from our 72-CPU price list. That's the hybrid design: AI for understanding language, but the actual prices always come from the database."

**DO:** Type `0` to return to menu.

---

## 2. Option 2 — DIY PC Package (3:30 – 5:30)

**SAY:**
"Option 2 is for customers who want a complete PC build rather than parts. Let me choose it."

**DO:** Type `2`

**SAY:**
"The assistant shows real PC packages by budget tier. Notice each one lists the components in brackets — CPU, motherboard, RAM, graphics, power supply — as a single bundle with one price. No 'a rep will get back to you' — the customer sees real builds immediately.

Let me select a build and get a full quotation."

**DO:** Type `1`  → then type `1`

**SAY:**
"I picked a package and a quantity of one. Now the quotation shows the full **'What's included'** breakdown — every component in the build. This is exactly the kind of detailed quote a rep used to type out by hand; now it's instant and consistent every time. From here the customer can confirm and pay — which I'll demonstrate fully in option five's payment journey."

**DO:** Type `0` to return to menu.

---

## 3. Option 3 — Carry-in Service (5:30 – 7:30)

**SAY:**
"Options 3 and 4 are repair services — and these are real **online bookings**, not just information. Option 3 is carry-in: the customer brings their device to our service centre. Let me book one."

**DO:** Type `3`

**SAY:**
"It asks for a preferred date — the next three available days, generated live."

**DO:** Type `2`

**SAY:**
"Now a time slot."

**DO:** Type `1`

**SAY:**
"Now the device type — laptop, desktop, printer, or other."

**DO:** Type `1`

**SAY:**
"And finally, describe the problem."

**DO:** Type `very slow performance`

**SAY:**
"And there's the confirmed booking — a reference number starting with **CI**, status 'Awaiting Drop-Off', with our service-centre address and hours, and the standard 30-dollar charge. The whole appointment was booked inside the chat, at any hour, with no phone call and no rep involved."

**DO:** Type `0` to return to menu.

---

## 4. Option 4 — Onsite Repair (7:30 – 9:30)

**SAY:**
"Option 4 is onsite repair — a technician comes to the customer. This one collects a bit more detail. Let me book it."

**DO:** Type `4`

**SAY:**
"First, the type of service — troubleshooting, hardware repair, or PC setup."

**DO:** Type `1`

**SAY:**
"Then a date, and a time slot."

**DO:** Type `1`  → then type `3`

**SAY:**
"And finally the customer's details — name, address, contact, and the problem — in one message."

**DO:** Type `Mr Tan, 10 Simei Ave 1 #02-01 S486570, 91234567, PC won't start`

**SAY:**
"And there's the confirmed appointment — a reference starting with **OS**, status 'Confirmed', with the 60-dollar onsite fee noted, and a promise that our technician will contact the customer before the visit. A nice touch: if a customer forgets to pick the menu and just types their address, the system recognises it's an address and starts this same booking automatically."

**DO:** Type `0` to return to menu.

---

## 5. Option 5 — Product Availability + the Payment Journey (9:30 – 13:30)

**SAY:**
"Option 5 is Product Availability — a quick way to check price and stock on any item. But I want to use this moment to show you the most powerful part of the whole platform: the **full commerce journey** — turning an enquiry into a paid order, entirely inside the chat.

Let me start a fresh purchase."

**DO:** Type `how much is a mouse` → type `1` → type `1`

**SAY:**
"So I've got a quotation for a mouse. Now — the customer types 'confirm'."

**DO:** Type `confirm`

**SAY:**
"Instead of 'a rep will call you', the assistant now offers **payment** — pay by card, or PayNow. Let me pay by card."

**DO:** Type `1`

**SAY:**
"It generates a **secure payment link**. In a real deployment this connects to a payment provider like Stripe or PayNow; for this demonstration it's a safe test gateway — no real money moves. Let me open the link."

**DO:** Click / open the `/pay/...` link in a new tab. Fill in delivery name and address. Click **Pay**.

**SAY:**
"I complete the payment on the secure page... and instantly the chat confirms: **payment received**, with an **order number**, an **invoice number**, the amount paid, and status 'Preparing Order'. It also creates a **delivery order** with a driver and an estimated delivery time.

Think about what just happened: enquiry, recommendation, quotation, payment, order, invoice, and delivery — the entire sale — completed in one WhatsApp conversation, at any time of day, with no staff involved. That's the digital transformation: the channel doesn't just answer questions, it closes sales 24/7."

**DO:** Return to the chat tab. Type `0` to return to menu.

---

## 6. Option 6 — Talk to Sales (human handoff intro) (13:30 – 14:30)

**SAY:**
"Option 6 is 'Talk to Sales' — the safety valve. At any time, a customer can ask for a real person."

**DO:** Type `6`

**SAY:**
"The assistant immediately acknowledges: 'noted, we'll get our sales personnel to contact you within 10 minutes' — in the customer's language. Behind the scenes, this raises the enquiry to our sales dashboard. I'll show you the full live human takeover at the end — it's one of our best features."

**DO:** Type `0` to return to menu.

---

## 7. Option 7 — Delivery Status (14:30 – 16:00)

**SAY:**
"Option 7 lets a customer check their delivery themselves — no more 'where is my order' phone calls jamming the hotline."

**DO:** Type `7`

**SAY:**
"It asks for an order number, a name, or a phone number. Let me enter an order number."

**DO:** Type `DO202600003`

**SAY:**
"And there it is — the current status, the driver's estimated arrival, the delivery window, the address, and the driver's contact. The customer self-serves in seconds. And remember the order we just paid for in option five? That created a live delivery order too — so a purchase made in chat is immediately trackable right here."

**DO:** Type `0` to return to menu.

---

## 8. Option 8 — Warranty Status (16:00 – 18:00)

**SAY:**
"Option 8 is warranty — a huge source of after-sales questions. The customer just needs their serial number. Let me check one."

**DO:** Type `8`  → then type `SG26-ASU-0003-22173`

**SAY:**
"Instantly, the assistant looks up the record and replies: the customer's name, the product — an ASUS RTX 4060 — the serial number, the warranty type, the status 'Active', and the exact expiry date. All from our warranty database of 50 records.

And here's the clever integration — it then offers to **book service directly**: option 1 for onsite, 2 for carry-in, or 3 to talk to our team. So a warranty check flows straight into a repair booking. Let me pick onsite."

**DO:** Type `1`

**SAY:**
"And we're straight into the onsite booking flow we saw earlier — 'am I covered?' becomes 'my repair is booked', all in one conversation. One more detail: our serial matching is forgiving of formatting, and if a serial isn't found, it says so honestly rather than guessing."

**DO:** Type `0` to return to menu.

---

## 9. Option 9 — About Us + Language (18:00 – 20:00)

**SAY:**
"Option 9 is About Us — who we are, our address, and our operating hours."

**DO:** Type `9`

**SAY:**
"Simple, clear company information. Now let me show you something important that runs across everything — **language**. Our customers write in English, Malay, and Chinese. Watch — I'll switch the whole assistant to Chinese."

**DO:** Type `language`  → then type `2`

**SAY:**
"I picked option 2 for Chinese. Now everything replies in Chinese. Let me ask a product question."

**DO:** Type `how much is a keyboard` (the reply comes back localized)

**SAY:**
"The whole experience — the shortlist, the prices, the prompts — is now in Chinese, while technical terms like CPU and the address stay in English for clarity. Malay works exactly the same way. And notice the navigation: a customer can type '0' or 'menu' to jump home, or 'back' to go one step back, from anywhere. That makes the assistant genuinely easy for everyone."

**DO:** Type `0` (or the English picker) to return to a clean English menu for the finale.

---

## 10. The Finale — Human-in-the-Loop Live Takeover (20:00 – 23:30)

**SAY:**
"Now the feature we're proudest of — because it proves our principle: **people before technology**. Automation handles the routine, but a real human can step into any conversation, live.

I have the customer chat on the left, and our sales rep's dashboard on the right."

**DO:** Arrange the customer chat and the dashboard side by side.

**SAY:**
"On the customer side, I'll ask for a person."

**DO:** In the chat, type `I want to speak to a person`

**SAY:**
"The customer gets an instant acknowledgement. Now, over on the dashboard, that enquiry has popped up as **pending**, with the full conversation and the reason it escalated. Our rep — let's say Puay Sim — opens it, reads the context, and replies directly."

**DO:** In the dashboard, open the pending enquiry, type a reply like `Hi! Puay Sim here from BIS. I can help with that right away.` and click **Send to customer**.

**SAY:**
"And watch the customer's chat — the rep's message appears **live**, as a human reply, right in the same conversation. The enquiry is now marked 'in progress' and assigned to that rep. When it's done, they mark it resolved, and it records who handled it.

So the bot absorbs the repetitive 70 percent of the work, and for the 30 percent that needs a human, the handoff is instant, seamless, and fully tracked. The customer never hits a wall; the rep is always one message away."

---

## 11. Results & Close (23:30 – 25:00)

**SAY:**
"To wrap up. What you've seen is a complete digital-transformation platform for a small computer shop:

- It answers instantly, **24/7**, in **three languages**.
- It carries the customer through the whole journey — enquiry, quotation, **payment, order, invoice, delivery, warranty, and repair booking**.
- It keeps a **human in the loop**, able to take over any conversation live.
- It's built on real innovation technology — an **AI Assistant** powered by OpenClaw, running on **AWS Lightsail** in the cloud, and built with a disciplined, tested workflow in **Kiro**.
- And it's proven: **979 catalogue items, 60 deliveries, 50 warranty records, and 348 automated tests across 19 suites**, deployed live.

The business value is direct: less manpower spent on repetitive typing, more revenue captured around the clock, faster and more consistent service — and the team freed to focus on selling.

We are Team ITE BIS Innovators. Thank you for watching, and we're happy to take your questions."

**DO:** Optionally show the health check `http://52.77.234.193:3000/health` returning `{"status":"ok"}` as final proof it's live.

---

## Timing Cheat-Sheet

| Segment | Target end |
|---|---|
| 0. Opening | 1:30 |
| 1. Option 1 — Components | 3:30 |
| 2. Option 2 — DIY PC | 5:30 |
| 3. Option 3 — Carry-in | 7:30 |
| 4. Option 4 — Onsite | 9:30 |
| 5. Option 5 — Availability + Payment | 13:30 |
| 6. Option 6 — Talk to Sales | 14:30 |
| 7. Option 7 — Delivery Status | 16:00 |
| 8. Option 8 — Warranty | 18:00 |
| 9. Option 9 — About Us + Language | 20:00 |
| 10. Human-in-the-Loop finale | 23:30 |
| 11. Results & close | 25:00 |

**If running long:** shorten the option 1 CPU natural-language sub-demo, the option 9 language demo, or the closing list. **Never cut** the option 5 payment journey or the finale — they are the strongest moments.

---

## Pre-Recording Checklist
- [ ] Server up: `http://52.77.234.193:3000/health` → `{"status":"ok"}`
- [ ] Customer chat open: `/chat.html`
- [ ] Dashboard open (for finale): `/dashboard.html`
- [ ] Two windows arranged side by side for the finale
- [ ] Browser zoom set so text is readable on video
- [ ] Do a dry run once to confirm timing and that the payment link opens
- [ ] Have this script on a second screen / printed
