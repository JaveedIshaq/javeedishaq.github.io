import { NextResponse } from "next/server";

const REVALIDATE_SECONDS = 60 * 60 * 6; // 6 hours
const GITHUB_USER = "JaveedIshaq";

interface GitHubRepo {
  stargazers_count: number;
}

async function getAllPublicRepoStars(username: string): Promise<number> {
  let totalStars = 0;
  let page = 1;
  const perPage = 100;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  while (true) {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?type=public&per_page=${perPage}&page=${page}`,
      {
        next: { revalidate: REVALIDATE_SECONDS },
        headers,
      }
    );

    if (!res.ok) break;

    const repos = (await res.json()) as GitHubRepo[];
    if (!Array.isArray(repos) || repos.length === 0) break;

    totalStars += repos.reduce(
      (sum, repo) => sum + (repo.stargazers_count || 0),
      0
    );

    if (repos.length < perPage) break;
    page++;
  }

  return totalStars;
}

export async function GET() {
  const stars = await getAllPublicRepoStars(GITHUB_USER);

  return NextResponse.json({
    user: GITHUB_USER,
    url: `https://github.com/${GITHUB_USER}`,
    stars,
  });
}
