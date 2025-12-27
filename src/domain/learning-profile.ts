export type LevelBand = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "unknown";

export interface LevelRecord {
  id: string;
  level: LevelBand;
  score?: number; // 0~100 scaled confidence score
  confidence?: number; // 0~1 probability-style confidence
  sourceType?: "ai_correction" | "quiz" | "manual" | "speaking";
  sourceId?: string;
  language?: string; // target learning language code
  rationale?: string;
  createdAt: Date;
}

export type AdvicePriority = "high" | "medium" | "low";

export interface AdviceItem {
  id: string;
  topic: string; // grammar/vocab/pronunciation/fluency/etc.
  priority: AdvicePriority;
  message: Record<string, string>; // localized messages keyed by locale
  count?: number;
  actions?: string[];
  relatedLevel?: LevelBand | string;
  sourceId?: string;
  completed?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
