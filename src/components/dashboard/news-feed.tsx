"use client";

import { Newspaper } from "lucide-react";
import { NewsArticle } from "@/lib/types";
import { NewsArticleCard } from "./news-article-card";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsFeedProps {
  articles: NewsArticle[];
  loading: boolean;
}

export function NewsFeed({ articles, loading }: NewsFeedProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <Newspaper className="h-4 w-4 text-emerald-400" />
        <h2 className="text-sm font-semibold">Live News Feed</h2>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-2 w-2 animate-live-pulse rounded-full bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">
            {articles.length} articles
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-zinc-600">
            No articles available.
          </div>
        ) : (
          articles.map((article) => (
            <NewsArticleCard key={article.id} article={article} />
          ))
        )}
      </div>
    </div>
  );
}
