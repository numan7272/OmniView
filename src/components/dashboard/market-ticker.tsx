"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ticker {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

export function MarketTicker() {
  const [tickers, setTickers] = useState<Ticker[]>([]);

  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const res = await fetch("/api/ticker");
        const data = await res.json();
        if (data.tickers) setTickers(data.tickers);
      } catch {
        // silent fail
      }
    };
    fetchTickers();
    const interval = setInterval(fetchTickers, 60000);
    return () => clearInterval(interval);
  }, []);

  if (tickers.length === 0) return null;

  return (
    <div className="flex items-center gap-4 overflow-x-auto border-b border-zinc-800/50 bg-[#0c0c14] px-4 py-1.5 scrollbar-thin">
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
        Markets
      </span>
      {tickers.map((t) => (
        <div key={t.id} className="flex shrink-0 items-center gap-2">
          <span className="text-[11px] font-semibold text-zinc-300">
            {t.symbol}
          </span>
          <span className="font-mono text-[11px] text-zinc-400">
            ${t.price >= 1000 ? t.price.toLocaleString("en-US", { maximumFractionDigits: 0 }) : t.price.toFixed(2)}
          </span>
          <span
            className={cn(
              "flex items-center gap-0.5 font-mono text-[10px] font-medium",
              t.change24h >= 0 ? "text-emerald-400" : "text-red-400"
            )}
          >
            {t.change24h >= 0 ? (
              <TrendingUp className="h-2.5 w-2.5" />
            ) : (
              <TrendingDown className="h-2.5 w-2.5" />
            )}
            {t.change24h >= 0 ? "+" : ""}
            {t.change24h.toFixed(2)}%
          </span>
          <div className="h-3 w-px bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}
