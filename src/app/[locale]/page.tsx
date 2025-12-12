import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ArrowRight, BookOpen, Sparkles, GraduationCap } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import KakaoAdFit from "@/components/ads/KakaoAdFit";

export default function Home() {
  const t = useTranslations('home');

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
          <Link href="/diary/new">
            <Button size="lg" className="group">
              {t('start')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
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

        <Card className="border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors">
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

        <Card className="border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors">
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
