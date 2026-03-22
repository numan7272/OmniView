"use client";

import { cn, trustColor, trustBgColor } from "@/lib/utils";
import type { TrustLabel } from "@/lib/types";

interface TrustScoreBadgeProps {
  score: number;
  label: TrustLabel;
  size?: "sm" | "md" | "lg";
}

export function TrustScoreBadge({ score, label, size = "md" }: TrustScoreBadgeProps) {
  const sizeClasses = {
    sm: "h-10 w-10 text-xs",
    md: "h-14 w-14 text-sm",
    lg: "h-20 w-20 text-lg",
  };

  const labelSizes = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-xs",
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          "rounded-full border-2 flex items-center justify-center font-bold font-mono",
          sizeClasses[size],
          trustBgColor(score),
          trustColor(score)
        )}
      >
        {score}
      </div>
      <span className={cn("text-zinc-400 text-center leading-tight", labelSizes[size])}>
        {label}
      </span>
    </div>
  );
}
