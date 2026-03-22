"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { NarrativeCluster } from "@/lib/types";
import { getFlagEmoji } from "@/lib/countries";
import { cn, sentimentColor, sentimentLabel } from "@/lib/utils";

interface ClusterCardProps {
  cluster: NarrativeCluster;
}

export function ClusterCard({ cluster }: ClusterCardProps) {
  const [expanded, setExpanded] = useState(false);

  const sentimentPercent = ((cluster.sentimentScore + 1) / 2) * 100;
  const sentimentIndicatorClass =
    cluster.sentimentScore >= 0.3
      ? "bg-emerald-500"
      : cluster.sentimentScore <= -0.3
      ? "bg-red-500"
      : "bg-amber-500";

  return (
    <Card className="transition-all hover:border-zinc-700">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-semibold">
            {cluster.label}
          </CardTitle>
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "text-xs font-mono font-semibold",
                sentimentColor(cluster.sentimentScore)
              )}
            >
              {sentimentLabel(cluster.sentimentScore)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Country flags */}
        <div className="flex flex-wrap gap-1">
          {cluster.countries.map((code) => (
            <Badge key={code} variant="outline" className="gap-1 text-xs">
              <span>{getFlagEmoji(code)}</span>
              <span className="uppercase">{code}</span>
            </Badge>
          ))}
        </div>

        {/* Sentiment bar */}
        <div className="space-y-1">
          <Progress
            value={sentimentPercent}
            className="h-1.5"
            indicatorClassName={sentimentIndicatorClass}
          />
          <div className="flex justify-between text-[10px] text-zinc-600">
            <span>Negative</span>
            <span>Neutral</span>
            <span>Positive</span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-xs leading-relaxed text-zinc-400">
          {cluster.summary}
        </p>

        {/* Topics */}
        <div className="flex flex-wrap gap-1">
          {cluster.keyTopics.map((topic) => (
            <Badge key={topic} variant="secondary" className="text-[10px]">
              {topic}
            </Badge>
          ))}
        </div>

        {/* Article count + expand */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between rounded-md border border-zinc-800 px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-zinc-800/50 hover:text-zinc-300"
        >
          <span>
            {cluster.articleCount} article
            {cluster.articleCount !== 1 ? "s" : ""}
          </span>
          {expanded ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>

        {expanded && cluster.articles.length > 0 && (
          <div className="space-y-2 border-t border-zinc-800 pt-2">
            {cluster.articles.map((article) => (
              <div key={article.id} className="text-xs">
                <div className="flex items-center gap-1.5">
                  <span>{getFlagEmoji(article.countryCode)}</span>
                  <span className="font-medium text-zinc-300">
                    {article.title}
                  </span>
                </div>
                <span className="text-zinc-600">
                  {article.source} &middot; {article.journalist || "Unknown"}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
