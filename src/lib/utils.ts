export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export function getSentimentColor(score: number): string {
  if (score > 0.3) return "#10b981";
  if (score < -0.3) return "#ef4444";
  return "#f59e0b";
}

export function getSentimentLabel(score: number): string {
  if (score > 0.5) return "Bullish";
  if (score > 0.2) return "Positive";
  if (score < -0.5) return "Bearish";
  if (score < -0.2) return "Negative";
  return "Neutral";
}

export function getSignalColor(signal: string): string {
  switch (signal) {
    case "strong_buy": return "#10b981";
    case "buy": return "#34d399";
    case "hold": return "#f59e0b";
    case "sell": return "#f87171";
    case "strong_sell": return "#ef4444";
    default: return "#6b7280";
  }
}

export function getSignalLabel(signal: string): string {
  switch (signal) {
    case "strong_buy": return "STRONG BUY";
    case "buy": return "BUY";
    case "hold": return "HOLD";
    case "sell": return "SELL";
    case "strong_sell": return "STRONG SELL";
    default: return "N/A";
  }
}

export function getNeutralityLabel(score: number): string {
  if (score >= 85) return "Highly Neutral";
  if (score >= 70) return "Mostly Neutral";
  if (score >= 55) return "Slightly Biased";
  if (score >= 40) return "Moderately Biased";
  return "Highly Biased";
}

export function getNeutralityColor(score: number): string {
  if (score >= 85) return "#10b981";
  if (score >= 70) return "#34d399";
  if (score >= 55) return "#f59e0b";
  if (score >= 40) return "#fb923c";
  return "#ef4444";
}

export function formatPrice(price: number, decimals = 2): string {
  if (price >= 1000) return price.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return price.toFixed(decimals);
}
