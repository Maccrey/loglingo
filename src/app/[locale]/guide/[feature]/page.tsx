import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
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

const FEATURE_META: Record<
  Feature,
  { Icon: React.ElementType; color: string; bgColor: string; href: string; accentBg: string }
> = {
  write: {
    Icon: BookOpen,
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20",
    accentBg: "bg-primary",
    href: "/diary/new",
  },
  correct: {
    Icon: Sparkles,
    color: "text-accent",
    bgColor: "bg-accent/10 border-accent/20",
    accentBg: "bg-accent",
    href: "/diary/new",
  },
  archive: {
    Icon: GraduationCap,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 border-blue-500/20",
    accentBg: "bg-blue-500",
    href: "/archive",
  },
  speaking: {
    Icon: Mic,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10 border-orange-500/20",
    accentBg: "bg-orange-500",
    href: "/speaking",
  },
};

interface Props {
  params: Promise<{ locale: string; feature: string }>;
}

export default async function GuideFeaturePage({ params }: Props) {
  const { feature } = await params;

  if (!VALID_FEATURES.includes(feature as Feature)) {
    notFound();
  }

  const f = feature as Feature;
  // REVIEW:필수 - getTranslations는 async Server Component에서만 사용 가능
  const t = await getTranslations("guide");
  const meta = FEATURE_META[f];
  const { Icon } = meta;

  const steps = [
    { title: t(`${f}.step1_title`), desc: t(`${f}.step1_desc`) },
    { title: t(`${f}.step2_title`), desc: t(`${f}.step2_desc`) },
    { title: t(`${f}.step3_title`), desc: t(`${f}.step3_desc`) },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 뒤로가기 */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("back")}
      </Link>

      {/* 헤더 카드 */}
      <div className={`rounded-2xl border p-6 ${meta.bgColor}`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${meta.bgColor}`}>
            <Icon className={`w-8 h-8 ${meta.color}`} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${meta.color}`}>{t(`${f}.title`)}</h1>
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
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${meta.accentBg}`}
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
      <div className={`rounded-xl border p-4 ${meta.bgColor} flex gap-3`}>
        <Lightbulb className={`w-5 h-5 flex-shrink-0 mt-0.5 ${meta.color}`} />
        <div>
          <p className={`text-sm font-semibold ${meta.color}`}>{t(`${f}.tip_title`)}</p>
          <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
            {t(`${f}.tip_desc`)}
          </p>
        </div>
      </div>

      {/* CTA 버튼 */}
      <Link
        href={meta.href as "/diary/new" | "/archive" | "/speaking"}
        className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95 ${meta.accentBg}`}
      >
        {t("start_cta")}
        <ChevronRight className="w-5 h-5" />
      </Link>
    </div>
  );
}

export async function generateStaticParams() {
  return VALID_FEATURES.map((feature) => ({ feature }));
}
