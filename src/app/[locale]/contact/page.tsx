import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return {
    title: `${t('title')} | Loglingo`,
    description: t('description_meta'),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="glass-card p-8 md:p-10 rounded-3xl text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-400 mb-8 mt-2">
          {t('title')}
        </h1>
        <div className="prose prose-invert max-w-none text-white/80 leading-relaxed text-lg space-y-6">
          <p>{t('email_desc')}</p>
          <p className="text-2xl font-semibold text-primary">
            <a href={`mailto:${t('email')}`} className="hover:underline hover:text-orange-400 transition-colors">
              {t('email')}
            </a>
          </p>
          <p className="text-sm text-white/60">{t('inquiry_note')}</p>
        </div>
      </div>
    </div>
  );
}
