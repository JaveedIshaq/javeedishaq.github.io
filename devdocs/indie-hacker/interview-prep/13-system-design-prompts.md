# System Design Prompts

## Goal

Prepare for full-stack and product-engineer system design interviews with prompts that match your target market.

You do not need FAANG-scale distributed-systems theater.
You need strong, credible answers for startup and product-engineer environments.

## How To Answer System Design Questions

Use this order:

1. clarify the problem
2. define users and workflow
3. define core entities
4. define API and data flow
5. define auth and permissions
6. define performance/scaling concerns
7. define reliability/failure handling
8. define tradeoffs

## What Interviewers Want

They want to see whether you can:

- break down a messy system clearly
- prioritize correctly
- make reasonable assumptions
- talk about tradeoffs
- avoid overengineering

## Core Prompt List

### 1. Design a SaaS backend for a mobile + web product

Focus on:

- auth
- users
- roles
- API structure
- admin workflows
- data model
- notifications

### 2. Design an admin dashboard system

Focus on:

- list/detail views
- filtering
- role-based access
- auditability
- mutation safety

### 3. Design a booking system

Focus on:

- availability
- reservations
- race conditions
- cancellations
- payment state

### 4. Design a delivery tracking workflow

Focus on:

- order status
- realtime updates
- location updates
- notification triggers

### 5. Design a content/document search system with AI

Focus on:

- ingestion
- embeddings
- pgvector
- retrieval
- ranking
- user query flow

### 6. Design a support ticket triage system

Focus on:

- ticket intake
- classification
- assignment
- search
- AI suggestions
- audit trail

### 7. Design a multi-tenant SaaS system

Focus on:

- teams/orgs
- memberships
- access boundaries
- data isolation

### 8. Design a file upload and processing workflow

Focus on:

- storage
- metadata
- background jobs
- retry behavior
- security

### 9. Design a notifications system

Focus on:

- event sources
- user preferences
- delivery channels
- async jobs
- retries

### 10. Design an AI-assisted workflow system

Focus on:

- where AI fits
- sync vs async
- logging AI runs
- validation
- human review
- cost control

## Senior-Level Follow-Up Questions

For any prompt, be ready for:

- how does this scale?
- what breaks first?
- what do you log?
- how do you secure it?
- what would you simplify for v1?
- when would you use Supabase vs NestJS?
- when would you add queues?
- what metrics matter?

## Example Structure For Your Stack

### If Asked: “Design a SaaS backend”

Say:

1. define the primary user workflow
2. identify core entities
3. choose auth approach
4. explain API/module structure in NestJS
5. explain Postgres schema
6. explain async jobs for slow work
7. explain admin and audit needs
8. explain where Supabase may help or where custom backend is better

## Practical Tradeoff Themes

You should be ready to discuss:

- NestJS vs Supabase
- sync vs async processing
- offset vs cursor pagination
- server vs client fetching in Next.js
- AI sync call vs queue-backed job
- normalized schema vs denormalized read optimization

## Practice Method

For each prompt:

1. speak your answer in 10 minutes
2. write the entities
3. write the API modules
4. write the failure cases
5. write the tradeoffs

## Final Rule

A good system design answer is not the most complex answer.

It is the clearest answer that:

- fits the product
- handles real failure modes
- shows judgment
- respects scope
