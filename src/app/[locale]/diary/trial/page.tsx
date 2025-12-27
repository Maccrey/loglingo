"use client";
// Force rebuild

import { DiaryForm } from "@/components/diary/DiaryForm";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { TrialLanguageOnboarding } from "@/components/i18n/TrialLanguageOnboarding";
import { useLearningLanguage } from "@/application/i18n/LearningLanguageProvider";
import { routing } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { ResponsiveAd } from "@/components/ads/ResponsiveAd";

export default function DiaryTrialPage() {
  const t = useTranslations("trial");
  const tOnboarding = useTranslations("language_onboarding");
  const locale = useLocale();
  const router = useRouter();
  const { learningLanguage, setLearningLanguage } = useLearningLanguage();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isCompleted = localStorage.getItem("loglingo_trial_completed") === "true";
      if (isCompleted) {
        toast.info(t("signup_prompt")); // "회원가입하여..." 메시지 표시
        router.replace("/"); // 홈으로 이동
      }
    }
  }, [router, t]);

  const languageNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([locale], { type: "language" });
    } catch {
      return new Intl.DisplayNames(["en"], { type: "language" });
    }
  }, [locale]);

  const getLanguageLabel = (code: string) => languageNames?.of(code) ?? code;

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
            onChange={(e) => setLearningLanguage(e.target.value)}
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
