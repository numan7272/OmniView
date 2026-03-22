"use client";

import {
  X,
  ExternalLink,
  MessageSquare,
  Eye,
  Globe,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NewsArticle } from "@/lib/types";
import { getFlagEmoji } from "@/lib/countries";
import { cn, formatTimeAgo, sentimentColor, sentimentLabel } from "@/lib/utils";

interface ArticleDetailProps {
  article: NewsArticle;
  onClose: () => void;
  onAnalyzeInChat?: (article: NewsArticle) => void;
  onAddToWatchlist?: (topic: string) => void;
}

export function ArticleDetail({
  article,
  onClose,
  onAnalyzeInChat,
  onAddToWatchlist,
}: ArticleDetailProps) {
  return (
    <div className="flex h-full flex-col border-l border-zinc-800 bg-[#0c0c14]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <span className="text-xs font-semibold text-zinc-400">
          Artikeldetails
        </span>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Country + Source */}
        <div className="flex items-center gap-2">
          <span className="text-xl">{getFlagEmoji(article.countryCode)}</span>
          <div>
            <p className="text-xs font-medium text-zinc-300">{article.source}</p>
            <p className="text-[10px] text-zinc-500">{article.country}</p>
          </div>
          <Badge
            variant={
              article.sentiment >= 0.3
                ? "success"
                : article.sentiment <= -0.3
                ? "destructive"
                : "warning"
            }
            className="ml-auto"
          >
            {sentimentLabel(article.sentiment)}
          </Badge>
        </div>

        {/* Title */}
        <h2 className="text-sm font-semibold leading-snug text-zinc-100">
          {article.title}
        </h2>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-2">
          {article.journalist && (
            <div className="flex items-center gap-1.5 rounded-lg bg-zinc-900/50 p-2">
              <User className="h-3 w-3 text-zinc-500" />
              <span className="text-[10px] text-zinc-400">
                {article.journalist}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 rounded-lg bg-zinc-900/50 p-2">
            <Clock className="h-3 w-3 text-zinc-500" />
            <span className="text-[10px] text-zinc-400">
              {formatTimeAgo(article.publishedAt)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-zinc-900/50 p-2">
            <Globe className="h-3 w-3 text-zinc-500" />
            <span className="text-[10px] text-zinc-400">{article.language}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-zinc-900/50 p-2">
            <span
              className={cn(
                "font-mono text-[10px] font-semibold",
                sentimentColor(article.sentiment)
              )}
            >
              Sentiment: {(article.sentiment * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Description */}
        {article.description && (
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
              Beschreibung
            </span>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              {article.description}
            </p>
          </div>
        )}

        {/* Sentiment visualization */}
        <div className="rounded-lg border border-zinc-800 p-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
            Stimmungsanalyse
          </span>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  article.sentiment >= 0.3
                    ? "bg-emerald-500"
                    : article.sentiment <= -0.3
                    ? "bg-red-500"
                    : "bg-amber-500"
                )}
                style={{ width: `${((article.sentiment + 1) / 2) * 100}%` }}
              />
            </div>
            <span
              className={cn(
                "font-mono text-xs font-bold",
                sentimentColor(article.sentiment)
              )}
            >
              {article.sentiment >= 0 ? "+" : ""}
              {(article.sentiment * 100).toFixed(0)}
            </span>
          </div>
          <div className="mt-1 flex justify-between text-[9px] text-zinc-700">
            <span>Negativ</span>
            <span>Neutral</span>
            <span>Positiv</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-zinc-800 p-3 space-y-2">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600/20 px-3 py-2 text-xs font-medium text-blue-400 transition-colors hover:bg-blue-600/30"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Originalartikel lesen
        </a>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-[11px]"
            onClick={() => onAnalyzeInChat?.(article)}
          >
            <MessageSquare className="h-3 w-3" />
            Im Chat analysieren
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-[11px]"
            onClick={() => {
              const topic = article.title.split(" ").slice(0, 4).join(" ");
              onAddToWatchlist?.(topic);
            }}
          >
            <Eye className="h-3 w-3" />
            Beobachten
          </Button>
        </div>
      </div>
    </div>
  );
}
