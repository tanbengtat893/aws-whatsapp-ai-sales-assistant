# Hybrid AI WhatsApp Sales & Service Assistant for "BIS Computer Services"

## Business Proposal and Technical Documentation

### Solving the Problem of Managing WhatsApp Sales Enquiries — Digital Transformation of Customer Engagement

**Submitted by:** Team ITE BIS Innovators (Team code: 6AFRXLO4)

| Team Member | Role |
| --- | --- |
| Tan Beng Tat | Project Owner |
| Chen Yingsheng, Noel | Content Administrator |
| Li Puay Sim | Lead Sales Representative |
| Low Ger Loon | DevOps |

**Powered by:** AWS Lightsail · Kiro IDE · OpenClaw · WhatsApp Business Automation

**Project date:** 28 September 2026
**Guiding principle:** People before technology. "Automation supports people, not replaces them."

---

## How to Read This Document

This single deliverable combines two things the competition asks for, in the order a business reader should meet them:

- **Part 1 — Business Proposal.** The business case, written for a business owner and organised to the five evaluation themes of the SMYA Business Proposal Guidelines: (1) Problem & Opportunity, (2) Business Value, (3) Business Impact & Outcomes, (4) Feasibility & Scalability, (5) Proposal Quality. This part answers *what problem we solve, who feels it, what value the Agent creates, and what measurable outcomes we expect.*
- **Part 2 — Technical Documentation.** The engineering detail behind the same solution — requirements, architecture, data design, modules, the guided flows, testing, and deployment — reused and updated from the team's earlier technical write-up. This part answers *exactly how the solution was built and how it works.*

The business case is deliberately placed before the technical detail so a non-technical stakeholder can understand and approve the proposal without reading engineering material, while a technical reviewer can go straight to Part 2 for depth. Where the technical part would simply repeat a business section, it cross-references rather than duplicates. A short **"Reuse and Redundancy Notes"** appendix at the end records what was reused from the earlier write-up, what was merged, and what was intentionally left out, so nothing is dropped silently.

A note on one figure: the earlier technical write-up quoted **340 automated tests**. The current verified state of the codebase is **348 automated tests across 19 suites**, and that is the number used throughout this document. All other verified figures (catalogue size, categories, delivery and warranty records, languages, exports) are stated consistently in both parts.

---

# PART 1 — BUSINESS PROPOSAL

*Organised to the five SMYA evaluation themes. Written for a business stakeholder; technical terms are explained where they appear.*


## Problem and Opportunity


### Overview of the Business Problem

BIS Computer Services is a small computer hardware retail and repair business that handles customer enquiries relating to computer components, DIY PC packages, product availability, delivery status, warranty coverage, repair appointments and sales support. Many customers expect to communicate with the business through WhatsApp because it is familiar, convenient and easy to use.

However, the present enquiry process depends heavily on sales and service staff reading and replying to customers manually. A staff member may need to check a product price from one source, confirm stock from another file, look up delivery information from a separate record, inspect warranty details, or refer to a booking diary before preparing a reply. This repeated searching and typing takes place throughout the working day and interrupts other higher-value responsibilities such as advising customers, closing sales and resolving complex technical problems.

The business problem is therefore not simply the absence of an AI chatbot. The more meaningful problem is that:

Staff repeatedly search across different sources to answer routine WhatsApp enquiries, resulting in unnecessary manual work, slower replies, inconsistent information, missed after-hours sales opportunities and limited visibility into customer interactions.

This is the central problem that the proposal addresses. It places the operational need first and the technology second, in line with the competition’s direction to think like a business owner rather than only as an AI developer.

The project therefore proposes transforming WhatsApp from a mainly manual messaging channel into an always-available sales and service channel. The objective is to automate routine and clearly answerable work, while continuing to involve a human representative whenever judgement, negotiation, sensitivity or personalised assistance is required.
In short, the proposal is about changing the economics of customer engagement, not adding a gadget.


### The Target Business and Operating Context

The selected business domain is computer hardware retail and repair. This domain was chosen because a single customer relationship may involve several connected stages:

Product enquiry
Product recommendation
Price and stock confirmation
Quotation
Payment
Order and invoice creation
Delivery tracking
Warranty checking
Repair or service booking
Human sales or technical support

This makes the domain suitable for demonstrating meaningful digital transformation. The proposed Agent does not only provide frequently asked questions. It supports the wider customer journey from the first enquiry through sales, fulfilment and after-sales service. The existing project scope includes product and stock enquiries, DIY PC package recommendations, structured quotations, simulated payment, delivery tracking, service booking, warranty checking, multilingual interaction and human escalation.

The project uses mock business and customer data for demonstration purposes. The existing report states that personal details, warranty records, names, contact information, serial numbers and similar customer records used in the demonstration are synthetic. This allows the solution to demonstrate realistic workflows without exposing actual customer information.


### Who Experiences the Problem?

Several groups are affected by the present enquiry process. Each stakeholder experiences the problem differently, but the effects are connected.


#### Customers

Customers contact the business because they want a quick, accurate and useful answer. Typical questions may include:

“Do you have this item in stock?”
“How much is this RAM?”
“Which PC package suits my budget?”
“What is the status of my delivery?”
“Is my product still under warranty?”
“Can I book an onsite repair?”
“Can I speak to a sales representative?”

Customers are not concerned about which internal spreadsheet, file or record contains the answer. They mainly expect the response to be correct, understandable and reasonably prompt.

A customer who is comparing several computer retailers can send the same question to more than one shop. When one retailer replies quickly while another remains silent, the faster business has a better opportunity to retain the customer’s attention and progress towards a sale. A delayed reply therefore affects more than convenience. It can affect conversion, trust and the customer’s willingness to continue the conversation.

Language can create additional friction. The project is designed around customer interactions in English, Chinese and Bahasa Melayu. When customers are more comfortable using a particular language, a delayed or unclear response may make the transaction harder to complete. The existing build supports these three languages across major customer flows and provides a numbered language selector.


#### Sales Representatives

Sales representatives experience the problem as repeated interruption and administrative effort. For each routine question, a representative may have to stop another activity, locate the correct information, prepare a response and return to the original task.

The true cost is therefore not only the number of minutes required to type a reply. It also includes:

Time spent deciding where to find the information
Repeated switching between chat, product, warranty and delivery records
Re-entering the same or similar information for different customers
Loss of concentration during active sales conversations
Reduced time for recommendations, negotiation and closing
Higher risk of inconsistent answers between different staff members

The existing proposal describes the intended change clearly: staff time should move away from repeatedly looking up routine information and towards closing sales, serving customers and managing exceptions.


#### Service and Repair Staff

The service team is affected when repair requests arrive as unstructured messages. Staff may need to ask follow-up questions about the device, preferred date, time, address, fault description or warranty status before manually creating an appointment.

Without a structured process, information may be incomplete or spread across a long message thread. This increases the possibility of missed details, follow-up delays and inconsistent appointment records.

The proposed platform addresses this need through guided onsite and carry-in booking flows. These flows collect the required information in stages and produce a booking reference only after the necessary steps are completed.


#### Business Owner

The business owner experiences the combined financial and operational consequences of the manual process.

These consequences include:
Paying staff to perform repetitive information retrieval
Losing possible sales when enquiries are not answered promptly
Giving customers an inconsistent service experience
Depending strongly on individual staff knowledge
Having limited records for measuring response time or conversion
Having difficulty determining how many enquiries led to orders
Having no consistent way to identify the most frequent customer needs

For a small business, these effects are important because manpower is limited. Every hour used for repetitive enquiry handling is an hour not used for consultation, sales, technical diagnosis or customer relationship building.


### The Current Customer Enquiry Process

The current workflow below is presented as an assumption to be validated, because historical logs of the original manual enquiry process are not yet available.

A typical customer enquiry may presently follow these steps:
A customer sends a WhatsApp message to the business.
A staff member reads the message.
The staff member interprets what the customer needs.
The staff member decides which source may contain the answer.
The staff member searches a stock list, price list, delivery record, warranty record, booking diary or personal notes.
The staff member prepares and sends a reply.
If the customer wants to buy, the staff member manually prepares or confirms the quotation.
Payment information may be shared separately.
Delivery or collection arrangements are handled manually.
If the staff member cannot answer, the conversation waits until someone with the necessary knowledge is available.
After business hours, the enquiry may remain unanswered until the next working period.

This process is fragmented because it depends on several sources and human availability. It is also difficult to measure when information remains inside unstructured message threads and separate working records.

The project does not claim that this assumed process has already been proven by historical operational data. Both reports indicate that the original manual workflow and the “before” measurements should be treated as assumptions until validated during a pilot using real enquiry logs.

This distinction is important for proposal quality. Rather than presenting estimates as verified facts, the proposal separates:
Verified system capabilities, which can be demonstrated now
Baseline assumptions, which describe the expected current situation
Projected outcomes, which must be validated through a pilot



### Specific Pain Points


#### Repetitive Manual Work

Questions about prices, stock, delivery, warranty, operating hours and service bookings are likely to repeat. Although such questions may be simple, each still requires someone to read, locate information and respond.

The business is therefore using skilled staff time to complete work that is predictable and suitable for automation. This restricts the amount of time staff can spend on activities that require product knowledge, persuasion, technical judgement or relationship building.


#### Delayed First Response

A manual process can only respond when a staff member is available. During busy periods, a routine enquiry competes with customers at the shop, ongoing sales discussions, telephone calls and service matters.

The result may be a delayed first response even when the required information is straightforward.


#### No Consistent After-Hours Coverage

Messages can arrive outside normal operating hours, including evenings, weekends or public holidays. Under a fully manual model, these enquiries may not be attended to until staff return.
This creates a service gap at the point when the customer may still be actively comparing products or deciding whether to purchase.

The proposal should avoid claiming that every delayed enquiry becomes a lost sale because the available documents do not contain verified historical conversion data. The evidence-based statement is that after-hours silence creates a risk of losing customer attention and a potential sales opportunity. The actual financial effect should be measured during the pilot.


#### Information Scattered Across Different Sources

The current task may require staff to use several separate records. Even when the correct data is available, locating it can take time.

Scattered sources can lead to:
Longer response times
Duplicate effort
Different answers from different representatives
Greater dependence on individual memory
Additional checking before confirming information
Difficulty maintaining one current version of the truth


#### Inconsistent Replies

Different staff members may phrase answers differently or refer to different versions of a record. During a busy period, a representative may also provide an incomplete response.

For matters involving price, stock, warranty or delivery, inconsistency can affect customer trust and create additional corrective work. The proposed approach therefore retrieves these answers from approved structured data rather than allowing an AI model to invent or estimate them.


#### Language Friction

Customers may write in different languages or use a mixture of languages. A staff member who is not comfortable with the customer’s preferred language may need help translating or may provide a shorter response.

The resulting communication may be slower or less clear. The proposed platform reduces this friction by supporting English, Chinese and Bahasa Melayu across the main customer journey.


#### Limited Measurement and Audit Trail

Unstructured messages do not automatically provide management with a complete view of:

How many enquiries were received
Which enquiries were answered automatically
Which enquiries needed human assistance
How long customers waited for a first response
Which enquiries became quotations or orders
Which representative handled an escalation
Whether an enquiry was pending, in progress or resolved

The updated report describes a dashboard workflow in which enquiries can move through pending, assigned, in progress and resolved states, with reference details and human handling recorded. This creates the basis for measurable operational reporting.



### Why the Problem Matters


#### Frequency and Scale

The importance of the problem comes from repetition. A single price enquiry may require only a short reply, but similar enquiries accumulate over days and weeks.

The existing project write-up uses a scenario of 120 enquiries per day, with 65 per cent treated as repetitive and an average of three minutes per manual reply. However, these figures are illustrative assumptions rather than confirmed operational measurements.

For a competition submission, these values should therefore be stated as a working scenario for pilot validation, not as facts about the SME.

A careful presentation would be:

For planning purposes, the team has modelled a working scenario in which a substantial portion of daily WhatsApp enquiries is repetitive. The actual enquiry volume, repetitive-enquiry percentage and handling time will be measured during the pilot.

This protects the credibility of the proposal while still showing that the team understands how the business case will be quantified.


#### Operational Consequences

The operational effects extend beyond reply time:

Staff attention is divided between routine messages and active sales work.
Complex customers may wait while staff answer basic questions.
Enquiries may depend on a particular employee’s knowledge.
Busy periods increase pressure and the possibility of mistakes.
Service requests require manual collection and re-entry of information.
Managers have limited visibility into the enquiry pipeline.
Repeated questions continue to consume effort even though the answers already exist.


#### Commercial Consequences

A slow or unclear response can weaken sales conversion because a prospective buyer can approach several retailers at the same time.

The business may also lose opportunities when:
A customer receives no reply outside working hours
A ready buyer does not receive immediate product or stock information
A quotation takes too long to prepare
A customer must leave WhatsApp and use several other channels to complete the purchase
A delivery or warranty enquiry uses sales staff time that could be devoted to closing a new order

The exact value of these opportunities is not yet known. It should be measured through actual enquiry, quotation and order records during the pilot.


#### Service and Reputation Consequences

Customers expect information about price, stock, delivery and warranty to be correct. An incorrect or inconsistent answer can create frustration, corrective work or disagreement.

For this reason, reliable escalation is as important as automation. When the system cannot answer confidently, it should transfer the conversation to a person rather than send an uncertain response.

That behaviour aligns with the proposal’s guiding principle:
People before technology. Automation supports people rather than replacing them.

The existing system design already reflects this principle through an escalation path and a two-way representative console.



#### The Business Opportunity

The opportunity is to create an automated first layer for WhatsApp enquiries while preserving human control for cases that need judgement.

Instead of requiring a representative to handle every message from the beginning, the proposed Agent can:
Receive and record the enquiry
Identify the customer’s language
Provide an easy numbered menu
Understand supported free-text questions
Retrieve approved price and stock information
Guide customers through product selection
Prepare an itemised quotation
Support the order journey
Provide delivery-status information
Check warranty records
Guide customers through repair booking
Escalate uncertain or sensitive matters to a named representative
Record operational states for monitoring and measurement

The opportunity is especially meaningful because it does not require customers to adopt a completely new interaction method. They continue using a familiar conversational channel, while the process behind that channel becomes more structured, measurable and scalable.


Figure 1.1 BIS Computer Service welcome screen

Capture http://52.77.234.193:3000/chat.html showing the branded welcome message and the numbered quick menu (options 1–9 plus Language). This is the customer's first impression of the 24/7 assistant.



Figure 1.1: The proposed WhatsApp interface provides customers with one entry point for product, sales, delivery, warranty and service enquiries.

The system also demonstrates how a routine product question can be answered from structured catalogue information without requiring staff to perform a manual lookup.

Figure 1.2 Entering word how much is a keyboard

Figure 1.2: A routine product enquiry is answered using approved catalogue data, reducing the need for manual staff lookup.


### Why Solving the Problem Is Worthwhile

Solving this problem is worthwhile because it offers improvement across several connected areas.

Productivity
Routine information retrieval and repeated typing can be reduced. Staff can focus more of their working time on recommendations, complex enquiries, negotiations and customer service cases that genuinely need human skills.

Customer Service
Customers can receive a prompt first response and navigate sales or service options without waiting for an available representative. Supported enquiries can also be answered consistently in the customer’s selected language.

Revenue Opportunity
After-hours enquiries can be acknowledged and progressed instead of remaining unattended. Prospective buyers can move from enquiry to quotation and a demonstrated simulated payment journey in the same conversation.

Risk Reduction
Price, stock, delivery and warranty information can be obtained from structured records rather than guessed. Uncertain cases can be escalated to a human.

Operational Visibility
Enquiries, quotations, bookings and human escalation states can be recorded. This gives the business a foundation for measuring response time, auto-answer rate, conversions and staff effort.



Scalability
When enquiry volume increases, routine interactions can be absorbed by the automated layer rather than requiring manpower to increase at the same rate. Human staff remain focused on exceptions and high-value conversations.


### Problem Statement

The complete problem statement for the proposal is:

BIS Computer Services currently depends on staff to manually read, interpret, search and respond to routine WhatsApp enquiries across separate product, delivery, warranty and booking information sources. This creates repetitive work, interrupts higher-value sales activities, delays responses, limits after-hours coverage, introduces language and consistency risks, and provides limited data for measuring service performance or sales conversion. The business therefore needs an automated first-response and guided transaction layer that can handle clearly answerable customer needs at any time, while escalating uncertain, sensitive or complex matters to a human representative.

This formulation is stronger than “we want to build an AI chatbot” because it identifies:
The organisation experiencing the problem
The users affected
The present process
The exact operational pain
The commercial and service consequences
The need for automation
The continuing role of people


### Opportunity Statement

The corresponding opportunity statement is:

BIS Computer Services has an opportunity to transform WhatsApp into an always-available, multilingual and measurable sales and service channel. By automating routine enquiries and guided customer journeys while preserving a clear human escalation path, the business can reduce repetitive staff effort, improve response consistency, capture after-hours demand, provide more convenient customer service and create structured operational data for future improvement.


### Evidence, Assumptions and Pilot Validation

To keep the proposal credible, all important claims should be divided into three categories.


#### Verified and Demonstrable Now

The project materials state that the current solution includes:

A deployed cloud application
Product catalogue search and stock responses
English, Chinese and Bahasa Melayu interaction
Sales, delivery, warranty and booking journeys
A two-way human representative console
Automated testing across multiple suites
Structured reference records for customer journeys

The current verified state of the codebase is 348 automated tests across 19 suites. This is the single figure used consistently across this proposal, the technical documentation, the presentation and the demonstration. (An earlier draft of the technical write-up quoted 340 tests; that figure has been superseded by the current 348.)


#### Assumptions Requiring Validation

The following should remain clearly labelled as assumptions until pilot data is available:
Number of WhatsApp enquiries received per day
Percentage of enquiries that are repetitive
Average manual handling time
Existing first-response time
Volume of enquiries received after hours
Number of sales lost because of delayed replies
Existing delivery-status call volume
Existing enquiry-to-order conversion rate


#### Pilot Validation Approach

During a pilot, the team should record:
Enquiry timestamp
First-response timestamp
Enquiry category
Whether the Agent answered or escalated
Human handling time
Whether a quotation was created
Whether an order was created
Whether the interaction took place after hours
Customer language
Final status
Reason for escalation

The pilot will turn assumptions into an evidence-based baseline. It will also allow the project team to compare the before and after process fairly.


## Business Value


### Business Value Overview

The earlier Problem and Opportunity established the central business problem: BIS Computer Services depends heavily on staff to read, interpret, search and respond manually to routine WhatsApp enquiries. This creates repetitive work, delays customer responses, limits after-hours coverage, introduces inconsistency and leaves the business with limited operational data.

The proposed Hybrid AI WhatsApp Sales and Service Assistant addresses this problem by introducing an automated first-response and guided transaction layer. The Agent handles routine and clearly answerable tasks using approved business data, while uncertain, sensitive or complex matters are transferred to a human representative.

The Agent creates value in six connected business areas:
Productivity: reducing repetitive manual work and releasing staff time.
Cost: lowering the staff effort required for each routine interaction.
Revenue: capturing more sales opportunities and supporting customers through to an order.
Service: providing faster, more consistent and multilingual assistance.
Risk: reducing incorrect answers while strengthening oversight and auditability.
Scale: allowing enquiry volume to grow without requiring manpower to increase at the same rate.

