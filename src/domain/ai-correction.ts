export type CorrectionMode = "sentence" | "full";

export interface CorrectionIssue {
  type: "grammar" | "word" | "style" | "pattern" | "other";
  original: string;
  suggestion: string;
  explanation: string;
  exampleSentences?: string[]; // Example sentences in target language (3-5 for grammar, 3-6 for word)
  exampleTranslations?: string[]; // Translations of exampleSentences in UI language (same length as exampleSentences)
}

export interface CorrectionResult {
  corrected: string;
  issues: CorrectionIssue[];
  rootMeaningGuide?: string;
  fallback?: boolean;
  levelAssessment?: {
    level: import("./learning-profile").LevelBand;
    score?: number;
    confidence?: number;
    rationale?: string;
  };
  advice?: {
    topic: string;
    priority: string;
    message: Record<string, string>;
    relatedLevel?: import("./learning-profile").LevelBand;
  }[];
}
