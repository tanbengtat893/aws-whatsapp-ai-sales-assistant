# 25-Minute Demonstration Script (Polished, Module by Module)
## AI-Powered WhatsApp Assistant · Team ITE BIS Innovators

> Read the **SAY** lines aloud in your own pace; do the **DO** actions on screen. Times are cumulative targets. Before recording: clear the dashboard history, and keep the customer chat (`/chat.html`) open, plus the dashboard (`/dashboard.html`) ready for the human-in-the-loop part. After each module, tap **🏠 Menu** (or type `0`) to return to a clean menu.

---

## Opening (0:00 – 1:45)

**SAY:**
"Hi, I'm Beng Tan, and we are **Team ITE BIS Innovators**. Today we're excited to show you our project — an **AI-powered assistant for managing WhatsApp sales enquiries** for a computer shop we call BIS Computer Services.

Here's the problem. Every day, a small sales team gets flooded with the same repetitive questions — prices, PC packages, delivery, repair service, warranty, product availability, 'where is my order', and 'can I talk to someone'. During peak hours, customers wait and wait, and often can't get through. And after office hours, nobody replies at all — so those sales are simply lost.

Our solution turns the WhatsApp line into a **smart, 24-by-7 assistant** in **three languages — English, Malay, and Chinese**. It doesn't just answer instantly; it takes the customer all the way through **enquiry, quotation, payment, delivery tracking, warranty checking, and repair booking**. And when a real person is needed, we have a powerful feature called **Human-in-the-Loop** — a live sales rep can step straight into the conversation. It's deployed on the cloud on AWS Lightsail, and it's backed by hundreds of automated tests. Let me show you the customer's view."

**DO:** Show the chat welcome screen + numbered menu.

**SAY:**
"This is what the customer sees on WhatsApp — a friendly welcome and a quick menu. They can **type the number**, or simply **tap the button** — whichever is easier. And they can always tap **Menu** to come home, or **Back** to go one step back. It's very user-friendly. Let me walk you through each module."

---

## Module 1 — Computer Components (1:45 – 3:45)

**SAY:**
"Module 1 is our product catalogue. The customer doesn't need to know exact model names — they can just ask naturally. Watch."

**DO:** Type `how much is a keyboard`

**SAY:**
"Instantly, the assistant returns a numbered shortlist of keyboards — each with its **price and its live stock count**, '100 in stock'. This is the repetitive work that used to eat up the whole day, now answered in under a second. The customer just replies with a number. Let me buy one."

**DO:** Type `1` → then `2`

**SAY:**
"I picked item one, quantity two, and here's a proper **quotation** — item, price, quantity, stock, and subtotal. Every price and stock figure comes from our approved catalogue, never guessed. And it also understands tricky natural language — for example, processors."

**DO:** Type `0`, then `Intel processor generation 14`

**SAY:**
"The customer wrote 'generation 14' — not a model number. The AI understands that means 14th-generation Intel and returns the right processors. That's our hybrid design: AI understands the language, but the prices always come from the database."

**DO:** Type `0` to return to the menu.

---

## Module 2 — DIY PC Package (3:45 – 5:15)

**SAY:**
"Module 2 is for customers who want a complete PC build instead of parts. Let me choose it."

**DO:** Type `2`

**SAY:**
"The assistant shows ready-made PC packages by budget. Notice each one lists its components in brackets — CPU, motherboard, RAM, graphics, power supply — as one bundle at a single price. Let me select one."

**DO:** Type `1` → then `1`

**SAY:**
"And now the quotation shows the full **'What's included'** breakdown — every component in the build. This is exactly the detailed quote a rep used to type out by hand; now it's instant and consistent every time."

**DO:** Type `0` to return to the menu.

---

## Module 3 — Carry-in Service (5:15 – 6:45)

**SAY:**
"Modules 3 and 4 are our repair services — and these are real **online bookings**, not just information. Module 3 is carry-in: the customer brings their device to our service centre. Let me book one."

**DO:** Type `3` → `2` (date) → `1` (time slot) → `1` (device: Laptop) → then type `very slow performance`

**SAY:**
"Date, time slot, device, and the problem — and there's the confirmed booking, with a reference starting with **CI**, status 'Awaiting Drop-Off', our service-centre address and hours, and the standard charge. All booked inside the chat, at any hour, with no phone call."

**DO:** Type `0` to return to the menu.

---

## Module 4 — Onsite Repair (6:45 – 8:15)

**SAY:**
"Module 4 is onsite repair — a technician comes to the customer. It collects a little more detail. Let me book it."

**DO:** Type `4` → `1` (service type) → `1` (date) → `3` (time slot) → then type `Mr Tan, 10 Simei Ave 1 #02-01 S486570, 91234567, PC won't start`

**SAY:**
"Service type, date, time slot, and the customer's details in one message — and there's the confirmed appointment, with a reference starting with **OS**, status 'Confirmed', the onsite fee noted, and a promise that our technician will call before the visit. A nice touch: if a customer just types their address, the system recognises it and starts this same booking automatically."

