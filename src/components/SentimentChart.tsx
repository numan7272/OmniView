"use client";

import { sentimentHistory, mockClusters } from "@/lib/mockData";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
} from "recharts";
import { BarChart2 } from "lucide-react";

export default function SentimentChart() {
  const radarData = mockClusters.map((c) => ({
    cluster: c.label,
    sentiment: Math.round((c.sentiment + 1) * 50),
    divergence: c.divergence,
    articles: Math.round((c.articleCount / 90) * 100),
  }));

  return (
    <div className="bg-[#0d1424] rounded-xl border border-[#1e293b] p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-4 h-4 text-[#3b82f6]" />
        <h2 className="text-white font-semibold text-sm">Global Sentiment Over Time</h2>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={sentimentHistory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="negGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            tick={{ fill: "#475569", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#475569", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#e2e8f0",
              fontSize: 11,
            }}
          />
          <Area
            type="monotone"
            dataKey="positive"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#posGrad)"
            name="Positive"
          />
          <Area
            type="monotone"
            dataKey="negative"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#negGrad)"
            name="Negative"
          />
          <Area
            type="monotone"
            dataKey="neutral"
            stroke="#6b7280"
            strokeWidth={1}
            fill="none"
            strokeDasharray="4 2"
            name="Neutral"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Radar chart */}
      <div className="mt-4 border-t border-[#1e293b] pt-4">
        <h3 className="text-xs text-[#475569] mb-3">Cluster Analysis Matrix</h3>
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={radarData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
            <PolarGrid stroke="#1e293b" />
            <PolarAngleAxis
              dataKey="cluster"
              tick={{ fill: "#475569", fontSize: 9 }}
            />
            <Radar
              name="Sentiment"
              dataKey="sentiment"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.15}
              strokeWidth={1.5}
            />
            <Radar
              name="Divergence"
              dataKey="divergence"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.1}
              strokeWidth={1.5}
            />
            <Legend
              wrapperStyle={{ fontSize: 10, color: "#475569" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#e2e8f0",
                fontSize: 11,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
