"use client";

import { useEffect, useState, useRef } from "react";
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
import { TRIAL_SAMPLES } from "@/constants/trial-samples";

type DiaryFormProps = {
  initial?: Diary | null;
  onSubmit: (payload: DiaryPayload & { onUploadProgress?: (n: number) => void }) => Promise<Diary | void>;
  onDelete?: () => Promise<void>;
  isSubmitting?: boolean;
  onSuccess?: () => void;
  isTrialMode?: boolean;
  sampleText?: string;
};

function today() {
  return new Date().toISOString().split("T")[0];
}

import { useAuth } from "@/application/auth/AuthProvider";

//...

export function DiaryForm({ initial, onSubmit, onDelete, isSubmitting, onSuccess, isTrialMode = false, sampleText }: DiaryFormProps) {
  const t = useTranslations("write");
  const tTrial = useTranslations("trial");
  const tDiary = useTranslations("diary");
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.uid || "";
  const { learningLanguage } = useLearningLanguage();
  // Safe to call hook as long as we don't invoke the mutation in trial mode
  const { create: createArchive } = useArchiveMutations(userId);
  const validationKeyMap: Record<string, string> = {
    "invalid-date": "validation_invalid_date",
    "empty-content": "validation_empty_content",
    "too-long": "validation_too_long",
  };

  const [date, setDate] = useState(initial?.date ?? today());
  // In Trial Mode, start with sampleText if provided
  const [content, setContent] = useState(initial?.content ?? (isTrialMode && sampleText ? sampleText : ""));
  // Track if we are currently showing the sample text
  const [isSampleMode, setIsSampleMode] = useState(isTrialMode && !initial?.content && !!sampleText);
  
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

  // When sampleText changes (e.g. language switch), update content if:
  // 1. We are already in sample mode (user hasn't typed anything custom)
  // 2. OR the current content is empty/whitespace
  // 3. OR the current content is a known sample (user hasn't customized it)
  useEffect(() => {
    if (isTrialMode && sampleText) {
      const isKnownSample = Object.values(TRIAL_SAMPLES).includes(content);
      
      // If we are in sample mode, unconditionally update to the new language sample
      // This ensures that even if isKnownSample fails (due to whitespace/encoding),
      // the user still sees the correct language as long as they haven't "broken out" of sample mode.
      if (isSampleMode || !content.trim() || isKnownSample) {
         setContent(sampleText);
         setIsSampleMode(true);
      }
    }
  }, [sampleText, isTrialMode, isSampleMode]); // Added isSampleMode to deps to be safe, though usually stable



  // Capture original content before AI correction
  const originalContentRef = useRef<string>("");

  useEffect(() => {
    if (initial) {
      setDate(initial.date);
      setContent(initial.content);
      setImagePreview(initial.imageUrl);
      setRemoveImage(false);
      setImageFile(null);
      setIsSampleMode(false);
      // If editing existing diary, initial content is "current" content.
      // If it has originalContent stored, good, but we don't necessarily overwrite it unless new edit happens.
      // But for the purpose of "AI Check -> Save", we treat current input as original right before check.
    }
  }, [initial]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Renamed to triggerFilePicker to avoid potential naming conflicts or cache issues
  const triggerFilePicker = () => {
    console.log("Triggering file picker");
    fileInputRef.current?.click();
  };

  // Alias for backward compatibility during HMR/Caching issues
  const openFilePicker = triggerFilePicker;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image must be smaller than 10MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setRemoveImage(false);
    }
  };


  const generateArchiveEntries = async (result: CorrectionResult, sourceId?: string): Promise<LearningArchiveDraft[]> => {
    if (!result || !userId) return [];
    
    // In trial mode, we do NOT save to archive automatically
    if (isTrialMode) return [];

    const entries: LearningArchiveDraft[] = [];

    // 교정된 전체 문장을 아카이브에 저장
    if (result.corrected.trim() && result.rootMeaningGuide) {
      const title = result.corrected.slice(0, 80);
      
      let isDuplicate = false;
      if (sourceId) {
        const { checkDuplicate } = await import("@/infrastructure/firebase/archive-repository");
        isDuplicate = await checkDuplicate(userId, title, sourceId);
      }
      
      if (!isDuplicate) {
        entries.push({
          userId,
          type: "grammar" as const,
          title,
          rootMeaning: result.rootMeaningGuide,
          examples: [result.corrected],
          levelTag: result.levelAssessment?.level,
          sourceId: sourceId,
        });
      }
    }

    // 각 이슈별로 저장 (중복 체크 포함)
    for (const issue of result.issues || []) {
      const title = issue.suggestion.slice(0, 80);
      
      let isDuplicate = false;
      if (sourceId) {
        const { checkDuplicate } = await import("@/infrastructure/firebase/archive-repository");
        isDuplicate = await checkDuplicate(userId, title, sourceId);
      }
      
      if (!isDuplicate) {
        entries.push({
          userId,
          type: issue.type === "word" ? "word" : "grammar",
          title,
          rootMeaning: issue.explanation || result.rootMeaningGuide || "AI suggestion",
          examples: issue.exampleSentences && issue.exampleSentences.length > 0 
            ? issue.exampleSentences 
            : [issue.original, issue.suggestion].filter(Boolean),
          levelTag: result.levelAssessment?.level,
          sourceId: sourceId,
          sourceText: issue.original,
        });
      }
    }
    
    return entries;
  };

  const performSave = async (overrideContent?: string, savedOriginalContent?: string, immediateArchives?: LearningArchiveDraft[]) => {
    setErrors([]);
    
    const contentToSave = overrideContent !== undefined ? overrideContent : content;
    const originalToSave = savedOriginalContent !== undefined ? savedOriginalContent : originalContentRef.current;

    try {
      const newDiary = await onSubmit({
        date,
        content: contentToSave,
        originalContent: originalToSave,
        imageFile,
        removeImage,
        onUploadProgress: (progress) => setUploadProgress(progress),
      });

      // 일기 저장이 성공하고, 저장할 아카이브 항목이 있으면 저장
      // passed `immediateArchives` takes precedence over state `pendingArchives`
      const archivesToSave = immediateArchives || pendingArchives;
      
      if (newDiary && archivesToSave.length > 0) {
        try {
          await Promise.all(
            archivesToSave.map(entry => 
              createArchive.mutateAsync({
                ...entry,
                sourceId: newDiary.id // Ensure we link to the newly created diary
              })
            )
          );
          if (!isTrialMode) {
             toast.success(t("ai_saved_archive"));
          }
        } catch (err) {
          console.error("Failed to save pending archives", err);
          toast.error(t("archive.save_error"));
        }
      }

      toast.success(t("saved"));
      setUploadProgress(0);
      
      trackEvent("complete_process", {
        component_name: "일기 쓰기",
        action_detail: "일기 저장",
        value_korean: "일기 저장 성공"
      });

      if (onSuccess) {
        onSuccess();
      }

      if (!initial) {
        setContent("");
        setImageFile(null);
        setImagePreview(undefined);
        setPendingArchives([]); // Clear pending state
      }
    } catch (error: unknown) {
       if (error instanceof DiaryValidationError) {
        setErrors(error.reasons);
        return;
      }
      const message = error instanceof Error ? error.message : "unknown";
      trackEvent("fail_process", {
        component_name: "일기 쓰기",
        action_detail: "일기 저장 실패",
        error_message: message,
        value_korean: `일기 저장 실패: ${message}`
      });
      toast.error(t("upload_failed"));
    }
  };

  // Deprecated direct submit. We now enforce AI check flow for creation.
  // Exception: In Edit mode, we might want to allow update without re-AI-checking if content hasn't changed?
  // User request: "일기 저장 버튼을 없애주고 AI교정버튼을 클릭하면... 교정 적용 및 저장 버튼을 누르면... 저장"
  // So we strictly follow: User types -> AI Check -> Apply & Save.
  
  // However, for UX safety, if user is in "Edit Mode", maybe they just want to fix a date or image?
  // But strict interpretation: "Remove Save button". 
  // We will keep "Delete" for edit mode.
  
  const handleAiCheck = async () => {
    if (!content.trim()) {
      toast.error(t("validation_empty_content"));
      return;
    }
    
    // Capture original content NOW
    originalContentRef.current = content;

    setAiLoading(true);
    setAiResult(null);
    trackEvent("start_process", {
      component_name: "일기 쓰기",
      action_detail: "AI 첨삭 요청",
      value_korean: "AI 첨삭 실행"
    });
    try {
      const result = await requestAiCorrection({
        content,
        mode: "full",
        locale,
        targetLanguage: learningLanguage || locale,
        learningLanguage,
      });
      setAiResult(result);
      trackEvent("complete_process", {
        component_name: "일기 쓰기",
        action_detail: "AI 첨삭 성공",
        value_korean: "AI 첨삭 완료"
      });

      // Insight persistence logic ...
       if (!isTrialMode) {
        persistInsightsFromCorrection(result, {
          userId,
          uiLocale: locale,
          targetLanguage: learningLanguage || locale,
          sourceId: initial?.id,
        }).catch((err) => {
          console.error("Persist insights failed", err);
        });
      } else {
         // Trial logic ...
         if (typeof window !== "undefined") {
           localStorage.setItem("loglingo_trial_completed", "true");
         }
         import("@/lib/analytics").then(({ trackEvent }) => {
           trackEvent("complete_process", {
             component_name: "체험 모드",
             action_detail: "체험 완료",
             value_korean: "체험 모드 AI 첨삭 완료"
           });
         });
      }

    } catch (error: unknown) {
      // ... (error handling)
      const message = error instanceof Error ? error.message : "unknown";
      trackEvent("fail_process", {
        component_name: "일기 쓰기",
        action_detail: "AI 첨삭 실패",
        error_message: message,
        value_korean: `AI 첨삭 실패: ${message}`
      });
      
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

  const isEditMode = !!initial;

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

  const applyAiResultAndSave = async (text: string) => {
    // 1. Set content to corrected
    setContent(text);
    
    // 2. Prepare archives (memory only first)
    // If editing existing diary, we have ID. If new, ID is undefined (will be linked in performSave).
    // Note: checkDuplicate logic relies on ID for stricter checks, but for new diary it just skips ID check (which is fine).
    let entries: LearningArchiveDraft[] = [];
    if (aiResult) {
        entries = await generateArchiveEntries(aiResult, initial?.id);
    }
    
    // 3. Perform Save immediately with generated entries
    await performSave(text, originalContentRef.current, entries);
  };

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <Card>
          {/* ... Header and Content Inputs ... */}
          <CardHeader>
            <CardTitle>{initial ? t("edit_title") : t("title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              {/* Errors, Date, Content, Image Inputs - Keeping mostly same structure */}
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
              <div className="relative">
                <textarea
                  id="content"
                  className={`min-h-[300px] w-full rounded-lg border bg-white/5 p-4 text-base text-foreground placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary backdrop-blur-sm resize-none transition-colors
                    ${isSampleMode ? 'border-primary/50 text-white/90 italic' : 'border-white/10'}`}
                  placeholder={t("placeholder")}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (isSampleMode) setIsSampleMode(false);
                  }}
                  onFocus={() => {
                    if (isSampleMode) {
                      setContent("");
                      setIsSampleMode(false);
                    }
                  }}
                  required
                />
                {isSampleMode && (
                  <div className="absolute top-2 right-2 rounded-full bg-primary/20 px-3 py-1 text-xs text-primary animate-pulse pointer-events-none">
                    {tTrial("sample_guide" as any)}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {isSampleMode ? tTrial("sample_hint" as any) : t("upload_hint")}
              </p>
            </div>

             <div className="flex flex-col gap-3">
               {/* Image Upload UI - Keep as is */}
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
                        triggerFilePicker();
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
                    onClick={triggerFilePicker}
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
             {/* Upload Progress UI */}
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
          <CardFooter className="flex justify-between gap-2 pt-6 border-t border-border/50">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4"
            >
              {t("back")}
            </Button>

            <div className="flex gap-2">
               {isEditMode && initial && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4"
                >
                  {deleting ? t("loading") : t("delete")}
                </Button>
              )}
              {/* REMOVED: Standalone Save Button */}
              {/* Only AI Check Button remains */}
              <Button
                type="button"
                variant="secondary"
                onClick={handleAiCheck}
                disabled={aiLoading || isSubmitting}
                className="whitespace-nowrap text-xs sm:text-sm bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 border-indigo-500/20 px-2 sm:px-4"
              >
                <Sparkles className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                {aiLoading ? t("ai_checking") : t("ai_check")}
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        {aiResult && (
          <AiFeedback
            result={aiResult}
            onApply={applyAiResultAndSave} // Use new handler
            applying={isSubmitting}
            isTrialMode={isTrialMode}
            applyLabel={t("apply_and_save")} // New prop
          />
        )}
        
        {isTrialMode && aiResult && (
           <Card className="border-primary/20 bg-primary/5">
             {/* ... Trial Signup Prompt ... */}
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
        <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </form>

      {/* Save Confim Modal - No longer needed as manual save is removed? Or keep for edge case? */}
      {/* If manual save is removed, this modal is unreachable via submit. Keeping code minimal. */}
    </>
  );
}
