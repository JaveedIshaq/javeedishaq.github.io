# Next.js Study Guide

## Purpose

This guide is for mastering Next.js at the level required for:

1. Product Engineer interviews where Next.js is the web delivery surface
2. building real admin dashboards, landing pages, product web apps, and SEO-facing surfaces that complement Flutter mobile apps
3. explaining Next.js decisions in terms of product architecture, not just framework trivia

Next.js is your default web layer. It serves as the rendering engine for admin panels, product dashboards, marketing pages, and any web surface your Flutter mobile app needs a companion for. Interviewers will test whether you understand the server/client boundary, data fetching strategies, and how to ship complete product workflows — not just whether you can recite the App Router docs.

---

## Part 1: Topic Positioning

### What Next.js Is (One Clear Sentence)

Next.js is a React framework that adds server-side rendering, file-based routing, API route handlers, and build optimizations — turning React from a client-only library into a full-stack web delivery platform.

### Where It Sits In The Product Engineer Stack

```
Flutter (mobile)          Next.js/React (web, admin, landing)
        \                        /
         Node.js/NestJS (backend — custom APIs, business logic)
                  |
         PostgreSQL/Supabase (data, auth, storage)
                  |
         OpenAI SDK + pgvector (AI layer)
```

Next.js occupies the "web surface" role. Your NestJS backend handles custom business logic, queued jobs, and AI orchestration. Next.js renders the admin dashboards that display that data, the landing pages that sell the product, and the product web app that mirrors what Flutter does on mobile.

### Why Next.js Matters For Your Career Path

- **Product Engineer positioning:** You ship complete products end to end. Next.js is the web half of that equation.
- **Admin dashboards:** Every SaaS product, every client project, every starter kit needs an admin. Next.js is your default admin renderer.
- **Landing pages and SEO:** Flutter can't do SEO. Next.js can. Landing pages, marketing sites, documentation — Next.js owns this surface.
- **Interview credibility:** Modern product-engineer roles cluster around TypeScript, Next.js, PostgreSQL, and AI integration. You need Next.js fluency to sit at that table.

### What This Guide Assumes You Already Know

- React fundamentals (components, props, state, hooks, rendering flow) — covered in `learnings/4-react-study-guide.md`
- TypeScript — covered in `learnings/3-typescript-study-guide.md`
- Basic Node.js and API concepts — covered in `learnings/2-javascript-study-guide.md`

---

## Part 2: Interview Landscape

### What Interviewers Are Actually Testing

When a Product Engineer interviewer asks Next.js questions, they are testing:

1. **Server/client boundary judgment.** Do you know what runs on the server, what runs on the browser, and why that distinction matters for bundle size, SEO, and data freshness?
2. **Data fetching strategy.** Can you decide when to fetch server-side, when to use client-side SWR/React Query, and when to revalidate?
3. **Full-stack thinking.** Do you understand how Next.js connects to a separate backend (NestJS) via API calls, or are you stuck in the "Next.js is the whole backend" mental model?
4. **Product delivery instincts.** Can you build a complete admin workflow — list view, detail view, form with validation, protected routes, loading/error states — and explain the decisions?
5. **Auth awareness.** Do you understand session management, middleware protection, and role-based rendering at the Next.js level?

### What A Weak Answer Sounds Like

> "I use Next.js for server-side rendering. It makes my React app faster because it renders on the server. I use 'use client' on all my components because I need interactivity."

**Why this is weak:**
- Vague — "makes it faster" without explaining why (TTFB, FCP, SEO, bundle reduction)
- Overuses client components — signals you don't understand the server/client boundary
- No mention of data fetching strategy, caching, or revalidation
- No connection to backend architecture — treats Next.js as the entire stack

### What A Strong Answer Sounds Like

> "I default to server components for data-heavy views — admin tables, dashboards, detail pages. The server fetches from our NestJS backend, renders the HTML, and ships zero JavaScript for those sections. I opt into client components only where interactivity, browser APIs, or client-side state are necessary — forms, modals, search inputs. For data that changes frequently, I use React Query on the client with stale-while-revalidate. For mutations, I use server actions or route handlers depending on whether the mutation needs immediate optimistic UI or can tolerate a full page revalidation. Auth is handled via Supabase sessions — middleware protects route segments, and server components receive the session for role-aware rendering before any HTML reaches the client."

**Why this is strong:**
- Clear server/client boundary with decision criteria
- Specific data fetching strategies named (React Query, SWR, server actions, route handlers)
- External backend acknowledged (NestJS) — full-stack thinking
- Auth strategy articulated at the framework level (middleware + server components + Supabase)
- Specific product context (admin tables, dashboards, forms)

### How To Connect This Topic To Shipped Work

Every Next.js answer should reference a real product context. Examples from your world:

- "In my plant-care app's admin dashboard, server components fetch diagnosis history from NestJS. The data table is a server component. The filter bar is a client component. The detail view for a single diagnosis is a server component that receives the ID from the route params."
- "For the landing page, everything is a server component except the waitlist form — that uses 'use client' with optimistic UI via server actions."
- "Admin routes are protected by middleware that checks the Supabase session. Server components receive the session and render role-aware UI — admins see the full dashboard, support staff see a restricted view."

