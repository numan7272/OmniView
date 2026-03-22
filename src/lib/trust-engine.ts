import { NewsArticle, TrustEvent, TrustLabel, TrustScoreBreakdown, TrustAnalysisResult } from "./types";
import { callAI, ProviderId } from "./ai-providers";

const TRUST_SYSTEM_PROMPT = `You are OmniView Trust Engine. Your job is to analyze news articles, identify distinct events, extract factual claims, compare them across sources, and assess reliability.

For a given set of articles, you must:

1. **Event Detection**: Group articles that report on the SAME event or topic. Each event gets a clear title and summary.

2. **Claim Extraction**: From each article, extract the key factual claims (specific numbers, statements, predictions, accusations). Each claim must be a clear, verifiable statement.

3. **Cross-Source Comparison**: Compare claims across different sources:
   - "agrees": Two sources say essentially the same thing
   - "contradicts": Two sources say conflicting things
   - "extends": One source adds information the other doesn't have

4. **Categorization**: Assign each event to: "crypto", "stocks", "commodities", "macro", or "geopolitics"

5. **Asset Relevance**: List which tradable assets (BTC, ETH, SOL, AAPL, gold, oil, etc.) are directly affected.

6. **Sentiment**: Overall sentiment for the event (-1 to 1, where -1 is very bearish and 1 is very bullish for related assets).

7. **Trading Signal** (optional): If the event has clear market implications, provide a buy/sell/hold signal with confidence and reasoning.

Return valid JSON:
{
  "events": [
    {
      "id": "evt-1",
      "title": "Short event title",
      "summary": "2-3 sentence summary of what happened",
      "category": "crypto"|"stocks"|"commodities"|"macro"|"geopolitics",
      "claims": [
        { "text": "The specific claim", "sourceArticleId": "article-id", "source": "outlet name" }
      ],
      "agreements": [
        { "claimA": "claim text", "claimB": "claim text", "sourceA": "source", "sourceB": "source", "relationship": "agrees", "detail": "why they agree" }
      ],
      "contradictions": [
        { "claimA": "claim text", "claimB": "claim text", "sourceA": "source", "sourceB": "source", "relationship": "contradicts", "detail": "what the contradiction is" }
      ],
      "sourceNames": ["source1", "source2"],
      "sentiment": -0.3,
      "relevantAssets": ["BTC", "ETH"],
      "signal": { "asset": "BTC", "assetType": "crypto", "direction": "sell", "confidence": 0.7, "reasoning": "..." } | null
    }
  ]
}

IMPORTANT:
- Extract REAL claims from the article titles/descriptions. Do not invent information.
- Be specific about contradictions — only flag genuine disagreements.
- If articles are too vague to extract claims, still group them but note low confidence.
- Keep it concise. Quality over quantity.`;

function getTrustLabel(score: number): TrustLabel {
  if (score >= 90) return "Hochgradig bestätigt";
  if (score >= 70) return "Gut bestätigt";
  if (score >= 50) return "Teilweise bestätigt";
  if (score >= 30) return "Unsicher";
  return "Kaum bestätigt";
}

function calculateTrustScore(
  sourceCount: number,
  agreementCount: number,
  contradictionCount: number,
  uniqueSources: number,
  avgRecencyMinutes: number
): TrustScoreBreakdown {
  // Source Count: 0-30 points (1 source = 5, 2 = 12, 3 = 18, 5+ = 30)
  const sourcePoints = Math.min(30, sourceCount * 6);

  // Agreement Rate: 0-35 points
  const totalComparisons = agreementCount + contradictionCount;
  const agreementRate = totalComparisons > 0
    ? (agreementCount / totalComparisons) * 35
    : (sourceCount > 1 ? 15 : 5); // If no comparisons but multiple sources, give some credit

  // Source Diversity: 0-20 points (unique outlets vs total sources)
  const diversityRatio = sourceCount > 0 ? uniqueSources / sourceCount : 0;
  const sourceDiversity = Math.round(diversityRatio * 20);

  // Recency: 0-15 points (< 1h = 15, < 6h = 12, < 24h = 8, older = 3)
  let recency = 3;
  if (avgRecencyMinutes < 60) recency = 15;
  else if (avgRecencyMinutes < 360) recency = 12;
  else if (avgRecencyMinutes < 1440) recency = 8;

  const total = Math.round(sourcePoints + agreementRate + sourceDiversity + recency);

  return {
    sourceCount: Math.round(sourcePoints),
    agreementRate: Math.round(agreementRate),
    sourceDiversity,
    recency,
    total: Math.min(100, total),
  };
}

