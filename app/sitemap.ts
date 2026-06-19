import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default async function sitemap() {
  return [
    { url: siteConfig.url, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${siteConfig.url}/projects`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/experience`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/skills`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${siteConfig.url}/blogs`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${siteConfig.url}/resume`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
  ];
}
