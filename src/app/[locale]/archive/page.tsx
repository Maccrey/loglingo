"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLocale, useTranslations } from "next-intl";
import { useArchiveList, useArchiveMutations, useQuiz } from "@/application/archive/hooks";
import { useAuth } from "@/application/auth/AuthProvider";
import { useLevelRecords, useAdviceList, useAdviceComplete } from "@/application/learning-profile/hooks";
import { useDiaryList } from "@/application/diary/hooks";
import { useLearningAggregate } from "@/application/learning-profile/aggregate";
import { adjustLevelFromQuiz } from "@/application/learning-profile/adjustment";
import { Info } from "lucide-react";
import { useRef } from "react";

import { LearningArchive } from "@/domain/archive";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import { formatDate } from "@/lib/intl-format";
import { AuthGate } from "@/components/auth/AuthGate";
import { ResponsiveAd } from "@/components/ads/ResponsiveAd";
import KakaoAdFit from "@/components/ads/KakaoAdFit";
import { AD_UNITS, AD_SIZES } from "@/config/ads";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import DictionaryFAB from "@/components/dictionary/DictionaryFAB";

// 아카이브 리스트 카드 컴포넌트
function ArchiveListCard({
  item,
  onSelect,
  t,
  locale
}: {
  item: LearningArchive;
  onSelect: () => void;
  t: (key: string) => string;
  locale: string;
}) {
  const [showExamples, setShowExamples] = useState(false);
  const hasExamples = item.examples && item.examples.length > 0;

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3 hover:border-primary/40 transition">
      <div 
        className="cursor-pointer"
        onClick={onSelect}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">{item.title}</p>
          <span className="text-xs text-muted-foreground">
            {item.type === "word" ? t("vocabulary") : t("grammar")}
          </span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{item.rootMeaning}</p>
        <p className="text-[11px] text-muted-foreground mt-1">
          {formatDate(item.createdAt, locale)}
        </p>
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
            <span>{showExamples ? "예제 숨기기" : `예제 보기 (${item.examples.length}개)`}</span>
          </button>
          
          {showExamples && (
            <div className="mt-2 space-y-1 pl-4 border-l-2 border-primary/30">
              {item.examples.map((example, idx) => (
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

export default function ArchivePage() {
  const t = useTranslations("archive");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { user, loading } = useAuth();
  const userId = user?.uid ?? "";
  const typeLabel = t("type_label", { defaultMessage: "Type" });
  const [type, setType] = useState<string | undefined>(undefined);
  const [levelFilter, setLevelFilter] = useState<string | undefined>(undefined);
  const [addType, setAddType] = useState<"grammar" | "word">("grammar");
  const [title, setTitle] = useState("");
  const [root, setRoot] = useState("");
  const [example, setExample] = useState("");
  const canLoad = Boolean(userId) && !loading;
  const { data: archives, isLoading } = useArchiveList(userId, type, { enabled: canLoad, levelTag: levelFilter });
  const archiveList: LearningArchive[] = useMemo(() => (archives ?? []) as LearningArchive[], [archives]);
  const { data: diaries = [] } = useDiaryList(userId, undefined, { enabled: canLoad });
  const { data: levels = [] } = useLevelRecords(userId, { enabled: canLoad });
  const { data: adviceItems = [] } = useAdviceList(userId, { enabled: canLoad, limit: 10 });
  const adviceMutation = useAdviceComplete(userId);
  const { data: aggregate } = useLearningAggregate(canLoad);
  
  // 디버깅 로그
  console.log("📚 Archive Page State:", {
    userId,
    loading,
    canLoad,
    isLoading,
    archivesCount: archiveList.length,
    archives: archiveList.slice(0, 2), // 처음 2개만 표시
  });
  
  const { create } = useArchiveMutations(userId);
  const [selected, setSelected] = useState<LearningArchive | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { quiz, isLoading: quizLoading, error: quizError } = useQuiz(
    selected || undefined,
    selected ? t("quiz_question", { title: selected.title }) : undefined,
    locale,
    locale // TODO: Get from user settings
  );

  const latestLevel = levels[0];
  const previousLevel = levels[1];
  const latestScore = latestLevel?.score ?? 0;
  const trendDelta =
    latestLevel && previousLevel && typeof previousLevel.score === "number"
      ? latestScore - (previousLevel.score ?? 0)
      : null;
  const levelFeedback =
    latestScore >= 80
      ? t("level_status_high")
      : latestScore >= 50
        ? t("level_status_mid")
        : t("level_status_low");
  const diaries7d = diaries.filter((d) => {
    const diff = Date.now() - new Date(d.date).getTime();
    return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000;
  }).length;
  const pendingAdvice = adviceItems.filter((a) => !a.completed);

  const handleCompleteAdvice = async (adviceId: string) => {
    if (!adviceId) return;
    try {
      await adviceMutation.mutateAsync({ adviceId, completed: true });
      toast.success(t("advice_complete"));
    } catch (err) {
      console.error("Advice complete failed", err);
      toast.error(tCommon("error"));
    }
  };

  // 새로운 퀴즈가 로드될 때 힌트 초기화
  useEffect(() => {
    setShowHint(false);
  }, [quiz?.archiveId]);

  const filteredArchives = useMemo(
    () => {
      let list = type ? archiveList.filter((a) => a.type === type) : archiveList;
      if (levelFilter) {
        list = list.filter((a) => a.levelTag === levelFilter);
      }
      return list;
    },
    [archiveList, type, levelFilter]
  );

  const handleAdd = async () => {
    if (!title.trim()) {
      toast.error(t("title_required"));
      return;
    }
    if (!userId) {
      toast.error(tCommon("error"));
      return;
    }
    try {
      await create.mutateAsync({
        userId,
        type: addType,
        title: title.trim(),
        rootMeaning: root.trim(),
        examples: example ? [example] : [],
      });
      toast.success(tCommon("success"));
      setTitle("");
      setRoot("");
      setExample("");
    } catch {
      toast.error(t("save_error"));
    }
  };

  const [showLevelHelp, setShowLevelHelp] = useState(false);
  const hideLevelHelpLater = useRef<NodeJS.Timeout | null>(null);

  const handleLevelHelpEnter = () => {
    if (hideLevelHelpLater.current) {
      clearTimeout(hideLevelHelpLater.current);
      hideLevelHelpLater.current = null;
    }
    setShowLevelHelp(true);
  };

  const handleLevelHelpLeave = () => {
    if (hideLevelHelpLater.current) {
      clearTimeout(hideLevelHelpLater.current);
    }
    hideLevelHelpLater.current = setTimeout(() => setShowLevelHelp(false), 3000);
  };

  return (
    <AuthGate>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant={type === undefined ? "primary" : "ghost"} onClick={() => setType(undefined)}>
              {t("all")}
            </Button>
            <Button variant={type === "grammar" ? "primary" : "ghost"} onClick={() => setType("grammar")}>
              {t("grammar")}
            </Button>
            <Button variant={type === "word" ? "primary" : "ghost"} onClick={() => setType("word")}>
              {t("vocabulary")}
            </Button>
            <Button variant={type === "dictionary" ? "primary" : "ghost"} onClick={() => setType("dictionary")}>
              {t("dictionary")}
            </Button>
            <select
              className="h-[38px] rounded-md border border-white/10 bg-white/5 px-3 text-sm text-foreground"
              value={levelFilter ?? ""}
              onChange={(e) => setLevelFilter(e.target.value || undefined)}
            >
              <option value="">{t("level_filter_all")}</option>
              {["A1","A2","B1","B2","C1","C2"].map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 학습 대시보드 */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <CardTitle>{t("dashboard_title")}</CardTitle>
                <p className="text-sm text-muted-foreground">{t("dashboard_subtitle")}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs uppercase text-primary/80">{t("current_level")}</p>
                  <div
                    className="relative inline-flex items-center justify-center"
                    onMouseEnter={handleLevelHelpEnter}
                    onMouseLeave={handleLevelHelpLeave}
                  >
                    <button
                      type="button"
                      className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition"
                      aria-label={t("level_help")}
                      onFocus={() => setShowLevelHelp(true)}
                      onBlur={() => setShowLevelHelp(false)}
                      onClick={() => setShowLevelHelp((prev) => !prev)}
                    >
                      <Info className="h-3 w-3" />
                    </button>
                    {showLevelHelp && (
                      <div className="absolute left-0 top-5 z-10 w-64 rounded-md border border-white/10 bg-black/85 p-2 text-[11px] text-white/90 shadow-lg">
                        {t("level_help")}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex items-end gap-2">
                  <p className="text-3xl font-bold text-foreground">
                    {latestLevel?.level ?? t("level_unknown")}
                  </p>
                  {typeof latestLevel?.score === "number" && (
                    <span className="text-sm text-muted-foreground">({latestLevel.score} pts)</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{levelFeedback}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {trendDelta !== null
                    ? trendDelta >= 0
                      ? t("level_trend_up", { value: Math.abs(trendDelta).toFixed(0) })
                      : t("level_trend_down", { value: Math.abs(trendDelta).toFixed(0) })
                    : t("level_trend")}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase text-muted-foreground">{t("activities_title")}</p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{diaries7d}</p>
                    <p className="text-xs text-muted-foreground">{t("activity_diaries")}</p>
                    {aggregate && (
                      <p className="text-[11px] text-muted-foreground/70">{t("vs_avg", { value: (diaries7d - aggregate.average.diaries7d) })}</p>
                    )}
                    {aggregate && (
                      <div className="mt-1 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-2 bg-gradient-to-r from-primary to-accent"
                          style={{
                            width: `${Math.min(100, (diaries7d / Math.max(1, aggregate.target.diaries7d)) * 100)}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">{archiveList.length}</p>
                    <p className="text-xs text-muted-foreground">{t("activity_archives")}</p>
                    {aggregate && (
                      <p className="text-[11px] text-muted-foreground/70">{t("vs_avg", { value: (archiveList.length - aggregate.average.archivesTotal) })}</p>
                    )}
                    {aggregate && (
                      <div className="mt-1 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-2 bg-gradient-to-r from-primary to-accent"
                          style={{
                            width: `${Math.min(100, (archiveList.length / Math.max(1, aggregate.target.archivesTotal)) * 100)}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">{pendingAdvice.length}</p>
                    <p className="text-xs text-muted-foreground">{t("activity_advice")}</p>
                    {aggregate && (
                      <p className="text-[11px] text-muted-foreground/70">{t("vs_target", { value: (pendingAdvice.length - aggregate.target.adviceOpen) })}</p>
                    )}
                    {aggregate && (
                      <div className="mt-1 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-2 bg-gradient-to-r from-primary to-accent"
                          style={{
                            width: `${Math.min(100, (Math.max(aggregate.target.adviceOpen, 0) / Math.max(1, pendingAdvice.length || 1)) * 100)}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase text-muted-foreground">{t("advice_title")}</p>
                  <p className="text-[11px] text-muted-foreground">{pendingAdvice.length} / {adviceItems.length}</p>
                </div>
                <div className="mt-2 space-y-2 max-h-48 overflow-auto pr-1">
                  {pendingAdvice.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-2 rounded-lg border border-white/10 bg-black/10 p-2"
                    >
                      {(() => {
                        const priority = (item.priority as "high" | "medium" | "low") || "medium";
                        const topicKey = `advice_topic_${item.topic}` as const;
                        const topicLabel =
                          (topicKey && (t as any)?.format ? t(topicKey) : t(topicKey, { defaultMessage: item.topic })) ||
                          item.topic;
                        const message =
                          (item.count
                            ? t("advice_issue_template", { topic: topicLabel, count: item.count })
                            : null) ||
                          item.message?.[locale] ||
                          item.message?.en ||
                          t("advice_empty");
                        return (
                          <>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{item.topic}</p>
                              <p className="text-xs text-muted-foreground">{message}</p>
                              <p className="text-[11px] text-muted-foreground/70 mt-1">
                                {t(`priority_${priority}`)}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="text-xs"
                              disabled={adviceMutation.isPending}
                              onClick={() => handleCompleteAdvice(item.id)}
                            >
                              {t("advice_mark_done")}
                            </Button>
                          </>
                        );
                      })()}
                    </div>
                  ))}
                  {!pendingAdvice.length && (
                    <p className="text-xs text-muted-foreground">{t("advice_empty")}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>{t("add_title")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 grid-cols-1 md:grid-cols-4">
          <select
            aria-label={typeLabel}
            className="h-[42px] rounded-md border border-white/10 bg-white/5 px-3 text-sm"
            value={addType}
            onChange={(e) => setAddType(e.target.value as "grammar" | "word")}
          >
            <option value="grammar">{t("grammar")}</option>
            <option value="word">{t("vocabulary")}</option>
          </select>
          <Input
            placeholder={t("title_placeholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder={t("root_placeholder")}
            value={root}
            onChange={(e) => setRoot(e.target.value)}
          />
          <Input
            placeholder={t("example_placeholder")}
            value={example}
            onChange={(e) => setExample(e.target.value)}
          />
          <Button onClick={handleAdd} disabled={create.isPending}>
            {create.isPending ? t("saving") : t("add_button")}
          </Button>
        </CardContent>
      </Card>

      {/* 추가 폼과 목록 사이 광고 */}
      <ResponsiveAd
        pcUnit={AD_UNITS.ARCHIVE_TOP_PC}
        mobileUnit={AD_UNITS.ARCHIVE_TOP_MOBILE}
        pcWidth={AD_SIZES.PC_LEADERBOARD.width}
        pcHeight={AD_SIZES.PC_LEADERBOARD.height}
        mobileWidth={AD_SIZES.MOBILE_LARGE_BANNER.width}
        mobileHeight={AD_SIZES.MOBILE_LARGE_BANNER.height}
      />

      {/* 모바일: 퀴즈 섹션을 먼저 표시 */}
      <Card className="md:hidden mb-4">
        <CardHeader>
          <CardTitle>{t("quiz_title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!quiz && !quizLoading && selected && (
            <p className="text-sm text-muted-foreground">{t("quiz_empty")}</p>
          )}
          {quizLoading && (
            <p className="text-sm text-muted-foreground animate-pulse">AI 생성 중...</p>
          )}
          {quizError && (
            <p className="text-sm text-destructive">퀴즈 생성 실패</p>
          )}
          {quiz && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">{quiz.question}</p>
              {quiz.options.map((opt, idx) => {
                const isCorrect = idx === quiz.correctIndex;
                const isSelected = idx === selectedAnswer;
                
                console.log(`Option ${idx}:`, { isCorrect, isSelected, showResult, selectedAnswer });
                
                // 버튼 스타일 결정 - render 시점에 계산
                let btnStyle = {};
                let btnClasses = "w-full text-left px-4 py-2 rounded-lg border transition-all text-sm ";
                
                if (showResult) {
                  if (isCorrect) {
                    btnClasses += "bg-green-500/20 border-green-500 text-green-100";
                    btnStyle = {
                      backgroundColor: 'rgba(34, 197, 94, 0.2)',
                      borderColor: 'rgb(34, 197, 94)',
                      color: 'rgb(220, 252, 231)'
                    };
                  } else if (isSelected) {
                    btnClasses += "bg-red-500/20 border-red-500 text-red-100";
                    btnStyle = {
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      borderColor: 'rgb(239, 68, 68)',
                      color: 'rgb(254, 226, 226)'
                    };
                  } else {
                    btnClasses += "border-white/10 text-muted-foreground";
                  }
                } else {
                  btnClasses += isSelected 
                    ? "bg-primary/20 border-primary text-primary-foreground" 
                    : "border-white/10 hover:border-primary/40 text-foreground";
                }

                return (
                  <button
                    key={idx}
                    disabled={showResult}
                    onClick={() => {
                      console.log('🎯 Button clicked:', idx);
                      setSelectedAnswer(idx);
                      setShowResult(true);
                      
                      setTimeout(() => {
                        console.log('🔄 Resetting quiz state');
                        setSelectedAnswer(null);
                        setShowResult(false);
                      }, 7000);
                    }}
                    className={btnClasses}
                    style={btnStyle}
                  >
                    {opt}
                  </button>
                );
              })}
              
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="w-full mt-3 px-4 py-2 text-sm rounded-lg border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {showHint ? t("hide_hint") : t("show_hint")}
              </button>
              
              {showHint && (
                <p className="text-xs text-muted-foreground mt-2">{quiz.explanation}</p>
              )}
            </div>
          )}
          
          {/* 모바일 퀴즈 하단 광고 */}
          <div className="pt-4 border-t border-white/10 mt-4">
            <ResponsiveAd
              pcUnit={AD_UNITS.ARCHIVE_QUIZ_SIDE}
              mobileUnit={AD_UNITS.ARCHIVE_QUIZ_MOBILE}
              pcWidth={AD_SIZES.PC_SQUARE.width}
              pcHeight={AD_SIZES.PC_SQUARE.height}
              mobileWidth={AD_SIZES.MOBILE_LARGE_BANNER.width}
              mobileHeight={AD_SIZES.MOBILE_LARGE_BANNER.height}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t("list_title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[calc(100vh-400px)] min-h-[400px] overflow-y-auto pr-2">
              {(loading || isLoading || !canLoad) && (
                <p className="text-muted-foreground">{tCommon("loading")}</p>
              )}
              {!loading && !isLoading && canLoad && filteredArchives.length === 0 && (
                <p className="text-muted-foreground">{t("empty")}</p>
              )}
              {filteredArchives.map((item) => (
                <ArchiveListCard
                  key={item.id}
                  item={item}
                  onSelect={() => {
                    setSelected(item);
                    trackEvent("quiz_started", { archiveId: item.id, type: item.type });
                  }}
                  t={t}
                  locale={locale}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* PC: 퀴즈 섹션 */}
        <Card className="hidden md:block">
          <CardHeader>
            <CardTitle>{t("quiz_title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!quiz && !quizLoading && selected && (
              <p className="text-sm text-muted-foreground">{t("quiz_empty")}</p>
            )}
            {quizLoading && (
              <p className="text-sm text-muted-foreground animate-pulse">AI 생성 중...</p>
            )}
            {quizError && (
              <p className="text-sm text-destructive">퀴즈 생성 실패</p>
            )}
            {quiz && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">{quiz.question}</p>
                {quiz.options.map((opt, idx) => {
                  const isCorrect = idx === quiz.correctIndex;
                  const isSelected = idx === selectedAnswer;
                  
                  console.log(`Option ${idx}:`, { isCorrect, isSelected, showResult, selectedAnswer });
                  
                  // 버튼 스타일 결정 - render 시점에 계산
                  let btnStyle = {};
                  let btnClasses = "w-full text-left px-4 py-2 rounded-lg border transition-all text-sm ";
                  
                  if (showResult) {
                    if (isCorrect) {
                      btnClasses += "bg-green-500/20 border-green-500 text-green-100";
                      btnStyle = {
                        backgroundColor: 'rgba(34, 197, 94, 0.2)',
                        borderColor: 'rgb(34, 197, 94)',
                        color: 'rgb(220, 252, 231)'
                      };
                    } else if (isSelected) {
                      btnClasses += "bg-red-500/20 border-red-500 text-red-100";
                      btnStyle = {
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        borderColor: 'rgb(239, 68, 68)',
                        color: 'rgb(254, 226, 226)'
                      };
                    } else {
                      btnClasses += "border-white/10 text-muted-foreground";
                    }
                  } else {
                    btnClasses += isSelected 
                      ? "bg-primary/20 border-primary text-primary-foreground" 
                      : "border-white/10 hover:border-primary/40 text-foreground";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={showResult}
                      onClick={() => {
                        const correct = idx === quiz.correctIndex;
                        
                        console.log('🎯 Quiz answer clicked:', { 
                          idx, 
                          correct,
                          beforeState: { selectedAnswer, showResult }
                        });
                        
                        setSelectedAnswer(idx);
                        setShowResult(true);
                        
                        console.log('✅ State updated:', { 
                          newSelectedAnswer: idx,
                          newShowResult: true
                        });
                        
                        trackEvent("quiz_answered", {
                          archiveId: quiz.archiveId,
                          selected: idx,
                          correct,
                        });
                        adjustLevelFromQuiz({
                          userId,
                          correct,
                          currentScore: latestScore,
                          targetLanguage: locale,
                          sourceId: quiz.archiveId,
                          quizLevel: selected?.levelTag as any,
                        });
                        toast[correct ? "success" : "error"](
                          correct ? t("quiz_correct") : t("quiz_wrong"),
                          { description: quiz.explanation }
                        );
                        
                        // 7초 후 자동으로 리셋
                        setTimeout(() => {
                          console.log('🔄 Resetting quiz state');
                          setSelectedAnswer(null);
                          setShowResult(false);
                        }, 7000);
                      }}
                      className={btnClasses}
                      style={btnStyle}
                    >
                      {opt}
                    </button>
                  );
                })}
              
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="w-full mt-3 px-4 py-2 text-sm rounded-lg border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {showHint ? t("hide_hint") : t("show_hint")}
              </button>
              
              {showHint && (
                <p className="text-xs text-muted-foreground mt-2">{quiz.explanation}</p>
              )}
            </div>
            )}
            
            {/* 퀴즈 하단 광고 (PC 전용) */}
            <div className="hidden md:block pt-4 border-t border-white/10 mt-4">
              <ResponsiveAd
                pcUnit={AD_UNITS.ARCHIVE_QUIZ_SIDE}
                mobileUnit={AD_UNITS.ARCHIVE_QUIZ_MOBILE}
                pcWidth={AD_SIZES.PC_SQUARE.width}
                pcHeight={AD_SIZES.PC_SQUARE.height}
                mobileWidth={AD_SIZES.MOBILE_LARGE_BANNER.width}
                mobileHeight={AD_SIZES.MOBILE_LARGE_BANNER.height}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
      
      {/* AI Dictionary Floating Action Button */}
      <DictionaryFAB />
    </AuthGate>
  );
}
