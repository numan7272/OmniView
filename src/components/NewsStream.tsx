"use client";

import { useState, useEffect } from "react";
import { mockArticles } from "@/lib/mockData";
import { formatTimeAgo, getSentimentColor } from "@/lib/utils";
import type { NewsArticle } from "@/types";
import { Filter, RefreshCw } from "lucide-react";

const CATEGORIES = ["All", "Economy", "Technology", "Geopolitics", "Energy", "Climate"];

export default function NewsStream() {
  const [articles, setArticles] = useState<NewsArticle[]>(mockArticles);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [, setTick] = useState(0);

  // Update timestamps every minute
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const filtered = filter === "All" ? articles : articles.filter((a) => a.category === filter);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setArticles([...mockArticles].sort(() => Math.random() - 0.5));
      setLoading(false);
    }, 800);
  };

  return (
    <div className="bg-[#0d1424] rounded-xl border border-[#1e293b] flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e293b]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h2 className="text-white font-semibold text-sm">Global News Stream</h2>
          <span className="text-[10px] text-[#475569] bg-[#1e293b] px-2 py-0.5 rounded-full">
            {filtered.length} articles
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#475569]" />
          <button
            onClick={handleRefresh}
            className="p-1 text-[#475569] hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-1 px-4 py-2 overflow-x-auto border-b border-[#1e293b]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
              filter === cat
                ? "bg-[#3b82f6] text-white"
                : "text-[#475569] hover:text-white hover:bg-[#1e293b]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#1e293b]">
        {filtered.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

function ArticleCard({ article }: { article: NewsArticle }) {
  const [expanded, setExpanded] = useState(false);
  const sentimentColor = getSentimentColor(article.sentimentScore);

  return (
    <div
      className="px-4 py-3 hover:bg-[#131f35] transition-colors cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-2">
        {/* Country flag */}
        <span className="text-xl mt-0.5 flex-shrink-0">{article.flag}</span>

        <div className="flex-1 min-w-0">
          {/* Source & time */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-[#475569] uppercase tracking-wide">
              {article.source}
            </span>
            <span className="text-[10px] text-[#334155]">·</span>
            <span className="text-[10px] text-[#334155]">{formatTimeAgo(article.timestamp)}</span>
            <span className="text-[10px] text-[#334155]">·</span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
              style={{ color: sentimentColor, backgroundColor: `${sentimentColor}20` }}
            >
              {article.sentiment === "positive" ? "↑" : article.sentiment === "negative" ? "↓" : "→"}{" "}
              {article.category}
            </span>
          </div>

          {/* Title */}
          <p className="text-sm text-[#e2e8f0] leading-snug font-medium line-clamp-2">
            {article.titleOriginal}
          </p>

          {/* Language badge */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[9px] text-[#475569] bg-[#1e293b] px-1.5 py-0.5 rounded">
              {article.language}
            </span>
            <span className="text-[9px] text-[#475569]">
              by {article.reporter} · Bias Score:{" "}
              <span
                style={{ color: article.reporterBiasScore >= 75 ? "#10b981" : article.reporterBiasScore >= 50 ? "#f59e0b" : "#ef4444" }}
              >
                {article.reporterBiasScore}
              </span>
            </span>
          </div>

          {/* Expanded summary */}
          {expanded && (
            <div className="mt-2 p-2.5 bg-[#1a2538] rounded-lg border border-[#1e293b]">
              <p className="text-xs text-[#94a3b8] leading-relaxed">{article.summary}</p>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-[10px] text-[#475569]">Cluster:</span>
                <span className="text-[10px] text-[#3b82f6] bg-[#3b82f620] px-1.5 py-0.5 rounded">
                  {article.clusterId.toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Sentiment bar */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="w-1 h-12 bg-[#1e293b] rounded-full overflow-hidden">
            <div
              className="w-full rounded-full transition-all"
              style={{
                height: `${Math.abs(article.sentimentScore) * 100}%`,
                backgroundColor: sentimentColor,
                marginTop: article.sentimentScore < 0 ? `${(1 - Math.abs(article.sentimentScore)) * 100}%` : "0",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
