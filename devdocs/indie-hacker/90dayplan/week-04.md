# Week 4: Queues, Background Processing, And Reliability

## Objective

Move from CRUD developer behavior to backend product-engineer behavior.

## Main Outcome

By the end of this week, you should have:

- asynchronous diagnosis processing flow
- background job support
- structured logging
- error handling strategy
- rate limiting basics

## Build Tasks

- Add background job system for diagnosis processing
- Queue image analysis and care-plan generation instead of doing it in request-response flow
- Add structured logger
- Add central error handling
- Add retry logic for processing failures
- Add rate limiting to AI-heavy routes
- Add processing status updates

## Study Focus

- background jobs and worker model
- request/response vs async job flow
- retries and idempotency
- structured logging
- rate limiting basics

## System Design Focus

- when to use background jobs
- failure handling
- eventual consistency in product workflows
- cost control on expensive endpoints

## Interview Prep Focus

Be able to explain:

- Why diagnosis analysis should not happen in the request thread
- What happens when a job fails
- What idempotency means in practice
- How rate limiting protects AI endpoints

## End-Of-Week Deliverables

- queue-backed diagnosis processing
- retry strategy
- structured logs
- centralized error-handling layer
- short architecture note on reliability

## Red Flags

- synchronous AI/image processing
- no retry story
- no logging beyond `console.log`
