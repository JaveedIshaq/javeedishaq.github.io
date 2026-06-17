# 90-Day Product Engineer Plan

This folder is the single source of truth for your 90-day execution plan.

Your real problem is not lack of effort. It is **credibility concentration**. You already have enough breadth. What you do not yet have is a tight market story plus enough `TypeScript/Next.js/NestJS` proof to survive serious interviews.

The next 90 days are not for “learning everything.”
They are for doing one thing well:

- build one interviewable full-stack product
- extract strong interview stories from it
- become credible in the TypeScript product stack
- use that proof to compete for higher-paying remote roles

Your target identity is:

- **Product Engineer who ships mobile + web + backend + practical AI**

Not:

- Flutter-only developer
- generic AI enthusiast
- backend architect in theory

---

## How To Use This Folder

1. Follow one week at a time.
2. Do not jump ahead because a later topic looks more exciting.
3. Finish the weekly deliverables before adding extra scope.
4. Each week must produce visible proof: code, notes, case-study material, or interview answers.
5. Do not start a second serious product before the flagship is credible.

---

## Flagship Project

Project theme for the full 90 days:

- `plantUSA rebuilt properly`
- Audience: plant owners, home gardeners, and plant-care users
- Stack: `Flutter + NestJS + PostgreSQL + Next.js admin`
- AI: diagnosis support, care recommendations, follow-up workflows, history, and practical agent-assisted flows

This project works because it gives you:

- strong SaaS architecture story
- strong AI story without hype
- credible product-engineer proof
- reusable backend value for future indie products
- a believable connection to work you have already done

Do not build it as:

- a generic plant identifier
- a PictureThis clone
- an “AI super app”

Build it as:

- diagnosis support
- care plan workflow
- reminders
- plant history
- admin visibility into AI runs and failures

---

## 90-Day Structure

### Days 1-30: Build Backend Credibility

Goal:

- stop being adjacent to the TypeScript stack

Learn only what matters:

- TypeScript types, interfaces, generics, narrowing
- Node runtime basics: event loop, async/await, promises, streams
- NestJS modules, controllers, providers, DI, guards, interceptors, pipes
- validation with `class-validator` or `zod`
- auth: JWT, refresh tokens, RBAC
- PostgreSQL schema design, indexes, joins, pagination, transactions
- background jobs, logging, rate limiting, error handling

By day 30, you should be able to explain:

- why NestJS over Express
- how request validation works
- why TypeScript types are not runtime guarantees
- how auth and RBAC are implemented
- how Postgres schema choices affect performance

### Days 31-60: Build Full-Stack Product Proof

Goal:

- stop “learning NestJS”
- start behaving like a product engineer

Deepen only what supports shipping:

- `Next.js` App Router
- server vs client components
- route handlers
- forms and mutations
- loading/error states
- auth integration
- dashboard workflows

Tie system design to your actual product:

- single-tenant vs multi-tenant thinking
- file/image storage
- queue design
- caching strategy
- notification architecture
- observability
- cost control for AI features

By day 60, you should have strong answers for:

- “Design a SaaS backend”
- “How would you scale this?”
- “How did you decide between Supabase and a custom backend?”
- “What did AI actually improve in the product?”

### Days 61-90: Convert Proof Into Interview Performance

Goal:

- turn the build into interview leverage

Do this:

- polish the main case study
- write architecture, tradeoff, and failure stories
- rehearse backend, frontend, AI, and behavioral answers
- apply selectively only when your explanations are credible

If by day 90 you only have courses, notes, and tiny demos, you failed the plan.

---

## What To Study

Study should support the build, not become a hobby.

### System Design

- API design
- RBAC
- queues/jobs
- caching
- file/image storage
- observability
- multi-tenancy basics
- rate limiting

### SaaS Architecture

- auth lifecycle
- onboarding
- team/org model
- subscription boundaries
- admin/internal tools
- audit logging
- notifications
- usage metering for AI

### Technical Leadership Stories

- rescuing ambiguity
- cutting scope to ship
- making stack tradeoffs
- handling weak requirements
- using AI without losing code ownership

### Next.js / React Confidence

- App Router
- data fetching patterns
- mutation flows
- forms
- auth/session handling
- tables, filters, dashboards
- error/loading UX

### AI-Powered Product Patterns

