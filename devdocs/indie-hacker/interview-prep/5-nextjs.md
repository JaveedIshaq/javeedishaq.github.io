# Next.js Interview Prep

## What You Must Know

### App Router

- routes
- nested layouts
- server components
- client components
- route handlers
- loading and error boundaries

### Data Fetching

- server-side fetching
- when to fetch on the server vs client
- caching basics
- revalidation basics
- mutation patterns

### Forms And Actions

- form handling
- validation
- mutation flow
- post-submit UX

### Auth Integration

- protected pages
- session-aware rendering
- role-aware admin pages

### Admin/Product Web

- tables and filters
- dashboard layout
- detail views
- upload flows
- error handling

## Questions You Should Expect

- why use Next.js over plain React?
- server vs client components?
- when does a component need `"use client"`?
- how would you build an admin dashboard?
- how would you secure admin routes?
- how do you handle loading and error states?

## What Good Answers Sound Like

`I prefer server components by default for data-heavy views because they reduce client bundle pressure and fit backend-driven pages well. I use client components only where interactivity, browser APIs, or client-side state are necessary.`

## Practical Prep

- build a simple admin page
- build a list/detail flow
- explain an upload flow
- explain server/client tradeoffs

## Red Flags

- not understanding App Router basics
- overusing client components
- weak auth explanation
- no answer for admin workflows
