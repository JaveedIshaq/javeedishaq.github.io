export interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  slug: string;
  cover_image: string | null;
  published_at: string;
  tag_list: string[];
  reading_time_minutes: number;
}

export async function getDevToArticles(username: string): Promise<DevToArticle[]> {
  const res = await fetch(`https://dev.to/api/articles?username=${username}&per_page=100`, {
    next: { revalidate: 3600 }, // revalidate every hour
  });

  if (!res.ok) {
    console.error("Failed to fetch dev.to articles:", res.status, res.statusText);
    return [];
  }

  const articles: DevToArticle[] = await res.json();
  return articles;
}