---

## Part 3: Core Concepts — The App Router Mental Model

### The shift from Pages Router to App Router

The App Router (introduced in Next.js 13, stable in 14) fundamentally changed how Next.js applications are structured. If an interviewer asks about Next.js, they are asking about the App Router — not the Pages Router.

**Key differences:**
| Concept | Pages Router (`/pages`) | App Router (`/app`) |
|---|---|---|
| Routing | File name = route | Folder + `page.tsx` = route |
| Layouts | `_app.tsx` / `_document.tsx` | Nested `layout.tsx` files |
| Data fetching | `getServerSideProps`, `getStaticProps` | Async server components, `fetch` with caching |
| Server/Client boundary | Everything was client by default | Server components by default |
| Loading states | Manual `useState` + `isLoading` | `loading.tsx` file — automatic Suspense boundary |
| Error handling | Error boundaries in `_app.tsx` | `error.tsx` file — automatic error boundary |

**What this means for your stack:** You are building admin dashboards, not blogs. The App Router's server-component-first model is perfect for admin UIs where most pages are data-heavy and interactive only in specific places (filters, search, modals, forms).

### Server Components vs Client Components

This is the most important concept in modern Next.js. Get this wrong in an interview and you lose credibility immediately.

**Server Components (default — no directive needed):**
- Run on the server at request time (or build time for static pages)
- Can be async — fetch data directly inside the component
- Cannot use hooks (`useState`, `useEffect`, etc.)
- Cannot use browser APIs (`window`, `document`, `localStorage`)
- Cannot attach event handlers (`onClick`, `onChange`)
- Ship zero JavaScript to the client
- Can import client components

**Client Components (`"use client"` directive at top):**
- Run on the server for initial HTML, then hydrate on the client
- Can use hooks, browser APIs, event handlers
- Ship JavaScript to the client
- Cannot import server components directly (but can receive them as children via props)

**Decision framework — when to use which:**

```
Is this component interactive?
├── No → Server Component
│   ├── Data table displaying rows from API
│   ├── Detail view showing a single record
│   ├── Navigation sidebar (can be server if no client state)
│   ├── Footer, header (static content)
│   └── Landing page hero, features section
│
├── Yes → Client Component
│   ├── Search input with debounce
│   ├── Form with validation
│   ├── Modal / dialog
│   ├── Toggle, dropdown, date picker
│   ├── Real-time data with WebSocket/Supabase subscription
│   └── Filter bar with URL search params sync
│
└── Hybrid → Server component wrapping client children
    └── Dashboard shell (server) containing interactive widgets (client)
```

**The key insight interviewers want:** "I push the client boundary as deep into the component tree as possible. The outer layout is server-rendered. Only the leaf nodes that need interactivity become client components."

### File-Based Routing

```
app/
├── layout.tsx          ← Root layout (wraps every page)
├── page.tsx            ← Home page (/)
├── loading.tsx         ← Root loading state
├── error.tsx           ← Root error boundary
├── not-found.tsx       ← 404 page
├── dashboard/
│   ├── layout.tsx      ← Dashboard layout (wraps all dashboard pages)
│   ├── page.tsx        ← /dashboard
│   ├── loading.tsx     ← Dashboard loading state
│   ├── error.tsx       ← Dashboard error boundary
│   ├── diagnoses/
│   │   ├── page.tsx    ← /dashboard/diagnoses (list view)
│   │   └── [id]/
│   │       └── page.tsx ← /dashboard/diagnoses/abc123 (detail view)
│   └── settings/
│       └── page.tsx    ← /dashboard/settings
├── api/
│   └── diagnoses/
│       └── route.ts    ← /api/diagnoses (route handler)
└── auth/
    ├── login/
    │   └── page.tsx    ← /auth/login
    └── callback/
        └── route.ts    ← /auth/callback (OAuth callback handler)
```

