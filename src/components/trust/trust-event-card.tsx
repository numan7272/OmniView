"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ExternalLink,
  Shield,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Newspaper,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrustScoreBadge } from "./trust-score-badge";
import type { TrustEvent } from "@/lib/types";
import {
  cn,
  formatTimeAgo,
  categoryLabel,
  categoryColor,
  trustColor,
  trustProgressColor,
  sentimentColor,
  sentimentLabel,
} from "@/lib/utils";

interface TrustEventCardProps {
  event: TrustEvent;
}

export function TrustEventCard({ event }: TrustEventCardProps) {
  const [expanded, setExpanded] = useState(false);

  const signal = event.signal;
  const directionConfig = signal
    ? {
        buy: { icon: TrendingUp, color: "text-emerald-400", label: "BUY" },
        sell: { icon: TrendingDown, color: "text-red-400", label: "SELL" },
        hold: { icon: Minus, color: "text-amber-400", label: "HOLD" },
      }[signal.direction]
    : null;

  return (
    <Card
      className={cn(
        "border transition-all cursor-pointer hover:border-zinc-600",
        expanded && "border-zinc-600"
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <CardContent className="p-4">
        {/* Top row: Trust score + Event title + Category */}
        <div className="flex items-start gap-3">
          <TrustScoreBadge
            score={event.trustScore}
            label={event.trustLabel}
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-zinc-100 leading-tight">
                {event.title}
              </h3>
              <Badge className={cn("text-[10px] shrink-0", categoryColor(event.category))}>
                {categoryLabel(event.category)}
              </Badge>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
              {event.summary}
            </p>
          </div>

          {/* Signal badge if present */}
          {signal && directionConfig && (
            <Badge
              variant={signal.direction === "buy" ? "success" : signal.direction === "sell" ? "destructive" : "warning"}
              className="text-xs font-bold px-2 shrink-0"
            >
              {directionConfig.label}
            </Badge>
          )}
        </div>

        {/* Meta row: sources, assets, sentiment, time */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <div className="flex items-center gap-1 text-[10px] text-zinc-500">
            <Newspaper className="h-3 w-3" />
            <span>{event.sources.length} Quellen</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-zinc-500">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            <span>{event.agreements.length} Übereinstimmungen</span>
          </div>
          {event.contradictions.length > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-zinc-500">
              <XCircle className="h-3 w-3 text-red-400" />
              <span>{event.contradictions.length} Widersprüche</span>
            </div>
          )}
          <div className={cn("flex items-center gap-1 text-[10px]", sentimentColor(event.sentiment))}>
            <Shield className="h-3 w-3" />
            <span>{sentimentLabel(event.sentiment)}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-zinc-500 ml-auto">
            <Clock className="h-3 w-3" />
            <span>{formatTimeAgo(event.timestamp)}</span>
          </div>
        </div>

        {/* Trust score bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-zinc-500">Trust Score</span>
            <span className={cn("font-mono font-bold", trustColor(event.trustScore))}>
              {event.trustScore}/100
            </span>
          </div>
          <Progress
            value={event.trustScore}
            className="h-1.5"
            indicatorClassName={trustProgressColor(event.trustScore)}
          />
        </div>

        {/* Relevant assets */}
        {event.relevantAssets.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {event.relevantAssets.map((asset) => (
              <Badge key={asset} variant="outline" className="text-[10px] font-mono">
                {asset}
              </Badge>
            ))}
          </div>
        )}

        {/* Expand toggle */}
        <div className="mt-2 flex items-center justify-center">
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5 text-zinc-600" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-zinc-600" />
          )}
        </div>

        {/* Expanded: Claims, Agreements, Contradictions, Sources */}
        {expanded && (
          <div className="mt-3 space-y-4 border-t border-zinc-800 pt-3">
            {/* Trust Score Breakdown */}
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Trust-Aufschlüsselung
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                {[
                  { label: "Quellen", value: event.trustBreakdown.sourceCount, max: 30 },
                  { label: "Übereinstimmung", value: event.trustBreakdown.agreementRate, max: 35 },
                  { label: "Diversität", value: event.trustBreakdown.sourceDiversity, max: 20 },
                  { label: "Aktualität", value: event.trustBreakdown.recency, max: 15 },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-zinc-900/50 p-2">
                    <span className="text-[9px] text-zinc-600">{item.label}</span>
                    <p className="font-mono text-xs font-medium text-zinc-300">
                      {item.value}/{item.max}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Claims */}
            {event.claims.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Kernaussagen ({event.claims.length})
                </span>
                <div className="mt-2 space-y-1.5">
                  {event.claims.map((claim) => (
                    <div
                      key={claim.id}
                      className="flex items-start gap-2 text-[11px] rounded-lg bg-zinc-900/50 p-2"
                    >
                      <ArrowRight className="h-3 w-3 mt-0.5 shrink-0 text-blue-400" />
                      <div className="min-w-0">
                        <p className="text-zinc-300">{claim.text}</p>
                        <span className="text-zinc-600 text-[9px]">{claim.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agreements */}
            {event.agreements.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
                  Übereinstimmungen ({event.agreements.length})
                </span>
                <div className="mt-2 space-y-1.5">
                  {event.agreements.map((comp, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-2"
                    >
                      <div className="flex items-center gap-2 text-[10px]">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                        <span className="text-zinc-400">{comp.sourceA}</span>
                        <span className="text-zinc-600">&</span>
                        <span className="text-zinc-400">{comp.sourceB}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">{comp.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contradictions */}
            {event.contradictions.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400">
                  Widersprüche ({event.contradictions.length})
                </span>
                <div className="mt-2 space-y-1.5">
                  {event.contradictions.map((comp, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-red-500/5 border border-red-500/10 p-2"
                    >
                      <div className="flex items-center gap-2 text-[10px]">
                        <XCircle className="h-3 w-3 text-red-400 shrink-0" />
                        <span className="text-zinc-400">{comp.sourceA}</span>
                        <span className="text-zinc-600">vs</span>
                        <span className="text-zinc-400">{comp.sourceB}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">{comp.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sources list */}
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Quellen ({event.sources.length})
              </span>
              <div className="mt-2 space-y-1">
                {event.sources.map((src, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px]">
                    <Newspaper className="h-3 w-3 text-zinc-600 shrink-0" />
                    <span className="text-zinc-300">{src.name}</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-zinc-500">{src.country}</span>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-400 hover:text-blue-300 ml-auto"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Trading Signal detail */}
            {signal && directionConfig && (
              <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-3">
                <div className="flex items-center gap-2">
                  <directionConfig.icon className={cn("h-4 w-4", directionConfig.color)} />
                  <span className="text-xs font-semibold">{signal.asset}</span>
                  <Badge
                    variant={signal.direction === "buy" ? "success" : signal.direction === "sell" ? "destructive" : "warning"}
                    className="text-[10px]"
                  >
                    {directionConfig.label}
                  </Badge>
                  <span className="text-[10px] text-zinc-500 ml-auto">
                    Confidence: {(signal.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-2">{signal.reasoning}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
