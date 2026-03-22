import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { NewsArticle } from "@/lib/types";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

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
}

export async function POST(request: Request) {
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
    const body: ChatRequest = await request.json();
    const { messages, articles } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    // Build context with attached articles
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

    const anthropic = getClient();
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const textBlock = response.content.find((c) => c.type === "text");
    const text = textBlock?.type === "text" ? textBlock.text : "";

    return NextResponse.json({ message: text });
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
