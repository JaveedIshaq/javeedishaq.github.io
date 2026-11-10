// Types and helpers safe to use in client components (no Node APIs).

/** A post in the unified list: either written on this site or on dev.to. */
export interface PostSummary {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  tags: string[];
  topic: Topic;
  readingMinutes: number;
  featured: boolean;
  cover: string | null;
  /** Set for dev.to articles: the post lives on another site. */
  externalUrl: string | null;
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface Post extends PostSummary {
  html: string;
  toc: TocItem[];
}

export const TOPICS = ["AI", "Flutter", "Mobile", "Backend", "Web", "Career"] as const;
export type Topic = (typeof TOPICS)[number];

const TOPIC_RULES: [Topic, string[]][] = [
  ["AI", ["ai", "rag", "openai", "llm", "aicoding", "claude", "gemini", "machinelearning", "springai", "pgvector"]],
  ["Flutter", ["flutter", "dart"]],
  ["Mobile", ["android", "ios", "mobile"]],
  ["Backend", ["nestjs", "node", "nodejs", "postgres", "postgresql", "supabase", "springboot", "sprinboot", "api"]],
  ["Web", ["nextjs", "react", "webdev", "typescript", "javascript"]],
];

/** Picks one display topic from a list of free-form tags. */
export function topicFromTags(tags: string[]): Topic {
  const lower = tags.map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, ""));
  for (const [topic, keys] of TOPIC_RULES) {
    if (lower.some((t) => keys.includes(t))) return topic;
  }
  return "Career";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