These value areas are not separate technical features. They are different business outcomes produced by a connected operating model.

The Agent receives the enquiry, retrieves approved information, guides the customer through the relevant journey, records the interaction and transfers the case to a person when human judgement is needed. In this way, value is created across the complete customer lifecycle rather than at only one point in the process.

The business value proposition can be summarised as follows:
The Hybrid AI WhatsApp Sales and Service Assistant allows BIS Computer Services to serve more customers, respond more quickly, capture sales opportunities beyond normal operating hours and reduce repetitive staff effort, while maintaining human oversight for decisions and conversations that require judgement.


### Business Value at a Glance


Business-value area
Current business difficulty
Value created by the Agent
Productivity
Staff repeatedly search, check and type routine answers
The Agent handles supported routine enquiries and guided processes
Cost
Every routine enquiry consumes staff time
Staff effort is focused mainly on exceptions and higher-value work
Revenue
Delayed and after-hours enquiries may not progress
Customers can receive an immediate response and continue towards a quotation or order
Service
Response time and answer quality may vary
Customers receive prompt, consistent and multilingual assistance
Risk
Staff or AI may provide inconsistent or unsupported details
Price, stock, delivery and warranty answers come from approved records
Scale
More enquiries normally require more staff effort
Automated routine handling can absorb part of the additional volume
Visibility
Unstructured conversations are difficult to measure
Enquiries, references, status changes and outcomes are recorded
Human value
Staff spend time on repetitive typing
Staff can focus on advice, negotiation, exceptions and relationship building


### How the Agent Changes the Business Operating Model

Under the assumed current process, almost every enquiry starts with a human representative. Staff must read the message, determine what the customer wants, find the relevant source, check the information, prepare the reply and decide what should happen next.

Under the proposed process, supported routine enquiries begin with the Agent. The Agent performs the first layer of work by:
Detecting or remembering the customer’s selected language
Recognising the purpose of the enquiry
Retrieving information from approved structured records
Presenting the appropriate product or service choices
Guiding the customer through clearly defined steps
Creating a reference or record where applicable
Escalating the enquiry when the Agent is uncertain
Retaining a human path throughout the conversation

The customer continues to use a familiar conversational interface. The major change takes place behind the channel, where an unstructured manual process becomes more automated, structured and measurable.

The business operating model therefore changes from human handling by default to Agent handling for routine work, with human handling for exceptions and higher-value conversations.


Figure 1.3 BIS Computer Service welcome screen

Figure 1.3: The customer welcome menu provides one conversational entry point for product enquiries, DIY PC packages, repair bookings, product availability, sales support, delivery tracking and warranty assistance.
This figure 1.3 gives the judges a visual overview of the business scope. It shows that the proposed Agent is not limited to answering basic questions. The menu connects several parts of the customer journey through one channel.

What the figure proves:
Customers can access different sales and service functions from one screen.
The solution supports more than a single FAQ use case.
The business has a foundation for connecting pre-sales, sales, fulfilment and after-sales activities.
Customers do not need to determine which internal staff member or department should answer first.


### Productivity Value


#### Reducing Repetitive Manual Enquiry Work

The most immediate business value is the reduction of repetitive manual work.

Routine enquiries may include:
Product prices
Product availability
Stock quantities
Business operating information
Delivery status
Warranty status
Repair booking options
Basic service information
Requests to speak to sales staff

Although these enquiries may be simple, every manually handled message still requires staff attention. A representative may have to stop another task, open the conversation, interpret the question, identify the appropriate information source, locate the record, prepare a reply and then return to the original work.

The total productivity cost therefore includes more than the time needed to type the answer. It also includes the interruption and context switching created whenever a representative moves between an active sales conversation and a routine information request.

The proposed Agent reduces these steps for supported enquiries. Product, price, stock, delivery and warranty information can be retrieved from structured data. The Agent can then present the answer without requiring the representative to perform a manual lookup.

The prototype contains 979 catalogue items, comprising 829 computer components and 150 DIY PC packages. It also contains 60 delivery records and 50 synthetic warranty records. The project currently assigns 100 stock units to each catalogue item for demonstration purposes.

The figures above describe the current demonstration dataset. They do not represent the actual inventory levels of a live business. Production use would require the business to provide and maintain accurate stock and price information.


Figure 1.4 Confirmed booking for carry-in repair

Figure 1.4: The Agent responds to a routine product enquiry using structured catalogue information, including product choices, prices and available stock.

Purpose of the figure:
This screenshot provides visible evidence that the Agent can absorb a routine enquiry that would otherwise require a staff member to search a product or inventory record manually.

What the figure proves:
The customer can type a product-related question in conversational language.
The Agent can return relevant product choices.
Product prices and stock information are retrieved from the catalogue.
A routine enquiry can be handled without immediate staff involvement.
The customer is guided towards the next step instead of receiving only a general answer.




#### Releasing Staff Time for Higher-Value Work

Reducing repetitive enquiries creates meaningful business value only when the released staff time is used appropriately. The proposal does not assume that automation should immediately reduce staff headcount. Instead, the intention is to redirect staff attention towards activities that require human knowledge, judgement and relationship building.

These higher-value activities include:
Understanding the customer’s actual needs
Recommending compatible components
Advising customers on computer configurations
Comparing product alternatives
Managing high-value quotations
Conducting sales negotiations
Resolving complex hardware issues
Handling complaints and exceptions
Following up with interested customers
Supporting customers who require personalised assistance
Building stronger customer relationships

This reflects the project’s guiding principle of people before technology. The Agent absorbs repetitive, clearly answerable work, while staff focus on areas in which human capability creates greater business value.

The Agent therefore creates two types of productivity improvement.

Direct productivity improvement
The Agent completes supported information retrieval, routine response and guided process steps without requiring staff intervention.

Indirect productivity improvement
Staff face fewer interruptions and can maintain their attention on important sales, service and customer-relationship activities.

For a small business with limited manpower, the indirect benefit is important. A representative who can remain focused on a serious buyer is more valuable than a representative who must repeatedly stop to answer routine questions about price, stock, delivery or business hours.


#### Streamlining Product Selection and Quotations

The Agent can reduce the manual work involved in preparing an early-stage quotation.

The guided sales flow can:
Interpret the customer’s product enquiry.
Search the catalogue.
Present a numbered shortlist.
Allow a product selection by number or product name.
Request the required quantity.
Retrieve the product price.
Display the available stock.
Calculate the line total.
Generate a quotation reference.
Invite the customer to confirm or ask for a person.





This process turns a simple price enquiry into a structured sales journey.


Figure 1.5 DIY PC Package selection screen

The DIY PC package path provides additional value because it can present a complete package together with the components included. A customer can therefore review the overall configuration without requiring a representative to explain the same package repeatedly.

What the figure proves:
The customer can select a product from the Agent’s shortlist.
The customer is guided to provide the required quantity.
The Agent uses stored information to prepare the quotation.
A repeatable sales process can be completed without repeated staff calculation or re-entry.
A human sales option can remain available if the customer needs assistance.


Figure 1.6 Qty option and Quotation generated after selected quantity screen

Figure 1.6 shows that the Agent reduces manual quotation preparation and maintains customer momentum from initial enquiry to purchase consideration.


#### Streamlining Repair-Service Bookings

The onsite and carry-in booking functions also reduce administrative effort.
Under an unstructured process, a customer may send only a general message such as “My computer is not working” or “Can somebody come to my office tomorrow?” Staff must then ask several follow-up questions before an appointment can be created.


Figure 1.7 Onsite Repair Booking process


Figure 1.7 shows that the Agent introduces a guided process to collect the required information.
For an onsite service request, the Agent can collect:
Service type
Preferred date
Preferred time slot
Customer details
Service address
Description of the problem


Figure 1.8 Carry-in Service Booking process

Figure 1.8 shows that for a carry-in service request, the Agent can collect:
Preferred date
Preferred time slot
Device type
Description of the fault
Customer information

The Agent guides the customer through a carry-in repair booking and provides a structured booking reference after the required information is collected.

This screenshot demonstrates how the Agent reduces administrative follow-up and converts an unstructured repair request into an organised service record.

What the figure 1.8 proves:
The repair request follows a defined sequence.
The customer provides the required booking information.
A reference is generated for follow-up.
The service team receives a more complete and structured request.
The booking process can remain accessible outside normal operating hours.

A booking record is created only after the required steps are completed. The customer then receives a booking reference. This reduces incomplete bookings, repeated follow-up questions and manual recording effort. Both current prototype supports both onsite and carry-in booking journeys


### Cost Value


#### Lowering Staff Effort per Routine Interaction

Every manually handled enquiry has a staff-time cost, even when the question is repetitive and the required answer already exists. For a manual enquiry, a simple cost estimate can be calculated as:
Manual interaction cost = average staff handling time × estimated staff cost per minute

For automated interactions, a simple cost estimate can be calculated as:
Automated interaction cost = allocated monthly platform operating cost ÷ number of successfully automated interactions

The business can also calculate a blended cost:
Blended cost per enquiry = total staff handling cost plus platform operating cost ÷ total enquiries

These formulas provide a method for measuring cost value during the pilot. They should not be presented as achieved savings until actual staff effort, enquiry volume, automation rate and operating cost have been recorded.
The expected value comes from changing the work required for an additional routine interaction. Under a fully manual model, each additional enquiry requires additional staff attention. Under the proposed model, supported enquiries can be handled by the automated layer, with human attention used mainly when an exception occurs.


#### Avoiding Unnecessary Manpower Growth

As enquiry volume increases, a fully manual process normally requires additional staff effort. During busy periods, staff may become overloaded, response times may increase and a larger number of enquiries may remain unattended.

The Agent offers a more scalable operating model. Routine enquiries can be handled automatically, while human representatives focus on conversations that require advice, negotiation or exception handling.

The appropriate business claim is:
The Agent is expected to reduce the rate at which staff effort must increase as customer enquiry volume grows, because supported routine interactions can be handled automatically.

This does not mean that the business will never need more staff. If sales, service bookings or complex cases grow substantially, more employees may still be required. However, additional manpower would support genuine business growth rather than mainly repetitive information retrieval.


#### Controlling Technology Investment

The project uses a staged implementation model. The prototype is currently deployed on an AWS Lightsail Ubuntu instance and kept running through PM2. It uses:
A simulated WhatsApp-style customer interface
A simulated payment gateway
File-based data behind a store abstraction
A working customer chat interface
A representative dashboard
A structured and tested business-logic layer

The current application is reachable as a deployed demonstration, but the official WhatsApp Business Cloud API, live payment gateway, authenticated dashboard and managed production database remain roadmap items.

This staged approach enables the business to test the operating model before committing to a complete production implementation.
Production costs may include:
Cloud hosting
WhatsApp Business messaging charges
Payment-provider transaction fees
AI or vision usage
Managed database services
Monitoring and backup
Security controls
Maintenance and support
Staff training

These costs should be confirmed during pilot and production planning. The final proposal should therefore describe the current architecture as controlled and incremental, rather than claiming that the system has no operating cost.


#### Reducing Errors and Corrective Work

Incorrect price, stock, delivery or warranty information may create additional cost through:
Corrective customer communication
Manual investigation
Order cancellation
Customer complaints
Repeated enquiries
Reputational damage
Possible financial loss

The proposed Agent reduces this exposure by retrieving critical business facts from structured records. AI can help interpret customer language, but it does not control or invent price, inventory, delivery or warranty information.

The business-control principle is:
The Agent should provide an approved answer or transfer the enquiry to a person. The Agent should not guess information involving money, stock, delivery or warranty.

This reduces the risk of rework and protects customer confidence.



### Revenue Value


#### Capturing After-Hours Customer Demand

One of the strongest revenue opportunities is extending customer engagement beyond normal operating hours.

Under the assumed current process, a customer who messages after the business closes may not receive a response until the next working period. The customer may be comparing several retailers and may purchase elsewhere before staff return.

The Agent can immediately:
Acknowledge the enquiry
Present the customer menu
Answer supported questions
Search products
Display price and availability
Prepare a quotation
Guide the customer towards the demonstrated payment process
Record the enquiry
Transfer the conversation for human follow-up when required

This does not mean that every after-hours enquiry will become a sale. The evidence-based value is that an after-hours enquiry can be captured, acknowledged and progressed rather than remaining completely unattended.


Figure 1.9 From quotation confirmation to a test payment process

Figure 1.9: The Agent progresses a customer from quotation confirmation to a test payment and the creation of related order records within the conversational journey. The payment function shown is a simulated test gateway. It is not connected to a bank, does not request a CVV and does not process a real financial charge.

Purpose of the figure 1.9:
This figure shows how a product enquiry can progress towards a commercial outcome without requiring the customer to leave the conversation and wait for separate manual instructions.

What the figure proves:
The demonstrated customer journey extends beyond product enquiry.
A customer can confirm a quotation.
A test payment process can be initiated.
Order, invoice and delivery references can be generated after simulated payment confirmation.
The business logic for the transaction journey has been implemented.

What the figure does not prove:
It does not prove that actual customer payments can currently be accepted.
It does not prove the achievement of real sales revenue.
It does not prove a particular conversion improvement.

The Agent creates an opportunity to capture and progress customer demand beyond normal business hours.


#### Improving Enquiry-to-Quotation Conversion

A customer may begin with a simple question such as “How much is this keyboard?” A basic reply may end after providing the price.
The proposed Agent can guide the customer further:
Identify matching products.
Present a shortlist.
Allow product selection.
Request quantity.
Display the price and availability.
Prepare a quotation.
Invite confirmation.
Present the next purchasing step.
Offer human sales assistance.


Figure 2.0 “How much is this keyboard?” A basic reply may end after providing the price.

This reduces the number of points at which the customer must wait for a representative or determine the next step independently.

The business value is not only a faster answer. The business value is maintaining progress from initial interest towards a measurable action.

The following conversion measures should be captured during the pilot:
Enquiry-to-product-selection rate
Product-selection-to-quotation rate
Quotation-to-confirmation rate
Confirmation-to-payment-link rate
Payment-link-to-order rate
Human-assisted conversion rate
After-hours enquiry-to-order rate

These measures will enable the business to identify where customers leave the journey and which parts should be improved.


#### Capturing and Managing Sales Leads

Not every customer is ready to purchase without human assistance. Some customers require advice, compatibility confirmation, product comparison, negotiation or customised quotations.
The “Talk to Sales” function turns the request into a trackable enquiry. The existing project describes an enquiry lifecycle covering pending, assigned, in progress and resolved states. The representative can view the conversation and reply into the same customer thread.


Figure 2.1 Sales Enquiry Assignment and Tracking Status changed to Assigned to Noel

Figure 2.1: A customer request for sales assistance is assigned to a named representative and tracked through the enquiry-management workflow. This screenshot shows that a sales request becomes a managed work item rather than remaining as an unassigned message inside a general chat stream.

What the figure proves:
The enquiry can be recorded.
A representative can be assigned.
Ownership becomes visible.
The status of the enquiry can be tracked.
A manager can distinguish unattended enquiries from enquiries already being handled.

The Agent improves lead management by creating visibility, assignment and accountability for customer requests requiring human sales help.


#### Increasing Average Order Opportunity

The DIY PC package flow presents a full bundle with the included components. This gives the customer visibility into the complete configuration rather than focusing on only one component.
The business opportunity is that a customer who begins with a general need may be guided towards a fuller solution.

For example:
A customer asking about a processor may need a compatible motherboard.
A customer asking about memory may be considering an upgrade package.
A customer asking for a gaming PC may require a complete configuration.
A customer purchasing hardware may also require setup or onsite service.

The Agent can surface suitable options without requiring the representative to repeat the same package explanation for every customer.
However, the proposal should not claim that average order value will definitely increase until this is measured. It is more accurate to state:
The guided package and service journeys create an opportunity to increase the completeness of customer purchases. Average order value should be tracked during the pilot to determine the actual effect.


#### Supporting Repeat Business

The same customer may later return for delivery tracking, warranty assistance, repair booking or another purchase. By supporting these after-sales interactions within the same conversational channel, the business makes it easier for the customer to continue the relationship.

A customer can use the Agent to:
Check delivery progress
Review warranty status
Request repair assistance
Book onsite service
Arrange a carry-in appointment
Contact a human representative

This creates the foundation for improved retention because the customer does not need to search for a separate department or communication channel. The project does not presently provide verified repeat-customer or retention results. Repeat-customer behaviour should therefore be treated as a future measurement area rather than an achieved outcome.


### Service Value


#### Faster First Response

The Agent is designed to provide an immediate initial response for supported enquiries. This improves the customer experience because the customer is acknowledged without waiting for a staff member to become available.

The business value includes:
Reduced uncertainty for the customer
Faster access to routine information
Continuous engagement during product selection
Immediate confirmation that a human request has been recorded
Reduced abandonment while waiting for an initial answer

The earlier write-up proposes a target first-response time of fewer than five seconds. This should remain a target until response-time data is recorded in the pilot.


#### More Consistent Answers

Consistency matters when customers ask about prices, availability, warranty, delivery or service conditions.

The proposed Agent uses approved structured data for these answers. This means the expected response does not depend on:
Which representative is working
Whether the representative remembers the information correctly
Whether the representative has the newest version of a document
How busy the representative is
Which language the customer selected

The Agent is also designed to avoid inventing information. If a supported answer cannot be found confidently, the matter is escalated.

This creates a stronger customer promise:
The Agent provides an approved answer or transfers the enquiry to a person. The Agent does not guess information involving price, stock, delivery or warranty.


#### Multilingual Accessibility

The prototype supports English, Chinese and Bahasa Melayu across its customer-facing flows. Customers can use automatic language detection or select a language using a numbered picker.


Figure 2.2 Customers can select a supported language through a simple numbered interface

The service value includes:
Reduced language friction
Clearer navigation
A more inclusive experience
More consistent terminology
Less dependence on the language ability of the available staff member
Easier self-service across the supported customer journeys

The customer can also use menu, home and back navigation within supported flows, reducing the risk of becoming stuck during a multi-step interaction.


#### Convenient Self-Service

Customers do not always need a conversation with a representative. Some primarily want a quick factual answer.


Figure 2.3 BIS Computer Service Self-Service screen

Figure 2.3 shows that the Agent provides self-service for several frequently needed tasks:
Product availability
Price checking
Delivery status
Warranty status
Onsite booking
Carry-in booking
Business information
Product selection
Basic sales progression

For example, the delivery-status function allows a customer to retrieve the relevant delivery information using supported identifying details. The warranty function can identify a matching synthetic demonstration record and provide the product, status, expiry and service options.


Figure 2.4 Delivery Status screen



#### Preserving the Human Touch

The Agent is not intended to become a barrier between the customer and the business.

A human representative remains available when:
The customer explicitly asks for a person
The Agent is uncertain
The request is sensitive
The situation involves negotiation
The customer requires personalised advice
A complaint or exception occurs
A complex technical issue needs investigation

The dashboard enables the representative to review the conversation, respond within the same customer thread and resolve the matter with attribution. The project materials describe a lifecycle in which an enquiry can move through pending, assigned, in progress and resolved states.

