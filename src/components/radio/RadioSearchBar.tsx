"use client";

import { useMemo, useState } from "react";
import { RadioStation } from "@/domain/radio";
import { useTranslations } from "next-intl";
import { Search, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RadioSearchBarProps {
  stations: RadioStation[];
  loading?: boolean;
  onSelect: (station: RadioStation) => void;
}

export function RadioSearchBar({ stations, loading, onSelect }: RadioSearchBarProps) {
  const t = useTranslations("radio");
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredStations = useMemo(() => {
    if (!normalizedQuery) return [];

    return stations
      .filter((station) => {
        const haystack = [
          station.name,
          station.country,
          station.countryCode,
          ...(station.language || []),
          ...(station.tags || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      })
      .slice(0, 15);
  }, [normalizedQuery, stations]);

  const handleSelect = (station: RadioStation) => {
    onSelect(station);
    setQuery("");
  };

  return (
    <div className="absolute top-6 left-4 z-50 w-[calc(100%-2rem)] max-w-xl">
      <div className="flex items-center gap-2 bg-black/70 backdrop-blur-lg border border-white/10 rounded-2xl px-3 py-2 shadow-lg">
        <Search className="w-4 h-4 text-white/50" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search_placeholder")}
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
        />

        {loading ? (
          <Loader2 className="w-4 h-4 text-white/60 animate-spin" />
        ) : query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="p-1 rounded-full hover:bg-white/10 text-white/60"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {query && (
        <div className="mt-2 max-h-72 overflow-y-auto bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl divide-y divide-white/5">
          {filteredStations.length === 0 ? (
            <div className="p-4 text-sm text-white/60 text-center">{t("no_stations")}</div>
          ) : (
            filteredStations.map((station) => (
              <button
                key={station.id}
                onClick={() => handleSelect(station)}
                className="w-full text-left px-4 py-3 hover:bg-white/5 transition flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/60">
                  {station.countryCode || station.country?.slice(0, 2)?.toUpperCase() || ""}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{station.name}</p>
                  <p className="text-xs text-white/50 truncate">
                    {station.country}
                    {station.language?.length ? ` · ${station.language.join(', ')}` : ''}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-[10px] px-2 py-1 rounded-full border",
                    "border-white/10 text-white/60 bg-white/5"
                  )}
                >
                  {t("listen")}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

