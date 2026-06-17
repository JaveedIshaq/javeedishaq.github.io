# React Study Guide

## Purpose

This guide is for mastering React at the level required for:

1. Product Engineer interviews where React is the UI layer
2. building real Next.js admin dashboards, product web apps, and Flutter-mirroring web surfaces
3. explaining React decisions in terms of product value, not just technical trivia

React is not a standalone identity. In your stack, React lives inside Next.js and serves as the UI engine for admin panels, landing pages, product dashboards, and any web surface that a Flutter mobile app needs a companion for. Interviewers will test whether you understand React deeply enough to ship complete features — not just whether you memorized hook rules.

---

## Part 1: Topic Positioning

### What React Is (One Clear Sentence)

React is a JavaScript library for building composable, reactive user interfaces from a component tree where data flows down and events bubble up.

### Where It Sits In The Product Engineer Stack

```
Flutter (mobile)          Next.js/React (web, admin, landing)
        \                        /
         Node.js/NestJS (backend)
                  |
         PostgreSQL/Supabase (data)
                  |
         OpenAI SDK + pgvector (AI layer)
```

React is your web UI engine. It is not your backend, not your database, not your AI pipeline. Interviewers who hear you talk about React as if it's the whole stack will flag you as frontend-only thinking. Product Engineers connect React to backend APIs, databases, and AI services — and they can explain every seam.

### Why React Matters For Your Specific Career Path

- **Track A (Income Runway):** Better-paying product roles and contracts demand React depth — not just "I can build a component" but "I can structure a dashboard, handle loading/error states systematically, and explain why I chose context over Redux for this feature."
- **Track B (Owned Assets):** Every starter kit, admin template, or SaaS product you build needs a React surface that is maintainable, performant, and AI-augmented where it adds value.
- **The Merge:** The React patterns you master for admin dashboards and product web apps become reusable IP — component libraries, form patterns, state management templates — that you can sell, reuse, or showcase.

---

## Part 2: Interview Landscape

### What Interviewers Are Actually Testing

When interviewers ask React questions, they are rarely testing syntax recall. They are testing:

1. **Can you reason about rendering?** Do you know when a component re-renders and why? Can you prevent unnecessary renders without cargo-culting `useMemo` everywhere?
2. **Can you manage state at the right level?** Do you understand when state belongs in a component, when it belongs in context, and when it belongs in a URL or a server cache?
3. **Can you handle async flows correctly?** Do you know what happens when a component unmounts during a fetch? Do you understand stale closures in effects?
4. **Can you structure a feature end-to-end?** Given a form with validation, loading states, error handling, and optimistic updates — can you build it and explain your decisions?
5. **Can you connect React to the rest of the stack?** How does your React code talk to a NestJS backend? How do you type API responses? How do you handle auth tokens?

### What A Weak Answer Sounds Like

> "I use useEffect to fetch data when the component mounts, and I put everything in Redux so any component can access it."

Why weak:
- No distinction between server state and client state
- useEffect for data fetching is a 2019 pattern; modern React uses React Query/SWR or server components
- "Put everything in Redux" signals cargo-cult state management without thinking about what actually needs to be global
- No mention of loading, error, or empty states

> "React re-renders when state changes."

Why weak:
- Technically true but shallow. Doesn't address: parent re-renders causing child re-renders, reference equality, memoization, context propagation, or the actual reconciliation process.

### What A Strong Answer Sounds Like

> "I think about React rendering in terms of the component tree. When state updates, React re-renders that component and recursively re-renders all its children — unless I've explicitly prevented it with React.memo or by lifting state to a place where it doesn't cause collateral re-renders. I use effects only for synchronization with external systems like network requests, browser APIs, or subscriptions. For server state — data that originates from the backend — I reach for React Query or SWR instead of managing fetch logic inside useEffect, because those libraries handle caching, deduplication, stale-while-revalidate, and optimistic mutations in a way that raw effects can't match. For shared client state like auth or UI preferences, I start with context. I only reach for Zustand or similar when the state update patterns would cause unacceptable re-render cascading through context."

Why strong:
- Shows understanding of the rendering model, not just the API
- Distinguishes between server state and client state
- Names specific tradeoffs (context vs external store)
- Mentions real libraries and why they exist
- Connects to actual product concerns (caching, deduplication, optimistic UI)

### How To Connect React To Shipped Work

Every React question is an opportunity to say: "In the admin dashboard for my plant-care app, I handled this by..."

Specific examples you should be ready to deploy:
- **Admin diagnosis history view:** Paginated table with filters, loading skeletons, empty states, error retry — all built with React Query and controlled components.
- **Auth-aware UI:** Admin vs operator vs member role checks that conditionally render navigation items, action buttons, and routes.
- **AI diagnosis result display:** Streaming or polling UI that shows a job progressing through queued → running → succeeded/failed states using a discriminated union.
- **Real-time tracking dashboard:** WebSocket-driven map with React rendering the moving markers efficiently using `React.memo` and stable references.

---

## Part 3: Core Concepts — Deep Technical Section

### 3.1 The React Rendering Model

**Mental Model:** React is not a template engine. It's a runtime that maintains a virtual representation of your UI (the Virtual DOM), diffs it against the previous version, and applies the minimal set of real DOM mutations.

