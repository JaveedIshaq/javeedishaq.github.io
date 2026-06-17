# Supabase Study Guide

## Purpose

This guide is for mastering Supabase at the level required for:

1. Product Engineer interviews where "BaaS vs custom backend" decisions reveal architectural maturity
2. Building production products that use Supabase as the database, auth, storage, and realtime layer
3. Explaining the Supabase-NestJS boundary with clarity — not "Supabase handles everything" or "never use BaaS"

Supabase is not a replacement for PostgreSQL knowledge. It IS PostgreSQL — hosted, managed, and extended with auth, storage, realtime, and edge functions. The difference between a junior answer and a senior answer is knowing what Supabase abstracts versus what it builds on, and when those abstractions help versus constrain you.

---

## Part 1: Topic Positioning

### What Supabase Is (One Clear Sentence)

Supabase is a hosted PostgreSQL platform that adds built-in auth, storage, realtime subscriptions, and edge functions — letting you ship full-stack products faster without managing database infrastructure, but with the full power of PostgreSQL underneath when you need it.

### Where It Sits In The Product Engineer Stack

```
┌──────────────────────────────────────────────────────────┐
│                     Supabase Platform                     │
│                                                          │
│  ┌────────────┐  ┌───────────┐  ┌────────────────────┐  │
│  │   Auth     │  │  Storage  │  │     Realtime       │  │
│  │ (email,    │  │ (S3-com-  │  │ (WebSocket         │  │
│  │  OAuth,    │  │  patible  │  │  subscriptions,    │  │
│  │  SSO,      │  │  file     │  │  Postgres changes, │  │
│  │  phone)    │  │  uploads) │  │  broadcast)        │  │
│  └─────┬──────┘  └─────┬─────┘  └─────────┬──────────┘  │
│        │               │                  │              │
│        └───────────────┼──────────────────┘              │
│                        │                                 │
│               ┌────────┴────────┐                        │
│               │   PostgreSQL    │                        │
│               │  (tables,       │                        │
│               │   indexes,      │                        │
│               │   pgvector,     │                        │
│               │   RLS policies, │                        │
│               │   functions)    │                        │
│               └────────┬────────┘                        │
│                        │                                 │
│               ┌────────┴────────┐                        │
│               │  Edge Functions │                        │
│               │  (Deno,         │                        │
│               │   serverless    │                        │
│               │   compute)      │                        │
│               └─────────────────┘                        │
└──────────────────────┬───────────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
┌────────┴────────┐        ┌────────┴────────┐
│  Flutter App    │        │  Next.js Admin  │
│  (supabase-     │        │  (@supabase/    │
│   flutter SDK)  │        │   ssr, client)  │
└─────────────────┘        └─────────────────┘
         │                           │
         └───────────────┬───────────┘
                         │
                ┌────────┴────────┐
                │  NestJS Backend │
                │  (when custom   │
                │   logic exceeds │
                │   BaaS scope)   │
                └─────────────────┘
```

Supabase sits BETWEEN the raw PostgreSQL layer and your application code. Use it when it accelerates delivery. Bypass it (with direct PostgreSQL access) when its abstractions limit you. Combine it with NestJS when domain logic, background jobs, or complex orchestration outgrow what BaaS + edge functions can handle cleanly.

### Why Supabase Matters For Your Specific Career Path

- **Days 1-30 Alignment:** Your 90-day plan targets backend credibility. Supabase is the "fast path" — you can ship auth, storage, and realtime in hours instead of days. This is NOT a shortcut around learning PostgreSQL. It's a force multiplier that lets you spend your NestJS time on business logic, not auth boilerplate.
- **Track A (Income Runway):** Clients love speed. "I'll have auth, database, and file uploads working by end of week" is a stronger pitch than "I'll build a custom auth system first." Supabase lets you deliver faster without sacrificing quality — the PostgreSQL underneath is production-grade.
- **Track B (Owned Assets):** A starter kit with Supabase auth + PostgreSQL + Flutter + Next.js admin is sellable. Supabase reduces the setup burden (no auth microservice to build and maintain) while PostgreSQL gives you full relational power.
- **The Merge:** Supabase IS your PostgreSQL database. The same database serves your Flutter app, your Next.js admin, and your NestJS backend. There is no "Supabase data" vs "backend data" — it's all the same PostgreSQL. This unified data layer is a competitive advantage in interviews.

### The Brutal Truth About Supabase In Your Story

Supabase is a tool, not an identity. Interviewers want to hear:

- "I use Supabase for auth, storage, and realtime because they're solved problems that don't differentiate my product. I use the PostgreSQL underneath for everything else — schema design, indexing, pgvector, RLS policies — because that's where product-specific reasoning happens."
- Not: "I build everything in Supabase."

The Supabase-NestJS boundary question is a senior-level differentiator. Know exactly where one ends and the other begins.

---

## Part 2: Interview Landscape

### What Interviewers Are Actually Testing

When interviewers ask Supabase questions, they are testing:

1. **Architectural judgment:** Do you know when BaaS helps and when it constrains? Can you draw a boundary line between Supabase's managed services and custom backend logic?
2. **Security thinking:** Do you understand Row-Level Security? Can you explain who can access what data and why? "Auth guards on the frontend" is not a security answer.
3. **PostgreSQL depth:** Do you know Supabase IS PostgreSQL, or do you treat it as a separate abstraction? Can you write raw SQL, create indexes, and use pgvector — all within Supabase?
4. **Product speed awareness:** Can you make pragmatic tradeoffs between "build it myself" and "use the platform" based on the product's needs, not your technical preferences?

### What A Weak Answer Sounds Like

> "Supabase is great — it handles auth, database, storage, everything. I build my whole backend with it."

Why weak:
- "Everything" shows no boundary awareness. Supabase does not handle background jobs, complex state machines, or multi-step AI workflows natively.
- No mention of when Supabase ISN'T enough — shows you haven't hit platform limits.
- Sounds like you let the tool make architectural decisions for you.

> "I use RLS policies to secure data."

Why weak:
- Too vague. Which policies? On which tables? For which roles?
- "I use RLS" without a concrete policy example is like saying "I use indexes" without naming which columns.
- No mention of testing policies or verifying they actually block unauthorized access.

> "I prefer Supabase over NestJS because it's faster to build with."

Why weak:
- False dichotomy. Supabase and NestJS serve different purposes. You use Supabase for managed infrastructure (auth, storage, realtime) and NestJS for custom business logic. They coexist.
- "Faster to build" without acknowledging the tradeoffs (less control, vendor lock-in risk, edge function cold starts) sounds like you haven't thought critically.

> "I use the Supabase client on the frontend to query the database directly."

Why weak:
- Direct database access from the frontend is a security model, not an implementation detail. It requires RLS on EVERY table, careful policy design, and acceptance that business logic lives in database functions/policies, not in an API layer.
- If the interviewer's company uses a traditional API-between-frontend-and-database pattern, this answer signals architectural misalignment.
- Even Supabase themselves recommend a server-side client for sensitive operations.

### What A Strong Answer Sounds Like

