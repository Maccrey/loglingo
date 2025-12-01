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
import { Diary } from "@/domain/diary";
import {
  DiaryPayload,
  DiaryValidationError,
} from "@/application/diary/diary-service";
import { getImagePreview } from "@/lib/image";
import { toast } from "sonner";
import { Image as ImageIcon, Loader2, Sparkles, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import NextImage from "next/image";

type DiaryFormProps = {
  initial?: Diary | null;
  onSubmit: (payload: DiaryPayload & { onUploadProgress?: (n: number) => void }) => Promise<void>;
  onDelete?: () => Promise<void>;
  isSubmitting?: boolean;
};

function today() {
  return new Date().toISOString().split("T")[0];
}

export function DiaryForm({ initial, onSubmit, onDelete, isSubmitting }: DiaryFormProps) {
  const t = useTranslations("write");
  const tDiary = useTranslations("diary");
  const router = useRouter();
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors([]);

    try {
      await onSubmit({
        date,
        content,
        imageFile,
        removeImage,
        onUploadProgress: (progress) => setUploadProgress(progress),
      });
      toast.success(t("saved"));
      setUploadProgress(0);
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

  return (
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
                    variant="outline"
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
              variant="outline"
              disabled
              title="AI correction coming soon"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {t("ai_check")}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {onDelete && (
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
            <Button
              type="submit"
              disabled={isSubmitting || deleting}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 border-0"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initial ? t("update") : t("save")}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