**The Render Cycle (Simplified but Correct):**

```
Trigger (state change / parent re-render / context change)
        |
        v
React calls your component function
        |
        v
You return JSX (which is syntactic sugar for React.createElement)
        |
        v
React builds a new Virtual DOM tree
        |
        v
React diffs new tree against previous tree (reconciliation)
        |
        v
React applies only the changed nodes to the real DOM (commit phase)
        |
        v
Browser paints
        |
        v
Effects run (after paint)
```

**Critical Insight:** React re-renders a component when:
1. Its own state changes (via `useState` / `useReducer`)
2. Its parent re-renders (even if the child's props haven't changed — unless wrapped in `React.memo`)
3. A context value it consumes changes
4. A hook it uses triggers a re-render (e.g., `useSyncExternalStore`)

**The Parent-Child Cascade:** This is the single most important rendering concept for performance. If `Parent` calls `setState`, React re-renders `Parent` and ALL of its children recursively — unless you explicitly opt out.

```tsx
// Without memoization: every keystroke in SearchBar re-renders the entire UserList
function Dashboard() {
  const [search, setSearch] = useState("");
  return (
    <div>
      <SearchBar value={search} onChange={setSearch} />
      <UserList users={filteredUsers} /> {/* re-renders on every keystroke */}
    </div>
  );
}

// Better: lift state or use composition
function Dashboard() {
  return (
    <div>
      <SearchBarSection />  {/* owns its own state */}
      <UserListSection />   {/* doesn't re-render when SearchBarSection state changes */}
    </div>
  );
}
```

### 3.2 Components, Props, and State — The Right Mental Model

**Components are functions.** Props are arguments. State is memory that persists across function calls.

```tsx
// Think of it like this:
function UserCard(props: { name: string; role: string }) {
  // useState is like a closure variable that React manages for you
  const [expanded, setExpanded] = useState(false);
  
  // This function re-runs every time expanded changes OR parent re-renders
  return (
    <div onClick={() => setExpanded(!expanded)}>
      <h3>{props.name}</h3>
      {expanded && <p>Role: {props.role}</p>}
    </div>
  );
}
```

**Props are read-only.** If you try to mutate a prop, you're fighting React's data flow. Data flows down; events (callbacks) flow up.

**State should be minimal.** Derive everything you can. If `fullName` is always `${firstName} ${lastName}`, compute it during render — don't store it in state. Storing derived values in state creates synchronization bugs.

```tsx
// ❌ Wrong: storing derived data
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [fullName, setFullName] = useState(""); // derived — should not exist

// ✅ Right: derive during render
const fullName = `${firstName} ${lastName}`;
```

**Lifting state up:** When two siblings need to share state, move the state to their closest common ancestor. This is not a hack — it's the core React data flow pattern. But if you find yourself lifting state through 4+ levels, that's a signal to reach for context or composition.

### 3.3 Controlled vs Uncontrolled Components

This is a binary distinction that interviewers love because it reveals whether you actually understand React's relationship with the DOM.

**Controlled:** React state is the single source of truth. The DOM reflects React state, not the other way around.

```tsx
function ControlledInput() {
  const [value, setValue] = useState("");
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
```

**Uncontrolled:** The DOM holds the truth. React reads from it when needed via refs.

```tsx
function UncontrolledInput() {
  const ref = useRef<HTMLInputElement>(null);
  const handleSubmit = () => {
    console.log(ref.current?.value);
  };
  return <input ref={ref} />;
}
```

**When to use which:**
- **Controlled:** forms, validation, instant feedback, anything where React needs to know the value
- **Uncontrolled:** file inputs (browser security restriction), simple forms where you only need the value on submit, integrating with non-React DOM libraries

**Red flag answer:** "I always use controlled components." — This shows you don't understand the tradeoff. Uncontrolled inputs are simpler and faster for certain cases.

### 3.4 The Component Lifecycle (Hooks Era)

Stop thinking in class component lifecycles. Think in terms of:

| Concern | Hook | Mental Model |
|---|---|---|
| State that triggers re-renders | `useState`, `useReducer` | Memory across renders |
| Synchronization with external systems | `useEffect` | "After React paints, do this" |
| Values that persist without causing re-renders | `useRef` | A box you can write to without triggering repaints |
| Derived values (expensive computation) | `useMemo` | Cache the result until dependencies change |
| Stable function references | `useCallback` | Same function object across renders |
| Shared state without prop drilling | `useContext` | Subscribe to a value anywhere in the tree |

---

## Part 4: Hooks — Deep Dive

### 4.1 `useState`

**The basics everyone knows:**
```tsx
const [count, setCount] = useState(0);
```

**What most people get wrong:**
1. **State updates are batched in event handlers.** Multiple `setCount` calls in the same synchronous event handler are batched into one re-render (React 18+).
2. **The setter can take a function** for updates that depend on previous state:
   ```tsx
   setCount(prev => prev + 1); // safe
   setCount(count + 1);        // may use stale value
   ```
3. **Lazy initializers** for expensive initial state:
   ```tsx
   const [data, setData] = useState(() => parseLargeJson(rawString));
   // The function only runs once. Without the function, parseLargeJson runs on every render.
   ```

