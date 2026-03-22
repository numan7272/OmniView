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

When articles are attached to the conversation, analyze them in detail. Compare reporting angles across countries. Rate neutrality on a 0-100 scale.

When discussing investments, always clearly state:
- BUY / SELL / WATCH recommendation
- Confidence level (0-100%)
- Time horizon
- Key risks

Be concise and data-driven. Use specific examples from the articles when available. Respond in the same language as the user's message.`;

interface ChatRequest {
  messages: { role: "user" | "assistant"; content: string }[];
  articles?: NewsArticle[];
  provider?: ProviderId;
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
    const { messages, articles, provider } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    let systemPrompt = SYSTEM_PROMPT;
    if (articles && articles.length > 0) {
      const articleContext = articles
        .map(
          (a, i) =>
            `[Article ${i + 1}] "${a.title}" - ${a.source} (${a.country})\nURL: ${a.url}\nSentiment: ${a.sentiment}\nJournalist: ${a.journalist || "Unknown"}\nPublished: ${a.publishedAt}\n${a.description}`
        )
        .join("\n\n");
      systemPrompt += `\n\nThe user has attached the following articles for analysis:\n\n${articleContext}`;
    }

    const result = await callAI(systemPrompt, messages, {
      maxTokens: 2048,
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
