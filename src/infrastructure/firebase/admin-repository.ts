import admin from "./admin";
import { SpeakingSession, SpeakingFeedback, SpeakingFeedbackDiff } from "@/domain/speaking";
import { LearningArchive } from "@/domain/archive";

const db = admin.firestore();

// --- Speaking Session ---

export async function createSpeakingSession(
  session: Omit<SpeakingSession, "id" | "createdAt">
): Promise<SpeakingSession> {
  const collection = db.collection("speaking_sessions");
  const docRef = await collection.add({
    ...session,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  const snapshot = await docRef.get();
  const data = snapshot.data()!;
  
  return {
    id: snapshot.id,
    userId: data.userId,
    language: data.language,
    transcript: data.transcript,
    durationSec: data.durationSec,
    aiAnalyzed: data.aiAnalyzed,
    createdAt: (data.createdAt as admin.firestore.Timestamp).toDate(),
  };
}

// --- Speaking Feedback ---

export async function createSpeakingFeedback(
  feedback: Omit<SpeakingFeedback, "id" | "createdAt">
): Promise<SpeakingFeedback> {
  const collection = db.collection("speaking_feedback");
  const docRef = await collection.add({
    ...feedback,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  const snapshot = await docRef.get();
  const data = snapshot.data()!;

  return {
    id: snapshot.id,
    sessionId: data.sessionId,
    userId: data.userId,
    original: data.original,
    improved: data.improved,
    grammarNotes: data.grammarNotes || [],
    rootMeaningGuide: data.rootMeaningGuide || {},
    diff: data.diff as SpeakingFeedbackDiff[],
    accuracyScore: data.accuracyScore,
    advice: data.advice,
    createdAt: (data.createdAt as admin.firestore.Timestamp).toDate(),
  };
}

// --- Archive (Admin) ---

export async function checkDuplicateArchive(userId: string, title: string): Promise<boolean> {
  if (!userId || !title) return false;
  const snapshot = await db.collection("learning_archive")
    .where("userId", "==", userId)
    .where("title", "==", title)
    .limit(1)
    .get();
  return !snapshot.empty;
}

export async function createArchive(
  // Minimal input needed for auto-creation
  input: {
    userId: string;
    type: 'word' | 'grammar';
    title: string;
    rootMeaning: string;
    sourceId: string;
    sourceType: 'speaking';
    sourceText: string;
  }
): Promise<void> {
  await db.collection("learning_archive").add({
    ...input,
    examples: [],
    memorized: false,
    correctCount: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

export async function getRecentDiaries(userId: string, limit: number = 3): Promise<string[]> {
  if (!userId) return [];
  try {
    const snapshot = await db.collection("diaries")
      .where("userId", "==", userId)
      .orderBy("date", "desc")
      .limit(limit)
      .get();
      
    // If getting content fails or is empty, filter it out
    return snapshot.docs.map(doc => doc.data().content as string).filter(Boolean);
  } catch (e) {
      console.warn("Failed to fetch recent diaries for prompt", e);
      return [];
  }
}
