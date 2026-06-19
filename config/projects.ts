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
}

export const Projects: ProjectInterface[] = [
  {
    id: "ai-plant-care",
    companyName: "AI Plant Detection & Care App",
    type: "Professional",
    category: ["Mobile Dev", "Full Stack", "AI/ML", "Web Dev"],
    shortDescription:
      "Plant-care product with mobile app, admin panel, custom backend, diagnosis history, and AI-powered care workflows.",
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