Figure 2.5 Dashboard screen (Human in the loop features)

Figure 2.5: The human takeover console allows staff to manage enquiries that require judgement or personalised assistance.

This hybrid approach combines the speed of automation with the trust and flexibility of human service.


### Risk and Control Value


#### Reducing Incorrect Price and Stock Information

The project deliberately separates natural-language interpretation from business facts.
The AI layer may help understand what the customer is asking for, but the reply involving price, stock, delivery or warranty must come from structured business records.

This reduces the risk of:
Fabricated prices
Unsupported stock claims
Incorrect warranty status
Inconsistent product details
Unverified delivery information


Where the available information is insufficient, the Agent escalates instead of guessing.
This design supports the business principle that a careful human handoff is preferable to a confident but incorrect automated answer.


#### Improving Transaction Traceability

The system creates structured references for major customer journeys, including quotation, order, invoice, delivery and booking records.

The current design uses reference formats for:
Quotations
Orders
Invoices
Delivery orders
Onsite bookings
Carry-in bookings

The project also records enquiry and escalation states. This strengthens traceability because staff can refer to a specific transaction or service request instead of relying only on a long chat history.

The business value includes:
Easier follow-up
Clearer ownership
Better record matching
Faster investigation of customer questions
Stronger auditability
Better measurement of operational performance


#### Maintaining Human Approval

Human approval remains important for high-impact decisions. The project materials identify approval requirements for matters such as:
Moving from the simulated channel to the live WhatsApp Business Cloud API
Connecting a live payment provider
Changing approved FAQ content
Modifying server or firewall settings
Closing escalated customer matters
Handling complaints or sensitive cases

The proposal therefore does not present automation as uncontrolled independence. Automation operates inside defined boundaries, and people remain accountable for content, infrastructure, live financial integration and exceptional customer cases


#### Protecting Payment Integrity

The current payment journey is simulated. It is not connected to a bank, does not process a real charge and is intended only to demonstrate the end-to-end business workflow.

The prototype applies several payment integrity controls:
Payment is not treated as completed without the test gateway callback.
Order, invoice and delivery records are created only after payment confirmation.
Payment value comes from the stored quotation.
Repeating the same completion action should not create duplicate orders.
The intended production pathway uses a certified payment provider.



Figure 2.5 Secure Payment screen

These controls demonstrate that the team has considered financial workflow integrity even though the current payment edge remains simulated.

The final report and presentation should continue to label this clearly as a simulated payment gateway with no real charge.


#### Protecting Customer Information

The demonstration uses synthetic customer and warranty data. This allows the functions to be tested while reducing the risk of exposing actual personal information.


Figure 2.6 checking customer’s warranty status

The current proposal also states that a warranty record is returned only when the enquiry matches the relevant record, rather than listing other customer records.


For production, the project will still require stronger controls, including:
Dashboard authentication
Authorisation based on staff role
Managed database access controls
Secure transport
Data retention rules
Monitoring and logging
Formal privacy and security review

These are roadmap requirements rather than capabilities that should be claimed as fully completed today.


### Scalability Value


#### Supporting More Enquiries


The Agent can handle supported routine interactions without requiring a representative to respond manually to each one. As enquiry volume grows, the automated share can absorb much of the routine demand. The human team can then focus on complex sales, exceptions and service cases.

Scalability should be measured through:
Total interactions
Peak concurrent interactions
Auto-answer percentage
Escalation rate
Average staff handling time
Platform response time
Error rate
Operating cost per interaction

No specific production capacity should be claimed until load and concurrency tests are performed.


#### Supporting Cross-Functional Customer Journeys

The Agent is not limited to one department or one use case. The prototype currently spans:
Sales
Product enquiry
Ordering
Payment simulation
Delivery
Warranty
Onsite service
Carry-in service
Human customer support

A single customer conversation can move between these functions without requiring the customer to search for another channel. This creates cross-functional value because the business presents one customer-facing entry point while different teams can manage the relevant operational activities behind it.


#### Supporting Incremental Growth

The project uses swappable interfaces for the messaging channel, payment provider and data store.

This allows the business to progress in stages:
Prototype: simulated WhatsApp, simulated payment and file-based data.
Pilot: controlled real-user testing and baseline validation.
Production: live WhatsApp, certified payment provider, authentication and managed database.
Expansion: analytics, CRM integration, broader languages and more advanced automation.

The purpose of this staged approach is to reduce the need for a complete rebuild. External services can be introduced behind interfaces that the project already uses.  The business can therefore make further investment based on measured results rather than committing to every production component at the beginning.


### Business Value by Stakeholder


Stakeholder
Current difficulty
Value created by the Agent
Customer
Waits for replies and may need to repeat information
Faster response, self-service, multilingual support and clearer next steps
Sales representative
Repeatedly searches and types routine answers
More time for consultation, negotiation and closing
Service staff
Receives incomplete or unstructured repair requests
Structured booking information and booking references

#### Business owner

Bears manpower cost and possible revenue leakage
Better use of staff, after-hours lead capture and measurable operations
Content administrator
Information may be scattered or inconsistent
Approved answers and records can be maintained centrally
Operations or DevOps
Manual services may be difficult to monitor
Deployed service, health monitoring and standardised records
Management
Limited data on enquiry outcomes
Enquiry, escalation, order and booking data for future analysis


### Business Value Summary


The Hybrid AI WhatsApp Sales and Service Assistant creates value by improving how BIS Computer Services uses its people, customer channel and operational information.

The value is created through the following connected changes:
Routine questions are handled from approved information.
Staff spend less time searching and retyping.
Customers receive a faster first response.
Supported services remain accessible beyond business hours.
Product interest can progress towards a quotation and order.
Sales leads are captured and assigned.
Delivery and warranty enquiries become self-service.
Service appointments are collected through structured flows.
Customers can interact in three supported languages.
Uncertain enquiries are transferred to a person.
Enquiry and transaction data become measurable.
The business can expand the platform gradually rather than rebuilding it.

The strongest business claim is therefore not that the Agent is an advanced piece of AI technology.

The strongest claim is that it changes the economics and quality of customer engagement:
The Agent reduces the staff effort required for routine enquiries, keeps the sales and service channel available beyond normal operating hours, guides customers towards measurable outcomes and preserves human involvement wherever judgement and trust are necessary.



## Business Impact and Outcomes


### Business Impact Overview

Section 1 defined the business problem experienced by BIS Computer Services: staff repeatedly spend time reading, interpreting, searching and replying to routine WhatsApp enquiries across product, delivery, warranty and booking information sources. Section 2 explained how the proposed Hybrid AI WhatsApp Sales and Service Assistant can create value through higher productivity, lower staff effort, stronger sales opportunities, faster customer service, better controls and improved scalability.

Section 3 now translates those business benefits into specific, measurable outcomes.
A business outcome describes the improvement that the organisation expects to achieve. A Key Performance Indicator, or KPI, is the measurable indicator used to determine whether that improvement is taking place.

The project should not be judged only by whether the Agent can answer a message or complete a demonstration flow. The project should also be judged by whether it can create measurable improvements in areas such as:
Routine enquiry automation
Staff time released
Customer first-response time
After-hours enquiry coverage
Product-enquiry progression
Quotation and order conversion
Customer self-service
Human escalation response
Information accuracy
Service-booking completion
Platform reliability
Operating cost per interaction
Capacity to handle increased enquiry volume

The central business-impact statement is:
The Agent is expected to reduce the time and staff effort required for routine WhatsApp enquiries, provide immediate coverage beyond normal operating hours, guide more customers towards measurable sales and service outcomes, and preserve human intervention for conversations that require judgement.

The project already demonstrates the technical capability to create enquiry records, assign statuses, generate transaction references, complete guided customer journeys and record representative involvement. However, the final business-effect measurements must be obtained through a controlled pilot using real operational interactions


### From Business Problem to Measurable Outcome

Each KPI should connect directly to the business problem and to a capability of the Agent.


Business problem
Agent capability
Expected business outcome
KPI
Staff manually answer repetitive enquiries
Automated answers from approved records
Less routine manual work
Auto-answer rate
Staff repeatedly search multiple sources
Structured product, delivery and warranty lookups
Less time spent retrieving information
Staff hours released
Customers wait for an available representative
Immediate automated first response
Faster service
First-response time
Messages received after hours remain unattended
Always-available automated channel
Better after-hours coverage
After-hours acknowledgement rate
Product interest may not progress
Guided selection and quotation flow
More measurable sales progression
Enquiry-to-quotation rate
Sales requests may remain unassigned
Human escalation and assignment workflow
Better lead ownership
Assignment time
Customers contact staff for routine status checks
Delivery and warranty self-service
Lower manual enquiry workload
Self-service completion rate
Different staff may provide different answers
Approved structured data and deterministic retrieval
More consistent information
Answer-accuracy rate
Uncertain cases may receive unsuitable answers
Escalate-when-unsure rule
Safer customer service
Appropriate escalation rate
Enquiries are difficult to track
Statuses, references and timestamps
Better operational visibility
Recorded-enquiry coverage
More enquiries create more staff workload
Automated routine handling
Improved operating leverage
Enquiries per staff hour

This connection is important for proposal consistency. The problem, solution, business value and KPI should describe the same business story.


### Evidence Classification

The project contains a combination of verified system capabilities, planning assumptions and projected business outcomes. These categories must remain clearly separated.


#### Verified and Demonstrable Capabilities

The following capabilities are described in the project materials as currently implemented and demonstrable:
A cloud-deployed customer chat interface
A representative dashboard
Structured enquiry records
Enquiry status handling
Product catalogue search
Product price and stock responses
Guided quotation preparation
Simulated payment processing
Order, invoice and delivery-reference creation
Delivery-status self-service
Warranty-status checking
Onsite and carry-in service booking
English, Chinese and Bahasa Melayu support
Human escalation and representative replies

These capabilities show that the system can produce the data required for later KPI measurement. They do not, by themselves, prove that the target business improvements have already been achieved.


#### Baseline Assumptions

The project does not currently have verified historical logs for the original manual WhatsApp process. Therefore, the following values should remain classified as assumptions or “to be determined during the pilot”:
Number of daily WhatsApp enquiries
Percentage of routine or repetitive enquiries
Average manual handling time
Existing first-response time
Existing after-hours enquiry volume
Number of missed sales
Existing enquiry-to-quotation conversion
Existing quotation-to-order conversion
Existing delivery-status contact volume
Existing warranty-enquiry volume
Existing customer-retention rate
Current cost per enquiry

The existing proposal uses an illustrative scenario of 120 enquiries per day, 65 per cent repetitive enquiries and three minutes of staff handling per routine enquiry. These figures are useful for planning, but they are not confirmed operational facts.


#### Projected Outcomes

The following are business targets to be evaluated during the pilot:
Automating a substantial share of routine enquiries
Reducing first-response time
Releasing staff time
Acknowledging after-hours enquiries
Progressing more customers towards quotations
Capturing sales leads more reliably
Reducing manual delivery-status enquiries
Improving information consistency
Maintaining an appropriate human escalation path
Supporting higher interaction volume without equal growth in staff effort

These should be written as targets, projections or expected outcomes, not as achieved results.

Outcome 1: Reduce Routine Manual Work

#### Intended Outcome

The first intended outcome is to reduce the share of routine WhatsApp enquiries that require a staff member to search for information and prepare an individual reply.

Supported routine enquiries include:
Product price
Product availability
Stock quantity
Delivery status
Warranty status
Business information
Service options
Repair-booking requests
Basic product-selection enquiries

The Agent can retrieve approved information and guide the customer without immediate staff involvement. This allows the human team to focus on complex recommendations, negotiations, exceptional service cases and customer relationships.

Primary KPI: Routine Enquiry Auto-Answer Rate
The auto-answer rate measures the proportion of eligible routine enquiries completed by the Agent without staff intervention.
Auto-answer rate = successfully auto-answered routine enquiries ÷ total eligible routine enquiries × 100%

Proposed target
Target: 50 to 70 per cent of eligible routine enquiries successfully handled without staff intervention.

The range is a projection and must be validated during the pilot. The current project materials use a similar automation target, but no actual SME operational result has yet been established.

Important measurement rule
The numerator should include only enquiries that are:
Answered successfully
Supported by approved data
Completed without corrective staff involvement
Not later found to contain an incorrect response

An enquiry should not be counted as successfully automated if the Agent produced an unsuitable reply and staff had to correct it.


Outcome 2: Release Staff Time for Higher-Value Work

#### Intended Outcome

The second intended outcome is to release staff time currently spent on repetitive reading, information retrieval and typing.

Released time should be redirected towards:
Complex product advice
Compatibility recommendations
Higher-value quotations
Sales negotiation
Follow-up with promising customers
Technical diagnosis
Exception handling
Complaint management
Relationship building

The project should not treat staff time savings as an automatic staff-cost reduction. The stronger business outcome is staff-capacity reallocation.

Primary KPI: Staff Hours Released
Staff hours released = estimated manual handling time avoided across successfully automated enquiries

A more detailed calculation is:
Staff hours released = number of successfully automated enquiries × baseline average manual handling time per enquiry ÷ 60






Illustrative scenario
Using the earlier planning assumptions:
Daily enquiries: 120
Assumed repetitive share: 65 per cent
Routine enquiries: 78
Assumed manual handling time: three minutes
Estimated routine workload: 234 minutes, or 3.9 hours per day

If 60 per cent of the 78 routine enquiries were successfully automated:
Approximately 47 routine enquiries would be automated.
Approximately 140 minutes of direct handling time could be released.
This is approximately 2.3 hours per day.
Over five working days, this is approximately 11.7 hours.

These values are illustrative projections. Actual staff time released must be calculated using measured baseline handling time and pilot enquiry logs.

Outcome 3: Improve Customer First-Response Time

#### Intended Outcome

The Agent should reduce the time between the customer sending an enquiry and receiving the first meaningful response.

A meaningful response may be:
An approved answer
A relevant product shortlist
A request for the next required detail
A menu that directs the customer appropriately
A confirmation that the enquiry has been escalated to a person

An automatic message that merely states “Message received” should be measured separately from an answer that helps the customer progress.

Primary KPI: First-Response Time
First-response time = timestamp of first useful response minus timestamp of customer enquiry

Proposed target
Target: Fewer than five seconds for supported automated enquiries.
This is a proposed target from the existing write-up and should be validated under pilot conditions.

Human escalations should have a separate service measure because they depend on staff availability.

Supporting Response-Time Measures
Median automated first-response time
90th-percentile automated response time
Average human escalation response time
Percentage of supported enquiries answered within five seconds
Percentage of escalated enquiries acknowledged immediately
Percentage of human escalations answered within the agreed service level
Response time during business hours
Response time outside business hours
Response time by enquiry category
The median and percentile measurements are recommended analytical measures. They are not current results from the attached documents.

Outcome 4: Improve After-Hours Coverage

#### Intended Outcome

The Agent should ensure that supported after-hours enquiries are no longer left completely unattended until the next working period.

After-hours coverage can include:
Immediate acknowledgement
Product search
Price and stock response
Quotation preparation
Delivery-status lookup
Warranty lookup
Service-booking initiation or completion
Recording a request for human assistance
Progressing the demonstrated transaction journey

Outcome 5: Increase Measurable Sales Progression

#### Intended Outcome

The Agent should help more product enquiries progress towards clearly recorded commercial actions.
These actions include:
Product selection
Quantity confirmation
Quotation creation
Quotation confirmation
Payment-method selection
Test payment completion
Order creation
Invoice creation
Delivery-order creation

The current prototype demonstrates these stages, but business conversion improvements must be established using actual pilot data.

Revenue Measurement
Once real payment and transaction data are available, the business can measure:
Revenue from Agent-assisted orders
Revenue from after-hours orders
Average order value
Revenue per product enquiry
Revenue per quotation
Human-assisted sales revenue
Repeat-customer revenue
Package sales compared with individual-component sales

The current simulated payment flow cannot be used to claim actual revenue. It demonstrates the transaction logic only.


Figure 2.7 Itemised Quotation with Reference

Figure 2.7 shows that the guided sales flow records product selection and progresses the customer towards an itemised quotation.

This screenshot shows a measurable step in the sales funnel between a general enquiry and an order.

What the figure proves:
The customer can receive relevant product choices.
The Agent can guide the customer towards a selection.
The customer journey contains measurable intermediate stages.
Product enquiry and quotation activity can be recorded separately.

The Agent creates a structured and measurable path from customer interest to quotation.


Figure 2.8 Simulated Payment Confirmation and Transaction References

Important disclosure:
The current payment journey uses a simulated test gateway. No CVV is collected, no bank is connected and no real charge is made.

This figure supports the measurement story by showing that structured records can be exported or reviewed rather than remaining only in unstructured conversations.

What the figure proves:
The prototype uses structured records.
Data can support operational review and future KPI reporting.
Business outcomes can be connected to reference records.

What the figure does not prove:
It does not prove actual sales revenue.
It does not prove a particular conversion increase.
It does not represent live payment settlement.

The platform creates the data foundation needed to measure customer progression and transaction outcomes.


Outcome 6: Improve Sales Lead Ownership

#### Intended Outcome

When a customer asks to speak to sales, the request should become a visible and accountable work item.


Figure 2.9 Administrator’s Dashboard screen

The project describes an enquiry lifecycle that includes:
Pending: The enquiry is waiting for staff attention.
Assigned: A named representative has ownership.
In progress: A representative has replied or begun handling the case.
Resolved: The enquiry has been completed and closed.
The dashboard can record who is handling the enquiry and who resolved it.

Outcome 7: Increase Customer Self-Service

#### Intended Outcome

Customers should be able to complete selected routine activities without contacting a staff member directly.


Figure 3.0 BIS Computer Service welcome screen

The prototype includes self-service support for:
Product availability
Product price
Delivery status
Warranty status
Onsite service booking
Carry-in service booking
Business information
Initial product selection
Successful self-service can provide both customer convenience and staff-capacity benefits.

Primary KPI: Self-Service Completion Rate
Self-service completion rate = successfully completed self-service journeys ÷ started eligible self-service journeys × 100%
This should be calculated separately for each journey because the difficulty and number of required steps differ.


Recommended categories include:
Product availability
Delivery status
Warranty status
Onsite booking
Carry-in booking
Product selection
Quotation preparation


Figure 3.0 Delivery-Status Self-Service Result

Figure 3.0 shows that the agent retrieves a matching delivery record and provides the delivery-status information through the customer conversation.
This screenshot demonstrates a routine after-sales enquiry that can be completed through self-service.

What the figure proves:
The delivery-status journey exists in the working prototype.
The Agent can retrieve a matching delivery record.
The customer can obtain information without a manual staff reply.
The interaction can be counted as a completed self-service journey when successful.

The platform can reduce selected routine after-sales contacts through customer self-service.


Figure 3.1 Warranty Status and Service Handoff

Figure 3.1 shows that the agent returns a matching warranty result and provides options for onsite service, carry-in service or human assistance.

This screenshot shows that customer self-service can continue into an appropriate after-sales action rather than ending with only a status message.

What the figure proves:
A matching warranty record can be retrieved.
Warranty status and coverage information can be presented.
The customer can continue towards a repair or human-support route.
Warranty lookup and service handoff can be measured as separate journey stages.

