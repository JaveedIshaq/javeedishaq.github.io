# Angular Interview Prep

## Your Goal

You are not becoming an Angular specialist.
You are defending real experience from the NERSC Life admin panel and any other production Angular work.

Angular is **legacy context** in your current stack strategy, not your forward identity.
But if you mention it in an interview, you must sound credible and specific — including awareness of where Angular is in 2025+ (v22).

Your positioning:

- React / Next.js is your current web direction
- Angular is a tool you have used for real admin and internal products
- You can explain tradeoffs between Angular and React/Next.js without sounding biased or ignorant
- You choose tools based on project context, not personal preference
- You are aware Angular has modernized significantly (Signals, SSR, standalone components, Vite/esbuild)

## What You Must Know

### Core Architecture (Modern Angular v22)

- **Standalone components** are now the default. No `NgModule` required for most new code.
- decorators: `@Component`, `@Injectable`, `@Input`, `@Output`, `input()` / `output()` signal-based APIs
- component lifecycle hooks: `ngOnInit`, `ngOnDestroy`, `ngOnChanges`
- template syntax: interpolation, property binding, event binding, two-way binding
- component communication: parent-to-child via `@Input` / `input()` signals, child-to-parent via `@Output` / `output()` and EventEmitter

### Angular Signals (The Modern Reactivity Model)

- **Signals** are Angular's fine-grained reactivity system as of v16+ and the default pattern in v22
- `signal()`, `computed()`, `effect()` — reactive values that update efficiently
- Signals replace or reduce the need for RxJS in many component-level state scenarios
- Compile-time optimizations make Signal-based apps faster by default
- You should know: when to use Signals vs. when RxJS still wins (complex async streams, HTTP cancellation, event composition)

### Dependency Injection

- Angular's DI system is built-in and strict
- services are singletons by default when provided at `'root'` level
- you inject services into components via constructors
- this is one of Angular's strongest architectural features compared to React's manual approach
- modern Angular also supports `inject()` function for injection contexts outside constructors

### RxJS And Observables

- Angular still uses RxJS heavily for async operations, especially HTTP and complex event streams
- `Observable`, `Subscription`, `Subject`, `BehaviorSubject`
- operators: `map`, `filter`, `switchMap`, `mergeMap`, `catchError`, `tap`, `takeUntil`
- memory management: unsubscribing in `ngOnDestroy` to prevent leaks, or using `async` pipe
- HTTP client returns observables by default
- **Modern context:** Signals are now preferred for component state. RxJS remains essential for HTTP, websockets, and complex async composition.

### Routing

- `RouterModule` / `provideRouter()` in standalone apps
- route configuration, lazy loading (loadComponent / loadChildren)
- route guards for auth protection (`CanActivate`, `CanDeactivate`)
- route parameters and query parameters
- nested routes for admin/dashboard structures

### Forms

- template-driven forms: simpler, HTML-centric
- reactive forms: explicit, testable, better for complex validation
- `FormGroup`, `FormControl`, `FormArray`, validators
- when to choose reactive over template-driven

### HTTP And Services

- `HttpClient` module
- interceptors for auth tokens, logging, error handling
- service layer separation: components handle UI, services handle data

### Change Detection

- default change detection strategy (zone.js-based)
- `OnPush` strategy for performance
- **Signals impact:** Signal-based components use a more efficient change detection path by default
- how change detection cycles work and what triggers them
- avoiding unnecessary digest cycles

### Server-Side Rendering (SSR) And Static Site Generation (SSG)

- Angular v22 supports SSR and SSG with full DOM hydration
- this is a major modernization that closes the gap with Next.js
- hydration means the server-rendered HTML is "activated" into a fully interactive Angular app
- you should know: Angular now has a credible SSR story, though Next.js still leads in the React ecosystem for this

### Performance And Build System

- Angular CLI now uses **Vite and esbuild** for fast builds
- `NgOptimizedImage` — built-in image optimization for Core Web Vitals
- lazy loading modules / components
- `trackBy` in `*ngFor`
- `OnPush` change detection
- unsubscribing from observables
- avoiding heavy computation in templates
- **Signals** improve performance by default through fine-grained updates

### DevTools And Developer Experience

- Angular DevTools: component tree inspector, DI tree view, performance profiling flame chart
- `ng update` — automated code transformations for major version migrations
- Language Service: code completion, navigation, refactoring, real-time diagnostics

## Questions You Should Expect

- how do you structure a large Angular application?
- what is the role of RxJS in Angular?
- **what are Angular Signals and when do you use them vs. RxJS?**
- reactive forms vs template-driven forms?
- how do you handle auth and route protection?
- how does Angular's dependency injection work?
- Angular vs React/Next.js: when would you choose one over the other?
- how do you manage state in Angular?
- what causes memory leaks in Angular and how do you prevent them?
- how do you optimize Angular performance?
- explain change detection in Angular
- **does Angular support server-side rendering? How does it compare to Next.js?**
- **what is the difference between standalone components and NgModules?**

## What Good Answers Sound Like

### On Angular In Your Stack

`I have used Angular for production admin panels, specifically the NERSC Life backend admin system. Angular's built-in DI, strong TypeScript integration, and opinionated structure made it a solid fit for a complex internal tool where consistency and maintainability mattered more than rapid UI iteration. I also kept up with Angular's modernization — I've worked with standalone components and Signals, which significantly improve developer experience and performance over the older NgModule + zone.js patterns. For new public-facing web products, I currently prefer Next.js and React because they align better with the modern product-engineer market and my full-stack TypeScript workflow, but Angular's SSR and Signals improvements have made it more competitive than it was a few years ago.`

### On Angular Signals

