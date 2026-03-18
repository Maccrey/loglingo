'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function Footer() {
  const t = useTranslations('footer');
  
  return (
    <footer className="w-full border-t border-white/10 bg-black/20 backdrop-blur-md mt-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-white/50 text-sm">
            © {new Date().getFullYear()} Loglingo. All rights reserved.
          </div>
          <nav className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-sm text-white/70">
            <Link href="/about" className="hover:text-white transition-colors px-2">{t('about')}</Link>
            <Link href="/privacy" className="hover:text-white transition-colors px-2">{t('privacy')}</Link>
            <Link href="/terms" className="hover:text-white transition-colors px-2">{t('terms')}</Link>
            <Link href="/contact" className="hover:text-white transition-colors px-2">{t('contact')}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