> "Supabase is my default BaaS when product speed matters. For PlantUSA, I use Supabase Auth for email/password and social login — it handles session management, refresh tokens, and password resets out of the box. I use Supabase Storage for plant images and diagnosis photos, with RLS policies that ensure users can only access their own uploads. The database is PostgreSQL — I design schemas, add indexes, and use pgvector for semantic search, all through the same Supabase project. When the product needs logic that doesn't fit BaaS — like the multi-step AI diagnosis pipeline that calls OpenAI, stores results, updates status, and sends push notifications — I run that in a NestJS backend that connects to the SAME Supabase PostgreSQL database. The NestJS backend uses the service_role key for admin-level database access, while the Flutter app uses the authenticated user's JWT with RLS enforcement."

Why strong:
- Names specific Supabase services and their PlantUSA use cases
- Clear boundary: Supabase for auth/storage/RLS, NestJS for multi-step orchestration
- Same database — no data silos
- Service role vs authenticated user — shows security model understanding
- pgvector integration — shows you know what's running underneath

> "Row-Level Security is my primary data access control. For the diagnoses table, I have a policy: `CREATE POLICY "Users can view own diagnoses" ON diagnoses FOR SELECT USING (auth.uid() = user_id)`. This means the Flutter app can query `SELECT * FROM diagnoses` and the user only sees their own records — the filter is enforced at the database level, not in application code. I also have a policy for inserts: `CREATE POLICY "Users can create diagnoses" ON diagnoses FOR INSERT WITH CHECK (auth.uid() = user_id)`. This ensures the authenticated user's ID matches the `user_id` being inserted — no one can create a diagnosis under another user's account, even if they modify the API request. For the admin dashboard, I use a separate NestJS endpoint with the service_role key that bypasses RLS — but that endpoint is behind its own authentication and authorization middleware."

Why strong:
- Specific SQL policies
- Explains what each policy prevents (not just what it allows)
- Clear separation: user-facing queries use RLS + JWT; admin queries use service_role + NestJS auth
- Demonstrates understanding of the security model at the database level, not middleware level

> "I choose Supabase over NestJS for auth because auth is undifferentiated heavy lifting. Building secure password resets, email verification, OAuth flows, and session management from scratch is 2-3 weeks of work that doesn't make my product better. I'd rather spend that time on the AI diagnosis pipeline. But I choose NestJS over Supabase Edge Functions for the diagnosis pipeline because it involves: queuing, OpenAI calls with retry logic, structured logging, and updating multiple tables in a specific order. Edge functions are great for simple transformations or webhooks, but the cold start latency, execution time limits, and lack of persistent connections make them wrong for an orchestrated AI workflow."

Why strong:
- Decision is based on product context, not technology loyalty
- Recognizes what's commodity (auth) vs what's differentiating (AI pipeline)
- Honest about edge function limitations — no BaaS fanaticism
- Time-value judgment: auth from scratch = 2-3 weeks wasted

### How To Connect Supabase To Shipped Work

Every Supabase question is an opportunity to discuss PlantUSA's architecture:

- **Auth:** Email/password + social login via Supabase Auth, session management, role-based access (user/operator/admin)
- **Storage:** Plant images, diagnosis photos — user-scoped buckets with RLS
- **Database:** PostgreSQL with 15+ tables, pgvector for plant knowledge semantic search, RLS policies on all user-facing tables
- **Realtime:** Live diagnosis status updates (queued → processing → complete) pushed to the Flutter app via Supabase Realtime subscriptions
- **Edge Functions:** Simple webhooks (Stripe payment confirmation, email notifications via Resend)
- **NestJS Boundary:** AI diagnosis pipeline, admin analytics, background jobs — all using the same PostgreSQL database via service_role

---

## Part 3: Auth — Deep Technical Section

### 3.1 The Supabase Auth Model

Supabase Auth is not a separate service. It's a set of managed tables (`auth.users`, `auth.sessions`, `auth.refresh_tokens`) inside your PostgreSQL database, with a Go-based auth server (Gotrue) that handles authentication flows.

**The mental model:**
- Supabase Auth manages the `auth` schema — you don't modify these tables directly
- Your application tables reference `auth.users.id` as a foreign key
- Every authenticated request includes a JWT that identifies the user
- RLS policies use `auth.uid()` to get the current user's ID from the JWT

```
User → Auth Endpoint (Gotrue) → JWT issued → JWT sent with every request
                                              → RLS checks auth.uid() against row ownership
                                              → Application tables reference auth.users.id
```

### 3.2 Auth Flow Implementation

**Sign-up flow:**
```typescript
// Flutter app
final authResponse = await supabase.auth.signUp(
  email: 'user@email.com',
  password: 'securePassword123',
  data: { 'full_name': 'Javeed Ishaq' }, // user_metadata
);

// At this point:
// - User record created in auth.users
// - Confirmation email sent (if enabled)
// - Session returned (if email confirmation disabled)
// - YOUR trigger fires to create a profile in public.users
```

**Database trigger for profile creation:**
```sql
-- Automatically create a public.users row when someone signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
```

**The public.users table:**
```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'operator', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: Users can read their own profile
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
```

### 3.3 Roles And Authorization Patterns

Supabase Auth doesn't have built-in role management beyond `authenticated` and `anon` roles. You build your own role system:

**Option 1: Custom roles in `public.users` (Recommended for most products)**
```sql
-- Store role in users table
-- Check in RLS policies
CREATE POLICY "Admins can view all diagnoses"
    ON diagnoses FOR SELECT
    USING (
        auth.uid() = user_id
        OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
```

**Option 2: Supabase custom claims (For JWT-level checks)**
```sql
-- Set custom claims in auth.users.raw_app_meta_data
-- Requires service_role or admin API
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE id = 'user-uuid';

-- Then in RLS:
-- auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
```

**Option 3: Hybrid — NestJS for admin, Supabase for user-facing**

This is the PlantUSA pattern:
- Flutter app uses Supabase client with user JWT → RLS enforces user-scoped access
- Next.js admin uses NestJS backend → service_role key bypasses RLS → NestJS auth middleware enforces admin access
- Same PostgreSQL database, different access patterns, different auth models

**When to use each:**
- **Option 1:** Simple role hierarchy (user/admin), roles change infrequently, database-level enforcement is sufficient
- **Option 2:** You need JWT-level role checks without database queries, external services need to verify roles from JWT alone
- **Option 3:** Admin functionality is complex (analytics, bulk operations, audit reports), needs a proper API layer, and you already have NestJS

### 3.4 Session Management

**Client-side (Flutter):**
```dart
// Listen to auth state changes
supabase.auth.onAuthStateChange.listen((data) {
  final AuthChangeEvent event = data.event;
  final Session? session = data.session;

  if (event == AuthChangeEvent.signedIn) {
    // Navigate to home
  } else if (event == AuthChangeEvent.signedOut) {
    // Navigate to login, clear local data
  } else if (event == AuthChangeEvent.tokenRefreshed) {
    // Session automatically refreshed — no action needed
  }
});

// On app start — restore session
final session = supabase.auth.currentSession;
if (session != null) {
  // User is logged in, session valid
}
```

**Server-side (NestJS):**
```typescript
// NestJS validates the Supabase JWT on every request
// Option A: Use supabase-js on the server with the user's JWT
const supabase = createClient(url, anonKey, {
  global: { headers: { Authorization: `Bearer ${userJwt}` } }
});
// Queries are scoped to the user via RLS

// Option B: Use service_role for admin operations
const adminClient = createClient(url, serviceRoleKey);
// Full database access — must be behind auth middleware
```

### 3.5 Auth Red Flags Interviewers Watch For

