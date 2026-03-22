"use client";

import { useState } from "react";
import { Search, Bell, Globe2, Settings, TrendingUp, Menu, X } from "lucide-react";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#060c18] border-b border-[#1e293b] sticky top-0 z-50">
      <div className="max-w-[1800px] mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="relative">
            <Globe2 className="w-7 h-7 text-[#3b82f6]" />
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400 absolute -bottom-1 -right-1" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none tracking-tight">
              OmniView<span className="text-[#3b82f6]"> AI</span>
            </h1>
            <p className="text-[10px] text-[#475569] tracking-widest uppercase leading-none mt-0.5">
              Global Sentiment Engine
            </p>
          </div>
        </div>

        {/* Nav - desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {["Dashboard", "Narratives", "Bias Tracker", "Signals", "Markets"].map((item) => (
            <button
              key={item}
              className="px-3 py-1.5 text-sm text-[#94a3b8] hover:text-white hover:bg-[#1e293b] rounded-md transition-colors"
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Search + actions */}
        <div className="flex items-center gap-2">
          {searchOpen ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                placeholder="Search topics, countries, reporters…"
                className="bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-1.5 text-sm text-white placeholder-[#475569] outline-none focus:border-[#3b82f6] w-64 transition-all"
                onBlur={() => setSearchOpen(false)}
              />
              <button onClick={() => setSearchOpen(false)} className="text-[#475569] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-[#475569] hover:text-white hover:bg-[#1e293b] rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          <button className="p-2 text-[#475569] hover:text-white hover:bg-[#1e293b] rounded-lg transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>

          <button className="p-2 text-[#475569] hover:text-white hover:bg-[#1e293b] rounded-lg transition-colors hidden sm:block">
            <Settings className="w-4 h-4" />
          </button>

          <div className="w-8 h-8 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-sm font-bold">
            N
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-[#475569] hover:text-white hover:bg-[#1e293b] rounded-lg transition-colors lg:hidden"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="lg:hidden bg-[#060c18] border-t border-[#1e293b] px-4 py-2 flex flex-col gap-1">
          {["Dashboard", "Narratives", "Bias Tracker", "Signals", "Markets"].map((item) => (
            <button
              key={item}
              className="px-3 py-2 text-sm text-[#94a3b8] hover:text-white hover:bg-[#1e293b] rounded-md transition-colors text-left"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
