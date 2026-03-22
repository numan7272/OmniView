import { NextResponse } from "next/server";
import { NewsArticle } from "@/lib/types";
import { callAI, getConfiguredProviders, ProviderId } from "@/lib/ai-providers";

const SYSTEM_PROMPT = `You are OmniView AI, an expert global news analyst. You help users understand international news coverage, detect bias, and identify investment opportunities.

Your capabilities:
- Analyze articles for neutrality by comparing coverage across different countries
- Detect framing bias, omission bias, and language bias
- Compare how different nations report on the same events
- Provide investment insights based on information asymmetries across global media
- Explain geopolitical context behind news narratives
- When a user shares an article URL or pastes article text, analyze it for:
  1. Neutrality (0-100 scale): Is the article objective or biased?
  2. Manipulation detection: loaded language, omitted context, one-sided sourcing
  3. Cross-country comparison: how would other countries likely report this differently?
  4. Key claims that need verification

When articles are attached, analyze them in detail. Compare reporting angles across countries. Rate neutrality on a 0-100 scale. Identify:
- NEUTRAL: Balanced reporting with multiple perspectives
- BIASED: Clear slant in one direction with evidence
- MANIPULATIVE: Deliberately misleading framing or omissions

When discussing investments, always clearly state:
- BUY / SELL / WATCH recommendation
- Confidence level (0-100%)
- Time horizon
- Key risks

Respond in the same language as the user's message. Be concise and use specific examples.`;

interface ChatRequest {
  messages: { role: "user" | "assistant"; content: string }[];
  articles?: NewsArticle[];
  provider?: ProviderId;
  customArticleUrl?: string;
  customArticleText?: string;
}

export async function POST(request: Request) {
  const configured = getConfiguredProviders();
  if (configured.length === 0) {
    return NextResponse.json(
      { error: "No AI provider configured. Add API keys to .env.local" },
      { status: 503 }
    );
  }

  try {
    const body: ChatRequest = await request.json();
    const { messages, articles, provider, customArticleUrl, customArticleText } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    let systemPrompt = SYSTEM_PROMPT;

    // Add attached articles context
    if (articles && articles.length > 0) {
      const articleContext = articles
        .map(
          (a, i) =>
            `[Article ${i + 1}] "${a.title}" - ${a.source} (${a.country})\nURL: ${a.url}\nSentiment: ${a.sentiment}\nJournalist: ${a.journalist || "Unknown"}\nPublished: ${a.publishedAt}\n${a.description}`
        )
        .join("\n\n");
      systemPrompt += `\n\nThe user has attached the following articles for analysis:\n\n${articleContext}`;
    }

    // Add custom article context
    if (customArticleUrl) {
      systemPrompt += `\n\nThe user has shared a custom article URL for analysis: ${customArticleUrl}`;
      systemPrompt += `\nAnalyze this article for neutrality, bias, and manipulation. Compare how this topic would be covered in other countries. Find contradictions or missing perspectives.`;
    }
    if (customArticleText) {
      systemPrompt += `\n\nThe user has pasted the following article text for analysis:\n\n${customArticleText}`;
      systemPrompt += `\nAnalyze this text for neutrality, bias, and manipulation. Rate objectivity 0-100. Identify loaded language, missing context, and one-sided framing.`;
    }

    const result = await callAI(systemPrompt, messages, {
      maxTokens: 3000,
      provider,
    });

    return NextResponse.json({
      message: result.text,
      provider: result.provider,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Chat request failed.",
      },
      { status: 500 }
    );
  }
}
