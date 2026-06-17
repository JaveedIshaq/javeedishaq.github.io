# VoiceOps Intake

## What This Project Is

`VoiceOps Intake` is a voice-first AI workflow product for businesses that receive inbound calls and need structured intake, qualification, routing, and follow-up.

It is not a generic voice bot.
It is not a fake "AI employee."
It is a controlled workflow system that:

- answers inbound calls
- collects structured information
- classifies intent
- routes or escalates correctly
- logs everything
- creates follow-up actions in a backend system

This makes it a strong project for high-paying product-engineer interviews because it combines:

- real-time interaction
- backend architecture
- operational workflows
- human-in-the-loop AI
- admin dashboards
- auditability

---

## Why This Project Matters

This project sits at the crossover of:

- voice AI
- agentic workflows
- workflow automation
- admin tooling
- operational software

That is exactly where the market is paying attention in 2026.

It is a better project than a generic chatbot because it proves:

- product thinking
- workflow design
- system reliability
- AI guardrails
- full-stack execution

---

## One-Sentence Product Promise

"VoiceOps Intake answers inbound business calls, captures structured information, routes requests intelligently, and keeps a complete audit trail so teams can respond faster without losing control."

---

## Best Initial Niche

Do not build this as a universal voice platform.

Pick one niche for the first version:

- clinic appointment intake
- field service booking
- lead qualification for service businesses
- customer support intake
- hiring/recruitment screening intake

Best fit for you:

- `clinic or care workflow intake`
- or `service-business lead intake`

Why:

- closer to your real-world and product history
- easier to make believable
- easier to explain in interviews
- easier to define workflow boundaries

---

## Core Problem

Small and mid-sized businesses lose time and money when inbound calls are:

- missed
- poorly documented
- routed to the wrong person
- manually re-entered into systems
- inconsistently followed up

Traditional call handling creates these problems:

- staff repeat the same intake questions
- callers wait on hold
- call notes are incomplete
- no audit trail exists
- follow-up tasks are dropped

`VoiceOps Intake` fixes this by turning calls into structured workflow events.

---

## Target Users

### Primary Buyer

- SMB owner
- operations lead
- clinic manager
- service coordinator
- support/admin team lead

### End Users

- front-desk teams
- operations staff
- support agents
- sales coordinators

### End Customer

- caller who wants to:
  - book
  - report an issue
  - request a quote
  - ask for support
  - complete intake

---

## Ideal MVP Use Case

Choose one workflow only.

Recommended MVP:

`AI voice intake for service booking and triage`

The voice agent should:

- greet the caller
- identify intent
- collect key fields
- confirm captured details
- create an intake record
- assign status
- route to the correct queue
- escalate to human when confidence is low or the request is sensitive

---

## MVP Features

### Caller Experience

- inbound call answered by AI
- natural greeting
- intent capture
- structured question flow
- confirmation of captured information
- human escalation option

### Business Workflow

- create intake record
- classify request type
- assign status
- route to the correct team or queue
- create callback/task record
- full transcript log
- confidence and outcome log

### Admin Dashboard

- call list
- transcript view
- extracted fields
- status board
- escalation queue
- operator review
- analytics summary

### AI Reliability Layer

- confidence score
- fallback route
- retry/rephrase handling
- human handoff trigger
- audit trail of every AI action

---

## What To Explicitly Avoid In MVP

- outbound cold-calling sales bot
- autonomous deal-closing claims
- emotion-detection nonsense
- full CRM replacement
- multi-agent orchestration theater
- broad omnichannel platform claims
- deep telephony infrastructure work beyond what the product needs

If you try to build all that, the project will collapse into complexity.

---

## Recommended Stack

### Frontend

- `Next.js` for admin dashboard
- `React` for workflow screens

### Backend

- `NestJS`
- `TypeScript`
- `PostgreSQL`

### Voice / Realtime Layer

- telephony provider or voice platform
- speech-to-text
- LLM orchestration
- text-to-speech

Examples conceptually:

- inbound call webhook/event stream
- STT transcript stream
- response generation
- TTS playback

You do not need to build the voice transport layer from scratch.

### Data / State

- `PostgreSQL`
- optional queue for async follow-up tasks
- audit/event tables

### AI Layer

- prompt-based workflow controller
- structured output extraction
- intent classification
- follow-up task generation

---

## Core Data Model

Your first backend version should likely have these entities:

- users
- organizations
- members
- phone_numbers
- calls
- call_turns
- transcripts
- intake_records
- extracted_fields
- routing_rules
- queues
- tasks
- escalations
- ai_runs
- audit_logs

Do not over-design this.
But do not make everything one giant table either.

---

## Request / Event Flow

The core flow should look like this:

