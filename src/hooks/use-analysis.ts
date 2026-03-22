"use client";

import { useState, useCallback } from "react";
import { NewsArticle, AnalysisResult } from "@/lib/types";

export function useAnalysis() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);

  const analyze = useCallback(
    async (articles: NewsArticle[], topic?: string) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articles, topic }),
        });

        const data = await res.json();

        if (data.error && !data.clusters) {
          throw new Error(data.error);
        }

        setAnalysis(data as AnalysisResult);
        setSource(data.source || "unknown");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Analysis failed"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { analysis, loading, error, source, analyze };
}
