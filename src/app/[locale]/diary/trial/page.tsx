"use client";

import { DiaryForm } from "@/components/diary/DiaryForm";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useEffect } from "react";
import { toast } from "sonner";

export default function DiaryTrialPage() {
  const t = useTranslations("trial");
  const router = useRouter();

  useEffect(() => {
    // Optional: Check if trial is already done? 
    // For now we allow revisiting, or we could redirect if they logged in.
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-8">
      {/* Trial Banner */}
      <div className="rounded-lg border border-orange-500/20 bg-orange-500/10 p-4 text-orange-200">
        <h3 className="font-semibold mb-1">{t("banner_title")}</h3>
        <p className="text-sm opacity-90">{t("banner_desc")}</p>
      </div>

      <DiaryForm
        isTrialMode={true}
        onSubmit={async (payload) => {
          // In trial mode, we don't save to backend here.
          // The saving logic is handled via the "Sign up to save" flow in DiaryForm
          return Promise.resolve();
        }}
        onSuccess={() => {
          // No-op for trial submit
        }}
      />
    </div>
  );
}
