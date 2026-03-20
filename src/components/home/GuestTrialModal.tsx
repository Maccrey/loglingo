"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Globe, Volume2, Loader2, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLearningLanguage } from "@/application/i18n/LearningLanguageProvider";
import { routing, useRouter } from "@/i18n/routing";
import { useDiaryTts } from "@/application/diary/useDiaryTts";
import { CorrectionResult } from "@/domain/ai-correction";
import { trackEvent } from "@/lib/analytics";
import { DuckMascot } from "@/components/mascot/DuckMascot";

interface GuestTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuestTrialModal({ isOpen, onClose }: GuestTrialModalProps) {
  const t = useTranslations("trial");
  const tOnboarding = useTranslations("language_onboarding");
  const locale = useLocale();
  const router = useRouter();
  
  const { learningLanguage, setLearningLanguage } = useLearningLanguage();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CorrectionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const trialIdRef = useRef(`trial_${Date.now()}`);
  const { generateAndPlayAudio, isGenerating, audioUrl } = useDiaryTts(trialIdRef.current);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  }, [audioUrl]);

  // 언어 이름 가져오기
  const getLanguageLabel = (code: string) => {
    try {
      return new Intl.DisplayNames([locale], { type: "language" }).of(code) ?? code;
    } catch {
      return code;
    }
  };

  const handleClose = () => {
    if (isLoading || isGenerating) return;
    setContent("");
    setResult(null);
    setErrorMsg("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setIsLoading(true);
    setErrorMsg("");
    setResult(null);

    trackEvent("start_process", {
      component_name: "홈 게스트 체험",
      action_detail: "교정 요청",
      target_language: learningLanguage
    });

    try {
      const res = await fetch("/api/ai/correct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          mode: "sentence",
          locale,
          learningLanguage,
          targetLanguage: learningLanguage
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Something went wrong");
      }

      const data: CorrectionResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || "Failed to process text.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTts = () => {
    if (!result?.corrected) return;
    generateAndPlayAudio(trialIdRef.current, result.corrected, learningLanguage);
  };

  const handleSignup = () => {
    // 체험 완료 마킹 후 회원가입 이동
    if (typeof window !== "undefined") {
      localStorage.setItem("loglingo_trial_completed", "true");
    }
    onClose();
    router.push("/diary/new");
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t("banner_title")} className="max-w-2xl">
      <div className="space-y-6">
        {!result ? (
          <>
            {/* 1. 언어 설정 & 입력 UI */}
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">{t("banner_desc")}</p>
              
              <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg border border-orange-500/20 w-fit mt-2">
                <Globe className="h-4 w-4 text-orange-400" />
                <span className="text-sm text-orange-200/70">{tOnboarding("label")}:</span>
                <select
                  className="bg-transparent text-sm font-medium text-orange-100 focus:outline-none cursor-pointer"
                  value={learningLanguage}
                  onChange={(e) => setLearningLanguage(e.target.value)}
                >
                  {routing.locales.map((code) => (
                    <option key={code} value={code} className="bg-slate-800 text-white">
                      {getLanguageLabel(code)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type one sentence here in any language..."
                className="w-full min-h-[120px] resize-none rounded-xl bg-white/5 border border-white/10 p-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                maxLength={200}
                disabled={isLoading}
              />
              <div className="absolute bottom-3 right-3 text-xs text-white/30">
                {content.length} / 200
              </div>
            </div>

            {errorMsg && (
              <p className="text-sm text-red-400">{errorMsg}</p>
            )}

            <Button 
              onClick={handleSubmit} 
              disabled={!content.trim() || isLoading}
              className={`w-full py-6 text-lg transition-colors border-none ${
                content.trim() && !isLoading
                  ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20"
                  : "bg-white/10 text-white/50 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...</>
              ) : (
                <><Sparkles className="mr-2 h-5 w-5" /> {t("try_it_out")}</>
              )}
            </Button>
          </>
        ) : (
          <>
            {/* 2. 결과 UI */}
            <div className="space-y-4">
              {result.emotionalComment && (
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                  <DuckMascot mode="teacher" width={60} height={60} enableEgg={false} className="shrink-0 drop-shadow-md" />
                  <p className="text-sm font-medium text-white/90 text-center sm:text-left leading-relaxed flex-1">
                    {result.emotionalComment}
                  </p>
                </div>
              )}
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <CheckCircle2 className="w-24 h-24" />
                </div>
                <h3 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Corrected Text
                </h3>
                <p className="text-xl font-medium text-white mb-4 relative z-10 leading-relaxed">
                  {result.corrected}
                </p>
                <Button 
                  onClick={handleTts} 
                  disabled={isGenerating}
                  variant="secondary"
                  size="sm"
                  className="bg-black/40 hover:bg-black/60 text-white border-white/10 relative z-10"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Volume2 className="w-4 h-4 mr-2" />}
                  Listen
                </Button>
              </div>

              {result.issues && result.issues.length > 0 && (
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {result.issues.map((issue, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs line-through">
                          {issue.original}
                        </span>
                        <ArrowRight className="w-3 h-3 text-white/40" />
                        <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded text-xs font-medium">
                          {issue.suggestion}
                        </span>
                      </div>
                      <p className="text-white/70">{issue.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="pt-4 border-t border-white/10">
                <Button 
                  onClick={handleSignup} 
                  className="w-full py-6 text-lg bg-white text-black hover:bg-gray-200"
                >
                  {t("signup_prompt")}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-center text-xs text-white/50 mt-3">
                  Sign up for free to keep a daily diary, build your streak, and save audio logs!
                </p>
              </div>
            </div>
            
            <audio ref={audioRef} src={audioUrl || undefined} className="hidden" />
          </>
        )}
      </div>
    </Modal>
  );
}
