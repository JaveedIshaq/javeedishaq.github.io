# TypeScript Study Guide

## Purpose

This guide is for mastering TypeScript at the level required for:

1. Product Engineer interviews
2. real React, Next.js, and NestJS project work
3. designing maintainable product systems with safer boundaries

TypeScript is not decoration.
For your target roles, it is part of whether people trust you to work across frontend, backend, and domain logic without creating avoidable ambiguity.

---

## Part 1: Why TypeScript Matters

Weak TypeScript usually means one of two things:

1. the engineer writes JavaScript with type annotations and calls it enough
2. the engineer depends on `any`, weak models, and unsafe assumptions

That is not enough for Product Engineer work.

### What Interviewers Are Actually Testing

When interviewers ask TypeScript questions, they are usually testing:

- whether you model real product data intentionally
- whether you understand compile-time vs runtime safety
- whether you can make APIs, UI state, and services easier to evolve
- whether you know how to reduce bugs during refactors
- whether you can represent messy real-world states clearly

### Product-Engineer Interpretation

TypeScript matters because product systems are full of boundaries:

- browser to server
- server to database
- API to client
- auth state to UI state
- AI output to application logic

TypeScript helps make those boundaries explicit.
That is why it improves credibility.

---

## Part 2: The Mental Model You Need

Think about TypeScript in five layers:

1. value shapes
2. variant states
3. reusable function contracts
4. boundary safety
5. refactoring safety

If you understand those, TypeScript becomes a design tool instead of a syntax tax.

### Core Rule

TypeScript is best used to express intent, not impress people.

Bad TypeScript:

- complex for no product value
- hard to read
- full of `any`
- weak at boundaries

Good TypeScript:

- models real business shapes
- narrows uncertainty clearly
- reduces unsafe assumptions
- makes changes easier

---

## Part 3: Core Types And Why They Matter

## Primitive Types

Examples:

- `string`
- `number`
- `boolean`
- `null`
- `undefined`

These matter because most business logic starts with them, but interviewers usually care more about how you compose them.

## Arrays And Tuples

### Array

```ts
const tags: string[] = ["urgent", "review"];
```

Use arrays when you have a list of values of the same kind.

### Tuple

```ts
const point: [number, number] = [40.7, -74.0];
```

Use tuples when position matters and the length is fixed.

### Product Relevance

Arrays are common in:

- API responses
- UI option lists
- event collections

Tuples are less common in application code, but useful in some utility or coordinate-like cases.

### Interview Answer

`Arrays model lists of the same kind of value. Tuples are better when position and fixed length matter. In product systems I use arrays far more often, but tuples can help when a small positional contract is clearer than an object.`

---

## Literal Types

Literal types let values represent exact states.

```ts
type Status = "draft" | "published" | "archived";
```

### Why They Matter

They are excellent for:

- workflow states
- roles
- request modes
- UI variants

This is much safer than loosely using generic strings everywhere.

---

## Unions And Intersections

## Union Types

A union means a value can be one of several types.

```ts
type SearchResult = PlantResult | ArticleResult;
```

### Why It Matters

Real product systems often have variant shapes:

- success vs error
- admin user vs member user
- upload pending vs upload complete

Unions let you model that honestly.

## Intersection Types

An intersection combines multiple type requirements.

```ts
type Timestamped = { createdAt: string; updatedAt: string };
type Plant = { id: string; name: string };

type PlantRecord = Plant & Timestamped;
```

### Interview Answer: Union vs Intersection

`A union means the value can be one of several possible shapes. An intersection means it must satisfy multiple type requirements at once. I use unions for variant states and intersections for composition when a model needs multiple capabilities or properties together.`

---

## Part 4: Type Modeling For Real Systems

This is where TypeScript becomes valuable.

## Interfaces

```ts
interface User {
  id: string;
  email: string;
  role: "admin" | "member";
}
```

### Good Fit

Use interfaces when:

- you want clear object contracts
- the object shape is central
- extension is useful

## Type Aliases

```ts
type UserRole = "admin" | "member";
```

```ts
type ApiState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
```

### Good Fit

Use type aliases when:

- you need unions
- you need intersections
- you need utility composition
- you want expressive variant modeling

