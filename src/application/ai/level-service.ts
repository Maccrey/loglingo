import { CorrectionResult } from "@/domain/ai-correction";
import { AdviceItem, AdvicePriority, LevelBand, LevelRecord } from "@/domain/learning-profile";

function pickLevel(errorRate: number, issueTypes: Set<string>): LevelBand {
  if (errorRate <= 0.03) return "C1";
  if (errorRate <= 0.06) return "B2";
  if (errorRate <= 0.12) return "B1";
  if (errorRate <= 0.2) return "A2";
  return "A1";
}

function scoreFromErrorRate(errorRate: number) {
  const clamped = Math.max(0, Math.min(1, 1 - errorRate));
  return Math.round(clamped * 100);
}

function confidenceFromData(issueCount: number, wordCount: number) {
  if (issueCount === 0) return 0.9;
  const density = issueCount / Math.max(1, wordCount);
  return Math.max(0.3, 1 - density * 2);
}

function summarizeIssues(issues: CorrectionResult["issues"]) {
  const counts: Record<string, number> = {};
  issues.forEach((issue) => {
    counts[issue.type] = (counts[issue.type] ?? 0) + 1;
  });
  return counts;
}

function buildAdviceMessages(topic: string, uiLocale: string, detail: string) {
  // Minimal localized payload; UI 측에서 i18n 키와 함께 보강 예정
  const message = `${topic}: ${detail}`;
  return { [uiLocale]: message, en: message };
}

export function generateLevelInsights(params: {
  result: CorrectionResult;
  uiLocale: string;
  targetLanguage?: string;
  sourceId?: string;
}): { level: Omit<LevelRecord, "id" | "createdAt">; advice: Omit<AdviceItem, "id" | "createdAt" | "updatedAt">[] } {
  const { result, uiLocale, targetLanguage, sourceId } = params;
  const wordCount = result.corrected.split(/\s+/).filter(Boolean).length || 1;
  const issueCount = result.issues?.length ?? 0;
  const errorRate = Math.min(1, issueCount / wordCount);
  const issueTypes = new Set((result.issues || []).map((i) => i.type));

  const level = pickLevel(errorRate, issueTypes);
  const score = scoreFromErrorRate(errorRate);
  const confidence = confidenceFromData(issueCount, wordCount);
  const rationale = `issues: ${issueCount}, words: ${wordCount}, errorRate: ${(errorRate * 100).toFixed(1)}%`;

  const levelRecord: Omit<LevelRecord, "id" | "createdAt"> = {
    level,
    score,
    confidence,
    sourceType: "ai_correction",
    sourceId,
    language: targetLanguage,
    rationale,
  };

  const issueSummary = summarizeIssues(result.issues || []);
  const advice: Omit<AdviceItem, "id" | "createdAt" | "updatedAt">[] = Object.entries(issueSummary).map(
    ([topic, count]) => {
      const priority: AdvicePriority = count >= 3 ? "high" : count === 2 ? "medium" : "low";
      const detail = `Focus on ${topic} issues detected ${count} time(s).`;
      return {
        topic,
        priority,
        message: buildAdviceMessages(topic, uiLocale, detail),
        count,
        actions: [],
        relatedLevel: level,
        sourceId,
        completed: false,
      };
    }
  );

  return { level: levelRecord, advice };
}
