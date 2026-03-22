"use client";

import { useState, useEffect } from "react";
import { Settings, Check, X, Key, Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProviderInfo {
  id: string;
  name: string;
  model: string;
  description: string;
  configured: boolean;
}

interface SettingsPanelProps {
  activeProvider: string | null;
  onProviderChange: (provider: string) => void;
}

export function SettingsPanel({
  activeProvider,
  onProviderChange,
}: SettingsPanelProps) {
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/providers")
      .then((r) => r.json())
      .then((data) => {
        setProviders(data.providers || []);
        if (!activeProvider && data.active) {
          onProviderChange(data.active);
        }
      })
      .finally(() => setLoading(false));
  }, [activeProvider, onProviderChange]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <Settings className="h-4 w-4 text-zinc-400" />
        <h2 className="text-sm font-semibold">Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Provider Selection */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            <Bot className="h-3.5 w-3.5" />
            AI Provider
          </h3>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-lg bg-zinc-800/50" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {providers.map((p) => (
                <Card
                  key={p.id}
                  className={cn(
                    "cursor-pointer border transition-all",
                    activeProvider === p.id
                      ? "border-blue-500/50 bg-blue-500/5"
                      : p.configured
                      ? "border-zinc-800 hover:border-zinc-600"
                      : "border-zinc-800/50 opacity-50"
                  )}
                  onClick={() => {
                    if (p.configured) onProviderChange(p.id);
                  }}
                >
                  <CardContent className="flex items-center gap-3 p-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold",
                        p.id === "anthropic"
                          ? "bg-orange-500/10 text-orange-400"
                          : p.id === "openai"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-blue-500/10 text-blue-400"
                      )}
                    >
                      {p.id === "anthropic" ? "C" : p.id === "openai" ? "G" : "G"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{p.name}</span>
                        {activeProvider === p.id && (
                          <Badge variant="success" className="text-[9px]">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500">{p.description}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-zinc-600">
                        {p.model}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {p.configured ? (
                        <div className="flex items-center gap-1 text-emerald-400">
                          <Check className="h-4 w-4" />
                          <span className="text-[10px]">Ready</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-zinc-600">
                          <X className="h-4 w-4" />
                          <span className="text-[10px]">No Key</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* API Key Instructions */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            <Key className="h-3.5 w-3.5" />
            API Keys
          </h3>
          <Card className="border-zinc-800/50">
            <CardContent className="space-y-3 p-3 text-xs text-zinc-400">
              <p>Add API keys to <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">.env.local</code>:</p>
              <div className="space-y-1.5 rounded-lg bg-zinc-900 p-3 font-mono text-[11px]">
                <div>
                  <span className="text-zinc-600"># Anthropic (Claude)</span>
                </div>
                <div>
                  <span className="text-orange-400">ANTHROPIC_API_KEY</span>
                  <span className="text-zinc-600">=sk-ant-...</span>
                </div>
                <div className="pt-1">
                  <span className="text-zinc-600"># OpenAI (ChatGPT)</span>
                </div>
                <div>
                  <span className="text-green-400">OPENAI_API_KEY</span>
                  <span className="text-zinc-600">=sk-...</span>
                </div>
                <div className="pt-1">
                  <span className="text-zinc-600"># Google (Gemini)</span>
                </div>
                <div>
                  <span className="text-blue-400">GEMINI_API_KEY</span>
                  <span className="text-zinc-600">=AI...</span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-600">
                Restart the dev server after adding keys. You can use multiple providers simultaneously.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
