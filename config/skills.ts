import { Icons } from "@/components/common/icons";

export interface skillsInterface {
  name: string;
  description: string;
  rating: number;
  icon: any;
}

export const skillsUnsorted: skillsInterface[] = [
  {
    name: "Flutter",
    description:
      "Build beautiful, natively compiled cross-platform mobile apps from a single codebase.",
    rating: 5,
    icon: Icons.flutter,
  },
  {
    name: "Next.js",
    description:
      "Effortlessly build dynamic apps with routing, layouts, loading UI, and API routes.",
    rating: 5,
    icon: Icons.nextjs,
  },
  {
    name: "Nest.js",
    description:
      "Create scalable and modular applications with a progressive Node.js framework.",
    rating: 5,
    icon: Icons.nestjs,
  },
  {
    name: "PostgreSQL",
    description:
      "Powerful, open-source relational database for robust data-driven applications.",
    rating: 5,
    icon: Icons.postgresql,
  },
  {
    name: "React",
    description:
      "Craft interactive user interfaces using components, state, props, and virtual DOM.",
    rating: 5,
    icon: Icons.react,
  },
  {
    name: "Typescript",
    description:
      "Enhance JavaScript with static types, making code more understandable and reliable.",
    rating: 5,
    icon: Icons.typescript,
  },
  {
    name: "Node.js",
    description:
      "Run JavaScript on the server side, enabling dynamic and responsive applications.",
    rating: 4,
    icon: Icons.nodejs,
  },
  {
    name: "Tailwind CSS",
    description:
      "Design beautiful, modern websites faster with a utility-first CSS framework.",
    rating: 4,
    icon: Icons.tailwindcss,
  },
  {
    name: "Dart",
    description:
      "Optimized language for building fast apps on any platform, powering Flutter.",
    rating: 4,
    icon: Icons.dart,
  },
  {
    name: "GraphQL",
    description:
      "Fetch data precisely with a powerful query language for APIs and runtime execution.",
    rating: 3,
    icon: Icons.graphql,
  },
  {
    name: "Docker",
    description:
      "Containerize applications for consistent deployment across environments.",
    rating: 3,
    icon: Icons.docker,
  },
  {
    name: "AWS",
    description:
      "Utilize Amazon Web Services to build and deploy scalable, reliable, and secure applications.",
    rating: 3,
    icon: Icons.amazonaws,
  },
  {
    name: "Firebase",
    description:
      "Build and run successful apps with Google's mobile platform backend services.",
    rating: 3,
    icon: Icons.firebase,
  },
  {
    name: "Git",
    description:
      "Track changes and collaborate efficiently with distributed version control.",
    rating: 4,
    icon: Icons.git,
  },
];

export const skills = skillsUnsorted
  .slice()
  .sort((a, b) => b.rating - a.rating);

export const featuredSkills = skills.slice(0, 6);
