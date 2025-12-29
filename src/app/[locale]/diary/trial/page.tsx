"use client";
// Force rebuild

import { DiaryForm } from "@/components/diary/DiaryForm";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { TrialLanguageOnboarding } from "@/components/i18n/TrialLanguageOnboarding";
import { useLearningLanguage } from "@/application/i18n/LearningLanguageProvider";
import { useAuth } from "@/application/auth/AuthProvider";
import { routing } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { ResponsiveAd } from "@/components/ads/ResponsiveAd";
import { trackEvent } from "@/lib/analytics";
import { TRIAL_SAMPLES, DEFAULT_SAMPLE } from "@/constants/trial-samples";

export default function DiaryTrialPage() {
  const t = useTranslations("trial");
  const tOnboarding = useTranslations("language_onboarding");
  const locale = useLocale();
  const router = useRouter();
  const { learningLanguage, setLearningLanguage } = useLearningLanguage();
  const { user, loading } = useAuth(); // Add auth check

   useEffect(() => {
    trackEvent("start_process", {
      component_name: "체험 모드",
      action_detail: "체험 시작",
      value_korean: "체험 모드 페이지 진입"
    });
    
    // Redirect if trial is completed
    if (typeof window !== "undefined") {
      const isCompleted = localStorage.getItem("loglingo_trial_completed") === "true";
      if (isCompleted) {
        toast.info(t("signup_prompt"));
        router.replace("/");
        return;
      }
    }

    // Redirect if already logged in
    if (!loading && user) {
       // If the user just logged in (wasn't redirected immediately), imply success.
       // We can just redirect silently or with a success message if needed, 
       // but definitely avoid "Already logged in" if they just signed up.
       // However, identifying "just signed up" vs "arrived logged in" needs state tracking.
       // Simple heuristic: If we are here, we are redirecting. 
       // If trial is completed recently, maybe show nothing or different toast?
       
       // Actually, the simplest fix for the user request "Make it go to main page" 
       // is to KEEP the redirect, but Change/Remove the toast if it matches the "just logged in" scenario.
       
       // Let's assume if they are on this page and logged in, we always kick them to home.
       // The "Already logged in" toast is helpful if they wandered here by mistake.
       // If they just clicked "Sign up" -> Login -> Redirect, the toast is annoying.
       
       // Let's check if they just finished trial
       const justFinished = typeof window !== "undefined" && localStorage.getItem("loglingo_trial_completed") === "true";
       if (!justFinished) {
          toast.info(t("already_logged_in"));
       }
       router.replace("/"); 
    }
  }, [router, t, user, loading]);

  const languageNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([locale], { type: "language" });
    } catch {
      return new Intl.DisplayNames(["en"], { type: "language" });
    }
  }, [locale]);

  const getLanguageLabel = (code: string) => languageNames?.of(code) ?? code;

  // Smart default logic: Run once on mount, but ONLY if manual selection hasn't happened.
  // The context provider loads from localStorage. If loaded, `learningLanguage` is already set.
  // However, we want to be smart about defaults for NEW users.
  // The provider doesn't expose `hasStoredLanguage` directly in the hook return (we need to check).
  // Let's assume if it's the default locale AND no storage, we overwrite.
  // Actually, let's just use a ref to ensure this "smart default" assignment happens exactly once per session/mount
  // and preferably respects existing choices if we could detect them.
  // BUT: The user issue is specifically about "changing it then it reverts".
  // With `setLearningLanguage` stabilized, the revert on change is fixed. 
  // But let's be safer: use a ref to prevent re-running.
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Only set default if we really want to override (e.g. first visit)
    // For now, retaining original logic but ensuring it runs ONCE.
    const smartDefault = locale === "en" ? "ko" : "en";
    setLearningLanguage(smartDefault);
  }, [locale, setLearningLanguage]);

  const sampleText = TRIAL_SAMPLES[learningLanguage] || DEFAULT_SAMPLE;

  // Guard against rendering if loading, logged in, or redirecting
  if (loading || user) {
     return (
       <div className="flex min-h-[50vh] items-center justify-center">
         <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
       </div>
     );
  }

  // Also verify localStorage on client side before showing anything
  // (though useEffect handles redirect, avoid flash)
  if (typeof window !== "undefined" && localStorage.getItem("loglingo_trial_completed") === "true") {
      return (
         <div className="flex min-h-[50vh] items-center justify-center">
           <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
         </div>
       );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-8">
      {/* Trial Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-lg border border-orange-500/20 bg-orange-500/10 p-4">
        <div className="text-orange-200">
          <h3 className="font-semibold mb-1">{t("banner_title")}</h3>
          <p className="text-sm opacity-90">{t("banner_desc")}</p>
        </div>
        
        {/* Language Selector */}
        <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg border border-orange-500/10">
          <Globe className="h-4 w-4 text-orange-200/70" />
          <span className="text-sm text-orange-200/70 hidden sm:inline">{tOnboarding("label")}:</span>
          <select
            className="bg-transparent text-sm font-medium text-orange-100 focus:outline-none cursor-pointer"
            value={learningLanguage}
            onChange={(e) => {
              const newLang = e.target.value;
              const langLabel = getLanguageLabel(newLang);
              trackEvent("click_button", {
                component_name: "체험 모드",
                action_detail: "언어 선택",
                item_name: langLabel,
                value_korean: `체험 학습 언어 변경: ${langLabel}`,
                target_language: newLang
              });
              setLearningLanguage(newLang);
            }}
          >
            {routing.locales.map((code) => (
              <option key={code} value={code} className="bg-slate-800 text-white" suppressHydrationWarning>
                {getLanguageLabel(code)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DiaryForm
        isTrialMode={true}
        sampleText={sampleText}
        onSubmit={async (payload) => {
          return Promise.resolve();
        }}
        onSuccess={() => {}}
      />
      <TrialLanguageOnboarding />
      
      {/* Responsive Ad */}
      <ResponsiveAd
        pcUnit="DAN-ipIinK0NYGLLxb6H"
        mobileUnit="DAN-KVpPOPtv5Bhkf8q0"
        pcWidth={728}
        pcHeight={90}
        mobileWidth={320}
        mobileHeight={50}
        className="mt-8"
      />
    </div>
  );
}
