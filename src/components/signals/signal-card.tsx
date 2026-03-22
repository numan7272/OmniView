"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Clock,
  AlertTriangle,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { InvestmentSignal } from "@/lib/types";
import { cn, formatTimeAgo, confidenceColor } from "@/lib/utils";

interface SignalCardProps {
  signal: InvestmentSignal;
}

const DIRECTION_CONFIG = {
  buy: {
    icon: TrendingUp,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10 border-emerald-400/20",
    label: "KAUFEN",
    labelEn: "BUY",
    description: "Starkes Kaufsignal basierend auf Nachrichtenanalyse",
  },
  sell: {
    icon: TrendingDown,
    color: "text-red-400",
    bgColor: "bg-red-400/10 border-red-400/20",
    label: "VERKAUFEN",
    labelEn: "SELL",
    description: "Verkaufssignal -- erhoehtes Risiko erkannt",
  },
  hold: {
    icon: Minus,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10 border-amber-400/20",
    label: "BEOBACHTEN",
    labelEn: "WATCH",
    description: "Abwarten -- gemischte Signale aus verschiedenen Quellen",
  },
};

const ASSET_TYPE_LABELS = {
  stock: "Aktie",
  crypto: "Crypto",
  commodity: "Rohstoff",
};

export function SignalCard({ signal }: SignalCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = DIRECTION_CONFIG[signal.direction];
  const Icon = config.icon;
  const confidencePct = signal.confidence * 100;

  return (
    <Card
      className={cn(
        "border transition-all cursor-pointer",
        config.bgColor,
        expanded ? "border-zinc-600" : "hover:border-zinc-600"
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <CardContent className="p-3">
        {/* Header row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg",
                signal.direction === "buy"
                  ? "bg-emerald-500/20"
                  : signal.direction === "sell"
                  ? "bg-red-500/20"
                  : "bg-amber-500/20"
              )}
            >
              <Icon className={cn("h-4.5 w-4.5", config.color)} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{signal.asset}</span>
                <Badge variant="outline" className="text-[10px]">
                  {ASSET_TYPE_LABELS[signal.assetType]}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Clock className="h-3 w-3 text-zinc-600" />
                <span className="text-[10px] text-zinc-500">
                  {formatTimeAgo(signal.timestamp)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge
              variant={
                signal.direction === "buy"
                  ? "success"
                  : signal.direction === "sell"
                  ? "destructive"
                  : "warning"
              }
              className="text-xs font-bold px-2.5"
            >
              {config.label}
            </Badge>
            {signal.priceChange !== undefined && (
              <span
                className={cn(
                  "font-mono text-xs font-semibold",
                  signal.priceChange >= 0 ? "text-emerald-400" : "text-red-400"
                )}
              >
                {signal.priceChange >= 0 ? "+" : ""}
                {signal.priceChange.toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Target className="h-3 w-3 text-zinc-500" />
              <span className="text-[10px] text-zinc-500">Konfidenz</span>
            </div>
            <span
              className={cn(
                "font-mono text-xs font-bold",
                confidenceColor(signal.confidence)
              )}
            >
              {confidencePct.toFixed(0)}%
            </span>
          </div>
          <Progress
            value={confidencePct}
            className="h-1.5"
            indicatorClassName={
              confidencePct >= 80
                ? "bg-emerald-500"
                : confidencePct >= 60
                ? "bg-amber-500"
                : "bg-zinc-500"
            }
          />
        </div>

        {/* Quick summary */}
        <p className="mt-2 text-[11px] leading-relaxed text-zinc-400 line-clamp-2">
          {signal.reasoning}
        </p>

        {/* Expand toggle */}
        <div className="mt-2 flex items-center justify-center">
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5 text-zinc-600" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-zinc-600" />
          )}
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 space-y-3 border-t border-zinc-800 pt-3">
            {/* Full reasoning */}
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Analyse
              </span>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-300">
                {signal.reasoning}
              </p>
            </div>

            {/* Risk warning */}
            <div className="flex items-start gap-2 rounded-lg bg-amber-500/5 border border-amber-500/10 p-2.5">
              <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-400" />
              <p className="text-[10px] leading-relaxed text-amber-400/80">
                Dies ist keine Finanzberatung. Signale basieren auf KI-Analyse globaler Nachrichtenquellen.
                Eigene Recherche wird empfohlen.
              </p>
            </div>

            {/* Signal metadata */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="rounded-lg bg-zinc-900/50 p-2">
                <span className="text-zinc-600">Typ</span>
                <p className="font-medium text-zinc-300">
                  {ASSET_TYPE_LABELS[signal.assetType]}
                </p>
              </div>
              <div className="rounded-lg bg-zinc-900/50 p-2">
                <span className="text-zinc-600">Empfehlung</span>
                <p className={cn("font-medium", config.color)}>
                  {config.label}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
