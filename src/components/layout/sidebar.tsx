"use client";

import {
  LayoutDashboard,
  Network,
  UserSearch,
  TrendingUp,
  MessageSquare,
  Eye,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "clusters", icon: Network, label: "Clusters" },
  { id: "bias", icon: UserSearch, label: "Bias" },
  { id: "signals", icon: TrendingUp, label: "Signals" },
  { id: "chat", icon: MessageSquare, label: "Chat" },
  { id: "watchlist", icon: Eye, label: "Watch" },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden sm:flex w-14 flex-col items-center border-r border-zinc-800 bg-[#0c0c14] py-4">
        <nav className="flex flex-1 flex-col items-center gap-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "group flex h-10 w-10 items-center justify-center rounded-lg transition-all",
                activeTab === item.id
                  ? "bg-blue-600/20 text-blue-400"
                  : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
              )}
              title={item.label}
            >
              <item.icon className="h-5 w-5" />
            </button>
          ))}
        </nav>

        <button
          onClick={() => onTabChange("settings")}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg transition-all",
            activeTab === "settings"
              ? "bg-blue-600/20 text-blue-400"
              : "text-zinc-600 hover:bg-zinc-800 hover:text-zinc-400"
          )}
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </button>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex sm:hidden items-center justify-around border-t border-zinc-800 bg-[#0c0c14] px-1 py-1 safe-area-bottom">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 transition-all min-w-[44px]",
              activeTab === item.id
                ? "text-blue-400"
                : "text-zinc-500"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[9px]">{item.label}</span>
          </button>
        ))}
        <button
          onClick={() => onTabChange("settings")}
          className={cn(
            "flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 transition-all min-w-[44px]",
            activeTab === "settings"
              ? "text-blue-400"
              : "text-zinc-500"
          )}
        >
          <Settings className="h-5 w-5" />
          <span className="text-[9px]">Settings</span>
        </button>
      </nav>
    </>
  );
}
