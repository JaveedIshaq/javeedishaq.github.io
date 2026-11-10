"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { PostCard } from "@/components/blog/post-card";
import type { PostSummary, Topic } from "@/lib/blog-shared";
import { cn } from "@/lib/utils";

interface BlogExplorerProps {
  posts: PostSummary[];
  topics: Topic[];
}

export function BlogExplorer({ posts, topics }: BlogExplorerProps) {
  const [topic, setTopic] = useState<"All" | Topic>("All");
  const [query, setQuery] = useState("");

  const featured = posts.find((p) => p.featured && !p.externalUrl) ?? null;
  const q = query.trim().toLowerCase();
  const showFeatured = featured && topic === "All" && !q;

  const visible = useMemo(
    () =>
      posts.filter(
        (p) =>
          (!showFeatured || p.slug !== featured?.slug) &&
          (topic === "All" || p.topic === topic) &&
          (!q || `${p.title} ${p.description} ${p.tags.join(" ")}`.toLowerCase().includes(q))
      ),
    [posts, topic, q, showFeatured, featured]
  );

  return (
    <>
      <section
        aria-label="Filter articles"
        className="flex flex-wrap items-end justify-between gap-4 pb-2 pt-4"
      >
        <div className="flex flex-wrap gap-2" role="group" aria-label="Topics">
          {(["All", ...topics] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={topic === t}
              onClick={() => setTopic(t)}
              className={cn(
                "min-h-[44px] rounded-full border px-4 text-sm transition-colors",
                topic === t
                  ? "border-primary bg-primary font-semibold text-primary-foreground"
                  : "border-input text-[#C9D1DC] hover:border-muted-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex w-full flex-col gap-1 sm:w-[300px]">
          <label htmlFor="blog-search" className="text-[13px] text-muted-foreground">
            Search articles
          </label>
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="pgvector, BLoC, Claude…"
            className="min-h-[44px] rounded-[10px] border border-input bg-card px-3.5 text-[15px] text-foreground placeholder:text-[#7D8796] focus:border-primary focus:outline-none"
          />
        </div>
      </section>

      {showFeatured && featured && (
        <section className="pt-6">
          <Link
            href={`/blogs/${featured.slug}`}
            className="flex flex-wrap overflow-hidden rounded-[20px] border border-border bg-card transition-colors hover:border-[#3A4454]"
          >
            <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-3.5 p-7 sm:p-9">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                  FEATURED
                </span>
                <span className="font-mono text-xs text-primary">{featured.topic}</span>
              </div>
              <span className="font-heading text-[28px] font-bold leading-[1.15] sm:text-[32px]">
                {featured.title}
              </span>
              <span className="text-base text-[#AEB7C4]">{featured.description}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(featured.date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
                · {featured.readingMinutes} min read
              </span>
            </div>
            {featured.cover && (
              <div className="flex min-w-0 flex-[1_1_380px] items-center border-t border-[#1C222C] bg-[#0D1117] p-7 lg:border-l lg:border-t-0">
                <Image
                  src={featured.cover}
                  alt=""
                  width={1080}
                  height={600}
                  className="block w-full rounded-xl border border-border"
                />
              </div>
            )}
          </Link>
        </section>
      )}

      <section aria-label="Articles" className="pb-10 pt-6">
        {visible.length > 0 ? (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <li key={p.slug} className="flex">
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[#AEB7C4]">No articles match yet. Try another topic.</p>
        )}
      </section>
    </>
  );
}
