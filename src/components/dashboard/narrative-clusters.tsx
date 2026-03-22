"use client";

import { Network, Loader2 } from "lucide-react";
import { NarrativeCluster } from "@/lib/types";
import { ClusterCard } from "./cluster-card";
import { Skeleton } from "@/components/ui/skeleton";

interface NarrativeClustersProps {
  clusters: NarrativeCluster[];
  loading: boolean;
}

export function NarrativeClusters({
  clusters,
  loading,
}: NarrativeClustersProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <Network className="h-4 w-4 text-blue-400" />
        <h2 className="text-sm font-semibold">Narrative Clusters</h2>
        {loading && (
          <Loader2 className="ml-auto h-3.5 w-3.5 animate-spin text-blue-400" />
        )}
        {!loading && (
          <span className="ml-auto text-xs text-zinc-500">
            {clusters.length} clusters detected
          </span>
        )}
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {loading ? (
          <>
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </>
        ) : clusters.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-zinc-600">
            No clusters detected. Run analysis to generate clusters.
          </div>
        ) : (
          clusters.map((cluster) => (
            <ClusterCard key={cluster.id} cluster={cluster} />
          ))
        )}
      </div>
    </div>
  );
}
