'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export function CookieConsent() {
  const t = useTranslations('cookie');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('loglingo_cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('loglingo_cookie_consent', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="glass-card bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <p className="text-white/90 text-sm md:text-base flex-1">
            {t('message')}
          </p>
          <Button 
            onClick={handleAccept}
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-medium px-8 whitespace-nowrap"
          >
            {t('accept')}
          </Button>
        </div>
      </div>
    </div>
  );
}
