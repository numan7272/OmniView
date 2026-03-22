"use client";

import { cn, sentimentColor } from "@/lib/utils";

interface SentimentGaugeProps {
  value: number; // -1 to 1
  label?: string;
  size?: "sm" | "md";
}

export function SentimentGauge({
  value,
  label = "Global Sentiment",
  size = "md",
}: SentimentGaugeProps) {
  const percentage = ((value + 1) / 2) * 100;
  const rotation = -90 + (percentage / 100) * 180;

  const dimensions = size === "sm" ? "h-20 w-20" : "h-28 w-28";
  const textSize = size === "sm" ? "text-sm" : "text-lg";
  const labelSize = size === "sm" ? "text-[9px]" : "text-[10px]";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn("relative", dimensions)}>
        {/* Background arc */}
        <svg viewBox="0 0 100 60" className="w-full">
          <path
            d="M 10 55 A 40 40 0 0 1 90 55"
            fill="none"
            stroke="#27272a"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Colored arc */}
          <path
            d="M 10 55 A 40 40 0 0 1 90 55"
            fill="none"
            stroke={
              value >= 0.3
                ? "#00ff88"
                : value <= -0.3
                ? "#ff4444"
                : "#ffaa00"
            }
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * 126} 126`}
            className="transition-all duration-700"
          />
          {/* Needle */}
          <line
            x1="50"
            y1="55"
            x2="50"
            y2="22"
            stroke="#e4e4e7"
            strokeWidth="1.5"
            strokeLinecap="round"
            transform={`rotate(${rotation}, 50, 55)`}
            className="transition-all duration-700"
          />
          <circle cx="50" cy="55" r="3" fill="#e4e4e7" />
        </svg>
      </div>
      <div className="text-center">
        <div
          className={cn(
            "font-mono font-bold",
            textSize,
            sentimentColor(value)
          )}
        >
          {value >= 0 ? "+" : ""}
          {(value * 100).toFixed(1)}%
        </div>
        <div className={cn("text-zinc-500", labelSize)}>{label}</div>
      </div>
    </div>
  );
}
