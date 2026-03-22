"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { NarrativeCluster } from "@/lib/types";

interface SentimentChartProps {
  clusters: NarrativeCluster[];
}

export function SentimentChart({ clusters }: SentimentChartProps) {
  if (clusters.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-zinc-600">
        Keine Daten verfuegbar
      </div>
    );
  }

  const data = clusters.map((c) => ({
    name: c.label.length > 20 ? c.label.slice(0, 20) + "..." : c.label,
    sentiment: parseFloat((c.sentimentScore * 100).toFixed(1)),
    articles: c.articleCount,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
        <XAxis
          type="number"
          domain={[-100, 100]}
          tick={{ fill: "#52525b", fontSize: 9 }}
          axisLine={{ stroke: "#27272a" }}
          tickLine={false}
        />
        <YAxis
          dataKey="name"
          type="category"
          width={120}
          tick={{ fill: "#71717a", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "8px",
            fontSize: "11px",
          }}
          formatter={(value) => [`${Number(value) > 0 ? "+" : ""}${value}%`, "Stimmung"]}
          labelStyle={{ color: "#a1a1aa" }}
        />
        <Bar dataKey="sentiment" radius={[0, 4, 4, 0]} maxBarSize={20}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={
                entry.sentiment >= 30
                  ? "#34d399"
                  : entry.sentiment <= -30
                  ? "#f87171"
                  : "#fbbf24"
              }
              fillOpacity={0.6}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
