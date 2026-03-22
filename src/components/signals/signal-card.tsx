"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  AlertTriangle,
  Target,
  ChevronDown,
  ChevronUp,
  Eye,
  DollarSign,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { InvestmentSignal } from "@/lib/types";
import { cn, formatTimeAgo, confidenceColor } from "@/lib/utils";

interface SignalCardProps {
  signal: InvestmentSignal;
  onAddToWatchlist?: (signal: InvestmentSignal) => void;
}

const DIRECTION_CONFIG = {
  buy: {
    icon: TrendingUp,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10 border-emerald-400/20",
    label: "BUY",
  },
  sell: {
    icon: TrendingDown,
    color: "text-red-400",
    bgColor: "bg-red-400/10 border-red-400/20",
    label: "SELL",
  },
  hold: {
    icon: Minus,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10 border-amber-400/20",
    label: "WATCH",
  },
};

const ASSET_TYPE_LABELS: Record<string, string> = {
  stock: "Stock",
  crypto: "Crypto",
  commodity: "Commodity",
};

// Map common asset names to CoinGecko-friendly IDs for price lookup
const ASSET_PRICE_MAP: Record<string, string> = {
  bitcoin: "bitcoin",
  btc: "bitcoin",
  ethereum: "ethereum",
  eth: "ethereum",
  solana: "solana",
  sol: "solana",
  gold: "pax-gold",
  xau: "pax-gold",
};

export function SignalCard({ signal, onAddToWatchlist }: SignalCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [livePrice, setLivePrice] = useState<{ price: number; change24h: number } | null>(null);
  const config = DIRECTION_CONFIG[signal.direction];
  const Icon = config.icon;
  const confidencePct = signal.confidence * 100;

  useEffect(() => {
    const assetKey = signal.asset.toLowerCase();
    const coinId = ASSET_PRICE_MAP[assetKey];
    if (!coinId) return;

    fetch("/api/ticker")
      .then((r) => r.json())
      .then((data) => {
        const ticker = data.tickers?.find(
          (t: { symbol: string }) => t.symbol.toLowerCase() === assetKey ||
            ASSET_PRICE_MAP[t.symbol.toLowerCase()] === coinId
        );
        if (ticker) {
          setLivePrice({ price: ticker.price, change24h: ticker.change24h });
        }
      })
      .catch(() => {});
  }, [signal.asset]);

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
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div
              className={cn(
                "flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg shrink-0",
                signal.direction === "buy"
                  ? "bg-emerald-500/20"
                  : signal.direction === "sell"
                  ? "bg-red-500/20"
                  : "bg-amber-500/20"
              )}
            >
              <Icon className={cn("h-4 w-4", config.color)} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold truncate">{signal.asset}</span>
                <Badge variant="outline" className="text-[10px] shrink-0">
                  {ASSET_TYPE_LABELS[signal.assetType] || signal.assetType}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Clock className="h-3 w-3 text-zinc-600 shrink-0" />
                <span className="text-[10px] text-zinc-500">
                  {formatTimeAgo(signal.timestamp)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
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
            {livePrice ? (
              <div className="text-right">
                <span className="font-mono text-xs font-semibold text-zinc-300 flex items-center gap-0.5">
                  <DollarSign className="h-3 w-3" />
                  {livePrice.price >= 1000
                    ? livePrice.price.toLocaleString("en-US", { maximumFractionDigits: 0 })
                    : livePrice.price.toFixed(2)}
                </span>
                <span
                  className={cn(
                    "font-mono text-[10px]",
                    livePrice.change24h >= 0 ? "text-emerald-400" : "text-red-400"
                  )}
                >
                  {livePrice.change24h >= 0 ? "+" : ""}
                  {livePrice.change24h.toFixed(1)}% 24h
                </span>
              </div>
            ) : signal.priceChange !== undefined ? (
              <span
                className={cn(
                  "font-mono text-xs font-semibold",
                  signal.priceChange >= 0 ? "text-emerald-400" : "text-red-400"
                )}
              >
                {signal.priceChange >= 0 ? "+" : ""}
                {signal.priceChange.toFixed(1)}%
              </span>
            ) : null}
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Target className="h-3 w-3 text-zinc-500" />
              <span className="text-[10px] text-zinc-500">Confidence</span>
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
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Analysis
              </span>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-300">
                {signal.reasoning}
              </p>
            </div>

            {/* Risk warning */}
            <div className="flex items-start gap-2 rounded-lg bg-amber-500/5 border border-amber-500/10 p-2.5">
              <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-400" />
              <p className="text-[10px] leading-relaxed text-amber-400/80">
                Not financial advice. Signals are based on AI analysis of global news sources.
                Do your own research.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {onAddToWatchlist && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToWatchlist(signal);
                  }}
                >
                  <Eye className="h-3 w-3" />
                  Add to Watchlist
                </Button>
              )}
            </div>

            {/* Signal metadata */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="rounded-lg bg-zinc-900/50 p-2">
                <span className="text-zinc-600">Type</span>
                <p className="font-medium text-zinc-300">
                  {ASSET_TYPE_LABELS[signal.assetType] || signal.assetType}
                </p>
              </div>
              <div className="rounded-lg bg-zinc-900/50 p-2">
                <span className="text-zinc-600">Direction</span>
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
