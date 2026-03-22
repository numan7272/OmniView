"use client";

import { useState, useCallback } from "react";
import type { TrustAnalysisResult } from "@/lib/types";

export function useEvents() {
  const [data, setData] = useState<TrustAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      const res = await fetch(`/api/events?${params}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const result: TrustAnalysisResult = await res.json();
      setData(result);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch events";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchEvents };
}
