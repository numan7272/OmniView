"use client";

import { useState, useMemo } from "react";
import { Newspaper, Search, X } from "lucide-react";
import { NewsArticle } from "@/lib/types";
import { NewsArticleCard } from "./news-article-card";
import { RegionFilter, getRegionForCountry } from "./region-filter";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsFeedProps {
  articles: NewsArticle[];
  loading: boolean;
  onArticleSelect?: (article: NewsArticle) => void;
  selectedArticleId?: string | null;
}

export function NewsFeed({
  articles,
  loading,
  onArticleSelect,
  selectedArticleId,
}: NewsFeedProps) {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    articles.forEach((a) => {
      const region = getRegionForCountry(a.countryCode);
      counts[region] = (counts[region] || 0) + 1;
    });
    return counts;
  }, [articles]);

  const filteredArticles = useMemo(() => {
    let filtered = articles;

    if (selectedRegion !== "all") {
      filtered = filtered.filter(
        (a) => getRegionForCountry(a.countryCode) === selectedRegion
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q) ||
          a.country.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [articles, selectedRegion, searchQuery]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <Newspaper className="h-4 w-4 text-emerald-400" />
        <h2 className="text-sm font-semibold">Live News</h2>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-2 w-2 animate-live-pulse rounded-full bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">
            {filteredArticles.length}
            {filteredArticles.length !== articles.length && ` / ${articles.length}`}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative px-3 py-2 border-b border-zinc-800/50">
        <Search className="absolute left-5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
        <input
          type="text"
          placeholder="Artikel suchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 py-1.5 pl-8 pr-7 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-zinc-600"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Region filter */}
      <RegionFilter
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        articleCounts={regionCounts}
      />

      {/* Articles */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-zinc-600">
            <Newspaper className="h-8 w-8" />
            <p className="text-xs">
              {searchQuery || selectedRegion !== "all"
                ? "Keine Artikel gefunden. Filter aendern?"
                : "Keine Artikel verfuegbar."}
            </p>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <NewsArticleCard
              key={article.id}
              article={article}
              selected={article.id === selectedArticleId}
              onClick={() => onArticleSelect?.(article)}
            />
          ))
        )}
      </div>
    </div>
  );
}