- **"I check auth on the frontend."** Frontend auth checks are UX, not security. Anyone can modify client code. Real auth enforcement must be at the database level (RLS) or API level (NestJS middleware + service_role).
- **Not understanding the trigger pattern.** If you say "I store user profiles" but don't mention the `handle_new_user` trigger, you haven't built a real Supabase auth flow.
- **No mention of session refresh.** Supabase automatically refreshes sessions, but you should know this happens and that the `onAuthStateChange` listener handles it.
- **"I disabled RLS during development."** This is fine — until you forget to re-enable it. Interviewers want to hear that RLS is thought about from the start, not bolted on later.

---

## Part 4: Row-Level Security — Deep Technical Section

### 4.1 What RLS Actually Does

RLS is a PostgreSQL feature that Supabase makes accessible through its dashboard and API. It attaches policies to tables that filter or restrict rows based on the authenticated user.

**Without RLS:** Anyone with database access can query any row.
**With RLS enabled (and no policies):** No one can query any row (default deny).
**With RLS enabled and policies:** Only rows matching the policy are accessible.

```sql
-- Enable RLS on a table
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can SELECT their own diagnoses
CREATE POLICY "Users can view own diagnoses"
    ON diagnoses FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can INSERT diagnoses for themselves
CREATE POLICY "Users can create diagnoses"
    ON diagnoses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can UPDATE their own diagnoses (but only certain statuses)
CREATE POLICY "Users can update own queued diagnoses"
    ON diagnoses FOR UPDATE
    USING (auth.uid() = user_id AND status = 'queued')
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can DELETE their own queued diagnoses
CREATE POLICY "Users can delete own queued diagnoses"
    ON diagnoses FOR DELETE
    USING (auth.uid() = user_id AND status = 'queued');

-- Policy: Admins can do everything
CREATE POLICY "Admins have full access"
    ON diagnoses FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
```

### 4.2 Policy Design Principles

1. **Default deny.** Enable RLS first, then add permissive policies. Without any policies, the table is inaccessible — which is safer than accidentally exposing data.

2. **One policy per operation per role.** Separate SELECT, INSERT, UPDATE, DELETE policies. This forces you to think about who can do what, not just "can they access this table."

3. **USING vs WITH CHECK:**
   - `USING` filters existing rows (SELECT, UPDATE, DELETE)
   - `WITH CHECK` validates new data (INSERT, UPDATE)
   - UPDATE needs both: USING (can they see this row?) and WITH CHECK (is the new data valid?)

4. **Test policies with different roles:**
   ```sql
   -- Test as authenticated user
   SET LOCAL role authenticated;
   SET LOCAL request.jwt.claim.sub TO 'user-uuid-here';
   SELECT * FROM diagnoses; -- Should only return this user's rows

   -- Test as anon
   SET LOCAL role anon;
   SELECT * FROM diagnoses; -- Should return empty or error
   ```

5. **Service role bypasses RLS.** The `service_role` key skips all RLS checks. This is intentional — your NestJS admin backend uses it. But it means you MUST protect service_role endpoints with your own auth.

### 4.3 Common RLS Patterns For PlantUSA

**Pattern 1: Ownership by user_id**
```sql
-- Most tables have a user_id column
-- Policy: auth.uid() = user_id
-- Works for: plants, diagnoses, care_plans
```

**Pattern 2: Ownership through a parent relationship**
```sql
-- Diagnosis results belong to a diagnosis, which belongs to a user
CREATE POLICY "Users can view own diagnosis results"
    ON diagnosis_results FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM diagnoses
            WHERE diagnoses.id = diagnosis_results.diagnosis_id
            AND diagnoses.user_id = auth.uid()
        )
    );
```

**Pattern 3: Public read access, authenticated write**
```sql
-- Plant knowledge base is readable by all authenticated users
CREATE POLICY "Authenticated users can read knowledge base"
    ON plant_knowledge FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert knowledge"
    ON plant_knowledge FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('operator', 'admin')
        )
    );
```

**Pattern 4: Storage bucket RLS**
```sql
-- Users can only access their own uploads
-- Bucket: plant-images
-- Folder structure: {user_id}/{plant_id}/{filename}

CREATE POLICY "Users can upload own plant images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'plant-images'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view own plant images"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'plant-images'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
```

### 4.4 RLS Red Flags

- **"I use RLS everywhere" without specifics.** Which tables? Which policies? What do they enforce? The interview answer needs concrete examples.
- **RLS with no tests.** If you can't describe how you verified your policies work, you haven't really secured your data.
- **Allowing anon access to user data tables.** The `anon` key has no user identity. Any policy that allows anon SELECT on user-owned tables is a data leak.
- **Complex nested EXISTS in every policy.** If your policies have 4-level nested EXISTS queries, your schema might need denormalization or a different access pattern. Policies run on every query — keep them fast.

---

## Part 5: Storage — Deep Technical Section

### 5.1 Supabase Storage Architecture

Supabase Storage is an S3-compatible object store built on top of PostgreSQL. Files are stored as objects in buckets, with metadata in `storage.objects`.

**Key concepts:**
- **Buckets:** Top-level containers (e.g., `plant-images`, `diagnosis-photos`, `user-avatars`)
- **Objects:** Files within buckets, organized by path (e.g., `{user_id}/{plant_id}/photo.jpg`)
- **RLS on storage:** Same RLS system protects files — policies on `storage.objects` control upload, download, and delete

### 5.2 Storage Implementation For PlantUSA

**Bucket setup:**
```sql
-- Create buckets (via SQL or dashboard)
INSERT INTO storage.buckets (id, name, public)
VALUES ('plant-images', 'plant-images', false);

INSERT INTO storage.buckets (id, name, public)
VALUES ('diagnosis-photos', 'diagnosis-photos', false);
```

**RLS for user-scoped uploads:**
```sql
-- Users can upload to their own folder
CREATE POLICY "Users can upload to own folder"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'plant-images'
        AND auth.uid()::text = (string_to_array(name, '/'))[1]
    );

-- Users can view files in their own folder
CREATE POLICY "Users can view own files"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'plant-images'
        AND auth.uid()::text = (string_to_array(name, '/'))[1]
    );
```

**Flutter upload with compression:**
```dart
import 'package:image/image.dart' as img;

Future<String> uploadPlantImage(File imageFile, String plantId) async {
    final userId = supabase.auth.currentUser!.id;

    // Compress image before upload
    final originalBytes = await imageFile.readAsBytes();
    final decoded = img.decodeImage(originalBytes)!;
    final compressed = img.encodeJpg(decoded, quality: 80);

    // Upload to {userId}/{plantId}/{timestamp}.jpg
    final path = '$userId/$plantId/${DateTime.now().millisecondsSinceEpoch}.jpg';

    await supabase.storage
        .from('plant-images')
        .uploadBinary(path, compressed);

    // Get public URL
    return supabase.storage
        .from('plant-images')
        .getPublicUrl(path);
}
```

**NestJS service role upload (for admin/backend use):**
```typescript
// Using service_role key — bypasses RLS
async uploadDiagnosisImage(file: Express.Multer.File, diagnosisId: string): Promise<string> {
    const path = `diagnoses/${diagnosisId}/${Date.now()}.jpg`;

    const { error } = await this.adminSupabase.storage
        .from('diagnosis-photos')
        .upload(path, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });

    if (error) throw new StorageException(error.message);

    return this.adminSupabase.storage
        .from('diagnosis-photos')
        .getPublicUrl(path).data.publicUrl;
}
```

