"use client";

import { useState, useCallback } from "react";
import {
  Shield,
  TrendingUp,
  Newspaper,
  Zap,
  RefreshCw,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MarketTicker } from "@/components/dashboard/market-ticker";
import { TrustEventList } from "@/components/trust/trust-event-list";
import { SignalPanel } from "@/components/signals/signal-panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AiChat } from "@/components/chat/ai-chat";
import { Watchlist, addSignalToWatchlist } from "@/components/watchlist/watchlist";
import { SettingsPanel } from "@/components/settings/settings-panel";
import { useEvents } from "@/hooks/use-events";
import { InvestmentSignal } from "@/lib/types";

export default function Dashboard() {
  const { data: trustData, loading, error, fetchEvents } = useEvents();
  const [activeTab, setActiveTab] = useState("trust");
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const events = trustData?.events || [];
  const allSignals = events.flatMap((e) => (e.signal ? [e.signal] : []));

  const handleAnalyze = useCallback(
    (query?: string) => {
      fetchEvents(query);
    },
    [fetchEvents]
  );

  const handleSearchFromList = useCallback(
    (query: string) => {
      setSearchQuery(query);
      fetchEvents(query);
    },
    [fetchEvents]
  );

  const handleAddSignalToWatchlist = useCallback((signal: InvestmentSignal) => {
    addSignalToWatchlist(signal);
  }, []);

  const providerLabel = trustData?.provider
    ? trustData.provider === "anthropic"
      ? "Claude"
      : trustData.provider === "openai"
      ? "ChatGPT"
      : trustData.provider === "gemini"
      ? "Gemini"
      : trustData.provider
    : null;

  return (
    <div className="flex h-screen flex-col overflow-hidden pb-[52px] sm:pb-0">
      <Header
        globalSentiment={0}
        articleCount={trustData?.articleCount || 0}
        clusterCount={events.length}
        dataSource={trustData ? "live" : "connecting"}
      />
      <MarketTicker />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 overflow-hidden">
          {/* TRUST - Main View */}
          {activeTab === "trust" && (
            <div className="h-full overflow-y-auto bg-[#0a0a0f]">
              {/* Top action bar */}
              <div className="sticky top-0 z-10 bg-[#0a0a0f] border-b border-zinc-800 px-4 py-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-400" />
                    <h2 className="text-sm font-semibold">Trust Intelligence</h2>
                  </div>

                  {/* Quick search input */}
                  <div className="flex-1 max-w-md">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAnalyze(searchQuery || undefined);
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="z.B. Bitcoin, Tesla, Gold, Fed..."
                        className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                      />
                      <Button
                        type="submit"
                        disabled={loading}
                        size="sm"
                        className="gap-1.5 shrink-0"
                      >
                        {loading ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Zap className="h-3.5 w-3.5" />
                        )}
                        <span className="hidden sm:inline">
                          {loading ? "Analysiere..." : "Analysieren"}
                        </span>
                      </Button>
                    </form>
                  </div>

                  {/* Status badges */}
                  <div className="flex items-center gap-1.5 ml-auto">
                    {trustData && (
                      <>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          <Newspaper className="h-3 w-3 mr-1" />
                          {trustData.articleCount} Artikel
                        </Badge>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {trustData.sourceCount} Quellen
                        </Badge>
                      </>
                    )}
                    <Badge
                      variant={loading ? "warning" : providerLabel ? "success" : "outline"}
                      className="text-[10px]"
                    >
                      {loading ? "Analysiere..." : providerLabel || "Ready"}
                    </Badge>
                  </div>
                </div>

                {/* Quick topic buttons */}
                <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1">
                  {["Bitcoin", "Ethereum", "Gold", "Oil", "Fed", "S&P 500", "Inflation"].map(
                    (topic) => (
                      <button
                        key={topic}
                        onClick={() => {
                          setSearchQuery(topic);
                          handleAnalyze(topic);
                        }}
                        disabled={loading}
                        className="px-2.5 py-1 rounded-full text-[10px] font-medium text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors whitespace-nowrap border border-zinc-800/50"
                      >
                        {topic}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Trust Event List */}
              <div className="p-4">
                <TrustEventList
                  events={events}
                  loading={loading}
                  error={error}
                  onSearch={handleSearchFromList}
                  onRefresh={() => handleAnalyze(searchQuery || undefined)}
                  articleCount={trustData?.articleCount}
                  sourceCount={trustData?.sourceCount}
                />
              </div>
            </div>
          )}

          {/* SIGNALS */}
          {activeTab === "signals" && (
            <div className="h-full overflow-y-auto bg-[#0a0a0f]">
              {allSignals.length > 0 ? (
                <SignalPanel
                  signals={allSignals}
                  loading={loading}
                  onAddToWatchlist={handleAddSignalToWatchlist}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <TrendingUp className="h-8 w-8 text-zinc-700" />
                  <p className="text-sm text-zinc-500">
                    Starte eine Trust-Analyse, um Signale zu generieren
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setActiveTab("trust");
                      handleAnalyze();
                    }}
                  >
                    <Zap className="h-3.5 w-3.5 mr-1.5" />
                    Jetzt analysieren
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* CHAT */}
          {activeTab === "chat" && (
            <div className="h-full bg-[#0a0a0f]">
              <AiChat articles={[]} provider={activeProvider} />
            </div>
          )}

          {/* WATCHLIST */}
          {activeTab === "watchlist" && (
            <div className="h-full bg-[#0a0a0f]">
              <Watchlist
                onTopicSelect={() => {
                  setActiveTab("chat");
                }}
              />
            </div>
          )}

          {/* SETTINGS */}
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
