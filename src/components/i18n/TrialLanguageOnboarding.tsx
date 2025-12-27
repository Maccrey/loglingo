"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useTranslations, useLocale } from "next-intl";
import { useLearningLanguage } from "@/application/i18n/LearningLanguageProvider";
import { routing } from "@/i18n/routing";

export function TrialLanguageOnboarding() {
  const locale = useLocale();
  const t = useTranslations("language_onboarding");
  const { learningLanguage, setLearningLanguage, hasStoredLanguage } = useLearningLanguage();

  const [selectedLanguage, setSelectedLanguage] = useState(learningLanguage);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Open if no language is stored yet
    if (!hasStoredLanguage) {
      setIsOpen(true);
    }
  }, [hasStoredLanguage]);

  useEffect(() => {
    setSelectedLanguage(learningLanguage);
  }, [learningLanguage]);

  const languageNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([locale], { type: "language" });
    } catch {
      return new Intl.DisplayNames(["en"], { type: "language" });
    }
  }, [locale]);

  const getLanguageLabel = (code: string) => languageNames?.of(code) ?? code;

  const handleSave = () => {
    setLearningLanguage(selectedLanguage);
    setIsOpen(false);
  };

  // Prevent closing without selection if it's the initial choice
  const handleClose = () => {
    if (hasStoredLanguage) {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t("title")}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{t("description")}</p>

        <div className="space-y-2">
          <label
            htmlFor="trial-learning-language"
            className="text-sm font-medium text-foreground"
          >
            {t("label")}
          </label>
          <select
            id="trial-learning-language"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {routing.locales.map((code) => (
              <option key={code} value={code}>
                {getLanguageLabel(code)}
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs text-muted-foreground">{t("hint")}</p>

        <div className="flex justify-end">
          <Button className="w-full sm:w-auto" onClick={handleSave}>
            {t("confirm")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
