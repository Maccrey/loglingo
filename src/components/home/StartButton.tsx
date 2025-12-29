"use client";

import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useAuth } from "@/application/auth/AuthProvider";

export function StartButton() {
  const t = useTranslations('home');
  const { user } = useAuth();
  const [isTrialAvailable, setIsTrialAvailable] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const trialDone = localStorage.getItem("loglingo_trial_completed");
    // Trial is available if user is NOT logged in AND trial is NOT done
    setIsTrialAvailable(!user && !trialDone);
  }, [user]);

  // Avoid hydration mismatch by rendering default state until mounted
  // Default state: "Start Writing" (Link to /diary/new) to match server-side common case or safe default
  if (!mounted) {
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
          <Button size="lg" className="group bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white border-0 shadow-lg shadow-orange-500/20 animate-pulse-subtle">
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
