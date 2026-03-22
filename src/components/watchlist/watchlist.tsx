"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  Plus,
  X,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { WatchlistItem, InvestmentSignal } from "@/lib/types";

const WATCHLIST_STORAGE_KEY = "omniview-watchlist";

interface WatchlistProps {
  onTopicSelect?: (topic: string) => void;
}

function loadWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveWatchlist(items: WatchlistItem[]) {
  try {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function addSignalToWatchlist(signal: InvestmentSignal) {
  const items = loadWatchlist();
  if (items.find((i) => i.topic.toLowerCase() === signal.asset.toLowerCase())) return;
  const newItem: WatchlistItem = {
    id: `watch-${Date.now()}`,
    topic: signal.asset,
    addedAt: new Date().toISOString(),
    signalCount: 1,
    type: "asset",
    assetType: signal.assetType,
    direction: signal.direction,
    confidence: signal.confidence,
  };
  items.push(newItem);
  saveWatchlist(items);
  // Dispatch event so Watchlist component can pick it up
  window.dispatchEvent(new CustomEvent("watchlist-update"));
}

export function Watchlist({ onTopicSelect }: WatchlistProps) {
  const [items, setItems] = useState<WatchlistItem[]>(() => loadWatchlist());
  const [newTopic, setNewTopic] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  // Persist
  useEffect(() => {
    saveWatchlist(items);
  }, [items]);

  // Listen for external additions
  useEffect(() => {
    const handler = () => setItems(loadWatchlist());
    window.addEventListener("watchlist-update", handler);
    return () => window.removeEventListener("watchlist-update", handler);
  }, []);

  const addTopic = () => {
    const topic = newTopic.trim();
    if (!topic) return;
    if (items.find((i) => i.topic.toLowerCase() === topic.toLowerCase())) return;

    setItems((prev) => [
      ...prev,
      {
        id: `watch-${Date.now()}`,
        topic,
        addedAt: new Date().toISOString(),
        signalCount: 0,
        type: "topic",
      },
    ]);
    setNewTopic("");
    setShowAdd(false);
  };

  const removeTopic = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const directionIcon = (dir?: string) => {
    if (dir === "buy") return <TrendingUp className="h-3 w-3 text-emerald-400" />;
    if (dir === "sell") return <TrendingDown className="h-3 w-3 text-red-400" />;
    if (dir === "hold") return <Minus className="h-3 w-3 text-amber-400" />;
    return <Search className="h-3.5 w-3.5 text-amber-400/60" />;
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <Eye className="h-4 w-4 text-amber-400" />
        <h2 className="text-sm font-semibold">Watchlist</h2>
        <span className="ml-auto text-[10px] text-zinc-500">
          {items.length} items
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdd(!showAdd)}
          className="h-7 w-7 p-0"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {showAdd && (
        <div className="flex items-center gap-2 border-b border-zinc-800/50 px-4 py-2">
          <input
            type="text"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTopic()}
            placeholder="e.g. AI regulation, oil prices..."
            className="flex-1 rounded border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-amber-500/50"
            autoFocus
          />
          <Button onClick={addTopic} size="sm" className="h-7 text-xs">
            Add
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-zinc-600">
            <Eye className="h-8 w-8" />
            <p className="text-xs">No items being watched.</p>
            <p className="text-[10px] text-zinc-700">
              Add topics or signals from the Signals panel.
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {items.map((item) => (
              <Card
                key={item.id}
                className="border-zinc-800/50 bg-zinc-900/30 hover:border-amber-500/20 transition-colors"
              >
                <CardContent className="flex items-center gap-2 p-2.5">
                  <button
                    onClick={() => onTopicSelect?.(item.topic)}
                    className="flex flex-1 items-center gap-2 text-left min-w-0"
                  >
                    {directionIcon(item.direction)}
                    <div className="min-w-0">
                      <span className="text-xs font-medium block truncate">{item.topic}</span>
                      {item.type === "asset" && item.assetType && (
                        <span className="text-[9px] text-zinc-600">
                          {item.assetType} {item.confidence ? `· ${(item.confidence * 100).toFixed(0)}% confidence` : ""}
                        </span>
                      )}
                    </div>
                  </button>
                  <Badge
                    variant={item.type === "asset" ? (
                      item.direction === "buy" ? "success" :
                      item.direction === "sell" ? "destructive" : "warning"
                    ) : "outline"}
                    className="text-[9px] shrink-0"
                  >
                    {item.type === "asset" ? (item.direction || "asset").toUpperCase() : "topic"}
                  </Badge>
                  <button
                    onClick={() => removeTopic(item.id)}
                    className="rounded p-1 text-zinc-600 hover:bg-zinc-800 hover:text-zinc-400 shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
