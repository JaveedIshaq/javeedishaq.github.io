# AI Household Asset & Warranty Tracker

## What This Project Is

`AI Household Asset & Warranty Tracker` is a practical consumer utility that helps people organize appliances, receipts, warranties, manuals, and maintenance reminders using AI to remove setup friction.

This is not a hype AI product.
That is exactly why it is strong for an indie-hacker path.

It solves a boring but believable problem:

- people lose receipts
- forget warranty deadlines
- forget maintenance schedules
- cannot find product details when something breaks

The AI helps by extracting information from photos and documents, but the actual value is:

- reminders
- organization
- searchability
- low-friction setup

---

## Why This Project Matters

For your long-term indie path, this is one of the best ideas because it is:

- practical
- retention-friendly
- reminder-driven
- understandable
- not dependent on agent hype
- aligned with reusable backend modules

It is also a better long-term side-product than many broad AI categories because users can understand the value immediately.

---

## One-Sentence Product Promise

"Scan appliances and receipts once, then stop forgetting warranties, manuals, and maintenance tasks."

---

## Core Problem

Households lose money and time because they cannot easily track:

- purchase dates
- receipts
- warranty expiration
- maintenance schedules
- user manuals
- repair history

When an appliance breaks, users often do not know:

- whether it is still under warranty
- where the receipt is
- what maintenance they missed
- where the manual is

That is a real, recurring problem.

---

## Target Users

### Primary Users

- homeowners
- renters with multiple appliances
- organized family managers
- budget-conscious households

### Strong Secondary Users

- landlords
- property managers
- small office managers

Primary first-market recommendation:

- homeowners and family managers

They feel the problem often enough and can understand the value quickly.

---

## Why This Is A Strong Indie Project

This idea has several advantages:

- easy to explain
- useful without enterprise sales
- strong reminder loop
- clear premium features
- reusable backend and mobile patterns
- AI improves onboarding instead of carrying the whole product

That last point matters.

Bad AI products depend on AI to create fake value.
Good AI products use AI to reduce friction around a real workflow.

This is the second kind.

---

## Ideal MVP

The MVP should do only this:

1. User adds an appliance or device
2. User scans receipt and optionally warranty card/manual
3. AI extracts key information
4. User confirms extracted data
5. App stores asset profile
6. App creates reminders
7. User can search and view asset history later

That is enough.

Do not overcomplicate the first version.

---

## MVP Features

### Asset Capture

- add asset manually or by scan
- upload receipt image
- upload warranty card
- upload manual PDF or image

### AI Extraction

- product/asset name
- brand
- model if available
- purchase date
- seller/store
- warranty duration or end date
- maintenance-related dates if detectable

### Asset Record

- asset detail page
- stored receipt/manual
- warranty countdown
- service notes
- repair history

### Reminder System

- warranty expiry reminder
- maintenance reminder
- follow-up reminder

### Search And Organization

- search by asset name
- filter by room/category
- view upcoming reminders

---

## What To Avoid In MVP

- smart home integrations
- IoT sync
- marketplace or repair booking
- insurance claim automation
- deep OCR perfectionism
- chatbot interface
- family collaboration complexity

The first version should be clean and boring.

---

## Recommended Stack

### Mobile

- `Flutter`

### Backend

- `NestJS`
- `TypeScript`

### Database

- `PostgreSQL`

### Optional Fast-Launch Variant

- `Supabase` can be a valid option if you want faster shipping

### AI Layer

- OCR / vision extraction
- LLM for field normalization
- structured output validation

### Web/Admin

- `Next.js` optional admin or support console

---

## Core Data Model

Suggested entities:

- users
- households
- household_members
- assets
- asset_categories
- asset_files
- receipts
- warranties
- maintenance_schedules
- reminders
- ai_runs
- audit_logs

Optional later:

- service_events
- repair_quotes
- replacement_history

---

## Core Workflow

1. User adds asset
2. Uploads receipt or warranty image
3. OCR/AI extracts fields
4. User reviews and confirms
5. Asset profile saved
6. Reminder rules generated
7. Future reminders triggered
8. User revisits asset record when needed

This is the workflow you should optimize.

---

## AI Responsibilities

AI should do:

- OCR extraction
- field normalization
- identify likely warranty dates
- identify product/brand names
- reduce user setup effort

AI should not do:

- pretend certainty
- auto-save unreliable values without confirmation
- invent warranty dates or terms

This product depends on trust.

---

## Guardrails

Required:

- confidence indicators
- editable extracted fields
- user confirmation before save
- graceful failure for weak images
- clear fallback to manual entry
- audit/history of extraction events

If users cannot correct AI output easily, the app becomes annoying instead of useful.

---

## User Experience Priorities

This product wins or loses on friction.

Most important UX priorities:

- capture flow is fast
- extracted fields are easy to confirm
- reminders feel dependable
- finding stored info later is easy
- the app feels like a household memory system

Do not waste time on:

- social features
- community
- decorative AI gimmicks

---

## Monetization

Reasonable options:

- free tier with limited assets
- premium subscription for unlimited assets/reminders
- family/shared plan later
- one-time pro unlock later if the audience resists subscription

Good premium hooks:

- unlimited assets
- advanced reminder rules
- cloud backup/sync
- family sharing
- longer history/archive

---

## Reusable Backend Modules

This project reuses a lot from your other systems:

- auth
- users/households
- file upload/storage
- reminders
- notifications
- AI-run logs
- audit logs
- search/filter infrastructure
- admin shell if you want support tooling

This is why it is a good indie-hacker reuse project.

---

## Why This Is Better Than A Generic Scanner App

A generic scanner app says:

- "I can OCR stuff."

This product says:

- "I solve a recurring life-management problem."

That difference matters.

The value is not the scan.
The value is:

- reminders
- organization
- retrieval later
- reduced mental load

That is a stronger business.

---

## Suggested Build Phases

### Phase 1: Core Asset Vault

- add asset
- upload files
- save metadata
- manual entry fallback

### Phase 2: AI Extraction

- OCR
- structured extraction
- confirm-and-save flow

### Phase 3: Reminder Engine

- warranty reminders
- maintenance reminders
- due/overdue views

### Phase 4: Search And Retention

- search/filter
- asset history
- support/admin or analytics if needed

---

## Success Criteria

This project is successful if:

- users can add assets quickly
- AI reduces setup friction
- reminders are reliable
- asset information is easy to find later
- the product feels useful even without "chatting"

It is not successful if:

- the OCR is clever but the workflow is weak
- reminders are unreliable
- too much manual setup is required
- users cannot trust or edit extracted data

---

## Portfolio / Business Positioning

This is not your best job-first portfolio piece.
That is not its purpose.

Its purpose is:

- reusable architecture
- believable consumer utility
- side-income potential
- practical AI product discipline

Position it like this:

"Built a mobile-first household asset and warranty tracker using `Flutter`, `NestJS`, `PostgreSQL`, and AI-assisted extraction to turn receipts, warranties, and manuals into searchable asset records with reminder workflows."

That is honest and useful.

---

## Final Recommendation

This should be your post-90-day indie-hacker reuse project, not your urgent job project.

That is because:

- it is practical
- it is reusable
- it has retention logic
- it teaches product discipline
- it avoids empty AI hype

It is a side-business candidate, not your main interview weapon.