**Key routing rules:**
- `page.tsx` makes a route publicly accessible
- `layout.tsx` wraps child pages and persists across navigation (doesn't re-render)
- `loading.tsx` is a Suspense boundary — shown while the page server component awaits data
- `error.tsx` catches errors in child components (must be a client component)
- `route.ts` creates API endpoints (cannot coexist with `page.tsx` in the same folder)

### Layout Nesting

Layouts are one of the most powerful App Router features for product UIs.

```typescript
// app/dashboard/layout.tsx
// This layout persists when navigating between /dashboard/diagnoses and /dashboard/settings
// The sidebar doesn't re-render — only the {children} slot updates

import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "./sidebar";
import { DashboardHeader } from "./header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, display_name")
    .eq("id", session.user.id)
    .single();

  return (
    <div className="flex h-screen">
      <DashboardSidebar role={profile?.role} />
      <main className="flex-1 overflow-auto">
        <DashboardHeader displayName={profile?.display_name} />
        {children}
      </main>
    </div>
  );
}
```

**What this demonstrates:**
- Auth protection at the layout level — all child routes are automatically protected
- Server component fetching session and profile data before render
- Role-aware rendering (sidebar can show/hide items based on role)
- Layout persistence — navigating between dashboard pages only re-renders `{children}`

### Route Handlers

Route handlers (`route.ts`) are your API endpoints inside Next.js. For a Product Engineer, these are useful for webhook receivers, auth callbacks, and simple proxy APIs — but **not** for your main business logic.

**When to use route handlers:**
- Auth callbacks (Supabase, OAuth)
- Webhook receivers (Stripe, Lemon Squeezy)
- File upload endpoints
- Simple proxy routes that forward to NestJS

**When NOT to use route handlers:**
- Complex business logic → NestJS
- AI diagnosis pipelines → NestJS + queued jobs
- Database-heavy operations → NestJS with proper service layer
- Anything that needs background processing → NestJS

```typescript
// app/api/diagnoses/route.ts
// Example: Simple proxy that forwards to NestJS
// Use this pattern when you need Next.js middleware auth before hitting NestJS

import { createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const response = await fetch(`${process.env.NESTJS_API_URL}/diagnoses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
```

### Loading and Error Boundaries

These are built into the App Router as file conventions. You should know them cold.

**`loading.tsx`:** Shown automatically while the page or layout's async work completes. Wrapped in a Suspense boundary by Next.js.

```typescript
// app/dashboard/diagnoses/loading.tsx
export default function DiagnosesLoading() {
  return (
    <div className="space-y-4">
      {/* Skeleton rows for a table */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
      ))}
    </div>
  );
}
```

**`error.tsx`:** Catches errors in child components. Must be a client component.

```typescript
// app/dashboard/diagnoses/error.tsx
"use client";

export default function DiagnosesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="text-xl font-semibold text-red-700">
        Failed to load diagnoses
      </h2>
      <p className="text-gray-500 mt-2">
        {error.message || "An unexpected error occurred"}
      </p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}
```

---

## Part 4: Data Fetching — The Strategy Layer

### The Mental Model

Data fetching in Next.js is not about which function to call. It's about **where the data lives, how fresh it needs to be, and who needs to see it.**

```
Data lives in:
├── PostgreSQL/Supabase (via NestJS API)
│   Strategy: Server component fetches at request time
│
├── Third-party API (OpenAI, Stripe, etc.)
│   Strategy: Server component or route handler proxies
│
└── Client-side state (form inputs, UI toggles, filter selections)
    Strategy: useState, useReducer, or URL search params
```

### Server-Side Fetching (Default Strategy)

Server components can be async. This is the single biggest productivity win in Next.js — no `useEffect` + `useState` dance for initial data.

```typescript
// app/dashboard/diagnoses/page.tsx
// Server component — fetches data before render, ships HTML with data already in it

import { DiagnosesTable } from "./diagnoses-table";
import { DiagnosesFilters } from "./diagnoses-filters";
import type { Diagnosis } from "@/types/diagnosis";

