import { CorrectionResult } from "@/domain/ai-correction";
import { LevelRecord } from "@/domain/learning-profile";
import {
  addAdviceItem,
  addLevelRecord,
} from "@/infrastructure/firebase/learning-profile-repository";
import { generateLevelInsights, buildAdviceMessages } from "../ai/level-service";
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
        result.advice?.map((item) => {
          const itemCount = (item as any)?.count ?? 1;
          return {
            topic: item.topic,
            priority: (item.priority as any) ?? "medium",
            message: normalizeAdviceMessage(item.message, item.topic, itemCount, opts.uiLocale),
            actions: [],
            relatedLevel: item.relatedLevel,
            sourceId: opts.sourceId,
            completed: false,
          };
        }) ?? [],
    };
  }

  return generateLevelInsights({
    result,
    uiLocale: opts.uiLocale,
    targetLanguage: opts.targetLanguage,
    sourceId: opts.sourceId,
  });
}

function normalizeAdviceMessage(
  message: Record<string, string> | undefined,
  topic: string,
  count: number | undefined,
  uiLocale: string
) {
  const fallback = buildAdviceMessages(topic, uiLocale, count ?? 1);
  if (!message) return fallback;

  const merged = { ...fallback, ...message };
  if (!merged[uiLocale]) merged[uiLocale] = fallback[uiLocale];
  if (!merged.en) merged.en = fallback.en;
  return merged;
}

export async function persistInsightsFromCorrection(result: CorrectionResult, opts: PersistOptions) {
  if (!opts.userId) return null;

  const { level, advice } = normalizeLevel(result, opts);
  let savedLevel: LevelRecord | null = null;

  try {
    savedLevel = await addLevelRecord(opts.userId, {
      ...level,
      ...(level.sourceId ? { sourceId: level.sourceId } : {}),
    });
    trackEvent("level_recorded", { level: level.level, source: "ai_correction" });
  } catch (error) {
    console.error("Failed to save level record", error);
  }

  if (advice?.length) {
    await Promise.all(
      advice.map((item) =>
        addAdviceItem(opts.userId, {
          ...item,
          ...(item.sourceId ? { sourceId: item.sourceId } : {}),
        }).catch((error) => {
          console.error("Failed to save advice item", error);
        })
      )
    );
  }

  return { level: savedLevel };
}