The warranty records used in the demonstration are synthetic and do not contain real customer data.

The Agent can connect self-service information retrieval to a structured service outcome.

Outcome 8: Improve Information Accuracy and Consistency

#### Intended Outcome

Customer information involving price, stock, delivery and warranty should be retrieved from approved business records rather than estimated or invented.

The project uses deterministic services for these business facts. The AI layer assists with interpreting natural language and images, but it does not override the approved values for price, stock, delivery or warranty


Outcome 9: Preserve Human Control

#### Intended Outcome

The Agent should reduce routine workload without preventing customers from obtaining human assistance.

Human involvement remains necessary when:
The customer asks for a person
Confidence is insufficient
The request is complex
The case is sensitive
Negotiation is needed
A complaint is raised
Personalised advice is required
A non-standard exception occurs

The project includes a two-way dashboard console through which a representative can review the conversation, respond to the customer and close the enquiry with attribution.


Figure 3.2 Two-Way Human Reply Reaching the Customer (I)




Figure 3.3 Two-Way Human Reply Reaching the Customer (II)

A representative can review an escalated enquiry and reply to the customer through the same conversation.

This screenshot supports the human-control outcome and demonstrates that automation does not become a barrier to personalised service.
What the figure proves:
Escalated enquiries are visible to staff.
A representative can review the customer context.
A human reply can be sent through the customer conversation.
The enquiry can move into an active handling state.
Human actions can be attributed.

What the figure does not prove:
It does not prove that every escalation is handled within the target time.
It does not prove customer satisfaction.
It does not demonstrate production dashboard authentication.

The proposed operating model combines routine automation with a visible and measurable human escalation path.


Outcome 10: Improve Service-Booking Completion

#### Intended Outcome

The Agent should convert unstructured repair requests into more complete and traceable booking records.

The existing prototype supports both onsite and carry-in booking flows. The process collects required information step by step and creates a reference after completion


Figure 3.4 Confirmed Service Booking with Reference


Figure 3.4 shows that the completed carry-in service journey provides the customer with an appointment confirmation and traceable booking reference.

This screenshot demonstrates the completed state that can be counted when measuring the service-booking completion rate.

What the figure proves:
The customer can complete the guided booking journey.
A confirmed booking state exists.
A booking reference is generated.
The service request can be traced after completion.

The Agent can convert a general repair request into a structured and measurable service outcome.

Outcome 11: Strengthen Operational Visibility

#### Intended Outcome


The business should be able to understand what is happening across customer enquiries instead of relying only on individual WhatsApp conversations.

The system records enquiry status and related customer-journey information. The project materials describe states including pending, assigned, in progress and resolved, together with representative attribution and reference details

Management Dashboard Outcome

The prototype dashboard provides the underlying operational view for managing enquiries. A future KPI dashboard can summarise the same structured records into management measures.

Figure 3.5 Enquiry Status and Reference Dashboard

Figure 3.5 shows that the enquiry dashboard records customer enquiries, workflow status and reference information for operational monitoring.

This screenshot shows the data source behind the proposed KPI reporting.

What the figure proves:
Enquiries can be recorded in a structured view.
Workflow statuses are visible.
Reference identifiers support traceability.
The data required for several operational KPIs is available.

What the figure does not prove:
It does not prove achievement of the target KPIs.
It does not provide a completed management analytics dashboard.
It does not replace the need for pilot baseline data.

The platform creates structured operational data that can support management reporting and continuous improvement.

Consolidated KPI Framework

Business outcome
KPI
Baseline
Proposed target
Measurement source
Reduce manual work
Routine auto-answer rate
0% if fully manual
50 to 70% of eligible enquiries
Enquiry logs
Release staff capacity
Staff hours released
To be measured
Pilot validated
Enquiry count and time study
Improve response speed
Automated first-response time
To be measured
Fewer than 5 seconds
Message timestamps
Improve after-hours coverage
Valid enquiries acknowledged
To be measured
100%
After-hours enquiry logs
Improve sales progression
Enquiry-to-quotation rate
To be measured
Pilot validated
Enquiry and quotation records
Improve conversion
Quotation-to-order rate
To be measured
Pilot validated
Quotation and order records
Improve lead ownership
Sales requests assigned
Not structured
Target to be approved
Dashboard status records
Improve human follow-up
First human response time
To be measured
Within 10 minutes during staffed hours, proposed
Escalation and reply timestamps
Increase self-service
Journey-completion rate
To be measured
Pilot validated by journey
Delivery, warranty and booking logs
Improve information quality
Correct-or-escalate rate
To be measured
100% target for reviewed price and stock cases
Quality review
Improve booking efficiency
Booking completion rate
To be measured
Pilot validated
Booking records
Maintain technical quality
Automated test pass rate
Existing test suite
100% of the final suite passing
Final test report
Improve operational visibility
Enquiries with status and reference
Not structured in manual process
100% of valid Agent interactions recorded
Dashboard and enquiry records
Improve scalability
Enquiries handled per staff hour
To be measured
Improvement over baseline
Enquiry and staff-time data

All targets in this table remain proposed targets until validated through the pilot, except demonstrable technical results confirmed by the final test run.

KPI Definitions and Measurement Rules
To avoid misleading results, the project team should apply consistent definitions.

Valid enquiry
A customer message containing enough information to be accepted by the system for processing.

Eligible routine enquiry
An enquiry belonging to a supported category that the Agent is designed to answer using approved data or a defined guided flow.

Successfully auto-answered enquiry
An eligible enquiry completed without human intervention and without later correction.

Escalated enquiry
An enquiry transferred to a human because of explicit customer request, insufficient confidence, sensitivity, complexity or a defined workflow event.

Meaningful first response
A response that answers the question, provides relevant choices, requests necessary information or confirms a human handoff.

Completed self-service journey
A supported journey that reaches its defined successful end state, such as:
Product information returned
Delivery status returned
Warranty status returned
Quotation created
Booking confirmed

After-hours enquiry
An enquiry received outside the business hours formally defined and approved by BIS Computer Services.

Correct automated answer
A response that matches the approved business record and the customer’s intended request.

Appropriate escalation
A transfer to a human where the Agent lacks sufficient approved information, confidence or authority to respond safely.

Clear definitions prevent the team from increasing the reported automation rate by counting incomplete, corrected or unsuitable responses as successful.



### Pilot Measurement Plan

Stage 1: Establish the Manual Baseline
Before or at the beginning of the pilot, record a representative sample of the existing process.

For each enquiry, record:
Enquiry timestamp
Enquiry category
Customer language
First-response timestamp
Final-response or completion timestamp
Staff handling time
Number of information sources checked
Whether follow-up was required
Whether a quotation was created
Whether an order was created
Whether a booking was created
Whether the enquiry arrived after hours

This creates the “before” baseline.

Stage 2: Run the Controlled Pilot
During the pilot, record:
Total Agent interactions
Supported and unsupported enquiry categories
Automated responses
Human escalations
Escalation reasons
First-response times
Representative assignment times
Human reply times
Self-service completions
Journey abandonment
Quotations
Orders
Bookings
Delivery lookups
Warranty lookups
Incorrect or incomplete responses
Technical errors

Stage 3: Review Quality
A sample of Agent interactions should be reviewed by an authorised staff member.

The review should verify:
Correct enquiry interpretation
Correct language
Correct catalogue information
Correct price and stock information
Correct delivery result
Correct warranty result
Appropriate next step
Appropriate escalation
Absence of unsupported claims

Stage 4: Compare Outcomes
Compare the manual baseline with the pilot results for:
Staff hours spent on routine enquiries
First-response time
After-hours coverage
Enquiry-to-quotation rate
Quotation-to-order rate
Self-service completion
Human response time
Incorrect-answer rate
Enquiry volume per staff hour
Cost per interaction

Stage 5: Decide Whether to Scale
The business should proceed towards production only when the pilot demonstrates that:
Routine enquiries are handled reliably
Staff time is meaningfully released
Customers can complete key journeys
Human escalations are manageable
Incorrect-answer risk is controlled
Operating costs are acceptable
Production security requirements can be met
Staff and content owners can maintain the solution


### Outcome Ownership

Each major outcome should have a business owner who is responsible for reviewing the result and taking corrective action.

ach major outcome should have a business owner who is responsible for reviewing the result and taking corrective action.
Outcome area
Suggested owner
Responsibility
Overall business impact
Project Owner
Approve targets and review pilot outcome
Product and FAQ accuracy
Content Administrator
Maintain approved answers and catalogue content
Sales progression
Lead Sales Representative
Review leads, quotations and conversion process
Human escalation
Sales and service team
Assign, reply and resolve enquiries
Booking completion
Service team
Review booking quality and operational readiness
Infrastructure reliability
DevOps
Maintain deployment, monitoring and recovery
KPI reporting
Project Owner with business owner
Review performance and approve scaling decision
Customer experience
Business owner and service representatives
Review journey completion and customer feedback

The existing documents identify project roles for ownership, content administration, sales and DevOps. The final proposal should use the same team names and titles consistently across every section.


### Risks to Outcome Measurement

The project team should recognise several risks that could make the KPI results misleading.

Small pilot sample
A small number of interactions may produce unstable percentages. Report the actual number of interactions together with each percentage.

Synthetic demonstration data
The prototype uses synthetic warranty and customer records. Functional success with synthetic data does not prove production customer-data performance.

Simulated payment
The current payment process does not represent actual financial settlement. Test orders should not be reported as sales revenue.

Selection bias
A pilot involving only technically confident users may produce a higher completion rate than wider customer use.

Novelty effect
Customers may explore the Agent because the system is new. Early interaction volume may not represent long-term behaviour.

Staff learning effect
Human response time may improve as staff become familiar with the dashboard. Initial pilot results should therefore be reviewed over different stages.

Incorrect automation denominator
The auto-answer rate should use eligible routine enquiries as the denominator rather than all customer messages.

Counting acknowledgements as resolutions
An immediate acknowledgement is useful but should not be counted as a completed customer outcome unless the request is actually resolved.

Inconsistent test count
This has been resolved. The single verified figure is 348 automated tests across 19 suites, and it is used consistently across this proposal, the technical documentation, the presentation and the demonstration. (An earlier draft quoted 340; that number has been superseded.)


## Feasibility and Scalability


### Feasibility and Scaliability Overview

Sections 1 to 3 established the business problem, explained the value created by the proposed Agent and defined the measurable outcomes expected from the project.

Section 4 addresses the next question that judges are likely to ask:
Can the proposed solution operate beyond the hackathon or demonstration, and can the business expand it safely when customer demand grows?

A technically impressive prototype may still fail if it cannot be maintained, secured, monitored, integrated or scaled. Therefore, feasibility and scalability must be assessed from both a business and technical perspective.

For this proposal:
Feasibility means that the solution has the data, technology, processes, people and controls needed to operate in a real business environment.
Scalability means that the solution can support more users, enquiries, transactions, business functions and operating requirements without requiring a complete rebuild.

The project has several characteristics that support feasibility:
A working customer-chat interface
A working representative dashboard
A deployed application on AWS Lightsail
Product, delivery and warranty data
Guided sales and service workflows
Human escalation
Automated testing
Swappable messaging, payment and data-storage interfaces
A defined roadmap from prototype to pilot and production

However, the present version remains a demonstration system. The WhatsApp channel and payment gateway are simulated, the representative dashboard does not yet include production authentication, image recognition can be limited by the available provider quota, and the present file-based data store will need to be strengthened as usage grows. These limitations are already identified in the project materials and should be presented honestly as controlled roadmap items rather than hidden weaknesses.

The feasibility and scalability position can be summarised as follows:
The core customer journey has been built, deployed and tested. Production readiness will be achieved by replacing the simulated external edges with approved live services, strengthening authentication and data storage, validating business assumptions through a pilot and introducing monitoring, governance and operational support in controlled stages.


### Feasibility and Scalability at a Glance

Area
Current prototype position
Requirement for pilot or production
Feasibility approach
Customer channel
Simulated WhatsApp-style browser interface and webhook
Official WhatsApp Business Cloud API
Replace the sender interface at the system boundary
Payment
Simulated test gateway
Certified payment provider
Replace the payment interface while preserving the order process
Hosting
Deployed on AWS Lightsail and managed by PM2
Monitoring, backup and production hardening
Strengthen the existing deployment incrementally
Data
Structured records using file-based storage
Managed database for higher volume and durability
Replace the data-store implementation behind the abstraction
Product knowledge
Catalogue, delivery, warranty and FAQ data available
Approved ownership and update procedures
Assign accountable content owners
Human support
Two-way representative dashboard
Authentication, authorisation and service procedures
Add production access controls and escalation service levels
Languages
English, Chinese and Bahasa Melayu
Ongoing content checking and expansion where justified
Maintain approved language content and track fallback rates
AI understanding
Natural-language and image interpretation with fallback
Dedicated provider capacity and monitoring
Preserve deterministic answers for critical facts
Testing
Automated testing across 19 suites
Final verified test count and continuous regression testing
Run the complete suite before every release
Measurement
Enquiries and statuses can be recorded
Pilot baseline and KPI dashboard
Use structured records to validate outcomes
Governance
Defined owners and human approval points
Formal operating, privacy and incident procedures
Introduce controls before production go-live
Expansion
Multiple sales and service journeys supported
Load testing and infrastructure scaling
Scale based on measured demand


### Feasibility of the Current Solution


#### The Solution Is More Than a Concept

The feasibility case begins with an important distinction: the proposed Agent is not only a presentation concept.

The project materials describe a deployed application containing:
A customer-facing chat interface
A numbered customer menu
Product search
Price and stock responses
DIY PC package selection
Guided quotations
Simulated payment
Order, invoice and delivery-reference creation
Delivery-status lookup
Warranty-status lookup
Onsite repair booking
Carry-in repair booking
English, Chinese and Bahasa Melayu interaction
Human escalation
A representative reply console
Automated functional testing

This matters because the technical and operational claims can be demonstrated directly. The judges do not need to rely only on mock-up slides or future promises. The present system can show the complete logical customer journey, even though some external services remain simulated.


#### Live Cloud Deployment

The prototype is deployed on an AWS Lightsail Ubuntu instance and is kept running through PM2. The project materials identify reachable customer-chat, dashboard, test-payment and health-check endpoints. The health endpoint is intended to return a successful status when the service is operating.

The cloud deployment supports feasibility because it demonstrates that:
The application can operate outside a developer’s local computer.
The customer and representative interfaces can be accessed through a network.
The service can remain active independently of the development environment.
The deployment can be checked through a health endpoint.
The application process can be managed and restarted through PM2.

The present deployment should still be described as a demonstration deployment, not a fully hardened production environment. The project materials state that the application presently uses a public IP over HTTP and that a custom domain was not retained for the demonstration.

Production implementation should require, at minimum:
A production domain
HTTPS encryption
Authentication
Authorisation
Managed secrets
Backup and recovery
Security monitoring
Application and infrastructure logging
Defined support ownership
An incident-management process

These are recommended production controls. They are not claimed as completed prototype capabilities.


Figure 3.6: Cloud Service Health Check


Figure 3.6 shows that the health endpoint provides visible evidence that the prototype application is deployed and responding from its cloud environment.
To show that the project is running as a deployed service rather than only on a development machine or presentation slide.

What the figure proves:
A deployed application endpoint exists.
The service can return a health response.
The project has a basic method for checking whether the application is responding.
The cloud-deployment claim can be demonstrated.

What the figure does not prove:
A formal production availability percentage
Full production security
Automatic disaster recovery
Production monitoring coverage
The ability to support a stated number of simultaneous customers

The prototype has progressed beyond a local demonstration and is capable of operating in a cloud environment.


### Data and Knowledge Feasibility


#### Structured Data Required by the Agent


The Agent depends on maintained business data rather than generating critical information independently.

The prototype data includes:
979 catalogue items
829 individual computer components
150 DIY PC packages
72 processors used for natural-language CPU searches
60 delivery records
50 synthetic warranty records
Frequently asked question content
Customer enquiries created during use
Quotations, orders, invoices and payment records
Onsite and carry-in booking records

for demonstration. These values describe the demonstration dataset and should not be presented as a live retailer’s actual inventory.

The presence of structured data supports feasibility because the Agent has clear sources for product, price, stock, delivery and warranty responses.

However, a production system is only as reliable as the information maintained by the business. Product prices, stock quantities, service information, business hours, delivery status and warranty records must remain current.


#### Data Ownership

Every important dataset should have a named business owner.
Data or knowledge area
Suggested owner
Main responsibility
Product catalogue
Content Administrator
Maintain approved product names, categories and descriptions
Price information
Business Owner or authorised sales owner
Approve price changes
Stock availability
Inventory or authorised sales owner
Maintain current quantities and availability
Frequently asked questions
Content Administrator
Review approved answers and language versions
Delivery records
Delivery or operations owner
Update status, delivery window and fulfilment details
Warranty records
Service owner
Maintain coverage and service information
Service options
Service owner
Maintain service types, fees, dates and available slots
Customer escalations
Sales and service team
Assign, reply and resolve cases
Technical configuration
DevOps
Maintain deployment, environment settings and secrets
KPI data
Project and business owner
Review definitions, quality and reporting

The existing project materials assign responsibilities to the project owner, content administrator, lead sales representative and DevOps role. The final proposal should use the same names and titles consistently throughout all sections.


#### Data Maintenance

Production feasibility requires a clear maintenance process.

The project should define:
Who may add a product
Who may change a price
Who may change a stock quantity
Who approves FAQ information
How language versions are reviewed
How outdated information is identified
How delivery records are updated
How warranty information is corrected
How changes are recorded
How incorrect data is rolled back
How frequently important content is reviewed

The current prototype includes a data-store abstraction and an FAQ management capability, but the final production process and access controls remain to be established.

A feasible operating principle is:
The Agent may retrieve and present approved business information, but authorised people remain responsible for maintaining and approving that information.


#### Deterministic Information Retrieval

The solution uses deterministic lookups for information involving:
Price
Stock
Product catalogue
Delivery status
Warranty
Quotation calculations
Booking details
Transaction references

The AI layer is used for interpreting unclear natural language or images. The project materials state that AI does not override price, stock or warranty information.

This supports feasibility because business-critical values remain connected to approved data rather than open-ended model generation.


### Technology Feasibility


#### Application Architecture


The system is described as a Node.js and Express application with a layered design.
The project materials describe:
Routes exposing the application interfaces
Controllers translating web requests
Services containing the business logic
A data-store abstraction
A sender interface
A payment interface
Customer and representative browser pages
Automated tests using Jest and Supertest

The architecture separates core business rules from externally dependent components. This supports maintainability because the product, booking, warranty, delivery and escalation rules do not need to be rebuilt when an external service changes.


#### Enquiry Processing Pipeline


The project materials describe a common enquiry pipeline in which an inbound customer message is:
Received and validated
Recorded
Checked for customer language
Checked for navigation instructions
Routed according to conversation state and enquiry content
Answered or escalated
Returned through the selected sender
Made available for inspection

A shared enquiry pipeline supports feasibility because different customer journeys follow a controlled processing structure rather than independent and inconsistent implementations.


### Messaging-Channel Feasibility


#### Present Position


