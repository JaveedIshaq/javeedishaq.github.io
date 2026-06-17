# Mock Questions And Model Answers

This file contains 100 interview questions with model answers for senior-leaning product-engineer and full-stack interviews aligned to your stack:

- Flutter
- JavaScript
- TypeScript
- React
- Next.js
- NestJS
- PostgreSQL
- Supabase
- practical AI integration

Use this file to rehearse concise, high-signal answers.

---

## Section 1: Positioning And Career Story

### 1. Tell me about yourself.
**Model answer:**  
I’m a product engineer with deep Flutter experience and growing full-stack depth across Next.js, React, TypeScript, NestJS, PostgreSQL, and Supabase. Over time I’ve moved from delivering mobile features only to owning backend-connected product workflows end to end. My current focus is building complete product systems with practical AI features where they improve search, workflow speed, or user decision-making.

### 2. Why are you targeting Product Engineer roles?
**Model answer:**  
Because that is the work I actually want to do and increasingly already do. I’m strongest when I can own the path from user problem to shipped system across mobile, backend, admin, and product tradeoffs rather than being limited to only one layer.

### 3. Why not stay Flutter-only?
**Model answer:**  
Flutter remains a strong edge for me, but mobile-only positioning is too narrow for the market I’m targeting. I want to be useful across the full product surface, especially where mobile, web, backend, and AI-assisted workflows need to work together.

### 4. Why this stack?
**Model answer:**  
It aligns well with modern startup and remote product-engineer hiring. Flutter gives me strong mobile delivery, while Next.js, TypeScript, NestJS, PostgreSQL, and Supabase let me ship web, backend, and operational workflows in one coherent ecosystem.

### 5. What kind of roles are you best suited for?
**Model answer:**  
Product Engineer, Full-Stack Product Engineer, or startup engineering roles where one person needs to reason across frontend, backend, database, and practical AI-enabled workflows.

### 6. What is your strongest edge?
**Model answer:**  
My strongest edge is Flutter depth combined with product delivery thinking. I can ship mobile well, but I’m increasingly valuable because I can connect that mobile experience to backend systems, admin workflows, and real product architecture decisions.

### 7. What are you intentionally improving right now?
**Model answer:**  
My strongest deliberate focus is becoming more credible in TypeScript full-stack backend and web product work, especially NestJS, Next.js, PostgreSQL, and the kind of architecture decisions that come up in modern SaaS products.

### 8. How do you describe yourself in one sentence?
**Model answer:**  
I’m a product engineer who ships mobile and web systems with practical AI where it actually improves the workflow.

### 9. What kind of work energizes you?
**Model answer:**  
Work where the product problem is messy, the system spans multiple layers, and the goal is to turn ambiguity into a shipped feature or workflow with real user value.

### 10. What do you not want to be hired for?
**Model answer:**  
I don’t want to be hired only as a narrow UI implementer or for generic CRUD work with no product ownership. I’m a better fit where delivery, system thinking, and practical problem solving matter.

---

## Section 2: JavaScript

### 11. Explain closures.
**Model answer:**  
A closure is when a function retains access to variables from its lexical scope even after the outer function has finished. In product code this matters because closures are powerful for encapsulation, but stale closures can also cause bugs in event handlers and React components.

### 12. Explain the event loop.
**Model answer:**  
JavaScript runs on a single-threaded call stack, and asynchronous work is coordinated through the event loop. Promises and microtasks are processed before macrotasks like timers, which matters when debugging async order and UI or backend timing behavior.

### 13. Difference between `==` and `===`?
**Model answer:**  
`===` checks strict equality without type coercion, while `==` allows coercion and can create confusing results. I use `===` by default because it avoids a large class of bugs.

### 14. What is the difference between `map` and `forEach`?
**Model answer:**  
`map` transforms an array and returns a new array, while `forEach` is for side effects and does not return the transformed collection. I prefer `map` when building derived data in UI or API response shaping.

### 15. What is a shallow copy?
**Model answer:**  
A shallow copy copies the top-level structure but keeps nested object references. That matters in state updates because mutating nested data after a shallow copy can still mutate the original object unexpectedly.

### 16. What are truthy and falsy values?
**Model answer:**  
Falsy values include things like `false`, `0`, `''`, `null`, `undefined`, and `NaN`. Everything else is truthy. This matters in conditionals and when handling optional fields or default behavior.

