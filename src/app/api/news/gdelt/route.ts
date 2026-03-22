import { NextResponse } from "next/server";
import { fetchGdeltArticles } from "@/lib/gdelt";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "world news";
  const maxRecords = parseInt(searchParams.get("max") || "20", 10);

  try {
    const articles = await fetchGdeltArticles(query, maxRecords);

    return NextResponse.json({
      articles,
      source: "gdelt",
      count: articles.length,
    });
  } catch {
    return NextResponse.json(
      { articles: [], source: "gdelt", error: "GDELT API unavailable" },
      { status: 502 }
    );
  }
}
