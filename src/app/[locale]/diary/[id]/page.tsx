"use client";

import { use, useState } from "react";
import { useDiaryDetail } from "@/application/diary/hooks";
import { useArchiveList } from "@/application/archive/hooks";
import { getCurrentUserId } from "@/lib/current-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useTranslations } from "next-intl";
import { AuthGate } from "@/components/auth/AuthGate";
import { useRouter } from "@/i18n/routing";
import { Archive, Sparkles, Edit3, ArrowLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import NextImage from "next/image";
import { formatDate } from "@/lib/intl-format";
import { useLocale } from "next-intl";
import { ResponsiveAd } from "@/components/ads/ResponsiveAd";
import { AD_UNITS, AD_SIZES } from "@/config/ads";
import { cn } from "@/lib/utils";
import type { LearningArchive } from "@/domain/archive";

// 개별 아카이브 카드 컴포넌트
function ArchiveCard({ 
  archive, 
  onViewArchive,
  tArchive 
}: { 
  archive: LearningArchive;
  onViewArchive: () => void;
  tArchive: (key: string) => string;
}) {
  const [showExamples, setShowExamples] = useState(false);
  const hasExamples = archive.examples && archive.examples.length > 0;

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition-colors">
      <div 
        className="flex items-start justify-between gap-2 cursor-pointer"
        onClick={() => onViewArchive()}
      >
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">
            {archive.title}
          </p>
          {archive.rootMeaning && (
            <p className="text-xs text-muted-foreground mt-1">
              {archive.rootMeaning}
            </p>
          )}
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
          {tArchive(archive.type === "grammar" ? "type_grammar_short" : "type_word_short")}
        </span>
      </div>
      
      {hasExamples && (
        <div className="mt-2 border-t border-white/10 pt-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowExamples(!showExamples);
            }}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronDown 
              className={cn(
                "h-3 w-3 transition-transform",
                showExamples && "rotate-180"
              )} 
            />
            <span>
              {showExamples
                ? tArchive("hide_examples", { count: archive.examples.length })
                : tArchive("show_examples", { count: archive.examples.length })}
            </span>
          </button>
          
          {showExamples && (
            <div className="mt-2 space-y-1 pl-4 border-l-2 border-primary/30">
              {archive.examples.map((example, idx) => (
                <p key={idx} className="text-xs text-foreground/80">
                  • {example}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DiaryViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const userId = getCurrentUserId();
  const t = useTranslations("diary");
  const tArchive = useTranslations("archive");
  const locale = useLocale();
  const router = useRouter();
  const { data, isLoading } = useDiaryDetail(userId, id);
  const { data: archives = [], isLoading: archivesLoading } = useArchiveList(userId, undefined, { sourceId: id });

  if (isLoading) {
    return (
      <AuthGate>
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>{t("loading")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 animate-pulse rounded-lg bg-white/5" />
          </CardContent>
        </Card>
      </AuthGate>
    );
  }

  if (!data) {
    return (
      <AuthGate>
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>{t("not_found")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t("not_found_desc")}</p>
          </CardContent>
        </Card>
      </AuthGate>
    );
  }

  return (
    <AuthGate>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* 일기 내용 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/diary")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("back")}
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => router.push(`/diary/${id}/edit`)}
              >
                <Edit3 className="mr-2 h-4 w-4" />
                {t("edit")}
              </Button>
            </div>
            <CardTitle className="text-2xl mt-4">
              {formatDate(new Date(`${data.date}T00:00:00`), locale)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.imageUrl && (
              <NextImage
                src={data.imageUrl}
                alt="Diary image"
                width={1200}
                height={800}
                className="w-full rounded-lg object-cover"
                loading="lazy"
                unoptimized
              />
            )}
            <p className="whitespace-pre-wrap text-foreground leading-relaxed">
              {data.content}
            </p>
          </CardContent>
        </Card>

        {/* 일기 본문과 아카이브 사이 광고 */}
        <ResponsiveAd
          pcUnit={AD_UNITS.DETAIL_MIDDLE_PC}
          mobileUnit={AD_UNITS.DETAIL_MIDDLE_MOBILE}
          pcWidth={AD_SIZES.PC_LEADERBOARD.width}
          pcHeight={AD_SIZES.PC_LEADERBOARD.height}
          mobileWidth={AD_SIZES.MOBILE_LARGE_BANNER.width}
          mobileHeight={AD_SIZES.MOBILE_LARGE_BANNER.height}
        />

        {/* 관련 아카이브 항목 표시 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-primary" />
              <CardTitle>{tArchive("title")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {archivesLoading ? (
              <div className="h-20 animate-pulse rounded-lg bg-white/5" />
            ) : archives.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-3">
                  이 일기에서 저장된 학습 항목들
                </p>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {archives.map((archive) => (
                    <ArchiveCard
                      key={archive.id}
                      archive={archive}
                      onViewArchive={() => router.push("/archive")}
                      tArchive={tArchive}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  아직 저장된 학습 항목이 없습니다
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  AI 교정을 사용하면 자동으로 저장됩니다
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGate>
  );
}
