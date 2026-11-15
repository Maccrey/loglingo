import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ArrowRight, BookOpen, Sparkles, GraduationCap, Mic } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import KakaoAdFit from "@/components/ads/KakaoAdFit";
import { StartButton } from "@/components/home/StartButton";
import { kinoraCopy } from "@/components/home/kinoraCopy";

export default function Home() {
  const t = useTranslations('home');
  const copy = kinoraCopy[useLocale()] ?? kinoraCopy.en;

  return (
    <div className="flex flex-col space-y-12 py-8">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-blue-500 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {t('title')}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          {t('subtitle')}
        </p>
        <div className="flex space-x-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <StartButton />
        </div>
      </section>

      <a href="https://www.kinora.date" className="group block w-full min-w-0 overflow-hidden rounded-3xl border border-rose-200 bg-gradient-to-r from-rose-50 via-pink-50 to-violet-50 p-5 text-rose-950 shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-500 sm:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold tracking-widest text-rose-500">♥ KINORA</p>
            <h2 className="mt-2 text-xl font-bold sm:text-2xl">{copy[0]}</h2>
            <p className="mt-2 text-sm text-rose-800">{copy[1]}</p>
            <span className="mt-4 inline-block rounded-full bg-rose-500 px-5 py-2 text-sm font-bold text-white group-hover:bg-rose-600">{copy[2]} <span aria-hidden="true">→</span></span>
          </div>
          <div className="kinora-characters grid w-full max-w-md grid-cols-6 items-end gap-1 self-center md:w-1/2" aria-hidden="true">
            {['dog', 'cat', 'fluffy', 'raccoon', 'parrot', 'otter'].map((character) => (
              // The original Kinora assets are served by Kinora.
              // eslint-disable-next-line @next/next/no-img-element
              <img key={character} src={`https://www.kinora.date/landing/assets/${character}.webp`} alt="" className="h-auto w-full min-w-0 object-contain" />
            ))}
          </div>
        </div>
      </a>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <Link href="/guide/write" className="block">
          <Card className="border-primary/20 bg-primary/5 hover:bg-primary/10 hover:scale-[1.02] transition-all duration-200 cursor-pointer h-full">
            <CardHeader>
              <BookOpen className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{t('features.write')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('features.write_desc')}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/guide/correct" className="block">
          <Card className="border-accent/20 bg-accent/5 hover:bg-accent/10 hover:scale-[1.02] transition-all duration-200 cursor-pointer h-full">
            <CardHeader>
              <Sparkles className="h-10 w-10 text-accent mb-2" />
              <CardTitle>{t('features.correct')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('features.correct_desc')}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/guide/archive" className="block">
          <Card className="border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 hover:scale-[1.02] transition-all duration-200 cursor-pointer h-full">
            <CardHeader>
              <GraduationCap className="h-10 w-10 text-blue-500 mb-2" />
              <CardTitle>{t('features.learn')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('features.learn_desc')}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/guide/speaking" className="block">
          <Card className="h-full border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 hover:scale-[1.02] transition-all duration-200 cursor-pointer">
            <CardHeader>
              <Mic className="h-10 w-10 text-orange-500 mb-2" />
              <CardTitle>{t('features.speaking')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('features.speaking_desc')}
              </p>
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* PC Ad (728x90) - Only visible on md+ screens */}
      <section className="hidden md:flex justify-center w-full">
        <KakaoAdFit
          unit="DAN-OcjGqneif35bCzFF"
          width={728}
          height={90}
        />
      </section>

      {/* Mobile Ad (320x50) - Only visible on small screens */}
      <section className="flex md:hidden justify-center w-full">
        <KakaoAdFit
          unit="DAN-O3H0DVRSds4Dserg"
          width={320}
          height={50}
        />
      </section>

    </div>
  );
}
