import { ValidCategory, ValidExpType, ValidSkills } from "./constants";

interface PagesInfoInterface {
  title: string;
  imgArr: string[];
  description?: string;
}

interface DescriptionDetailsInterface {
  paragraphs: string[];
  bullets: string[];
}

export interface CaseStudy {
  headline: string;
  intro: string;
  status?: string;
  meta: { label: string; value: string }[];
  problem: { title: string; body: string };
  architecture: {
    title: string;
    flow: { name: string; note: string; highlight?: boolean }[];
    pipelines: { label: string; text: string }[];
  };
  decisions: { title: string; why: string }[];
  code?: { file: string; snippet: string };
  next?: { label: string; href: string };
}

export interface ProjectInterface {
  id: string;
  type: ValidExpType;
  companyName: string;
  category: ValidCategory[];
  shortDescription: string;
  websiteLink?: string;
  githubLink?: string;
  techStack: ValidSkills[];
  startDate: Date;
  endDate: Date;
  companyLogoImg: any;
  descriptionDetails: DescriptionDetailsInterface;
  pagesInfoArr: PagesInfoInterface[];
  /** When set, /projects/<id> renders as a full case study. */
  caseStudy?: CaseStudy;
}

export const Projects: ProjectInterface[] = [
  {
    id: "huntkit",
    companyName: "HuntKit — RAG Job-Hunt Assistant",
    type: "Personal",
    category: ["Full Stack", "AI/ML", "Backend", "Web Dev"],
    shortDescription:
      "Live AI job coach: paste a job description and RAG retrieves your real resume and project data to return a match score, strengths/gaps, tailored bullets, and interview questions — with citations, no invented experience.",
    websiteLink: "https://hunt-kit.netlify.app/",
    githubLink: "https://github.com/JaveedIshaq/job-huntkit-workspace",
    techStack: [
      "Nest.js",
      "Typescript",
      "PostgreSQL",
      "Prisma",
      "Next.js",
      "OpenAI",
      "Netlify",
    ],
    startDate: new Date("2026-07-01"),
    endDate: new Date("2026-10-01"),
    companyLogoImg: "/projects/huntkit/screenshot.png",
    caseStudy: {
      headline: "HuntKit: a job coach that grounds every answer in your real experience.",
      intro:
        "Generic AI resume tools invent achievements. I built a RAG system that only uses what you have actually done — and shows its sources.",
      status: "LIVE",
      meta: [
        { label: "Role", value: "Solo — design, backend, web, deploy" },
        { label: "Timeline", value: "Jul – Oct 2026" },
        { label: "Stack", value: "NestJS · Postgres/pgvector · Next.js" },
      ],
      problem: {
        title: "Tailoring a resume for every job is slow — and AI tools make things up.",
        body: "Job seekers paste a description into a chatbot and get confident bullets about projects they never did. I wanted the opposite: answers you can trust because each one points back to a specific part of your own profile.",
      },
      architecture: {
        title: "Two pipelines: ingest once, retrieve per job.",
        flow: [
          { name: "Next.js dashboard", note: "Netlify" },
          { name: "NestJS API", note: "JWT · Render", highlight: true },
          { name: "PostgreSQL + pgvector", note: "Prisma" },
        ],
        pipelines: [
          {
            label: "INGEST",
            text: "Resume + project write-ups → chunk → OpenAI text-embedding-3-small → store vectors",
          },
          {
            label: "ANALYZE",
            text: "Job description → embed → top-8 cosine retrieval → gpt-4o-mini structured output with chunk citations",
          },
        ],
      },
      decisions: [
        {
          title: "pgvector inside Postgres, not a separate vector DB",
          why: "One database for users, jobs and embeddings keeps joins simple, backups in one place and hosting cheap for an MVP.",
        },
        {
          title: "Every chunk goes to the model with its id",
          why: "Retrieved chunks are labelled with their chunk id and source, strengths come back referencing those ids, and the API returns the citations to the dashboard.",
        },
        {
          title: "No evidence, no model call",
          why: "If retrieval finds no profile context, the API records a low_context run and asks the user to add sources instead of letting the model guess.",
        },
        {
          title: "AI-run observability from day one",
          why: "Every analysis logs model, token counts, latency, status and the retrieved chunk ids to an ai_runs table, so bad answers can be debugged instead of guessed at.",
        },
      ],
      code: {
        file: "profile-retrieval.service.ts",
        snippet: `const results = await this.prisma.$queryRaw<RetrievedChunk[]>\`
  SELECT c.id, c.content, ps.title AS source_title,
         1 - (c.embedding <=> \${vectorLiteral}::vector) AS score
  FROM profile_chunks c
  JOIN profile_sources ps ON ps.id = c.profile_source_id
  WHERE c.user_id = \${userId}::uuid AND ps.status = 'ready'
  ORDER BY c.embedding <=> \${vectorLiteral}::vector
  LIMIT \${limit}
\`;`,
      },
      next: { label: "plantUSA — RAG plant identifier", href: "/projects/plantusa" },
    },
    pagesInfoArr: [
      {
        title: "Landing & Dashboard",
        description:
          "Next.js dashboard: add your profile, save jobs, track them through the pipeline, and run AI match analysis.",
        imgArr: ["/projects/huntkit/screenshot.png"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "HuntKit is a solo full-stack MVP that grounds every job-match suggestion in your real experience. Paste a job description and a RAG pipeline retrieves the most relevant resume and project chunks, then returns a match score, strengths and gaps, tailored resume bullets, likely interview questions, and citations to the exact profile parts it used.",
        "Built as a Turborepo monorepo with a NestJS + PostgreSQL/pgvector API (deployed on Render) and a Next.js dashboard (deployed on Netlify).",
      ],
      bullets: [
        "NestJS JWT authentication and user profiles.",
        "Profile ingest pipeline: chunking and OpenAI embeddings stored in PostgreSQL with pgvector.",
        "pgvector cosine-similarity retrieval feeding structured OpenAI outputs with citations.",
        "Job pipeline tracking from saved to offer, plus AI run observability.",
        "Prisma data layer and Next.js dashboard; deployed on Netlify + Render.",
      ],
    },
  },
  {
    id: "plantusa",
    companyName: "plantUSA — AI Plant Identifier",
    type: "Professional",
    category: ["Mobile Dev", "AI/ML", "Full Stack"],
    shortDescription:
      "Live on the App Store and Google Play: snap a plant photo and get species details and a disease diagnosis. I built a RAG detection path on Gemini embeddings and pgvector that cut identification from ~8 s to ~300 ms.",
    websiteLink: "https://theplantusa.com",
    techStack: ["Flutter", "Gemini", "pgvector", "Supabase", "PostgreSQL", "Dart"],
    startDate: new Date("2025-01-01"),
    endDate: new Date("2026-06-01"),
    companyLogoImg: "/projects/plantusa/cover.png",
    caseStudy: {
      headline: "plantUSA: plant identification in ~300 ms instead of ~8 s.",
      intro:
        "Sending every photo to a large vision model was slow and expensive. I moved identification onto a retrieval path: a short Gemini description, a vector search over our own plant catalog, and a quick verification step.",
      status: "LIVE · App Store & Google Play",
      meta: [
        { label: "Role", value: "Freelance AI engineer — mobile, data, AI pipeline" },
        { label: "Result", value: "~8 s → ~300 ms identification" },
        { label: "Stack", value: "Flutter · Supabase · pgvector · Gemini" },
      ],
      problem: {
        title: "Full-model detection took ~8 seconds per photo — too slow for a camera app.",
        body: "Users point the camera at a plant and expect an answer right away. The original flow asked a vision model to produce the full plant profile from scratch every time: slow, costly per call, and free to describe plants that are not in our catalog.",
      },
      architecture: {
        title: "Describe, embed, retrieve, verify — then read from our own database.",
        flow: [
          { name: "Flutter app", note: "compress to 512px" },
          { name: "Gemini", note: "name + embedding", highlight: true },
          { name: "Supabase Postgres", note: "pgvector · match_plants" },
        ],
        pipelines: [
          {
            label: "DETECT",
            text: "Photo → Gemini returns common + scientific name → gemini-embedding-001 (768-dim) → match_plants top-5 by cosine distance → Gemini picks the best of the 5 → full record from the plants table",
          },
          {
            label: "BACKFILL",
            text: "Admin tool embeds every catalog plant and disease and stores vectors in Postgres; match_diseases serves the diagnosis side",
          },
        ],
      },
      decisions: [
        {
          title: "Retrieve from our catalog instead of generating answers",
          why: "Results always come from curated plant records, so the app never shows a species we have no care data for.",
        },
        {
          title: "Verify against 5 candidates, not 1",
          why: "The nearest vector is not always right. A short second Gemini call picks from the top 5 by number, which is cheap and fixes most near-misses.",
        },
        {
          title: "Strict timeouts and a fallback path",
          why: "Each step has a timeout. If the RAG path fails or the catalog is not embedded yet, the app falls back to full model detection instead of showing an error.",
        },
        {
          title: "Strict JSON for diagnosis",
          why: "Health status, disease name and confidence level come back as structured JSON, so the Flutter UI renders them without parsing free text.",
        },
      ],
      code: {
        file: "match_plants.sql",
        snippet: `CREATE OR REPLACE FUNCTION public.match_plants(
  query_embedding vector(768),
  match_count integer DEFAULT 5
) RETURNS TABLE (id uuid, common_name text, similarity double precision)
LANGUAGE sql STABLE AS $$
  SELECT id, common_name,
         1 - (embedding <=> query_embedding) AS similarity
  FROM public.plants
  WHERE embedding IS NOT NULL
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;`,
      },
      next: { label: "HuntKit — RAG job coach", href: "/projects/huntkit" },
    },
    pagesInfoArr: [],
    descriptionDetails: {
      paragraphs: [
        "plantUSA is a Flutter + Supabase app, live on the App Store and Google Play, that turns a plant photo into species details and a disease diagnosis.",
      ],
      bullets: [
        "RAG detection path on Gemini embeddings and pgvector: ~8 s → ~300 ms.",
        "Strict JSON diagnosis: health status, disease name, confidence level.",
        "Admin tool to backfill catalog embeddings.",
      ],
    },
  },
  {
    id: "nurselife",
    companyName: "NurseLife — AI Document Verification",
    type: "Professional",
    category: ["AI/ML", "Backend", "Full Stack"],
    shortDescription:
      "Healthcare staffing platform at Crunch Africa. I built AI verification of nurse certifications with Gemini, strict JSON validation, a human-in-the-loop review flow and per-call AI logging.",
    techStack: ["Gemini", "Supabase", "Typescript", "PostgreSQL", "Flutter"],
    startDate: new Date("2024-12-01"),
    endDate: new Date("2026-11-01"),
    companyLogoImg: "/projects/nurselife/logo.png",
    pagesInfoArr: [],
    descriptionDetails: {
      paragraphs: [
        "NurseLife staff upload certifications and documents that admins must check before a nurse can work. I built an AI step that does the first pass, while keeping the final decision with a person.",
        "A Supabase Edge Function (TypeScript/Deno) sends each uploaded document to Gemini and validates a strict JSON result: extracted fields, readability, a 0–1 confidence score, issues and a draft approve/reject note. Work runs through a cron-drained job queue.",
      ],
      bullets: [
        "The AI never approves or rejects. Admins accept, edit or dismiss each suggestion, and every action is stored as a quality signal.",
        "The manual review path keeps working if the AI fails.",
        "Every AI call is logged (model, prompt/completion tokens, latency, status) and shown in an admin AI Runs dashboard.",
        "Wrote a cost report estimating document-verification AI spend at current volume.",
      ],
    },
  },
  {
    id: "carpool",
    companyName: "CarPool — Guardrailed AI Vehicle Lookup",
    type: "Professional",
    category: ["AI/ML", "Backend", "Mobile Dev"],
    shortDescription:
      "Carpooling app at Crunch Africa. I built and hardened a Gemini feature in the Spring Boot API that returns car configurations as structured JSON, behind input validation, rate limits and plausibility checks.",
    techStack: ["Gemini", "Spring Boot", "Java", "Flutter", "AWS"],
    startDate: new Date("2020-03-01"),
    endDate: new Date("2026-11-01"),
    companyLogoImg: "/projects/carpool/logo.jpg",
    pagesInfoArr: [],
    descriptionDetails: {
      paragraphs: [
        "CarPool calculates ride credits from vehicle data, so a wrong CO₂ figure has a real cost. I built the AI vehicle lookup to be useful without being trusted blindly.",
        "Earlier, as Senior Apps Developer, I built CarPool's real-time tracking and live sync in Flutter.",
      ],
      bullets: [
        "Gemini returns car configurations as structured JSON.",
        "Input validation against prompt injection and per-user rate limits.",
        "AI-generated rows are stored as unverified with a source tag; a plausibility range stops a made-up CO₂ figure from driving ride credits.",
        "Production hardening: admin-only AI endpoints, rate limits behind CloudFront, nightly and pre-deploy database backups to S3, Google Play submission.",
      ],
    },
  },
  {
    id: "sabroso-pakistan",
    companyName: "Sabroso Pakistan App",
    type: "Professional",
    category: ["Mobile Dev", "Full Stack", "UI/UX"],
    shortDescription:
      "High-volume food ordering and delivery app for a major restaurant brand with payment and checkout workflows.",
    techStack: [
      "Flutter",
      "REST APIs",
      "Node.js",
      "Dart",
    ],
    startDate: new Date("2021-01-01"),
    endDate: new Date("2021-12-01"),
    companyLogoImg: "/projects/sabroso/logo.png",
    pagesInfoArr: [
      {
        title: "Ordering Flow",
        description:
          "Customer-facing ordering flows with menu browsing, cart, and checkout.",
        imgArr: ["/logo.png"],
      },
      {
        title: "Payments",
        description:
          "Transaction handling and payment gateway integration for smooth checkout.",
        imgArr: ["/logo.png"],
      },
      {
        title: "Delivery",
        description:
          "Backend-connected delivery workflows focused on reliability.",
        imgArr: ["/logo.png"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "Developed a high-volume food ordering and delivery application for a major restaurant brand using Flutter. Built customer-facing ordering flows, transaction handling, and backend-connected delivery workflows.",
        "Focused on reliability and smooth checkout experience with integrated payment gateways and real-time order tracking.",
      ],
      bullets: [
        "Built a high-volume food ordering app with Flutter for a major restaurant brand.",
        "Implemented customer-facing ordering flows, cart, and checkout.",
        "Integrated payment gateways for smooth transaction handling.",
        "Connected to backend delivery workflows for order fulfillment.",
      ],
    },
  },
  {
    id: "breadex",
    companyName: "BaridX: Shipping & Delivery",
    type: "Professional",
    category: ["Mobile Dev", "Full Stack", "UI/UX"],
    shortDescription:
      "Grocery and retail mobile app with inventory-aware ordering, payments, and real-time order tracking.",
    techStack: [
      "Flutter",
      "REST APIs",
      "Node.js",
      "Dart",
    ],
    startDate: new Date("2020-06-01"),
    endDate: new Date("2020-12-01"),
    companyLogoImg: "/projects/baridx/logo.png",
    pagesInfoArr: [
      {
        title: "Shopping",
        description:
          "Inventory-aware product browsing, cart, and ordering workflows.",
        imgArr: ["/logo.png"],
      },
      {
        title: "Payments",
        description:
          "Payment gateway integration for secure checkout.",
        imgArr: ["/logo.png"],
      },
      {
        title: "Tracking",
        description:
          "Real-time order tracking for a smoother fulfillment experience.",
        imgArr: ["/logo.png"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "Engineered the customer-facing grocery and retail mobile app using Flutter. Integrated inventory-aware ordering, payment workflows, and real-time order tracking.",
        "Supported a smoother purchasing and fulfillment experience with reliable backend connectivity and payment processing.",
      ],
      bullets: [
        "Built a grocery and retail mobile app with Flutter.",
        "Integrated inventory-aware ordering and payment workflows.",
        "Added real-time order tracking for fulfillment visibility.",
        "Connected to backend for reliable order processing.",
      ],
    },
  },
  {
    id: "mulavip-rentals",
    companyName: "Mulavip Rentals App",
    type: "Professional",
    category: ["Mobile Dev", "Full Stack", "UI/UX"],
    shortDescription:
      "Rental platform mobile app with booking management, payments, and live availability.",
    techStack: [
      "Flutter",
      "REST APIs",
      "Node.js",
      "Dart",
    ],
    startDate: new Date("2019-06-01"),
    endDate: new Date("2019-12-01"),
    companyLogoImg: "/projects/mulavip/logo.png",
    pagesInfoArr: [
      {
        title: "Booking",
        description:
          "Rental booking management with live availability and scheduling.",
        imgArr: ["/logo.png"],
      },
      {
        title: "Payments",
        description:
          "Payment gateway integration for secure rental transactions.",
        imgArr: ["/logo.png"],
      },
      {
        title: "Availability",
        description:
          "Real-time availability workflows for rental items.",
        imgArr: ["/logo.png"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "Built a rental platform mobile app with booking management, payment integration, and live availability workflows.",
        "The app features real-time rental availability, seamless booking, and secure payment processing for a complete rental experience.",
      ],
      bullets: [
        "Built a rental platform app with booking management and live availability.",
        "Integrated payment gateways for secure rental transactions.",
        "Added real-time rental availability for better user experience.",
      ],
    },
  },
  {
    id: "nft-membership",
    companyName: "NFT Membership App",
    type: "Professional",
    category: ["Mobile Dev", "Full Stack"],
    shortDescription:
      "Flutter membership app with BLOC pattern, secure transactions, and 10,000+ users — 4.8-star Play Store rating.",
    techStack: [
      "Flutter",
      "Dart",
      "BLOC",
      "REST APIs",
      "Node.js",
    ],
    startDate: new Date("2018-06-01"),
    endDate: new Date("2018-12-01"),
    companyLogoImg: "/projects/nft-membership/logo.png",
    pagesInfoArr: [
      {
        title: "Membership",
        description:
          "Membership workflows with tier management and benefits.",
        imgArr: ["/logo.png"],
      },
      {
        title: "Transactions",
        description:
          "Secure transaction flows for membership purchases and renewals.",
        imgArr: ["/logo.png"],
      },
      {
        title: "State Management",
        description:
          "BLOC pattern for scalable state management across the app.",
        imgArr: ["/logo.png"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "Developed a Flutter membership application using the BLOC pattern for scalable state management and secure transaction flows. Supported 10,000+ users and achieved a 4.8-star Play Store rating.",
        "The app features reliable membership management, secure transactions, and a smooth user experience that earned high user ratings.",
      ],
      bullets: [
        "Built a Flutter membership app with BLOC pattern for state management.",
        "Implemented secure transaction flows for membership purchases.",
        "Supported 10,000+ users with reliable performance.",
        "Achieved a 4.8-star Play Store rating through quality UX.",
      ],
    },
  },
];

export const featuredProjects = Projects.slice(0, 3);
