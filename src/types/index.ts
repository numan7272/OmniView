export interface NewsArticle {
  id: string;
  title: string;
  titleOriginal: string;
  source: string;
  country: string;
  countryCode: string;
  language: string;
  flag: string;
  timestamp: Date;
  sentiment: "positive" | "negative" | "neutral";
  sentimentScore: number;
  category: string;
  clusterId: string;
  reporter: string;
  reporterBiasScore: number;
  url: string;
  summary: string;
}

export interface NarrativeCluster {
  id: string;
  label: string;
  countries: string[];
  flags: string[];
  narrative: string;
  sentiment: number;
  articleCount: number;
  divergence: number;
  color: string;
}

export interface Reporter {
  id: string;
  name: string;
  outlet: string;
  country: string;
  flag: string;
  neutralityScore: number;
  biasDirection: "left" | "right" | "neutral";
  articleCount: number;
  topics: string[];
  trend: "improving" | "declining" | "stable";
}

export interface InvestmentSignal {
  id: string;
  asset: string;
  assetType: "stock" | "crypto" | "commodity" | "forex";
  ticker: string;
  signal: "strong_buy" | "buy" | "hold" | "sell" | "strong_sell";
  confidence: number;
  priceTarget: number;
  currentPrice: number;
  changePercent: number;
  reasoning: string;
  relatedClusters: string[];
  timeframe: string;
  risk: "low" | "medium" | "high";
}

export interface MarketTicker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  type: "stock" | "crypto" | "commodity" | "forex" | "index";
}
