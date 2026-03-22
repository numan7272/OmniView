import Anthropic from "@anthropic-ai/sdk";
import { NewsArticle, AnalysisResult } from "./types";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return client;
}

const SYSTEM_PROMPT = `You are OmniView AI, a global news analysis engine. You analyze news articles from dozens of countries simultaneously and perform three tasks:

1. **Dynamic Narrative Clustering**: Group articles by semantic similarity into clusters. Do NOT use fixed geopolitical blocks (East/West). Instead, find natural groupings based on what narratives countries share. Each cluster should have:
   - A short label
   - A 2-3 sentence summary
   - List of country codes involved
   - Overall sentiment score (-1 to 1)
   - Key topics (3-5 keywords)

2. **Reporter Bias Assessment**: For each journalist mentioned, assess their neutrality on a 0-100 scale based on:
   - Language choices (loaded vs neutral)
   - Source diversity
   - Framing and omissions
   - Historical patterns

3. **Investment Signal Generation**: Based on information asymmetries between clusters, generate actionable investment signals for stocks, crypto, or commodities. Each signal needs:
   - Asset name and type
   - Direction (buy/sell/hold)
   - Confidence (0-1)
   - Reasoning explaining the information asymmetry

Return valid JSON matching this exact structure:
{
  "clusters": [{ "id": string, "label": string, "summary": string, "countries": string[], "articleIds": string[], "sentimentScore": number, "keyTopics": string[] }],
  "journalists": [{ "name": string, "outlet": string, "countryCode": string, "neutralityScore": number }],
  "signals": [{ "asset": string, "assetType": "stock"|"crypto"|"commodity", "direction": "buy"|"sell"|"hold", "confidence": number, "reasoning": string, "relatedClusterIds": string[] }],
  "globalSentiment": number
}`;

export async function analyzeArticles(
  articles: NewsArticle[],
  topic?: string
): Promise<AnalysisResult> {
  const anthropic = getClient();

  const articleSummaries = articles.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    source: a.source,
    country: a.country,
    countryCode: a.countryCode,
    journalist: a.journalist,
    publishedAt: a.publishedAt,
  }));

  const userPrompt = topic
    ? `Analyze these ${articles.length} articles about "${topic}" from multiple countries:\n\n${JSON.stringify(articleSummaries, null, 2)}`
    : `Analyze these ${articles.length} articles from multiple countries:\n\n${JSON.stringify(articleSummaries, null, 2)}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textContent = message.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text response from Claude");
  }

  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in Claude response");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  const clusters = (parsed.clusters || []).map(
    (c: Record<string, unknown>) => ({
      id: c.id as string,
      label: c.label as string,
      summary: c.summary as string,
      countries: c.countries as string[],
      articles: articles.filter((a) =>
        (c.articleIds as string[])?.includes(a.id)
      ),
      sentimentScore: c.sentimentScore as number,
      keyTopics: c.keyTopics as string[],
      articleCount: ((c.articleIds as string[]) || []).length,
    })
  );

  const journalists = (parsed.journalists || []).map(
    (j: Record<string, unknown>) => ({
      id: `j-${(j.name as string).replace(/\s+/g, "-").toLowerCase()}`,
      name: j.name as string,
      outlet: j.outlet as string,
      country:
        articles.find((a) => a.journalist === j.name)?.country ?? "Unknown",
      countryCode: j.countryCode as string,
      neutralityScore: j.neutralityScore as number,
      articleCount: 1,
      biasHistory: [],
      recentArticles: [],
    })
  );

  const signals = (parsed.signals || []).map(
    (s: Record<string, unknown>, i: number) => ({
      id: `sig-${i}`,
      asset: s.asset as string,
      assetType: s.assetType as "stock" | "crypto" | "commodity",
      direction: s.direction as "buy" | "sell" | "hold",
      confidence: s.confidence as number,
      reasoning: s.reasoning as string,
      relatedClusters: s.relatedClusterIds as string[],
      timestamp: new Date().toISOString(),
    })
  );

  return {
    clusters,
    journalists,
    signals,
    globalSentiment: parsed.globalSentiment ?? 0,
    timestamp: new Date().toISOString(),
  };
}