### Interview Answer: Interface vs Type Alias

`I use interfaces for clear object contracts when that reads well, and type aliases when I need unions, intersections, or more expressive composition. The important thing is not ideology. It is choosing the form that makes the model clearer.`

---

## Discriminated Unions

This is one of the most important TypeScript concepts for real applications.

### Example

```ts
type DiagnosisJobState =
  | { status: "queued"; queuedAt: string }
  | { status: "running"; startedAt: string }
  | { status: "succeeded"; resultId: string }
  | { status: "failed"; errorMessage: string };
```

### Why It Matters

Discriminated unions are great for:

- async UI states
- workflow states
- API result variants
- payment or subscription states
- AI job states

### Why They Beat Loose Booleans

This is weak:

```ts
type JobState = {
  isLoading: boolean;
  isError: boolean;
  resultId?: string;
};
```

It allows impossible combinations.

This is stronger:

```ts
type JobState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; resultId: string };
```

Now state is explicit and safer.

### Interview Answer

`I use discriminated unions to model variable states explicitly. They are especially useful for async workflows and API results because they prevent impossible combinations and make control flow easier to reason about.`

---

## Part 5: Functions And Generics

## Typed Function Signatures

### Example

```ts
function formatPlantName(name: string): string {
  return name.trim().toLowerCase();
}
```

### Why It Matters

Function types are how you define service and utility contracts clearly.

## Generics

Generics let you write reusable logic while preserving type information.

### Example

```ts
type PaginatedResponse<T> = {
  items: T[];
  nextCursor: string | null;
  totalCount?: number;
};
```

```ts
function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}
```

### Product Relevance

Generics are useful for:

- API response wrappers
- repository patterns
- form utilities
- fetch wrappers
- table components

### Generic Constraints

```ts
function getId<T extends { id: string }>(item: T): string {
  return item.id;
}
```

This says the function can work with any type that has an `id`.

### Interview Answer: Why Generics Matter

`Generics let me write reusable logic without losing type information. They are useful in API wrappers, repositories, table components, and service utilities where the structure is shared but the data type changes.`

### Red Flag

Do not use generics just because you can.
If the abstraction is harder to understand than the repeated code, the generic was not worth it.

---

## Part 6: Type Narrowing

Real systems deal with uncertain input.
Type narrowing is how TypeScript becomes practical.

## `typeof`

```ts
function normalizeValue(value: string | number) {
  if (typeof value === "string") {
    return value.trim();
  }

  return value.toString();
}
```

## `in`

```ts
type Plant = { scientificName: string };
type Article = { title: string };

function getLabel(item: Plant | Article) {
  if ("scientificName" in item) {
    return item.scientificName;
  }

  return item.title;
}
```

## User-Defined Type Guards

```ts
type ApiError = { message: string; code: string };

function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    "code" in value
  );
}
```

### Why It Matters

This is critical when:

- parsing unknown API data
- handling third-party library values
- processing AI output
- validating error shapes

### Interview Answer

`Type narrowing is how TypeScript refines a broader type into a safer, more specific one based on runtime checks. That matters whenever the code starts from uncertainty, such as API responses, unknown errors, or variable result shapes.`

---

## Part 7: Utility Types

Utility types help model common transformations cleanly.

## `Partial<T>`

Makes all fields optional.

```ts
type User = {
  id: string;
  name: string;
  email: string;
};

type UpdateUserInput = Partial<User>;
```

### Use Carefully

Good for patch-like updates.
Dangerous when it weakens too much.

## `Pick<T, K>`

```ts
type UserPreview = Pick<User, "id" | "name">;
```

Good for smaller projections.

## `Omit<T, K>`

```ts
type CreateUserInput = Omit<User, "id">;
```

Good when deriving create-input style shapes.

## `Record<K, V>`

```ts
type ErrorMap = Record<string, string>;
```

Good for dynamic keyed objects.

## `Required<T>`

Makes all properties required.

## `Readonly<T>`

Marks fields as immutable.

### Interview Answer

`I use utility types when they make the intent clearer, such as Partial for patch-style updates, Pick and Omit for derived shapes, and Record for keyed maps. I try not to stack utilities so heavily that the resulting model becomes hard to read.`

---