The prototype uses a simulated WhatsApp-style browser interface and webhook. This allows the complete conversational flow to be demonstrated without waiting for official platform approval.
The project materials state that the official WhatsApp Business Cloud API remains part of the production roadmap.

The simulated channel demonstrates:
Message receipt
Menu presentation
Language selection
Product enquiry
Guided sales
Delivery lookup
Warranty lookup
Booking
Escalation
Representative reply
It does not demonstrate that a real customer can currently message an official WhatsApp Business number through this implementation.


#### Production Transition

The production step is to connect the official WhatsApp Business Cloud API behind the existing sender interface.
The project materials state that the channel mode can be changed without altering the core language, FAQ, quotation, booking, warranty or payment logic.

Production readiness will also require:
Approved business account and channel configuration
Webhook verification
Secure credentials
Approved message handling
Monitoring of message failures
Customer-consent and privacy review
A process for unavailable or delayed messaging services

These are recommended production requirements, not completed prototype capabilities.


### Payment Feasibility


#### Present Test Payment

The prototype uses a simulated payment gateway.

The existing project materials explicitly state:
No real money moves.
No bank or card network is connected.
The page does not request a CVV.
The payment result is used to demonstrate order, invoice and delivery-record creation.
Production implementation would use a certified payment provider.

This is an important proposal-quality disclosure. The test gateway should not be presented as a limitation that was overlooked. It should be presented as a deliberate method for demonstrating the complete business process without handling sensitive live payment details.

Figure 3.7: Simulated Test Payment Gateway

Figure 3.7 shows that the demonstration uses a simulated test payment page to verify the transaction workflow without processing a real financial charge.
Simulated test gateway only. No CVV is collected, no bank is connected and no real charge is made.

To demonstrate the payment step honestly while clearly separating workflow validation from live financial processing.
What the figure proves:
The customer payment stage is included in the demonstrated journey.
The prototype can test the process leading to order records.
The external payment dependency has been isolated.
The project has considered the transition to a live gateway.

What the figure does not prove:
Live financial settlement
Payment-card compliance
Integration with a real bank
Production transaction security
Actual customer revenue

The complete transaction workflow can be tested without prematurely exposing the business to live-payment risk.


#### Payment Integrity Controls

The prototype payment workflow includes the following described controls:
A payment is not marked complete without a callback.
Order, invoice and delivery records are created only after payment confirmation.
The payment amount comes from the stored quotation.
Repeating the same confirmation should not create duplicate orders.
The transaction references are connected.

These controls support the feasibility of the business process.
However, a production payment implementation must use a certified provider and should not allow the application to store raw card information.


### Human-in-the-Loop Feasibility


#### Human Escalation Conditions

The Agent is designed to escalate an enquiry when:
A customer explicitly requests a person
The Agent lacks sufficient confidence
The request is sensitive
Negotiation is required
A complaint occurs
An exception arises
A supported process requires staff follow-up


Figure 3.8 Administrator’s Dashboard (Human-in-The-Loop)

This is important because no practical business Agent can safely automate every customer conversation.


#### Representative Workflow

The project materials describe a workflow covering:
Pending
Assigned
In progress
Resolved

A representative can open the enquiry, review the conversation, send a reply and close the case with attribution.

Figure 3.8 shows that the human-in-the-loop workflow transfers an enquiry to a representative when automation is unsuitable or the customer requests assistance.

To demonstrate that the Agent has an operational fallback rather than leaving an uncertain customer without support.

What the figure proves:
The solution includes a human path.
An enquiry can be escalated.
Staff can manage cases requiring judgement.
The customer process does not depend entirely on automated responses.

What the figure does not prove:
Compliance with a human-response service target
Production staffing coverage
Dashboard authentication
Staff availability at every hour


The solution is operationally feasible because uncertain or complex enquiries can be transferred to people.


### Security, Privacy and Governance


#### Present Security Position

The project materials describe:
Synthetic customer and warranty data
Secrets stored outside the source repository
Key-based SSH access
Limited application-port exposure
Deterministic handling of business-critical facts
Human approval for live integrations
Per-enquiry error handling

These controls support a safer demonstration.
However, the current dashboard has no production authentication, the demonstration uses HTTP through a public IP and the file-based store is not yet a production database. These points must be corrected before handling real customer conversations or financial activity.


#### Production Governance Requirements

Before production, the business should implement:
User authentication
Role-based authorisation
HTTPS
Secure credential storage
Audit logging
Data-retention rules
Backup and recovery
Privacy assessment
Access review
Incident reporting
Change approval
Content approval
Vendor review
Payment-provider security review
Monitoring and alerting

These are recommended controls. The attached materials do not state that all of these controls are already implemented.


#### Human Approval Points

Human approval should remain mandatory for:
Live WhatsApp activation
Live payment activation
Price-policy changes
FAQ changes
Infrastructure and firewall changes
Major deployment changes
Sensitive customer cases
Complaints
Changes to escalation thresholds
Access to customer records
Pilot-to-production approval

The existing project materials already identify approval responsibilities for live messaging, live payment, FAQ changes, server changes and escalated customer matters.


### Scalability of Users and Transactions


#### Enquiry-Volume Scalability

The Agent can process supported routine enquiries without requiring a representative to prepare each response manually. This creates the opportunity to handle more customer interactions without matching growth in routine staff effort.

However, scalability should not be claimed only from the software design. The pilot and technical testing should measure:
Total daily interactions
Peak hourly interactions
Simultaneous interactions
Response time under load
Error rate under load
Auto-answer rate
Escalation rate
Human backlog
Infrastructure usage
Cost per interaction

The attached reports do not state a verified maximum customer or transaction capacity. Therefore, the proposal should not invent one.



### Cross-Functional Scalability


#### Current Functional Coverage

The prototype supports customer journeys across:
Product enquiry
Product availability
DIY PC packages
Quotation
Simulated payment
Ordering
Delivery tracking
Warranty checking
Onsite booking
Carry-in booking
Human sales support
Human service escalation

This gives the project cross-functional reach beyond a simple customer-service chatbot.


Figure 3.9 Order Computer components with payment Cross-Functional Reference

Figure 3.9 shows that the platform connects customer sales, delivery, warranty and repair-service journeys through structured records and references.

To demonstrate that the solution can support workflows across more than one business function.
What the figure proves:
The prototype covers multiple customer-service domains.
Service journeys can produce structured outcomes.
A customer can continue from information retrieval to a related action.
The system provides a base for cross-functional expansion.

What the figure does not prove:
Integration with a live enterprise resource planning system
Integration with a live customer relationship management platform
Unlimited departmental expansion
Production performance at enterprise scale

The proposed Agent can support connected sales, fulfilment and after-sales workflows.


### Language and Content Scalability


The prototype supports English, Chinese and Bahasa Melayu across major customer journeys. The project materials describe a numbered language selector, automatic language detection and navigation support.

Adding more languages requires more than translating the menu. Each new language should cover:
Navigation
Product-selection prompts
Quotations
Payment instructions
Booking questions
Warranty replies
Delivery responses
Escalation acknowledgements
Error messages
Human handoff messages



Language expansion should occur only when customer data shows a business need.
Each language should be reviewed for:
Meaning

### Clarity

Technical terminology

#### Consistency

Cultural appropriateness
Fallback behaviour
Human escalation wording


Figure 4.0 Language Selection screen

The project should also measure language-detection errors and manual language-switching frequency.


### Transition from Prototype to Pilot to Production

Stage 1: Prototype
The current prototype position includes:
Deployed cloud application
Simulated customer messaging
Simulated payment
File-based data store
Product and service journeys
Human takeover console
Three supported languages
Automated testing
Synthetic customer and warranty records,

The prototype demonstrates the end-to-end logic and provides evidence for the judging process.


Stage 2: Controlled Pilot
The pilot should focus on validating the business case and operating model.
Pilot activities should include:
Confirm the SME’s real workflow
Measure the manual baseline
Use selected business-approved data
Test with a controlled user group
Record response times
Measure the auto-answer rate
Measure the escalation rate
Review incorrect or incomplete responses
Measure journey completion
Review staff workload
Review customer feedback
Determine operating costs
Test support procedures
Review security gaps
Approve or reject movement to production

The pilot should not process real payments through the current simulated gateway.

Stage 3: Production Preparation
Production preparation requires:
Official WhatsApp Business integration
Certified payment provider
HTTPS and production domain
Representative authentication
Role-based access
Managed database
Backup and recovery
Monitoring and alerting
Production logging
Security and privacy review
Approved operating procedures
Staff training
Incident-management procedures
Confirmed content ownership
User-acceptance testing
Load and performance testing

Stage 4: Production Operation
After production approval:
Begin with controlled customer exposure.
Monitor response and error rates.
Review human escalation volume.
Review information accuracy.
Track commercial and service KPIs.
Expand customer volume gradually.
Review operating cost.
Update content based on supported evidence.
Add functions only when business value is demonstrated.


Stage 5: Business Expansion
Once stable, the business can evaluate:
CRM integration
Inventory-system integration
Management analytics
Additional languages
Improved image recognition
Additional service workflows
Multiple business locations
Customer reminders
Repeat-customer journeys
Expanded monitoring
More advanced infrastructure scaling

Each expansion should have:
A defined business problem
A named owner
Approved data
Acceptance criteria
Test coverage
A measurable outcome
A safe human fallback

Feasibility Risk Register
Risk
Potential business effect
Present control
Additional production requirement
Suggested owner
Incorrect product answer
Customer distrust or sales correction
Structured data and escalation
Data-quality and approval process
Content Administrator
Outdated stock or price
Incorrect quotation or availability
Approved data source
Live update or controlled maintenance

#### Business Owner

Wrong language
Poor customer understanding
Language selection and fallback
Quality review and detection monitoring
Project Owner
Messaging integration failure
Customer message not delivered
Simulated interface tested
Provider monitoring and retry handling
DevOps
Payment failure
Customer cannot complete purchase
Test gateway and callback logic
Certified provider and reconciliation
Business Owner and DevOps
Duplicate transaction
Duplicate order or customer confusion
Idempotent confirmation behaviour
Production webhook testing and monitoring
DevOps
Human backlog
Slow handling of escalated cases
Assignment workflow
Staffing model and service levels
Sales or Service Lead
Dashboard unauthorised access
Exposure of customer information
Trusted demonstration environment
Authentication and role-based access
DevOps
File-based data limitation
Data loss or performance issue
Store abstraction
Managed database, backup and recovery
DevOps
AI service unavailable
Product image or language function reduced
Guided fallback and escalation
Dedicated capacity and provider monitoring
Project Owner
Incorrect FAQ content
Inconsistent customer advice
Content ownership
Versioning, approval and review cycle
Content Administrator
Cloud service failure
Customer channel unavailable
PM2 and health endpoint
Monitoring, backup and recovery plan
DevOps
Personal-data exposure
Privacy and trust impact
Synthetic demonstration data
Privacy review and production access controls

#### Business Owner

Test inconsistency
Reduced confidence in proposal evidence
Automated suite
Verify and standardise final count
Project Owner

Scalability Measurement Framework
Scalability area
Measure
Present status
Decision trigger
Message volume
Daily and peak-hour interactions
To be measured
Sustained growth affecting response time
Concurrent usage
Simultaneous active conversations
Not verified
Load-test threshold reached
Automated handling
Auto-answer rate
Pilot target
Declining rate as volume grows
Human workload
Escalations and pending age
To be measured
Backlog exceeds approved service level
Application performance
Response time
To be measured
Response delay exceeds target
Reliability
Error and failure rate
To be measured
Repeated customer-impacting errors
Infrastructure
CPU, memory and storage use
To be monitored
Sustained resource pressure
Data storage
Record volume and access time
File-based prototype
Durability or performance becomes insufficient
Operating cost
Cost per interaction
To be calculated
Cost rises beyond approved business case
Cross-functional use
Journeys and departments supported
Multiple prototype journeys
New scope has approved measurable value
Language expansion
Enquiries by unsupported language
To be measured
Sufficient demand supports investment
AI usage
Provider calls, fallback and failures
Current shared-provider limits
Capacity or quality affects customer completion



## Proposal Quality

A strong proposal is not judged only by how much information it contains. A strong proposal must make the business case easy to understand, easy to verify and easy to evaluate.
The project write-up for Team ITE BIS Innovators contains extensive business and technical details. These details demonstrate significant effort and a broad working solution. However, proposal quality depends on how effectively those details are organised around the judges’ main questions:
What meaningful business problem is being solved?

### Who experiences the problem?

Why does the problem matter?
How does the Agent create business value?
What measurable outcomes are expected?
Is the proposed solution feasible beyond the demonstration?
Can the solution scale safely?
Which claims are already verified?
Which figures are assumptions or projections?
Does the live demonstration prove the same claims made in the proposal?

The proposal must therefore maintain one clear business story from beginning to end:
BIS Computer Services presently relies on staff to handle routine WhatsApp enquiries manually. The Hybrid AI WhatsApp Sales and Service Assistant automates supported routine interactions, keeps the channel available beyond normal operating hours, guides customers towards sales and service outcomes, and transfers uncertain or complex conversations to people. This is expected to release staff capacity, improve customer response, capture more opportunities and create measurable operational information.

Section 5 explains how the proposal is presented so that the judges can understand and verify this story without needing to interpret a large amount of disconnected technical information.

The proposal-quality approach is based on five principles:
Clear: The business case can be understood by a non-technical stakeholder.
Concise: Every section focuses on information that supports the judging criteria.
Evidence-based: Important claims are supported by screenshots, structured records, verified tests or clearly labelled assumptions.
Consistent: The problem, solution, value, outcomes, figures and demonstration remain aligned.
Stakeholder-aware: The proposal reflects the needs of customers, staff, business owners, content administrators and operations personnel.

The existing project write-up already contain supporting business arguments, implementation details, screenshots, data volumes, test evidence and known limitations. Section 5 organises these elements into a transparent judging framework.



### Proposal Quality at a Glance

Proposal-quality principle
What judges should be able to see
How this proposal addresses it
Clear
The problem and proposed improvement are understandable quickly
A single business story is maintained across all sections
Concise
Important information can be found without reading unnecessary technical detail
Business sections lead; technical evidence supports rather than interrupts
Evidence-based
Major claims can be verified
Screenshots, system records, test evidence and evidence labels are included
Consistent
Problem, solution, business value and KPIs connect
A claim-to-evidence-to-KPI structure is used
Stakeholder-aware
The proposal reflects the actual operating context
Customer, sales, service, owner, content and operations needs are addressed
Honest
Current capability and future work are distinguished
Verified, assumed, projected, simulated and roadmap items are labelled
Demonstrable
The presentation and demo prove the written claims
A planned demonstration sequence follows the same business story
Traceable
Requirements can be connected to built and tested functions
A requirements and evidence map is maintained
Readable
A business stakeholder can navigate the document
Descriptive headings, short summaries, tables and figures are used
Decision-oriented
Management can determine whether the project should proceed
Risks, pilot measures and production-readiness conditions are stated



### One Clear Business Story


#### The Storyline

The complete proposal should follow a simple sequence:
Problem: Staff repeatedly search and type answers to routine WhatsApp enquiries.
Affected stakeholders: Customers wait, staff are interrupted and the owner bears the operational and commercial consequences.
Opportunity: WhatsApp can become a structured, multilingual and always-available sales and service channel.
Solution: A hybrid Agent automates supported routine work and transfers uncertain matters to people.
Business value: The business can improve productivity, service, risk control, commercial progression and operating scale.
Measurable impact: Auto-answer rate, staff hours released, response time, self-service completion, conversion and human-response measures can be tracked.
Feasibility: The core journeys are already built, deployed and tested.
Production pathway: Simulated external services can be replaced with approved live services in stages.
Human control: A representative remains available for judgement-based and sensitive matters.
Decision: Conduct a controlled pilot, measure the results and proceed only when the evidence supports production use.

This sequence should remain visible throughout the document. Technical architecture, datasets, modules and testing should support the story rather than become a separate competing story.


#### One-Sentence Proposal Claim

The proposal should use one primary claim consistently:
The Hybrid AI WhatsApp Sales and Service Assistant reduces routine manual enquiry work, keeps customer engagement available beyond normal operating hours, guides customers towards measurable sales and service outcomes, and keeps a human in control whenever judgement is required.

This sentence can appear in:
The executive summary
The proposal-at-a-glance page
The opening presentation slide
The closing presentation slide
The demonstration introduction
The overall conclusion
The wording may be shortened for slides, but the meaning should remain unchanged.


#### Avoiding Competing Stories

The proposal should avoid presenting several unrelated main messages, such as:
“This is an AI chatbot.”
“This is an AWS project.”
“This is a Kiro development project.”
“This is an online shop.”
“This is a repair-booking system.”
“This is an image-recognition project.”
“This is a multilingual application.”

These statements describe parts of the project, but none captures the complete business transformation.

A more consistent framing is:
This is a customer-engagement transformation for a small computer sales and service business. AI, cloud hosting, guided commerce, service booking, multilingual support and human handoff work together to improve the same customer process.


### Clear Proposal Structure


#### Business Case Before Technical Detail

The proposal should maintain two distinct levels.

Part A: Business Case
Part A should allow a non-technical judge to understand:
The business problem
The stakeholders
The current process
The opportunity
The proposed Agent
The business value
The expected outcomes
The feasibility
The risks
The pilot decision

Part B: Technical Evidence
Part B should explain:
Requirements
Architecture
Data design
Modules
Integrations
Testing
Deployment
Operating controls
Production roadmap

This approach allows a business stakeholder to understand the complete case before reading implementation detail. The existing report already adopts a similar arrangement by placing the five judging themes before the deeper solution evidence.


#### Recommended Business Proposal Sequence

The final Part A should follow this order:
Business Proposal at a Glance
Executive Summary
Section 1: Problem and Opportunity
Section 2: Business Value
Section 3: Business Impact and Outcomes
Section 4: Feasibility and Scalability
Section 5: Proposal Quality
Proposed Pilot and Decision
Part A Conclusion
This sequence matches the judges’ reasoning:
Understand the problem, assess the value, examine the expected impact, determine whether the solution can work and then judge whether the overall proposal is credible.


#### Navigation Within Each Section

Each major section should use a similar internal structure:
Section overview
Main business argument
Detailed subsections
Supporting screenshots
Evidence limitations
Assumptions or targets
Summary
Judging-criteria check

Using the same pattern helps judges locate information quickly.


### Clarity


#### Write for a Business Stakeholder

The proposal should explain what the technology changes for the business.

For example:

Technical-first wording:
“The Node.js middleware invokes the deterministic service before calling the AI provider.”

Business-first wording:
“The Agent retrieves price and stock information from approved records before using AI interpretation, reducing the risk of an unsupported commercial answer.” The technical detail may still appear in Part B, but the business section should focus on the
consequence.


#### Use Plain and Consistent Terms

The following terms should be used consistently:
Preferred term
Use
Hybrid AI WhatsApp Sales and Service Assistant
Full solution name
Agent
Short reference to the solution
Customer
Person contacting the business
Representative
Human staff member handling the enquiry
Enquiry
Customer request recorded by the system
Human escalation
Transfer from Agent to representative
Structured data
Approved catalogue, delivery, warranty or other records

#### Simulated payment gateway

