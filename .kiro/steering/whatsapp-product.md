---
inclusion: manual
---

# Product Summary — WhatsApp Sales Enquiries Assistant

## The People First

Before any technology, this project exists to serve two groups of people:

### Customers (enquirers)
- Send questions to a business over WhatsApp about product availability, pricing, delivery charges, operating hours, and other common topics.
- Want a **fast, clear answer in their own language**. In this market that means English, Bahasa Melayu, and Chinese are all common — often mixed within one conversation.
- Feel ignored or frustrated when replies are slow or come back in a language they do not read comfortably.

### Sales representatives
- Receive a high daily volume of WhatsApp enquiries.
- Spend a large share of the workday retyping the same answers to repetitive questions.
- Lose time for high-value selling and slow down responses to important customers.
- Want the repetitive load handled automatically, while still keeping control of anything nuanced, sensitive, or sales-critical.

## The Problem (in human terms)

Repetitive enquiries consume the sales team's time, delaying responses to high-value customers and reducing time for actual selling. Customers who write in Bahasa Melayu or Chinese risk slower or less clear service.

## The Product

A **hybrid assistant**:

1. **Auto-reply bot** — answers frequently asked questions (availability, pricing, delivery, hours) directly, detecting the customer's language (English / Bahasa Melayu / Chinese) and replying in that language.
2. **Escalation to humans** — anything the bot is not confident about, or anything a customer explicitly asks a human for, is handed to a sales rep with the full context.
3. **Rep dashboard** — reps see incoming enquiries, which were auto-answered, which were escalated, and can manage the FAQ answers the bot uses.

## Design Principle: People Before Technology

Every feature must first answer: *which human need does this serve?* Automation and any AI/agentic capability are introduced only where they measurably reduce the rep's repetitive load or speed up a clear, correct answer to the customer. When the bot is unsure, the humane default is to escalate to a person — never to guess.

## Scope Notes

- WhatsApp integration is **simulated first** (a webhook plus a test chat UI) so the product can be built and demonstrated without waiting on WhatsApp Business API approval. The real WhatsApp Business Cloud API is swapped in later behind the same interface.
- Languages in scope for v1: **English (default), Bahasa Melayu, Chinese (Simplified)**.
