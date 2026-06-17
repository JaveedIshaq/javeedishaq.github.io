# TypeScript Interview Prep

## Why TypeScript Matters

For your target roles, TypeScript is not optional polish.
It is part of your credibility.

## What You Must Know

### Core Types

- primitives
- arrays
- tuples
- objects
- unions
- intersections
- enums only if needed
- literal types

### Type Modeling

- interfaces
- type aliases
- extending interfaces
- composing types
- discriminated unions

### Functions And Generics

- typed function signatures
- generics
- generic constraints
- reusable utility typing

### Narrowing

- `typeof`
- `in`
- user-defined type guards
- control-flow narrowing

### Utility Types

- `Partial`
- `Pick`
- `Omit`
- `Record`
- `Required`
- `Readonly`

### Runtime vs Compile-Time

You must be able to explain:

- TypeScript catches many development-time problems
- TypeScript does not validate runtime input by itself
- backend systems still need runtime validation

## Backend-Specific TypeScript Topics

- DTO typing
- API response typing
- domain model typing
- error-safe parsing
- typed service boundaries
- avoiding `any`

## Interview Questions You Should Expect

- why use TypeScript over plain JavaScript?
- interface vs type alias?
- union vs intersection?
- why TypeScript is not enough for API validation?
- how do you model variable response shapes?
- how do generics improve reuse?

## What Good Answers Sound Like

Example:

`TypeScript improves maintainability and refactoring safety, especially in larger product systems. But it only checks types during development, so for backend input I still use runtime validation such as class-validator or zod to protect the API boundary.`

## Practice Tasks

- type a paginated API response
- model auth user roles with discriminated unions
- build a typed fetch wrapper
- type a form state model
- type a reusable repository/service layer

## Red Flags

- using `any` too freely
- confusing runtime validation with TypeScript safety
- poor generics understanding
- weak type modeling for real APIs
