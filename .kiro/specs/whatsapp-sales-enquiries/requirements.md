# Requirements — WhatsApp Sales Enquiries Assistant

## Introduction

Sales representatives receive a high volume of customer enquiries through WhatsApp each day. Many are repetitive questions about product availability, pricing, delivery charges, and operating hours. Answering them individually consumes the workday, delays responses to high-value customers, and reduces time for selling. Customers write in different languages — commonly English, Bahasa Melayu, and Chinese — and deserve a clear answer in their own language.

This feature delivers a **hybrid assistant**: an auto-reply bot that answers frequently asked questions in the customer's language, escalates anything uncertain to a human rep, and gives reps a dashboard to manage enquiries and the FAQ answers the bot uses.

Design principle applied throughout: **people before technology.** Each requirement names the human need it serves. Automation is used to reduce repetitive load and speed up correct answers; when the system is uncertain, the safe and humane default is to hand off to a person.

## Glossary
- **Enquiry**: an inbound customer message received via WhatsApp (simulated in phase 1).
- **FAQ**: a stored question intent with answers in one or more languages (`en`, `ms`, `zh`).
- **Escalation**: routing an enquiry to a human rep because the bot is not confident or the customer asked for a person.
- **Confidence**: a 0–1 score for language detection and FAQ matching.

---

## Requirement 1 — Receive customer enquiries

**User story:** As a customer, I want to send a question over WhatsApp and have it received reliably, so that I can get help without waiting for a person to be free.

#### Acceptance Criteria
1. WHEN a message arrives at the inbound webhook with a sender id and text THEN the system SHALL record the enquiry with a timestamp, sender, and original text.
2. IF the inbound payload is missing the sender id or text THEN the system SHALL reject it and SHALL NOT create an enquiry record.
3. WHEN an enquiry is recorded THEN the system SHALL sanitize the text before storing or processing it.

## Requirement 2 — Detect the customer's language

**User story:** As a customer who writes in Bahasa Melayu or Chinese, I want replies in my own language, so that I can understand the answer clearly.

#### Acceptance Criteria
1. WHEN an enquiry is processed THEN the system SHALL detect the language as one of `en`, `ms`, or `zh` and record a confidence score.
2. IF the detected language confidence is below the configured threshold THEN the system SHALL default the language to `en`.
3. WHERE a message mixes languages THEN the system SHALL select the dominant detected language.

## Requirement 3 — Auto-answer frequently asked questions

**User story:** As a customer, I want an immediate answer to common questions (availability, pricing, delivery charges, operating hours), so that I do not have to wait for a rep.

#### Acceptance Criteria
1. WHEN an enquiry is processed THEN the system SHALL attempt to match it to a stored FAQ intent and produce a match confidence.
2. IF a FAQ is matched with confidence at or above the threshold THEN the system SHALL reply with that FAQ's answer in the detected language.
3. IF the FAQ has no answer in the detected language THEN the system SHALL reply with the English answer AND SHALL mark the reply as a language fallback.
4. WHEN an auto-answer is sent THEN the system SHALL record the matched FAQ, detected language, confidence, and that it was auto-answered.

## Requirement 4 — Escalate uncertain or human-requested enquiries

**User story:** As a customer with a complex or sensitive question, I want to reach a real person, so that I get a proper answer instead of a wrong guess.

**User story:** As a sales rep, I want the bot to hand me only what it cannot confidently handle, so that I focus on high-value work.

#### Acceptance Criteria
1. IF no FAQ is matched at or above the confidence threshold THEN the system SHALL escalate the enquiry to a human rep.
2. IF the customer explicitly asks to speak to a person THEN the system SHALL escalate regardless of FAQ match.
3. WHEN an enquiry is escalated THEN the system SHALL record the reason and SHALL mark it as pending for a rep.
4. WHEN an enquiry is escalated THEN the system SHALL send the customer an acknowledgement in the detected language that a rep will follow up.

## Requirement 5 — Rep dashboard

**User story:** As a sales rep, I want to see incoming enquiries and which ones need me, so that I can respond quickly to what matters.

#### Acceptance Criteria
1. WHEN a rep opens the dashboard THEN the system SHALL list enquiries with their status (auto-answered or escalated/pending), language, and timestamp.
2. WHEN a rep opens an escalated enquiry THEN the system SHALL show the original message, detected language, and why it was escalated.
3. WHEN a rep marks an escalated enquiry as resolved THEN the system SHALL update its status and record who resolved it.

## Requirement 6 — Manage FAQ answers

**User story:** As a sales rep or admin, I want to add and edit FAQ answers in each language, so that the bot stays accurate and covers more questions over time.

#### Acceptance Criteria
1. WHEN an admin creates a FAQ THEN the system SHALL store its intent and answers per language (`en`, `ms`, `zh`), requiring at least the English answer.
2. WHEN an admin edits a FAQ answer THEN the system SHALL save the change and use it for subsequent enquiries.
3. IF a FAQ is created without an English answer THEN the system SHALL reject it with a validation message.

## Requirement 7 — Swappable WhatsApp integration

**User story:** As the project owner, I want to build and demo now without WhatsApp API approval and switch to the real API later, so that progress is not blocked.

#### Acceptance Criteria
1. WHERE `WHATSAPP_MODE` is `simulated` THEN the system SHALL accept messages via a test chat page and record outbound replies without calling any external API.
2. WHERE `WHATSAPP_MODE` is `cloud` THEN the system SHALL send replies via the WhatsApp Business Cloud API using the same sender interface.
3. WHEN the mode changes THEN the system SHALL require no changes to language, FAQ, or escalation logic.

## Requirement 8 — Visible, testable results

**User story:** As the project owner, I want to see results at each stage, so that I can verify the system works before it is complete.

#### Acceptance Criteria
1. WHEN `npm test` is run THEN the system SHALL execute unit tests for language detection, FAQ matching, and escalation, plus an integration test for the webhook.
2. WHEN the server is running THEN a request to the webhook SHALL return the bot's reply so it can be inspected directly.
3. WHEN the server is running THEN the simulated chat page and dashboard SHALL be reachable in a browser.

## Non-Functional Requirements
- **Privacy:** store only what is needed to answer and escalate; keep secrets out of the repo.
- **Reliability:** an error in answering one enquiry SHALL NOT crash the server or block other enquiries.
- **Extensibility:** language set and FAQ set can grow without code changes to the core flow.
- **Humane fallback:** uncertainty always routes to a person, never to a silent wrong guess.
