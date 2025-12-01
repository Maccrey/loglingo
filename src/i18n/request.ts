import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  const locale = (await requestLocale) ?? routing.defaultLocale;

  // Ensure that a valid locale is used
  const safeLocale = routing.locales.includes(
    locale as (typeof routing.locales)[number]
  )
    ? locale
    : routing.defaultLocale;

  return {
    locale: safeLocale,
    messages: (await import(`../../messages/${safeLocale}.json`)).default
  };
});
