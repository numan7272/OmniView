"use client";

import { useState, useEffect, useCallback } from "react";
import { NewsArticle } from "@/lib/types";

export function useNews(pollInterval: number = 60000) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>("loading");

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      setArticles(data.articles || []);
      setSource(data.source || "unknown");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch news");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, pollInterval);
    return () => clearInterval(interval);
  }, [fetchNews, pollInterval]);

  return { articles, loading, error, source, refetch: fetchNews };
}
