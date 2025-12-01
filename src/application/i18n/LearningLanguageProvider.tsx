"use client";

import { createContext, useContext, useMemo, useState } from "react";

type LearningLanguageContextValue = {
  learningLanguage: string;
  setLearningLanguage: (lang: string) => void;
};

const LearningLanguageContext = createContext<LearningLanguageContextValue | undefined>(undefined);
const STORAGE_KEY = "loglingo_learning_language";

function readStoredLanguage(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

function persistLanguage(lang: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, lang);
}

export function LearningLanguageProvider({ children }: { children: React.ReactNode }) {
  const [learningLanguage, setLearningLanguageState] = useState<string>(
    () => readStoredLanguage() || "en"
  );

  const setLearningLanguage = (lang: string) => {
    setLearningLanguageState(lang);
    persistLanguage(lang);
  };

  const value = useMemo(
    () => ({
      learningLanguage,
      setLearningLanguage,
    }),
    [learningLanguage]
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
