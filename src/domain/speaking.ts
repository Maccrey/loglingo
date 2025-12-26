export interface SpeakingSession {
  id: string;
  userId: string;
  language: string; // e.g., 'en', 'es', 'ko'
  transcript: string;
  durationSec: number;
  aiAnalyzed: boolean;
  audioUrl?: string; // Optional: if we decide to upload audio blob
  createdAt: Date;
}

export interface SpeakingFeedback {
  id: string;
  sessionId: string;
  userId: string; // Added for security rules convenience
  original: string;
  improved: string;
  grammarNotes: string[];
  rootMeaningGuide: Record<string, string>; // key: word/phrase, value: root meaning explanation
  createdAt: Date;
}

export interface SpeakingStats {
  userId: string;
  totalSpeakingSeconds: number; // Cumulative
  totalSessions: number;
  lastSessionAt: Date;
}
