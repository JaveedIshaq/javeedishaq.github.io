import { Metadata } from "next";
import Script from "next/script";

import { BlogExplorer } from "@/components/blog/blog-explorer";
import { SectionHeading } from "@/components/site/section-heading";
import { pagesConfig } from "@/config/pages";
import { siteConfig } from "@/config/site";
import { getAllPosts, TOPICS } from "@/lib/blog";

export const metadata: Metadata = {
  title: pagesConfig.blogs.metadata.title,
  description: pagesConfig.blogs.metadata.description,
  alternates: {
    canonical: `${siteConfig.url}/blogs`,
    types: { "application/rss+xml": `${siteConfig.url}/feed.xml` },
  },
  openGraph: {
    title: `${pagesConfig.blogs.metadata.title} | ${siteConfig.name}`,
    description: pagesConfig.blogs.metadata.description,
    url: `${siteConfig.url}/blogs`,
    siteName: siteConfig.name,
    type: "website",
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: `${siteConfig.authorName} Blog` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pagesConfig.blogs.metadata.title} | ${siteConfig.name}`,
    description: pagesConfig.blogs.metadata.description,
    images: [siteConfig.ogImage],
    creator: `@${siteConfig.username}`,
  },
};

export default async function BlogsPage() {
  const posts = await getAllPosts();
  const topics = TOPICS.filter((t) => posts.some((p) => p.topic === t));

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteConfig.authorName}'s Blog`,
    description: pagesConfig.blogs.metadata.description,
    url: `${siteConfig.url}/blogs`,
    author: { "@type": "Person", name: siteConfig.authorName, url: siteConfig.url },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      url: p.externalUrl ?? `${siteConfig.url}/blogs/${p.slug}`,
      keywords: p.tags.join(", "),
    })),
  };

  return (
    <>
      <Script
        id="schema-blog"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <section className="flex flex-col gap-4 pb-6 pt-16">
        <SectionHeading as="h1" eyebrow="Writing" title="Notes from shipping products." />
        <p className="max-w-[640px] text-lg text-[#AEB7C4]">
          Practical write-ups on Flutter, NestJS, Next.js and building AI features that hold up
          in production.
        </p>
      </section>

      <BlogExplorer posts={posts} topics={topics} />

      <section aria-labelledby="follow-h" className="pb-8 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[20px] border border-[#1F3B38] bg-[#0E1716] p-7 sm:p-9">
          <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-2">
            <h2 id="follow-h" className="font-heading text-[28px] font-semibold">
              Follow new articles
            </h2>
            <p className="text-[#AEB7C4]">
              Subscribe with any RSS reader, or follow me on dev.to to get new posts in your feed.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/feed.xml"
              className="rounded-[10px] border border-input px-5 py-3 text-[15px] font-medium"
            >
              RSS feed
            </a>
            <a
              href={siteConfig.links.devto}
              target="_blank"
              rel="noreferrer"
              className="rounded-[10px] bg-primary px-5 py-3 text-[15px] font-semibold text-primary-foreground"
            >
              Follow on dev.to
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