### 4.2 `useEffect` — The Most Misused Hook

**The mental model:** Effects are for **synchronization with external systems** — things outside React's render tree. The React docs call this "connecting to an external system."

**What counts as an external system:**
- Network requests (fetch, WebSocket)
- Browser APIs (localStorage, sessionStorage, geolocation, timers)
- Third-party DOM libraries (chart libraries, maps, non-React widgets)
- Subscriptions and event listeners

**What does NOT need useEffect:**
- Deriving data from props or state (compute it during render)
- Transforming data for display (do it during render)
- Resetting state when a prop changes (probably an anti-pattern — rethink your state design)
- Running logic "on mount" that isn't actually synchronizing with anything external

**The Dependency Array:**

```tsx
// ❌ No dependency array: runs after EVERY render
useEffect(() => {
  console.log('runs constantly');
});

// ✅ Empty array: runs once after mount
useEffect(() => {
  console.log('runs once');
}, []);

// ✅ With dependencies: runs when any dependency changes
useEffect(() => {
  console.log('runs when userId or filter changes');
}, [userId, filter]);
```

**The Infinite Loop Trap:**
```tsx
// ❌ Infinite loop: effect updates state → re-render → effect runs again
useEffect(() => {
  setCount(count + 1);
}, [count]);

// ❌ Object/array as dependency: new reference every render → infinite loop
useEffect(() => {
  fetchData({ userId, filter });
}, [{ userId, filter }]); // new object every render!
```

**Cleanup Functions:**

Every effect that creates a subscription, listener, or timer MUST return a cleanup function.

```tsx
useEffect(() => {
  const socket = new WebSocket("wss://tracking.example.com");
  socket.addEventListener("message", handleMessage);
  
  return () => {
    socket.removeEventListener("message", handleMessage);
    socket.close();
  };
}, []);
```

**Why cleanup matters:** Without cleanup, you get:
- Memory leaks (orphaned event listeners)
- Stale data updating unmounted components (React 18 strict mode double-fires effects to expose these bugs)
- Duplicate connections stacking up

**The Strict Mode Double-Fire:** In development, React 18 Strict Mode mounts → unmounts → mounts components. This means effects run, get cleaned up, and run again. If your effect breaks under this, your effect is buggy — fix the effect, don't disable Strict Mode.

### 4.3 Stale Closures — The Silent Killer

A stale closure happens when an effect or callback captures a variable value from a previous render and never sees updates.

```tsx
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      // ❌ Stale closure: count is always 0
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <div>{count}</div>; // stays at 1 forever
}

// ✅ Fix: use the functional updater
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1);
  }, 1000);
  return () => clearInterval(id);
}, []);
```

**Interview answer for stale closures:**
> "Stale closures happen when a function captures a variable from its render scope, but the variable value changes in subsequent renders while the function still references the old value. The fix depends on context: use functional state updaters, include the value in dependencies, use a ref for the latest value when you intentionally want to avoid re-running an effect, or restructure the code to eliminate the stale reference."

### 4.4 `useRef` — The Escape Hatch

A ref is a mutable box that persists across renders and does NOT trigger re-renders when mutated.

**Three legitimate use cases:**
1. **DOM access:** focusing inputs, measuring elements, integrating with non-React libraries
2. **Mutable values that don't affect rendering:** timer IDs, previous values, instance counters
3. **Stable references to callback functions:** storing the latest version of a callback without re-running effects

```tsx
// Pattern: latest value ref (avoids stale closures in callbacks)
function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value; // update synchronously during render
  return ref;
}

function ChatRoom({ onMessage }: { onMessage: (msg: string) => void }) {
  const onMessageRef = useLatest(onMessage);
  
  useEffect(() => {
    const socket = new WebSocket("wss://...");
    socket.onmessage = (event) => {
      onMessageRef.current(event.data); // always gets latest callback
    };
    return () => socket.close();
  }, []); // empty deps — intentional, we don't want to reconnect
}
```

### 4.5 `useReducer` — When `useState` Gets Complicated

Use `useReducer` when:
- State transitions follow a clear set of actions (like a state machine)
- The next state depends on the previous state in non-trivial ways
- Multiple related state values update together
- You want to test state logic in isolation from components

```tsx
type FormState = 
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; data: PlantDiagnosis }
  | { status: "error"; message: string };

type FormAction =
  | { type: "SUBMIT" }
  | { type: "SUCCESS"; data: PlantDiagnosis }
  | { type: "ERROR"; message: string }
  | { type: "RESET" };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SUBMIT":
      return { status: "submitting" };
    case "SUCCESS":
      return { status: "success", data: action.data };
    case "ERROR":
      return { status: "error", message: action.message };
    case "RESET":
      return { status: "idle" };
  }
}

// In component:
const [formState, dispatch] = useReducer(formReducer, { status: "idle" });
```

**Product Engineer angle:** `useReducer` paired with a discriminated union (TypeScript) gives you type-safe, impossible-state-free async handling. This is the pattern used in the plant-care diagnosis flow — queued → processing → complete → failed. No loose booleans. No impossible combos.

### 4.6 `useContext` — The Sharing Mechanism

