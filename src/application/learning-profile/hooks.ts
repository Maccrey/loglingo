import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addLevelRecord,
  listLevelRecords,
  listAdviceItems,
  markAdviceCompleted,
} from "@/infrastructure/firebase/learning-profile-repository";
import { LevelRecord, AdviceItem } from "@/domain/learning-profile";

export function useLevelRecords(userId: string, opts?: { limit?: number; enabled?: boolean }) {
  return useQuery<LevelRecord[]>({
    queryKey: ["levels", userId],
    queryFn: () => listLevelRecords(userId, opts?.limit ?? 10),
    enabled: Boolean(userId) && (opts?.enabled ?? true) && userId !== "demo-user",
    staleTime: 60_000,
  });
}

export function useAdviceList(userId: string, opts?: { limit?: number; enabled?: boolean; topic?: string }) {
  return useQuery<AdviceItem[]>({
    queryKey: ["advice", userId, opts?.topic ?? "all"],
    queryFn: () => listAdviceItems(userId, opts?.limit ?? 20, opts?.topic),
    enabled: Boolean(userId) && (opts?.enabled ?? true) && userId !== "demo-user",
    staleTime: 60_000,
  });
}

export function useAdviceComplete(userId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ adviceId, completed }: { adviceId: string; completed: boolean }) =>
      markAdviceCompleted(userId, adviceId, completed),
    // Optimistically mark advice as completed so UI/progress update immediately.
    onMutate: async ({ adviceId, completed }) => {
      const queryKey = ["advice", userId, "all"];
      await client.cancelQueries({ queryKey });
      const previous = client.getQueryData<AdviceItem[]>(queryKey);
      if (previous) {
        client.setQueryData<AdviceItem[]>(
          queryKey,
          previous.map((item) =>
            item.id === adviceId ? { ...item, completed } : item
          )
        );
      }
      return { previous, queryKey };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous && context.queryKey) {
        client.setQueryData(context.queryKey, context.previous);
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["advice", userId] });
    },
  });
}

export function useAddLevelRecord(userId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<LevelRecord, "id" | "createdAt">) =>
      addLevelRecord(userId, payload),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["levels", userId] });
    },
  });
}
