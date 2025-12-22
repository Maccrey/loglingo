import { LevelBand } from "@/domain/learning-profile";
import { addLevelRecord } from "@/infrastructure/firebase/learning-profile-repository";
import { trackEvent } from "@/lib/analytics";

function mapScoreToLevel(score: number): LevelBand {
  if (score >= 85) return "C1";
  if (score >= 70) return "B2";
  if (score >= 55) return "B1";
  if (score >= 40) return "A2";
  return "A1";
}

export async function adjustLevelFromQuiz(params: {
  userId: string;
  correct: boolean;
  currentScore?: number;
  targetLanguage?: string;
  sourceId?: string;
}) {
  const { userId, correct, currentScore = 50, targetLanguage, sourceId } = params;
  if (!userId) return;

  const delta = correct ? 5 : -3;
  const nextScore = Math.max(0, Math.min(100, currentScore + delta));
  const level = mapScoreToLevel(nextScore);

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
