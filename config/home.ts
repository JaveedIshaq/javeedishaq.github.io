// Content for the home page. Numbers come from the resume — keep them in sync.

export const heroStats = [
  { value: "8+ yrs", label: "shipping production products" },
  { value: "4", label: "AI features live in production" },
  { value: "~300 ms", label: "RAG plant ID, down from ~8 s" },
  { value: "7,275+", label: "Stack Overflow reputation" },
];

export const pipeline = [
  { n: "01", title: "Schema", tech: "PostgreSQL · pgvector · Supabase" },
  { n: "02", title: "API", tech: "NestJS · Edge Functions · JWT" },
  { n: "03", title: "Jobs", tech: "Job queues · cron · webhooks" },
  { n: "04", title: "AI", tech: "Gemini · OpenAI · RAG · JSON output" },
  { n: "05", title: "Admin", tech: "Next.js · review & AI-run dashboards" },
  { n: "06", title: "Mobile", tech: "Flutter · BLoC · Riverpod" },
];

/** Production AI features from the resume. `href` only where a detail page exists. */
export const aiFeatures = [
  {
    name: "RAG plant identification",
    where: "plantUSA · App Store & Google Play",
    result: "~8 s → ~300 ms",
    text: "Gemini describes the photo, gemini-embedding-001 makes a 768-dim vector, pgvector returns the closest catalog plants and Gemini verifies the best of 5. Falls back to full model detection.",
    stack: "Flutter · Supabase · pgvector · Gemini",
    href: "/projects/plantusa",
  },
  {
    name: "AI document verification",
    where: "NurseLife · Crunch Africa",
    result: "Human in the loop",
    text: "An Edge Function sends nurse certifications to Gemini and validates strict JSON: fields, readability, 0–1 confidence, issues. Admins accept, edit or dismiss; every AI call is logged with tokens and latency.",
    stack: "Supabase Edge Functions · Gemini · job queue",
    href: "/projects/nurselife",
  },
  {
    name: "Guardrailed vehicle lookup",
    where: "CarPool · Crunch Africa",
    result: "Structured JSON",
    text: "Gemini returns car configurations behind prompt-injection checks and per-user rate limits. AI rows are stored as unverified, and a plausibility range stops a made-up CO₂ figure from driving ride credits.",
    stack: "Spring Boot · Gemini · CloudFront · S3",
    href: "/projects/carpool",
  },
  {
    name: "AI room visualiser",
    where: "Fireplace & stove retailer · live",
    result: "Image generation",
    text: "Customers scan a product QR code, upload a room photo and see the product in their room. A deterministic prompt builder and a two-step Gemini pipeline: scene detection, then generation, rate-limited per IP.",
    stack: "Flutter · Next.js · Supabase · Gemini",
  },
];

export const clientApps = [
  { id: "nft-membership", name: "NFT Membership", what: "10k+ users · 4.8★ Play Store" },
  { id: "sabroso-pakistan", name: "Sabroso Pakistan", what: "Food ordering & delivery" },
  { id: "breadex", name: "BreadEx", what: "Payments · live order tracking" },
  { id: "mulavip-rentals", name: "Mulavip Rentals", what: "Bookings · live availability" },
];

// Mirrors the TECHNICAL SKILLS section of the resume — add nothing that isn't there.
export const skillGroups = [
  {
    title: "AI / LLM",
    items:
      "OpenAI API, Gemini API (text, vision, image generation), RAG pipelines, embeddings, pgvector similarity search, structured JSON output, prompt builders, human-in-the-loop review, guardrails, AI run logging (tokens, latency, cost)",
  },
  {
    title: "Backend",
    items:
      "Node.js, NestJS, TypeScript, Supabase Edge Functions (Deno), REST APIs, JWT auth, Prisma, payment webhooks, job queues + cron",
  },
  { title: "Database", items: "PostgreSQL, pgvector, Supabase, SQL, schema design" },
  { title: "Web", items: "Next.js, React" },
  { title: "Mobile", items: "Flutter, Dart, BLoC, Riverpod" },
  { title: "Tools", items: "Git, GitHub, Turborepo, pnpm, Netlify, Render, Jira, ClickUp" },
];

export const community = [
  { title: "Stack Overflow", text: "Dart & Flutter answers · 7,275+ rep · 5M+ reached" },
  { title: "GDG Live Pakistan", text: "Core team · technical sessions & events" },
  { title: "Remotebase Hackfest", text: "Team lead" },
  { title: "Mentorship", text: "Zena Tamkin · women in technology" },
];
