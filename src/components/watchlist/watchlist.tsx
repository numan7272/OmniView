"use client";

import { useState } from "react";
import {
  Eye,
  Plus,
  X,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { WatchlistItem } from "@/lib/types";

interface WatchlistProps {
  onTopicSelect?: (topic: string) => void;
}

export function Watchlist({ onTopicSelect }: WatchlistProps) {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [newTopic, setNewTopic] = useState("");
  const [showAdd, setShowAdd] = useState(false);

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
      },
    ]);
    setNewTopic("");
    setShowAdd(false);
  };

  const removeTopic = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <Eye className="h-4 w-4 text-amber-400" />
        <h2 className="text-sm font-semibold">Watchlist</h2>
        <span className="ml-auto text-[10px] text-zinc-500">
          {items.length} topics
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
            <p className="text-xs">No topics being watched.</p>
            <p className="text-[10px] text-zinc-700">
              Add topics to monitor for news and signals.
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
                    className="flex flex-1 items-center gap-2 text-left"
                  >
                    <Search className="h-3.5 w-3.5 text-amber-400/60" />
                    <span className="text-xs font-medium">{item.topic}</span>
                  </button>
                  <Badge variant="outline" className="text-[9px]">
                    {item.signalCount} signals
                  </Badge>
                  <button
                    onClick={() => removeTopic(item.id)}
                    className="rounded p-1 text-zinc-600 hover:bg-zinc-800 hover:text-zinc-400"
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
