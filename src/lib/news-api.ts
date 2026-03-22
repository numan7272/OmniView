import { NewsArticle } from "./types";
import { COUNTRIES } from "./countries";

const NEWS_API_BASE = "https://newsapi.org/v2";

interface NewsApiArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string;
  source: { name: string };
  author: string;
  publishedAt: string;
}

export async function fetchTopHeadlines(
  countryCode: string
): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey || apiKey === "your-newsapi-key-here") {
    return [];
  }

  const res = await fetch(
    `${NEWS_API_BASE}/top-headlines?country=${countryCode}&pageSize=5&apiKey=${apiKey}`,
    { next: { revalidate: 300 } }
  );

  if (!res.ok) return [];

  const data = await res.json();
  const country = COUNTRIES.find((c) => c.code === countryCode);

  return (data.articles || []).map(
    (a: NewsApiArticle, i: number): NewsArticle => ({
      id: `newsapi-${countryCode}-${i}-${Date.now()}`,
      title: a.title || "Untitled",
      description: a.description || "",
      content: a.content || a.description || "",
      url: a.url || "#",
      imageUrl: a.urlToImage,
      source: a.source?.name || "Unknown",
      country: country?.name || countryCode,
      countryCode,
      language: country?.language || "en",
      journalist: a.author || undefined,
      publishedAt: a.publishedAt || new Date().toISOString(),
      sentiment: 0,
    })
  );
}

export async function fetchGlobalNews(
  countryCodes: string[] = ["us", "gb", "de", "fr", "jp", "au", "ca", "in", "br", "za"]
): Promise<NewsArticle[]> {
  const results = await Promise.allSettled(
    countryCodes.map((code) => fetchTopHeadlines(code))
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<NewsArticle[]> =>
        r.status === "fulfilled"
    )
    .flatMap((r) => r.value)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}
