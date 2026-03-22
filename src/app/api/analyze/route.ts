import { NextResponse } from "next/server";
import { analyzeArticles } from "@/lib/anthropic";
import { NewsArticle } from "@/lib/types";
import { getConfiguredProviders, ProviderId } from "@/lib/ai-providers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const articles: NewsArticle[] = body.articles || [];
    const topic: string | undefined = body.topic;
    const provider: ProviderId | undefined = body.provider;

    if (articles.length === 0) {
      return NextResponse.json(
        { error: "No articles provided" },
        { status: 400 }
      );
    }

    const configured = getConfiguredProviders();
    if (configured.length === 0) {
      return NextResponse.json(
        {
          error:
            "No AI provider configured. Add ANTHROPIC_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY to .env.local",
        },
        { status: 503 }
      );
    }

    const analysis = await analyzeArticles(articles, topic, provider);

    return NextResponse.json({
      ...analysis,
      source: analysis.provider,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "AI analysis failed.",
      },
      { status: 500 }
    );
  }
}
