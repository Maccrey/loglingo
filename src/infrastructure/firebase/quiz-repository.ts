import { Quiz, QuizDraft } from "@/domain/quiz";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";

const quizzesCollection = collection(db, "quizzes");

function mapQuiz(snapshot: QueryDocumentSnapshot<DocumentData>): Quiz {
  const data = snapshot.data();
  const createdAt =
    data.createdAt instanceof Timestamp
      ? data.createdAt.toDate()
      : new Date(data.createdAt ?? Date.now());

  return {
    id: snapshot.id,
    userId: data.userId || "",
    archiveId: data.archiveId,
    question: data.question,
    options: data.options || [],
    correctIndex: data.correctIndex ?? 0,
    explanation: data.explanation || "",
    createdAt,
  };
}

export async function getQuizByArchiveId(
  archiveId: string
): Promise<Quiz | null> {
  console.log("🔍 Quiz Repository: getQuizByArchiveId called", { archiveId });
  
  if (!archiveId) {
    console.log("⚠️ Quiz Repository: No archiveId provided");
    return null;
  }

  try {
    const q = query(quizzesCollection, where("archiveId", "==", archiveId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("📭 Quiz Repository: No quiz found for archiveId", archiveId);
      return null;
    }

    const quiz = mapQuiz(snapshot.docs[0]);
    console.log("✅ Quiz Repository: Quiz found", { quizId: quiz.id });
    return quiz;
  } catch (error) {
    console.error("❌ Quiz Repository: Query failed", error);
    return null;
  }
}

export async function createQuiz(draft: QuizDraft): Promise<Quiz> {
  console.log("💾 Quiz Repository: Creating quiz", { archiveId: draft.archiveId, userId: draft.userId });
  
  const payload = {
    ...draft,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(quizzesCollection, payload);
  const snapshot = await getDocs(
    query(quizzesCollection, where("__name__", "==", docRef.id))
  );

  const quiz = mapQuiz(snapshot.docs[0]);
  console.log("✅ Quiz Repository: Quiz created", { quizId: quiz.id });
  return quiz;
}
