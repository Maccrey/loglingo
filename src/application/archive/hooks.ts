"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getArchives, saveArchiveEntry, generateQuiz } from "./archive-service";
import { LearningArchive } from "@/domain/archive";

export function useArchiveList(userId: string, type?: string) {
  return useQuery<LearningArchive[]>({
    queryKey: ["archives", userId, type ?? "all"],
    queryFn: () => getArchives(userId, type),
    enabled: Boolean(userId),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });
}

export function useArchiveMutations(userId: string) {
  const queryClient = useQueryClient();
  const create = useMutation({
    mutationFn: (input: Parameters<typeof saveArchiveEntry>[0]) =>
      saveArchiveEntry(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archives", userId] });
    },
  });
  return { create };
}

export function useQuiz(entry?: LearningArchive) {
  if (!entry) return null;
  return generateQuiz(entry);
}