Current demonstration payment function
Prototype
Current working demonstration system
Pilot
Controlled validation using approved users and data
Production
Approved live operating environment
Business outcome
Intended organisational improvement
KPI
Measure used to assess the outcome

The document should avoid changing between “chatbot,” “bot,” “Agent,” “assistant,” “system” and “platform” without a reason.

A suitable convention is:
Use Agent when describing conversation and decision behaviour.
Use platform when describing the complete customer, dashboard, data and integration environment.
Use system only for general technical descriptions.
Avoid chatbot as the primary label because the project does more than answer questions.


#### Explain Technical Terms When Needed

If a technical term is required, it should be followed by a business explanation.

Examples:
Deterministic lookup: Information is retrieved from an approved record rather than created by the AI.
Human-in-the-loop: A staff member takes over when judgement or personalised support is needed.
Swappable interface: An external provider can be changed without rewriting the complete business process.
Idempotent payment confirmation: Repeating the same payment confirmation should not create a duplicate order.
Health endpoint: A simple check showing whether the application is responding.
Managed database: A production data service with stronger durability, access control and operational support than the current file-based prototype store.


#### One Main Message Per Subsection

Each subsection should answer one question.

For example:
“What problem are we solving?”
“Who experiences the problem?”
“What productivity value is created?”
“How will response time be measured?”
“What is currently simulated?”
“How does human escalation work?”

Combining several unrelated questions into one long paragraph makes the proposal harder to judge.


### Conciseness


#### Concise Does Not Mean Incomplete

The project contains extensive implementation detail. This is useful supporting evidence, but not every detail belongs in the main business argument.

Information should remain in Part A when it:
Defines the problem
Explains stakeholder impact
Supports the business value
Defines an outcome
Proves feasibility
Explains risk
Supports a decision

Information should move to Part B or an appendix when it:
Lists individual code files
Describes low-level module functions
Provides record schemas
Lists every route
Explains test implementation
Describes detailed parsing logic
Contains full traceability matrices
Contains complete screenshot-capture instructions


#### Use Tables When Comparison Is More Important Than Narrative

Tables are appropriate for:
Problem and impact comparison
Business-value summary
KPI framework
Risk register
Feasibility summary
Stakeholder mapping
Evidence register
Roadmap stages

### Requirements traceability


Narrative paragraphs are more appropriate for:
Explaining why the problem matters
Describing the operating transformation
Explaining the value proposition
Interpreting the meaning of a KPI
Explaining limitations and decisions


#### Use Evidence Once, Then Cross-Reference It

A screenshot should appear in the section where the screenshot provides the strongest evidence.

For example:
The main menu fits best in Section 1 because it introduces the opportunity.
Product availability fits best in Section 2 because it demonstrates productivity value.
The enquiry dashboard fits best in Section 3 because it demonstrates measurability.
The health endpoint and test summary fit best in Section 4 because they demonstrate feasibility.
The two-way end-to-end sequence fits best in Section 5 because it demonstrates consistency between proposal and demo.

A later section can refer to the earlier figure without repeating the same image.


### Evidence-Based Proposal


#### Evidence Categories

Every important claim should be assigned to one of five evidence categories.

Category A: Verified capability
A function that exists in the current prototype and can be demonstrated.

Examples include:
Product enquiry
Delivery-status lookup
Warranty lookup
Repair booking
Human escalation
Representative reply
Multilingual selection
Cloud deployment

Category B: Verified technical figure
A number confirmed by the final source or test result.
Examples may include:
Catalogue item count
Delivery record count
Warranty record count
Supported language count
Final automated test count

Category C: Assumption
A reasonable working estimate that has not yet been confirmed by operational data.
Examples include:
Daily enquiry volume
Repetitive-enquiry share
Manual handling time
Present response time

Category D: Projection or target
An expected future result to be tested during the pilot.
Examples include:
50 to 70 per cent auto-answer rate
Fewer than five seconds for supported automated responses
Human response within ten minutes during staffed hours
Reduction in delivery-status contacts

Category E: Roadmap item
A planned capability that is not part of the current verified prototype.
Examples include:
Official WhatsApp Business Cloud API
Live payment provider
Managed production database
Dashboard authentication
CRM integration
Formal analytics dashboard


#### Evidence Labels

The final proposal should use visible labels where required:
Verified in current prototype
Demonstrated with synthetic data
Assumption to validate
Proposed pilot target
Illustrative calculation
Simulated test gateway
Production roadmap item
Final test count to be verified

This protects proposal credibility.


### Consistency Across the Proposal


#### Problem-to-Solution Consistency

The problem is repetitive, fragmented and after-hours-limited enquiry handling.
The solution must directly address that problem through:
Automated routine responses
Structured data
Guided customer journeys
Always-available cloud access
Human escalation
Operational records

A feature that does not support the defined problem should not receive disproportionate attention in the business case.
For example, image recognition may be interesting, but image recognition should not become the centre of the proposal because the primary business problem is manual enquiry handling.


#### Solution-to-Value Consistency

Every feature should connect to a business-value lever.

| Agent capability | Business value |
| --- | --- |
| Product and stock lookup | Productivity, service and accuracy |
| Guided quotation | Productivity and sales progression |
| Simulated commerce journey | Feasibility of sales progression |
| Delivery-status lookup | Self-service and staff-capacity improvement |
| Warranty lookup | Self-service, consistency and service progression |
| Repair booking | Administrative productivity and customer convenience |
| Language selection | Accessibility and service consistency |
| Human escalation | Risk control and customer trust |
| Dashboard assignment | Ownership and operational visibility |
| Structured references | Traceability and measurement |
Cloud deployment
Availability and feasibility
Automated testing
Reliability and maintainability
Swappable interfaces
Controlled movement towards production



#### Value-to-KPI Consistency

Each business-value claim should have a measurable outcome.
Business-value claim
KPI
Reduce repetitive work
Auto-answer rate
Release staff capacity
Staff hours released
Improve response speed
First-response time
Improve after-hours coverage
After-hours acknowledgement and completion
Progress sales
Enquiry-to-quotation and quotation-to-order rates
Improve lead ownership
Assignment and human-response time
Increase self-service
Journey-completion rate
Improve accuracy
Correct-or-escalate rate
Improve booking administration
Booking-completion rate
Improve reliability
Test pass rate and service-health measures
Improve visibility
Percentage of valid interactions recorded

This connection prevents the proposal from making a general statement such as “the Agent improves productivity” without defining how the improvement will be observed.


### Internal Factual Consistency


#### Test Count


The automated test total is now standardised. The single verified figure is 348 automated tests across 19 test suites. An earlier draft of the technical write-up quoted 340; that number has been superseded and does not appear as a current figure anywhere in this document.

This single source of truth is applied consistently across:
The business proposal (Part 1).
The technical documentation (Part 2).
The presentation.
Any screenshot captions.
The demonstration.

If the suite is re-run and the count changes, the new verified number should replace 348 in every occurrence in one pass, so the proposal, presentation and demo always communicate the same figure.


#### Team Names and Roles

The two project documents use different versions of names and role descriptions.

The final proposal should use one approved format for:
Full name
Role title
Responsibility
Approval authority

The same format should appear on:
Cover page
Team table
Risk register
Outcome ownership table
Human escalation evidence
Presentation
Demonstration

No reader should need to determine whether shortened and full names refer to the same team member.


#### Product and Record Counts

The principal verified figures should be maintained in a single master facts table.
The current project materials reference:
979 catalogue items
829 component items
150 DIY PC packages
72 CPUs
60 delivery records
50 warranty records
21 product categories
Three supported languages
19 automated test

Before final submission, each number should be checked against the final exported data or system source. Do not update one section without updating the other occurrences.


#### Capability Status

The final document should use a capability-status table.
Capability
Status to use
Customer chat interface
Verified prototype
Product and stock response
Verified prototype
Guided quotation
Verified prototype
Delivery-status lookup
Verified prototype
Warranty lookup
Verified with synthetic data
Onsite and carry-in booking
Verified prototype
Human representative console
Verified prototype
English, Chinese and Bahasa Melayu
Verified prototype
Cloud deployment
Demonstration deployment
Payment
Simulated test gateway
WhatsApp
Simulated channel
Data store
File-based prototype store
Dashboard authentication
Production roadmap
Managed database
Production roadmap
Live payment provider
Production roadmap
Official WhatsApp Business API
Production roadmap
CRM integration
Future enhancement
Production-scale capacity
Not yet verified

This prevents a future feature from being described accidentally as an existing capability.


### Honest Treatment of Simulation


#### Simulated WhatsApp Channel


The current customer interface mirrors the intended conversational flow through a browser page and webhook. The official WhatsApp Business Cloud API remains a production roadmap item.

The proposal should state:
The current customer channel is a simulated WhatsApp-style interface used to demonstrate and test the complete conversation logic. Production operation requires connection to the official WhatsApp Business Cloud API.


#### Simulated Payment Gateway

The current payment function is a safe test gateway. The project materials state that no CVV is collected, no bank is connected and no real charge is made.


Figure 4.1 Simulated Payment Disclosure

Figure 4.1: The prototype uses a simulated payment page to verify the transaction workflow without processing a real financial charge.

To demonstrate proposal honesty and confirm that the team has not misrepresented the test payment as live financial processing.

What the figure proves:
Payment is included in the demonstrated customer journey.
The process following payment can be tested.
The external payment dependency is isolated.
The project recognises the distinction between workflow testing and live financial operation.

What the figure does not prove:
Live payment processing
Actual revenue
Payment-card compliance
Integration with a bank
Production transaction security

Honest, transparent and evidence-based reporting.


#### Synthetic Data

The demonstration uses synthetic customer and warranty records. This protects real customer information and allows the workflow to be demonstrated safely.

The proposal should not describe synthetic warranty results as evidence of actual customer adoption or live operational accuracy.

The correct claim is:
The warranty workflow functions with synthetic demonstration records. Production use requires approved customer information, access control, privacy review and an authorised data-maintenance process.


### Stakeholder Awareness


#### Customer Perspective

The proposal should show that the customer wants:
Fast access to information
Clear product choices
Accurate price and availability
Understandable language

#### Convenient self-service

Easy navigation
Access to a person
Traceable bookings or transactions

The customer should not need to understand the internal system structure.


#### Sales Representative Perspective

The proposal should show that the representative needs:
Fewer repetitive interruptions
Complete conversation context
Clear enquiry ownership
A visible queue
An easy reply method
Appropriate escalation
Traceable resolution
More time for sales and complex enquiries


#### Service Team Perspective

The service team needs:
Complete booking information
Clear appointment references
Warranty context
Service type
Customer problem details
Appropriate handoff
Operational visibility




#### Business Owner Perspective

The owner needs to understand:
Why investment is justified
What staff capacity may be released
What customer-service improvement is expected
Which commercial opportunities may be captured
What costs remain
What risks remain
What must be approved before production
How success will be measured
When further investment should proceed


#### Content Administrator Perspective

The content administrator needs:
Approved information sources
Clear ownership
A content review cycle
Language consistency
Change control
Identification of outdated answers
A way to correct information


#### Operations and DevOps Perspective

The operations role needs:
Deployment procedures
Environment configuration
Secret management
Service-health checks
Logging
Error handling
Backup and recovery
Controlled releases
Test evidence
Incident ownership
These stakeholder perspectives are represented throughout the project’s team, controls and operating descriptions.


### Proposal and Demonstration Consistency


#### The Proposal Claim

The proposal claims that the Agent:
Reduces repetitive work
Provides faster access to supported information
Progresses customer journeys
Preserves human assistance
Creates measurable records









#### What the Demonstration Must Show

The demonstration should show the same claims in the same order.

Demonstration step 1: Customer entry point
Show the numbered menu and language choice.
Claim demonstrated: One accessible entry point for multiple customer journeys.

Demonstration step 2: Routine automated enquiry
Ask for a product price or stock availability.
Claim demonstrated: Routine retrieval can be completed without immediate staff involvement.

Demonstration step 3: Guided sales progression
Select a product, provide a quantity and reach a quotation.
Claim demonstrated: The Agent progresses customer interest towards a measurable commercial step.

Demonstration step 4: After-sales self-service
Retrieve delivery or warranty status.
Claim demonstrated: Routine after-sales information can be self-served.

Demonstration step 5: Structured service outcome
Complete an onsite or carry-in booking.
Claim demonstrated: Unstructured service demand can be converted into a traceable record.

Demonstration step 6: Human escalation
Ask to speak to sales or submit an enquiry that requires human attention.
Claim demonstrated: Customers are not trapped behind automation.

Demonstration step 7: Representative reply
Assign and reply through the dashboard.
Claim demonstrated: A human can join the same customer journey.

Demonstration step 8: Resolve and review
Show the changed status or recorded reference.
Claim demonstrated: The workflow is measurable and accountable.

Demonstration step 9: Technical credibility
Show the health endpoint and final automated test summary.
Claim demonstrated: The prototype is deployed and supported by repeatable verification.



### Requirements Traceability


#### Purpose of Traceability

A strong proposal should show that important requirements are connected to:
A built capability
A test
A screenshot or record
A business value
A KPI

This reduces the risk that a requirement exists only in the written proposal.




#### Business Traceability Matrix

| Business requirement | Implemented capability | Evidence | Business value | KPI |
| --- | --- | --- | --- | --- |
| Receive customer enquiries | Webhook and customer interface | Main menu and enquiry record | Availability | Recorded-enquiry coverage |
| Detect customer language | Detection and numbered selector | Language-selection screenshot | Accessibility | Language fallback and completion |
| Answer routine questions | FAQ and deterministic services | Product response | Productivity | Auto-answer rate |
| Retrieve price and stock | Product and catalogue service | Product availability | Accuracy and service | Correct-or-escalate rate |
| Progress product interest | Guided sales flow | Product selection and quotation | Revenue opportunity | Enquiry-to-quotation rate |
| Retrieve delivery status | Delivery service | Delivery-status screenshot | Self-service | Completion rate |
| Retrieve warranty status | Warranty service | Warranty screenshot | Self-service and service progression | Completion and accuracy |
| Book repairs | Booking service | Booking confirmation | Productivity and customer convenience | Booking-completion rate |
| Escalate uncertain cases | Escalation service | Pending enquiry | Risk control | Appropriate escalation rate |
| Allow human takeover | Representative dashboard | Human reply screenshot | Human service | First human-response time |
| Record customer outcomes | Structured references and statuses | Dashboard and exports | Visibility | Recorded-outcome coverage |
| Operate beyond local machine | Cloud deployment | Health endpoint | Feasibility | Health-check success |
| Support safe changes | Automated tests | Test summary | Reliability | Test pass rate |
| Move towards live services | Swappable interfaces | Architecture evidence | Scalability | Production-readiness checklist |


#### Technical Traceability

The project materials describe functional requirements for enquiry receipt, language detection, FAQ answering, escalation, dashboard handling, FAQ management, swappable WhatsApp integration and visible testing. The materials also describe corresponding services, controllers, browser interfaces and automated tests.

The final appendix can retain the detailed technical traceability matrix, while Section 5 should summarise only the business-level connection.




### Architecture Supporting Traceability




Figure 4.2 end to end process flow

The layered architecture connects customer interfaces, business services, structured data and external providers through defined responsibilities.

To provide technical support for the proposal’s maintainability and traceability claims.
What the figure proves:
The solution has a documented structure.
Business services are separated from interfaces.
External providers are treated as boundaries.
Requirements can be connected to identifiable solution components.

What the figure does not prove:
Production performance
Formal security certification
Successful live-provider integration
Achievement of business KPIs






### Proposal Review Checklist

Before submission, complete the following review.


#### Business Story

The problem is expressed as a business problem rather than a desire to build AI.
The affected stakeholders are identified.
The current process is explained.
The business consequences are clear.
The opportunity is stated.
The Agent’s value is connected directly to the problem.
The KPIs measure the stated value.
The production pathway is realistic.


#### Evidence

Every major claim has supporting evidence or a clear evidence label.
Each screenshot has a figure number.
Each screenshot has a business-focused caption.
Each screenshot is readable.
Synthetic data is identified.
Simulated payment is disclosed.
Simulated WhatsApp is disclosed.
Test evidence uses the final verified number.
No screenshot exposes credentials or real personal data.


#### Consistency

Team names and roles are consistent.
Product and record counts are consistent.
Terminology is consistent.
Test count is consistent.
Section numbering is consistent.
Figure numbering is sequential.
The proposal, slides and demo use the same primary claim.
Current and roadmap capabilities are not mixed.


#### Readability

Each section begins with a short overview.
Headings describe the topic clearly.
Long technical listings are moved to Part B or appendices.
Tables are used for comparison.
Paragraphs explain the meaning of the evidence.
Abbreviations are explained.
Repeated content is removed or cross-referenced.


#### Business Credibility

Assumptions are labelled.
Targets are labelled.
Illustrative calculations are labelled.
Achieved technical results are distinguished from expected business outcomes.
Risks are stated.
Human approvals are identified.
A pilot measurement plan is included.
The requested management decision is clear.





### Proposal Quality Summary

The quality of this proposal depends on more than the size of the document or number of implemented features. Proposal quality is demonstrated when judges can follow one connected and credible argument.

The proposal begins with a meaningful operational problem:
Staff repeatedly handle routine WhatsApp enquiries manually.
Customers may wait for information.
After-hours enquiries may not progress.
Information can be scattered or inconsistent.
Management has limited visibility into outcomes.

The proposal then introduces a targeted operating change:
Automate supported routine work.
Use approved structured information.
Guide customers through sales and service journeys.
Record enquiries and outcomes.
Transfer uncertain or complex cases to people.

The proposal explains the expected value:
Reduced routine effort
Released staff capacity
Faster customer response
Better after-hours coverage
Improved sales progression

#### Convenient self-service

Better information consistency
Stronger operational visibility

The proposal defines how the impact will be measured:
Auto-answer rate
Staff hours released
First-response time
After-hours acknowledgement
Sales-funnel conversion
Self-service completion
Booking completion
Correct-or-escalate rate
Human-response time
Recorded-outcome coverage

The proposal also explains why movement beyond the prototype is feasible:
The core journeys are already implemented.
The application is deployed.
Structured data is available.
Human escalation is present.
Automated testing is used.
External dependencies are separated behind interfaces.
A staged production roadmap is defined.

Most importantly, the proposal remains honest about the present position:
The customer channel is simulated.
Payment is simulated.
No real charge is made.
Demonstration customer and warranty information is synthetic.
Production authentication is not yet implemented.
Managed storage remains future work.
Business outcomes have not yet been measured.
The final automated test count must be standardised.

The principal proposal-quality statement is:
The proposal is clear because it leads with the business problem; concise because technical detail is used only where it supports the case; evidence-based because major claims are connected to demonstrations, records or clearly labelled assumptions; consistent because the problem, solution, value and KPIs describe the same story; and stakeholder-aware because automation supports customers and staff without removing human judgement, ownership or accountability.


## Roadmap and Future Enhancement Work


What we have built and tested is a complete, working platform, but we want to be honest about where it stands today and where it goes next. This section describes both: the current limitations of the tested application, and the roadmap that turns each of them into a production-ready capability. The important point is that we planned for all of this from the start, so none of it requires a rewrite, each enhancement simply slots in behind an interface the system already uses.

