# Supabase Interview Prep

## What You Must Know

### Core Capabilities

- auth
- database
- storage
- realtime
- row-level security basics

### When To Use Supabase

Use it when:

- speed matters
- auth/storage/realtime are needed quickly
- you do not need a heavy custom backend yet

Do not use it blindly when:

- domain logic is complex
- queue-heavy orchestration is required
- you need backend control beyond BaaS comfort

### Auth

- sign-up / sign-in flows
- session handling
- role-aware access
- protected data access

### Data

- schema modeling
- joins and views basics
- indexing basics
- pagination
- query efficiency

### Security

- RLS basics
- policy reasoning
- avoiding overexposed data

### Realtime

- subscriptions
- live updates
- when realtime is useful vs overkill

## Questions You Should Expect

- when would you choose Supabase over NestJS?
- how do you secure data in Supabase?
- how do you structure auth and roles?
- when do you outgrow Supabase-only architecture?

## What Good Answers Sound Like

`I use Supabase when product speed matters and auth, storage, or realtime can be shipped faster through BaaS. I prefer NestJS when the backend requires more custom business logic, orchestration, or service-layer control.`

## Practical Prep

- explain a Supabase auth flow
- explain a role-aware data access model
- explain a realtime feature
- explain when you would move logic out of Supabase into NestJS

## Red Flags

- no security explanation
- weak RLS understanding
- treating Supabase like magic
- not knowing the limits of BaaS
