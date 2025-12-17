"use client";

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import RadioPlayer from '@/components/radio/RadioPlayer';
import RadioSidebar from '@/components/radio/RadioSidebar';
import { RadioStation } from '@/domain/radio';
import { ListMusic, Radio, Loader2 } from 'lucide-react';
import { useRadioStats } from '@/hooks/useRadioStats';

const RadioGlobe = dynamic(() => import('@/components/radio/RadioGlobe'), { 
  ssr: false,
  loading: () => <div className="text-white/50">Loading Globe...</div> 
});

import { AuthGate } from '@/components/auth/AuthGate';

export default function RadioPage() {
  const t = useTranslations('radio');
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { stats, loading: statsLoading, refreshStats } = useRadioStats();
  
  const handleLoadComplete = useCallback(() => {
    setIsInitialLoading(false);
  }, []);
  
  const handleStationClick = (station: RadioStation) => {
    setCurrentStation(station);
  };

  return (
    <AuthGate>
      <div className="fixed inset-0 top-16 bg-black">
        {/* Initial Loading Modal */}
        {isInitialLoading && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-8 shadow-2xl max-w-sm mx-4">
              <div className="flex flex-col items-center gap-4">
                {/* Animated Radio Icon */}
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping" />
                  <div className="relative bg-gradient-to-br from-primary to-accent p-4 rounded-full">
                    <Radio className="w-8 h-8 text-white animate-pulse" />
                  </div>
                </div>
                
                {/* Loading Text */}
                <div className="text-center">
                  <p className="text-lg font-semibold text-white mb-1">{t('loading')}</p>
                  <p className="text-sm text-white/60">{t('title')}</p>
                </div>
                
                {/* Loading Dots Animation */}
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Globe Background Layer */}
        <div className="absolute inset-0 w-full h-full z-0">
          <RadioGlobe 
            onStationClick={handleStationClick} 
            currentStationId={currentStation?.id}
            onLoadComplete={handleLoadComplete}
          />
        </div>

        {/* Title removed to avoid navigation overlap */}
        {/* <div className="absolute top-6 left-4 z-50 p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 pointer-events-none">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{t('subtitle')}</p>
        </div> */}

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-6 right-4 z-50 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition shadow-lg"
        >
          <ListMusic className="w-6 h-6" />
        </button>

        <RadioSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          onStationSelect={handleStationClick}
          stats={stats}
          statsLoading={statsLoading}
          refreshStats={refreshStats}
        />

        <RadioPlayer 
          station={currentStation} 
        />
      </div>
    </AuthGate>
  );
}
