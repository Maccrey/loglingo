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

import { useAuth } from "@/application/auth/AuthProvider";
import { LoginModal } from "@/components/auth/LoginModal";
import { SignupModal } from "@/components/auth/SignupModal";
import { PasswordResetModal } from "@/components/auth/PasswordResetModal";
import { Lock } from "lucide-react";

export default function RadioPage() {
  const t = useTranslations('radio');
  const { user, loading } = useAuth();
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Auth Modal State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);

  const handleStationClick = (station: RadioStation) => {
    setCurrentStation(station);
  };

  if (loading) {
     return <div className="min-h-screen bg-black flex items-center justify-center text-white/50">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-black flex flex-col items-center justify-center">
         {/* Background Effect */}
         <div className="absolute inset-0 bg-[url('//unpkg.com/three-globe/example/img/night-sky.png')] opacity-50 bg-cover" />
         
         <div className="relative z-10 p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-center max-w-md mx-4 shadow-2xl">
            <div className="mb-6 flex justify-center">
               <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-primary" />
               </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">{t('login_required_title', { defaultMessage: 'Login Required' })}</h2>
            <p className="text-gray-400 mb-6">{t('login_required_desc', { defaultMessage: 'Please log in to access Global Radio and save your favorite stations.' })}</p>
            
            <button 
               onClick={() => setIsLoginOpen(true)}
               className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition shadow-lg shadow-primary/20 w-full"
            >
               {t('login_button', { defaultMessage: 'Log In' })}
            </button>
         </div>

         {/* Modals */}
         <LoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onSwitchToSignup={() => {
              setIsLoginOpen(false);
              setIsSignupOpen(true);
            }}
            onSwitchToPasswordReset={() => {
              setIsLoginOpen(false);
              setIsPasswordResetOpen(true);
            }}
          />

          <SignupModal
            isOpen={isSignupOpen}
            onClose={() => setIsSignupOpen(false)}
            onSwitchToLogin={() => {
              setIsSignupOpen(false);
              setIsLoginOpen(true);
            }}
          />

          <PasswordResetModal
            isOpen={isPasswordResetOpen}
            onClose={() => setIsPasswordResetOpen(false)}
            onSwitchToLogin={() => {
              setIsPasswordResetOpen(false);
              setIsLoginOpen(true);
            }}
          />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-black">
      <div className="absolute top-4 left-4 z-50 p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 pointer-events-none">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t('title')}
        </h1>
        <p className="text-sm text-gray-400 mt-1">{t('subtitle')}</p>
      </div>

      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="absolute top-4 right-4 z-50 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition shadow-lg"
      >
        <ListMusic className="w-6 h-6" />
      </button>

      <RadioSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onStationSelect={handleStationClick}
      />

      <div className="w-full h-full">
        <RadioGlobe 
          onStationClick={handleStationClick} 
          currentStationId={currentStation?.id}
        />
      </div>

      <RadioPlayer station={currentStation} />
    </div>
  );
}