Being honest about what the demonstration version does and does not do. For this build, several parts of the system are deliberately simulated so that we could complete and prove the full business logic without waiting on external approvals, contracts, or sensitive credentials. In practice, this means:

The payment page is a safe test gateway, not a real one. When you pay by card in the demonstration, the page does not ask for a security code (the CVV), it does not connect to any bank or card network, and no real money ever moves. It simply records that a test payment was completed and then creates the order, invoice, and delivery. This was a conscious choice: handling real card numbers safely requires a certified payment provider, and we did not want to store or touch card data ourselves.

The WhatsApp channel is simulated through a browser chat page and a webhook, rather than the official WhatsApp Business line, because the official channel needs Meta business verification and approval.

Image recognition is intermittent, because the shared AI vision service we use is rate-limited; when it cannot confidently identify a photo, the assistant honestly falls back to a numbered category picker instead of guessing.

The rep dashboard has no login yet, because the demonstration assumes a single trusted staff member.

Data is stored in simple files rather than a full database, which is ideal for a demonstration and low volume but would need upgrading as the business grows.

None of these are accidental gaps, they are the edges we intentionally left swappable. Here is how each becomes production-grade.

1. A real, secure payment gateway. The biggest enhancement is to connect a certified payment provider, for example Stripe, HitPay, or a bank's PayNow integration. In that live version, the customer would enter their full card details, including the security code, on the provider's secure page, and the bank would actually authorise and charge the payment. Our system never sees or stores the card number, the provider handles that, which is what keeps us compliant and safe. Because our payment step already sits behind a single, well-defined interface, switching from the test gateway to a real one changes only that edge; the quotation, order, invoice, and delivery logic all stay exactly as they are.

2. The real WhatsApp Business Cloud API. Next, we would connect to the official WhatsApp Business line so that real customers on their own phones can message the business directly, with Meta's message verification in place. Again, because the messaging channel is already behind a swappable "sender," this is a change at the edge only — everything the assistant says and does stays the same.

3. CRM and analytics. Every quotation, order, invoice, booking, and warranty check the system creates is already captured as structured data. The natural next step is to feed that into a customer-relationship-management system and a simple analytics dashboard, so the business can see, at a glance, how many enquiries the bot handled on its own, how many turned into sales, and how much staff time was saved. This turns the platform from a service tool into a source of business intelligence.

4. Reliable image recognition. With a dedicated vision service key or a higher usage quota, the photo-to-product feature would work consistently rather than intermittently a customer could simply snap a picture of a part and get an instant priced match. The code path is already built; it only needs the upgraded service behind it.

5. A managed database and dashboard security. As volume grows, we would move from simple file storage to a managed database for reliability and scale, and add a proper login for the rep dashboard so only authorised staff can view conversations and take over chats. Both are contained changes because data access already goes through one interface.

6. Broader languages and smarter answers. Finally, we can add more languages beyond English, Malay, and Chinese, and introduce smarter AI matching for harder questions, but always under the same firm rule that governs the whole system: if the assistant is not confident, it hands the conversation to a human rather than guessing.
In short, the demonstration proves the whole journey works; the roadmap swaps each simulated edge for its live equivalent. Because we designed the system this way from the beginning, the business can adopt these enhancements one at a time, at a controlled cost and with very little risk, growing the platform steadily rather than rebuilding it.




## Overall Conclusion


Let us bring the whole story together. This document set out to do two things at once,  to make the business case and the engineering case for an AI-powered WhatsApp assistant for BIS Computer Services and we believe it has done both.

The business case is straightforward. A small sales team was drowning in repetitive WhatsApp questions, prices, stock, delivery, warranty, "where is my order", arriving all day, in three different languages, and going completely unanswered after hours. That is expensive in two ways: it burns the team's most valuable time on routine typing, and it quietly loses the sales that come in when nobody is at the desk. Our platform turns that same WhatsApp line into an automated, always-on channel. It absorbs the repetitive load, so the team is freed to focus on real selling and complex problems. It stays open 24 hours a day, so an evening or weekend enquiry can now be answered, and even paid for, instead of being lost. And it does all of this while keeping people firmly in control: whenever the assistant is unsure, or a customer simply asks for a person, a real sales rep can step straight into the conversation. In short, we reduce the manpower spent on the routine, capture more revenue around the clock, and give faster, more consistent, multilingual service, without losing the human touch.

The engineering case is just as clear. Underneath the friendly conversation is a deterministic, thoroughly-tested core, 348 automated tests across 19 suites, that answers questions about money and stock only from approved data, never by guessing. Around that core sit deliberately swappable edges, the messaging channel, the payment gateway, and the data store, so the parts that depend on outside approvals or sensitive credentials are isolated at the boundary and can be switched on later without touching the logic we have already built and proven. The whole thing was built in a disciplined, spec-driven way in the Kiro environment, with steering rules and automatic testing keeping it healthy at every step, and it is deployed and running live on AWS Lightsail today.

The result is that the entire customer journey: enquiry, product recommendation, quotation, payment, order and invoice, delivery tracking, warranty check, and repair booking, now lives inside one 24/7 conversational channel, with a two-way console that lets a rep join any conversation live. We have been honest throughout about what is simulated for this demonstration, the test payment gateway with no real card charge, the simulated WhatsApp channel, the intermittent image recognition, and we have shown exactly how each of those becomes production-ready, one contained step at a time. It is ready to graduate its simulated edges to production whenever the business decides to take that step. For a small computer shop, that is what accessible digital transformation looks like in practice: powerful, safe, and within reach.

We are Team ITE BIS Innovators, and this is our answer to the challenge of managing WhatsApp sales enquiries. Thank you.






---

# PART 2 — TECHNICAL DOCUMENTATION

*Reused and updated from the team's earlier technical write-up. Part 1 framed the business problem and the business case; this part documents how the solution was designed, built, tested and deployed. Where a topic is already covered in Part 1, this part cross-references it rather than repeating it. The verified test figure throughout is 348 tests across 19 suites.*

## 6. Introduction and Problem Statement (Technical View)

Part 1 framed the business problem. This part documents the implementation. In technical terms, the requirement was to build a hybrid WhatsApp assistant with a pure, testable core (language detection, matching, escalation, quotation, booking, payment, warranty) and swappable interfaces at the edges (the WhatsApp sender, the data store, and the payment gateway), so the system can be demonstrated on a simulated channel now and switched to the real WhatsApp Cloud API and a real payment gateway later without touching the core logic. The guiding principle — people before technology — is enforced in code: automation shortcuts only the repetitive, clearly answerable cases, and any uncertainty routes to a human rather than a guess.

The problem, restated for an implementer, was to avoid two common failure modes:

- **The pure open-ended chatbot** — friendly, but it will confidently invent a price or a stock level. This is unacceptable for a retailer, because a wrong number erodes trust and can commit the business to a loss.
- **The rigid keypad menu** — safe, but it frustrates the large share of customers who simply type what they want.

The chosen design is deliberately both at once: a numbered menu for those who tap; free-text natural-language understanding for those who type; deterministic lookups for anything involving money or stock; an AI layer only where language is genuinely ambiguous; and a human escalation path as the safe default whenever confidence is low. Each of these choices is reflected directly in the module structure (Section 11).

The system is a Node.js/Express application. Its human-facing logic is written as plain functions of their inputs (no Express request/response objects), which is what makes early and continuous `npm test` results meaningful. The whole system is deployed live on AWS Lightsail and verified by **348 automated tests across 19 suites**.

## 7. User Requirements (Functional and Non-Functional)

Requirements were written as user stories with EARS-style acceptance criteria (WHEN / IF / WHERE … THEN the system SHALL …), so each is individually testable.

### 7.1 Functional Requirements

- **R1 — Receive customer enquiries.** Record each enquiry with a timestamp, sender and original text; reject payloads missing the sender id or text without creating a record; sanitise text before storing or processing.
- **R2 — Detect the customer's language.** Detect `en`, `ms` or `zh` with a confidence score; default to `en` below threshold; select the dominant language for mixed messages.
- **R3 — Auto-answer frequently asked questions.** Match to a stored FAQ intent with a confidence score; reply in the detected language; fall back to English (flagged) when the language is missing; record the match, language, confidence, and that it was auto-answered.
- **R4 — Escalate uncertain or human-requested enquiries.** If no FAQ matches at or above threshold, or the customer asks for a person, escalate, record the reason, mark the enquiry pending, and send a localised acknowledgement.
- **R5 — Representative dashboard (human-in-the-loop console).** List enquiries with status, language and timestamp; show the full conversation and escalation reason; let a representative reply directly to the customer (delivered to the customer's chat thread); mark the enquiry `in_progress` and record who is handling it; and mark it `resolved` with attribution.
- **R6 — Manage FAQ answers.** Store answers per language (English required); use edits for subsequent enquiries; reject a FAQ without an English answer.
- **R7 — Swappable WhatsApp integration.** In simulated mode accept messages via a test chat page and record outbound replies without external calls; in cloud mode send via the WhatsApp Business Cloud API through the same sender interface; changing modes requires no change to language, FAQ or escalation logic.
- **R8 — Visible, testable results.** `npm test` runs unit and integration tests; the running webhook returns the bot's reply for inspection; the chat page and dashboard are reachable in a browser.

### 7.2 Non-Functional Requirements

- **Privacy:** store only what is needed; keep secrets out of the repository.
- **Reliability:** an error answering one enquiry must not crash the server or block others.
- **Extensibility:** the language set and knowledge base can grow without changing the core flow.
- **Humane fallback:** uncertainty always routes to a person, never to a silent wrong guess.

## 8. Solution Design and Architecture

The design keeps the human-facing logic pure and testable and puts swappable interfaces at the edges.

**Layered architecture:**

- **Routes** expose the HTTP surface: the inbound webhook, the FAQ management API, the enquiries API (list / detail / resolve / reply), the customer message-polling endpoint, and the payment routes.
- **Controllers** translate HTTP to and from the services and hold no business rules.
- **Services** are the testable core: language, product/FAQ, escalation, sales flow, payment/order, booking, onsite (address recognition), delivery, warranty, i18n, and the AI providers.
- **Edges** are the sender (simulated or cloud) and the store (JSON files now, a managed database later), each behind a small interface.

The layered flow is: **routes -> controllers -> services -> store**, with edges (sender, store, payment gateway) isolated behind small interfaces.

### 8.1 The Enquiry Pipeline

Every inbound message flows through `webhook.controller.js`:

1. Receive and validate.
2. Record.
3. Detect language (a sticky picker choice overrides auto-detection).
4. Handle universal HOME / BACK commands.
5. Route by conversation state and content — menu, product/quotation, payment step, booking step, warranty, delivery lookup, image, or FAQ.
6. Decide answer vs escalate.
7. Respond via the sender.
8. Return the reply so it can be inspected.

On escalation the pipeline creates an escalation record, sets the enquiry `pending`, and sends a localised acknowledgement.

### 8.2 Swappable Edges

The system has three swappable edges, each behind a small, stable interface. This is the single most important architectural decision, because it is what lets the full business logic be built, tested and demonstrated now while deferring the parts that depend on external approval or contracts.

- **The WhatsApp channel.** The sender interface is `send(to, message)`. `simulated.sender` records outbound messages and returns them in the webhook response (no external calls), which the browser chat page reads; `cloud.sender` is the phase-2 path to the WhatsApp Business Cloud API with Meta webhook verification. The mode is selected by `WHATSAPP_MODE`, read at call time so it can switch without a reload. Crucially, the language, FAQ, escalation, quotation, booking, warranty and payment logic all depend only on this interface, so switching to the real channel changes nothing in the core.
- **The data store.** The store abstraction exposes create/get/list/update per collection over a JSON-file backend. Every service and controller depends only on those functions, never on the file format, so the backend can be replaced with SQLite or a managed database without touching business logic. Seeded collections load from JSON on first run; other collections start empty.
- **The payment gateway.** `PAYMENT_MODE=simulated` generates a mock payment link and a test payment page and settles via a callback; `PAYMENT_MODE=live` would swap in a real provider (Stripe, HitPay, or a bank PayNow integration) — a redirect plus a real gateway webhook — with no change to the order, invoice or delivery logic.

This edge-swapping design is the direct implementation of Requirement R7 and the reason go-live is low-risk: the risky, externally dependent pieces are isolated at the boundary, and everything valuable — the conversation logic and the commerce/service journeys — is complete and proven behind them.

## 9. Data Design

Data is accessed only through the store abstraction, which manages **ten collections**: `enquiries`, `faqs`, `escalations`, `products`, `deliveries`, `warranty`, `orders`, `invoices`, `payments`, `bookings`. Products, deliveries and the warranty database (and the starter FAQs) are seeded from JSON on first run; orders, invoices, payments and bookings start empty and are created as customers complete purchases or book repairs.

**Verified figures:** 979 catalogue items (829 components + 150 DIY PC packages) across 21 categories; 72 CPUs from a 2026 price list; 60 delivery records; 50 warranty records; every catalogue item in stock at 100 units. Products carry brand, model, category, price (SGD), stock status and quantity — no supplier or third-party name anywhere.

**Core record shapes:**

- **Enquiry:** id, sender, sanitised text, detected language and confidence, status (`auto_answered` / `pending` / `in_progress` / `resolved`), matched FAQ id, match confidence, English-fallback flag, who is handling it, and timestamps including who resolved it. Representative-to-customer replies are stored in the same collection as outbound messages (author `rep`) so the customer's chat can display them.
- **FAQ:** id, intent label, per-language keywords, per-language answers (English required), updated-at.
- **Escalation:** id, enquiry id, reason (`low_confidence` / `human_requested` / `order_confirmed` / `warranty_service` / `onsite_booking` / `carry_in_booking`), created-at, status.
- **Payment:** id, sender, method (card / paynow), status (pending / paid), mode, quoted product/quantity/amount/currency, quote reference, language, and linked order/invoice/delivery references once settled.
- **Order:** id, order reference (`ORD-YYYYMMDD-NNN`), sender, status, product/quantity/amount, and linked quote/invoice/delivery references.
- **Invoice:** id, invoice reference (`INV-YYYYMMDD-NNN`), order reference, line details, payment method, status (Paid).
- **Booking:** id, reference (`OS-` / `CI-YYYYMMDD-NNN`), type, sender, service type or device, date, slot, customer details, problem, fee, status, language.
- **Warranty:** customer id, name, mobile, email, product category, brand, model, serial, invoice, purchase date, status, end date, coverage label, service type, last-service status.

## 10. Steering and Hooks (Kiro Configuration)

The project was built in the Kiro IDE using steering (persistent guidance) and hooks (event automation) under `.kiro/`.

**Steering files (four, manual inclusion):**

- A **Product Summary** — the people-first framing and the "people before technology" principle.
- **Project Standards** — CommonJS, pure Express-free services, multi-language rules, service return-shape contracts, Jest + supertest, sanitise inputs, no secrets in the repository.
- **Project Structure** — the layered `routes -> controllers -> services -> store` design, naming conventions, and escalation-as-safe-default.
- **Tech Stack** — Node/Express, express-validator, Jest, supertest, a language-detection library, dotenv; JSON store now / managed database later; the two-phase WhatsApp plan.

**Hooks (two):**

- `run-tests-on-save` — a PostFileSave hook that runs `npm test --silent` on any `.js` change under `src/` or `tests/`.
- `verify-after-task` — a PostTaskExec hook that runs the suite after each completed task.

Together these operationalise R8 (results you can see) and keep the suite green automatically.

## 11. Modules and Subtasks (Implementation Detail)

- **Data layer.** `src/data/store.js` — the ten-collection abstraction with seeding of `faqs`, `products`, `deliveries` and `warranty`. `src/data/seed/` holds the seed data.
- **Core services (pure, tested).** `language.service.js` (en/ms/zh detection with a tuned Chinese threshold and sticky preference); `faq.service.js` (per-language matching with English fallback); `escalation.service.js` (human-requested and low-confidence rules, localised acknowledgements).
- **Product and quotation.** `product.service.js` — natural-language product search and quotation building. It tokenises queries (splitting letters from digits so model numbers such as "RTX5070" match a spaced "rtx 5070"), scores products by name, brand and category, and formats a numbered shortlist and a quotation reply. It includes a dedicated CPU-aware interpretation layer so that loosely worded processor queries — "Intel processor generation 14", "i5 14th gen", "core ultra 7", "ryzen 9 9000 series" — are parsed into structured attributes (brand, i-class, Ultra tier, generation, explicit model) and matched precisely against the 72-CPU dataset, falling back to generic search when the query is not CPU-specific. A budget parser recognises phrasings like "under $200" or "less than 50" and filters accordingly; when nothing fits a budget, the service honestly reports the closest option rather than returning an empty result that would read as "we don't have it". A component-not-stocked guard prevents a request for a category the shop does not stock as a standalone item from being answered with dressed-up PC packages.
- **Guided flows.** `salesflow.service.js` (shortlist -> quantity -> quotation with a live stock line); `payment.service.js` (the daily-sequenced Q- / ORD- / INV- / DO- references, the pending payment plus secure test-pay link, and, on gateway confirmation, creation of the order, invoice and delivery records); `booking.service.js` (available dates, numbered service/device pickers, OS- / CI- references, onsite and carry-in booking records); `onsite.service.js` (address recognition, so a typed address starts the onsite booking); `delivery.service.js` (status lookup recognising both `DO202600001` and `DO-YYYYMMDD-NNN`); `warranty.service.js` (serial/invoice detection, normalised matching, localised reply with the 1/2/3 handoff).
- **Menu, i18n and language.** `menu.service.js` — the nine-option menu (1 Components, 2 DIY PC, 3 Carry-in, 4 Onsite, 5 Product Availability, 6 Talk to Sales, 7 Delivery Status, 8 Warranty Status, 9 About Us, plus Language), a numbered language-picker interpreter, and the universal `isHomeCommand` / `isBackCommand` navigation helpers. `i18n.service.js` — the `t(lang, key, vars)` translation function and the en/ms/zh string tables, keeping computer terms and addresses in English.
- **AI providers.** `services/ai/openclaw.client.js` (the AI gateway client) and `services/ai/vision.provider.js` (image identification with a numbered category-picker fallback).
- **HTTP layer.** `controllers/webhook.controller.js` (the pipeline and all conversational state, including HOME/BACK and the `handleBack` step-back helper); `controllers/enquiry.controller.js` (list / detail / resolve / reply plus the `/api/messages/:from` polling endpoint); `controllers/faq.controller.js`; the route files; and `src/app.js` / `src/server.js`.
- **Browser pages.** `public/chat.html` (numbered menu buttons, Language button, persistent Menu / Back nav bar, and a 4-second poll that renders representative replies as "human" bubbles); `public/dashboard.html` (the two-way console — conversation, reply box, resolve); `public/pay.html` (the secure test-payment page).
- **Scripts.** Catalogue/delivery converters, a CPU loader (the 72 processors), and `export_csv.js` (the five CSV exports).

## 12. The Guided Sales and Service Flow

The centrepiece of the product is a guided flow that converts a casual price question into a confirmed order without the customer needing to know any commands. When a customer asks about an item — for example, the price of RAM — the system responds with a numbered shortlist of up to five matching products, each with its price and its live stock count (for example "100 in stock"), and an invitation to reply with a number or simply type the item name (no exact wording needed). The customer selects either by number (1–5) or by a fuzzy name match that tolerates filler words, so "I want the Logitech K380 please" resolves to the right item.

The system then asks for the quantity, builds a quotation with the line total, subtotal and the units in stock, and invites the customer to type "confirm". On confirmation the flow moves into the payment journey (Section 15); the "Talk to Sales" option remains available as the human path at any time.

The DIY PC Package option (menu 2) follows the same shape, but each package is presented as a whole bundle with its component parts shown in brackets — CPU, motherboard, RAM, case, power supply, and so on — at a single package price, so the customer can evaluate and buy a complete build in one step. Selecting a package and quantity produces a richer quotation that shows the full "What's included" component breakdown. Same-specification builds that differ only by price are collapsed into a single line with a "from" price so the shortlist stays readable.

A separate menu option, Product Availability (option 5), serves the pure stock enquiry: the customer names an item and the assistant returns its price together with how many units are in stock. This replaced a former "Delivery & Payment" option whose content duplicated the Delivery Status feature; consolidating delivery/payment information under option 7 removed the overlap and gave stock its own clear entry point. Throughout every path, the "no wrong info to customer" principle holds: the system never guesses a price or stock level, and anything uncertain is escalated to a representative.

## 13. Online Booking: Onsite and Carry-in Appointments

Options 3 and 4 are structured, numbered, multi-step bookings that each produce a confirmed reference.

- **Carry-in (option 3):** date -> slot -> device (Laptop / Desktop / Printer / Other) -> problem -> `CI-YYYYMMDD-NNN` Awaiting Drop-Off (SGD 30, 1–2 working days, with the service-centre address and hours).
- **Onsite (option 4):** service type (Troubleshooting / Hardware Repair / PC Setup) -> date (next three days) -> time slot -> details -> `OS-YYYYMMDD-NNN` CONFIRMED (SGD 60/visit). Typing an address directly also starts it.

Bookings live in the `bookings` collection, share the daily-sequenced reference style, and each creates a pending record so the service team is notified. A booking is created only once every step is complete.

## 14. Warranty Check: Serial Lookup and Service Handoff

A customer picks option 8 or simply pastes a serial/invoice anywhere; the system recognises the pattern and looks it up (serial -> invoice -> mobile -> name). On a single match it replies with the customer, product, serial, status, expiry and coverage, then offers 1 onsite booking · 2 carry-in booking · 3 talk to service — feeding straight into the booking modules.

Serial matching normalises case, spaces and repeated dashes (so `SG26-TP--0015` and `sg26-tp-0015` both match); an unknown serial returns an honest "not found"; a record is returned only to a query that matches it. The 50 records are synthetic, and the reply is fully localised.

## 15. Conversational Commerce: Payment, Order and Delivery Journey

The nine-step journey: enquiry -> recommendation -> selection -> quotation (`Q-`) -> confirm -> payment method (1 Card / 2 PayNow / SGQR) -> secure pay link (`/pay/<id>`) -> payment confirmation (`ORD-` + `INV-`, "Preparing Order") -> delivery order (`DO-`), trackable via option 7.

The four references share one daily running number. Payment is a **simulated gateway** (`PAYMENT_MODE=simulated`, no real charge) designed to swap to a real provider behind the same `payment.service` interface. Honesty guardrails: nothing is marked paid without the gateway callback; order/invoice/delivery are created only after payment confirms; amounts always come from the stored quotation; the callback is idempotent. The delivery order is written in the same shape the Delivery Status lookup understands, so a purchase made entirely in chat is immediately trackable — closing the loop.

## 16. Multilingual Support (i18n) and Navigation

The assistant is fully trilingual (English, Bahasa Melayu, Chinese). Localisation covers product lists, quotations, selection prompts, confirmations, the full payment journey, the booking flows, warranty replies, and every menu-option response; computer terms (CPU, GPU, RAM, SSD, DDR5) and postal addresses stay in English.

Language is handled by automatic detection and by an explicit numbered picker (1 English / 2 中文 / 3 Bahasa Melayu, or type the name), whose choice is sticky. Universal navigation commands work at every step in all three languages: `0` / `menu` / `home` returns to the main menu; `back` steps to the previous screen (with a `handleBack` mapping per flow). Multi-step prompts carry a localised footer hint, and the chat page adds one-tap Menu / Back buttons.

## 17. Image Recognition and the Honest Fallback

Image uploads route to a vision provider that maps a recognition label to a catalogue category and offers the matching priced shortlist. When the AI gateway is rate-limited or cannot confidently identify a photo, the system degrades honestly to a numbered category picker rather than fabricating a result — the people-before-technology principle applied to a failure mode. The code path and fallback are in place; the remaining work is a dedicated vision key or higher quota.

## 18. Human-in-the-Loop: The Two-Way Reply Console

The dashboard is a live takeover console, not just a queue, and it is where the "people before technology" principle becomes tangible in the product. When the bot escalates — because the customer asked for a person, the bot was not confident, a sensitive case arose, or an order/booking event occurred — the enquiry appears `pending` on the dashboard with its full conversation (the customer's message, the AI's reply) and the escalation reason. The customer, meanwhile, has already received an instant localised acknowledgement, so no one is left waiting silently.

A representative opens the enquiry and replies to the customer directly from the detail panel (`POST /api/enquiries/:id/reply`). The reply is delivered through the same swappable sender the bot uses, and stored in the customer's thread as an outbound representative message. The customer's chat page polls `GET /api/messages/:from?since=<timestamp>` every few seconds and renders any new representative replies as a clearly labelled "(human)" bubble, so from the customer's side, a real person has seamlessly joined the same conversation. Sending the first reply moves the enquiry to a new `in_progress` status and records which representative is handling it; when the matter is settled the representative marks it `resolved`, and the system stores who resolved it and when.

Two implementation details protect the integrity of this loop. First, representative-authored messages are stored in the `enquiries` collection but are filtered out of both the dashboard's enquiry list and the bot's conversation-state reconstruction, so a human reply never clutters the queue or confuses the bot's flow tracking. Second, because the reply path reuses the same sender interface, it works today in simulated mode (delivered via the chat's polling) and maps directly to a real WhatsApp send when the Cloud API is enabled, with no change to the console. The result is a clean, auditable handoff loop: bot -> escalate -> human takes over -> reply -> resolve, with every human action attributed. This is precisely the "reduce manpower load without losing the human touch" promise of Part 1, realised in software: the bot absorbs the repetitive volume, and when a person is needed, the handoff is instant, contextual, and invisible to the customer.

