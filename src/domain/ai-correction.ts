export type CorrectionMode = "sentence" | "full";

export interface CorrectionIssue {
  type: "grammar" | "word" | "style" | "other";
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
}
