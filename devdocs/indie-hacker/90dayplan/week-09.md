# Week 9: System Design And Architecture Narratives

## Objective

Turn your implementation into defendable architecture stories.

## Main Outcome

By the end of this week, you should have:

- one strong system-design narrative
- one SaaS architecture narrative
- one tradeoff narrative
- one quality/reliability narrative

## Work Tasks

- write architecture doc for `plantUSA rebuilt properly`
- diagram core modules:
  - auth
  - plants
  - diagnoses
  - care plans
  - reminders
  - AI workflow
  - audit
- document the main tradeoffs you made
- identify future scaling points

## Study Focus

- single-user vs family/shared account tradeoffs
- scaling diagnosis processing
- caching opportunities
- observability basics
- cost control for AI
- reminder/notification architecture

## Interview Prep Focus

Write and rehearse answers for:

- Design a plant-care SaaS/mobile backend
- How would you scale diagnosis and AI processing?
- Why NestJS instead of Supabase-only architecture?
- Why Supabase might still be the right choice in some products
- Where would you add caching first?

## Leadership Story Focus

Extract these from your real history:

- scope-cutting under pressure
- ambiguous requirements
- working across backend and frontend
- using AI to ship while retaining architectural ownership

## End-Of-Week Deliverables

- architecture doc
- one-page system design summary
- five interview answers in written form
- tradeoff notes

## Red Flags

- describing the system only in technology names
- no explanation of tradeoffs
- no user/problem framing
