"use client";

import { useEffect, useState, useRef } from "react";
import { mockTickers } from "@/lib/mockData";
import type { MarketTicker } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function MarketTickerBar() {
  const [tickers, setTickers] = useState<MarketTicker[]>(mockTickers);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTickers((prev) =>
        prev.map((t) => {
          const delta = (Math.random() - 0.5) * t.price * 0.001;
          const newPrice = Math.max(0.001, t.price + delta);
          const newChange = t.change + delta;
          const newChangePercent = (newChange / (newPrice - newChange)) * 100;
          return { ...t, price: newPrice, change: newChange, changePercent: newChangePercent };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const renderTicker = (t: MarketTicker, idx: number) => (
    <div key={`${t.symbol}-${idx}`} className="flex items-center gap-2 px-4 whitespace-nowrap">
      <span className="text-[#94a3b8] text-xs font-medium">{t.symbol}</span>
      <span className="text-white text-xs font-mono font-semibold">
        {t.type === "forex" ? formatPrice(t.price, 4) : formatPrice(t.price)}
      </span>
      <span
        className={`text-xs font-mono ${t.changePercent >= 0 ? "text-emerald-400" : "text-red-400"}`}
      >
        {t.changePercent >= 0 ? "▲" : "▼"} {Math.abs(t.changePercent).toFixed(2)}%
      </span>
      <span className="text-[#334155] mx-1">|</span>
    </div>
  );

  return (
    <div className="bg-[#0a0f1a] border-b border-[#1e293b] overflow-hidden relative">
      <div className="flex items-center">
        <div className="bg-[#1e293b] px-3 py-1.5 flex items-center gap-1.5 flex-shrink-0 z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">Live</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div
            ref={scrollRef}
            className="flex animate-marquee"
            style={{ animation: "marquee 40s linear infinite" }}
          >
            {tickers.map((t, i) => renderTicker(t, i))}
            {tickers.map((t, i) => renderTicker(t, i + tickers.length))}
          </div>
        </div>
      </div>
    </div>
  );
}
