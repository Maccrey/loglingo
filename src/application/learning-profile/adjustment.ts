import { LevelBand } from "@/domain/learning-profile";
import { addLevelRecord } from "@/infrastructure/firebase/learning-profile-repository";
import { trackEvent } from "@/lib/analytics";

const LEVEL_ORDER: LevelBand[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

function mapScoreToLevel(score: number, fallback: LevelBand = "A2"): LevelBand {
  if (score >= 90) return "C2";
  if (score >= 80) return "C1";
  if (score >= 70) return "B2";
  if (score >= 55) return "B1";
  if (score >= 40) return "A2";
  return fallback;
}

function normalizeDelta(correct: boolean, quizLevel?: LevelBand) {
  const base = correct ? 5 : -4;
  if (!quizLevel) return base;
  const idx = LEVEL_ORDER.indexOf(quizLevel);
  if (idx >= 4) return base * 1.2; // harder quiz, bigger impact
  if (idx <= 1) return base * 0.6; // easy quiz, smaller impact
  return base;
}

export async function adjustLevelFromQuiz(params: {
  userId: string;
  correct: boolean;
  currentScore?: number;
  targetLanguage?: string;
  sourceId?: string;
  quizLevel?: LevelBand;
}) {
  const { userId, correct, currentScore = 50, targetLanguage, sourceId, quizLevel } = params;
  if (!userId) return;

  const delta = normalizeDelta(correct, quizLevel);
  const nextScore = Math.max(0, Math.min(100, currentScore + delta));
  const level = mapScoreToLevel(nextScore, quizLevel ?? "A2");

  try {
    await addLevelRecord(userId, {
      level,
      score: nextScore,
      confidence: 0.5,
      language: targetLanguage,
      sourceType: "quiz",
      sourceId,
      rationale: `quiz result ${correct ? "correct" : "wrong"}, delta ${delta}`,
    });
    trackEvent("level_recorded", { source: "quiz", level, delta });
  } catch (error) {
    console.error("adjustLevelFromQuiz failed", error);
  }
}
