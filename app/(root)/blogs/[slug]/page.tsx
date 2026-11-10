import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";

import { PostCard } from "@/components/blog/post-card";
import { siteConfig } from "@/config/site";
import { formatPostDate, getAllPosts, getLocalPosts, getPostBySlug } from "@/lib/blog";
import profileImg from "@/public/mydp.jpeg";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// Static export needs at least one path; a placeholder 404s if there are no posts yet.
const PLACEHOLDER = "coming-soon";

export function generateStaticParams() {
  const slugs = getLocalPosts().map((p) => ({ slug: p.slug }));
  return slugs.length ? slugs : [{ slug: PLACEHOLDER }];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const url = `${siteConfig.url}/blogs/${post.slug}`;
  const image = post.cover ? `${siteConfig.url}${post.cover}` : siteConfig.ogImage;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.date,
      authors: [siteConfig.authorName],
      tags: post.tags,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = (await getAllPosts())
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(b.topic === post.topic) - Number(a.topic === post.topic))
    .slice(0, 3);

  const url = `${siteConfig.url}/blogs/${post.slug}`;
  const shareText = encodeURIComponent(post.title);
  const shareUrl = encodeURIComponent(url);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url,
    keywords: post.tags.join(", "),
    author: { "@type": "Person", name: siteConfig.authorName, url: siteConfig.url },
    ...(post.cover && { image: `${siteConfig.url}${post.cover}` }),
  };

  return (
    <>
      <Script
        id="schema-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="pt-8">
        <Link href="/blogs" className="inline-block py-2.5 text-[15px] text-primary">
          ← All articles
        </Link>
      </div>

      <header className="mx-auto flex max-w-[820px] flex-col gap-[18px] pb-8 pt-10">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-lg border border-[#1F3B38] px-2.5 py-0.5 font-mono text-xs text-primary">
            {post.topic}
          </span>
          {post.tags
            .filter((t) => t.toLowerCase() !== post.topic.toLowerCase())
            .slice(0, 3)
            .map((t) => (
              <span
                key={t}
                className="rounded-lg border border-input px-2.5 py-0.5 font-mono text-xs text-[#C9D1DC]"
              >
                {t}
              </span>
            ))}
        </div>
        <h1 className="font-heading text-[34px] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[52px]">
          {post.title}
        </h1>
        {post.description && <p className="text-xl text-[#AEB7C4]">{post.description}</p>}
        <div className="flex items-center gap-3 pt-2">
          <Image src={profileImg} alt="" className="h-11 w-11 rounded-full object-cover" />
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold">{siteConfig.authorName}</span>
            <span className="text-[13px] text-muted-foreground">
              <time dateTime={post.date}>{formatPostDate(post.date)}</time> ·{" "}
              {post.readingMinutes} min read
            </span>
          </div>
        </div>
      </header>

      {post.cover && (
        <div className="mx-auto max-w-[960px] pb-8">
          <Image
            src={post.cover}
            alt=""
            width={1600}
            height={900}
            className="w-full rounded-2xl border border-border"
            priority
          />
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-12 pb-10 pt-2">
        <article className="min-w-0 max-w-[720px] flex-[999_1_640px]">
          <div className="article-body" dangerouslySetInnerHTML={{ __html: post.html }} />

          <div className="mt-12 flex flex-wrap items-center gap-[18px] border-t border-[#1C222C] pt-7">
            <Image
              src={profileImg}
              alt={siteConfig.authorName}
              className="h-[72px] w-[72px] rounded-2xl object-cover"
            />
            <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-1 text-[15px]">
              <span className="font-heading text-lg font-semibold">{siteConfig.authorName}</span>
              <span className="text-[#AEB7C4]">
                Full-stack product engineer — Flutter, Next.js, NestJS and AI. I write about what I
                learn while shipping.
              </span>
              <span className="flex flex-wrap gap-4">
                <Link href="/" className="text-primary">
                  Portfolio
                </Link>
                <Link href="/#contact-h" className="text-primary">
                  Work with me
                </Link>
              </span>
            </div>
          </div>
        </article>

        <aside aria-label="On this page" className="flex min-w-0 max-w-[280px] flex-[1_1_220px] flex-col gap-6">
          {post.toc.length > 0 && (
            <nav aria-label="Table of contents" className="flex flex-col gap-0.5 text-sm">
              <span className="mb-2 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                On this page
              </span>
              {post.toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={
                    item.level === 2
                      ? "border-l-2 border-border py-1.5 pl-3 text-[#AEB7C4] hover:border-primary hover:text-foreground"
                      : "border-l-2 border-border py-1 pl-6 text-[13px] text-muted-foreground hover:border-primary hover:text-foreground"
                  }
                >
                  {item.text}
                </a>
              ))}
            </nav>
          )}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
              Share
            </span>
            <div className="flex flex-wrap gap-2">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-input px-3 py-2.5 text-[13px] text-[#C9D1DC]"
              >
                LinkedIn
              </a>
              <a
                href={`https://x.com/intent/post?text=${shareText}&url=${shareUrl}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-input px-3 py-2.5 text-[13px] text-[#C9D1DC]"
              >
                X
              </a>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="rel-h" className="flex flex-col gap-5 pb-8 pt-8">
          <h2 id="rel-h" className="font-heading text-[26px] font-semibold">
            Keep reading
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
