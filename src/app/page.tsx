"use client";

import { useEffect, useState, useCallback } from "react";
import {
  RefreshCw,
  Zap,
  Globe,
  Network,
  TrendingUp,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { NarrativeClusters } from "@/components/dashboard/narrative-clusters";
import { NewsFeed } from "@/components/dashboard/news-feed";
import { ArticleDetail } from "@/components/dashboard/article-detail";
import { MarketTicker } from "@/components/dashboard/market-ticker";
import { SentimentChart } from "@/components/dashboard/sentiment-chart";
import { BiasTracker } from "@/components/bias/bias-tracker";
import { BiasChart } from "@/components/bias/bias-chart";
import { SignalPanel } from "@/components/signals/signal-panel";
import { SentimentGauge } from "@/components/signals/sentiment-gauge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AiChat } from "@/components/chat/ai-chat";
import { Watchlist } from "@/components/watchlist/watchlist";
import { SettingsPanel } from "@/components/settings/settings-panel";
import { useNews } from "@/hooks/use-news";
import { useAnalysis } from "@/hooks/use-analysis";
import { COUNTRIES } from "@/lib/countries";
import { AnalysisResult, NewsArticle } from "@/lib/types";

const EMPTY_ANALYSIS: AnalysisResult = {
  clusters: [],
  journalists: [],
  signals: [],
  globalSentiment: 0,
  timestamp: new Date().toISOString(),
};

export default function Dashboard() {
  const {
    articles,
    loading: newsLoading,
    error: newsError,
    source: newsSource,
  } = useNews();
  const {
    analysis,
    loading: analysisLoading,
    error: analysisError,
    analyze,
    source: analysisSource,
  } = useAnalysis();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [autoAnalyzed, setAutoAnalyzed] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    null
  );

  const currentAnalysis = analysis || EMPTY_ANALYSIS;

  const runAnalysis = useCallback(() => {
    if (articles.length > 0) {
      analyze(articles, undefined, activeProvider ?? undefined);
    }
  }, [articles, analyze, activeProvider]);

  useEffect(() => {
    if (!autoAnalyzed && articles.length > 0 && !analysisLoading) {
      setAutoAnalyzed(true);
      analyze(articles, undefined, activeProvider ?? undefined);
    }
  }, [articles, autoAnalyzed, analysisLoading, analyze, activeProvider]);

  const providerLabel = analysisSource
    ? analysisSource === "anthropic"
      ? "Claude"
      : analysisSource === "openai"
      ? "ChatGPT"
      : analysisSource === "gemini"
      ? "Gemini"
      : analysisSource
    : null;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header
        globalSentiment={currentAnalysis.globalSentiment}
        articleCount={articles.length}
        clusterCount={currentAnalysis.clusters.length}
        dataSource={
          newsSource === "gdelt" ? "live" : "connecting"
        }
      />
      <MarketTicker />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 overflow-hidden">
          {/* ─── DASHBOARD ─── */}
          {activeTab === "dashboard" && (
            <div className="flex h-full">
              {/* Main content area */}
              <div
                className={`flex-1 grid grid-cols-12 grid-rows-[auto_1fr_1fr] gap-px bg-zinc-800 ${
                  selectedArticle ? "hidden lg:grid" : ""
                }`}
              >
                {/* Top Stats Bar */}
                <div className="col-span-12 bg-[#0a0a0f] px-4 py-3">
                  <div className="flex items-center gap-4">
                    <SentimentGauge
                      value={currentAnalysis.globalSentiment}
                      size="sm"
                    />

                    <div className="flex flex-1 flex-wrap items-center gap-3">
                      <StatCard
                        icon={Globe}
                        label="Laender"
                        value={COUNTRIES.length.toString()}
                        color="text-blue-400"
                      />
                      <StatCard
                        icon={Network}
                        label="Cluster"
                        value={currentAnalysis.clusters.length.toString()}
                        color="text-purple-400"
                      />
                      <StatCard
                        icon={TrendingUp}
                        label="Signale"
                        value={currentAnalysis.signals.length.toString()}
                        color="text-emerald-400"
                      />
                      <StatCard
                        icon={BarChart3}
                        label="Journalisten"
                        value={currentAnalysis.journalists.length.toString()}
                        color="text-cyan-400"
                      />

                      <div className="flex items-center gap-1.5 ml-auto">
                        <Badge variant="outline" className="text-[10px]">
                          {newsLoading
                            ? "Laden..."
                            : `GDELT (${articles.length})`}
                        </Badge>
                        <Badge
                          variant={
                            analysisLoading
                              ? "warning"
                              : providerLabel
                              ? "success"
                              : "outline"
                          }
                          className="text-[10px]"
                        >
                          {analysisLoading
                            ? "Analysiert..."
                            : providerLabel
                            ? providerLabel
                            : analysisError
                            ? "Fehler"
                            : "Bereit"}
                        </Badge>
                      </div>

                      <Button
                        onClick={runAnalysis}
                        disabled={analysisLoading || articles.length === 0}
                        size="sm"
                        className="gap-1.5 shrink-0"
                      >
                        {analysisLoading ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Zap className="h-3.5 w-3.5" />
                        )}
                        {analysisLoading ? "Analysiert..." : "KI Analyse"}
                      </Button>
                    </div>
                  </div>

                  {newsError && (
                    <div className="mt-2 flex items-center gap-2 rounded border border-red-900/50 bg-red-950/30 px-3 py-1.5 text-xs text-red-400">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      {newsError}
                    </div>
                  )}
                  {analysisError && (
                    <div className="mt-2 flex items-center gap-2 rounded border border-amber-900/50 bg-amber-950/30 px-3 py-1.5 text-xs text-amber-400">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      {analysisError}
                    </div>
                  )}
                </div>

                {/* Clusters + Sentiment Chart */}
                <div className="col-span-7 row-span-1 overflow-hidden bg-[#0a0a0f]">
                  <NarrativeClusters
                    clusters={currentAnalysis.clusters}
                    loading={analysisLoading}
                  />
                </div>

                {/* News Feed */}
                <div className="col-span-5 row-span-2 overflow-hidden bg-[#0a0a0f]">
                  <NewsFeed
                    articles={articles}
                    loading={newsLoading}
                    onArticleSelect={setSelectedArticle}
                    selectedArticleId={selectedArticle?.id}
                  />
                </div>

                {/* Bottom: Sentiment Chart + Signals */}
                <div className="col-span-7 row-span-1 overflow-hidden bg-[#0a0a0f]">
                  <div className="grid h-full grid-cols-5 gap-px bg-zinc-800">
                    <div className="col-span-2 bg-[#0a0a0f]">
                      <div className="flex h-full flex-col">
                        <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
                          <BarChart3 className="h-4 w-4 text-cyan-400" />
                          <h2 className="text-sm font-semibold">Stimmung</h2>
                        </div>
                        <div className="flex-1 p-2">
                          <SentimentChart
                            clusters={currentAnalysis.clusters}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-span-3 bg-[#0a0a0f]">
                      <SignalPanel
                        signals={currentAnalysis.signals}
                        loading={analysisLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Detail Sidebar */}
              {selectedArticle && (
                <div className="w-80 shrink-0 lg:w-96">
                  <ArticleDetail
                    article={selectedArticle}
                    onClose={() => setSelectedArticle(null)}
                    onAnalyzeInChat={(a) => {
                      setSelectedArticle(null);
                      setActiveTab("chat");
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* ─── CLUSTERS ─── */}
          {activeTab === "clusters" && (
            <div className="h-full overflow-y-auto bg-[#0a0a0f] p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Narrative Cluster</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    KI-erkannte Themengruppen ueber Laendergrenzen hinweg
                  </p>
                </div>
                <Button
                  onClick={runAnalysis}
                  disabled={analysisLoading}
                  size="sm"
                  className="gap-2"
                >
                  {analysisLoading ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Zap className="h-3.5 w-3.5" />
                  )}
                  Neu analysieren
                </Button>
              </div>
              <NarrativeClusters
                clusters={currentAnalysis.clusters}
                loading={analysisLoading}
              />
            </div>
          )}

          {/* ─── BIAS ─── */}
          {activeTab === "bias" && (
            <div className="h-full overflow-y-auto bg-[#0a0a0f]">
              <div className="grid h-full grid-rows-[1fr_300px]">
                <BiasTracker
                  journalists={currentAnalysis.journalists}
                  loading={analysisLoading}
                />
                <div className="border-t border-zinc-800 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-zinc-400">
                    Neutralitaet im Zeitverlauf (Top 4)
                  </h3>
                  <div className="h-[230px]">
                    <BiasChart
                      journalists={currentAnalysis.journalists}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── SIGNALS ─── */}
          {activeTab === "signals" && (
            <div className="h-full overflow-y-auto bg-[#0a0a0f]">
              <SignalPanel
                signals={currentAnalysis.signals}
                loading={analysisLoading}
              />
            </div>
          )}

          {/* ─── CHAT ─── */}
          {activeTab === "chat" && (
            <div className="h-full bg-[#0a0a0f]">
              <AiChat articles={articles} provider={activeProvider} />
            </div>
          )}

          {/* ─── WATCHLIST ─── */}
          {activeTab === "watchlist" && (
            <div className="h-full bg-[#0a0a0f]">
              <Watchlist
                onTopicSelect={() => {
                  setActiveTab("chat");
                }}
              />
            </div>
          )}

          {/* ─── SETTINGS ─── */}
          {activeTab === "settings" && (
            <div className="h-full bg-[#0a0a0f]">
              <SettingsPanel
                activeProvider={activeProvider}
                onProviderChange={setActiveProvider}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-2.5 py-1.5">
      <Icon className={`h-3.5 w-3.5 ${color}`} />
      <span className="font-mono text-sm font-bold">{value}</span>
      <span className="text-[10px] text-zinc-500">{label}</span>
    </div>
  );
}
