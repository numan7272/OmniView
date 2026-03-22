"use client";

import { UserSearch } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Journalist } from "@/lib/types";
import { getFlagEmoji } from "@/lib/countries";
import { Skeleton } from "@/components/ui/skeleton";

interface BiasTrackerProps {
  journalists: Journalist[];
  loading: boolean;
}

function neutralityVariant(score: number) {
  if (score >= 70) return "success" as const;
  if (score >= 50) return "warning" as const;
  return "destructive" as const;
}

function neutralityBarColor(score: number) {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

export function BiasTracker({ journalists, loading }: BiasTrackerProps) {
  const sorted = [...journalists].sort(
    (a, b) => b.neutralityScore - a.neutralityScore
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <UserSearch className="h-4 w-4 text-amber-400" />
        <h2 className="text-sm font-semibold">Bias Tracker</h2>
        <span className="ml-auto text-xs text-zinc-500">
          {journalists.length} journalists tracked
        </span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Journalist</TableHead>
                <TableHead className="text-xs">Outlet</TableHead>
                <TableHead className="text-xs">Neutrality</TableHead>
                <TableHead className="w-24 text-xs">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((j) => (
                <TableRow key={j.id}>
                  <TableCell className="py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {getFlagEmoji(j.countryCode)}
                      </span>
                      <span className="text-xs font-medium">{j.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <span className="text-xs text-zinc-400">{j.outlet}</span>
                  </TableCell>
                  <TableCell className="py-2">
                    <Badge
                      variant={neutralityVariant(j.neutralityScore)}
                      className="text-[10px]"
                    >
                      {j.neutralityScore}/100
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2">
                    <Progress
                      value={j.neutralityScore}
                      className="h-1.5"
                      indicatorClassName={neutralityBarColor(j.neutralityScore)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
