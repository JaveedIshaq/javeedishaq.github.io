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
      description: "Javeed Ishaq — Solo Product Engineer. I ship complete AI-integrated products.",
    },
  },
  skills: {
    title: "Skills",
    description: "Key skills that define my professional identity.",
    metadata: {
      title: "Skills",
      description:
        "Javeed Ishaq's key skills — Flutter, Next.js, NestJS, PostgreSQL, AI.",
    },
  },
  projects: {
    title: "Projects",
    description: "Showcasing impactful products and technical achievements.",
    metadata: {
      title: "Projects",
      description: "Javeed Ishaq's shipped products — mobile, web, and backend.",
    },
  },
  contact: {
    title: "Contact",
    description: "Let's connect and explore collaborations.",
    metadata: {
      title: "Contact",
      description: "Contact Javeed Ishaq — let's build something together.",
    },
  },
  contributions: {
    title: "Contributions",
    description: "Open-source contributions and community involvement.",
    metadata: {
      title: "Contributions",
      description:
        "Javeed Ishaq's open-source contributions and community involvement.",
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
      title: "Blogs",
      description:
        "Javeed Ishaq's blog — thoughts on product engineering, AI, and building in public.",
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
