import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const posts = await getAllPosts();
  const items = posts
    .map((p) => {
      const link = p.externalUrl ?? `${siteConfig.url}/blogs/${p.slug}`;
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${esc(link)}</link>
      <guid>${esc(link)}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${esc(p.description)}</description>
      <category>${esc(p.topic)}</category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(`${siteConfig.authorName} — Writing`)}</title>
    <link>${siteConfig.url}/blogs</link>
    <description>Notes from shipping products: Flutter, NestJS, Next.js and AI.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
