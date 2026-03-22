"use client";

import { useState } from "react";
import { Search, Filter, Shield, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { TrustEventCard } from "./trust-event-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TrustEvent, EventCategory } from "@/lib/types";
import { cn, categoryLabel, categoryColor } from "@/lib/utils";

interface TrustEventListProps {
  events: TrustEvent[];
  loading?: boolean;
  error?: string | null;
  onSearch?: (query: string) => void;
  onRefresh?: () => void;
  articleCount?: number;
  sourceCount?: number;
}

const CATEGORIES: (EventCategory | "all")[] = [
  "all",
  "crypto",
  "stocks",
  "commodities",
  "macro",
  "geopolitics",
];

export function TrustEventList({
  events,
  loading,
  error,
  onSearch,
  onRefresh,
  articleCount,
  sourceCount,
}: TrustEventListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<EventCategory | "all">("all");
  const [sortBy, setSortBy] = useState<"trust" | "recent" | "sources">("trust");

  const filtered = events
    .filter((e) => {
      if (activeCategory !== "all" && e.category !== activeCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          e.summary.toLowerCase().includes(q) ||
          e.relevantAssets.some((a) => a.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "trust") return b.trustScore - a.trustScore;
      if (sortBy === "sources") return b.sources.length - a.sources.length;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-400" />
          <h2 className="text-sm font-semibold">Trust Events</h2>
          {events.length > 0 && (
            <Badge variant="outline" className="text-[10px] font-mono">
              {events.length} Events
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {articleCount !== undefined && (
            <span className="text-[10px] text-zinc-500">
              {articleCount} Artikel · {sourceCount} Quellen
            </span>
          )}
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Suche nach Event, Asset oder Thema..."
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 pl-9 pr-4 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
        />
      </form>

      {/* Category + Sort filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors whitespace-nowrap",
              activeCategory === cat
                ? cat === "all"
                  ? "bg-blue-600/20 text-blue-400"
                  : categoryColor(cat)
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {cat === "all" ? "Alle" : categoryLabel(cat)}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1">
          {(["trust", "recent", "sources"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={cn(
                "px-2 py-0.5 rounded text-[9px] font-medium transition-colors",
                sortBy === s ? "text-zinc-200 bg-zinc-800" : "text-zinc-600 hover:text-zinc-400"
              )}
            >
              {s === "trust" ? "Trust" : s === "recent" ? "Neu" : "Quellen"}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto" />
            <div>
              <p className="text-sm text-zinc-300">Analysiere Quellen...</p>
              <p className="text-[10px] text-zinc-600 mt-1">
                Sammle Artikel, extrahiere Claims, vergleiche Quellen
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="flex items-center gap-2 rounded-lg bg-red-500/5 border border-red-500/10 p-3">
          <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {/* Event list */}
      {!loading && !error && (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-8 w-8 text-zinc-700 mx-auto" />
              <p className="text-sm text-zinc-500 mt-2">
                {events.length === 0
                  ? "Klicke auf Analysieren, um Events zu laden"
                  : "Keine Events für diesen Filter"}
              </p>
            </div>
          ) : (
            filtered.map((event) => (
              <TrustEventCard key={event.id} event={event} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