### 17. What does `async/await` give you over raw promises?
**Model answer:**  
It gives a more readable control flow for asynchronous logic while still using promises underneath. It makes sequential async work easier to reason about, especially in controllers, services, and data-fetching logic.

### 18. How do you run async work in parallel?
**Model answer:**  
If tasks are independent, I use `Promise.all` or a controlled variant depending on failure behavior. The key is knowing when work can run concurrently and when ordering matters.

### 19. What is `this` in JavaScript?
**Model answer:**  
`this` depends on how a function is called, not where it is defined, except for arrow functions which capture lexical `this`. I avoid relying on implicit `this` behavior when it makes code harder to reason about.

### 20. What causes memory or logic issues in async JavaScript?
**Model answer:**  
Uncleared subscriptions, unresolved timers, stale closures, too many parallel requests, and poor error handling can all create bugs or resource problems. I try to be explicit about cleanup and concurrency.

---

## Section 3: TypeScript

### 21. Why use TypeScript?
**Model answer:**  
It improves maintainability, refactoring safety, and shared understanding across frontend and backend code. In larger product systems it helps prevent many bugs earlier, especially around API contracts and domain modeling.

### 22. Interface vs type alias?
**Model answer:**  
Both model shapes, but interfaces are often useful for extendable object contracts, while type aliases are more flexible for unions, intersections, and more complex type composition. I choose based on clarity rather than ideology.

### 23. What is a union type?
**Model answer:**  
A union allows a value to be one of several possible types. It is especially useful for modeling states, variant API responses, or discriminated domain behavior.

### 24. What is a discriminated union?
**Model answer:**  
It is a union where each member has a shared discriminant field, like `type`, which allows safe narrowing. It is useful for modeling success/error states or workflow states more clearly.

### 25. Why isn’t TypeScript enough for backend validation?
**Model answer:**  
Because TypeScript checks types during development, not at runtime. API boundaries still need runtime validation with tools like class-validator or zod to protect the system from invalid external input.

### 26. What are generics for?
**Model answer:**  
Generics let me write reusable logic while preserving type information. They are especially useful in API wrappers, repositories, utility functions, and reusable response models.

### 27. What is type narrowing?
**Model answer:**  
Type narrowing is how TypeScript refines a broader type into a more specific one based on checks like `typeof`, `in`, or control flow. It makes conditional logic safer and easier to model.

### 28. What is `Partial<T>` used for?
**Model answer:**  
It makes all fields optional and is useful for update payloads, patch-style inputs, or building objects incrementally. I use it carefully so I don’t accidentally weaken important invariants.

### 29. How do you avoid `any` abuse?
**Model answer:**  
I model types intentionally, use `unknown` when input is truly untrusted, and narrow from there. If I reach for `any`, it should be temporary and isolated rather than becoming the default habit.

### 30. How do you model an API response?
**Model answer:**  
I create explicit response shapes, often including metadata like pagination fields or status variants. I keep transport contracts separate enough from internal domain logic to avoid coupling everything together.

---

## Section 4: React

### 31. How does React re-render?
**Model answer:**  
A component re-renders when its state changes, its parent re-renders and passes new values, or context it depends on changes. Good React work is mostly about keeping those boundaries predictable and avoiding unnecessary churn.

### 32. When do you use `useEffect`?
**Model answer:**  
I use `useEffect` only for synchronizing with external systems like network requests, subscriptions, timers, or browser APIs. If something can be derived during render, I try not to push it into an effect.

### 33. What causes infinite loops in `useEffect`?
**Model answer:**  
Usually unstable dependencies or state updates inside the effect that retrigger it repeatedly. The fix is understanding dependency identity and whether the logic belongs in an effect at all.

### 34. What is a controlled component?
**Model answer:**  
A controlled component is where React state owns the input value and updates it through event handlers. This is useful for validation, conditional UX, and predictable form behavior.

### 35. How do you decide between local state and shared state?
**Model answer:**  
If the state is only relevant to one component or a tight UI area, I keep it local. If multiple components depend on it or it represents broader app behavior, I lift it or use a more shared pattern.

### 36. What are common React performance issues?
**Model answer:**  
Unnecessary re-renders, poor list key usage, expensive derived calculations on every render, and oversized client-side state can all hurt performance. I try to fix architecture before micro-optimizing.

### 37. How do you structure forms in React?
**Model answer:**  
I keep input ownership clear, model validation explicitly, and handle loading, success, and error states cleanly. For bigger forms I separate view logic from mutation logic so the code stays maintainable.