## Part 8: Compile-Time Vs Runtime

This is one of the most important interview topics.

## What TypeScript Does

TypeScript checks code during development and build time.

It helps catch:

- wrong property access
- invalid function usage
- missing fields
- unsafe refactors

## What TypeScript Does Not Do By Itself

It does not validate external input at runtime.

That means it does not magically protect:

- HTTP request bodies
- query params
- user-submitted forms
- third-party API responses
- AI outputs

### Example Of The Mistake

Weak thinking:
`The DTO type says this field is a string, so it must be a string.`

Real-world problem:
The client can still send something else.

### Correct Pattern

Use runtime validation at the boundary.

Examples:

- `zod`
- `class-validator`
- explicit parsing logic

### Interview Answer

`TypeScript improves development-time safety, but it does not validate runtime input. That is why backend boundaries still need runtime validation with tools like zod or class-validator, especially for untrusted request data and third-party responses.`

---

## Part 9: Backend-Specific TypeScript

This is where many Product Engineer interviews get more serious.

## DTO Typing

DTOs should represent boundary input clearly.

```ts
type CreateDiagnosisDto = {
  imageUrl: string;
  notes?: string;
};
```

This helps document intent, but still needs runtime validation.

## API Response Typing

### Example

```ts
type ApiSuccess<T> = {
  success: true;
  data: T;
};

type ApiFailure = {
  success: false;
  message: string;
};

type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
```

### Why It Matters

This makes frontend handling clearer and safer.

## Domain Model Typing

Keep domain concepts explicit.

```ts
type Role = "admin" | "operator" | "member";

interface Membership {
  userId: string;
  organizationId: string;
  role: Role;
}
```

### Why It Matters

Weak domain models create weak architecture discussions.

## Typed Service Boundaries

A service should make its expectations and outputs obvious.

```ts
interface DiagnosisService {
  create(input: CreateDiagnosisDto): Promise<DiagnosisRecord>;
}
```

### Product Relevance

This matters because Product Engineers work across:

- UI layers
- API layers
- admin workflows
- AI integrations

Typed service boundaries make those layers easier to connect safely.

---

## Part 10: Modeling Real Product Scenarios

## Scenario 1: Auth User Roles

```ts
type UserRole = "admin" | "operator" | "member";

interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}
```

Why it matters:
- roles are explicit
- admin logic becomes clearer

## Scenario 2: Form State

```ts
type FormState<T> =
  | { status: "idle"; values: T }
  | { status: "submitting"; values: T }
  | { status: "success"; values: T }
  | { status: "error"; values: T; message: string };
```

Why it matters:
- UI state is honest
- impossible combinations are reduced

## Scenario 3: AI Output Boundary

```ts
type DiagnosisSuggestion = {
  plantName: string;
  confidence: number;
  careAdvice: string[];
};
```

This alone is not enough.
You still need runtime validation before trusting the model output.

## Scenario 4: Paginated Admin Response

```ts
type PaginatedResponse<T> = {
  items: T[];
  nextCursor: string | null;
  totalCount?: number;
};
```

Why it matters:
- reusable
- good for lists, dashboards, admin surfaces

---

## Part 11: Common Mistakes And Red Flags

## Overusing `any`

`any` disables safety.
Sometimes it is a short-term escape hatch, but if it spreads, the system becomes less trustworthy.

### Better Rule

Prefer:

- real modeling
- `unknown` for untrusted input
- narrowing from there

## Confusing Runtime And Compile-Time Safety

This is one of the most common interview failures.

## Overcomplicated Types

If the type system becomes harder to understand than the business problem, you went too far.

## Weak Variant Modeling

Using loose booleans where discriminated unions should exist creates ambiguous state.

## Copying Backend Types Directly Into UI Without Thought

Transport shapes and UI shapes are related, but they do not always need to be identical.

### Interview Red Flags

- “TypeScript makes runtime validation unnecessary.”
- “I just use any when types get annoying.”
- “Type aliases and interfaces are basically the same so it doesn’t matter.”
- no explanation for modeling variant response states

---

## Part 12: Common Interview Questions And Strong Answers

## 1. Why use TypeScript over JavaScript?

