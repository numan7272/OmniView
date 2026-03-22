"use client";

import { mockClusters, mockSignals } from "@/lib/mockData";
import { Globe2, Layers, TrendingUp, Users, AlertTriangle, Zap } from "lucide-react";

const stats = [
  {
    label: "Countries Monitored",
    value: "40+",
    sub: "Live feeds active",
    icon: Globe2,
    color: "#3b82f6",
  },
  {
    label: "Active Clusters",
    value: mockClusters.length,
    sub: `${mockClusters.reduce((a, c) => a + c.articleCount, 0)} articles analyzed`,
    icon: Layers,
    color: "#8b5cf6",
  },
  {
    label: "Investment Signals",
    value: mockSignals.filter((s) => s.signal === "buy" || s.signal === "strong_buy").length,
    sub: "Buy signals active",
    icon: TrendingUp,
    color: "#10b981",
  },
  {
    label: "Reporters Tracked",
    value: "847",
    sub: "Across 40 countries",
    icon: Users,
    color: "#f59e0b",
  },
  {
    label: "High Divergence",
    value: mockClusters.filter((c) => c.divergence > 60).length,
    sub: "Clusters >60% divergence",
    icon: AlertTriangle,
    color: "#ef4444",
  },
  {
    label: "Arbitrage Alerts",
    value: mockSignals.filter((s) => s.signal === "strong_buy").length,
    sub: "Strong buy signals",
    icon: Zap,
    color: "#fbbf24",
  },
];

export default function StatsBar() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-[#0d1424] rounded-xl border border-[#1e293b] p-3 flex items-start gap-3"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              <Icon className="w-4 h-4" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-xl font-bold font-mono text-white leading-none">{stat.value}</p>
              <p className="text-[11px] text-white mt-0.5">{stat.label}</p>
              <p className="text-[10px] text-[#475569] mt-0.5">{stat.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
