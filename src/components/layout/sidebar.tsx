"use client";

import {
  LayoutDashboard,
  Network,
  UserSearch,
  TrendingUp,
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
  { id: "bias", icon: UserSearch, label: "Bias Tracker" },
  { id: "signals", icon: TrendingUp, label: "Signals" },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="flex w-14 flex-col items-center border-r border-zinc-800 bg-[#0c0c14] py-4">
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
        className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-600 transition-all hover:bg-zinc-800 hover:text-zinc-400"
        title="Settings"
      >
        <Settings className="h-5 w-5" />
      </button>
    </aside>
  );
}