## 19. Controls, Risks and Human Approval

| Risk | Control | Owner |
| --- | --- | --- |
| Confident but wrong answer | Confidence threshold; below it, escalate; English-required FAQs | Noel |
| Wrong language detected | Default-to-English with flagged fallback | Tan Beng Tat |
| Outdated FAQ content | Admin API with edit history; periodic review | Noel |
| Payment integrity | Nothing paid without gateway callback; records only after payment; amounts from stored quote; idempotent; PCI provider when live | Tan Beng Tat / Low Ger Loon |
| Warranty / PII exposure | Synthetic data; returned only to a matching query; never lists others | Tan Beng Tat |
| Leaked secrets | `.env` git-ignored; key-only SSH; app-port-only firewall | Low Ger Loon |
| One enquiry crashing the service | Per-enquiry error -> escalate + log, never crash | Tan Beng Tat |
| Prompt/message injection | Untrusted customer text; deterministic matcher; any LLM gated by escalate-when-unsure | Tan Beng Tat |

**Human approval points:** go-live to real WhatsApp and to a live payment gateway require Project-Owner sign-off; FAQ changes require Content-Admin review; server/firewall changes require DevOps approval; every escalation is closed by a representative with attribution; complaints and sensitive cases always route to a person.

*(This table complements — and does not replace — the business-level risk and governance discussion in Part 1, "Risk and Control Value" and "Security, Privacy and Governance".)*

## 20. Testing and Verification

Testing is the earliest and most frequent signal of health, and in a system that quotes prices and takes (simulated) payments it is a business requirement rather than a nicety. The suite uses Jest and supertest, and is run with a single `npm test`. It covers unit tests for language detection, FAQ matching, escalation, product search, quotation, delivery, warranty, i18n/language, image identification, the WhatsApp sender and the menu, plus integration tests for the webhook, the enquiry and FAQ APIs, the end-to-end payment journey, the onsite and carry-in booking flows, the warranty lookup and service handoff, the numbered language picker and HOME/BACK navigation, and the two-way representative reply console.

The current verified state is **348 tests passing across 19 test suites**. Representative examples of what the suites assert:

- **Payment journey:** a full drive from enquiry -> quotation -> confirm -> payment method -> secure link -> simulated gateway callback -> order/invoice/delivery creation -> delivery tracking, plus that nothing is marked paid without the callback, that amounts come from the stored quote, and that completing the same payment twice does not create duplicate orders (idempotency).
- **Booking:** both the onsite and carry-in flows driven through every step to a confirmed OS- / CI- booking, with invalid-choice re-prompting and daily-sequenced references verified.
- **Warranty:** serial/invoice lookup including the format-tolerant match (`SG26-TP--0015` -> `sg26-tp-0015`), the 1/2/3 service handoff, and an honest "not found" for unknown serials.
- **Navigation:** the numbered language picker (1/2/3 or name) and the universal HOME/BACK commands stepping correctly through every flow.
- **Representative reply console:** a representative reply is delivered to the customer thread, marks the enquiry `in_progress`, is retrievable by the customer's poll, does not leak into the dashboard list, and does not corrupt the conversation state.

The two Kiro hooks keep this green automatically: tests run on every source or test file save, and again after each completed spec task. Because services are pure and free of Express objects, their tests assert specific inputs against expected outputs directly, which is what makes early results meaningful and refactoring safe. A practical operational note learned during development: the JSON data files must be cleared before and after a test run, because concurrent processes touching the shared data files can otherwise produce false failures. This is why `npm test` is always bracketed by a data-directory cleanup in the project's workflow.

## 21. Deployment

Deployed to an AWS Lightsail Ubuntu instance at `52.77.234.193`, kept alive by PM2. It runs with `WHATSAPP_MODE=simulated`, `USE_OPENCLAW=true`, `VISION_PROVIDER=openclaw`, `PAYMENT_MODE=simulated` and `PUBLIC_BASE_URL=http://52.77.234.193:3000`. Only the app port is open in the Lightsail firewall; SSH is key-only. Deployment copies changed files and restarts PM2; data can be reseeded by removing a collection file before restart. Live endpoints (all verified): customer chat `/chat.html`, representative dashboard `/dashboard.html`, test payment page `/pay/<id>`, and health `/health` -> `{"status":"ok"}`. A custom domain was considered and reverted to avoid the domain fee, so the system stays on the public IP over HTTP — appropriate as demonstration evidence.

## 22. Results (Verified Figures)

- 979 catalogue items (829 components + 150 DIY PC packages), 21 categories, each at 100 units with live availability.
- 60 seed delivery records plus new delivery orders from completed purchases.
- 50 warranty records; 72 CPUs powering natural-language processor queries.
- **348 tests passing across 19 suites.**
- 3 languages across the entire experience, with a numbered picker and universal `0` / `back` navigation.
- Complete conversational commerce journey (`Q-` / `ORD-` / `INV-` / `DO-`), two booking journeys (`OS-` / `CI-`), warranty check, delivery-status self-service, and a two-way human-in-the-loop console — all verified live end-to-end.
- Five CSV exports for records.
- Deployed live on AWS Lightsail with chat, dashboard, payment page and health endpoint reachable.

## 23. Delivery Plan, Milestones and Team

Three one-week milestones (21 days):

- **Week 1 (Tasks 1–5):** scaffold with a Jest harness; the store with seeded FAQs; and three pure, unit-tested services (language, FAQ, escalation).
- **Week 2 (Tasks 6–12):** the webhook pipeline integration-tested; the swappable sender; the Express app; the FAQ and enquiries APIs; the chat and dashboard pages.
- **Final week (Tasks 13+):** AWS deployment, then the conversational-commerce journey, online booking, warranty check, image identification, multilingual picker, navigation, and the two-way console.

Team roles are as listed in the cover table (Tan Beng Tat — Project Owner; Chen Yingsheng, Noel — Content Administrator; Li Puay Sim — Lead Sales Representative; Low Ger Loon — DevOps). Success measures for these milestones are the KPIs defined in Part 1, "Business Impact and Outcomes" — this technical part does not restate them, to keep one source of truth for the numbers.

## 24. Roadmap and Future Enhancement Work (Technical Detail)

Part 1 already sets out the business roadmap. This section gives the engineering detail behind those future steps. The system is deployed and working today; because it uses a modular architecture with swappable edges, each enhancement can be introduced step by step at low cost and low risk without changing the core business logic.

- **Real WhatsApp Business integration.** The channel is already abstracted behind the sender interface, so connecting the official WhatsApp Business Cloud API is a `cloud.sender` swap plus Meta webhook verification, with no change to the conversation logic.
- **Live payment gateway.** The quotation, order, invoice and delivery processes already exist; going live requires only a real payment adapter (Stripe, HitPay, PayNow, SGQR or a bank gateway) behind the existing `payment.service` interface.
- **Dashboard analytics and KPI reporting.** Every enquiry, quotation, booking, warranty check and delivery is already stored as a structured record, so the dashboard can be extended into a business-intelligence view producing customer-service KPIs (enquiries received, auto-resolved, escalated, first-response and resolution time, per-representative resolution, SLA percentage), sales KPIs (quotations generated and converted, sales value, popular products/categories, conversion rate), and service KPIs (onsite/carry-in bookings, warranty enquiries, completed jobs, common issues), with daily/weekly/monthly/yearly reports exportable to PDF, Excel or CSV.
- **AI-powered business analytics.** Analysing stored conversations to surface frequent questions, common complaints, popular products, peak periods and sentiment, and to recommend new FAQ entries, products to promote and staffing for busy periods.
- **Automatic sales-representative assignment.** An intelligent round-robin engine that checks availability, assigns and notifies a representative, tracks response and resolution times, and auto-escalates to another representative if there is no action within a defined period.
- **Customer Relationship Management (CRM).** Customer profiles, purchase and warranty history, previous service requests and repeat-customer tracking, so staff can give more personalised service.
- **Improved image recognition.** A dedicated vision service with higher quota, product image matching, automatic component identification and fault detection from uploaded images.
- **Managed database and security enhancements.** Migrating the JSON store to MySQL, PostgreSQL, AWS RDS or DynamoDB as usage grows, plus staff login authentication, role-based access control, audit logging, multi-factor authentication and encrypted storage for enterprise-level deployment.
- **Omnichannel customer support.** Reusing the same engine for Facebook Messenger, Telegram, Microsoft Teams, website live chat and email, all managed from one dashboard.
- **Predictive customer service.** Using historical data to remind customers before warranty expiry, recommend upgrades, suggest preventive maintenance and predict seasonal demand — moving from reactive to proactive engagement.

## 25. Technical Conclusion

The technical implementation delivers exactly what Part 1 promised: a hybrid AI WhatsApp assistant that automates the repetitive, clearly answerable volume while routing anything uncertain to a person. It combines AI-assisted interaction, deterministic business logic, a human-in-the-loop console, trilingual communication and cloud deployment on AWS Lightsail. The architecture is modular with swappable edges (channel, store, payment), so the pieces that depend on external approval can graduate to production one contained step at a time. The whole system is deployed live and verified by 348 automated tests across 19 suites. It is not a prototype on a slide — it is a working, deployed platform, and every claim in Part 1 traces to a capability documented and tested here.

---

# Appendix — Reuse and Redundancy Notes

This deliverable merges two source documents into one ordered read. This appendix records exactly what was reused, what was merged, and what was intentionally left out, so nothing was dropped silently and you can decide whether to reinstate anything.

## A. What each source contributed

| Source | Used for | Notes |
| --- | --- | --- |
| *Project Write-up ... 6AFRXLO4-14Sep2026* (latest) | **All of Part 1 (Business Proposal)** — the five themes, kept intact | This file's title mentioned "Technical Documentation" but the body contained only the business proposal; that gap is what this deliverable fills. |
| *Project Write-up ... 6AFRXLO4* (older) | **All of Part 2 (Technical Documentation)** — reused from its "Part B — Technical Write-up" | Its "Part A" business proposal was *not* reused, because the newer 14Sep2026 business proposal supersedes it and is better aligned to the guideline. |
| *SMYA — Business Proposal Guidelines* | The 5-theme structure and the CLEAR / CONCISE / EVIDENCE-BASED / CONSISTENT / STAKEHOLDER-AWARE checks that both parts follow | — |

## B. Reused from the older write-up with only light editing

The following technical sections were carried over from the older Part B and updated for consistency: Introduction (technical), User Requirements (R1–R8 + non-functional), Solution Design and Architecture, the enquiry pipeline, swappable edges, Data Design, Steering and Hooks, Modules and Subtasks, the guided sales/service flow, online booking, warranty check, conversational commerce, multilingual support, image recognition, the human-in-the-loop console, controls and risks, testing, deployment, and results.

## C. Changed on the way in (do not revert these)

- **Test count corrected: 340 -> 348 tests across 19 suites.** The older write-up said 340 in four places; the verified current figure is 348. Corrected everywhere in Part 2.
- **Corrupted arrow characters repaired.** The older file had a mojibake artefact where `routes -> controllers -> services -> store` arrows had become an unreadable character. These now render as clean arrows.
- **Team ownership aligned to the cover table.** Risk-owner names in the controls table were mapped to the current team (Tan Beng Tat — Project Owner; Low Ger Loon — DevOps), matching the 14Sep2026 cover page.
- **"Representative" spelled out** in place of the informal "rep" for a business-report register.

## D. Intentionally NOT duplicated (flagged, not silently dropped)

These older Part B sections overlapped material already covered better in Part 1. To keep one source of truth and avoid a contradictory second set of numbers, they were **cross-referenced instead of repeated**. If you prefer them restated inside Part 2, say so and I will reinstate any of them:

- **Older "Success Measures" (Part B, Section 32).** Duplicated the KPIs in Part 1, "Business Impact and Outcomes". Cross-referenced from Section 23 rather than repeated, so the KPI targets have one owner.
- **Older "Overall Conclusion" (Part B, Section 37).** Duplicated the business conclusion. Replaced with a short **Technical Conclusion** (Section 25) that adds a technical summary rather than repeating the business message.
- **Older Part A (its whole business proposal).** Superseded by the newer 14Sep2026 proposal, which is now Part 1. Not carried over.
- **Older "Delivery Plan and Team" business framing (Part B, Section 30).** The milestone plan was kept (Section 23) because it is engineering detail; the team table was consolidated into the single cover table to avoid two copies.

## E. Optional items you may still want

- **Figure placeholders.** The 14Sep2026 proposal contains figure callouts (for example "Figure 1.1 BIS Computer Service welcome screen", "Figure 3.4 Payment Process"). Those callouts are preserved in Part 1 as plain text. If you want them rendered as inline image tags pointing at the evidence screenshots in `screenshots/evidence/`, I can wire them up.
- **Single-figure sweep.** I standardised the test count to 348. If you re-run `npm test` and the number changes, tell me the new count and I will update every occurrence in one pass.

---

*End of combined Business Proposal and Technical Documentation.*