Context lets a component read a value from anywhere in the tree without passing props through every intermediate component.

```tsx
const AuthContext = createContext<AuthUser | null>(null);

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  return (
    <AuthContext.Provider value={user}>
      <Dashboard />
    </AuthContext.Provider>
  );
}

function AdminPanel() {
  const user = useContext(AuthContext);
  if (!user || user.role !== "admin") return null;
  return <div>Admin controls</div>;
}
```

**Context's re-render behavior — must understand this:**
When the context value changes, EVERY component that calls `useContext(ThatContext)` re-renders — even if it only uses part of the value. This is why putting everything in one giant context is bad.

**Mitigation strategies:**
1. **Split contexts** by concern: `AuthContext`, `ThemeContext`, `FeatureFlagsContext` — not one `AppContext`
2. **Memoize the value** to prevent unnecessary context updates:
   ```tsx
   const value = useMemo(() => ({ user, permissions }), [user, permissions]);
   ```
3. **Use external stores (Zustand) when** the data changes frequently and you need granular subscriptions

---

## Part 5: State Management — The Decision Framework

### The Hierarchy Of State

```
1. Server State (data from your backend)
   → React Query / SWR / server components
   
2. URL State (route params, search params)
   → Next.js router / useSearchParams
   
3. Form State (ephemeral, local to a form)
   → useState / useReducer / React Hook Form
   
4. UI State (modals, toasts, sidebar open/close)
   → useState (local) or context (if deeply nested)
   
5. Global Client State (auth, theme, preferences)
   → Context (if stable) or Zustand (if frequently updated)
```

### When Context Is Enough

Context is enough when:
- The value changes infrequently (auth user, theme, locale)
- The consumer tree is relatively flat
- You don't need fine-grained subscriptions (e.g., subscribing to `user.name` without re-rendering on `user.preferences`)

### When To Reach For Zustand (Or Similar)

External state management helps when:
- State changes frequently and you need to avoid cascading re-renders
- You need to subscribe to individual fields, not the whole state object
- You want middleware (persistence, devtools, logging)
- The state is used across many unrelated parts of the tree

```tsx
// Zustand: granular subscriptions, no provider wrapper needed
import { create } from "zustand";

interface DiagnosisStore {
  jobs: Map<string, DiagnosisJobState>;
  updateJob: (id: string, state: DiagnosisJobState) => void;
}

const useDiagnosisStore = create<DiagnosisStore>((set) => ({
  jobs: new Map(),
  updateJob: (id, state) =>
    set((prev) => {
      const next = new Map(prev.jobs);
      next.set(id, state);
      return { jobs: next };
    }),
}));

// Component only re-renders when THIS specific job changes
function JobStatus({ jobId }: { jobId: string }) {
  const status = useDiagnosisStore((s) => s.jobs.get(jobId)?.status);
  return <span>{status}</span>;
}
```

### Redux? 

For most product engineering work in 2025-2026, Redux is overkill. Zustand or React Query handle 95% of cases with less boilerplate. If an interviewer asks "Redux or Context?", your answer should demonstrate judgment, not dogma:

> "For server state, I use React Query or SWR. For client state that's shared across the app, I start with context. If I hit re-render performance issues or need fine-grained subscriptions, I reach for Zustand. I'd use Redux Toolkit only if the team already uses it and there's existing infrastructure built around it — not because I think it's the best default for new projects."

### Prop Drilling — When It's Actually A Problem