### 5.3 Storage Design Principles

1. **Folder structure IS authorization.** Use `{userId}/{resourceId}/{filename}` as your folder convention. RLS policies parse the path to enforce ownership.

2. **Compress before upload.** Mobile users upload high-res photos. Supabase Storage bills by storage used and bandwidth. Compress images to reasonable quality (80% JPEG) before upload — it saves money and improves upload speed.

3. **Separate buckets for separate access patterns.** `plant-images` and `diagnosis-photos` have different RLS policies. Don't mix them in one bucket.

4. **Public vs private buckets.** Public buckets serve files without auth (good for avatars, shared content). Private buckets require auth for every access (good for diagnosis photos, user documents).

5. **File size limits.** Set bucket-level limits to prevent abuse. A 50MB plant photo is never intentional — it's a bug.

---

## Part 6: Realtime — Deep Technical Section

### 6.1 What Supabase Realtime Actually Does

Supabase Realtime is a WebSocket server that pushes PostgreSQL changes to subscribed clients. It uses PostgreSQL's logical replication to capture INSERT, UPDATE, and DELETE events, then broadcasts them over WebSockets.

**Three capabilities:**
1. **Postgres Changes:** Subscribe to table changes (INSERT/UPDATE/DELETE) and receive the changed rows in real time
2. **Broadcast:** Send ephemeral messages between clients (like WebSocket chat)
3. **Presence:** Track which users are online/present (like "User X is typing")

### 6.2 Realtime Implementation For PlantUSA

**Use case: Live diagnosis status updates**

When a user submits a plant diagnosis, the status goes: `queued → processing → complete`. The user should see the status update without polling.

```dart
// Flutter: Subscribe to diagnosis changes
final subscription = supabase
    .channel('diagnosis-updates')
    .onPostgresChanges(
        event: PostgresChangeEvent.update,
        schema: 'public',
        table: 'diagnoses',
        filter: PostgresChangeFilter(
            type: PostgresChangeFilterType.eq,
            column: 'user_id',
            value: currentUserId,
        ),
        callback: (payload) {
            final updatedDiagnosis = Diagnosis.fromJson(payload.newRecord);
            // Update UI with new status
            setState(() {
                diagnosis = updatedDiagnosis;
            });
        },
    )
    .subscribe();
```

**What happens on the backend:**
```typescript
// NestJS processes the diagnosis and updates status
// The UPDATE triggers a PostgreSQL change event
// Supabase Realtime captures it and pushes to subscribed clients

async processDiagnosis(diagnosisId: string): Promise<void> {
    // Update status to 'processing'
    await this.supabase
        .from('diagnoses')
        .update({ status: 'processing', updated_at: new Date().toISOString() })
        .eq('id', diagnosisId);
    // ↑ This UPDATE triggers Realtime push to the user's Flutter app

    // ... run AI analysis ...

    // Update status to 'complete'
    await this.supabase
        .from('diagnoses')
        .update({ status: 'complete', updated_at: new Date().toISOString() })
        .eq('id', diagnosisId);
    // ↑ Another Realtime push — user sees "Complete"
}
```

**Realtime setup (SQL):**
```sql
-- Enable replication on the table
ALTER PUBLICATION supabase_realtime ADD TABLE diagnoses;

-- Or enable for all tables (set in Supabase dashboard)
```

### 6.3 Realtime Design Principles

1. **Filter on the server, not the client.** Use `PostgresChangeFilter` to subscribe only to relevant rows (e.g., `user_id = currentUserId`). Without filters, the client receives EVERY change on the table — a privacy leak and bandwidth waste.

2. **Realtime is not for everything.** A dashboard showing aggregate analytics doesn't need real-time — it changes slowly and the cost of real-time sync outweighs the benefit. Use real-time for: status changes, new messages, live tracking — things where seconds matter.

3. **Handle reconnection.** WebSockets disconnect. Your subscription code should handle reconnection gracefully. Supabase Realtime automatically reconnects, but your UI should handle the gap (show "connecting..." state, refetch data on reconnect).

4. **Realtime + RLS still applies.** RLS policies apply to Realtime subscriptions. If a user shouldn't see a row, they won't receive changes for it. Verify this.

5. **Throttle rapid changes.** If a backend process updates a row 10 times in 100ms, the client receives 10 events — but only the last one matters. Consider debouncing on the client.

### 6.4 When Realtime Is Useful vs Overkill

| Use Realtime | Don't Use Realtime |
|---|---|
| Diagnosis status changes (queued → processing → complete) | Analytics dashboard (aggregates change slowly) |
| New notification arrival | User profile updates (edit form is manual) |
| Collaborative features (shared care plans) | Historical data browsing |
| Live chat/support within the app | Settings changes (only the user changes them) |
| Location tracking (CarPool-style) | Static reference data (plant species list) |

---

## Part 7: The Supabase-NestJS Boundary

This is THE senior interview question. If you can't draw this line clearly, you sound like you don't understand architectural boundaries.

### 7.1 What Goes Where

| Concern | Supabase | NestJS | Why |
|---|---|---|---|
| **Auth (sign-up, login, sessions, password reset)** | ✅ | ❌ | Solved problem. Supabase Auth is production-grade. Building custom auth = 2-3 weeks of undifferentiated work. |
| **Database (PostgreSQL)** | ✅ | ✅ | Both connect to the SAME database. Supabase for direct queries with RLS. NestJS for complex queries with service_role. |
| **Storage (file uploads, image serving)** | ✅ | ❌ | S3-compatible storage with built-in RLS. No reason to build custom file handling. |
| **Realtime (status updates, live feeds)** | ✅ | ❌ | PostgreSQL logical replication is complex to self-host. Supabase provides it as a service. |
| **Row-Level Security** | ✅ | ❌ | RLS is a PostgreSQL feature. Supabase makes it accessible. NestJS doesn't replace it — it adds another security layer. |
| **Simple webhooks (Stripe, email notifications)** | ✅ | ❌ | Edge Functions handle these with minimal latency and zero server management. |
| **Complex business logic (multi-step AI pipeline)** | ❌ | ✅ | Orchestration, retries, queuing, and state machines need a persistent backend. Edge Functions have execution time limits and cold starts. |
| **Background jobs (scheduled tasks, cleanup)** | ❌ | ✅ | Supabase has pg_cron but not a proper job queue. NestJS + Bull + Redis is the right tool for reliable background processing. |
| **Admin API (analytics, bulk operations, audit)** | ❌ | ✅ | Admin operations need custom auth, complex queries, CSV exports, rate limiting — things you build in NestJS, not Supabase. |
| **AI pipeline orchestration** | ❌ | ✅ | Multi-step AI flows with retries, fallbacks, and cost tracking need a full backend. Edge Functions can't hold connections for 30-second OpenAI calls reliably. |
| **Third-party integrations (complex)** | ❌ | ✅ | Long-running integrations, OAuth token refresh, webhook verification — NestJS handles these with proper error handling and observability. |

### 7.2 The Shared Database Pattern

**This is the key insight:** Supabase and NestJS share ONE PostgreSQL database. There is no "Supabase database" and "NestJS database." They are the same.

