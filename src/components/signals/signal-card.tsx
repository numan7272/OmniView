import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    label: "HOLD",
  },
};

const ASSET_TYPE_LABELS = {
  stock: "Stock",
  crypto: "Crypto",
  commodity: "Commodity",
};

export function SignalCard({ signal }: SignalCardProps) {
  const config = DIRECTION_CONFIG[signal.direction];
  const Icon = config.icon;

  return (
    <Card className={cn("border transition-all hover:border-zinc-600", config.bgColor)}>
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                signal.direction === "buy"
                  ? "bg-emerald-500/20"
                  : signal.direction === "sell"
                  ? "bg-red-500/20"
                  : "bg-amber-500/20"
              )}
            >
              <Icon className={cn("h-4 w-4", config.color)} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{signal.asset}</span>
                <Badge variant="outline" className="text-[10px]">
                  {ASSET_TYPE_LABELS[signal.assetType]}
                </Badge>
              </div>
              <span className="text-[10px] text-zinc-500">
                {formatTimeAgo(signal.timestamp)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <Badge
              variant={
                signal.direction === "buy"
                  ? "success"
                  : signal.direction === "sell"
                  ? "destructive"
                  : "warning"
              }
              className="text-xs font-bold"
            >
              {config.label}
            </Badge>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3 text-zinc-500" />
            <span className="text-[10px] text-zinc-500">Confidence</span>
            <span
              className={cn(
                "font-mono text-xs font-semibold",
                confidenceColor(signal.confidence)
              )}
            >
              {(signal.confidence * 100).toFixed(0)}%
            </span>
          </div>
          {signal.priceChange !== undefined && (
            <span
              className={cn(
                "font-mono text-xs",
                signal.priceChange >= 0 ? "text-emerald-400" : "text-red-400"
              )}
            >
              {signal.priceChange >= 0 ? "+" : ""}
              {signal.priceChange.toFixed(1)}%
            </span>
          )}
        </div>

        <p className="mt-2 text-[11px] leading-relaxed text-zinc-400">
          {signal.reasoning}
        </p>
      </CardContent>
    </Card>
  );
}
