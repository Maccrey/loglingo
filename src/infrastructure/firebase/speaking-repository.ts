import { db } from "@/lib/firebase";
import { SpeakingSession, SpeakingFeedback } from "@/domain/speaking";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
  query,
  where,
  getCountFromServer,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";

const sessionCol = collection(db, "speaking_sessions");
const feedbackCol = collection(db, "speaking_feedback");

function mapSession(doc: QueryDocumentSnapshot<DocumentData>): SpeakingSession {
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId,
    language: data.language,
    transcript: data.transcript,
    durationSec: data.durationSec,
    aiAnalyzed: data.aiAnalyzed,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
  };
}

function mapFeedback(doc: QueryDocumentSnapshot<DocumentData>): SpeakingFeedback {
  const data = doc.data();
  return {
    id: doc.id,
    sessionId: data.sessionId,
    userId: data.userId,
    original: data.original,
    improved: data.improved,
    grammarNotes: data.grammarNotes || [],
    rootMeaningGuide: data.rootMeaningGuide || {},
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
  };
}

export async function createSpeakingSession(
  session: Omit<SpeakingSession, "id" | "createdAt">
): Promise<SpeakingSession> {
  const ref = await addDoc(sessionCol, {
    ...session,
    createdAt: serverTimestamp(),
  });
  const snap = await getDoc(doc(db, "speaking_sessions", ref.id));
  return mapSession(snap as QueryDocumentSnapshot<DocumentData>);
}

export async function createSpeakingFeedback(
  feedback: Omit<SpeakingFeedback, "id" | "createdAt">
): Promise<SpeakingFeedback> {
  const ref = await addDoc(feedbackCol, {
    ...feedback,
    createdAt: serverTimestamp(),
  });
  const snap = await getDoc(doc(db, "speaking_feedback", ref.id));
  return mapFeedback(snap as QueryDocumentSnapshot<DocumentData>);
}
export async function getDailySessionCount(userId: string): Promise<number> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const q = query(
    sessionCol,
    where("userId", "==", userId),
    where("createdAt", ">=", Timestamp.fromDate(startOfDay))
  );

  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}

export async function getRecentFeedbacks(userId: string, count: number = 5): Promise<SpeakingFeedback[]> {
  const q = query(
    feedbackCol,
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(count)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapFeedback);
}
