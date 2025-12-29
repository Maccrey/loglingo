"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { routing } from "@/i18n/routing";

type LearningLanguageContextValue = {
  learningLanguage: string;
  setLearningLanguage: (lang: string) => void;
  hasStoredLanguage: boolean;
};

const LearningLanguageContext = createContext<LearningLanguageContextValue | undefined>(undefined);
const STORAGE_KEY = "loglingo_learning_language";
const CONFIRM_KEY = "loglingo_learning_language_confirmed";

function readStoredLanguage(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

function readConfirmFlag(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(CONFIRM_KEY) === "true";
}

function persistLanguage(lang: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, lang);
  window.localStorage.setItem(CONFIRM_KEY, "true");
}

export function LearningLanguageProvider({ children }: { children: React.ReactNode }) {
  const [hasStoredLanguage, setHasStoredLanguage] = useState<boolean>(() => readConfirmFlag());
  const [learningLanguage, setLearningLanguageState] = useState<string>(routing.defaultLocale);

  useEffect(() => {
    const stored = readStoredLanguage();
    if (stored) {
      setLearningLanguageState(stored);
      setHasStoredLanguage(true);
    }
  }, []);

  const setLearningLanguage = useCallback((lang: string) => {
    setLearningLanguageState(lang);
    setHasStoredLanguage(true);
    persistLanguage(lang);
  }, []);

  const value = useMemo(
    () => ({
      learningLanguage,
      setLearningLanguage,
      hasStoredLanguage,
    }),
    [learningLanguage, hasStoredLanguage]
  );

  return (
    <LearningLanguageContext.Provider value={value}>
      {children}
    </LearningLanguageContext.Provider>
  );
}

export function useLearningLanguage() {
  const ctx = useContext(LearningLanguageContext);
  if (!ctx) {
    throw new Error("useLearningLanguage must be used within LearningLanguageProvider");
  }
  return ctx;
}
