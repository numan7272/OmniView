import { NextResponse } from "next/server";
import { fetchDiverseGlobalNews, fetchGdeltArticles } from "@/lib/gdelt";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  try {
    const articles = query
      ? await fetchGdeltArticles(query, 30)
      : await fetchDiverseGlobalNews(10);

    if (articles.length === 0) {
      return NextResponse.json(
        {
          articles: [],
          source: "gdelt",
          error: "No articles found. GDELT may be temporarily unavailable.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      articles,
      source: "gdelt",
      count: articles.length,
    });
  } catch (error) {
    console.error("News fetch error:", error);
    return NextResponse.json(
      {
        articles: [],
        source: "gdelt",
        error: "Failed to fetch news from GDELT.",
      },
      { status: 502 }
    );
  }
}
