# React Interview Prep

## What You Must Know

### Fundamentals

- components
- props
- state
- rendering flow
- controlled inputs
- lifting state up

### Hooks

- `useState`
- `useEffect`
- `useRef`
- `useReducer`
- `useContext`

Understand:

- effect dependencies
- cleanup functions
- stale closures
- avoiding unnecessary effects

### State Management

- local state vs shared state
- when context is enough
- when external state management helps
- avoiding prop drilling

### Performance

- render behavior
- unnecessary re-renders
- list keys
- lazy loading
- splitting components by responsibility

### Forms And Data

- controlled forms
- validation
- loading / error states
- mutation flows
- optimistic UI basics

## Interview Questions

- explain how React re-renders
- when do you use `useEffect`?
- what causes infinite loops in effects?
- when to use context?
- how do you structure forms?
- how do you handle loading and error states?

## What Good Answers Sound Like

`I use effects only for synchronization with external systems such as network, subscriptions, or browser APIs. If logic can be derived during render, I avoid pushing it into useEffect because that usually adds complexity and bug risk.`

## Practical Prep

- build and explain a filterable table
- build and explain a form with validation
- explain a mutation flow with loading/success/error states
- explain how you would split a dashboard component

## Red Flags

- overusing `useEffect`
- poor state boundaries
- no explanation for loading/error UX
- not understanding controlled components
