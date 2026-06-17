# NestJS Interview Prep

## What You Must Know

### Core Architecture

- modules
- controllers
- providers
- dependency injection
- services

### Request Lifecycle

- middleware
- guards
- pipes
- interceptors
- exception filters

### Validation

- DTOs
- runtime validation
- transformation
- why API boundaries must be validated

### Auth

- JWT access tokens
- refresh tokens
- role-based access control
- protected endpoints

### Database Integration

- repositories / ORM structure
- transactions
- pagination
- indexing basics
- query efficiency

### Background Work

- queues / jobs
- async processing
- retries
- failure handling

### Observability And Reliability

- logging
- error handling
- rate limiting
- configuration management

## Questions You Should Expect

- why NestJS over Express?
- explain DI in NestJS
- how does request validation work?
- guards vs middleware?
- pipes vs interceptors?
- how do you structure modules?
- how do you handle auth and RBAC?

## What Good Answers Sound Like

`I use NestJS because it gives structure for larger TypeScript backends through modules, dependency injection, and clear request-pipeline concepts. That helps keep APIs maintainable as they grow across auth, data, jobs, and integrations.`

## Practical Prep

- explain one real API module end to end
- explain your auth flow
- explain one validation path
- explain one background job flow
- explain one failure case and recovery approach

## Red Flags

- shallow understanding of request lifecycle
- weak runtime validation reasoning
- no clear auth story
- pretending deep expertise without recent shipped proof
