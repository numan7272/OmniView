import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NewsArticle } from "@/lib/types";
import { getFlagEmoji } from "@/lib/countries";
import { cn, formatTimeAgo, sentimentColor, sentimentLabel } from "@/lib/utils";

interface NewsArticleCardProps {
  article: NewsArticle;
}

export function NewsArticleCard({ article }: NewsArticleCardProps) {
  const sentimentVariant =
    article.sentiment >= 0.3
      ? "success"
      : article.sentiment <= -0.3
      ? "destructive"
      : "warning";

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border-b border-zinc-800/50 px-4 py-3 transition-colors hover:bg-zinc-800/20"
    >
      <div className="flex items-start gap-2">
        <span className="mt-0.5 text-base leading-none">
          {getFlagEmoji(article.countryCode)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-xs font-medium leading-snug text-zinc-200 group-hover:text-cyan-300 transition-colors">
            {article.title}
            <ExternalLink className="ml-1 inline h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-zinc-500">{article.source}</span>
            {article.journalist && (
              <>
                <span className="text-[10px] text-zinc-700">&middot;</span>
                <span className="text-[10px] text-zinc-500">
                  {article.journalist}
                </span>
              </>
            )}
            <span className="text-[10px] text-zinc-700">&middot;</span>
            <span className="text-[10px] text-zinc-600">
              {formatTimeAgo(article.publishedAt)}
            </span>
          </div>
        </div>
        <Badge
          variant={sentimentVariant}
          className={cn("shrink-0 text-[10px]", sentimentColor(article.sentiment))}
        >
          {sentimentLabel(article.sentiment)}
        </Badge>
      </div>
    </a>
  );
}
