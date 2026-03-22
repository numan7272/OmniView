"use client";

import { cn } from "@/lib/utils";

interface RegionFilterProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  articleCounts: Record<string, number>;
}

const REGIONS = [
  { id: "all", label: "Alle", emoji: "🌍" },
  { id: "americas", label: "Amerika", emoji: "🌎" },
  { id: "europe", label: "Europa", emoji: "🇪🇺" },
  { id: "asia", label: "Asien", emoji: "🌏" },
  { id: "africa", label: "Afrika", emoji: "🌍" },
  { id: "middle-east", label: "Nahost", emoji: "🕌" },
];

const REGION_COUNTRIES: Record<string, string[]> = {
  americas: ["us", "ca", "br", "mx", "ar", "co", "cl", "pe"],
  europe: ["gb", "de", "fr", "it", "es", "nl", "pl", "se", "no", "ch", "at", "be", "ua", "cz", "dk", "fi", "ie", "pt", "ro", "gr"],
  asia: ["cn", "jp", "kr", "in", "id", "th", "vn", "ph", "my", "sg", "tw", "pk", "bd"],
  africa: ["za", "ng", "ke", "eg", "et", "gh", "tz", "ma"],
  "middle-east": ["sa", "ae", "il", "ir", "tr", "qa", "iq"],
};

export function getRegionForCountry(countryCode: string): string {
  const code = countryCode.toLowerCase();
  for (const [region, countries] of Object.entries(REGION_COUNTRIES)) {
    if (countries.includes(code)) return region;
  }
  return "other";
}

export function RegionFilter({
  selectedRegion,
  onRegionChange,
  articleCounts,
}: RegionFilterProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto px-4 py-2">
      {REGIONS.map((r) => {
        const count = r.id === "all"
          ? Object.values(articleCounts).reduce((a, b) => a + b, 0)
          : articleCounts[r.id] || 0;

        return (
          <button
            key={r.id}
            onClick={() => onRegionChange(r.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] transition-all",
              selectedRegion === r.id
                ? "bg-blue-600/20 text-blue-400 font-medium"
                : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
            )}
          >
            <span className="text-xs">{r.emoji}</span>
            <span>{r.label}</span>
            {count > 0 && (
              <span className="font-mono text-[9px] text-zinc-600">
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