```
┌─────────────────────────────────┐
│         PostgreSQL              │
│  (same database, same schema)   │
└───────────┬─────────────────────┘
            │
    ┌───────┴───────┐
    │               │
┌───┴───┐     ┌────┴─────┐
│Flutter│     │ NestJS   │
│(JWT + │     │(service_ │
│ RLS)  │     │ role)    │
└───────┘     └──────────┘
```

**Consequences of this pattern:**
- Schema changes (migrations) apply to both — you run migrations once, and both Supabase and NestJS see the new schema
- NestJS can read data written by Flutter (via Supabase) and vice versa
- RLS policies apply to Flutter queries but NOT to NestJS queries (service_role bypasses RLS)
- There is no data synchronization problem — there's only one source of truth

### 7.3 When Outgrow Supabase-Only Architecture

Signs you need NestJS alongside Supabase:

1. **Complex state machines.** If your business logic involves 5+ steps with conditional branching, retries, and rollback — you need a backend, not edge functions.

2. **Background job processing.** Supabase has `pg_cron` for scheduled SQL and `pg_net` for HTTP requests, but neither is a proper job queue with retries, dead letter queues, and monitoring. When you need reliable async processing, bring in NestJS + Bull + Redis.

3. **Heavy API composition.** If a single operation needs to call 3+ external APIs, transform results, handle partial failures, and write results to the database transactionally — you need NestJS.

4. **Admin functionality.** Admin dashboards need aggregation queries, CSV/PDF exports, bulk operations, impersonation, and audit trails. These are API-layer concerns that NestJS handles naturally.

5. **Observability requirements.** Structured logging, distributed tracing, metrics aggregation, and alerting — Supabase provides basic logs, but serious observability needs a backend with OpenTelemetry, Winston/Pino, and monitoring integrations.

