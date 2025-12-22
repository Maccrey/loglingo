import { describe, expect, it } from "vitest";
import { generateLevelInsights } from "./level-service";
import { CorrectionResult } from "@/domain/ai-correction";

const baseResult: CorrectionResult = {
  corrected: "I have an apple and I like it.",
  issues: [
    {
      type: "grammar",
      original: "I has an apple",
      suggestion: "I have an apple",
      explanation: "subject-verb agreement",
      exampleSentences: ["I have an apple."],
      exampleTranslations: ["나는 사과를 가지고 있다."],
    },
  ],
};

describe("generateLevelInsights", () => {
  it("assigns lower level when error rate is high", () => {
    const result: CorrectionResult = {
      ...baseResult,
      corrected: "word",
      issues: [
        ...baseResult.issues,
        {
          type: "word",
          original: "like",
          suggestion: "enjoy",
          explanation: "word choice",
        },
      ],
    };

    const { level } = generateLevelInsights({
      result,
      uiLocale: "ko",
      targetLanguage: "en",
    });

    expect(level.level).toBe("A1");
    expect(level.language).toBe("en");
  });

  it("returns advice entries based on issue types", () => {
    const { advice } = generateLevelInsights({
      result: baseResult,
      uiLocale: "ko",
      targetLanguage: "en",
    });

    expect(advice.length).toBeGreaterThan(0);
    expect(advice[0].topic).toBe("grammar");
  });
});
