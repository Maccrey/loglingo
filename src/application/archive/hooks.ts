"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getArchives, saveArchiveEntry } from "./archive-service";
import { LearningArchive } from "@/domain/archive";
import { Quiz } from "@/domain/quiz";
import { getOrGenerateQuiz } from "@/application/quiz/quiz-service";
import { useState, useEffect } from "react";

export function useArchiveList(userId: string, type?: string, opts?: { enabled?: boolean; sourceId?: string }) {
  return useQuery<LearningArchive[]>({
    queryKey: ["archives", userId, type ?? "all", opts?.sourceId ?? "all"],
    queryFn: () => getArchives(userId, type, opts?.sourceId),
    enabled: (opts?.enabled ?? true) && Boolean(userId) && userId !== "demo-user",
    staleTime: 60_000,
    refetchOnMount: true,
  });
}

export function useArchiveMutations(userId: string) {
  const client = useQueryClient();
  const create = useMutation({
    mutationFn: saveArchiveEntry,
    onSuccess: () => client.invalidateQueries({ queryKey: ["archives", userId] }),
  });
  return { create };
}

export function useQuiz(
  entry?: LearningArchive,
  translatedQuestion?: string,
  uiLocale?: string,
  learningLanguage?: string
) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!entry || !translatedQuestion) {
      setQuiz(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadQuiz() {
      if (!entry || !translatedQuestion) return;

      setIsLoading(true);
      setError(null);

      try {
        const result = await getOrGenerateQuiz(
          entry.id,
          entry.title,
          entry.rootMeaning || entry.title,
          entry.examples || [],
          translatedQuestion,
          uiLocale || "en",
          learningLanguage || "en"
        );

        if (!cancelled) {
          setQuiz(result);
          if (!result) {
            setError("Quiz generation failed");
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Quiz loading error:", err);
          setError("Failed to load quiz");
          setQuiz(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadQuiz();

    return () => {
      cancelled = true;
    };
  }, [entry, translatedQuestion, uiLocale, learningLanguage]);

  return { quiz, isLoading, error };
}