### 38. What is prop drilling?
**Model answer:**  
It is passing data through multiple component layers that do not need it directly. It becomes a problem when it harms clarity or reuse, at which point context or better state boundaries may help.

### 39. When is context enough?
**Model answer:**  
Context is enough when you need reasonably lightweight shared state such as auth, theme, or a constrained domain scope. It is not always the right choice for frequently changing or very broad application state.

### 40. How do you handle loading and error states?
**Model answer:**  
I make them explicit in the UI and in state transitions. A good product UI should clearly communicate when data is loading, when an action failed, and what the user can do next.

---

## Section 5: Next.js

### 41. Why Next.js over plain React?
**Model answer:**  
Next.js gives routing, server rendering options, better page architecture, and strong support for admin and product web surfaces. It helps move faster on real products without hand-assembling too much infrastructure.

### 42. What is the App Router?
**Model answer:**  
It is Next.js’s file-system-based routing model that supports nested layouts, server components, route handlers, loading states, and more structured application organization.

### 43. Server component vs client component?
**Model answer:**  
Server components are good for data-heavy rendering and reducing client bundle pressure. Client components are needed when the UI depends on interactivity, browser APIs, or client-managed state.

### 44. When do you use `"use client"`?
**Model answer:**  
Only when interactivity or browser-specific behavior requires it. I try to keep components server-first by default because that leads to cleaner boundaries and often lighter client bundles.

### 45. How do you handle auth in Next.js?
**Model answer:**  
I decide which routes are public, protected, or role-specific, then make session-aware rendering and route protection explicit. For admin surfaces, I also care about role enforcement and not just whether the user is signed in.

### 46. How do you build an admin dashboard?
**Model answer:**  
I focus on tables, filters, list/detail flows, mutation safety, error states, and role-aware access. Admin UI should optimize clarity and speed of operational work rather than visual flair.

### 47. When do you fetch data on the server?
**Model answer:**  
I prefer server-side fetching for data-heavy views, initial page load, and pages where SEO or fast first render matters. Client fetching is more appropriate for highly interactive or session-driven updates after render.

### 48. How do you handle forms and mutations in Next.js?
**Model answer:**  
I keep the mutation path clear, validate inputs, show loading/error states, and redirect or refresh intentionally after success. The important part is maintaining predictable UX and clean request handling.

### 49. How do you think about Next.js performance?
**Model answer:**  
I think in terms of render boundaries, client bundle size, data-fetching placement, and minimizing unnecessary client-only logic. Performance usually improves when architecture is cleaner.

### 50. What mistakes do people make in Next.js?
**Model answer:**  
They overuse client components, blur data-fetching boundaries, and build pages without clear loading or error handling. That creates heavier bundles and weaker maintainability.

---

## Section 6: NestJS

### 51. Why NestJS over Express?
**Model answer:**  
NestJS provides structure for larger TypeScript backends through modules, dependency injection, and a clear request lifecycle. That makes it easier to maintain APIs that grow across auth, data, background jobs, and integrations.

### 52. What are modules in NestJS?
**Model answer:**  
Modules group related controllers, providers, and configuration so the backend can be organized around domains rather than becoming one unstructured service layer.

### 53. What is dependency injection?
**Model answer:**  
Dependency injection lets components depend on abstractions or services without manually wiring everything together in the consuming code. In practice it improves testability and architectural clarity.

### 54. What is a guard?
**Model answer:**  
A guard controls whether a request is allowed to proceed, usually for auth or authorization decisions. It is a good fit for protecting routes based on identity or roles.

### 55. What is a pipe?
**Model answer:**  
A pipe transforms or validates incoming data before it reaches business logic. It is useful for keeping controllers and services cleaner by enforcing boundary rules early.

### 56. What is an interceptor?
**Model answer:**  
An interceptor sits around the request/response flow and is useful for cross-cutting concerns like logging, response transformation, timing, or wrapping behavior consistently.

### 57. How do you validate request data?
**Model answer:**  
I validate at the API boundary using DTOs plus runtime validation, typically class-validator or zod-based approaches depending on the project style. I do not rely on TypeScript alone.

### 58. How do you structure auth in NestJS?
**Model answer:**  
I separate sign-in flows, token issuance, refresh behavior, and route protection clearly. I also treat role checks and authorization as separate concerns from basic authentication.

### 59. When do you use background jobs?
**Model answer:**  
I use them when work is slow, failure-prone, or non-essential to the immediate response, such as notifications, AI processing, exports, or heavy post-write workflows.

