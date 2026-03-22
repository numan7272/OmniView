"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCw, Zap, Globe, Network, TrendingUp } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { NarrativeClusters } from "@/components/dashboard/narrative-clusters";
import { NewsFeed } from "@/components/dashboard/news-feed";
import { BiasTracker } from "@/components/bias/bias-tracker";
import { BiasChart } from "@/components/bias/bias-chart";
import { SignalPanel } from "@/components/signals/signal-panel";
import { SentimentGauge } from "@/components/signals/sentiment-gauge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNews } from "@/hooks/use-news";
import { useAnalysis } from "@/hooks/use-analysis";
import { MOCK_ANALYSIS } from "@/lib/mock-data";
import { COUNTRIES } from "@/lib/countries";

export default function Dashboard() {
  const { articles, loading: newsLoading, source: newsSource } = useNews();
  const {
    analysis,
    loading: analysisLoading,
    analyze,
    source: analysisSource,
  } = useAnalysis();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [initialized, setInitialized] = useState(false);

  const currentAnalysis = analysis || MOCK_ANALYSIS;
  const dataSource =
    newsSource === "mock" || analysisSource === "mock" ? "mock" : "live";

  const runAnalysis = useCallback(() => {
    if (articles.length > 0) {
      analyze(articles);
    }
  }, [articles, analyze]);

  useEffect(() => {
    if (!initialized && articles.length > 0 && !analysisLoading) {
      setInitialized(true);
    }
  }, [articles, initialized, analysisLoading]);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header
        globalSentiment={currentAnalysis.globalSentiment}
        articleCount={articles.length}
        clusterCount={currentAnalysis.clusters.length}
        dataSource={dataSource}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-hidden">
          {activeTab === "dashboard" && (
            <div className="grid h-full grid-cols-12 grid-rows-[auto_1fr_1fr] gap-px bg-zinc-800">
              {/* Top Stats Bar */}
              <div className="col-span-12 bg-[#0a0a0f] p-4">
                <div className="flex items-center gap-6">
                  <SentimentGauge
                    value={currentAnalysis.globalSentiment}
                    size="sm"
                  />

                  <div className="flex flex-1 items-center gap-6">
                    <StatCard
                      icon={Globe}
                      label="Countries Monitored"
                      value={COUNTRIES.length.toString()}
                      color="text-blue-400"
                    />
                    <StatCard
                      icon={Network}
                      label="Active Clusters"
                      value={currentAnalysis.clusters.length.toString()}
                      color="text-purple-400"
                    />
                    <StatCard
                      icon={TrendingUp}
                      label="Active Signals"
                      value={currentAnalysis.signals.length.toString()}
                      color="text-emerald-400"
                    />
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        {newsSource === "mock"
                          ? "Demo Data"
                          : `NewsAPI (${articles.length})`}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {analysisSource === "mock" || !analysisSource
                          ? "Mock AI"
                          : "Claude AI"}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    onClick={runAnalysis}
                    disabled={analysisLoading || articles.length === 0}
                    size="sm"
                    className="gap-2"
                  >
                    {analysisLoading ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Zap className="h-3.5 w-3.5" />
                    )}
                    {analysisLoading ? "Analyzing..." : "Run AI Analysis"}
                  </Button>
                </div>
              </div>

              {/* Main Content - Clusters */}
              <div className="col-span-7 row-span-1 overflow-hidden bg-[#0a0a0f]">
                <NarrativeClusters
                  clusters={currentAnalysis.clusters}
                  loading={analysisLoading}
                />
              </div>

              {/* Right - News Feed */}
              <div className="col-span-5 row-span-2 overflow-hidden bg-[#0a0a0f]">
                <NewsFeed articles={articles} loading={newsLoading} />
              </div>

              {/* Bottom Left - Bias + Signals */}
              <div className="col-span-7 row-span-1 overflow-hidden bg-[#0a0a0f]">
                <div className="grid h-full grid-cols-2 gap-px bg-zinc-800">
                  <div className="bg-[#0a0a0f]">
                    <BiasTracker
                      journalists={currentAnalysis.journalists}
                      loading={analysisLoading}
                    />
                  </div>
                  <div className="bg-[#0a0a0f]">
                    <SignalPanel
                      signals={currentAnalysis.signals}
                      loading={analysisLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "clusters" && (
            <div className="h-full overflow-y-auto bg-[#0a0a0f] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Narrative Clusters</h2>
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
                  Re-analyze
                </Button>
              </div>
              <NarrativeClusters
                clusters={currentAnalysis.clusters}
                loading={analysisLoading}
              />
            </div>
          )}

          {activeTab === "bias" && (
            <div className="h-full overflow-y-auto bg-[#0a0a0f]">
              <div className="grid h-full grid-rows-[1fr_300px]">
                <BiasTracker
                  journalists={currentAnalysis.journalists}
                  loading={analysisLoading}
                />
                <div className="border-t border-zinc-800 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-zinc-400">
                    Neutrality Score Trend (Top 4)
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

          {activeTab === "signals" && (
            <div className="h-full overflow-y-auto bg-[#0a0a0f]">
              <SignalPanel
                signals={currentAnalysis.signals}
                loading={analysisLoading}
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
    <Card className="border-zinc-800/50 bg-zinc-900/30">
      <CardContent className="flex items-center gap-3 p-3">
        <Icon className={`h-4 w-4 ${color}`} />
        <div>
          <CardHeader className="p-0">
            <CardTitle className="font-mono text-lg font-bold">
              {value}
            </CardTitle>
          </CardHeader>
          <span className="text-[10px] text-zinc-500">{label}</span>
        </div>
      </CardContent>
    </Card>
  );
}