export async function analyzeTrust(
  articles: NewsArticle[],
  query?: string,
  provider?: ProviderId
): Promise<TrustAnalysisResult> {
  const articleData = articles.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    source: a.source,
    url: a.url,
    country: a.country,
    publishedAt: a.publishedAt,
    sentiment: a.sentiment,
  }));

  const userPrompt = query
    ? `Analyze these ${articles.length} articles about "${query}" for trust and cross-source verification:\n\n${JSON.stringify(articleData, null, 2)}`
    : `Analyze these ${articles.length} articles for trust and cross-source verification:\n\n${JSON.stringify(articleData, null, 2)}`;

  const result = await callAI(TRUST_SYSTEM_PROMPT, [{ role: "user", content: userPrompt }], {
    maxTokens: 4096,
    provider,
  });

  const jsonMatch = result.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in AI response");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  const now = Date.now();

  const events: TrustEvent[] = (parsed.events || []).map(
    (evt: Record<string, unknown>, i: number) => {
      const claims = ((evt.claims as Array<Record<string, unknown>>) || []).map(
        (c, ci) => ({
          id: `claim-${i}-${ci}`,
          text: c.text as string,
          sourceArticleId: c.sourceArticleId as string,
          source: c.source as string,
          sourceUrl: articles.find((a) => a.id === c.sourceArticleId)?.url || "",
          publishedAt: articles.find((a) => a.id === c.sourceArticleId)?.publishedAt || new Date().toISOString(),
        })
      );

      const agreements = ((evt.agreements as Array<Record<string, unknown>>) || []).map((c) => ({
        claimA: c.claimA as string,
        claimB: c.claimB as string,
        sourceA: c.sourceA as string,
        sourceB: c.sourceB as string,
        relationship: "agrees" as const,
        detail: c.detail as string,
      }));

      const contradictions = ((evt.contradictions as Array<Record<string, unknown>>) || []).map((c) => ({
        claimA: c.claimA as string,
        claimB: c.claimB as string,
        sourceA: c.sourceA as string,
        sourceB: c.sourceB as string,
        relationship: "contradicts" as const,
        detail: c.detail as string,
      }));

      const sourceNames = (evt.sourceNames as string[]) || [];
      const uniqueSources = new Set(sourceNames).size;

      // Calculate recency from article timestamps
      const eventArticles = articles.filter((a) =>
        claims.some((c: { sourceArticleId: string }) => c.sourceArticleId === a.id)
      );
      const avgRecency = eventArticles.length > 0
        ? eventArticles.reduce((sum, a) => sum + (now - new Date(a.publishedAt).getTime()), 0) / eventArticles.length / 60000
        : 1440; // default 24h if no match

      const trustBreakdown = calculateTrustScore(
        sourceNames.length,
        agreements.length,
        contradictions.length,
        uniqueSources,
        avgRecency
      );

      const sources = sourceNames.map((name) => {
        const article = articles.find((a) => a.source === name);
        return {
          name,
          country: article?.country || "Unknown",
          url: article?.url || "",
          publishedAt: article?.publishedAt || new Date().toISOString(),
        };
      });

      const signal = evt.signal as Record<string, unknown> | null;

      return {
        id: (evt.id as string) || `evt-${i}`,
        title: evt.title as string,
        summary: evt.summary as string,
        category: ((evt.category as string) || "macro") as import("./types").EventCategory,
        claims,
        agreements,
        contradictions,
        sources,
        trustScore: trustBreakdown.total,
        trustLabel: getTrustLabel(trustBreakdown.total),
        trustBreakdown,
        sentiment: (evt.sentiment as number) ?? 0,
        relevantAssets: (evt.relevantAssets as string[]) || [],
        signal: signal
          ? {
              id: `sig-${i}`,
              asset: signal.asset as string,
              assetType: (signal.assetType as "stock" | "crypto" | "commodity") || "crypto",
              direction: (signal.direction as "buy" | "sell" | "hold") || "hold",
              confidence: (signal.confidence as number) || 0.5,
              reasoning: (signal.reasoning as string) || "",
              relatedClusters: [(evt.id as string) || `evt-${i}`],
              timestamp: new Date().toISOString(),
            }
          : undefined,
        timestamp: new Date().toISOString(),
      } satisfies TrustEvent;
    }
  );

  const allSources = new Set(articles.map((a) => a.source));

  return {
    events,
    timestamp: new Date().toISOString(),
    provider: result.provider,
    articleCount: articles.length,
    sourceCount: allSources.size,
  };
}