### 60. How do you keep a NestJS backend maintainable?
**Model answer:**  
By keeping modules domain-oriented, validating inputs properly, separating service logic from transport concerns, and being explicit about auth, data access, and background processing boundaries.

---

## Section 7: PostgreSQL

### 61. How do you design a schema for a SaaS product?
**Model answer:**  
I start from the core entities and workflow boundaries, then model relationships, constraints, auditability, and query patterns. I care about correctness first, then indexes and access patterns that support the product’s real usage.

### 62. When do you add indexes?
**Model answer:**  
I add indexes based on actual query patterns, especially filters, joins, and sorts that matter to common endpoints. I avoid indexing blindly because indexes improve reads but cost writes and maintenance.

### 63. What is the difference between normalization and denormalization?
**Model answer:**  
Normalization reduces duplication and improves consistency. Denormalization can improve read performance or simplify certain access patterns when used intentionally. I start normalized, then denormalize only where the product justifies it.

### 64. When do you use transactions?
**Model answer:**  
When multiple writes must succeed or fail together, such as creating an order, its items, and related inventory or payment state updates. Transactions protect consistency under failure.

### 65. Offset vs cursor pagination?
**Model answer:**  
Offset pagination is simpler but becomes less efficient and less stable on large or changing datasets. Cursor pagination is better for scale and consistent navigation through ordered records.

### 66. How do you debug a slow query?
**Model answer:**  
I check query shape, query count, indexes, filters, joins, and whether we are fetching too much data. I try to identify whether it is a modeling, indexing, or access-pattern issue before jumping to infrastructure fixes.

### 67. When would you use JSONB?
**Model answer:**  
When some data is flexible or semi-structured and does not justify full relational modeling yet. I use it carefully, not as an excuse to avoid schema design.

### 68. How do you prevent duplicate records?
**Model answer:**  
I use a combination of application logic and database constraints, especially unique constraints where duplication must not happen. The database should protect critical invariants, not just the app layer.

### 69. How do you model auditability?
**Model answer:**  
I add explicit audit or event logging where changes, approvals, or AI-assisted actions need traceability. That is especially important in workflow-heavy systems.

### 70. What is the N+1 query problem?
**Model answer:**  
It happens when one main query triggers many follow-up queries per record, which scales poorly. I try to catch it through query review, profiling, and better data-loading patterns.

---

## Section 8: Supabase

### 71. Why use Supabase?
**Model answer:**  
Supabase is useful when product speed matters and I want auth, storage, realtime, and PostgreSQL-backed workflows without building every backend piece from scratch immediately.

### 72. When would you choose Supabase over NestJS?
**Model answer:**  
I choose Supabase when the product benefits from fast BaaS capabilities and the domain logic is not yet complex enough to require a fully custom service layer. I choose NestJS when orchestration and backend control matter more.

### 73. When do you outgrow Supabase-only architecture?
**Model answer:**  
When business logic, workflow orchestration, queue-heavy processing, or service boundary complexity grows enough that a dedicated backend becomes the cleaner and safer choice.

### 74. How do you think about Supabase Auth?
**Model answer:**  
It is a fast way to ship authentication, but I still treat authorization and role-aware access as explicit design concerns. Signed in is not the same as properly authorized.

### 75. What is RLS and why does it matter?
**Model answer:**  
Row-level security controls which rows a user can access at the database layer. It matters because it helps enforce data protection closer to the source rather than trusting every client query path.

### 76. What kind of features are good fits for Supabase Realtime?
**Model answer:**  
Live updates, notifications, collaborative state, or status-driven operational workflows. I use realtime where freshness creates real user value, not just because the feature exists.

### 77. How do you avoid misusing Supabase?
**Model answer:**  
By being clear about what belongs in BaaS and what belongs in custom backend logic. I do not force all product complexity into one tool just because it is convenient early on.

### 78. What do you store in Supabase Storage?
**Model answer:**  
User uploads, media, and documents that fit storage-backed product flows, especially where integration with auth and access rules is useful.

### 79. What risks exist with BaaS-heavy products?
**Model answer:**  
Weak security modeling, hidden logic spread across many places, and difficulty handling more complex orchestration later. The tool is strong, but only if used intentionally.

### 80. How do you explain Supabase in an interview?
**Model answer:**  
As a pragmatic speed tool for auth, storage, realtime, and PostgreSQL-backed delivery, not as a replacement for backend architecture thinking.

---

## Section 9: Flutter

