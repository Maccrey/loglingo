import {
  buildQuizFromArchive,
  LearningArchive,
  LearningArchiveDraft,
  QuizQuestion,
} from "@/domain/archive";
import { createArchive, listArchive } from "@/infrastructure/firebase/archive-repository";

export async function saveArchiveEntry(input: LearningArchiveDraft) {
  if (!input.title.trim()) {
    throw new Error("title-required");
  }
  return createArchive({
    ...input,
    examples: input.examples?.filter(Boolean) ?? [],
    rootMeaning: input.rootMeaning ?? "",
  });
}

export async function getArchives(userId: string, type?: string): Promise<LearningArchive[]> {
  return listArchive(userId, type);
}

export function generateQuiz(entry: LearningArchive): QuizQuestion {
  return buildQuizFromArchive(entry);
}
