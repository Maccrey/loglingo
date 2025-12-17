"use client";

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import RadioPlayer from '@/components/radio/RadioPlayer';
import RadioSidebar from '@/components/radio/RadioSidebar';
import { RadioStation } from '@/domain/radio';
import { ListMusic } from 'lucide-react';
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
  const { stats, loading: statsLoading, refreshStats } = useRadioStats();
  
  const handleStationClick = (station: RadioStation) => {
    setCurrentStation(station);
  };

  return (
    <AuthGate>
      <div className="fixed inset-0 top-16 bg-black">
        {/* Globe Background Layer */}
        <div className="absolute inset-0 w-full h-full z-0">
          <RadioGlobe 
            onStationClick={handleStationClick} 
            currentStationId={currentStation?.id}
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
          onStatsUpdate={refreshStats}
        />
      </div>
    </AuthGate>
  );
}