`TypeScript improves maintainability, refactoring safety, and shared understanding across a codebase. In larger product systems that matters because APIs, UI state, and service logic evolve over time, and stronger typing helps catch many problems earlier.`

## 2. Interface vs type alias?

`I use interfaces when I want clear object contracts and extension reads naturally. I use type aliases when I need unions, intersections, or more expressive composition. The goal is choosing the form that makes the model clearer, not following dogma.`

## 3. Union vs intersection?

`A union means a value can be one of several shapes. An intersection means it must satisfy multiple requirements at once. I use unions for variant states and intersections for composition.`

## 4. Why is TypeScript not enough for API validation?

`Because TypeScript only checks types during development and build time. It does not validate external input at runtime, so request bodies, query params, and third-party responses still need runtime validation.`

## 5. How do generics improve reuse?

`Generics let me write reusable logic without losing type information. They are especially useful in paginated responses, repositories, fetch wrappers, and reusable components where the behavior is shared but the data shape changes.`

## 6. How do you model variable response shapes?

`I usually model them with unions, often discriminated unions when the states are explicit, such as success versus error or loading versus loaded. That makes both control flow and UI handling safer.`

## 7. How do you avoid `any` abuse?

`I try to model shapes intentionally, use unknown when input is truly untrusted, and narrow from there. If I use any, it should be temporary and isolated rather than becoming the default pattern.`

## 8. What kind of product problems does TypeScript help most?

`It helps most where systems have multiple boundaries and evolving models, such as API contracts, admin workflows, variant UI states, auth roles, and service integration points.`

---

## Part 13: Weak Answers Vs Strong Answers

## Weak

`TypeScript helps catch errors.`

Why weak:

- vague
- no product context
- no boundary awareness

## Strong

`TypeScript improves maintainability and refactoring safety, especially in systems where frontend, backend, and service boundaries need to stay aligned. It is particularly useful for API contracts, workflow states, and reusable product infrastructure.`

## Weak

`Generics make code reusable.`

## Strong

`Generics make code reusable while preserving type information. That matters in real products because utilities like paginated responses, service wrappers, or table components often share behavior while operating on different data models.`

---

## Part 14: Practical Exercises

## Exercise 1: Type A Paginated Response

Create a generic paginated API type and use it with:

- users
- plants
- notifications

Goal:
- generics
- reusable response modeling

## Exercise 2: Model Auth Roles

Create a type-safe model for:

- guest
- member
- admin

Then write a function that narrows behavior based on role.

Goal:
- literal types
- unions
- narrowing

## Exercise 3: Build A Typed Fetch Wrapper

Create a small wrapper that returns typed JSON and throws on bad responses.

Goal:
- generics
- service boundary modeling

## Exercise 4: Model UI Async State

Use a discriminated union for:

- idle
- loading
- success
- error

Goal:
- safer UI state
- explicit variant handling

## Exercise 5: Parse Unknown Input Safely

Start from `unknown`, validate shape, and narrow safely before use.

Goal:
- runtime boundary thinking
- narrowing discipline

---

## Part 15: Self-Test Questions

If you cannot answer these clearly, your TypeScript is still shallow.

1. Why does TypeScript not replace runtime validation?
2. When is a discriminated union better than several optional fields?
3. When is `unknown` better than `any`?
4. What does a generic constraint solve?
5. Why can overcomplicated types be harmful?
6. When should UI types differ from raw API response types?
7. How does TypeScript help Product Engineers specifically?
8. What kind of bugs does TypeScript catch early, and what kind does it not catch at all?

---

## Part 16: Real Project Implementation Rules

When using TypeScript in real product work:

1. model domain concepts explicitly
2. keep workflow states honest
3. prefer `unknown` over `any` for untrusted input
4. validate external data at runtime
5. use generics where reuse is real, not decorative
6. keep types readable for teammates
7. align types with system boundaries
8. use TypeScript to support clarity, not hide confusion

### Product-Engineer Rule

Good TypeScript is not about making the type system clever.
It is about making a growing product easier to reason about, safer to change, and harder to misuse.

---

## Final Standard

You are ready when you can do three things:

1. explain TypeScript clearly in interview language
2. use it to model real product workflows and boundaries
3. know where TypeScript ends and runtime validation must begin

That is the bar.