`Signals are Angular's modern reactivity system. Instead of relying on zone.js to detect changes across the entire component tree, Signals let you define fine-grained reactive state with signal(), computed(), and effect(). When a signal's value changes, only the parts of the UI that depend on it update. This is more efficient and easier to reason about than the old zone-based change detection. I use Signals for component state and simple reactive derivations. I still use RxJS for HTTP calls, complex async streams, and scenarios where cancellation or event composition matters — like a search input that debounces and cancels previous requests.`

### On RxJS

`RxJS is central to Angular's async model, especially for HTTP and complex event composition. I use observables for HTTP calls, websocket streams, and cross-component event buses. The key discipline is managing subscriptions carefully — I unsubscribe in ngOnDestroy or use async pipes where possible to avoid memory leaks. For complex flows, operators like switchMap and catchError keep the logic declarative and contained. With modern Angular, I use Signals for simple component state and RxJS for async orchestration — they complement each other.`

### On Angular vs React/Next.js

`Angular is more opinionated and batteries-included: routing, DI, forms, and HTTP are all built in. That can be an advantage for large teams building internal tools where consistency reduces decision fatigue. React and Next.js are more flexible and better suited to the modern product-engineer ecosystem I am targeting, especially for public-facing products, SEO, and server-rendered workflows. That said, Angular has closed some gaps — v22 has credible SSR with hydration, standalone components remove NgModule boilerplate, and Signals provide a modern reactivity model. I choose based on team context, product type, and long-term maintainability needs.`

### On Standalone Components

`Standalone components are now the default in Angular. Instead of declaring every component in an NgModule, you mark a component with standalone: true and import what it needs directly. This removes a lot of boilerplate and makes tree-shaking more effective. For the NERSC Life admin panel, if I were building it today, I would use standalone components with the new provideRouter() API instead of RouterModule. It makes the codebase more modular and easier to lazy-load at the component level.`

### On Dependency Injection

`Angular's DI system is one of its architectural strengths. Services are injected through constructors, and the framework handles singleton lifecycle by default when provided at 'root'. This makes testing easier and keeps components focused on UI logic while services own data and business rules. In modern Angular, you can also use the inject() function outside constructors, which is useful for composition functions and service factories. It enforces separation of concerns more strictly than React's manual approach.`

### On Forms

`For the NERSC Life admin panel, I used reactive forms because the workflows had complex validation, dynamic fields, and conditional logic. Reactive forms keep the form state in the component class, which makes testing, validation logic, and dynamic behavior easier to manage than template-driven forms.`

### On Performance

`In Angular, I focus on several performance levers: Signals for fine-grained reactivity, lazy loading modules or components to reduce initial bundle size, OnPush change detection to cut unnecessary digest cycles, NgOptimizedImage for automatic image optimization, and proper subscription cleanup to prevent memory leaks. For large lists, trackBy in ngFor avoids DOM recreation when data references change. The Vite/esbuild build pipeline in modern Angular also significantly improves build times for large codebases.`

### On SSR

`Angular v22 supports server-side rendering and static site generation with full DOM hydration. This is a meaningful improvement — it means Angular can now deliver fast first paints and better SEO, which was historically a weakness compared to Next.js. The hydration process takes server-rendered HTML and "activates" it into a fully interactive Angular app. For internal admin panels, SSR is less critical. For public-facing products, it makes Angular more viable than before, though Next.js still has a larger ecosystem and more mature deployment patterns for SSR.`

## Practical Prep

- explain the NERSC Life admin panel architecture in 60 seconds
- explain one RxJS stream you built and how you managed subscriptions
- explain why reactive forms were the right choice for a specific workflow
- explain one performance improvement you made
- explain one tradeoff between Angular and React/Next.js from real experience
- **explain when you would use Signals vs. RxJS in a real component**
- **explain the difference between standalone components and NgModules**
- **explain Angular SSR and when it matters vs. when it doesn't**

## Red Flags

- positioning yourself as an "Angular developer" instead of a product engineer who has used Angular
- not knowing RxJS basics — it is impossible to claim Angular experience without observable fluency
- **not knowing what Signals are — this is the modern Angular default**
- weak explanation of DI — this is Angular's core differentiator
- saying Angular is "better" or "worse" than React without context
- not mentioning subscription cleanup or memory leak prevention
- sounding like you only followed tutorials rather than shipped production admin tools
- claiming deep Angular expertise without being able to describe a real module or standalone component structure
- **not knowing Angular has modernized (SSR, standalone components, Signals, Vite)** — this makes you sound like you haven't touched Angular since 2020

## The Honest Positioning

If asked about Angular directly:

`Angular is part of my production background, especially for internal admin tools like the NERSC Life backend panel. I know the framework well enough to build and maintain serious products in it, including modern patterns like standalone components and Signals. My current learning and market positioning are focused on Next.js, React, and NestJS because that is where the product-engineer roles I am targeting are clustered. If a role or project genuinely needs Angular — especially modern Angular with Signals and SSR — I can deliver in it immediately.`

## NERSC Life Admin Panel — Your Real Story

Be ready to explain:

- what the admin panel did: user management, content operations, reporting, or whatever the actual workflows were
- why Angular was chosen for that project
- how you structured modules and services (or standalone components if modernized)
- how you handled auth and route guards
- how you connected to the backend API
- what was hard and how you solved it
- what you would do differently if building it today (standalone components, Signals, modern build pipeline)

This is not your headline skill.
It is a credible supporting detail that proves you can work across frameworks when the product demands it.

## Final Rule

Use Angular answers to show:

- breadth without confusion
- tool choice based on context
- real production discipline
- awareness of where the market is heading
- **awareness of Angular's modernization (Signals, SSR, standalone components, Vite)**

Do not use Angular answers to reposition yourself as an Angular specialist.
Your identity stays: **Solo Product Engineer**.
