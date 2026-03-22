"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { InvestmentSignal } from "@/lib/types";
import { SignalCard } from "./signal-card";
import { Skeleton } from "@/components/ui/skeleton";

interface SignalPanelProps {
  signals: InvestmentSignal[];
  loading: boolean;
  onAddToWatchlist?: (signal: InvestmentSignal) => void;
}

export function SignalPanel({ signals, loading, onAddToWatchlist }: SignalPanelProps) {
  const sorted = [...signals].sort((a, b) => b.confidence - a.confidence);
  const buyCount = signals.filter((s) => s.direction === "buy").length;
  const sellCount = signals.filter((s) => s.direction === "sell").length;
  const holdCount = signals.filter((s) => s.direction === "hold").length;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <TrendingUp className="h-4 w-4 text-purple-400" />
        <h2 className="text-sm font-semibold">Investment Signals</h2>
        <div className="ml-auto flex items-center gap-2">
          {buyCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400">
              <TrendingUp className="h-3 w-3" /> {buyCount}
            </span>
          )}
          {sellCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-red-400">
              <TrendingDown className="h-3 w-3" /> {sellCount}
            </span>
          )}
          {holdCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-amber-400">
              <Minus className="h-3 w-3" /> {holdCount}
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {loading ? (
          <>
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
          </>
        ) : sorted.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-zinc-600">
            <TrendingUp className="h-8 w-8" />
            <p className="text-xs">No signals available.</p>
            <p className="text-[10px] text-zinc-700">
              Run AI analysis to generate signals.
            </p>
          </div>
        ) : (
          sorted.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              onAddToWatchlist={onAddToWatchlist}
            />
          ))
        )}
      </div>
    </div>
  );
}
