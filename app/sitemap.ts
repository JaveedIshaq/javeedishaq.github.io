import { Projects } from "@/config/projects";
import { siteConfig } from "@/config/site";
import { getLocalPosts } from "@/lib/blog";

export const dynamic = "force-static";

export default async function sitemap() {
  const now = new Date();
  const pages = [
    { url: siteConfig.url, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${siteConfig.url}/projects`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/experience`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/skills`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${siteConfig.url}/blogs`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "monthly" as const, priority: 0.6 },
  ].map((p) => ({ ...p, lastModified: now }));

  const projects = Projects.map((p) => ({
    url: `${siteConfig.url}/projects/${p.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p.caseStudy ? 0.8 : 0.6,
  }));

  const posts = getLocalPosts().map((p) => ({
    url: `${siteConfig.url}/blogs/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...pages, ...projects, ...posts];
}