- diagnosis support
- summarization
- recommendation generation
- smart tagging/classification
- retrieval where it actually helps
- workflow assistance, not generic chat

---

## Agent Roadmap

For you, agent learning should start in `TypeScript`, not Python.

Learn in this order:

- OpenAI API basics in TypeScript
- structured outputs
- tool calling
- retries and failure handling
- conversation state and workflow state
- retrieval with `pgvector`
- eval thinking: how do you know the feature works?
- tracing/logging of agent steps
- guardrails and cost control

Do not start with multi-agent systems.
That is where people waste time pretending to be advanced.

Python becomes worth learning only when:

- you need deeper eval pipelines
- you need Python-first libraries
- you need heavy document/data processing
- you need ML research workflows
- you need orchestration that is materially better in Python

Until then, Python is optional.

---

## Positioning

Here is the truth you should present:

- **Flutter** is your strongest proven edge.
- **Next.js/React + Node/NestJS** is your intentional market alignment.
- **Supabase/PostgreSQL** is your fast-shipping data layer.
- **AI** is part of the product workflow, not your costume.

### Emphasize

- end-to-end product shipping
- mobile + web + backend ownership
- real-time and operational systems
- practical AI features
- product tradeoffs and scope control
- learning velocity with real shipped proof

### De-emphasize

- Angular
- WordPress/CodeIgniter era work
- “years of experience” as the main selling point
- vague “interested in AI” language

### Say It Like This

- “My strongest production experience is Flutter and shipping real products across backend and admin workflows.”
- “I’m concentrating my product-engineer path around Next.js, TypeScript, NestJS, PostgreSQL, and Supabase.”
- “I use AI where it improves workflows: diagnosis support, summaries, recommendations, retrieval, and follow-up actions.”
- “I’m not chasing agent hype. I care about reliable product features.”

Resume / LinkedIn headline:

- `Product Engineer | Flutter, Next.js, TypeScript, NestJS, PostgreSQL/Supabase, AI Integration`

Portfolio should show only:

- `plantUSA rebuilt properly` case study
- `NurseLife`
- `CarPool`
- one AI-specific proof if distinct

Do not turn the portfolio into a museum of everything you have touched.

---

## Non-Negotiables

- Ignore `Angular` and Python-first AI stacks for now.
- Do not start a second serious product before `plantUSA` is credible.
- Do not spend a week only consuming content.
- Every week must strengthen one of these:
  - TypeScript full-stack credibility
  - product-engineer interview readiness
  - portfolio proof
  - practical AI implementation

---

## Weekly Files

- [week-01.md](/Users/javeedishaq/devwork/alchemist/indie-hacker/90dayplan/week-01.md)
- [week-02.md](/Users/javeedishaq/devwork/alchemist/indie-hacker/90dayplan/week-02.md)
- [week-03.md](/Users/javeedishaq/devwork/alchemist/indie-hacker/90dayplan/week-03.md)
- [week-04.md](/Users/javeedishaq/devwork/alchemist/indie-hacker/90dayplan/week-04.md)
- [week-05.md](/Users/javeedishaq/devwork/alchemist/indie-hacker/90dayplan/week-05.md)
- [week-06.md](/Users/javeedishaq/devwork/alchemist/indie-hacker/90dayplan/week-06.md)
- [week-07.md](/Users/javeedishaq/devwork/alchemist/indie-hacker/90dayplan/week-07.md)
- [week-08.md](/Users/javeedishaq/devwork/alchemist/indie-hacker/90dayplan/week-08.md)
- [week-09.md](/Users/javeedishaq/devwork/alchemist/indie-hacker/90dayplan/week-09.md)
- [week-10.md](/Users/javeedishaq/devwork/alchemist/indie-hacker/90dayplan/week-10.md)
- [week-11.md](/Users/javeedishaq/devwork/alchemist/indie-hacker/90dayplan/week-11.md)
- [week-12.md](/Users/javeedishaq/devwork/alchemist/indie-hacker/90dayplan/week-12.md)

---

## Final Call

Your winning move is not to become the best Node engineer.

It is to become **credible enough in the TypeScript full-stack ecosystem that your real advantage can finally be seen**:

- resilient
- cross-functional
- mobile-strong
- backend-capable
- product-oriented
- practical with AI

That is what this folder is for.
