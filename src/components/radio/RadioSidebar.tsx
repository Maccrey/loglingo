"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRadioFavoritesContext } from "@/application/radio/RadioFavoritesProvider";
import { useRadioStats } from "@/hooks/useRadioStats";
import { RadioStation, RadioStats } from "@/domain/radio";
import { cn } from "@/lib/utils";
import { Play, Trash2, BarChart2, Radio, X, ListMusic } from "lucide-react";

interface RadioSidebarProps {
  onStationSelect: (station: RadioStation) => void;
  isOpen: boolean;
  onClose: () => void;
  stats: RadioStats | null;
  statsLoading: boolean;
  refreshStats: () => void;
}

export default function RadioSidebar({ 
  onStationSelect, 
  isOpen, 
  onClose,
  stats,
  statsLoading,
  refreshStats
}: RadioSidebarProps) {
  const t = useTranslations('radio');
  const [activeTab, setActiveTab] = useState<'favorites' | 'stats'>('favorites');
  
  const { favorites, loading: favLoading, toggleFavorite } = useRadioFavoritesContext();

  // Auto-refresh stats every 60 seconds when stats tab is active
  useEffect(() => {
    if (activeTab === 'stats') {
      const interval = setInterval(() => {
        console.log('🔄 Auto-refreshing stats...');
        refreshStats();
      }, 60000); // 60 seconds

      return () => clearInterval(interval);
    }
  }, [activeTab, refreshStats]);

  // Convert RadioFavorite to RadioStation format
  const convertFavoriteToStation = (fav: any): RadioStation => ({
    id: fav.id,
    name: fav.stationName,
    url: fav.stationUrl,
    urlResolved: fav.stationUrl, // Use same URL as fallback
    homepage: '',
    favicon: fav.stationFavicon || '',
    tags: [],
    country: fav.country || '',
    countryCode: '',
    language: fav.language ? [fav.language] : [],
    votes: 0,
    geoLat: fav.coordinates?.latitude || null,
    geoLong: fav.coordinates?.longitude || null,
    codec: ''
  });

  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-full sm:w-1/3 bg-black/80 backdrop-blur-xl border-l border-white/10 transition-transform duration-300 z-40 flex flex-col pt-16 md:pt-20",
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
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
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
                      src={fav.stationFavicon || 'https://placehold.co/40x40/000000/ffffff?text=📻'} 
                      onError={(e) => (e.currentTarget.src = 'https://placehold.co/40x40/000000/ffffff?text=📻')}
                      alt={fav.stationName} 
                      className="w-full h-full rounded-full object-cover" 
                    />
                  </div>
                  <div 
                    className="flex-1 min-w-0 cursor-pointer" 
                    onClick={() => onStationSelect(convertFavoriteToStation(fav))}
                    role="button"
                  >
                    <h4 className="text-sm font-medium text-white truncate group-hover:text-primary transition">{fav.stationName}</h4>
                    <p className="text-xs text-white/40 truncate">{fav.country}</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(convertFavoriteToStation(fav));
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
                {(() => {
                  if (!stats?.byLanguage || Object.keys(stats.byLanguage).length === 0) {
                    return <p className="text-white/40 text-xs">No listening data yet.</p>;
                  }
                  
                  // Combine U and Unknown into "Other"
                  const combined: Record<string, number> = {};
                  let otherTotal = 0;
                  
                  Object.entries(stats.byLanguage).forEach(([lang, seconds]) => {
                    if (lang === 'U' || lang === 'Unknown') {
                      otherTotal += seconds as number;
                    } else {
                      combined[lang] = seconds as number;
                    }
                  });
                  
                  // Add "Other" if there's any unknown time
                  if (otherTotal > 0) {
                    combined['Other'] = otherTotal;
                  }
                  
                  return Object.entries(combined)
                    .sort(([, a], [, b]) => b - a)
                    .map(([lang, seconds]) => (
                      <div key={lang} className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
                        <span className="text-sm text-white/80 uppercase">{lang}</span>
                        <span className="text-xs font-mono text-white/60">{Math.floor(seconds / 60)} min</span>
                      </div>
                    ));
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
