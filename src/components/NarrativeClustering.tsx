"use client";

import { useState } from "react";
import { mockClusters } from "@/lib/mockData";
import type { NarrativeCluster } from "@/types";
import { getSentimentLabel, getSentimentColor } from "@/lib/utils";
import { Network, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

export default function NarrativeClustering() {
  const [selected, setSelected] = useState<NarrativeCluster | null>(mockClusters[0]);

  return (
    <div className="bg-[#0d1424] rounded-xl border border-[#1e293b] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e293b]">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-[#8b5cf6]" />
          <h2 className="text-white font-semibold text-sm">Dynamic Narrative Clustering</h2>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-[#475569]">{mockClusters.length} clusters</span>
          <span className="text-[10px] text-[#475569] mx-1">·</span>
          <span className="text-[10px] text-[#475569]">
            {mockClusters.reduce((a, c) => a + c.countries.length, 0)} countries
          </span>
        </div>
      </div>

      <div className="p-4 grid gap-3">
        {/* Cluster list */}
        <div className="grid gap-2">
          {mockClusters.map((cluster) => (
            <ClusterCard
              key={cluster.id}
              cluster={cluster}
              isSelected={selected?.id === cluster.id}
              onClick={() => setSelected(selected?.id === cluster.id ? null : cluster)}
            />
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div
            className="p-4 rounded-xl border transition-all"
            style={{ borderColor: `${selected.color}40`, backgroundColor: `${selected.color}08` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-semibold text-sm">{selected.label}</h3>
                <p className="text-[#475569] text-xs mt-0.5">
                  {selected.articleCount} articles · {selected.countries.length} countries
                </p>
              </div>
              {selected.divergence > 60 && (
                <div className="flex items-center gap-1 bg-red-900/30 border border-red-800/50 rounded-lg px-2 py-1">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  <span className="text-[10px] text-red-400 font-medium">High Divergence</span>
                </div>
              )}
            </div>

            {/* Divergence meter */}
            <div className="mb-3">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-[#475569]">Narrative Divergence</span>
                <span className="font-mono" style={{ color: selected.divergence > 60 ? "#ef4444" : selected.divergence > 30 ? "#f59e0b" : "#10b981" }}>
                  {selected.divergence}%
                </span>
              </div>
              <div className="h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${selected.divergence}%`,
                    backgroundColor: selected.divergence > 60 ? "#ef4444" : selected.divergence > 30 ? "#f59e0b" : "#10b981",
                  }}
                />
              </div>
            </div>

            {/* Sentiment */}
            <div className="mb-3">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-[#475569]">Cluster Sentiment</span>
                <span className="font-mono" style={{ color: getSentimentColor(selected.sentiment) }}>
                  {getSentimentLabel(selected.sentiment)}
                </span>
              </div>
              <div className="h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.abs(selected.sentiment) * 100}%`,
                    backgroundColor: getSentimentColor(selected.sentiment),
                    marginLeft: selected.sentiment < 0 ? `${(1 - Math.abs(selected.sentiment)) * 100}%` : "0",
                  }}
                />
              </div>
            </div>

            {/* Country flags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {selected.flags.map((flag, i) => (
                <div key={i} className="flex items-center gap-1 bg-[#1e293b] rounded px-2 py-0.5">
                  <span className="text-sm">{flag}</span>
                  <span className="text-[10px] text-[#475569]">{selected.countries[i]}</span>
                </div>
              ))}
            </div>

            {/* Narrative summary */}
            <p className="text-xs text-[#94a3b8] leading-relaxed border-t border-[#1e293b] pt-3">
              {selected.narrative}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ClusterCard({
  cluster,
  isSelected,
  onClick,
}: {
  cluster: NarrativeCluster;
  isSelected: boolean;
  onClick: () => void;
}) {
  const sentimentColor = getSentimentColor(cluster.sentiment);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition-all ${
        isSelected ? "border-opacity-50" : "border-[#1e293b] hover:border-[#334155]"
      }`}
      style={
        isSelected
          ? { borderColor: cluster.color, backgroundColor: `${cluster.color}12` }
          : {}
      }
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cluster.color }} />
          <span className="text-sm text-white font-medium">{cluster.label}</span>
        </div>
        <div className="flex items-center gap-2">
          {cluster.sentiment >= 0 ? (
            <TrendingUp className="w-3 h-3" style={{ color: sentimentColor }} />
          ) : (
            <TrendingDown className="w-3 h-3" style={{ color: sentimentColor }} />
          )}
          <span className="text-[10px] font-mono" style={{ color: sentimentColor }}>
            {cluster.sentiment > 0 ? "+" : ""}
            {(cluster.sentiment * 100).toFixed(0)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {/* Flags */}
        <div className="flex gap-0.5">
          {cluster.flags.slice(0, 5).map((flag, i) => (
            <span key={i} className="text-xs">{flag}</span>
          ))}
          {cluster.flags.length > 5 && (
            <span className="text-[10px] text-[#475569] ml-1">+{cluster.flags.length - 5}</span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#475569]">{cluster.articleCount} arts</span>
          <div className="w-12 h-1 bg-[#1e293b] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${cluster.divergence}%`,
                backgroundColor: cluster.divergence > 60 ? "#ef4444" : cluster.divergence > 30 ? "#f59e0b" : "#10b981",
              }}
            />
          </div>
          <span
            className="text-[10px] font-mono"
            style={{ color: cluster.divergence > 60 ? "#ef4444" : cluster.divergence > 30 ? "#f59e0b" : "#10b981" }}
          >
            {cluster.divergence}%
          </span>
        </div>
      </div>
    </button>
  );
}
