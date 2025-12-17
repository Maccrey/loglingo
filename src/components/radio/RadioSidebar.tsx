"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRadioFavorites } from "@/hooks/useRadioFavorites";
import { useRadioStats } from "@/hooks/useRadioStats";
import { RadioStation } from "@/domain/radio";
import { cn } from "@/lib/utils";
import { Play, Trash2, BarChart2, Radio, X, ListMusic } from "lucide-react";

interface RadioSidebarProps {
  onStationSelect: (station: RadioStation) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function RadioSidebar({ onStationSelect, isOpen, onClose }: RadioSidebarProps) {
  const t = useTranslations('radio');
  const [activeTab, setActiveTab] = useState<'favorites' | 'stats'>('favorites');
  
  const { favorites, loading: favLoading, toggleFavorite } = useRadioFavorites();
  const { stats, loading: statsLoading, refreshStats } = useRadioStats();

  return (
    <div className={cn(
      "absolute top-0 right-0 h-full w-80 bg-black/80 backdrop-blur-xl border-l border-white/10 transition-transform duration-300 z-40 flex flex-col pt-16 md:pt-4",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex bg-white/10 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('favorites')}
            className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition", activeTab === 'favorites' ? "bg-primary text-white" : "hover:text-white text-white/60")}
          >
            {t('favorites')}
          </button>
          <button
            onClick={() => {
                setActiveTab('stats');
                refreshStats();
            }}
            className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition", activeTab === 'stats' ? "bg-primary text-white" : "hover:text-white text-white/60")}
          >
            {t('listening_time')}
          </button>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white md:hidden">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'favorites' ? (
          <div className="space-y-2">
            {favLoading ? (
              <p className="text-white/40 text-sm p-4 text-center">Loading...</p>
            ) : favorites.length === 0 ? (
              <div className="text-center py-8 text-white/40">
                <Radio className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No favorites yet.</p>
              </div>
            ) : (
              favorites.map((fav) => (
                <div key={fav.id} className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <img 
                      src={fav.stationFavicon || ''} 
                      onError={(e) => (e.currentTarget.src = 'https://placehold.co/40x40/black/white?text=R')}
                      alt={fav.stationName.substring(0,2)} 
                      className="w-full h-full rounded-full object-cover p-1" // rudimentary cleanup
                    />
                  </div>
                  <div className="flex-1 min-w-0" onClick={() => onStationSelect(fav as unknown as RadioStation)} role="button">
                    <h4 className="text-sm font-medium text-white truncate group-hover:text-primary transition">{fav.stationName}</h4>
                    <p className="text-xs text-white/40 truncate">{fav.country}</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(fav as unknown as RadioStation);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Total Time */}
            <div className="bg-gradient-to-br from-primary/20 to-accent/10 p-4 rounded-xl border border-primary/20">
              <h4 className="text-xs text-primary/80 uppercase tracking-wider mb-1">{t('total')}</h4>
              <p className="text-3xl font-bold text-white">
                {Math.floor((stats?.totalSeconds || 0) / 60)} <span className="text-sm font-normal text-white/60">min</span>
              </p>
            </div>

            {/* By Language */}
            <div>
              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-primary" />
                {t('by_language')}
              </h4>
              <div className="space-y-2">
                {stats && Object.entries(stats.byLanguage).length > 0 ? (
                   Object.entries(stats.byLanguage)
                    .sort(([, a], [, b]) => b - a)
                    .map(([lang, seconds]) => (
                      <div key={lang} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5">
                        <span className="text-sm text-white/80 uppercase">{lang}</span>
                        <span className="text-xs font-mono text-white/60">{Math.floor(seconds / 60)} min</span>
                      </div>
                    ))
                ) : (
                  <p className="text-white/40 text-xs">No listening data yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
