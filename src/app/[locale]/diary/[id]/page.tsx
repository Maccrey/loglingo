"use client";

import { DiaryForm } from "@/components/diary/DiaryForm";
import { useDiaryDetail, useDiaryMutations } from "@/application/diary/hooks";
import { getCurrentUserId } from "@/lib/current-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useTranslations } from "next-intl";
import { AuthGate } from "@/components/auth/AuthGate";

export default function DiaryDetailPage({ params }: { params: { id: string } }) {
  const userId = getCurrentUserId();
  const t = useTranslations("diary");
  const { data, isLoading } = useDiaryDetail(userId, params.id);
  const { update, remove } = useDiaryMutations(userId);

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
            await update.mutateAsync({ id: params.id, payload });
          }}
          onDelete={async () => {
            await remove.mutateAsync(params.id);
          }}
          isSubmitting={update.isPending || remove.isPending}
        />
      </div>
    </AuthGate>
  );
}
