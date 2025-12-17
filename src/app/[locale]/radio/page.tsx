"use client";

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import RadioPlayer from '@/components/radio/RadioPlayer';
import RadioSidebar from '@/components/radio/RadioSidebar';
import { RadioStation } from '@/domain/radio';
import { ListMusic } from 'lucide-react';

const RadioGlobe = dynamic(() => import('@/components/radio/RadioGlobe'), { 
  ssr: false,
  loading: () => <div className="text-white/50">Loading Globe...</div> 
});

export default function RadioPage() {
  const t = useTranslations('radio');
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleStationClick = (station: RadioStation) => {
    setCurrentStation(station);
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-black">
      <div className="absolute top-4 left-4 z-10 p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 pointer-events-none">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t('title')}
        </h1>
        <p className="text-sm text-gray-400 mt-1">{t('subtitle')}</p>
      </div>

      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="absolute top-4 right-4 z-10 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition shadow-lg"
      >
        <ListMusic className="w-6 h-6" />
      </button>

      <RadioSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onStationSelect={handleStationClick}
      />

      <div className="w-full h-full">
        <RadioGlobe onStationClick={handleStationClick} />
      </div>

      <RadioPlayer station={currentStation} />
    </div>
  );
}
