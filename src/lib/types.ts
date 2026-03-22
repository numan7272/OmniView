export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl?: string;
  source: string;
  country: string;
  countryCode: string;
  language: string;
  journalist?: string;
  publishedAt: string;
  sentiment: number; // -1 to 1
  clusterId?: string;
}

export interface NarrativeCluster {
  id: string;
  label: string;
  summary: string;
  countries: string[]; // country codes
  articles: NewsArticle[];
  sentimentScore: number; // -1 to 1
  keyTopics: string[];
  articleCount: number;
}

export interface Journalist {
  id: string;
  name: string;
  outlet: string;
  country: string;
  countryCode: string;
  neutralityScore: number; // 0-100
  articleCount: number;
  biasHistory: BiasDataPoint[];
  recentArticles: string[];
}

export interface BiasDataPoint {
  date: string;
  score: number;
}

export interface InvestmentSignal {
  id: string;
  asset: string;
  assetType: "stock" | "crypto" | "commodity";
  direction: "buy" | "sell" | "hold";
  confidence: number; // 0-1
  reasoning: string;
  relatedClusters: string[];
  timestamp: string;
  priceChange?: number;
}

export interface CountrySource {
  code: string;
  name: string;
  language: string;
  flagEmoji: string;
  newsOutlets: string[];
}

export interface AnalysisResult {
  clusters: NarrativeCluster[];
  journalists: Journalist[];
  signals: InvestmentSignal[];
  globalSentiment: number;
  timestamp: string;
}

export interface DashboardData {
  articles: NewsArticle[];
  analysis: AnalysisResult | null;
  loading: boolean;
  error: string | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachedArticles?: NewsArticle[];
  timestamp: string;
}

export interface WatchlistItem {
  id: string;
  topic: string;
  addedAt: string;
  lastChecked?: string;
  signalCount: number;
  type: "topic" | "asset";
  assetType?: "stock" | "crypto" | "commodity";
  direction?: "buy" | "sell" | "hold";
  confidence?: number;
}
