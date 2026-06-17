import { NextResponse } from "next/server";

const REVALIDATE_SECONDS = 60 * 60 * 6; // 6 hours

async function getGitHubRepoStars(repo: string): Promise<number | null> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers,
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const repo = "javeedishaq/javeedishaq.github.io";
  const stars = await getGitHubRepoStars(repo);

  return NextResponse.json({
    repo,
    url: `https://github.com/${repo}`,
    stars,
  });
}
