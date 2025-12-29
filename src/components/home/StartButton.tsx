"use client";

import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useAuth } from "@/application/auth/AuthProvider";

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

  if (isTrialAvailable) {
    return (
      <div className="flex flex-col items-center gap-3">
        <Link href="/diary/trial">
          <Button 
            size="lg" 
            variant="ghost"
            className="group bg-orange-500 hover:bg-orange-400 text-white border-0 animate-orange-blink transition-all duration-300"
          >
            {t('try_it_out')}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
        <span className="text-xs text-orange-200/70 font-medium tracking-wide">
          {t('trial_hint')}
        </span>
      </div>
    );
  }

  return (
    <Link href="/diary/new">
      <Button size="lg" className="group">
        {t('start')}
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </Link>
  );
}
