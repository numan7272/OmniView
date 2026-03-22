"use client";

import { mockReporters } from "@/lib/mockData";
import { getNeutralityColor, getNeutralityLabel } from "@/lib/utils";
import { UserCheck, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function ReporterBiasTracker() {
  return (
    <div className="bg-[#0d1424] rounded-xl border border-[#1e293b] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e293b]">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <h2 className="text-white font-semibold text-sm">Reporter Bias Tracker</h2>
        </div>
        <span className="text-[10px] text-[#475569]">{mockReporters.length} tracked globally</span>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-[#1e293b]">
        {[
          { range: "85–100", label: "Highly Neutral", color: "#10b981" },
          { range: "55–84", label: "Moderate", color: "#f59e0b" },
          { range: "0–54", label: "Biased", color: "#ef4444" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] text-[#475569]">
              {item.range}: {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Reporter list */}
      <div className="divide-y divide-[#1e293b]">
        {mockReporters.map((reporter) => {
          const color = getNeutralityColor(reporter.neutralityScore);
          const TrendIcon =
            reporter.trend === "improving"
              ? TrendingUp
              : reporter.trend === "declining"
              ? TrendingDown
              : Minus;
          const trendColor =
            reporter.trend === "improving"
              ? "#10b981"
              : reporter.trend === "declining"
              ? "#ef4444"
              : "#6b7280";

          return (
            <div key={reporter.id} className="px-4 py-3 hover:bg-[#131f35] transition-colors">
              <div className="flex items-center gap-3">
                {/* Flag + Info */}
                <span className="text-xl flex-shrink-0">{reporter.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium">{reporter.name}</span>
                    <TrendIcon className="w-3 h-3" style={{ color: trendColor }} />
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-[#475569]">{reporter.outlet}</span>
                    <span className="text-[10px] text-[#334155]">·</span>
                    <span className="text-[10px] text-[#475569]">{reporter.articleCount} articles</span>
                    <span className="text-[10px] text-[#334155]">·</span>
                    <span
                      className="text-[10px]"
                      style={{ color: reporter.biasDirection === "neutral" ? "#10b981" : "#f59e0b" }}
                    >
                      {reporter.biasDirection === "neutral"
                        ? "Neutral"
                        : reporter.biasDirection === "left"
                        ? "Left-leaning"
                        : "Right-leaning"}
                    </span>
                  </div>
                  {/* Topics */}
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {reporter.topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-[9px] text-[#475569] bg-[#1e293b] px-1.5 py-0.5 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Score */}
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <div
                    className="text-lg font-bold font-mono"
                    style={{ color }}
                  >
                    {reporter.neutralityScore}
                  </div>
                  <span
                    className="text-[9px] font-medium px-1.5 py-0.5 rounded"
                    style={{ color, backgroundColor: `${color}20` }}
                  >
                    {getNeutralityLabel(reporter.neutralityScore)}
                  </span>
                  {/* Score bar */}
                  <div className="w-20 h-1 bg-[#1e293b] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${reporter.neutralityScore}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
