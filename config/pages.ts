import { ValidPages } from "./constants";

type PagesConfig = {
  [key in ValidPages]: {
    title: string;
    description: string;
    metadata: {
      title: string;
      description: string;
    };
    // featuredDescription: string;
  };
};

export const pagesConfig: PagesConfig = {
  home: {
    title: "Home",
    description: "Welcome to my portfolio website.",
    metadata: {
      title: "Home",
      description: "Javeed Ishaq — Product Engineer. I build mobile and web products end-to-end with Flutter, Next.js, NestJS, and AI.",
    },
  },
  skills: {
    title: "Skills",
    description: "Key skills that define my professional identity.",
    metadata: {
      title: "Tech Stack",
      description:
        "The tools Javeed Ishaq uses in production: Flutter, Dart, Next.js, React, NestJS, Node.js, PostgreSQL, Supabase, OpenAI, RAG and pgvector.",
    },
  },
  projects: {
    title: "Projects",
    description: "Showcasing impactful products and technical achievements.",
    metadata: {
      title: "Work & Case Studies",
      description: "Products shipped by Javeed Ishaq: HuntKit (a RAG job coach), Leafwell (AI plant care) and Flutter apps used by thousands of real users.",
    },
  },
  contact: {
    title: "Contact",
    description: "Let's connect and explore collaborations.",
    metadata: {
      title: "Contact — Hire a Full-Stack Product Engineer",
      description: "Contact Javeed Ishaq for remote full-stack, Flutter or AI product-engineering work. Book a call or send an email.",
    },
  },
  contributions: {
    title: "Contributions",
    description: "My open-source contributions on GitHub — merged PRs to external projects and my own open-source repositories.",
    metadata: {
      title: "Contributions",
      description:
        "Javeed Ishaq's open-source contributions on GitHub — merged pull requests and personal open-source projects.",
    },
  },
  resume: {
    title: "Resume",
    description: "Javeed Ishaq's resume.",
    metadata: {
      title: "Resume",
      description: "Javeed Ishaq's resume.",
    },
  },
  blogs: {
    title: "Blogs",
    description:
      "Thoughts on product engineering, AI, and building in public.",
    metadata: {
      title: "Writing",
      description:
        "Articles by Javeed Ishaq on Flutter, NestJS, Next.js and building AI features (RAG, pgvector, OpenAI) that hold up in production.",
    },
  },
  experience: {
    title: "Experience",
    description: "Professional journey and career timeline.",
    metadata: {
      title: "Experience",
      description:
        "Javeed Ishaq's professional journey and experience timeline.",
    },
  },
};
