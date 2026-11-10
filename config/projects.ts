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
      next: { label: "Leafwell — AI plant care", href: "/projects/ai-plant-care" },
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
    id: "ai-plant-care",
    companyName: "Leafwell — AI Plant Care",
    type: "Personal",
    category: ["Mobile Dev", "Full Stack", "AI/ML", "Web Dev"],
    shortDescription:
      "Full-lifecycle plant-care product: Flutter mobile app, NestJS + PostgreSQL backend, Next.js admin, and practical AI for diagnosis, care recommendations, and follow-up workflows.",
    websiteLink: "https://javeedishaq.com",
    techStack: [
      "Flutter",
      "Next.js",
      "Typescript",
      "Nest.js",
      "PostgreSQL",
      "Supabase",
      "OpenAI",
    ],
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-01"),
    companyLogoImg: "/projects/ai-plant/logo.jpg",
    pagesInfoArr: [
      {
        title: "Mobile App",
        description:
          "Flutter app with plant diagnosis, care recommendations, and diagnosis history.",
        imgArr: ["/logo.jpg"],
      },
      {
        title: "Admin Panel",
        description:
          "Next.js admin dashboard for managing plant data, diagnoses, and care workflows.",
        imgArr: ["/logo.jpg"],
      },
      {
        title: "AI Backend",
        description:
          "NestJS backend with OpenAI integration for diagnosis support and recommendations.",
        imgArr: ["/logo.jpg"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "Built a plant-care product with a Flutter mobile app, Next.js admin panel, and NestJS backend. The app features AI-powered plant diagnosis, care recommendations, and follow-up workflows.",
        "Integrated OpenAI APIs for diagnosis support, structured outputs for care recommendations, and PostgreSQL with Supabase for data persistence and real-time sync.",
      ],
      bullets: [
        "Built a cross-platform Flutter app with plant diagnosis and care history.",
        "Created a Next.js admin panel for managing plant data and care workflows.",
        "Developed a NestJS backend with OpenAI integration for AI-powered recommendations.",
        "Used PostgreSQL and Supabase for data persistence and real-time sync.",
      ],
    },
  },
  {
    id: "nurselife",
    companyName: "NurseLife",
    type: "Professional",
    category: ["Mobile Dev", "Full Stack"],
    shortDescription:
      "Healthcare-adjacent mobile product with backend-connected features and operational system improvements.",
    techStack: [
      "Flutter",
      "Supabase",
      "PostgreSQL",
      "Dart",
    ],
    startDate: new Date("2023-06-01"),
    endDate: new Date("2023-12-01"),
    companyLogoImg: "/projects/nurselife/logo.png",
    pagesInfoArr: [
      {
        title: "Mobile App",
        description:
          "Flutter app with healthcare workflows, scheduling, and operational features.",
        imgArr: ["/logo.png"],
      },
      {
        title: "Backend",
        description:
          "Supabase backend with PostgreSQL for data management and real-time features.",
        imgArr: ["/logo.png"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "Delivered mobile product workflows and backend-connected features for a healthcare-adjacent application. Improved reliability and usability for production workflows.",
        "Used Flutter for cross-platform mobile delivery and Supabase with PostgreSQL for backend data flows and real-time features.",
      ],
      bullets: [
        "Built a Flutter mobile app with healthcare workflows and scheduling.",
        "Improved reliability and usability for production healthcare-adjacent workflows.",
        "Used Supabase and PostgreSQL for backend data flows and real-time sync.",
      ],
    },
  },
  {
    id: "carpool",
    companyName: "CarPool",
    type: "Professional",
    category: ["Mobile Dev", "Full Stack"],
    shortDescription:
      "Mobile carpooling app with real-time backend connectivity and operational workflows.",
    techStack: [
      "Flutter",
      "REST APIs",
      "Node.js",
      "Dart",
    ],
    startDate: new Date("2022-01-01"),
    endDate: new Date("2022-12-01"),
    companyLogoImg: "/projects/carpool/logo.jpg",
    pagesInfoArr: [
      {
        title: "Mobile App",
        description:
          "Flutter app with ride matching, real-time tracking, and booking workflows.",
        imgArr: ["/logo.jpg"],
      },
      {
        title: "Backend",
        description:
          "REST API backend for ride matching, real-time updates, and operational data.",
        imgArr: ["/logo.jpg"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "Built and shipped mobile features connected to live backend and operational workflows. Contributed to real-time product behavior and delivery-focused system improvements.",
        "The app enables ride matching, real-time tracking, and seamless booking workflows for carpooling users.",
      ],
      bullets: [
        "Built a Flutter app with ride matching and real-time tracking.",
        "Connected to live backend for real-time product behavior.",
        "Improved delivery-focused system workflows.",
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
      "Rental platform mobile app with booking management, payments, and live availability — improved engagement by 30%.",
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
        "Built a rental platform mobile app with booking management, payment integration, and live availability workflows. Improved user engagement by 30% through a more complete booking experience.",
        "The app features real-time rental availability, seamless booking, and secure payment processing for a complete rental experience.",
      ],
      bullets: [
        "Built a rental platform app with booking management and live availability.",
        "Integrated payment gateways for secure rental transactions.",
        "Improved user engagement by 30% with a complete booking experience.",
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
