# Week 2: Auth, RBAC, And Backend Discipline

## Objective

Build credibility in the most common backend interview area: auth, access control, and request flow.

## Main Outcome

By the end of this week, you should have:

- login flow
- JWT-based auth
- role-based access control
- validated request DTOs
- a clear explanation of how request validation and authorization work

## Build Tasks

- Implement auth endpoints:
  - register
  - login
  - refresh token
  - logout
- Add password hashing
- Add role model:
  - owner
  - admin
  - member
- Add organization membership checks
- Add route protection with guards
- Add request validation with `class-validator` or `zod`
- Add a seed script for test users and roles

## Study Focus

- NestJS guards, pipes, interceptors at a practical level
- JWT flow
- refresh-token tradeoffs
- runtime validation vs TypeScript types
- secure password handling

## System Design Focus

Study only what supports the build:

- auth lifecycle
- session vs token tradeoffs
- RBAC vs simple user roles
- tenant boundary basics

## Interview Prep Focus

Be able to answer:

- Why TypeScript types are not enough for API safety
- How NestJS request validation works
- How you designed organization-level RBAC
- Why JWT plus refresh tokens may be better than a naive session approach in your design

## End-Of-Week Deliverables

- working auth API
- RBAC enforcement on protected routes
- request validation working
- seed data script
- written notes for auth architecture

## Red Flags

- skipping validation
- storing everything in one user role without org context
- hand-waving security in interview notes