1. Incoming call received
2. Call session created
3. Voice input transcribed
4. Intent classified
5. Required fields collected
6. Data confirmed with caller
7. Intake record created
8. Queue/task/escalation generated
9. Transcript + AI-run log saved
10. Admin dashboard updated

This is the architecture you should be able to explain in interviews.

---

## Structured Data To Capture

For service-intake MVP, capture things like:

- caller name
- phone number
- service request type
- location
- urgency
- preferred callback time
- brief issue summary

For clinic-style intake, capture things like:

- caller identity
- patient name if different
- appointment reason
- urgency
- preferred time slot
- special instructions

---

## AI Responsibilities

The AI should do only these jobs first:

- classify intent
- extract structured fields
- ask the next best missing question
- summarize the request
- recommend queue or escalation path

That is enough.

Do not let AI:

- improvise unrestricted policy
- make sensitive decisions without human review
- pretend certainty where confidence is low

---

## Guardrails

This project is only credible if it handles uncertainty properly.

Required guardrails:

- confidence threshold for classification
- fallback script when speech is unclear
- repeat/clarify flow
- human escalation when:
  - caller is upset
  - policy-sensitive request appears
  - medical/legal/financial sensitivity appears
  - confidence is low
- transcript retention and privacy policy awareness
- explicit logging of AI decisions

If you skip this, it becomes demo garbage.

---

## Admin Dashboard Scope

Your `Next.js` admin should include:

### Core Pages

- login
- dashboard
- call queue
- call detail
- transcript review
- intake record detail
- escalation queue
- analytics page
- settings/routing rules

### Useful UI Components

- status badges
- confidence badges
- structured field cards
- transcript timeline
- queue filters
- escalation actions
- operator notes

This dashboard is a major part of why the project has interview value.

---

## Reusable Backend Modules

This project is strong because many modules can be reused later.

Reusable modules include:

- auth
- organizations / teams
- roles / permissions
- audit logs
- event timeline
- AI-run logs
- queue/task management
- notifications
- admin shell
- structured extraction pipeline

These modules also overlap well with:

- `OpsPilot`
- `DocFlow AI`
- support automation products
- intake/review workflow tools

---

## Interview Value

This project helps you answer strong interview questions around:

- event-driven workflows
- TypeScript full-stack product design
- AI reliability and human-in-the-loop workflows
- state modeling
- admin dashboard architecture
- queue-based systems
- tradeoffs between synchronous and async processing
- auditability and observability

You should be able to answer:

- Why use `NestJS` here?
- How do you model a call session?
- How do you handle low-confidence AI output?
- What data must be persisted for auditability?
- When do you escalate to a human?
- How do you protect user trust?

---

## What Makes This Better Than A Generic Chatbot Project

A generic chatbot project signals:

- wrapper thinking
- weak product boundaries
- unclear ROI

This project signals:

- workflow ownership
- structured system design
- real operational value
- user trust and safety thinking
- product-engineer maturity

That is why it is worth doing.

---

## Suggested Build Phases

### Phase 1: Workflow-First Prototype

- model call sessions
- simulate transcript input if needed
- build intake flow
- build admin review UI
- log AI runs

Goal:

- prove workflow before perfecting voice

### Phase 2: Real Voice Integration

- connect telephony or voice provider
- connect STT
- connect TTS
- support basic live intake

Goal:

- prove real inbound flow

### Phase 3: Routing And Escalation

- add queue assignment
- add routing rules
- add human handoff
- add task/callback generation

Goal:

- make the workflow operational

### Phase 4: Trust, Analytics, And Polish

- confidence reporting
- analytics
- error handling
- replay/review tools
- call outcome tracking

Goal:

- make it interview-grade and portfolio-grade

---

## Success Criteria

This project is successful if:

- a call can create a structured intake record
- the AI asks useful follow-up questions
- low-confidence cases are escalated safely
- the dashboard shows full traceability
- you can explain every major architecture decision clearly

This project is not successful if:

- it only demos a talking bot
- there is no backend workflow depth
- no review queue exists
- no auditability exists
- the AI appears clever but the system is operationally useless

---

## How To Position It Later

On resume, portfolio, or interviews, position it like this:

"Built a voice-first intake workflow system using `Next.js`, `NestJS`, `PostgreSQL`, and AI orchestration to capture inbound calls, extract structured information, route requests, and provide human-review safeguards with full auditability."

That sounds like a serious product engineer built it.

---

## Final Recommendation

If you build this, build it as:

- a workflow product
- a controlled AI system
- an admin-heavy operational tool

Do not build it as:

- a flashy demo
- a fake autonomous employee
- a generic voice chatbot platform

That difference decides whether this becomes career leverage or just another abandoned AI experiment.
