import { NextResponse } from "next/server";
import { fetchDiverseGlobalNews } from "@/lib/gdelt";
import { analyzeArticles } from "@/lib/anthropic";

export async function GET() {
  if (
    !process.env.ANTHROPIC_API_KEY ||
    process.env.ANTHROPIC_API_KEY === "your-anthropic-api-key-here"
  ) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured." },
      { status: 503 }
    );
  }

  try {
    // Fetch fresh news and analyze for signals
    const articles = await fetchDiverseGlobalNews(8);

    if (articles.length === 0) {
      return NextResponse.json(
        { error: "No articles available to generate signals." },
        { status: 502 }
      );
    }

    const analysis = await analyzeArticles(articles);

    return NextResponse.json({
      signals: analysis.signals,
      timestamp: analysis.timestamp,
      source: "claude",
    });
  } catch (error) {
    console.error("Signal generation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate signals.",
      },
      { status: 500 }
    );
  }
}
