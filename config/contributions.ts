export interface contributionsInterface {
  repo: string;
  contibutionDescription: string;
  repoOwner: string;
  link: string;
}

export const contributionsUnsorted: contributionsInterface[] = [
  // Open Source Contributions to Other Projects
  {
    repo: "developer-portfolios",
    contibutionDescription:
      "Added my portfolio to the curated list of developer portfolios. A community resource helping thousands of developers showcase their work.",
    repoOwner: "emmabostian",
    link: "https://github.com/emmabostian/developer-portfolios/pull/1917",
  },
  {
    repo: "curriculum",
    contibutionDescription:
      "Contributed multiple Ruby on Rails and JavaScript learning projects to The Odin Project's open-source curriculum, helping learners worldwide with hands-on exercises.",
    repoOwner: "TheOdinProject",
    link: "https://github.com/TheOdinProject/curriculum/pulls?q=author%3AJaveedIshaq+is%3Amerged",
  },

  // My Open Source Projects
  {
    repo: "ng-dev-folio",
    contibutionDescription:
      "A modern, responsive Software Developer Portfolio built with Angular and Tailwind CSS. Open-source template with 11+ stars helping developers showcase their work.",
    repoOwner: "JaveedIshaq",
    link: "https://github.com/JaveedIshaq/ng-dev-folio",
  },
  {
    repo: "ai-workflow-orchestrator",
    contibutionDescription:
      "Reusable Claude Code skills and agents for e-commerce, analytics, development, and project-specific workflows. Open-source AI tooling for developers.",
    repoOwner: "JaveedIshaq",
    link: "https://github.com/JaveedIshaq/ai-workflow-orchestrator",
  },
  {
    repo: "puter-ai-proxy",
    contibutionDescription:
      "An Anthropic-compatible proxy server that routes API requests through Puter.js to free AI models. Enables Claude Code and other clients to use Puter's free AI infrastructure.",
    repoOwner: "JaveedIshaq",
    link: "https://github.com/JaveedIshaq/puter-ai-proxy",
  },
  {
    repo: "Alchemi-CLI",
    contibutionDescription:
      "AI-driven risk analysis for your terminal via GitHub Copilot CLI. Predict production breaks before they happen with intelligent code analysis.",
    repoOwner: "JaveedIshaq",
    link: "https://github.com/JaveedIshaq/Alchemi-CLI",
  },
  {
    repo: "fitness-tracker-dashboard-development",
    contibutionDescription:
      "A modern fitness tracker dashboard built with React, TypeScript, Tailwind CSS & Recharts featuring activity rings, step charts, calorie tracking, and heart rate zones.",
    repoOwner: "JaveedIshaq",
    link: "https://github.com/JaveedIshaq/fitness-tracker-dashboard-development",
  },
  {
    repo: "springboot-nextjs-websocket-demo",
    contibutionDescription:
      "Full-stack real-time chat application demo using Spring Boot WebSocket backend and Next.js frontend. Open-source reference for WebSocket implementations.",
    repoOwner: "JaveedIshaq",
    link: "https://github.com/JaveedIshaq/springboot-nextjs-websocket-demo",
  },
  {
    repo: "awesome-terminal-commands",
    contibutionDescription:
      "A curated reference for terminal commands and their usage. Helps developers quickly access commands, improve CLI proficiency, and streamline their workflow.",
    repoOwner: "JaveedIshaq",
    link: "https://github.com/JaveedIshaq/awesome-terminal-commands",
  },
  {
    repo: "ai-plant-detection-app",
    contibutionDescription:
      "AI-powered plant detection and identification application. Open-source tool for plant enthusiasts using machine learning for species recognition.",
    repoOwner: "JaveedIshaq",
    link: "https://github.com/JaveedIshaq/ai-plant-detection-app",
  },
  {
    repo: "flutter-multi-language-and-light-dark-theme-with-riverpod-demo",
    contibutionDescription:
      "A Flutter demo app showcasing multi-language localization and light/dark theme switching using Riverpod state management. Open-source learning resource.",
    repoOwner: "JaveedIshaq",
    link: "https://github.com/JaveedIshaq/flutter-multi-language-and-light-dark-theme-with-riverpod-demo",
  },
];

export const featuredContributions: contributionsInterface[] =
  contributionsUnsorted.slice(0, 3);
