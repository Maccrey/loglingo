export type CorrectionMode = "sentence" | "full";

export interface CorrectionIssue {
  type: "grammar" | "word" | "style" | "other";
  original: string;
  suggestion: string;
  explanation: string;
}

export interface CorrectionResult {
  corrected: string;
  issues: CorrectionIssue[];
  rootMeaningGuide?: string;
}
