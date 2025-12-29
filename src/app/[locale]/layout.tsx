import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Navigation } from "@/components/layout/Navigation";
import { Providers } from "../providers";
import DictionaryFAB from "@/components/dictionary/DictionaryFAB";
import { ReactNode } from 'react';

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Arabic (ar) and Urdu (ur) are RTL languages
  const isRtl = ['ar', 'ur'].includes(locale);

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <Navigation />
        <main className="min-h-screen p-4 md:p-8 max-w-screen-xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
          {children}
        </main>
        <DictionaryFAB />
      </Providers>
    </NextIntlClientProvider>
  );
}
