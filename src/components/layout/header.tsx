"use client";

import { useEffect, useState } from "react";
import { Globe, Activity, Wifi, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, sentimentColor } from "@/lib/utils";

interface HeaderProps {
  globalSentiment: number;
  articleCount: number;
  clusterCount: number;
  dataSource: string;
}

export function Header({
  globalSentiment,
  articleCount,
  clusterCount,
  dataSource,
}: HeaderProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "UTC",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between border-b border-zinc-800 bg-[#0c0c14] px-6 py-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-400" />
          <h1 className="text-lg font-bold tracking-tight">
            <span className="text-blue-400">Omni</span>
            <span className="text-zinc-100">View</span>
            <span className="ml-1 text-xs font-normal text-zinc-500">AI</span>
          </h1>
        </div>
        <div className="h-4 w-px bg-zinc-800" />
        <span className="font-mono text-xs text-zinc-500">{time} UTC</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-zinc-500" />
          <span className="text-xs text-zinc-500">Sentiment</span>
          <span
            className={cn(
              "font-mono text-xs font-semibold",
              sentimentColor(globalSentiment)
            )}
          >
            {globalSentiment >= 0 ? "+" : ""}
            {(globalSentiment * 100).toFixed(1)}%
          </span>
        </div>

        <div className="h-4 w-px bg-zinc-800" />

        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span>
            <span className="font-mono text-zinc-300">{articleCount}</span>{" "}
            articles
          </span>
          <span>
            <span className="font-mono text-zinc-300">{clusterCount}</span>{" "}
            clusters
          </span>
        </div>

        <div className="h-4 w-px bg-zinc-800" />

        <Badge
          variant={dataSource === "connecting" ? "warning" : "success"}
          className="gap-1"
        >
          {dataSource === "connecting" ? (
            <Radio className="h-3 w-3" />
          ) : (
            <Wifi className="h-3 w-3" />
          )}
          {dataSource === "connecting" ? "Connecting..." : "Live"}
        </Badge>
      </div>
    </header>
  );
}
