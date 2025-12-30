"use client";

import { DiaryForm } from "@/components/diary/DiaryForm";
import { useDiaryMutations } from "@/application/diary/hooks";
import { getCurrentUserId } from "@/lib/current-user";
import { useRouter } from "@/i18n/routing";
import { AuthGate } from "@/components/auth/AuthGate";

import { useAuth } from "@/application/auth/AuthProvider";

export default function NewDiaryPage() {
  const { user } = useAuth();
  const userId = user?.uid || "";
  const router = useRouter();
  const { create } = useDiaryMutations(userId);

  return (
    <AuthGate>
      <div className="mx-auto max-w-3xl space-y-6">
        <DiaryForm
          onSubmit={async (payload) => {
            const newDiary = await create.mutateAsync(payload);
            return newDiary;
          }}
          isSubmitting={create.isPending}
          onSuccess={() => router.push("/diary")}
        />
      </div>
    </AuthGate>
  );
}
