export const defaultLocale = "en";
export const locales = ["en", "ko", "es", "fr", "jp"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  ko: "Korean",
  es: "Spanish",
  fr: "French",
  jp: "Japanese",
};

// Mock translation function for now
export function getDictionary(_locale: Locale) {
  // In a real app, this would load JSON files
  void _locale;
  return {
    common: {
      save: "Save",
      cancel: "Cancel",
      loading: "Loading...",
    },
    // Add more translations here
  };
}