Prop drilling (passing props through intermediate components that don't use them) is not inherently evil. It becomes a problem when:
1. You're passing through 3+ levels of components that don't care about the data
2. The intermediate components have to know about props they don't use (coupling)
3. Refactoring the data shape requires changing 10 files

**Before jumping to context, consider composition:**
```tsx
// Instead of prop drilling:
<Page user={user}>
  <Header user={user}>
    <UserMenu user={user} />  {/* 3 levels of drilling */}
  </Header>
</Page>

// Use composition (children-as-props):
<Page>
  <Header>
    <UserMenu user={user} />  {/* passed directly */}
  </Header>
</Page>
```

---

## Part 6: Performance — What Actually Matters

### The Render Behavior You Must Understand

React's default behavior: when a component re-renders, all its descendants re-render. This is by design. The reconciliation process is fast enough that memoization should be the exception, not the rule.

**The optimization decision tree:**
```
Is there a measurable performance problem?
  │
  ├─ No → Don't optimize. Move on.
  │
  └─ Yes → Profile with React DevTools Profiler.
           │
           ├─ Is a parent re-rendering unnecessarily?
           │    └─ Lift state down / use composition / React.memo
           │
           ├─ Is an expensive computation re-running on every render?
           │    └─ useMemo
           │
           └─ Is a stable prop reference changing every render 
                causing React.memo to fail?
                └─ useCallback / useMemo for object/array values
```

### `React.memo` — When It Helps

`React.memo` does a shallow comparison of props and skips re-rendering if nothing changed.

```tsx
const UserRow = React.memo(function UserRow({ user }: { user: User }) {
  return <tr><td>{user.name}</td><td>{user.email}</td></tr>;
});

// This re-renders ONLY when user prop changes reference
// Useful in lists where parent re-renders frequently but data is stable
```

**When `React.memo` fails silently:**
```tsx
// ❌ Inline object/array props create new references every render
<UserRow user={user} style={{ color: "red" }} />  // style is always new
<UserRow user={user} onDelete={() => handleDelete(user.id)} /> // function always new

// ✅ Fix: memoize the props
const style = useMemo(() => ({ color: "red" }), []);
const handleDelete = useCallback(() => handleDelete(user.id), [user.id]);
```

### `useMemo` and `useCallback` — Use Sparingly

These are not free. They consume memory and add comparison overhead. Apply them only when:
1. The computation is actually expensive (sorting 1000+ items, not concatenating two strings)
2. A stable reference is needed to prevent breaking `React.memo` on children
3. The value is a dependency of an effect and you want to control when the effect re-runs

**Cargo-cult pattern to avoid:**
```tsx
// ❌ Premature optimization — these are cheap operations
const fullName = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName]);
const handleClick = useCallback(() => alert("hi"), []);
```

### List Keys — More Than Just A Warning Silencer

Keys tell React which items changed, were added, or were removed. Without stable keys, React may re-render more items than necessary or lose component state.

**Rules:**
1. Use a stable, unique ID — not array index (unless the list is static and never reordered)
2. The key must be unique among siblings
3. Keys scoped to the immediate children, not globally

```tsx
// ❌ Index as key: breaks on reorder, filter, add/remove
{users.map((user, i) => <UserRow key={i} user={user} />)}

// ✅ Stable ID
{users.map(user => <UserRow key={user.id} user={user} />)}
```

### Lazy Loading — `React.lazy` and `Suspense`

Split your bundle at route boundaries or large feature boundaries.

```tsx
const AdminDashboard = React.lazy(() => import("./AdminDashboard"));
const DiagnosisHistory = React.lazy(() => import("./DiagnosisHistory"));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/diagnoses" element={<DiagnosisHistory />} />
      </Routes>
    </Suspense>
  );
}
```

**Product Engineer note:** In Next.js, you get this mostly for free through file-based routing and `next/dynamic`. But understanding the underlying React primitive matters for interview explanations.

---

## Part 7: Forms And Data — The Product Engineer's Bread And Butter

### Controlled Forms Done Right

A form has states beyond just the input values. Treat them explicitly:

```tsx
type PlantDiagnosisFormState =
  | { phase: "idle" }
  | { phase: "submitting" }
  | { phase: "success"; result: DiagnosisResult }
  | { phase: "error"; message: string };

function DiagnosisForm() {
  const [image, setImage] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [state, setState] = useState<PlantDiagnosisFormState>({ phase: "idle" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;
    
    setState({ phase: "submitting" });
    
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("notes", notes);
      
      const result = await api.submitDiagnosis(formData);
      setState({ phase: "success", result });
    } catch (err) {
      setState({ phase: "error", message: err instanceof Error ? err.message : "Unknown error" });
    }
  };

  // Render based on phase
  if (state.phase === "success") {
    return <DiagnosisResult result={state.result} onReset={() => setState({ phase: "idle" })} />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <ImageUpload value={image} onChange={setImage} />
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      
      {state.phase === "error" && <ErrorMessage message={state.message} />}
      
      <button type="submit" disabled={state.phase === "submitting" || !image}>
        {state.phase === "submitting" ? "Analyzing..." : "Submit"}
      </button>
    </form>
  );
}
```

**This pattern demonstrates:**
- Controlled inputs
- Discriminated union for async state (strong TypeScript)
- Loading state as a button disabled state (better UX than spinners for small forms)
- Error state with retry path
- Success state that replaces the form (not overlays it)

### Validation Strategy

**Client-side validation:** Instant feedback. Use HTML5 validation attributes for simple cases, custom logic for complex rules.

```tsx
function validateEmail(email: string): string | null {
  if (!email) return "Email is required";
  if (!email.includes("@")) return "Invalid email format";
  return null;
}

function EmailField() {
  const [email, setEmail] = useState("");
  const error = validateEmail(email); // compute during render, not in state
  
  return (
    <div>
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={!!error}
      />
      {error && <span role="alert">{error}</span>}
    </div>
  );
}
```

**Server-side validation:** Always validate on the backend too (NestJS with class-validator or zod). Client validation is UX, not security.

### Optimistic UI — The Pro Move

Optimistic UI means updating the UI before the server confirms the change. If the server rejects, roll back.

```tsx
function ToggleDiagnosisPublic({ diagnosisId, initialPublic }: { diagnosisId: string; initialPublic: boolean }) {
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [previousValue, setPreviousValue] = useState(initialPublic);

  const toggle = async () => {
    const newValue = !isPublic;
    setPreviousValue(isPublic);
    setIsPublic(newValue); // optimistic update
    
    try {
      await api.updateDiagnosis(diagnosisId, { public: newValue });
    } catch {
      setIsPublic(previousValue); // rollback
      toast.error("Failed to update. Try again.");
    }
  };

  return <Switch checked={isPublic} onChange={toggle} />;
}
```

**When to use optimistic UI:**
- High-confidence operations (toggles, likes, status changes)
- Where instant feedback significantly improves UX
- NOT for: payments, destructive actions, multi-step workflows where rollback is complex

**Interview answer:**
> "Optimistic UI improves perceived performance by updating the interface before the server confirms. I use it for high-confidence mutations like toggles and status changes. The key is always having a rollback path and handling the error state gracefully. For the plant diagnosis admin, I use this pattern when operators toggle a diagnosis between public and private — the toggle is instant, but the server call happens in the background with rollback on failure."

---

## Part 8: AI Integration — Practical React Patterns

### Where AI Touches React In Real Products

React does not run AI models. React renders the UI around AI interactions. But how you structure that UI determines whether the AI feature feels magical or broken.

**Pattern 1: AI-Powered Search (pgvector + React)**

The user types a search query. Your backend runs semantic search via pgvector. React manages the input state, the results state, and the loading/empty/error states.

```tsx
function PlantSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlantResult[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setStatus("idle");
      return;
    }

    let cancelled = false;
    
    async function search() {
      setStatus("loading");
      try {
        const data = await api.semanticSearchPlants(debouncedQuery);
        if (!cancelled) {
          setResults(data);
          setStatus("idle");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    search();
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search plants by description..."
      />
      {status === "loading" && <Skeleton results={3} />}
      {status === "error" && <ErrorRetry onRetry={() => search()} />}
      {status === "idle" && results.length === 0 && query && <EmptyState query={query} />}
      {status === "idle" && <ResultList results={results} />}
    </div>
  );
}
```

**Why this matters:** Semantic search (pgvector) means the user types "yellow leaves drooping" and finds matching diagnoses — not just exact text matches. The React layer handles debouncing, cancellation of stale requests, and proper loading/empty/error states.

**Pattern 2: AI Diagnosis Streaming (OpenAI SDK + Polling UI)**

When a plant diagnosis job runs, it goes through stages: queued → processing → complete. The React UI needs to reflect this progression without blocking.

```tsx
type JobState =
  | { status: "queued"; jobId: string }
  | { status: "processing"; jobId: string; progress: number }
  | { status: "complete"; result: DiagnosisResult }
  | { status: "failed"; error: string };

function DiagnosisJobTracker({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<JobState>({ status: "queued", jobId });

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const state = await api.getDiagnosisJobStatus(jobId);
        setJob(state);
        if (state.status === "complete" || state.status === "failed") {
          clearInterval(interval);
        }
      } catch {
        // handle polling failure — don't stop polling on transient errors
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  switch (job.status) {
    case "queued":
      return <div>Waiting in queue...</div>;
    case "processing":
      return <div><ProgressBar value={job.progress} /> Analyzing image...</div>;
    case "complete":
      return <DiagnosisResultCard result={job.result} />;
    case "failed":
      return <ErrorBanner message={job.error} onRetry={() => retryDiagnosis(jobId)} />;
  }
}
```

**When AI does NOT help in React:**
- Don't add an AI chatbot to your admin dashboard just because you can. If the admin needs to look up diagnosis history, a well-designed filterable table beats a chatbot 10 times out of 10.
- Don't use AI for form validation. Deterministic rules are faster, more predictable, and don't cost API credits.
- Don't replace predictable UI interactions (sort, filter, paginate) with "AI-powered" alternatives that are slower and less reliable.

---

## Part 9: Product-Thinking Interpretation

### What A Product Engineer Thinks About That A Pure Developer Misses

| Pure Developer Focus | Product Engineer Focus |
|---|---|
| "What hook should I use?" | "What states does this feature have and how do I handle all of them?" |
| "I'll add a loading spinner." | "This loads in 200ms. A spinner that flashes for 200ms is worse UX than showing nothing." |
| "The form submits and shows an error if it fails." | "If the user's connection drops mid-submit, do they lose their data? How do they recover?" |
| "I used Redux for state management." | "What type of state is this? Server state doesn't belong in Redux." |
| "I wrapped everything in React.memo." | "Profile first. Memoize only the components that actually show up as slow in the profiler." |

### How To Explain React Decisions To A Non-Technical Stakeholder

Instead of: "I used React Query with stale-while-revalidate caching."

Say: "When a user opens the diagnosis history page, they see the data they saw last time instantly — even before the server responds. Then the page updates silently when new data arrives. This means no loading spinners for repeat visits."

Instead of: "I implemented optimistic UI for the toggle."

Say: "When an operator marks a diagnosis as public, the toggle flips instantly. They don't wait for a server response. If something goes wrong, it flips back and shows a notification. This makes the admin panel feel fast and responsive."

---

## Part 10: Interview Questions & Strong Model Answers

### 1. "Explain how React decides to re-render a component."

**Strong answer:**
> "React re-renders a component when its own state changes, when its parent re-renders, or when a context value it subscribes to changes. When any of those triggers fire, React calls the component function again, builds a new Virtual DOM tree, diffs it against the previous tree, and commits only the changed nodes to the real DOM. The critical insight is that by default, a parent re-render causes all descendants to re-render — even if their props haven't changed. You opt out with React.memo, or better, you structure your component tree so that state changes don't cascade through unrelated branches."

### 2. "When do you use useEffect, and when is it the wrong tool?"

**Strong answer:**
> "useEffect is for synchronizing React with external systems — network requests, browser APIs, third-party libraries, subscriptions. It's the wrong tool when the logic can be derived during render. For example, filtering a list based on a search query should happen during render, not inside an effect that sets derived state. That pattern creates double-rendering and synchronization bugs. I also don't use useEffect for server state fetching in new projects — React Query or SWR handle caching, deduplication, and background refetching more reliably than hand-rolled effects."

### 3. "What causes infinite loops in useEffect, and how do you fix them?"

**Strong answer:**
> "Infinite loops happen when an effect updates state that's listed in its dependency array, creating a cycle: effect runs → state updates → re-render → effect runs again. The most common cause is object or array dependencies that create new references every render. The fix depends on the root cause: useMemo to stabilize object references, use the functional updater form of setState if the update doesn't need the current value in the dependency array, or reconsider whether the state needs to exist at all versus being derived during render."

### 4. "Context vs Redux vs Zustand — how do you decide?"

**Strong answer:**
> "I categorize state first. Server state goes to React Query. Client state that's stable and relatively flat — like auth user or theme — stays in context. If client state updates frequently and I need granular subscriptions to avoid re-rendering large parts of the tree, I reach for Zustand. I'd use Redux Toolkit only if the team already has Redux infrastructure and it would cost more to migrate than to continue. For a new project I'm starting from scratch, Zustand plus React Query covers nearly everything with less ceremony."

### 5. "How do you structure forms in a real production app?"

**Strong answer:**
> "A form in production has more states than people think. There's the initial idle state, the active editing state, a validation state per field, a submitting state, a success state, and an error state — and the error state needs a recovery path. I model this with a discriminated union or a state machine, not loose booleans. Each input is controlled, with validation errors computed during render. The submit handler manages the async flow: set submitting, make the request, handle success or error, and provide a way to retry on failure. If the form is long, I persist partial state to sessionStorage so the user doesn't lose work on accidental navigation."

### 6. "When would you NOT use React?"

**Strong answer:**
> "React is a strong choice for interactive web applications with complex state — dashboards, admin panels, SaaS products. But if the page is mostly static content with minimal interactivity, React adds bundle size and complexity without enough benefit. A marketing landing page that's primarily text and images might be better as static HTML or a statically generated Next.js page where React only hydrates the interactive parts. I also wouldn't use React for a backend API or a CLI tool — use the right tool for the job."

---

## Part 11: Practical Exercises

### Exercise 1: Build A Filterable Diagnosis Table

**Context:** Your plant-care admin dashboard needs a table showing all diagnoses with filters by status, date range, and plant type.

**What to implement:**
- Controlled filter inputs (dropdown for status, date picker for range, text input for plant name)
- Paginated table with React Query (or mocked fetch)
- Loading skeleton, empty state ("No diagnoses match your filters"), error with retry
- Debounced text search
- URL search params that sync with filters (so filters survive page refresh)

**Product Engineer focus:** This is not a toy. This is the actual admin view for PlantUSA. Ship it so that when you walk into an interview, you can show them the real code.

### Exercise 2: Build A Multi-Step Diagnosis Submission Form

**Context:** A user submits a plant photo for AI diagnosis. The flow: upload image → add notes → confirm submission → see result.

**What to implement:**
- Multi-step form with "Back" and "Next" navigation
- Each step validates before allowing progression
- Image preview in step 1
- Notes (optional) in step 2
- Confirmation summary in step 3
- Async submission with loading indicator and error handling
- Success state that transitions to the diagnosis result view

**Product Engineer focus:** Multi-step forms expose weak state management. If you can't rebuild step 1's state when the user clicks "Back" from step 3, your state architecture is wrong.

### Exercise 3: Implement A Real-Time Job Status Tracker

**Context:** AI diagnosis jobs run asynchronously. The UI needs to poll for updates and reflect queued → processing → complete states.

**What to implement:**
- Polling effect with cleanup on unmount
- Discriminated union state: queued, processing (with progress %), complete, failed
- Visual progress indicator
- Automatic stop-polling on terminal states
- Retry button on failure

**Product Engineer focus:** This is the exact pattern used in PlantUSA for AI diagnosis jobs. Master this and you can explain real-time async UI patterns under interview pressure.

### Exercise 4: Optimize A Slow Dashboard

**Context:** Take a dashboard that re-renders entirely on any interaction (search, filter, sort) and optimize it.

**What to implement:**
- Profile with React DevTools to identify the bottleneck
- Lift state down so filter changes don't re-render the chart section
- Apply React.memo to expensive list items
- Stabilize callback and object prop references
- Measure before and after render counts

**Product Engineer focus:** This is what separates "I know React" from "I ship performant React apps." Interviewers who've worked on real products will ask about optimization — not to hear you list hook names, but to see if you understand the render model deeply enough to fix actual performance problems.

---

## Part 12: Self-Test Questions

If you cannot answer these without notes, your React knowledge is still shallow.

1. What causes a React component to re-render? List all triggers.
2. Why does React.memo sometimes fail to prevent re-renders?
3. When is useEffect the wrong tool — and what should you use instead?
4. What's a stale closure? Give a concrete example and two different fixes.
5. When does context cause unnecessary re-renders, and how do you mitigate it?
6. Why is index as a key problematic? When is it actually fine?
7. What's the difference between controlled and uncontrolled inputs? When would you use each?
8. How do you handle async request cancellation in effects?
9. Explain optimistic UI: when to use it, when not to, and how to handle rollback.
10. How would you explain React's rendering model to a junior developer?

**"Explain it to a junior developer" prompt:**

> "React keeps a lightweight copy of what the page should look like in memory. When something changes — like a user typing or data arriving from the server — React creates a new version of that copy, compares it to the old one, figures out the smallest set of changes needed, and updates only those parts of the real page. This is faster than rebuilding the entire page from scratch every time. The key thing to remember is that when a parent component updates, all its children re-render too by default. So we try to keep state as close to where it's used as possible."

---

## Part 13: Red Flags Interviewers Watch For

These are the signals that tell an interviewer you've read tutorials but haven't shipped real products:

1. **Overusing useEffect** — When every component has 3+ effects, you're likely syncing state that could be derived during render or using effects for logic that belongs in event handlers.

2. **Poor state boundaries** — State that lives too high (causing re-render cascades) or too low (causing prop drilling that breaks composition).

3. **No handling of loading/error/empty states** — Every async operation has at least three states. If your answer only covers the success path, you're not thinking like a product engineer.

4. **Not understanding controlled components** — If you can't explain why `<input value={val} />` without an `onChange` is a problem, you don't understand the controlled/uncontrolled boundary.

5. **Cargo-cult memoization** — Wrapping everything in `useMemo` and `useCallback` without measuring performance first. This signals you don't understand the cost of memoization or when it's actually needed.

6. **Fetching inside useEffect without cleanup** — If your effect sets state after an async call and doesn't handle the case where the component unmounts before the response arrives, you're shipping memory leaks.

7. **No distinction between server state and client state** — Putting API response data in Redux or context when React Query exists. This signals you haven't kept up with the ecosystem.

---

## Part 14: Connection Map

### How React Connects To Other Topics

| Previous Topic | How React Builds On It |
|---|---|
| **JavaScript (2-js)** | React is JavaScript. Closures, event loops, promises, async/await — all directly relevant to hooks, effects, and async flows. |
| **TypeScript (3-ts)** | Typed props, discriminated unions for async state, generic components. React without TypeScript is a weaker position in 2025+ interviews. |

| This Topic Prepares You For | Why |
|---|---|
| **Next.js (5-nextjs)** | Next.js is React plus routing, server components, and build tooling. You cannot understand Next.js deeply without understanding React fundamentals first. |
| **NestJS (6-nestjs)** | The backend you build with NestJS serves APIs that your React frontend consumes. Understanding both ends of the fetch call makes you a product engineer, not a frontend specialist. |
| **Practical AI (9-practical-ai)** | AI features render in React. Semantic search results, diagnosis job status, AI-generated content previews — all need React UI patterns covered here. |
| **System Design (13-system-design-prompts)** | When you design a full system, the React frontend is one component in the architecture diagram. You need to explain how it connects to the API gateway, auth system, and caching layer. |

### Recommended Study Order

1. JavaScript fundamentals (closures, async, promises)
2. TypeScript core types, unions, generics
3. **React (this guide)** — component model, hooks, state management, forms
4. Next.js — builds directly on React with routing, SSR, and server components
5. NestJS — the backend that serves the APIs your React app consumes
6. PostgreSQL/Supabase — the data layer
7. Practical AI — AI features rendered in React, served by NestJS, stored in PostgreSQL

---

## Part 15: Real Project Implementation Rules

When writing React in a real product (not a tutorial), follow these rules:

1. **State belongs as close to usage as possible.**
2. **Derive values during render.** Don't store computed values in state.
3. **Every async operation handles loading, success, error, and empty.**
4. **Effects synchronize with external systems — nothing more.**
5. **Type your props, state, and API responses.** No `any` in production React.
6. **Profile before optimizing.** Don't `useMemo` without a measured reason.
7. **Split components by responsibility, not by line count.** A 200-line component that does one clear thing is better than five 40-line components with tangled responsibilities.
8. **Forms get discriminated unions for async state.** Loose booleans create impossible states.
9. **Server state uses React Query or SWR.** Client state starts in `useState`. Shared client state starts in context. Frequent-update shared state goes to Zustand.
10. **Clean up every subscription, listener, and timer.** If there's no cleanup function, ask yourself why.

---

## Final Standard

You are ready for React interview questions when you can do four things:

1. **Explain the rendering model** clearly — what triggers re-renders, how reconciliation works, and how to prevent unnecessary work.
2. **Structure a complete feature** end-to-end — from controlled form inputs through async submission, loading states, error handling, and success display.
3. **Make deliberate state management decisions** — distinguishing server state from client state, knowing when context is enough and when external stores justify their cost.
4. **Connect React to the rest of the stack** — typed API calls to a NestJS backend, auth token handling, AI feature UI patterns, and explaining how the frontend fits into the full product architecture.

That is the bar. Not memorizing hook signatures. Not reciting React version history. Building and explaining real product UI — that's what separates a Product Engineer from a frontend developer.