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
    id: "crunch-africa-2",
    position: "Full Stack Product Engineer",
    company: "Crunch Africa",
    location: "Johannesburg, South Africa",
    startDate: new Date("2024-12-01"),
    endDate: "Present",
    description: [
      "Built and shipped backend services using NestJS, TypeScript, and PostgreSQL for mobile and web product workflows.",
      "Delivered REST APIs, async processing, and operational data flows consumed by Flutter apps and Next.js admin tools.",
      "Integrated practical AI features using OpenAI APIs, structured outputs, retrieval, and pgvector-based search workflows.",
    ],
    achievements: [
      "Improved delivery speed and product capability by creating reusable backend modules and clearer operational workflows.",
      "Shipped AI-powered features including search, summaries, and workflow automation.",
      "Built end-to-end product systems across mobile, backend, and admin tooling.",
    ],
    skills: [
      "Nest.js",
      "Typescript",
      "PostgreSQL",
      "Flutter",
      "Next.js",
      "OpenAI",
      "Node.js",
      "Supabase",
    ],
    companyUrl: "https://crunchafrica.com",
    logo: "/experience/crunch-africa-logo.png",
  },
  {
    id: "hyperhire",
    position: "Senior Flutter Developer",
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
    logo: "/experience/hyperhire-logo.png",
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
    logo: "/experience/crunch-africa-logo.png",
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
    logo: "/experience/gtek-logo.png",
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
    logo: "/experience/eeizo-logo.png",
  },
];
