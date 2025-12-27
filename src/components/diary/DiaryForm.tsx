"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Diary } from "@/domain/diary";
import {
  DiaryPayload,
  DiaryValidationError,
} from "@/application/diary/diary-service";
import { getImagePreview } from "@/lib/image";
import { toast } from "sonner";
import { Image as ImageIcon, Loader2, Sparkles, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import NextImage from "next/image";
import { AiFeedback } from "../ai/AiFeedback";
import { requestAiCorrection } from "@/application/ai/correction-service";
import { trackEvent } from "@/lib/analytics";
import { CorrectionResult } from "@/domain/ai-correction";
import { useArchiveMutations } from "@/application/archive/hooks";
import { getCurrentUserId } from "@/lib/current-user";
import { useLearningLanguage } from "@/application/i18n/LearningLanguageProvider";
import { auth } from "@/lib/firebase";
import { persistInsightsFromCorrection } from "@/application/learning-profile/service";

import { LearningArchiveDraft } from "@/domain/archive";

type DiaryFormProps = {
  initial?: Diary | null;
  onSubmit: (payload: DiaryPayload & { onUploadProgress?: (n: number) => void }) => Promise<Diary | void>;
  onDelete?: () => Promise<void>;
  isSubmitting?: boolean;
  onSuccess?: () => void;
  isTrialMode?: boolean;
};

function today() {
  return new Date().toISOString().split("T")[0];
}

export function DiaryForm({ initial, onSubmit, onDelete, isSubmitting, onSuccess, isTrialMode = false }: DiaryFormProps) {
  const t = useTranslations("write");
  const tTrial = useTranslations("trial");
  const tDiary = useTranslations("diary");
  const locale = useLocale();
  const router = useRouter();
  const userId = getCurrentUserId() || auth.currentUser?.uid || "";
  const { learningLanguage } = useLearningLanguage();
  // Safe to call hook as long as we don't invoke the mutation in trial mode
  const { create: createArchive } = useArchiveMutations(userId);
  const validationKeyMap: Record<string, string> = {
    "invalid-date": "validation_invalid_date",
    "empty-content": "validation_empty_content",
    "too-long": "validation_too_long",
  };

  const [date, setDate] = useState(initial?.date ?? today());
  const [content, setContent] = useState(initial?.content ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(initial?.imageUrl);
  const [removeImage, setRemoveImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [aiResult, setAiResult] = useState<CorrectionResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [savingArchive, setSavingArchive] = useState(false);
  const [pendingArchives, setPendingArchives] = useState<LearningArchiveDraft[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    if (initial) {
      setDate(initial.date);
      setContent(initial.content);
      setImagePreview(initial.imageUrl);
      setRemoveImage(false);
      setImageFile(null);
    }
  }, [initial]);

  const handleFileChange = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(t("validation_image"));
      return;
    }
    setRemoveImage(false);
    setImageFile(file);
    const preview = await getImagePreview(file);
    setImagePreview(preview);
  };

  const openFilePicker = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      handleFileChange(target.files?.[0] || undefined);
    };
    input.click();
  };

  const performSave = async () => {
    setErrors([]);

    try {
      const newDiary = await onSubmit({
        date,
        content,
        imageFile,
        removeImage,
        onUploadProgress: (progress) => setUploadProgress(progress),
      });

      // 일기 저장이 성공하고, 대기 중인 아카이브 항목이 있으면 저장
      if (newDiary && pendingArchives.length > 0) {
        try {
          await Promise.all(
            pendingArchives.map(entry => 
              createArchive.mutateAsync({
                ...entry,
                sourceId: newDiary.id
              })
            )
          );
          toast.success(t("ai_saved_archive"));
        } catch (err) {
          console.error("Failed to save pending archives", err);
          toast.error(t("archive_save_failed"));
        }
      }

      toast.success(t("saved"));
      setUploadProgress(0);
      
      if (onSuccess) {
        onSuccess();
      }

      if (!initial) {
        setContent("");
        setImageFile(null);
        setImagePreview(undefined);
      }
    } catch (error: unknown) {
      if (error instanceof DiaryValidationError) {
        setErrors(error.reasons);
        return;
      }
      toast.error(t("upload_failed"));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!aiResult) {
      setShowSaveDialog(true);
    } else {
      await performSave();
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm(tDiary("confirm_delete"))) return;
    try {
      setDeleting(true);
      await onDelete();
      toast.success(tDiary("delete_success"));
      router.push("/diary");
    } catch {
      toast.error(tDiary("delete_error"));
    } finally {
      setDeleting(false);
    }
  };

  const handleAiCheck = async () => {
    if (!content.trim()) {
      toast.error(t("validation_empty_content"));
      return;
    }
    setAiLoading(true);
    setAiResult(null);
    trackEvent("ai_correct_clicked", { mode: "full" });
    try {
      const result = await requestAiCorrection({
        content,
        mode: "full",
        locale,
        // 학습 언어를 우선으로 결과를 받도록 지정, 없으면 UI 언어 사용
        targetLanguage: learningLanguage || locale,
        learningLanguage,
      });
      setAiResult(result);
      trackEvent("ai_correct_success");

      // AI 교정 결과 기반 학습 레벨/조언 저장 (실패해도 주요 플로우 영향 없음)
      if (!isTrialMode) {
        persistInsightsFromCorrection(result, {
          userId,
          uiLocale: locale,
          targetLanguage: learningLanguage || locale,
          sourceId: initial?.id,
        }).catch((err) => {
          console.error("Persist insights failed", err);
        });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "unknown";
      trackEvent("ai_correct_failure", { message });
      
      if (message.includes("timed out") || message.includes("504")) {
        toast.error(t("ai_timeout"));
      } else if (message.includes("502") || message.includes("500") || message.includes("unavailable")) {
        toast.error(t("ai_server_error"));
      } else {
        toast.error(t("ai_error"));
      }
    } finally {
      setAiLoading(false);
    }
  };

  const applyAiResult = async (text: string) => {
    setContent(text);
    toast.success(t("ai_applied"));
    
    // 교정 적용 시 아카이브에도 저장
    await handleSaveArchive();
  };

  const handleSaveArchive = async () => {
    // In trial mode, we do NOT save to archive automatically
    if (isTrialMode) return;

    console.log("Archive Save: Starting save process...", { hasAiResult: !!aiResult, userId });
    
    if (!aiResult || !userId) {
      console.warn("Archive Save: Missing requirements", { aiResult: !!aiResult, userId });
      return;
    }

    try {
      setSavingArchive(true);

      const entries: LearningArchiveDraft[] = [];

      // 교정된 전체 문장을 아카이브에 저장
      if (aiResult.corrected.trim() && aiResult.rootMeaningGuide) {
        const title = aiResult.corrected.slice(0, 80);
        
        let isDuplicate = false;
        if (initial?.id) {
          const { checkDuplicate } = await import("@/infrastructure/firebase/archive-repository");
          isDuplicate = await checkDuplicate(userId, title, initial.id);
        }
        
        console.log("Archive Save: Checking main sentence duplicate", { title, isDuplicate, sourceId: initial?.id });
        
        if (!isDuplicate) {
          entries.push({
            userId,
            type: "grammar" as const,
            title,
            rootMeaning: aiResult.rootMeaningGuide,
            examples: [aiResult.corrected],
            levelTag: aiResult.levelAssessment?.level,
            sourceId: initial?.id,
          });
        }
      }

      // 각 이슈별로 저장 (중복 체크 포함)
      for (const issue of aiResult.issues || []) {
        const title = issue.suggestion.slice(0, 80);
        
        let isDuplicate = false;
        if (initial?.id) {
          const { checkDuplicate } = await import("@/infrastructure/firebase/archive-repository");
          isDuplicate = await checkDuplicate(userId, title, initial.id);
        }
        
        console.log("Archive Save: Checking issue duplicate", { title, isDuplicate, sourceId: initial?.id });
        
        if (!isDuplicate) {
          entries.push({
            userId,
            type: issue.type === "word" ? "word" : "grammar", // Map AI issue type to ArchiveType
            title,
            rootMeaning: issue.explanation || aiResult.rootMeaningGuide || "AI suggestion",
            // Use exampleSentences if available, otherwise fallback to original and suggestion
            examples: issue.exampleSentences && issue.exampleSentences.length > 0 
              ? issue.exampleSentences 
              : [issue.original, issue.suggestion].filter(Boolean),
            levelTag: aiResult.levelAssessment?.level,
            sourceId: initial?.id,
            sourceText: issue.original, // Store original text for context
          });
        }
      }

      console.log("Archive Save: Entries to save", { count: entries.length, isEdit: !!initial?.id });

      if (entries.length > 0) {
        // 이미 저장된 일기(수정 모드)인 경우 바로 저장
        if (initial?.id) {
          await Promise.all(entries.map((entry) => createArchive.mutateAsync(entry)));
          toast.success(t("ai_saved_archive"));
        } else {
          // 새 일기인 경우 pending 상태로 보관 -> 일기 저장 시 함께 저장
          setPendingArchives(prev => [...prev, ...entries]);
          console.log("Archive Save: Added to pending", entries);
          toast.success(t("ai_saved_archive_pending"));
        }
      } else {
        toast.info("모두 이미 아카이브에 저장되어 있습니다");
      }
    } catch (error: unknown) {
      console.error("Archive Save: Error occurred", error);
      // const message = error instanceof Error ? error.message : "error"; 
      // User-facing generic error to avoid leaking English technical details
      toast.error(t("archive.save_error"));
    } finally {
      setSavingArchive(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{initial ? t("edit_title") : t("title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              {errors.length > 0 && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
                  <ul className="space-y-1">
                    {errors.map((error) => (
                      <li key={error}>
                        {t(validationKeyMap[error] ?? "validation_invalid_date")}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            <div className="flex flex-col space-y-2">
              <label htmlFor="date" className="text-sm font-medium text-muted-foreground">
                {t("date_label")}
              </label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full sm:w-auto"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="content" className="text-sm font-medium text-muted-foreground">
                {t("content_label")}
              </label>
              <textarea
                id="content"
                className="min-h-[300px] w-full rounded-lg border border-white/10 bg-white/5 p-4 text-base text-foreground placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary backdrop-blur-sm resize-none"
                placeholder={t("placeholder")}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                {t("upload_hint")}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {imagePreview ? (
                <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/5 p-2">
                  <NextImage
                    src={imagePreview}
                    alt="Diary attachment"
                    width={1200}
                    height={800}
                    className="h-48 w-full rounded-md object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 640px"
                    unoptimized
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setRemoveImage(true);
                        setImagePreview(undefined);
                        setImageFile(null);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("remove_image")}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setRemoveImage(false);
                        openFilePicker();
                      }}
                    >
                      {t("replace_image")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={openFilePicker}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    {t("upload_image")}
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {t("upload_hint")}
                  </span>
                </div>
              )}
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("uploading")} {uploadProgress}%
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/diary")}
              >
                {t("back")}
              </Button>
              <Button
                type="button"
                variant="glass"
                onClick={handleAiCheck}
                disabled={aiLoading}
                className="border-primary/60 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary-foreground"
              >
                {aiLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {aiLoading ? t("ai_checking") : t("ai_check")}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {onDelete && !isTrialMode && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {tDiary("delete")}
                </Button>
              )}
              {!isTrialMode && (
                <Button
                  type="submit"
                  disabled={isSubmitting || deleting}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 border-0"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {initial ? t("update") : t("save")}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
        {aiResult && (
          <AiFeedback
            result={aiResult}
            onApply={applyAiResult}
            applying={isSubmitting}
            isTrialMode={isTrialMode}
          />
        )}
        
        {isTrialMode && aiResult && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 py-8">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">{tTrial("signup_prompt")}</h3>
              </div>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-login-modal"));
                }}
              >
                 {tTrial("signup_button")}
              </Button>
            </CardContent>
          </Card>
        )}
      </form>

      <Modal 
        isOpen={showSaveDialog} 
        onClose={() => setShowSaveDialog(false)} 
        title={t("save_prompt_title")}
      >
        <div className="space-y-4">
          <p className="text-foreground/80">
            {t("save_prompt_desc")}
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowSaveDialog(false);
                performSave();
              }}
            >
              {t("save_prompt_just_save")}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setShowSaveDialog(false);
                handleAiCheck();
              }}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {t("save_prompt_ai")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
