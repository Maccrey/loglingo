"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLocale, useTranslations } from "next-intl";
import { useArchiveList, useArchiveMutations, useQuiz } from "@/application/archive/hooks";
import { useAuth } from "@/application/auth/AuthProvider";

import { LearningArchive } from "@/domain/archive";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import { formatDate } from "@/lib/intl-format";
import { AuthGate } from "@/components/auth/AuthGate";
import { ResponsiveAd } from "@/components/ads/ResponsiveAd";
import KakaoAdFit from "@/components/ads/KakaoAdFit";
import { AD_UNITS, AD_SIZES } from "@/config/ads";

export default function ArchivePage() {
  const t = useTranslations("archive");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { user, loading } = useAuth();
  const userId = user?.uid ?? "";
  const typeLabel = t("type_label", { defaultMessage: "Type" });
  const [type, setType] = useState<string | undefined>(undefined);
  const [addType, setAddType] = useState<"grammar" | "word">("grammar");
  const [title, setTitle] = useState("");
  const [root, setRoot] = useState("");
  const [example, setExample] = useState("");
  const canLoad = Boolean(userId) && !loading;
  const { data: archives, isLoading } = useArchiveList(userId, type, { enabled: canLoad });
  const archiveList: LearningArchive[] = useMemo(() => (archives ?? []) as LearningArchive[], [archives]);
  
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
  const { quiz, isLoading: quizLoading, error: quizError } = useQuiz(
    selected || undefined,
    selected ? t("quiz_question", { title: selected.title }) : undefined,
    locale,
    locale // TODO: Get from user settings
  );

  const filteredArchives = useMemo(
    () => (type ? archiveList.filter((a) => a.type === type) : archiveList),
    [archiveList, type]
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

  return (
    <AuthGate>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
        <div className="flex gap-2">
          <Button variant={type === undefined ? "primary" : "ghost"} onClick={() => setType(undefined)}>
            {t("all")}
          </Button>
          <Button variant={type === "grammar" ? "primary" : "ghost"} onClick={() => setType("grammar")}>
            {t("grammar")}
          </Button>
          <Button variant={type === "word" ? "primary" : "ghost"} onClick={() => setType("word")}>
            {t("vocabulary")}
          </Button>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>{t("add_title")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
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
              <p className="text-xs text-muted-foreground mt-2">{quiz.explanation}</p>
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
                <div
                  key={item.id}
                  className="rounded-lg border border-white/10 bg-white/5 p-3 hover:border-primary/40 transition cursor-pointer"
                  onClick={() => {
                    setSelected(item);
                    trackEvent("quiz_started", { archiveId: item.id, type: item.type });
                  }}
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
                  {item.examples.length > 0 && (
                    <p className="text-xs text-primary mt-1">{item.examples[0]}</p>
                  )}
                </div>
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
                <p className="text-xs text-muted-foreground mt-2">{quiz.explanation}</p>
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
