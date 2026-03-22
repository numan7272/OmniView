import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function sentimentColor(score: number): string {
  if (score >= 0.3) return "text-emerald-400";
  if (score <= -0.3) return "text-red-400";
  return "text-amber-400";
}

export function sentimentBgColor(score: number): string {
  if (score >= 0.3) return "bg-emerald-400/10 border-emerald-400/20";
  if (score <= -0.3) return "bg-red-400/10 border-red-400/20";
  return "bg-amber-400/10 border-amber-400/20";
}

export function sentimentLabel(score: number): string {
  if (score >= 0.3) return "Positive";
  if (score <= -0.3) return "Negative";
  return "Neutral";
}

export function confidenceColor(confidence: number): string {
  if (confidence >= 0.8) return "text-emerald-400";
  if (confidence >= 0.6) return "text-amber-400";
  return "text-zinc-400";
}

// ─── Trust Score Helpers ────────────────────────────────────────

export function trustColor(score: number): string {
  if (score >= 70) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  if (score >= 30) return "text-orange-400";
  return "text-red-400";
}

export function trustBgColor(score: number): string {
  if (score >= 70) return "bg-emerald-400/10 border-emerald-400/20";
  if (score >= 50) return "bg-amber-400/10 border-amber-400/20";
  if (score >= 30) return "bg-orange-400/10 border-orange-400/20";
  return "bg-red-400/10 border-red-400/20";
}

export function trustProgressColor(score: number): string {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  if (score >= 30) return "bg-orange-500";
  return "bg-red-500";
}

export function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    crypto: "Crypto",
    stocks: "Stocks",
    commodities: "Commodities",
    macro: "Macro",
    geopolitics: "Geopolitics",
  };
  return labels[category] || category;
}

export function categoryColor(category: string): string {
  const colors: Record<string, string> = {
    crypto: "bg-purple-600/20 text-purple-400",
    stocks: "bg-blue-600/20 text-blue-400",
    commodities: "bg-amber-600/20 text-amber-400",
    macro: "bg-cyan-600/20 text-cyan-400",
    geopolitics: "bg-rose-600/20 text-rose-400",
  };
  return colors[category] || "bg-zinc-600/20 text-zinc-400";
}