### 81. How do you structure a large Flutter app?
**Model answer:**  
I separate UI, state, domain, and data responsibilities clearly enough to keep feature growth manageable. I care about maintainability, predictable state, and clean backend boundaries more than abstract purity.

### 82. BLoC vs Riverpod?
**Model answer:**  
Both can work well. I choose based on team clarity, state complexity, and how explicit I want event-driven flows to be. The important thing is maintaining predictable boundaries, not defending one library as ideology.

### 83. How do you optimize Flutter performance?
**Model answer:**  
I look at rebuild frequency, image handling, large lists, startup work, and expensive UI logic. Most performance gains come from architecture and rendering discipline before micro-optimizations.

### 84. How do you handle offline-first workflows?
**Model answer:**  
I treat local state, sync timing, conflict behavior, and user expectations explicitly. Offline-first is not just caching; it is about predictable data behavior when connectivity is imperfect.

### 85. How do you connect Flutter cleanly to a backend?
**Model answer:**  
I keep API contracts explicit, isolate network logic, model failure states clearly, and avoid letting transport concerns leak everywhere into UI logic.

### 86. How do you handle app-store-ready quality?
**Model answer:**  
I care about crash reduction, release discipline, performance, edge-case handling, and predictable user flows. Production quality is mostly about reliability, not just whether the app compiles.

### 87. What makes Flutter your strongest edge?
**Model answer:**  
I have shipped real mobile products with it under production constraints, not just demos. That gives me confidence in architecture, state management, debugging, and delivery under real product conditions.

### 88. How do you decide state boundaries in Flutter?
**Model answer:**  
I keep transient UI state local, move shared or workflow-relevant state higher, and avoid mixing backend, form, and UI concerns carelessly. Predictability matters more than cleverness.

### 89. What is the hardest part of Flutter product work?
**Model answer:**  
Usually not the widgets themselves, but keeping state, backend integration, performance, and release quality clean as the product grows.

### 90. How do you avoid sounding like a mobile-only candidate?
**Model answer:**  
By explaining Flutter as one delivery layer inside a broader product system that includes APIs, auth, data modeling, admin workflows, and practical AI features.

---

## Section 10: Practical AI

### 91. What AI features are worth building?
**Model answer:**  
The ones that reduce friction, improve relevance, or speed up workflows. Search, summarization, extraction, classification, and workflow assistance are usually better than generic chat features.

### 92. How do you decide whether AI is needed?
**Model answer:**  
I ask whether the problem actually benefits from probabilistic reasoning or semantic understanding. If rules or standard search are enough, I avoid adding AI just for novelty.

### 93. How do you reduce hallucinations?
**Model answer:**  
By narrowing the task, grounding inputs when needed, validating output shape, adding review points, and avoiding letting the model silently act beyond its reliability.

### 94. When do you use RAG?
**Model answer:**  
When the system needs product-specific or document-specific knowledge that should be retrieved dynamically rather than embedded into static prompts.

### 95. How do you validate AI output?
**Model answer:**  
I prefer structured outputs where possible, validate expected fields, log failures, and gate important actions behind review or fallback logic.

### 96. How do you control AI cost?
**Model answer:**  
I choose models based on task value, avoid unnecessary calls, cache where appropriate, move low-priority work async, and keep expensive AI steps limited to meaningful user moments.

### 97. How do you measure AI usefulness?
**Model answer:**  
By product outcomes, not just model output quality. I look for reduced manual work, better search success, faster workflow completion, or better user decision support.

### 98. How do you design AI in a trustworthy way?
**Model answer:**  
I make outputs reviewable, avoid hiding uncertainty, preserve auditability, and make sure users can correct or reject the result when needed.

### 99. What is your approach to AI architecture?
**Model answer:**  
I integrate AI as one subsystem inside the product, usually through explicit service boundaries, logging, queue-backed processing when appropriate, and measurable product outcomes.

### 100. What is the biggest mistake teams make with AI features?
**Model answer:**  
They optimize for the feature sounding impressive instead of being useful, reliable, and measurable. That leads to expensive demos instead of product value.

---

## How To Practice With This File

1. Read each answer out loud.
2. Rewrite weak answers in your own voice.
3. Replace generic examples with your own shipped work.
4. Keep answers concise enough for interview conversation, not lecture mode.

## Final Rule

The goal is not memorization.

The goal is to sound like someone who:

- has shipped real systems
- understands tradeoffs
- knows where each tool fits
- uses AI practically
- can explain decisions clearly under pressure
