import { NextResponse } from "next/server";
import { analyzeArticles } from "@/lib/anthropic";
import { NewsArticle } from "@/lib/types";
import { MOCK_ANALYSIS } from "@/lib/mock-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const articles: NewsArticle[] = body.articles || [];
    const topic: string | undefined = body.topic;

    if (articles.length === 0) {
      return NextResponse.json(
        { error: "No articles provided" },
        { status: 400 }
      );
    }

    if (
      !process.env.ANTHROPIC_API_KEY ||
      process.env.ANTHROPIC_API_KEY === "your-anthropic-api-key-here"
    ) {
      return NextResponse.json({
        ...MOCK_ANALYSIS,
        source: "mock",
        message: "Using mock analysis. Configure ANTHROPIC_API_KEY in .env.local for live AI.",
      });
    }

    const analysis = await analyzeArticles(articles, topic);

    return NextResponse.json({
      ...analysis,
      source: "claude",
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({
      ...MOCK_ANALYSIS,
      source: "mock",
      message: "AI analysis failed - falling back to mock data.",
    });
  }
}
