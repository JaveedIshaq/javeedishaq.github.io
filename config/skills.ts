import { Icons } from "@/components/common/icons";

// Mirrors the TECHNICAL SKILLS section of the resume, in priority order.
// No self-ratings: each description says where the skill was used in production.
export interface skillsInterface {
  name: string;
  description: string;
  icon: any;
}

export const skills: skillsInterface[] = [
  {
    name: "OpenAI API",
    description:
      "HuntKit: text-embedding-3-small for ingestion and gpt-4o-mini structured output with citations to retrieved chunks.",
    icon: Icons.openai,
  },
  {
    name: "Gemini API",
    description:
      "Text, vision and image generation in production: plantUSA RAG, NurseLife document verification, CarPool lookup, room visualiser.",
    icon: Icons.gemini,
  },
  {
    name: "PostgreSQL + pgvector",
    description:
      "Cosine-similarity search over embeddings next to app data: catalog matching in plantUSA, resume retrieval in HuntKit.",
    icon: Icons.postgresql,
  },
  {
    name: "Supabase",
    description:
      "Postgres, Edge Functions (Deno), auth and storage behind plantUSA, NurseLife and Kridaz.",
    icon: Icons.supabase,
  },
  {
    name: "TypeScript",
    description:
      "Edge Functions, NestJS APIs and Next.js dashboards — the main language across my backend and web work.",
    icon: Icons.typescript,
  },
  {
    name: "NestJS",
    description:
      "HuntKit API: JWT auth, profile ingestion, jobs pipeline, analysis and admin modules in a Turborepo monorepo.",
    icon: Icons.nestjs,
  },
  {
    name: "Node.js",
    description: "Server runtime for REST APIs, background jobs and webhooks.",
    icon: Icons.nodejs,
  },
  {
    name: "Prisma",
    description: "Typed data layer for HuntKit, with raw SQL for pgvector similarity queries.",
    icon: Icons.prisma,
  },
  {
    name: "Next.js",
    description:
      "Admin panels, AI-run dashboards, HuntKit's web app and the room visualiser's public QR web app.",
    icon: Icons.nextjs,
  },
  {
    name: "React",
    description: "Component-driven UIs for dashboards and customer-facing web apps.",
    icon: Icons.react,
  },
  {
    name: "Flutter",
    description:
      "8+ years shipping cross-platform apps, including plantUSA on the App Store and Google Play and a 10k+ user, 4.8★ app.",
    icon: Icons.flutter,
  },
  {
    name: "Dart",
    description: "BLoC and Riverpod state management; 7,275+ Stack Overflow reputation answering Dart and Flutter questions.",
    icon: Icons.dart,
  },
  {
    name: "Git",
    description: "GitHub workflows, Turborepo + pnpm monorepos, deploys to Netlify and Render.",
    icon: Icons.git,
  },
];

export const featuredSkills = skills.slice(0, 6);
