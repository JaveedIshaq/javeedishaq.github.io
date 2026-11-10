import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { remark } from "remark";
import gfm from "remark-gfm";
import html from "remark-html";
import remarkPrism from "remark-prism";

import {
  slugify,
  topicFromTags,
  TOPICS,
  type Post,
  type PostSummary,
  type TocItem,
} from "@/lib/blog-shared";
import { getDevToArticles } from "@/lib/devto";

export * from "@/lib/blog-shared";

// remark-prism ships typings for an older unified; it works fine at runtime.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prism = remarkPrism as any;

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const DEVTO_USERNAME = "javeedishaq";

function readingMinutes(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function postFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => /\.mdx?$/.test(f) && !f.startsWith("_") && f.toLowerCase() !== "readme.md");
}

function readLocal(file: string) {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const slug = file.replace(/\.mdx?$/, "");
  const tags: string[] = Array.isArray(data.tags) ? data.tags.map(String) : [];
  const summary: PostSummary = {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: new Date(data.date ?? Date.now()).toISOString(),
    tags,
    topic: (TOPICS as readonly string[]).includes(data.topic) ? data.topic : topicFromTags(tags),
    readingMinutes: readingMinutes(content),
    featured: Boolean(data.featured),
    cover: data.cover ? String(data.cover) : null,
    externalUrl: null,
  };
  return { summary, content, draft: Boolean(data.draft) };
}

/** Posts written on this site (content/blog/*.md). Drafts are hidden in production builds. */
export function getLocalPosts(): PostSummary[] {
  const isProd = process.env.NODE_ENV === "production";
  return postFiles()
    .map(readLocal)
    .filter((p) => !(isProd && p.draft))
    .map((p) => p.summary)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Local posts + dev.to articles, newest first. */
export async function getAllPosts(): Promise<PostSummary[]> {
  const local = getLocalPosts();
  const devto = await getDevToArticles(DEVTO_USERNAME);
  const external: PostSummary[] = devto.map((a) => ({
    slug: `devto-${a.id}`,
    title: a.title,
    description: a.description,
    date: new Date(a.published_at).toISOString(),
    tags: a.tag_list,
    topic: topicFromTags(a.tag_list),
    readingMinutes: a.reading_time_minutes,
    featured: false,
    cover: a.cover_image,
    externalUrl: a.url,
  }));
  return [...local, ...external].sort((a, b) => b.date.localeCompare(a.date));
}

function addHeadingIds(htmlIn: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Map<string, number>();
  const out = htmlIn.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_m, lvl: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    let id = slugify(text) || "section";
    const n = used.get(id) ?? 0;
    used.set(id, n + 1);
    if (n) id = `${id}-${n}`;
    toc.push({ id, text, level: Number(lvl) as 2 | 3 });
    return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
  });
  return { html: out, toc };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const file = postFiles().find((f) => f.replace(/\.mdx?$/, "") === slug);
  if (!file) return null;
  const { summary, content } = readLocal(file);
  const processed = await remark()
    .use(gfm)
    .use(prism)
    .use(html, { sanitize: false })
    .process(content);
  const { html: body, toc } = addHeadingIds(String(processed));
  return { ...summary, html: body, toc };
}
