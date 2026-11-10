import Link from "next/link";

import { formatPostDate, type PostSummary } from "@/lib/blog-shared";

export function PostCard({ post }: { post: PostSummary }) {
  const body = (
    <>
      <span className="flex items-center justify-between gap-3 font-mono text-xs text-primary">
        {post.topic}
        {post.externalUrl && (
          <span className="text-muted-foreground">dev.to ↗</span>
        )}
      </span>
      <span className="font-heading text-[21px] font-semibold leading-snug text-foreground">
        {post.title}
      </span>
      {post.description && (
        <span className="line-clamp-3 flex-grow text-[15px] text-[#AEB7C4]">
          {post.description}
        </span>
      )}
      <span className="text-[13px] text-muted-foreground">
        {formatPostDate(post.date)} · {post.readingMinutes} min read
      </span>
    </>
  );

  const className =
    "flex h-full w-full flex-col gap-3 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-[#3A4454]";

  return post.externalUrl ? (
    <a href={post.externalUrl} target="_blank" rel="noreferrer" className={className}>
      {body}
    </a>
  ) : (
    <Link href={`/blogs/${post.slug}`} className={className}>
      {body}
    </Link>
  );
}
