import { NextResponse } from "next/server";
import { fetchDiverseGlobalNews } from "@/lib/gdelt";
import { analyzeArticles } from "@/lib/anthropic";
import { getConfiguredProviders, ProviderId } from "@/lib/ai-providers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider") as ProviderId | null;

  const configured = getConfiguredProviders();
  if (configured.length === 0) {
    return NextResponse.json(
      { error: "No AI provider configured." },
      { status: 503 }
    );
  }

  try {
    const articles = await fetchDiverseGlobalNews(8);

    if (articles.length === 0) {
      return NextResponse.json(
        { error: "No articles available to generate signals." },
        { status: 502 }
      );
    }

    const analysis = await analyzeArticles(articles, undefined, provider ?? undefined);

    return NextResponse.json({
      signals: analysis.signals,
      timestamp: analysis.timestamp,
      source: analysis.provider,
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
