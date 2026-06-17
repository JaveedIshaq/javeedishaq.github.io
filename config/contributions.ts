export interface contributionsInterface {
  repo: string;
  contibutionDescription: string;
  repoOwner: string;
  link: string;
}

export const contributionsUnsorted: contributionsInterface[] = [
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
      "Contributed multiple Ruby on Rails and JavaScript learning projects to The Odin Project's open-source curriculum, helping learners worldwide.",
    repoOwner: "TheOdinProject",
    link: "https://github.com/TheOdinProject/curriculum/pulls?q=author%3AJaveedIshaq+is%3Amerged",
  },
  {
    repo: "30-Days-Of-React",
    contibutionDescription:
      "A step-by-step guide to learn React in 30 days. A learning resource I contributed to and forked for the community.",
    repoOwner: "JaveedIshaq",
    link: "https://github.com/JaveedIshaq/30-Days-Of-React",
  },
  {
    repo: "ai-workflow-orchestrator",
    contibutionDescription:
      "Reusable Claude Code skills and agents for e-commerce, analytics, development, and project-specific workflows. Open-source AI tooling.",
    repoOwner: "JaveedIshaq",
    link: "https://github.com/JaveedIshaq/ai-workflow-orchestrator",
  },
  {
    repo: "ai-photo-enhancer",
    contibutionDescription:
      "AI Photo Enhancer — Image restoration powered by AI. An open-source tool for enhancing photos using artificial intelligence.",
    repoOwner: "JaveedIshaq",
    link: "https://github.com/JaveedIshaq/ai-photo-enhancer",
  },
  {
    repo: "Best-Flutter-UI-Templates",
    contibutionDescription:
      "Completely free Flutter UI templates for everyone. Built with Flutter Dart — open-source design resources for the community.",
    repoOwner: "JaveedIshaq",
    link: "https://github.com/JaveedIshaq/Best-Flutter-UI-Templates",
  },
];

export const featuredContributions: contributionsInterface[] =
  contributionsUnsorted.slice(0, 3);
