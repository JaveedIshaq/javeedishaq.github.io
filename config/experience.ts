import { ValidSkills } from "./constants";

export interface ExperienceInterface {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: Date;
  endDate: Date | "Present";
  description: string[];
  achievements: string[];
  skills: ValidSkills[];
  companyUrl?: string;
  logo?: string;
}

export const experiences: ExperienceInterface[] = [
  {
    id: "freelance-ai",
    position: "Freelance AI Product Engineer",
    company: "Self-employed",
    location: "Remote",
    startDate: new Date("2025-01-01"),
    endDate: "Present",
    description: [
      "Shipped plantUSA, an AI plant identifier live on the App Store and Google Play: a RAG detection path on Gemini embeddings and pgvector cut identification from ~8 s to ~300 ms.",
      "Built an AI room visualiser for a fireplace and stove retailer: a deterministic prompt builder and a two-step Gemini pipeline (scene detection, then image generation) render products into a customer's own room photo.",
      "Built Kridaz, a sports venue booking platform on Supabase: atomic slot holds, Postgres exclusion constraints against double-booking, Razorpay webhooks with a reconcile job, and a notification outbox.",
    ],
    achievements: [
      "plantUSA: photo → Gemini description → 768-dimension gemini-embedding-001 vector → pgvector top-5 match → Gemini verification, with fallback to full model detection and strict JSON diagnosis (health status, disease, confidence).",
      "Built an admin tool to backfill embeddings across the plant catalog.",
      "Room visualiser: catalog selections (wall type, parts, fuel, measurements) plus up to 3 reference images build the prompt server-side; generation is rate-limited per IP.",
      "Kridaz: safe payment retries, GST invoices, phone OTP sign-in, and a Next.js admin plus Flutter app on one Supabase backend.",
    ],
    skills: [
      "Gemini",
      "pgvector",
      "Supabase",
      "PostgreSQL",
      "Typescript",
      "Flutter",
      "Next.js",
    ],
  },
  {
    id: "crunch-africa-2",
    position: "Product Engineer (Full Stack)",
    company: "Crunch Africa",
    location: "Johannesburg, South Africa (Remote)",
    startDate: new Date("2024-12-01"),
    endDate: "Present",
    description: [
      "Built AI document verification for NurseLife (healthcare staffing): a Supabase Edge Function sends nurse certifications to Gemini and validates a strict JSON result, processed through a cron-drained job queue.",
      "Built and hardened a Gemini vehicle lookup in CarPool's Spring Boot API that returns car configurations as structured JSON behind input validation, rate limits and plausibility checks.",
      "Logged every AI call (model, tokens, latency, status) and built an admin AI Runs dashboard plus a cost report for document verification.",
    ],
    achievements: [
      "Human in the loop by design: the AI never approves or rejects a document. Admins accept, edit or dismiss each suggestion, every action is stored as a quality signal, and manual review keeps working if the AI fails.",
      "Each verification returns extracted fields, readability, a 0–1 confidence score, issues and a draft approve/reject note.",
      "CarPool guardrails: prompt-injection input validation, per-user rate limits, AI rows stored as unverified with a source tag, and a plausibility range so a made-up CO₂ figure can't drive ride credits.",
      "Prepared CarPool for production: admin-only AI endpoints, rate limits behind CloudFront, nightly and pre-deploy database backups to S3, and a Google Play submission.",
    ],
    skills: [
      "Gemini",
      "Supabase",
      "Typescript",
      "PostgreSQL",
      "Spring Boot",
      "Java",
      "Flutter",
      "AWS",
    ],
    companyUrl: "https://crunchafrica.com",
    logo: "/crunch-logo.jpeg",
  },
  {
    id: "hyperhire",
    position: "Senior Flutter Developer (Full Stack)",
    company: "Hyperhire",
    location: "South Korea",
    startDate: new Date("2023-10-01"),
    endDate: new Date("2024-11-01"),
    description: [
      "Shipped complex Flutter application features for production mobile products used across multiple time zones.",
      "Delivered end-to-end feature work across mobile UI, Supabase-backed data flows, and backend-connected workflows.",
      "Improved real-time sync, screen performance, and reliability in production mobile product flows.",
    ],
    achievements: [
      "Worked closely with product and engineering teams to turn requirements into shipped features faster.",
      "Enhanced real-time sync and screen performance for production mobile apps.",
      "Delivered cross-timezone collaboration on complex Flutter features.",
    ],
    skills: [
      "Flutter",
      "Dart",
      "Supabase",
      "PostgreSQL",
      "BLOC",
      "Riverpod",
      "Clean Architecture",
    ],
    companyUrl: "https://hyperhire.ai",
    logo: "/hyperhire_logo.jpeg",
  },
  {
    id: "crunch-africa-1",
    position: "Senior Apps Developer",
    company: "Crunch Africa",
    location: "Johannesburg, South Africa",
    startDate: new Date("2020-03-01"),
    endDate: new Date("2023-09-01"),
    description: [
      "Built and maintained backend-connected mobile systems for consumer-facing applications.",
      "Delivered APIs and operational workflows that improved responsiveness and system reliability.",
      "Shipped cross-platform product features across app delivery, backend coordination, and release execution.",
    ],
    achievements: [
      "Contributed to real-time and operational product systems used in live production environments.",
      "Improved system responsiveness and reliability through better API design.",
      "Delivered cross-platform features across mobile and backend systems.",
    ],
    skills: [
      "Flutter",
      "Dart",
      "Node.js",
      "REST APIs",
      "PostgreSQL",
      "Git",
      "CI/CD",
    ],
    companyUrl: "https://crunchafrica.com",
    logo: "/crunch-logo.jpeg",
  },
  {
    id: "gtek",
    position: "Full Stack Engineer",
    company: "GTek Solutions",
    location: "Lahore, Pakistan",
    startDate: new Date("2018-11-01"),
    endDate: new Date("2020-02-01"),
    description: [
      "Built full-stack solutions serving mobile and web clients.",
      "Implemented backend data services and REST APIs for production applications.",
      "Delivered mobile implementations integrated with custom backend systems.",
    ],
    achievements: [
      "Shipped production-ready full-stack solutions for mobile and web.",
      "Built custom backend systems with REST APIs for mobile integration.",
    ],
    skills: [
      "Flutter",
      "Node.js",
      "REST APIs",
      "PostgreSQL",
      "Git",
    ],
    companyUrl: "https://gtek.solutions",
    logo: "/gtek-logo.jpeg",
  },
  {
    id: "eeizo",
    position: "Full Stack Engineer",
    company: "EEIZO IT Solutions",
    location: "Sahiwal, Pakistan",
    startDate: new Date("2017-09-01"),
    endDate: new Date("2018-10-01"),
    description: [
      "Developed and maintained cross-platform mobile applications with backend integration.",
      "Worked on API consumption, data flow, and product delivery.",
      "Improved stability and delivery quality in existing systems.",
    ],
    achievements: [
      "Improved stability and delivery quality in existing mobile systems.",
      "Built cross-platform mobile apps with backend integration.",
    ],
    skills: [
      "Flutter",
      "Node.js",
      "REST APIs",
      "Git",
    ],
    companyUrl: "https://eeizo.com",
    logo: "/eeizo.jpeg",
  },
];
