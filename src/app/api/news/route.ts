import { NextResponse } from "next/server";
import { fetchGlobalNews } from "@/lib/news-api";
import { MOCK_ARTICLES } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countries = searchParams.get("countries")?.split(",") || undefined;

  try {
    const articles = await fetchGlobalNews(countries);

    if (articles.length === 0) {
      return NextResponse.json({
        articles: MOCK_ARTICLES,
        source: "mock",
        message: "Using mock data. Configure NEWS_API_KEY in .env.local for live news.",
      });
    }

    return NextResponse.json({
      articles,
      source: "newsapi",
      count: articles.length,
    });
  } catch {
    return NextResponse.json({
      articles: MOCK_ARTICLES,
      source: "mock",
      message: "API error - falling back to mock data.",
    });
  }
}