**DO:** Type `0` to return to the menu.

---

## Module 5 — Product Availability + the Payment Gateway (8:15 – 11:45)

**SAY:**
"Module 5 is Product Availability — a quick way to check price and stock. But I'll use it now to show you the most powerful part of the whole platform: the **complete payment journey** — turning an enquiry into a paid order, entirely inside the chat. Let me start a purchase."

**DO:** Type `how much is a mouse` → `1` → `1`

**SAY:**
"I have a quotation for a mouse. Now the customer types 'confirm'."

**DO:** Type `confirm`

**SAY:**
"Instead of 'a rep will call you back', the system now asks how the customer would like to pay — **by Card, or by PayNow**. I'll choose option one, Pay by Card, and send. It gives me a **secure payment link** to open."

**DO:** Type `1`. Copy the `/pay/...` link and open it in a new browser tab.

**SAY:**
"This opens the secure payment page. I'll enter my name — Beng Tan — my card number, and my delivery address. Please note this is a **safe test payment gateway** for the demonstration — it does not ask for a real security code, and no real money is charged. In production, this connects to a real provider like Stripe or PayNow. Let me pay."

**DO:** Fill in name, a sample card number, and address. Click **Pay**.

**SAY:**
"And there we go — **payment received**, with the **order number**, the **invoice number**, the amount paid, and status 'Preparing Order'. It even tells me the driver's name and the estimated delivery time. If there's any delay, I can check the status anytime with option 7.

Think about what just happened — enquiry, quotation, payment, order, invoice, and delivery, all completed in one WhatsApp conversation, at any time of day, with no staff involved. That is the digital transformation."

**DO:** Return to the chat tab. Type `0` to return to the menu.

---

## Module 6 — Talk to Sales + Human-in-the-Loop (11:45 – 14:15)

**SAY:**
"Module 6 is 'Talk to Sales' — and this is where I show you our **Human-in-the-Loop** feature. Let me click it."

**DO:** Type `6`

**SAY:**
"The customer immediately gets an acknowledgement — 'noted, we'll get our sales personnel to contact you within 10 minutes'. Now, behind the scenes, we have a second page — the **rep dashboard** for our admin team. Let me show it."

**DO:** Switch to the dashboard window. Point to the new pending enquiry.

**SAY:**
"The moment the customer asked for sales, it routed to the back end and appeared here as a **pending** enquiry, with the full conversation. Now, our admin can do one of two things. First — **assign it to a sales rep**. We have four reps here; I'll assign this to Noel and click Assign."

**DO:** In the detail panel, select **Noel** and click **Assign to selected rep**.

**SAY:**
"Immediately, the customer's chat says: 'Noel from our sales team has been assigned to your enquiry and will assist you shortly.' The enquiry is now marked 'assigned to Noel'.

Second — if the customer's request is urgent, the admin can **reply to the customer directly, live**. Let me type a reply."

**DO:** In the reply box, type `Sure, Mr Tan — Noel here, I'll call you as soon as possible.` and click **Send to customer**.

**SAY:**
"And watch the customer's chat — that message appears **live**, as a human reply, right in the same conversation. This is the beauty of Human-in-the-Loop: the bot handles the routine, but a real person can step in instantly, and every handoff is tracked."

**DO:** Return to the chat. Type `0`.

---

## Module 7 — Delivery Status (14:15 – 16:00)

**SAY:**
"Module 7 lets a customer check their own delivery — no more 'where is my order' calls jamming the hotline. Let me click it."

**DO:** Type `7`

**SAY:**
"It offers three easy options — the customer can reply with their **delivery-order number** (starting with DO), the **name** on the order, or the **handphone number**. I'll use a delivery-order number from our records."

**DO:** Type / paste `DO202600003`

**SAY:**
"Instantly, the system finds the order — the customer's name, the estimated arrival time, and the driver who is delivering, with a contact number. I really love this feature, because it answers a very common question completely on its own. And remember the order we just paid for in module five? That created a live delivery order too — so an in-chat purchase is immediately trackable right here."

**DO:** Type `0` to return to the menu.

---

## Module 8 — Warranty Status (16:00 – 18:30)

**SAY:**
"Module 8 is warranty — a big source of after-sales questions. The customer can check using their **serial number, invoice number, or handphone number**. Let me look one up from our records."

**DO:** Type `8` → then type an invoice or serial number, e.g. `SG26-ASU-0003-22173`

**SAY:**
"Instantly the system picks up the customer's name, the product, and the warranty status — this one is a one-year onsite warranty, active, valid until its expiry date. And here's the clever part: it then offers to **book service directly** — onsite, carry-in, or speak to our team. Let me pick onsite."

**DO:** Type `1` → `1` (service type) → `1` (date) → `1` (time slot) → then type the customer's name, address, and contact when prompted.

