export type ArchiveType = "grammar" | "word";

export interface LearningArchive {
  id: string;
  userId: string;
  type: ArchiveType;
  title: string;
  examples: string[];
  rootMeaning: string;
  createdAt: Date;
}

export interface LearningArchiveDraft {
  userId: string;
  type: ArchiveType;
  title: string;
  examples?: string[];
  rootMeaning?: string;
}

export interface QuizQuestion {
  id: string;
  archiveId: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export function buildQuizFromArchive(entry: LearningArchive): QuizQuestion {
  const correct = entry.rootMeaning || entry.title;
  const distractors = entry.examples.slice(0, 3).map((ex, idx) => `${ex} (ex ${idx + 1})`);
  const options = [correct, ...distractors].slice(0, 4);
  return {
    id: `${entry.id}-quiz`,
    archiveId: entry.id,
    question: `What is the key meaning/pattern for "${entry.title}"?`,
    options,
    answer: 0,
    explanation: entry.rootMeaning || entry.title,
  };
}
