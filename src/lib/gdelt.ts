import { NewsArticle } from "./types";

const GDELT_API = "https://api.gdeltproject.org/api/v2/doc/doc";

interface GdeltArticle {
  title: string;
  seendate: string;
  url: string;
  domain: string;
  language: string;
  sourcecountry: string;
  tone: number;
  socialimage?: string;
}

export async function fetchGdeltArticles(
  query: string,
  maxRecords: number = 25
): Promise<NewsArticle[]> {
  const params = new URLSearchParams({
    query: query,
    mode: "ArtList",
    maxrecords: maxRecords.toString(),
    format: "json",
    sort: "DateDesc",
    timespan: "24h",
  });

  const res = await fetch(`${GDELT_API}?${params}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) return [];

  const data = await res.json();
  const articles = data.articles || [];

  return articles.map(
    (a: GdeltArticle, i: number): NewsArticle => ({
      id: `gdelt-${query.replace(/\s+/g, "-").slice(0, 20)}-${i}-${Date.now()}`,
      title: a.title || "Untitled",
      description: a.title || "",
      content: "",
      url: a.url || "#",
      imageUrl: a.socialimage || undefined,
      source: a.domain || "Unknown",
      country: a.sourcecountry || "Unknown",
      countryCode: (a.sourcecountry || "").toLowerCase().slice(0, 2),
      language: a.language || "en",
      publishedAt: a.seendate
        ? new Date(
            a.seendate.replace(
              /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/,
              "$1-$2-$3T$4:$5:$6Z"
            )
          ).toISOString()
        : new Date().toISOString(),
      sentiment: a.tone ? Math.max(-1, Math.min(1, a.tone / 10)) : 0,
    })
  );
}

const GLOBAL_QUERIES = [
  "global economy",
  "geopolitics conflict",
  "technology AI",
  "energy climate",
  "trade sanctions",
  "central bank monetary policy",
  "elections democracy",
  "cryptocurrency digital currency",
];

export async function fetchDiverseGlobalNews(
  maxPerQuery: number = 10
): Promise<NewsArticle[]> {
  const results = await Promise.allSettled(
    GLOBAL_QUERIES.map((q) => fetchGdeltArticles(q, maxPerQuery))
  );

  const allArticles = results
    .filter(
      (r): r is PromiseFulfilledResult<NewsArticle[]> =>
        r.status === "fulfilled"
    )
    .flatMap((r) => r.value);

  // Deduplicate by URL
  const seen = new Set<string>();
  const unique = allArticles.filter((a) => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });

  // Sort by date descending
  return unique.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
