"use client";

import { use } from "react";
import { DiaryForm } from "@/components/diary/DiaryForm";
import { useDiaryDetail, useDiaryMutations } from "@/application/diary/hooks";
import { useArchiveList } from "@/application/archive/hooks";
import { getCurrentUserId } from "@/lib/current-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useTranslations } from "next-intl";
import { AuthGate } from "@/components/auth/AuthGate";
import { useRouter } from "@/i18n/routing";
import { Archive, Sparkles } from "lucide-react";

export default function DiaryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const userId = getCurrentUserId();
  const t = useTranslations("diary");
  const tArchive = useTranslations("archive");
  const router = useRouter();
  const { data, isLoading } = useDiaryDetail(userId, id);
  const { update, remove } = useDiaryMutations(userId);
  const { data: archives = [], isLoading: archivesLoading } = useArchiveList(userId);

  if (isLoading) {
    return (
      <AuthGate>
        <Card className="max-w-3xl">
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
        <Card className="max-w-3xl">
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
        <DiaryForm
          initial={data}
          onSubmit={async (payload) => {
            await update.mutateAsync({ id, payload });
          }}
          onDelete={async () => {
            await remove.mutateAsync(id);
            router.push("/diary");
          }}
          isSubmitting={update.isPending || remove.isPending}
          onSuccess={() => router.push("/diary")}
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
                {archives.slice(0, 5).map((archive) => (
                  <div
                    key={archive.id}
                    className="rounded-lg border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => router.push("/archive")}
                  >
                    <div className="flex items-start justify-between gap-2">
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
                        {archive.type === "grammar" ? "문법" : "단어"}
                      </span>
                    </div>
                  </div>
                ))}
                {archives.length > 5 && (
                  <button
                    onClick={() => router.push("/archive")}
                    className="w-full text-sm text-primary hover:underline mt-2"
                  >
                    전체 보기 ({archives.length}개)
                  </button>
                )}
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
