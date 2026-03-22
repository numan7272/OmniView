import { NextResponse } from "next/server";
import { analyzeArticles } from "@/lib/anthropic";
import { NewsArticle } from "@/lib/types";

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
      return NextResponse.json(
        {
          error:
            "ANTHROPIC_API_KEY not configured. Add your API key to .env.local to enable AI analysis.",
        },
        { status: 503 }
      );
    }

    const analysis = await analyzeArticles(articles, topic);

    return NextResponse.json({
      ...analysis,
      source: "claude",
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "AI analysis failed. Check your ANTHROPIC_API_KEY.",
      },
      { status: 500 }
    );
  }
}
