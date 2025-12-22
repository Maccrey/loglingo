import { CorrectionResult } from "@/domain/ai-correction";
import { LevelRecord } from "@/domain/learning-profile";
import {
  addAdviceItem,
  addLevelRecord,
} from "@/infrastructure/firebase/learning-profile-repository";
import { generateLevelInsights } from "../ai/level-service";
import { trackEvent } from "@/lib/analytics";

type PersistOptions = {
  userId: string;
  uiLocale: string;
  targetLanguage?: string;
  sourceId?: string;
};

function normalizeLevel(result: CorrectionResult, opts: PersistOptions) {
  if (result.levelAssessment || result.advice) {
    return {
      level: {
        level: result.levelAssessment?.level ?? "unknown",
        score: result.levelAssessment?.score,
        confidence: result.levelAssessment?.confidence,
        rationale: result.levelAssessment?.rationale,
        language: opts.targetLanguage,
        sourceType: "ai_correction" as const,
        sourceId: opts.sourceId,
      },
      advice:
        result.advice?.map((item) => ({
          topic: item.topic,
          priority: (item.priority as any) ?? "medium",
          message: item.message ?? { [opts.uiLocale]: item.topic },
          actions: [],
          relatedLevel: item.relatedLevel,
          sourceId: opts.sourceId,
          completed: false,
        })) ?? [],
    };
  }

  return generateLevelInsights({
    result,
    uiLocale: opts.uiLocale,
    targetLanguage: opts.targetLanguage,
    sourceId: opts.sourceId,
  });
}

export async function persistInsightsFromCorrection(result: CorrectionResult, opts: PersistOptions) {
  if (!opts.userId) return null;

  const { level, advice } = normalizeLevel(result, opts);
  let savedLevel: LevelRecord | null = null;

  try {
    savedLevel = await addLevelRecord(opts.userId, level);
    trackEvent("level_recorded", { level: level.level, source: "ai_correction" });
  } catch (error) {
    console.error("Failed to save level record", error);
  }

  if (advice?.length) {
    await Promise.all(
      advice.map((item) =>
        addAdviceItem(opts.userId, item).catch((error) => {
          console.error("Failed to save advice item", error);
        })
      )
    );
  }

  return { level: savedLevel };
}
