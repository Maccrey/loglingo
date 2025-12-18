import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'radio' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    keywords: [
      'radio',
      'live radio',
      'global radio',
      'internet radio',
      'radio stations',
      'world radio',
      'language learning',
      'listen radio online',
      '라디오',
      '글로벌 라디오',
      '인터넷 라디오',
      '언어 학습',
      'ラジオ',
      'グローバルラジオ',
    ],
    openGraph: {
      title: t('meta_title'),
      description: t('meta_description'),
      type: 'website',
      locale: locale,
      siteName: 'Loglingo',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta_title'),
      description: t('meta_description'),
    },
    alternates: {
      canonical: `/${locale}/radio`,
      languages: {
        'ko': '/ko/radio',
        'en': '/en/radio',
        'ja': '/ja/radio',
        'zh': '/zh/radio',
        'es': '/es/radio',
        'fr': '/fr/radio',
        'de': '/de/radio',
        'it': '/it/radio',
        'pt': '/pt/radio',
        'ru': '/ru/radio',
      },
    },
  };
}

export default function RadioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
