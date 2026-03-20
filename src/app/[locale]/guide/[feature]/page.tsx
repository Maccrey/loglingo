import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  GraduationCap,
  Mic,
  ChevronRight,
  Lightbulb,
} from "lucide-react";

const VALID_FEATURES = ["write", "correct", "archive", "speaking"] as const;
type Feature = (typeof VALID_FEATURES)[number];

const FEATURE_COLORS: Record<Feature, { color: string; bg: string; border: string; btn: string }> = {
  write: {
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    btn: "bg-primary hover:bg-primary/90",
  },
  correct: {
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
    btn: "bg-accent hover:bg-accent/90",
  },
  archive: {
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    btn: "bg-blue-500 hover:bg-blue-500/90",
  },
  speaking: {
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    btn: "bg-orange-500 hover:bg-orange-500/90",
  },
};

const FEATURE_HREFS: Record<Feature, string> = {
  write: "/diary/new",
  correct: "/diary/new",
  archive: "/archive",
  speaking: "/speaking",
};

interface Props {
  params: Promise<{ locale: string; feature: string }>;
}

export default async function GuideFeaturePage({ params }: Props) {
  const { locale, feature } = await params;

  if (!VALID_FEATURES.includes(feature as Feature)) {
    notFound();
  }

  const f = feature as Feature;
  // REVIEW:필수 - getTranslations는 async Server Component에서만 사용
  const t = await getTranslations({ locale, namespace: "guide" });
  const c = FEATURE_COLORS[f];
  const href = FEATURE_HREFS[f];

  const FeatureIcon =
    f === "write"
      ? BookOpen
      : f === "correct"
      ? Sparkles
      : f === "archive"
      ? GraduationCap
      : Mic;

  const steps = [
    { title: t(`${f}.step1_title`), desc: t(`${f}.step1_desc`) },
    { title: t(`${f}.step2_title`), desc: t(`${f}.step2_desc`) },
    { title: t(`${f}.step3_title`), desc: t(`${f}.step3_desc`) },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 뒤로가기 - next-intl Link 대신 일반 a 태그 사용 (타입 충돌 방지) */}
      <a
        href={`/${locale}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("back")}
      </a>

      {/* 헤더 카드 */}
      <div className={`rounded-2xl border p-6 ${c.bg} ${c.border}`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${c.bg} ${c.border} border`}>
            <FeatureIcon className={`w-8 h-8 ${c.color}`} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${c.color}`}>{t(`${f}.title`)}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{t(`${f}.subtitle`)}</p>
          </div>
        </div>
      </div>

      {/* 왜 효과적인가 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t(`${f}.why_title`)}</h2>
        <p className="text-muted-foreground leading-relaxed">{t(`${f}.why_desc`)}</p>
      </section>

      {/* 사용 방법 단계 */}
      <section className="space-y-4">
        {steps.map((step, i) => (
          <div
            key={i}
            className="flex gap-4 rounded-xl border border-border/50 bg-card/50 p-4"
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${c.btn.split(" ")[0]}`}
            >
              {i + 1}
            </div>
            <div>
              <p className="font-semibold text-sm">{step.title}</p>
              <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 팁 */}
      <div className={`rounded-xl border p-4 ${c.bg} ${c.border} flex gap-3`}>
        <Lightbulb className={`w-5 h-5 flex-shrink-0 mt-0.5 ${c.color}`} />
        <div>
          <p className={`text-sm font-semibold ${c.color}`}>{t(`${f}.tip_title`)}</p>
          <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
            {t(`${f}.tip_desc`)}
          </p>
        </div>
      </div>

      {/* CTA 버튼 - 일반 a 태그 사용 */}
      <a
        href={`/${locale}${href}`}
        className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 ${c.btn}`}
      >
        {t("start_cta")}
        <ChevronRight className="w-5 h-5" />
      </a>
    </div>
  );
}

export async function generateStaticParams() {
  return VALID_FEATURES.map((feature) => ({ feature }));
}
