"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useArchiveList, useQuiz, useArchiveProgressMutation, useArchiveDeleteMutation } from "@/application/archive/hooks";
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
import { AD_UNITS, AD_SIZES } from "@/config/ads";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// 아카이브 리스트 카드 컴포넌트
function ArchiveListCard({
  item,
  onSelect,
  onDelete,
  t,
  tCommon,
  locale
}: {
  item: LearningArchive;
  onSelect: () => void;
  onDelete: (id: string) => void;
  t: (key: string, values?: Record<string, any>) => string;
  tCommon: (key: string, values?: Record<string, any>) => string;
  locale: string;
}) {
  const [showExamples, setShowExamples] = useState(false);
  const hasExamples = item.examples && item.examples.length > 0;
  const isDictionary = item.sourceId === "dictionary" || item.sourceText?.startsWith("[Dictionary]");
  const typeLabel = isDictionary
    ? t("dictionary")
    : item.type === "word"
      ? t("vocabulary")
      : t("grammar");
  const correctCount = item.correctCount ?? 0;
  const isMemorized = item.memorized || correctCount >= 3;
  const formatMessage = useCallback(
    (key: string, params: Record<string, string | number>) => {
      try {
        return t(key, params);
      } catch {
        const raw = (t as any)?.raw?.(key) ?? "";
        if (typeof raw === "string") {
          return raw.replace(/\{(\w+)\}/g, (_, token) => String(params[token] ?? ""));
        }
        return "";
      }
    },
    [t]
  );

  return (
    <div className="relative rounded-lg border border-white/10 bg-white/5 p-3 hover:border-primary/40 transition">
      <button
        type="button"
        aria-label={tCommon("delete") ?? "Delete"}
        className="absolute right-2 top-2 text-xs text-muted-foreground hover:text-destructive transition"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
      >
        ×
      </button>
      <div 
        className="cursor-pointer"
        onClick={onSelect}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground break-words">{item.title}</p>
            <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">{typeLabel}</span>
              {hasExamples && (
              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">
                {t("quick_quiz_badge")}
              </span>
              )}
              {!isMemorized && (
                <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-200 border border-amber-400/40">
                  {formatMessage("correct_count", { value: correctCount })}
                </span>
              )}
              {isMemorized && (
                <span className="px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-500/40">
                  {t("memorized")}
                </span>
              )}
            </div>
          </div>
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
            <span>
              {showExamples
                ? formatMessage("hide_examples", { count: item.examples.length })
                : formatMessage("show_examples", { count: item.examples.length })}
            </span>
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
  const router = useRouter();
  const { user, loading } = useAuth();
  const userId = user?.uid ?? "";
  const [type, setType] = useState<string | undefined>(undefined);
  const [levelFilter, setLevelFilter] = useState<string | undefined>(undefined);
  const canLoad = Boolean(userId) && !loading;
  const effectiveType = type === "dictionary" ? undefined : type;
  const { data: archives, isLoading } = useArchiveList(userId, effectiveType, { enabled: canLoad, levelTag: levelFilter });
  const archiveList: LearningArchive[] = useMemo(() => (archives ?? []) as LearningArchive[], [archives]);
  const { data: diaries = [] } = useDiaryList(userId, undefined, { enabled: canLoad });
  const { data: levels = [] } = useLevelRecords(userId, { enabled: canLoad, limit: 50 });
  const { data: adviceItems = [] } = useAdviceList(userId, { enabled: canLoad, limit: 10 });
  const adviceMutation = useAdviceComplete(userId);
  const { data: aggregate } = useLearningAggregate(canLoad);
  const deleteMutation = useArchiveDeleteMutation(userId);
  const [archiveToDelete, setArchiveToDelete] = useState<LearningArchive | null>(null);
  
  // 디버깅 로그
  console.log("📚 Archive Page State:", {
    userId,
    loading,
    canLoad,
    isLoading,
    archivesCount: archiveList.length,
    archives: archiveList.slice(0, 2), // 처음 2개만 표시
  });
  
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
  const { update: updateProgress } = useArchiveProgressMutation(userId);

  // Separate levels
  const latestGeneralLevel = useMemo(() => levels.find(l => l.sourceType !== 'speaking') ?? levels[0], [levels]);
  const latestSpeakingLevel = useMemo(() => levels.find(l => l.sourceType === 'speaking'), [levels]);
  const previousLevel = levels.find(l => l.sourceType !== 'speaking' && l.id !== latestGeneralLevel?.id);
  const latestScore = latestGeneralLevel?.score ?? 0;
  const trendDelta =
    latestGeneralLevel && previousLevel && typeof previousLevel.score === "number"
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
  const aggregateAvg = aggregate?.average ?? { diaries7d: 0, archivesTotal: 0, adviceOpen: 0, level: "", score: 0 };
  const aggregateTarget = aggregate?.target ?? { diaries7d: 0, archivesTotal: 0, adviceOpen: 0, level: "", score: 0 };
  const adviceTotal = adviceItems.length;
  const adviceCompleted = Math.max(0, adviceTotal - pendingAdvice.length);
  const adviceProgress = adviceTotal
    ? Math.min(100, Math.max(0, (adviceCompleted / adviceTotal) * 100))
    : 100;

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
      let list = archiveList;
      if (type === "dictionary") {
        list = list.filter((a) => a.sourceId === "dictionary" || a.sourceText?.startsWith("[Dictionary]"));
      } else if (type) {
        list = list.filter((a) => a.type === type);
      }
      if (levelFilter) {
        list = list.filter((a) => a.levelTag === levelFilter);
      }
      return list;
    },
    [archiveList, type, levelFilter]
  );

  const pickRandomQuizEntry = useCallback(
    (currentId?: string): LearningArchive | null => {
      const candidates = filteredArchives.filter((a) => a.id !== currentId && (a.examples?.length ?? 0) > 0);
      if (!candidates.length) return null;
      const idx = Math.floor(Math.random() * candidates.length);
      return candidates[idx] || null;
    },
    [filteredArchives]
  );

  const handleQuizOptionClick = (idx: number) => {
    if (!quiz) return;
    const correct = idx === quiz.correctIndex;

    setSelectedAnswer(idx);
    setShowResult(true);

    toast[correct ? "success" : "error"](
      correct ? t("quiz_correct") : t("quiz_wrong"),
      { description: quiz.explanation }
    );

    if (selected) {
      trackEvent("quiz_answered", {
        archiveId: quiz.archiveId,
        selected: idx,
        correct,
      });
      adjustLevelFromQuiz({
        userId,
        correct,
        currentScore: latestScore,
        quizLevel: selected.levelTag,
      });
    }

    if (correct && selected) {
      const newCount = (selected.correctCount ?? 0) + 1;
      const memorized = selected.memorized || newCount >= 3;
      setSelected({ ...selected, correctCount: newCount, memorized });
      updateProgress.mutate({ archiveId: quiz.archiveId, correctCount: newCount, memorized });

      const next = pickRandomQuizEntry(selected.id);
      if (next) {
        setTimeout(() => {
          setSelectedAnswer(null);
          setShowResult(false);
          setShowHint(false);
          setSelected(next);
        }, 800);
      }
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setShowResult(false);
    }, 7000);
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
        {/* 삭제 확인 모달 */}
        {archiveToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-lg border border-white/10 bg-black/80 p-4 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">{t("delete_confirm_title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("delete_confirm_desc")}
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setArchiveToDelete(null)}>
                  {tCommon("cancel")}
                </Button>
                <Button
                  variant="primary"
                  className="bg-amber-500 hover:bg-amber-600 text-black"
                  disabled={deleteMutation.isPending}
                  onClick={async () => {
                    if (!archiveToDelete) return;
                    try {
                      if (deleteMutation.mutateAsync) {
                        await deleteMutation.mutateAsync({ archiveId: archiveToDelete.id });
                      } else {
                        await new Promise<void>((resolve, reject) => {
                          deleteMutation.mutate(
                            { archiveId: archiveToDelete.id },
                            { onSuccess: () => resolve(), onError: (err) => reject(err) }
                          );
                        });
                      }
                      setArchiveToDelete(null);
                    } catch (err) {
                      console.error("Archive delete failed", err);
                      toast.error(tCommon("error"));
                    }
                  }}
                >
                  {deleteMutation.isPending ? t("delete_confirm_loading") : tCommon("delete")}
                </Button>
              </div>
            </div>
          </div>
        )}

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
                <div className="flex flex-col gap-4">
                  {/* General Level */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs uppercase text-primary/80">{t("level_general")}</p>
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
                            <div className="absolute left-0 top-5 z-10 w-64 rounded-md border border-white/10 bg-black/85 p-2 text-[11px] text-white/90 shadow-lg z-[100]">
                              {t("level_help")}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-1 flex items-end gap-2">
                        <p className="text-2xl font-bold text-foreground">
                          {latestGeneralLevel?.level ?? t("level_unknown")}
                        </p>
                        {typeof latestGeneralLevel?.score === "number" && (
                          <span className="text-xs text-muted-foreground">({latestGeneralLevel.score})</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] text-muted-foreground">{levelFeedback}</p>
                       <p className="text-[10px] text-muted-foreground">
                        {trendDelta !== null
                          ? trendDelta >= 0
                            ? t("level_trend_up", { value: Math.abs(trendDelta).toFixed(0) })
                            : t("level_trend_down", { value: Math.abs(trendDelta).toFixed(0) })
                          : t("level_trend")}
                      </p>
                    </div>
                  </div>

                  {/* Speaking Level Divider */}
                  <div className="h-px bg-primary/20 w-full" />

                  {/* Speaking Level */}
                  <div className="flex items-center justify-between">
                     <div>
                      <p className="text-xs uppercase text-accent/80">{t("level_speaking")}</p>
                      <div className="mt-1 flex items-end gap-2">
                        <p className="text-2xl font-bold text-foreground">
                          {latestSpeakingLevel?.level ?? "-"}
                        </p>
                        {typeof latestSpeakingLevel?.score === "number" && (
                          <span className="text-xs text-muted-foreground">({latestSpeakingLevel.score})</span>
                        )}
                      </div>
                    </div>
                     <div className="text-right">
                        {latestSpeakingLevel ? (
                          <div className="flex flex-col items-end gap-1">
                            <p className="text-[10px] text-muted-foreground">
                              {formatDate(latestSpeakingLevel.createdAt, locale)}
                            </p>
                            <Button
                              size="sm"
                              variant="glass"
                              className="h-6 text-[10px] bg-accent/10 border-accent/20 text-accent hover:bg-accent/20 px-2"
                              onClick={() => router.push("/speaking")}
                            >
                              {t("level_up")}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="glass"
                            className="h-8 text-[11px] bg-accent/10 border-accent/20 text-accent hover:bg-accent/20"
                            onClick={() => router.push("/speaking")}
                          >
                            {t("start_speaking_practice")}
                          </Button>
                        )}
                     </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase text-muted-foreground">{t("activities_title")}</p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{diaries7d}</p>
                    <p className="text-xs text-muted-foreground">{t("activity_diaries")}</p>
                    <p className="text-[11px] text-muted-foreground/70">{t("vs_avg", { value: (diaries7d - (aggregateAvg?.diaries7d ?? 0)) })}</p>
                    <div className="mt-1 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-primary to-accent"
                        style={{
                          width: `${Math.min(100, (diaries7d / Math.max(1, aggregateTarget?.diaries7d ?? 0)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">{archiveList.length}</p>
                    <p className="text-xs text-muted-foreground">{t("activity_archives")}</p>
                    <p className="text-[11px] text-muted-foreground/70">{t("vs_avg", { value: (archiveList.length - (aggregateAvg?.archivesTotal ?? 0)) })}</p>
                    <div className="mt-1 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-primary to-accent"
                        style={{
                          width: `${Math.min(100, (archiveList.length / Math.max(1, aggregateTarget?.archivesTotal ?? 0)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">{pendingAdvice.length}</p>
                    <p className="text-xs text-muted-foreground">{t("activity_advice")}</p>
                    <p className="text-[11px] text-muted-foreground/70">{t("vs_target", { value: (pendingAdvice.length - (aggregateTarget?.adviceOpen ?? 0)) })}</p>
                    <div className="mt-1 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-primary to-accent"
                        style={{
                          width: `${adviceProgress}%`,
                        }}
                      />
                    </div>
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
                        const count = typeof item.count === "number" ? item.count : 1;
                        const message =
                          t("advice_issue_template", { topic: topicLabel, count }) ||
                          item.message?.[locale] ||
                          item.message?.en ||
                          t("advice_empty");
                        return (
                          <>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground">{topicLabel}</p>
                              <p className="text-xs text-muted-foreground">{message}</p>
                              <p className="text-[11px] text-muted-foreground/70 mt-1">
                                {t(`priority_${priority}`)}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="text-xs shrink-0"
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
                  } else {
                    btnClasses += "border-white/10 text-muted-foreground";
                  }
                  // 정답 공개 시 호버/포커스 제거, 오답은 회색만
                  btnClasses += " pointer-events-none cursor-default hover:bg-transparent hover:border-current hover:text-inherit";
                } else {
                  btnClasses += isSelected 
                    ? "bg-primary/20 border-primary text-primary-foreground" 
                    : "border-white/10 hover:border-primary/40 text-foreground";
                }

                return (
                  <button
                    key={idx}
                    disabled={showResult}
                    onClick={() => handleQuizOptionClick(idx)}
                    className={btnClasses}
                    style={showResult ? { ...btnStyle, pointerEvents: "none" } : btnStyle}
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
                  onDelete={(id) => {
                    const target = archiveList.find((a) => a.id === id);
                    if (target) {
                      setArchiveToDelete(target);
                    }
                  }}
                  t={t}
                  tCommon={tCommon}
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
                  } else {
                    btnClasses += "border-white/10 text-muted-foreground";
                  }
                  btnClasses += " pointer-events-none cursor-default hover:bg-transparent hover:border-current hover:text-inherit";
                } else {
                  btnClasses += isSelected 
                    ? "bg-primary/20 border-primary text-primary-foreground" 
                    : "border-white/10 hover:border-primary/40 text-foreground";
                }

                return (
                  <button
                    key={idx}
                    disabled={showResult}
                    onClick={() => handleQuizOptionClick(idx)}
                    className={btnClasses}
                    style={showResult ? { ...btnStyle, pointerEvents: "none" } : btnStyle}
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
      
    </AuthGate>
  );
}