**SAY:**
"And we flow straight into the onsite booking — service type, preferred date, preferred time, then the customer's name, address, and contact. And there's the confirmed appointment with its reference number. So 'am I still under warranty?' becomes 'my repair is booked' — all in one conversation."

**DO:** Type `0` to return to the menu.

---

## Module 9 — About Us + Language (18:30 – 20:15)

**SAY:**
"Module 9 is About Us — our company information: who we are, our address, our operating hours, and how we can help. Useful, clear information for the customer."

**DO:** Type `9`

**SAY:**
"Now let me show you one thing that runs across the whole system — **language**. Our customers write in English, Malay, and Chinese, so we built a **numbered language picker**. Let me open it."

**DO:** Type `language`

**SAY:**
"The customer can reply with a number — **1 for English, 2 for Chinese, 3 for Bahasa Melayu** — or just type the language name. Let me choose Chinese."

**DO:** Type `2`, then type `how much is a keyboard`

**SAY:**
"Now the whole experience — the product list, the prices, the prompts — replies in Chinese, while technical terms like CPU and the address stay in English for clarity. Malay works exactly the same way. This makes the assistant genuinely welcoming for every customer."

**DO:** Switch back to English (Language → 1), then type `0`.

---

## Module 10 — Human-in-the-Loop (customer-initiated) (20:15 – 22:30)

**SAY:**
"Finally, let me show the Human-in-the-Loop feature one more time, the way a customer would trigger it naturally — by simply asking for help."

**DO:** Arrange the chat and the dashboard side by side. In the chat, type `I need help`

**SAY:**
"The customer gets an instant acknowledgement, and on the dashboard the enquiry appears as pending. Our admin assigns it to the next available rep — or replies directly."

**DO:** In the dashboard, click **Assign to next available (round-robin)**, or assign a rep.

**SAY:**
"And the customer sees: 'Noel from our sales team has been assigned to your enquiry and will assist you shortly.' To keep the dashboard tidy between busy periods, our admin can also click **Clear history** — it removes only the finished items and always keeps the live ones. So the team never has to scroll through old conversations to find what still needs attention."

---

## Closing Summary (22:30 – 25:00)

**SAY:**
"To wrap up. You have seen a complete **digital transformation platform** for a small computer shop. It answers instantly, **24 by 7**, and it carries the customer through the entire journey — enquiry, quotation, payment, order, invoice, delivery, warranty, and repair booking.

I'd like to highlight four features we're especially proud of:

**First — Human-in-the-Loop.** The bot handles the routine, but a real sales rep can always take over the conversation live, be assigned a case, and reply to the customer instantly. People stay in control.

**Second — three-language selection.** With our numbered language picker, every customer is served in English, Malay, or Chinese — no one is left out.

**Third — the payment gateway.** The whole sale closes inside the chat — quotation, payment, order, invoice, and delivery — using a secure payment step designed to connect to a real provider like Stripe or PayNow.

**And fourth — online appointment booking.** Both onsite and carry-in repairs can be booked end-to-end, with a confirmed reference number, at any hour, with no phone call.

It's built on real innovation technology — an AI Assistant powered by OpenClaw, running on AWS Lightsail, developed with a disciplined, well-tested workflow in Kiro. And it's proven, with a full product catalogue, delivery records, warranty records, and hundreds of automated tests, all deployed live.

The business value is direct: **less manpower on repetitive typing, more revenue captured around the clock, faster and more consistent service — and the team freed to focus on selling.**

We are Team ITE BIS Innovators. Thank you very much for watching."

---

## Timing Cheat-Sheet

| Module | Target end |
|---|---|
| Opening | 1:45 |
| 1 — Components | 3:45 |
| 2 — DIY PC | 5:15 |
| 3 — Carry-in | 6:45 |
| 4 — Onsite | 8:15 |
| 5 — Availability + Payment | 11:45 |
| 6 — Talk to Sales + Human-in-the-Loop | 14:15 |
| 7 — Delivery Status | 16:00 |
| 8 — Warranty | 18:30 |
| 9 — About Us + Language | 20:15 |
| 10 — Human-in-the-Loop (customer) | 22:30 |
| Closing Summary | 25:00 |

**If running long:** shorten the Module 1 CPU sub-demo, or combine Module 6 and Module 10 into one Human-in-the-Loop showing. **Never cut** the payment journey (Module 5) or the closing summary.

## Features you had missed (now added)
- **Live stock count** shown on every product ("100 in stock") — Module 1.
- **Natural-language search** ("Intel processor generation 14") — Module 1.
- **DIY PC "What's included" breakdown** — Module 2.
- **Numbered language picker (1/2/3)** and **0 / back navigation** — Modules opening & 9.
- **Honest note that the payment gateway is a safe test gateway** (no real security code / no real charge) — Module 5.
- **Round-robin "assign to next available rep"** and **Clear history** — Module 10.
- A clean, single **closing summary** of the four headline features (Human-in-the-Loop, 3 languages, payment gateway, online booking).
