"use client";

import { TrendingUp } from "lucide-react";
import { InvestmentSignal } from "@/lib/types";
import { SignalCard } from "./signal-card";
import { Skeleton } from "@/components/ui/skeleton";

interface SignalPanelProps {
  signals: InvestmentSignal[];
  loading: boolean;
}

export function SignalPanel({ signals, loading }: SignalPanelProps) {
  const sorted = [...signals].sort(
    (a, b) => b.confidence - a.confidence
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <TrendingUp className="h-4 w-4 text-purple-400" />
        <h2 className="text-sm font-semibold">Investment Signals</h2>
        <span className="ml-auto text-xs text-zinc-500">
          {signals.length} active signals
        </span>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {loading ? (
          <>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </>
        ) : sorted.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-zinc-600">
            No signals available. Run analysis to generate signals.
          </div>
        ) : (
          sorted.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))
        )}
      </div>
    </div>
  );
}
