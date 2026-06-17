# JavaScript Interview Prep

## Why JavaScript Matters

If your JavaScript is weak, your React, Next.js, and Node answers will collapse under pressure.

Do not skip fundamentals because TypeScript exists.

## What You Must Know

### Language Fundamentals

- variables: `let`, `const`, scope rules
- primitives vs references
- equality: `==` vs `===`
- truthy / falsy values
- optional chaining and nullish coalescing
- destructuring
- spread / rest
- template literals

### Functions

- function declarations vs expressions
- arrow functions
- `this` binding
- closures
- higher-order functions
- callbacks

### Arrays And Objects

- `map`, `filter`, `reduce`, `find`, `some`, `every`
- object iteration
- immutable update patterns
- array/object copy pitfalls

### Async JavaScript

- event loop basics
- call stack
- microtasks vs macrotasks
- promises
- `async/await`
- error propagation in async code
- parallel vs sequential async calls

### Modules

- `import` / `export`
- default vs named exports
- common module organization mistakes

## Interview Topics You Will Get

- explain closures
- explain the event loop
- what happens when you `await`
- difference between shallow copy and deep copy
- difference between `map` and `forEach`
- how to avoid mutating state
- how to handle concurrent async work

## Coding Practice Priorities

- transform arrays and objects
- flatten and group data
- deduplicate lists
- debounce / throttle concepts
- async request handling
- error-safe data parsing

## Red Flags

- weak understanding of async behavior
- mutating objects carelessly
- not understanding `this`
- using array methods without being able to explain them

## What Good Answers Sound Like

Do not give textbook jargon only.

Say:

- what it is
- when it matters
- what bug it prevents

Example:

`A closure is when a function retains access to variables from its lexical scope even after the outer function has returned. In React and Node work, this matters because stale closures can cause wrong state or event behavior if you capture old values unintentionally.`
