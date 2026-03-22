import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NewsArticle } from "@/lib/types";
import { getFlagEmoji, getCountryName } from "@/lib/countries";
import { cn, formatTimeAgo, sentimentColor, sentimentLabel } from "@/lib/utils";

interface NewsArticleCardProps {
  article: NewsArticle;
  translatedTitle?: string;
  selected?: boolean;
  onClick?: () => void;
}

export function NewsArticleCard({ article, translatedTitle, selected, onClick }: NewsArticleCardProps) {
  const sentimentVariant =
    article.sentiment >= 0.3
      ? "success"
      : article.sentiment <= -0.3
      ? "destructive"
      : "warning";

  const countryName = getCountryName(article.countryCode);

  return (
    <div
      onClick={onClick}
      className={cn(
        "group cursor-pointer border-b border-zinc-800/50 px-4 py-3 transition-all",
        selected
          ? "bg-blue-500/5 border-l-2 border-l-blue-500"
          : "hover:bg-zinc-800/20"
      )}
    >
      <div className="flex items-start gap-2">
        <div className="mt-0.5 flex flex-col items-center gap-0.5 shrink-0">
          <span className="text-base leading-none">
            {getFlagEmoji(article.countryCode)}
          </span>
          <span className="text-[8px] font-medium text-zinc-500 leading-none text-center max-w-[40px] truncate">
            {countryName}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={cn(
            "text-xs font-medium leading-snug transition-colors",
            selected ? "text-blue-300" : "text-zinc-200 group-hover:text-cyan-300"
          )}>
            {translatedTitle || article.title}
          </h3>
          {translatedTitle && translatedTitle !== article.title && (
            <p className="mt-0.5 text-[10px] text-zinc-600 italic truncate">
              {article.title}
            </p>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">
              {countryName}
            </Badge>
            <span className="text-[10px] text-zinc-500">{article.source}</span>
            {article.journalist && (
              <>
                <span className="hidden sm:inline text-[10px] text-zinc-700">&middot;</span>
                <span className="hidden sm:inline text-[10px] text-zinc-500">
                  {article.journalist}
                </span>
              </>
            )}
            <span className="text-[10px] text-zinc-700">&middot;</span>
            <span className="text-[10px] text-zinc-600">
              {formatTimeAgo(article.publishedAt)}
            </span>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-zinc-700 hover:text-cyan-400 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        <Badge
          variant={sentimentVariant}
          className={cn("shrink-0 text-[10px]", sentimentColor(article.sentiment))}
        >
          {sentimentLabel(article.sentiment)}
        </Badge>
      </div>
    </div>
  );
}
