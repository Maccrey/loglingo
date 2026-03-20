import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { ArrowLeft, BookOpen, Sparkles, GraduationCap, Mic, ChevronRight, Lightbulb } from "lucide-react";

// 허용된 feature 슬러그
const VALID_FEATURES = ["write", "correct", "archive", "speaking"] as const;
type Feature = typeof VALID_FEATURES[number];

const FEATURE_META: Record<Feature, { icon: React.ElementType; color: string; bgColor: string; href: string }> = {
  write: {
    icon: BookOpen,
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20",
    href: "/diary/new",
  },
  correct: {
    icon: Sparkles,
    color: "text-accent",
    bgColor: "bg-accent/10 border-accent/20",
    href: "/diary/new",
  },
  archive: {
    icon: GraduationCap,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 border-blue-500/20",
    href: "/archive",
  },
  speaking: {
    icon: Mic,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10 border-orange-500/20",
    href: "/speaking",
  },
};

interface GuideFeaturePageProps {
  params: Promise<{ locale: string; feature: string }>;
}

export default async function GuideFeaturePage({ params }: GuideFeaturePageProps) {
  const { feature } = await params;

  if (!VALID_FEATURES.includes(feature as Feature)) {
    notFound();
  }

  return <GuideContent feature={feature as Feature} />;
}

function GuideContent({ feature }: { feature: Feature }) {
  // REVIEW:필수 - 번역 키가 모든 로케일 JSON에 존재하는지 확인 필요
  const t = useTranslations("guide");
  const meta = FEATURE_META[feature];
  const Icon = meta.icon;

  const title = t(`${feature}.title`);
  const subtitle = t(`${feature}.subtitle`);
  const whyTitle = t(`${feature}.why_title`);
  const whyDesc = t(`${feature}.why_desc`);
  const step1Title = t(`${feature}.step1_title`);
  const step1Desc = t(`${feature}.step1_desc`);
  const step2Title = t(`${feature}.step2_title`);
  const step2Desc = t(`${feature}.step2_desc`);
  const step3Title = t(`${feature}.step3_title`);
  const step3Desc = t(`${feature}.step3_desc`);
  const tipTitle = t(`${feature}.tip_title`);
  const tipDesc = t(`${feature}.tip_desc`);

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

      {/* 헤더 */}
      <div className={`rounded-2xl border p-6 ${meta.bgColor}`}>
        <div className="flex items-center gap-4 mb-3">
          <div className={`p-3 rounded-xl ${meta.bgColor}`}>
            <Icon className={`w-8 h-8 ${meta.color}`} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${meta.color}`}>{title}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* 왜 효과적인가 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{whyTitle}</h2>
        <p className="text-muted-foreground leading-relaxed">{whyDesc}</p>
      </section>

      {/* 사용 방법 단계 */}
      <section className="space-y-4">
        {[
          { title: step1Title, desc: step1Desc },
          { title: step2Title, desc: step2Desc },
          { title: step3Title, desc: step3Desc },
        ].map((step, i) => (
          <div
            key={i}
            className="flex gap-4 rounded-xl border border-border/50 bg-card/50 p-4"
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${meta.color} ${meta.bgColor}`}
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
          <p className={`text-sm font-semibold ${meta.color}`}>{tipTitle}</p>
          <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{tipDesc}</p>
        </div>
      </div>

      {/* CTA 버튼 */}
      <Link
        href={meta.href as "/diary/new" | "/archive" | "/speaking"}
        className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
          feature === "write" || feature === "correct"
            ? "bg-primary hover:bg-primary/90"
            : feature === "archive"
            ? "bg-blue-500 hover:bg-blue-500/90"
            : "bg-orange-500 hover:bg-orange-500/90"
        }`}
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
