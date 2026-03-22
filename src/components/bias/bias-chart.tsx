"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Journalist } from "@/lib/types";

interface BiasChartProps {
  journalists: Journalist[];
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

export function BiasChart({ journalists }: BiasChartProps) {
  const top = journalists.slice(0, 4);

  if (top.length === 0 || top[0].biasHistory.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-zinc-600">
        No bias history available.
      </div>
    );
  }

  const data = top[0].biasHistory.map((_, idx) => {
    const point: Record<string, string | number> = {
      date: top[0].biasHistory[idx].date,
    };
    top.forEach((j) => {
      point[j.name] = j.biasHistory[idx]?.score ?? 0;
    });
    return point;
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
        <XAxis
          dataKey="date"
          tick={{ fill: "#71717a", fontSize: 10 }}
          axisLine={{ stroke: "#27272a" }}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: "#71717a", fontSize: 10 }}
          axisLine={{ stroke: "#27272a" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "8px",
            fontSize: "11px",
          }}
          labelStyle={{ color: "#a1a1aa" }}
        />
        {top.map((j, i) => (
          <Line
            key={j.id}
            type="monotone"
            dataKey={j.name}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
