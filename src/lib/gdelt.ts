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
}

export async function fetchGdeltArticles(
  query: string,
  maxRecords: number = 20
): Promise<NewsArticle[]> {
  const params = new URLSearchParams({
    query: query,
    mode: "ArtList",
    maxrecords: maxRecords.toString(),
    format: "json",
    sort: "DateDesc",
  });

  try {
    const res = await fetch(`${GDELT_API}?${params}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const articles = data.articles || [];

    return articles.map(
      (a: GdeltArticle, i: number): NewsArticle => ({
        id: `gdelt-${i}-${Date.now()}`,
        title: a.title || "Untitled",
        description: "",
        content: "",
        url: a.url || "#",
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
        sentiment: a.tone ? a.tone / 10 : 0, // GDELT tone scale normalized
      })
    );
  } catch {
    return [];
  }
}