**What you DON'T need to leave Supabase for:**
- Auth (Supabase Auth scales to millions)
- File storage (S3 underneath, handles any volume)
- Real-time (designed for high-throughput WebSocket connections)
- Database (it's just PostgreSQL — scales as well as your schema design and indexing allow)

---

## Part 8: Supabase Edge Functions

### 8.1 What They Are

Supabase Edge Functions run on Deno, deployed globally, and execute close to users. Think of them as AWS Lambda functions that are tightly integrated with your Supabase project.

**Good for:**
- Stripe webhook handlers
- Simple email sending (via Resend or SendGrid)
- Database-triggered side effects (send notification when diagnosis completes)
- Lightweight API endpoints (public health check, simple data transformation)
- OpenAI API calls that are fire-and-forget (no retry logic needed)

**Bad for:**
- Long-running operations (execution time limits)
- Complex orchestration (no persistent state between invocations)
- Heavy dependencies (limited bundle size, Deno compatibility issues)
- Connection-intensive operations (cold starts kill persistent connections)
- Anything requiring retry logic with backoff (use Bull/BullMQ in NestJS)

### 8.2 PlantUSA Edge Function Example

```typescript
// supabase/functions/send-diagnosis-complete-notification/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'https://esm.sh/resend@2.0.0';

serve(async (req) => {
    // Called by database webhook when diagnosis completes
    const { record } = await req.json(); // New diagnosis record

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const resend = new Resend(Deno.env.get('RESEND_API_KEY')!);

    // Send email notification
    await resend.emails.send({
        from: 'PlantUSA <notifications@plantusa.com>',
        to: record.user_email,
        subject: `Your plant diagnosis is ready`,
        html: `<p>Your diagnosis is complete. <a href="${Deno.env.get('APP_URL')}/diagnoses/${record.id}">View results</a></p>`,
    });

    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
    });
});
```

### 8.3 Edge Function vs NestJS: The Decision Framework

Ask: "Does this operation need to be reliable, observable, and retryable?"

- **Yes → NestJS.** AI diagnosis pipeline, payment processing, multi-step workflows.
- **No → Edge Function.** Simple notifications, webhook transformations, fire-and-forget tasks.

The edge function will occasionally fail due to cold starts, timeouts, or transient errors. If a failed notification email is acceptable (the user can check the app), it's fine for an edge function. If a failed payment webhook means lost revenue, put it in NestJS with proper retry and dead-letter handling.

---

## Part 9: AI Integration — pgvector In Supabase

### 9.1 Why This Matters

Supabase includes pgvector out of the box (PostgreSQL extension). This means your AI search infrastructure is the same database that stores your users, plants, and diagnoses. No separate vector database.

**What this enables for PlantUSA:**
- Plant knowledge semantic search: "how to treat yellow spots on monstera leaves" → retrieves relevant knowledge articles via embedding similarity
- Similar diagnosis matching: find past diagnoses with similar symptoms to suggest treatments
- Plant species recommendations: based on a user's care history and success patterns

### 9.2 pgvector Setup In Supabase

```sql
-- Enable the extension (available by default in Supabase)
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the knowledge table with embedding column
CREATE TABLE plant_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- IVFFlat index (after inserting data)
CREATE INDEX ON plant_knowledge
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);
```

### 9.3 RAG Retrieval In A Supabase-Powered App

```typescript
// NestJS service: Semantic search for plant knowledge
async searchKnowledge(query: string, limit = 5): Promise<KnowledgeResult[]> {
    // 1. Generate embedding for the user's query
    const embeddingResponse = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: query,
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;

    // 2. Search Supabase PostgreSQL with pgvector
    const { data, error } = await this.adminSupabase.rpc(
        'search_plant_knowledge',
        {
            query_embedding: queryEmbedding,
            match_threshold: 0.7,
            match_count: limit,
        }
    );

    if (error) throw error;
    return data;
}
```

**The PostgreSQL function:**
```sql
CREATE OR REPLACE FUNCTION search_plant_knowledge(
    query_embedding vector(1536),
    match_threshold float,
    match_count int
)
RETURNS TABLE (
    id UUID,
    content TEXT,
    metadata JSONB,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        pk.id,
        pk.content,
        pk.metadata,
        1 - (pk.embedding <=> query_embedding) AS similarity
    FROM plant_knowledge pk
    WHERE 1 - (pk.embedding <=> query_embedding) > match_threshold
    ORDER BY similarity DESC
    LIMIT match_count;
END;
$$;
```

### 9.4 The Competitive Advantage

In interviews, most candidates say "I use Pinecone for vector search." Your answer is: "I use pgvector in Supabase — same PostgreSQL database as my relational data. One query can join user data with semantic search results. No separate infrastructure to manage, no data sync problems."

This is a genuine differentiator. It shows you understand:
- Infrastructure simplicity (fewer moving parts)
- Query power (SQL joins with vector results)
- Operational pragmatism (why manage two databases when one works?)

---

## Part 10: Product-Thinking Interpretation

### What A Product Engineer Thinks About That A Pure Developer Misses

| Pure Developer Focus | Product Engineer Focus |
|---|---|
| "I'll set up Supabase Auth." | "Auth UX matters: social login reduces sign-up friction, email confirmation prevents spam accounts, passwordless magic links increase conversion from trial to sign-up. Supabase supports all of these. I'll start with email/password + Google OAuth — covers 90% of users. I'll add Apple Sign-In for iOS users when we launch the App Store version." |
| "I'll enable RLS on all tables." | "RLS is critical but I need to consider: what happens when a user deletes their account? The diagnosis records should be anonymized or deleted based on our data retention policy. RLS policies need to account for this. I also need to ensure my RLS policies are tested — a misplaced policy can expose user data silently." |
| "I'll use Supabase for everything." | "Supabase for auth, storage, realtime, and direct database access from Flutter. NestJS for the AI pipeline, admin analytics, and background jobs. Same PostgreSQL database under both. This gives me speed where it matters and control where it's needed." |
| "Supabase Realtime is cool." | "Realtime subscriptions impact the user's data plan and battery. I only subscribe to changes the user needs NOW — diagnosis status, new notifications. I don't subscribe to aggregate analytics or historical data. I also handle reconnection gracefully — showing a 'Reconnecting...' banner, not a broken screen." |
| "I use the Supabase client directly from Flutter." | "Direct database access from the client is powerful but requires RLS on EVERY table the client touches. For PlantUSA, the Flutter app accesses: plants, diagnoses, diagnosis_results, care_plans via Supabase client with RLS. The admin dashboard uses a separate NestJS API with service_role because admin queries involve aggregations, joins across many tables, and data that shouldn't be accessible via RLS alone." |

### How To Explain Supabase To A Non-Technical Stakeholder

Instead of: "Supabase is our backend-as-a-service."

Say: "Supabase handles the building blocks that every app needs but don't make our product special — user accounts and login, file uploads for plant photos, and live updates so users see their diagnosis results appear in real time. It's built on top of a powerful database that we fully control, so we're not locked into it. For the parts that ARE special to our product — the AI that analyzes plant problems and generates treatment plans — we built a custom backend that connects to the same database. This approach saved us weeks of building login and file upload systems from scratch, which we invested into making the AI diagnosis better."

Instead of: "We use RLS for security."

Say: "Every time a user opens their plant collection or diagnosis history, the database automatically filters to show only their data. Even if someone modified the app to try to see another user's information, the database would block it. This protection is built into the data layer, not just the app screens — think of it as each user's data being in a lockbox that only their account key can open."

---

## Part 11: Interview Questions & Strong Model Answers

### 1. "When would you choose Supabase over NestJS, and vice versa?"

**Strong answer:**
> "They're not alternatives — they serve different layers. I use Supabase for managed infrastructure: auth, file storage, realtime subscriptions, and as my hosted PostgreSQL. I use NestJS for custom business logic that exceeds what BaaS and edge functions can handle cleanly. For PlantUSA, Supabase runs auth (email/password + Google OAuth), stores plant photos, and pushes real-time diagnosis status updates. NestJS runs the AI diagnosis pipeline — calling OpenAI, managing retries, tracking token usage, updating multiple tables atomically — and the admin analytics backend. They share the same PostgreSQL database. The Flutter app talks to Supabase directly for user-scoped queries with RLS protection, and to NestJS for diagnosis submission and complex operations. The boundary is: undifferentiated infrastructure goes to Supabase; product-specific logic goes to NestJS."

### 2. "How do you secure data in a Supabase application?"

**Strong answer:**
> "I use Row-Level Security as the primary data access control, enforced at the PostgreSQL level — not just in application middleware. Every user-facing table has RLS enabled with policies that bind access to `auth.uid() = user_id`. For example, on the diagnoses table: SELECT, INSERT, UPDATE, and DELETE policies all check that the authenticated user's ID matches the record's `user_id`. The Flutter app uses the Supabase client with the user's JWT, so all queries are automatically scoped to that user by RLS. Admin operations use a separate NestJS backend with the service_role key that bypasses RLS — but that backend has its own authentication middleware and role-based authorization. I also separate public and authenticated access: the `anon` key can only sign up or log in; it cannot read any user data. I disable RLS during development? No — I design policies from day one. A policy that's missing is a data leak waiting to happen."

### 3. "Walk me through your Supabase auth flow."

**Strong answer:**
> "User signs up with email and password through the Flutter app using `supabase.auth.signUp()`. This creates a record in `auth.users` and triggers a PostgreSQL function that inserts a corresponding row into `public.users` with the same UUID, email, and a default role of 'user'. If email confirmation is enabled, the user receives a confirmation email; if not, a session is returned immediately. On sign-in, a JWT is issued and stored securely on the device. The Flutter app includes this JWT in all subsequent requests. Every database query through the Supabase client automatically includes this JWT, and RLS policies use `auth.uid()` to scope results to the authenticated user. Session refresh happens automatically — the Supabase client handles token refresh transparently. On sign-out, the session is destroyed and the app clears local state. I also have a `handle_new_user` trigger that sets up the user's default preferences and creates a welcome notification in the database."

### 4. "When do you outgrow a Supabase-only architecture?"

**Strong answer:**
> "You outgrow Supabase-only when your business logic becomes too complex for edge functions and direct database access. Specific triggers for PlantUSA: the AI diagnosis pipeline needs to call OpenAI with retry logic, update multiple tables atomically, handle failures with rollback, track cost per diagnosis, and send push notifications — all as one orchestrated workflow. Edge functions have execution time limits and no persistent state management, making them wrong for this. Background job processing is another trigger — when you need reliable scheduled tasks with retries and dead letter queues, you need Bull/BullMQ in NestJS, not just `pg_cron`. Admin functionality that requires complex aggregation queries, CSV exports, and bulk operations also benefits from a proper API layer. But the key insight: you don't leave Supabase. You ADD NestJS alongside it, sharing the same PostgreSQL database. Supabase still runs auth, storage, and realtime. NestJS adds the orchestration layer where it's needed."

### 5. "Explain Row-Level Security to me. How do you test it?"

**Strong answer:**
> "Row-Level Security is a PostgreSQL feature that Supabase makes accessible. After enabling RLS on a table and adding policies, the database itself enforces access control on every query. For the diagnoses table, I have a SELECT policy: `CREATE POLICY "Users can view own diagnoses" ON diagnoses FOR SELECT USING (auth.uid() = user_id)`. This means even if someone crafts a raw SQL query without a WHERE clause, PostgreSQL filters the results to only their rows — it's not application-level filtering, it's database-enforced. I test policies by impersonating different roles: `SET LOCAL role authenticated; SET LOCAL request.jwt.claim.sub TO 'test-user-uuid'; SELECT * FROM diagnoses;` — and verifying only that user's rows return. I also test as the anon role to ensure no data leaks. I test edge cases: can a user UPDATE a diagnosis that belongs to another user by modifying the request body? The WITH CHECK clause on the UPDATE policy prevents this — the database rejects the write even if the application sends a wrong `user_id`. The critical test: if I REMOVE all application-level filtering and just run `SELECT * FROM diagnoses`, do I still only see the right data? If yes, RLS is working."

### 6. "How do you handle real-time features in Supabase?"

**Strong answer:**
> "I use Supabase Realtime for features where latency actually matters to the user experience. In PlantUSA, the key real-time feature is diagnosis status updates: when a user submits a diagnosis, the status goes from 'queued' to 'processing' to 'complete' over 15-30 seconds. Without real-time, the user would need to poll or manually refresh. I subscribe to PostgreSQL changes on the `diagnoses` table, filtered by `user_id = currentUserId`, so the client only receives updates for their own diagnoses. On the backend, NestJS processes the diagnosis and updates the status — each UPDATE triggers a PostgreSQL change event that Supabase Realtime pushes to the subscribed Flutter client. I handle reconnection by listening to the WebSocket state and showing a 'Reconnecting...' indicator when the connection drops. I DON'T use real-time for things like analytics dashboards or plant collection browsing — those change slowly and polling or manual refresh is sufficient. Realtime is for latency-sensitive, user-visible state changes, not for everything that updates."

### 7. "How do you manage database migrations in a Supabase project?"

**Strong answer:**
> "Migrations are managed through code, not through the Supabase dashboard. I use the Supabase CLI for local development — `supabase init`, `supabase start` — which gives me a local PostgreSQL instance that mirrors production. Schema changes are written as migration files (SQL or using Prisma with Supabase as the database provider). Migration files are committed to git alongside application code. Before applying to production, I test migrations against a local database seeded with production-like data volumes — a migration that's instant on 100 rows might lock a table with 100K rows. I run `supabase db push` for development and use a proper migration tool for production deployments. For rollback: every migration has a corresponding down migration where possible. Destructive migrations (dropping columns, changing types) get extra scrutiny and are tested against a production backup. Supabase's point-in-time recovery is my safety net, but I don't rely on it — I verify migrations before they touch production."

### 8. "How do you combine Supabase and a custom NestJS backend?"

**Strong answer:**
> "They connect to the same PostgreSQL database — that's the key. The NestJS backend uses the `service_role` key via the Supabase client or a direct PostgreSQL connection (Prisma/Pg). This gives it full database access, bypassing RLS. The Flutter app uses the Supabase client with the user's JWT, which enforces RLS. So: user-scoped operations (view plants, view diagnoses, upload photos) go through Flutter → Supabase with RLS. Complex operations (submit diagnosis for AI processing, admin analytics) go through Flutter → NestJS → service_role. The NestJS backend also handles the async AI pipeline: it reads the queued diagnosis from PostgreSQL, calls OpenAI, writes results back, and updates the diagnosis status — all through the same database. There's no data synchronization between Supabase and NestJS because there's only one database. This is the pattern I'd recommend for any product that starts with Supabase for speed and adds NestJS as business logic grows more complex."

---

## Part 12: Practical Exercises

### Exercise 1: Build The Complete Auth Flow

**Context:** Set up a Supabase project with full auth, user profiles, and RLS.

**What to do:**
- Create a new Supabase project
- Set up email/password auth in the dashboard
- Create `public.users` table with `id`, `email`, `full_name`, `role`, timestamps
- Create the `handle_new_user` trigger function
- Test: sign up a user via the Supabase client and verify the `public.users` row is created automatically
- Enable RLS on `public.users` with SELECT and UPDATE policies
- Test as anon: verify you cannot read `public.users`
- Test as authenticated: verify you can only read your own row
- Test: try to update another user's profile — it should fail

**Product Engineer focus:** This is the foundation of every Supabase product. Master this flow until you can set it up from memory.

### Exercise 2: Implement RLS For PlantUSA's Core Tables

**Context:** Create the diagnoses table with full RLS coverage.

**What to do:**
- Create `diagnoses` table with: id, plant_id (FK), user_id (FK), status, images, notes, timestamps
- Enable RLS
- Write policies for: SELECT (own), INSERT (own), UPDATE (own + only queued status), DELETE (own + only queued)
- Insert test data for multiple users
- Test each policy by impersonating different users
- Test edge cases: UPDATE with wrong user_id in the body, DELETE of a non-existent diagnosis, INSERT with another user's ID
- Write the admin bypass policy (using role check)

**Product Engineer focus:** This IS the interview question on RLS. Do the exercise, test every policy, and be ready to explain each policy's purpose and the failure mode it prevents.

### Exercise 3: Set Up A Realtime Subscription For Diagnosis Status

**Context:** Build the live diagnosis status update feature.

**What to do:**
- Enable replication on the `diagnoses` table
- In a Flutter app (or simple test script), subscribe to UPDATE events on `diagnoses` filtered by `user_id`
- Write a script that updates a diagnosis status from 'queued' to 'processing' to 'complete'
- Verify the subscriber receives each status change
- Test: disconnect the WebSocket and verify reconnection behavior
- Test: subscribe without the filter and verify you see ALL changes (privacy concern demonstration)

**Product Engineer focus:** Real-time is a powerful feature but must be implemented with proper filtering. This exercise proves you understand both the capability and the security implications.

### Exercise 4: Build A RAG Search Endpoint With pgvector

**Context:** Set up the plant knowledge base with semantic search.

**What to do:**
- Enable the `vector` extension in your Supabase project
- Create the `plant_knowledge` table with `embedding vector(1536)`
- Insert 10+ plant care articles with real content about plant diseases
- Generate embeddings using OpenAI's `text-embedding-3-small` and store them
- Create the IVFFlat index
- Write the `search_plant_knowledge` PostgreSQL function
- Test the search with queries like "brown spots on leaves," "yellowing plant," "how often to water succulents"
- Build a NestJS endpoint that accepts a search query, generates the embedding, calls the RPC function, and returns results

**Product Engineer focus:** This ties together Supabase + PostgreSQL + pgvector + NestJS + OpenAI. Being able to explain this pipeline end-to-end is a senior-level differentiator in interviews.

### Exercise 5: Design The Supabase-NestJS Boundary

**Context:** For PlantUSA, decide exactly which operations use Supabase directly and which go through NestJS.

**What to do:**
- List every operation in PlantUSA: sign up, login, add plant, upload plant photo, submit diagnosis, view diagnoses, view diagnosis results, edit profile, admin analytics, AI processing, notification sending, care plan management
- For each operation, decide: Supabase directly (Flutter client + RLS) or NestJS API (with service_role)
- Write the justification for each decision (2-3 sentences)
- Identify operations that could START in Supabase and MIGRATE to NestJS as the product grows
- Draw the architecture diagram showing data flow between Flutter, Supabase, NestJS, and PostgreSQL

**Product Engineer focus:** This is the architectural reasoning that interviewers want to hear. Not "I use Supabase for everything" or "I build everything custom" — but a thoughtful boundary based on product needs.

---

## Part 13: Self-Test Questions

If you cannot answer these without notes, your Supabase understanding is shallow.

1. What are the four main services Supabase provides on top of PostgreSQL? Give a PlantUSA use case for each.
2. Explain Row-Level Security in your own words. How does it differ from application-level authorization?
3. Walk through what happens when a user signs up — from the `signUp()` call to the `public.users` row being created.
4. When would you use Supabase Edge Functions vs NestJS for backend logic? Give a specific example of each from PlantUSA.
5. How do Supabase and NestJS share the same PostgreSQL database? What are the implications for schema management?
6. What's the difference between the `anon` key, the authenticated user's JWT, and the `service_role` key? When do you use each?
7. How do you test RLS policies? What queries prove they're working?
8. What is `supabase_realtime` publication and how do you enable it for a table?
9. When would you outgrow a Supabase-only architecture? Name three specific triggers.
10. How does pgvector work within Supabase? How do you create the index and run a similarity search?
11. What's the difference between `USING` and `WITH CHECK` in RLS policies?
12. How do you handle storage security? How do RLS policies on `storage.objects` work?

**"Explain Supabase to a junior developer" prompt:**

> "Supabase is like having a professional database administrator set up your backend infrastructure for you. Instead of building login systems, file storage, and real-time updates from scratch, Supabase provides these as ready-to-use services. Underneath everything is PostgreSQL — the same powerful database that big companies use. The key security concept is called Row-Level Security: every time you query the database, it automatically checks 'does this user own this data?' and filters out anything they shouldn't see. This protection lives in the database itself, not in your app code — so even if someone hacks the app, they can't access other users' data. When you need custom logic that Supabase doesn't handle, you connect a NestJS backend to the SAME database, so everything works together without copying data between systems."

---

## Part 14: Red Flags Interviewers Watch For

1. **"I disable RLS during development."** Fine as a temporary convenience, but if the answer stops there with no explanation of when/how RLS is enabled and tested, it's a red flag. Interviewers want to hear that RLS is part of the design from the start.

2. **No mention of PostgreSQL underneath.** "Supabase handles the database" without acknowledging it's PostgreSQL underneath suggests you don't understand the platform. Senior engineers know they can write raw SQL, create custom indexes, use pgvector, and manage schema directly.

3. **Treating Supabase and NestJS as mutually exclusive.** The strongest answers combine them. "Supabase for auth and storage, NestJS for business logic, same database" shows architectural maturity.

4. **"I use the anon key on the client for everything."** The anon key is for unauthenticated operations (sign-up, login). Authenticated users should use their JWT. Using the anon key for authenticated operations either means RLS isn't being used properly or you don't understand the auth model.

5. **No mention of migration management.** "I use the Supabase dashboard to create tables" is fine for a hackathon. For a production product, migrations must be in version control with up/down scripts.

6. **Vague answers about security.** "Supabase is secure" or "RLS handles it" without concrete policy examples is too shallow. Interviewers want to hear specific policies and what they prevent.

7. **Realtime without filters.** Subscribing to a table without column or row filters means the client receives ALL changes. This is a privacy leak (other users' data) and a bandwidth/performance problem.

8. **Edge functions for everything.** If you suggest edge functions for complex, long-running, or critical-path operations, you haven't hit their limitations yet. Cold starts, execution time limits, and lack of persistent state are real constraints.

---

## Part 15: Connection Map

### How Supabase Connects To Other Topics

| Previous Topic | How Supabase Builds On It |
|---|---|
| **PostgreSQL (7-postgresql)** | Supabase IS hosted PostgreSQL. Every PostgreSQL concept — schemas, indexes, pgvector, RLS, transactions — applies directly. The PostgreSQL study guide is prerequisite knowledge for understanding what Supabase actually does under the hood. |
| **NestJS (6-nestjs)** | NestJS and Supabase connect to the same PostgreSQL database. The Supabase-NestJS boundary is the senior architectural decision. Understand when to use the Supabase client (with JWT + RLS) and when to use NestJS (with service_role + custom auth). |
| **React (4-react)** | Next.js admin dashboards and landing pages can use the Supabase JS client or `@supabase/ssr` for server-side rendering with auth. React components display data that flows through Supabase's PostgreSQL, protected by RLS. |
| **Flutter (10-flutter)** | The Flutter app primarily uses the `supabase-flutter` SDK for direct database access with RLS, auth, storage uploads, and realtime subscriptions. |

| This Topic Prepares You For | Why |
|---|---|
| **Practical AI (9-practical-ai)** | Supabase's pgvector support is the infrastructure for RAG pipelines. Your AI features (semantic search, content recommendations) run on Supabase PostgreSQL. |
| **System Design (13-system-design-prompts)** | Every system design includes database decisions. Supabase vs self-hosted PostgreSQL, Supabase-only vs Supabase+NestJS — these are architecturally significant choices. |
| **Answers From Real Projects (11)** | Your PlantUSA Supabase setup — auth flow, RLS policies, storage structure, realtime subscriptions, pgvector search — is the raw material for interview answers. |
| **Next.js (5-nextjs)** | Next.js apps use `@supabase/ssr` for server-side auth and data fetching. Admin dashboards use NestJS + service_role for complex operations. |

### Recommended Study Order

1. PostgreSQL (7-postgresql) — understand what runs underneath
2. **Supabase (this guide)** — the managed platform on top
3. NestJS (6-nestjs) — the custom backend alongside Supabase
4. Practical AI (9-practical-ai) — pgvector + RAG in Supabase
5. Flutter (10-flutter) — the mobile client consuming Supabase services
6. System Design (13-system-design-prompts) — where Supabase fits in larger architectures

---

## Part 16: The Solo Product Engineer's Supabase Strategy

Supabase is not "the easy option." It's a strategic choice that trades some control for speed — and the control you keep (PostgreSQL, SQL, schema design, indexing) is where your expertise differentiates you.

**What to master (non-negotiable):**
- Auth flow: sign-up, triggers, session management, role systems
- RLS: writing, testing, and explaining policies for every table
- Storage: bucket structure, RLS on storage objects, Flutter upload integration
- Realtime: subscribing with filters, handling reconnection, choosing what to make real-time
- The Supabase-NestJS boundary: when to use each, how they share the database
- pgvector in Supabase: setup, index creation, semantic search queries
- Migrations: Supabase CLI, local development, production deployment

**What to know but not obsess over:**
- Edge Functions internals (Deno-specific APIs, cold start optimization)
- Supabase Studio customization
- Self-hosting Supabase (the open-source version)
- Advanced Realtime features (presence, broadcast beyond basic usage)
- Supabase Branching (preview environments)

**What to skip entirely for now:**
- Deep GoTrue internals
- Custom auth providers beyond what Supabase supports
- Realtime rate limiting and WebSocket scaling (handled by Supabase at your scale)

**Your honest positioning for interviews:**

> "Supabase is my platform for undifferentiated backend infrastructure. I use it for auth, file storage, and realtime because these are solved problems that don't differentiate my product. But I use the PostgreSQL underneath directly — I design schemas, add indexes, write RLS policies, and use pgvector for AI search, all through the Supabase project. For product-specific logic that exceeds BaaS capabilities — like the multi-step AI diagnosis pipeline with retries and cost tracking — I run a NestJS backend connected to the same PostgreSQL database. The Supabase-NestJS boundary is: commodity infrastructure goes to Supabase, differentiating logic goes to NestJS, and they share one source of truth."

---

## Final Standard

You are ready for Supabase interview questions when you can do five things:

1. **Design and explain a complete auth flow** — from sign-up trigger to session refresh to role-based access — with specific SQL for the `handle_new_user` function and RLS policies.
2. **Write and test RLS policies for a multi-table schema** — explaining what each policy prevents, not just what it allows, and how you verify correctness.
3. **Articulate the Supabase-NestJS boundary** — for a given product feature, decide whether it uses Supabase directly, goes through NestJS, or both, and justify why.
4. **Set up a realtime subscription with proper filtering** — demonstrating you understand the security and performance implications of unfiltered subscriptions.
5. **Run a semantic search query with pgvector in Supabase** — showing you can integrate AI retrieval into the same PostgreSQL database as your application data.

That is the bar. Not reciting Supabase feature lists. Not treating it as magic. Understanding what Supabase provides, what PostgreSQL provides underneath, and where a custom backend becomes necessary — that's what separates a Product Engineer from a developer who picked a BaaS and stopped thinking.

---

*"Supabase is a force multiplier, not a replacement for understanding PostgreSQL. The strongest Supabase answers acknowledge what runs underneath and know exactly where the platform's abstractions end and your product-specific engineering begins. That boundary is where senior engineers live."*