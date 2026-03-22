"use client";

import { mockSignals } from "@/lib/mockData";
import { getSignalColor, getSignalLabel } from "@/lib/utils";
import type { InvestmentSignal } from "@/types";
import { TrendingUp, TrendingDown, Zap, Shield, AlertTriangle } from "lucide-react";
import { useState } from "react";

const ASSET_TYPES = ["All", "stock", "crypto", "commodity", "forex"];

export default function InvestmentSignals() {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All" ? mockSignals : mockSignals.filter((s) => s.assetType === filter);

  return (
    <div className="bg-[#0d1424] rounded-xl border border-[#1e293b] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e293b]">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <h2 className="text-white font-semibold text-sm">AI Investment Signals</h2>
          <span className="text-[9px] font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded-full">
            EDGE
          </span>
        </div>
        <span className="text-[10px] text-[#475569]">{filtered.length} active signals</span>
      </div>

      {/* Disclaimer */}
      <div className="mx-4 mt-3 p-2 bg-[#1e293b]/50 border border-[#334155] rounded-lg flex items-start gap-2">
        <AlertTriangle className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
        <p className="text-[10px] text-[#475569] leading-relaxed">
          AI-generated signals based on global narrative analysis. Not financial advice. Past
          performance does not guarantee future results.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-1 px-4 py-2 overflow-x-auto">
        {ASSET_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors capitalize ${
              filter === type
                ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                : "text-[#475569] hover:text-white hover:bg-[#1e293b]"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Signals */}
      <div className="p-4 grid gap-3">
        {filtered.map((signal) => (
          <SignalCard key={signal.id} signal={signal} />
        ))}
      </div>
    </div>
  );
}

function SignalCard({ signal }: { signal: InvestmentSignal }) {
  const [expanded, setExpanded] = useState(false);
  const signalColor = getSignalColor(signal.signal);
  const isPositive = signal.changePercent >= 0;
  const riskIcon =
    signal.risk === "low" ? (
      <Shield className="w-3 h-3 text-emerald-400" />
    ) : signal.risk === "medium" ? (
      <AlertTriangle className="w-3 h-3 text-yellow-400" />
    ) : (
      <AlertTriangle className="w-3 h-3 text-red-400" />
    );

  const upside =
    ((signal.priceTarget - signal.currentPrice) / signal.currentPrice) * 100;

  return (
    <div
      className="rounded-lg border border-[#1e293b] overflow-hidden cursor-pointer hover:border-[#334155] transition-all"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Signal bar */}
      <div
        className="h-0.5 w-full"
        style={{ backgroundColor: signalColor }}
      />

      <div className="p-3">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold font-mono text-[#475569]">
                {signal.ticker}
              </span>
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase"
                style={{ color: signalColor, backgroundColor: `${signalColor}20` }}
              >
                {getSignalLabel(signal.signal)}
              </span>
              <span className="text-[10px] text-[#475569] capitalize">{signal.assetType}</span>
            </div>
            <p className="text-sm text-white font-medium">{signal.asset}</p>
          </div>

          {/* Confidence */}
          <div className="flex flex-col items-end">
            <div className="text-lg font-bold font-mono" style={{ color: signalColor }}>
              {signal.confidence}%
            </div>
            <span className="text-[9px] text-[#475569]">confidence</span>
          </div>
        </div>

        {/* Price info */}
        <div className="flex items-center gap-4 mt-2">
          <div>
            <p className="text-[10px] text-[#475569]">Current</p>
            <p className="text-sm font-mono font-semibold text-white">
              {signal.assetType === "forex"
                ? signal.currentPrice.toFixed(4)
                : signal.currentPrice.toLocaleString()}
            </p>
          </div>
          <div className="text-[#334155]">→</div>
          <div>
            <p className="text-[10px] text-[#475569]">Target</p>
            <p
              className="text-sm font-mono font-semibold"
              style={{ color: signalColor }}
            >
              {signal.assetType === "forex"
                ? signal.priceTarget.toFixed(4)
                : signal.priceTarget.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[#475569]">Upside</p>
            <p
              className={`text-sm font-mono font-semibold flex items-center gap-0.5 ${
                upside >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {upside >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(upside).toFixed(1)}%
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            {riskIcon}
            <span className="text-[10px] text-[#475569] capitalize">{signal.risk} risk</span>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mt-2 h-1 bg-[#1e293b] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${signal.confidence}%`, backgroundColor: signalColor }}
          />
        </div>

        {/* Expanded reasoning */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-[#1e293b]">
            <p className="text-[10px] text-[#94a3b8] leading-relaxed mb-2">
              {signal.reasoning}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#475569]">Timeframe:</span>
              <span className="text-[10px] text-white">{signal.timeframe}</span>
              <span className="text-[10px] text-[#334155] mx-1">·</span>
              <span className="text-[10px] text-[#475569]">Based on clusters:</span>
              {signal.relatedClusters.map((c) => (
                <span
                  key={c}
                  className="text-[10px] text-[#3b82f6] bg-[#3b82f620] px-1.5 py-0.5 rounded"
                >
                  {c.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 24h change */}
        <div className="mt-2 flex items-center gap-1">
          <span className="text-[10px] text-[#475569]">24h:</span>
          <span
            className={`text-[10px] font-mono ${
              isPositive ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {signal.changePercent.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}