async function getDiagnoses(page: number, status?: string): Promise<{
  data: Diagnosis[];
  total: number;
}> {
  const url = new URL(`${process.env.NESTJS_API_URL}/diagnoses`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", "20");
  if (status) url.searchParams.set("status", status);

  const res = await fetch(url.toString(), {
    cache: "no-store",       // Dynamic — always fetch fresh
    // cache: "force-cache", // Static — cache until revalidated
    // next: { revalidate: 60 }, // ISR — revalidate every 60 seconds
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch diagnoses: ${res.statusText}`);
  }

  return res.json();
}

export default async function DiagnosesPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const status = searchParams.status;

  const { data: diagnoses, total } = await getDiagnoses(page, status);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Diagnoses ({total})</h1>
      <DiagnosesFilters currentStatus={status} />
      <DiagnosesTable diagnoses={diagnoses} page={page} total={total} />
    </div>
  );
}
```

**Key decisions in this code:**
- **`cache: "no-store"`** — dynamic data, fetched fresh on every request. Use for admin dashboards where stale data is unacceptable.
- **`next: { revalidate: 60 }`** — Incremental Static Regeneration. Use for product pages where some staleness is acceptable.
- **`cache: "force-cache"`** — static data, fetched at build time. Use for content that never changes (terms of service, documentation).
- **Error handling** — the `throw` triggers the nearest `error.tsx` boundary automatically.

### Client-Side Fetching (For Interactivity)

Client-side fetching is for data that depends on user interaction — search results, filtered lists, real-time updates.

```typescript
// components/diagnoses/diagnoses-search.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function DiagnosesSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const debounceRef = useRef<NodeJS.Timeout>();

  // Sync URL search params with input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      params.delete("page"); // Reset pagination on new search
      router.push(`/dashboard/diagnoses?${params.toString()}`);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, router, searchParams]);

  return (
    <input
      type="search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search diagnoses by plant name or symptom..."
      className="w-full px-4 py-2 border rounded-lg"
    />
  );
}
```

### Caching and Revalidation

Next.js 14+ has an aggressive caching model. You must understand it or you'll ship stale data to production.

**The four caching layers:**
| Cache | What it stores | Where | Duration |
|---|---|---|---|
| Request Memoization | `fetch` results within a single render pass | Server | Per-request |
| Data Cache | `fetch` results across requests | Server | Persistent (revalidated) |
| Full Route Cache | Rendered HTML + RSC payload | Server | Persistent (revalidated) |
| Router Cache | RSC payload on the client | Browser | Session or time-based |

**The rule that trips up most developers:** `fetch` is cached by default. If you don't specify `cache: "no-store"` or a `revalidate` value, the data might be stale.

**Revalidation strategies:**
```typescript
// 1. Time-based revalidation — good for semi-dynamic content
fetch(url, { next: { revalidate: 60 } }); // Revalidate every 60 seconds

// 2. On-demand revalidation — good for mutations
// In a route handler or server action:
import { revalidatePath } from "next/cache";
revalidatePath("/dashboard/diagnoses"); // Revalidate this path after a mutation

// 3. Tag-based revalidation — good for targeted cache busting
fetch(url, { next: { tags: ["diagnoses"] } });
// Later, in a mutation handler:
import { revalidateTag } from "next/cache";
revalidateTag("diagnoses");
```

### When To Fetch On Server vs Client

| Scenario | Server | Client | Why |
|---|---|---|---|
| Initial page load data (admin table) | ✅ | ❌ | Faster TTFB, zero JS for table, SEO if needed |
| Search-as-you-type results | ❌ | ✅ | Every keystroke = new fetch, needs debounce |
| Dashboard with real-time updates | ❌ | ✅ | Needs Supabase subscription or polling |
| Detail view with ID from URL params | ✅ | ❌ | No interactivity needed, fetch and render |
| Form with dependent dropdowns | ❌ | ✅ | Country → State → City chaining needs client state |
| Auth-protected data | ✅ | Either | Server component can check session before fetch |

---

## Part 5: Forms, Actions, and Mutations

### The Two Mutation Patterns

Next.js offers two ways to handle form submissions and mutations. Know both and know when to use each.

**1. Server Actions (`"use server"` functions):**
- Good for: Simple forms where server-side validation is enough, post-submit redirect or revalidation
- Works without JavaScript (progressive enhancement)
- Cannot show optimistic UI updates easily
- Not ideal for complex multi-step forms

**2. Route Handlers + Client-Side Fetch:**
- Good for: Complex forms, optimistic UI, file uploads with progress, multi-step wizards
- Full client control over loading/error/success states
- More code, but more flexibility

### Server Action Pattern

```typescript
// app/actions/diagnoses.ts
"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const CreateDiagnosisSchema = z.object({
  plantName: z.string().min(1, "Plant name is required"),
  symptoms: z.string().min(10, "Please describe symptoms in more detail"),
  imageUrl: z.string().url().optional(),
});

export type CreateDiagnosisState = {
  errors?: {
    plantName?: string[];
    symptoms?: string[];
    imageUrl?: string[];
  };
  message?: string;
};

export async function createDiagnosis(
  prevState: CreateDiagnosisState,
  formData: FormData
): Promise<CreateDiagnosisState> {
  // 1. Validate
  const validated = CreateDiagnosisSchema.safeParse({
    plantName: formData.get("plantName"),
    symptoms: formData.get("symptoms"),
    imageUrl: formData.get("imageUrl") || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  // 2. Auth check
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { message: "You must be logged in to create a diagnosis" };
  }

  // 3. Submit to NestJS backend
  const response = await fetch(`${process.env.NESTJS_API_URL}/diagnoses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(validated.data),
  });

  if (!response.ok) {
    return { message: "Failed to create diagnosis. Please try again." };
  }

  // 4. Revalidate and redirect
  revalidatePath("/dashboard/diagnoses");
  redirect("/dashboard/diagnoses");
}
```

```typescript
// app/dashboard/diagnoses/new/page.tsx
"use client";

import { useFormState } from "react-dom";
import { createDiagnosis, type CreateDiagnosisState } from "@/app/actions/diagnoses";

const initialState: CreateDiagnosisState = {};

export default function NewDiagnosisPage() {
  const [state, formAction] = useFormState(createDiagnosis, initialState);

  return (
    <form action={formAction} className="space-y-4 max-w-lg">
      <div>
        <label htmlFor="plantName" className="block text-sm font-medium">
          Plant Name
        </label>
        <input
          id="plantName"
          name="plantName"
          type="text"
          className="w-full px-3 py-2 border rounded-lg"
        />
        {state.errors?.plantName && (
          <p className="text-red-600 text-sm mt-1">{state.errors.plantName[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="symptoms" className="block text-sm font-medium">
          Symptoms
        </label>
        <textarea
          id="symptoms"
          name="symptoms"
          rows={4}
          className="w-full px-3 py-2 border rounded-lg"
        />
        {state.errors?.symptoms && (
          <p className="text-red-600 text-sm mt-1">{state.errors.symptoms[0]}</p>
        )}
      </div>

      {state.message && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {state.message}
        </div>
      )}

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Submit Diagnosis
      </button>
    </form>
  );
}
```

### Client-Side Mutation Pattern (Optimistic UI)

```typescript
// components/diagnoses/diagnosis-status-update.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Diagnosis } from "@/types/diagnosis";

type Status = Diagnosis["status"];

export function DiagnosisStatusUpdate({
  diagnosisId,
  currentStatus,
}: {
  diagnosisId: string;
  currentStatus: Status;
}) {
  const [status, setStatus] = useState<Status>(currentStatus);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function updateStatus(newStatus: Status) {
    // Optimistic update
    const previousStatus = status;
    setStatus(newStatus);
    setIsPending(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/diagnoses/${diagnosisId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update");

      router.refresh(); // Refresh server components
    } catch {
      // Revert on failure
      setStatus(previousStatus);
      alert("Failed to update status. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <select
      value={status}
      onChange={(e) => updateStatus(e.target.value as Status)}
      disabled={isPending}
      className={`px-3 py-1 border rounded ${isPending ? "opacity-50" : ""}`}
    >
      <option value="pending">Pending</option>
      <option value="analyzing">Analyzing</option>
      <option value="completed">Completed</option>
      <option value="failed">Failed</option>
    </select>
  );
}
```

### Form Validation Architecture

Use Zod for validation — on the server for server actions, and optionally on the client for instant feedback.

```typescript
// lib/validations/diagnosis.ts
import { z } from "zod";

export const DiagnosisSchema = z.object({
  plantName: z
    .string()
    .min(1, "Plant name is required")
    .max(100, "Plant name must be under 100 characters"),
  symptoms: z
    .string()
    .min(10, "Please describe at least 10 characters of symptoms")
    .max(2000, "Symptoms description is too long"),
  imageUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  severity: z.enum(["low", "medium", "high", "critical"]).optional(),
});

export type DiagnosisInput = z.infer<typeof DiagnosisSchema>;
```

---

## Part 6: Auth Integration

### The Auth Architecture

For your stack, the auth architecture is:

```
Supabase Auth (session management, OAuth, magic links)
        │
        ├── Next.js Middleware (route protection)
        │       Checks Supabase session cookie
        │       Redirects unauthenticated users to /auth/login
        │
        ├── Server Components (session-aware rendering)
        │       Reads session via createServerClient()
        │       Renders role-aware UI before HTML reaches client
        │
        └── Client Components (interactive auth flows)
                Login form, signup form, password reset
```

### Middleware Protection

```typescript
// middleware.ts (at project root — not inside app/)
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // Protected routes
  const protectedPaths = ["/dashboard", "/admin", "/settings"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !session) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Admin-only routes
  const adminPaths = ["/admin"];
  const isAdminPath = adminPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isAdminPath && session) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Apply middleware to all routes except static files, _next, and favicon
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

### Session-Aware Server Components

```typescript
// app/dashboard/page.tsx
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, display_name, plan")
    .eq("id", session.user.id)
    .single();

  return (
    <div>
      <h1>Welcome, {profile?.display_name}</h1>
      {profile?.role === "admin" && (
        <div className="bg-blue-50 p-4 rounded">
          <p className="font-semibold">Admin Access</p>
          <a href="/admin" className="text-blue-600 underline">
            Go to Admin Panel
          </a>
        </div>
      )}
      {/* Dashboard content */}
    </div>
  );
}
```

**Key point:** The role check happens on the server. The admin link is never sent to the client if the user isn't an admin. This is not a client-side hide — it's a server-side render decision.

---

## Part 7: Admin / Product Web Patterns

### The Admin Dashboard Architecture

Every product you ship will need an admin interface. Here's the standard architecture:

```
Admin Shell (server layout)
├── Sidebar (server component — role-aware nav items)
├── Header (server component — user info, sign out)
└── Page Content (server component by default)
    ├── Data Table (server component)
    │   ├── Sort controls (client component)
    │   ├── Filter bar (client component with URL search params)
    │   └── Pagination (client component)
    ├── Detail View (server component)
    │   └── Action buttons (client component — delete, archive, status update)
    └── Forms (client component — create, edit)
```

### Data Table Pattern

```typescript
// app/dashboard/diagnoses/diagnoses-table.tsx
// Server component — receives data as props

import Link from "next/link";
import type { Diagnosis } from "@/types/diagnosis";

type Props = {
  diagnoses: Diagnosis[];
  page: number;
  total: number;
};

const PAGE_SIZE = 20;
const TOTAL_PAGES = Math.ceil(total / PAGE_SIZE);

export function DiagnosesTable({ diagnoses, page, total }: Props) {
  return (
    <div>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Plant
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Created
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {diagnoses.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No diagnoses found
                </td>
              </tr>
            ) : (
              diagnoses.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{d.plantName}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/diagnoses/${d.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination info */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {diagnoses.length} of {total} diagnoses
        {page > 1 && (
          <Link
            href={`/dashboard/diagnoses?page=${page - 1}`}
            className="ml-4 text-blue-600 hover:underline"
          >
            ← Previous
          </Link>
        )}
        {page < TOTAL_PAGES && (
          <Link
            href={`/dashboard/diagnoses?page=${page + 1}`}
            className="ml-4 text-blue-600 hover:underline"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Diagnosis["status"] }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    analyzing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
        colors[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}
```

### Detail View Pattern

```typescript
// app/dashboard/diagnoses/[id]/page.tsx
import { notFound } from "next/navigation";
import { DiagnosisStatusUpdate } from "@/components/diagnoses/diagnosis-status-update";
import { DiagnosisAIResults } from "./diagnosis-ai-results";
import type { Diagnosis } from "@/types/diagnosis";

async function getDiagnosis(id: string): Promise<Diagnosis | null> {
  const res = await fetch(
    `${process.env.NESTJS_API_URL}/diagnoses/${id}`,
    { cache: "no-store" }
  );

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch diagnosis: ${res.statusText}`);

  return res.json();
}

export default async function DiagnosisDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const diagnosis = await getDiagnosis(params.id);

  if (!diagnosis) {
    notFound(); // Renders nearest not-found.tsx
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{diagnosis.plantName}</h1>
          <p className="text-gray-500">
            Created {new Date(diagnosis.createdAt).toLocaleDateString()}
          </p>
        </div>
        <DiagnosisStatusUpdate
          diagnosisId={diagnosis.id}
          currentStatus={diagnosis.status}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Symptoms */}
        <section className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-2">Symptoms</h2>
          <p className="text-gray-700 whitespace-pre-wrap">
            {diagnosis.symptoms}
          </p>
        </section>

        {/* AI Results */}
        <DiagnosisAIResults diagnosis={diagnosis} />
      </div>
    </div>
  );
}
```

### Upload Flow Pattern

```typescript
// components/diagnoses/image-upload.tsx
"use client";

import { useState, useRef } from "react";

type Props = {
  onUploadComplete: (url: string) => void;
  existingUrl?: string;
};

export function ImageUpload({ onUploadComplete, existingUrl }: Props) {
  const [preview, setPreview] = useState<string | null>(existingUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPEG, PNG, and WebP images are supported");
      return;
    }

    // Preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();
      onUploadComplete(url);
    } catch {
      setError("Failed to upload image. Please try again.");
      setPreview(existingUrl || null);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isUploading ? "opacity-50 pointer-events-none" : "hover:border-blue-500"}
          ${error ? "border-red-300" : "border-gray-300"}`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Upload preview"
            className="max-h-48 mx-auto rounded"
          />
        ) : (
          <div>
            <p className="text-gray-500">Click to upload plant image</p>
            <p className="text-sm text-gray-400 mt-1">
              JPEG, PNG, or WebP — max 5MB
            </p>
          </div>
        )}
        {isUploading && (
          <p className="text-blue-600 mt-2">Uploading...</p>
        )}
      </div>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
```

---

## Part 8: AI Integration — Practical Next.js Patterns

Next.js is the rendering layer for your AI features. The AI work happens in NestJS (diagnosis pipelines, RAG search, embedding generation), but Next.js displays results, manages loading states for long-running AI jobs, and provides the interactive UI for AI-assisted workflows.

### Pattern 1: Semantic Search UI (pgvector + Server Component)

The user searches plant diagnoses with natural language. Your NestJS backend runs a pgvector similarity search. Next.js renders results with proper loading/empty/error states.

```typescript
// app/dashboard/diagnoses/search/page.tsx
// Server component that fetches semantic search results

import { DiagnosesSearch } from "./diagnoses-search";
import { DiagnosesResults } from "./diagnoses-results";
import type { DiagnosisSearchResult } from "@/types/diagnosis";

type Props = {
  searchParams: { q?: string };
};

async function semanticSearch(query: string): Promise<DiagnosisSearchResult[]> {
  const res = await fetch(
    `${process.env.NESTJS_API_URL}/diagnoses/search`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, topK: 20 }),
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Search Diagnoses</h1>
      <DiagnosesSearch />

      {query ? (
        <SearchResults query={query} />
      ) : (
        <p className="text-gray-500">
          Enter symptoms or a plant name to search past diagnoses.
        </p>
      )}
    </div>
  );
}

async function SearchResults({ query }: { query: string }) {
  try {
    const results = await semanticSearch(query);

    if (results.length === 0) {
      return (
        <div className="bg-gray-50 border rounded-lg p-8 text-center">
          <p className="text-gray-500">
            No diagnoses found for "{query}"
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Try different symptoms or check spelling.
          </p>
        </div>
      );
    }

    return (
      <div>
        <p className="text-sm text-gray-500 mb-2">
          {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
        </p>
        <DiagnosesResults results={results} />
      </div>
    );
  } catch (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">
          Search failed. Please try again.
        </p>
      </div>
    );
  }
}
```

**Why this matters for interviews:** This demonstrates understanding of:
- Semantic search (pgvector) as a practical AI feature, not a chatbot gimmick
- Server-side fetching with proper loading/error/empty state handling
- URL search params as the source of truth for search queries (bookmarkable, shareable)
- Separation of concerns — AI search logic in NestJS, UI rendering in Next.js

### Pattern 2: AI Diagnosis Streaming UI (Polling + Status Updates)

AI diagnoses take time. NestJS runs them as background jobs. Next.js polls for status and renders the appropriate UI.

```typescript
// components/diagnoses/diagnosis-ai-results.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import type { Diagnosis, AIResult } from "@/types/diagnosis";

export function DiagnosisAIResults({ diagnosis }: { diagnosis: Diagnosis }) {
  const [aiResult, setAiResult] = useState<AIResult | null>(
    diagnosis.aiResult || null
  );
  const [isPolling, setIsPolling] = useState(
    diagnosis.status === "analyzing" || diagnosis.status === "pending"
  );
  const pollRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isPolling) return;

    async function poll() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/diagnoses/${diagnosis.id}`
        );
        const updated: Diagnosis = await res.json();

        if (updated.status === "completed" || updated.status === "failed") {
          setAiResult(updated.aiResult || null);
          setIsPolling(false);
        }
      } catch {
        // Polling failed — will retry on next interval
      }
    }

    pollRef.current = setInterval(poll, 3000); // Poll every 3 seconds

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isPolling, diagnosis.id]);

  if (diagnosis.status === "pending") {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-700 font-medium">Queued</p>
        <p className="text-yellow-600 text-sm mt-1">
          Your diagnosis is in the queue and will be analyzed shortly.
        </p>
      </div>
    );
  }

  if (diagnosis.status === "analyzing" || isPolling) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-blue-700 font-medium">Analyzing...</p>
        </div>
        <p className="text-blue-600 text-sm mt-1">
          AI is analyzing the plant symptoms. This usually takes 30-60 seconds.
        </p>
      </div>
    );
  }

  if (diagnosis.status === "failed") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 font-medium">Analysis Failed</p>
        <p className="text-red-600 text-sm mt-1">
          The AI was unable to complete the analysis. Please try submitting again.
        </p>
      </div>
    );
  }

  if (aiResult) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-green-900">AI Diagnosis Result</h3>
        <div>
          <p className="text-sm font-medium text-green-800">Likely Issue</p>
          <p className="text-green-700">{aiResult.diagnosis}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-green-800">Confidence</p>
          <p className="text-green-700">
            {(aiResult.confidence * 100).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-green-800">Recommended Care</p>
          <p className="text-green-700 whitespace-pre-wrap">
            {aiResult.carePlan}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
```

### Pattern 3: AI-Assisted Form Filling

Use the OpenAI SDK to suggest form content based on user input — practical AI that reduces friction.

```typescript
// app/actions/suggest-diagnosis.ts
"use server";

export async function suggestDiagnosis(
  symptoms: string
): Promise<{ suggestion: string } | { error: string }> {
  if (!symptoms || symptoms.length < 10) {
    return { error: "Please describe at least 10 characters of symptoms" };
  }

  try {
    const res = await fetch(`${process.env.NESTJS_API_URL}/ai/suggest-diagnosis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms }),
    });

    if (!res.ok) throw new Error("Suggestion failed");
    return res.json();
  } catch {
    return { error: "Failed to get AI suggestion. Please try again." };
  }
}
```

```typescript
// components/diagnoses/symptom-suggest.tsx
"use client";

import { useState } from "react";
import { suggestDiagnosis } from "@/app/actions/suggest-diagnosis";

export function SymptomSuggest({
  currentSymptoms,
  onSelect,
}: {
  currentSymptoms: string;
  onSelect: (suggestion: string) => void;
}) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getSuggestion() {
    setIsLoading(true);
    setError(null);

    const result = await suggestDiagnosis(currentSymptoms);

    if ("error" in result) {
      setError(result.error);
    } else {
      setSuggestion(result.suggestion);
    }
    setIsLoading(false);
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={getSuggestion}
        disabled={isLoading || currentSymptoms.length < 10}
        className="text-sm text-blue-600 hover:underline disabled:text-gray-400"
      >
        {isLoading ? "Getting suggestion..." : "✨ AI: Suggest structured description"}
      </button>

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

      {suggestion && (
        <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">{suggestion}</p>
          <button
            type="button"
            onClick={() => {
              onSelect(suggestion);
              setSuggestion(null);
            }}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Use this suggestion
          </button>
        </div>
      )}
    </div>
  );
}
```

### When AI Does NOT Help in Next.js

Be honest in interviews. Not every UI needs AI.

- **Standard CRUD forms** — AI suggestions add latency and cost with minimal user value
- **Admin tables with simple filters** — SQL `WHERE` clauses are fast and predictable; semantic search adds complexity
- **Static content pages** — AI has no role in rendering a terms-of-service page
- **Authentication flows** — Login/signup are deterministic; AI adds risk, not value

---

## Part 9: Product-Thinking Interpretation

### What A Product Engineer Sees That A Pure Developer Misses

A React developer thinks: "How do I build this component?"

A Product Engineer thinks: "Where does this page fit in the user's workflow? What state is it in when the user arrives? What happens if the API is down? How does this page affect the user's decision to stay or leave?"

**For admin dashboards:**
- A developer builds a data table. A Product Engineer builds a data table with: sortable columns, filterable rows, bulk actions, export capability, clear empty states, skeleton loading, error retry buttons, and pagination that survives page refresh.
- The difference isn't technical skill — it's completeness of thought about the user's task.

**For landing pages:**
- A developer builds a pretty page. A Product Engineer builds a page that: loads in under 2 seconds (Core Web Vitals), has proper meta tags (SEO), tracks conversions (analytics), and has a clear call-to-action path that works when JavaScript is disabled.

**For AI features:**
- A developer adds a chatbot. A Product Engineer adds a feature that reduces the user's time-to-value: semantic search that finds relevant past diagnoses, AI-assisted form filling that reduces typing, status polling that shows the user what's happening while they wait.

### How To Explain Next.js To A Non-Technical Stakeholder

> "Next.js is the technology that powers our web application. It lets us build pages that load quickly, work well in search engines, and feel responsive — like a native app. When you visit our admin dashboard, the important data is already prepared on the server before the page reaches your browser. That means less waiting, fewer loading spinners, and a better experience for your team."

---

## Part 10: Interview Questions & Strong Model Answers

### Q1: Why use Next.js over plain React?

**Strong answer:**

> "Next.js solves four problems that plain React doesn't address out of the box. First, server-side rendering — plain React ships an empty HTML shell and hydrates on the client, which hurts SEO and First Contentful Paint. Next.js renders meaningful HTML on the server, so the user sees content faster and search engines can index it. Second, file-based routing — no need to configure React Router manually. Third, server components — I can fetch data on the server and ship zero JavaScript for data-heavy views like admin tables and dashboards. Fourth, built-in optimizations — image optimization, font loading, code splitting by route, and static generation are all configured by default. For my product engineering work, Next.js is the default web layer because it lets me ship admin dashboards, landing pages, and product web apps faster than wiring React from scratch."

### Q2: When should a component use `"use client"`?

**Strong answer:**

> "A component needs 'use client' when it requires interactivity, browser APIs, or client-side state. Specifically: event handlers like onClick and onChange, hooks like useState and useEffect, browser APIs like localStorage or window, and client-only libraries like charting tools or rich text editors. I default to server components and push the 'use client' boundary as deep into the component tree as possible. For example, in an admin data table, the table shell and data rows are server components. Only the filter bar and sort controls need 'use client' because they manage interactive state. This pattern minimizes the JavaScript shipped to the browser."

### Q3: How do you structure data fetching in a Next.js admin dashboard?

**Strong answer:**

> "I use a layered strategy. Initial page data — like a list of diagnoses in an admin table — is fetched in a server component using async/await with `cache: 'no-store'` for dynamic data. This means the data is fetched at request time on the server, rendered into HTML, and shipped to the client with zero JavaScript for that component. For data that depends on user interaction — like search results or filter updates — I sync the interaction to URL search params and let the server component re-fetch with the new params. For real-time updates, I use Supabase subscriptions or polling in a client component. For mutations, I use server actions with `useFormState` for simple forms and route handlers with optimistic UI for complex flows. The key is: server for initial load, URL params for interactive filters, client-side fetching only when real-time or highly interactive."

### Q4: How would you secure admin routes in Next.js?

**Strong answer:**

> "I use a defense-in-depth approach with three layers. First, middleware checks the Supabase session cookie on every request to protected paths like /dashboard and /admin. Unauthenticated users are redirected to login. Second, server components re-verify the session and fetch the user's role from the database before rendering — this check happens on the server, so role-restricted content never reaches the client. Third, route handlers and server actions validate the session before executing any mutation. For admin-only routes like /admin, the middleware also checks the role from the database and redirects non-admins. This means even if a client-side check fails or is bypassed, the server still enforces auth at every level."

### Q5: What's your strategy for handling loading and error states in Next.js?

**Strong answer:**

> "I use the App Router's built-in file conventions as the foundation. `loading.tsx` provides automatic Suspense boundaries — Next.js shows it while the page or layout awaits async data. I build skeleton screens that match the layout of the actual content, which reduces perceived latency better than spinners. `error.tsx` catches errors in child components and presents a clear message with a retry button. For granular control, I use React's `Suspense` boundaries manually for specific slow components — like an AI results panel that loads independently from the rest of the page. For mutations, I model every async operation with three states: idle/loading, success, and error — using discriminated unions in TypeScript so the type system prevents me from showing loading and error simultaneously. The non-negotiable rule is: every async operation in the UI must handle the loading and error states. No exceptions."

### Q6: When would you use a separate NestJS backend instead of Next.js route handlers?

**Strong answer:**

> "Next.js route handlers are fine for simple proxy endpoints, auth callbacks, and webhook receivers. But I reach for NestJS when the backend needs: complex business logic with a proper service layer, background job processing — like AI diagnosis pipelines that take 30+ seconds, database transactions spanning multiple tables with rollback logic, WebSocket or real-time infrastructure beyond what Supabase subscriptions provide, or scheduled jobs and cron tasks. In my plant-care app, the AI diagnosis engine runs in NestJS because it involves: queuing the diagnosis request, calling OpenAI with a structured prompt, embedding the result with pgvector, storing the embedding, and updating the diagnosis status. That's a multi-step, potentially long-running workflow — NestJS with BullMQ handles it properly. Next.js route handlers would block or time out. The architectural principle is: Next.js handles the web surface and simple proxy routes; NestJS handles business logic, AI orchestration, and complex data workflows."

### Q7: How do you decide between server actions and route handlers for mutations?

**Strong answer:**

> "Server actions are my default for simple forms — create, update, delete operations where server-side validation is sufficient and the post-submit behavior is a redirect or revalidation. They're simpler to write, work without JavaScript, and integrate with `useFormState` for validation errors. Route handlers with client-side fetch are for complex mutations — anything needing optimistic UI, file uploads with progress bars, multi-step wizards where intermediate state matters, or mutations where the UI needs to update without a full page refresh. The tradeoff: server actions are simpler but less flexible; route handlers require more code but give you full control over the client-side experience."

### Q8: How do you think about caching in Next.js? Where do things go wrong?

**Strong answer:**
