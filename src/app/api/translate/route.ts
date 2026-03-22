import { NextResponse } from "next/server";
import { callAI, getConfiguredProviders, ProviderId } from "@/lib/ai-providers";

export async function POST(request: Request) {
  const configured = getConfiguredProviders();
  if (configured.length === 0) {
    return NextResponse.json(
      { error: "No AI provider configured." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const titles: string[] = body.titles || [];
    const provider: ProviderId | undefined = body.provider;

    if (titles.length === 0) {
      return NextResponse.json({ translations: [] });
    }

    const prompt = `Translate the following news headlines to English. Return ONLY a JSON array of strings, one translation per headline. Keep them concise. If already in English, return as-is.\n\n${JSON.stringify(titles)}`;

    const result = await callAI(
      "You are a translator. Return only valid JSON arrays. No explanation.",
      [{ role: "user", content: prompt }],
      { maxTokens: 2048, provider }
    );

    const match = result.text.match(/\[[\s\S]*\]/);
    if (!match) {
      return NextResponse.json({ translations: titles });
    }

    const translations = JSON.parse(match[0]);
    return NextResponse.json({ translations });
  } catch {
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
