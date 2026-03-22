import { NextRequest, NextResponse } from "next/server";
import { fetchGdeltArticles } from "@/lib/gdelt";
import { analyzeTrust } from "@/lib/trust-engine";
import { getConfiguredProviders } from "@/lib/ai-providers";
import type { ProviderId } from "@/lib/ai-providers";
import type { NewsArticle } from "@/lib/types";

// Market-relevant search queries for multi-source aggregation
const MARKET_QUERIES = [
  "bitcoin cryptocurrency",
  "ethereum crypto",
  "stock market trading",
  "gold price commodity",
  "oil price energy",
  "federal reserve interest rate",
  "inflation economy",
  "crypto regulation",
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const provider = searchParams.get("provider") as ProviderId | null;

    const configured = getConfiguredProviders();
    if (configured.length === 0) {
      return NextResponse.json(
        { error: "No AI provider configured. Add an API key to .env.local" },
        { status: 500 }
      );
    }

    let articles: NewsArticle[];

    if (query) {
      // Fetch from multiple query variations to get diverse sources
      const variations = [
        query,
        `${query} market`,
        `${query} trading`,
      ];
      const results = await Promise.allSettled(
        variations.map((q) => fetchGdeltArticles(q, 15))
      );
      articles = deduplicateArticles(
        results
          .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === "fulfilled")
          .flatMap((r) => r.value)
      );
    } else {
      // Fetch diverse market news
      const results = await Promise.allSettled(
        MARKET_QUERIES.map((q) => fetchGdeltArticles(q, 8))
      );
      articles = deduplicateArticles(
        results
          .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === "fulfilled")
          .flatMap((r) => r.value)
      );
    }

    if (articles.length === 0) {
      return NextResponse.json(
        { error: "No articles found", events: [], timestamp: new Date().toISOString() },
        { status: 200 }
      );
    }

    // Limit to avoid huge AI prompts — take the most recent, diverse articles
    const limitedArticles = selectDiverseArticles(articles, 30);

    const analysis = await analyzeTrust(limitedArticles, query || undefined, provider || undefined);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Events API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { status: 500 }
    );
  }
}

function deduplicateArticles(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  return articles.filter((a) => {
    // Deduplicate by URL and by normalized title
    const titleKey = a.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
    if (seen.has(a.url) || seen.has(titleKey)) return false;
    seen.add(a.url);
    seen.add(titleKey);
    return true;
  });
}

function selectDiverseArticles(articles: NewsArticle[], limit: number): NewsArticle[] {
  // Prioritize: diverse sources, recent first
  const sorted = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const selected: NewsArticle[] = [];
  const sourceCounts = new Map<string, number>();

  for (const article of sorted) {
    if (selected.length >= limit) break;
    const count = sourceCounts.get(article.source) || 0;
    // Allow max 3 articles per source to ensure diversity
    if (count < 3) {
      selected.push(article);
      sourceCounts.set(article.source, count + 1);
    }
  }

  return selected;
}
