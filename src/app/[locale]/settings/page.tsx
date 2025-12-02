"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { ChangeEvent, useTransition } from "react";
import { useLearningLanguage } from "@/application/i18n/LearningLanguageProvider";

export default function SettingsPage() {
  const t = useTranslations('settings');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { learningLanguage, setLearningLanguage } = useLearningLanguage();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ko', name: '한국어' },
    { code: 'ja', name: '日本語' },
    { code: 'zh', name: '中文' },
    { code: 'th', name: 'ไทย' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'es', name: 'Español' },
    { code: 'pt', name: 'Português' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिन्दी' },
  ];

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('ui_language')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="ui-language" className="text-sm font-medium text-muted-foreground">
                {t('ui_language')}
              </label>
              <select
                id="ui-language"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={locale}
                onChange={handleLanguageChange}
                disabled={isPending}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="learning-language" className="text-sm font-medium text-muted-foreground">
                {t('learning_language')}
              </label>
              <select
                id="learning-language"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={learningLanguage}
                onChange={(e) => setLearningLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
