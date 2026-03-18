"use client";

import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useAuth } from "@/application/auth/AuthProvider";
import { GuestTrialModal } from "./GuestTrialModal";


export function StartButton() {
  const t = useTranslations('home');
  const { user, loading } = useAuth();
  const [isTrialAvailable, setIsTrialAvailable] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const trialDone = localStorage.getItem("loglingo_trial_completed");
    // Trial is available if user is NOT logged in AND trial is NOT done
    // Only set this when NOT loading to ensure accuracy
    if (!loading) {
      setIsTrialAvailable(!user && !trialDone);
    }
  }, [user, loading]);

  // Avoid hydration mismatch and wait for auth loading
  if (!mounted || loading) {
    return (
      <Link href="/diary/new">
        <Button size="lg" className="group">
          {t('start')}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
    );
  }

  const showTrial = isTrialAvailable;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        {showTrial ? (
          <>
            <Button 
              size="lg" 
              onClick={() => setIsModalOpen(true)}
              className="group hover:bg-orange-400 text-white border-0 animate-orange-pulse-glow px-8 py-6 text-lg"
              style={{ backgroundColor: '#f97316', color: 'white' }}
            >
              {t('try_it_out')}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <span className="text-xs text-muted-foreground font-medium tracking-wide">
              {t('trial_hint')}
            </span>
            <GuestTrialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          </>
        ) : (
          <Link href="/diary/new">
            <Button size="lg" className="group px-8 py-6 text-lg">
              {t('start')}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        )}
      </div>
    </>
  );
}

