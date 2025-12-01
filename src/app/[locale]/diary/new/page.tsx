"use client";

import { DiaryForm } from "@/components/diary/DiaryForm";
import { useDiaryMutations } from "@/application/diary/hooks";
import { getCurrentUserId } from "@/lib/current-user";
import { useRouter } from "@/i18n/routing";

export default function NewDiaryPage() {
  const userId = getCurrentUserId();
  const router = useRouter();
  const { create } = useDiaryMutations(userId);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <DiaryForm
        onSubmit={(payload) => create.mutateAsync(payload).then(() => router.push("/diary"))}
        isSubmitting={create.isPending}
      />
    </div>
  );
}
