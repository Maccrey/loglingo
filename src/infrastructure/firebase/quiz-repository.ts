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
  archiveId: string,
  userId: string
): Promise<Quiz | null> {
  console.log("🔍 Quiz Repository: getQuizByArchiveId called", { archiveId, userId });
  
  if (!archiveId || !userId) {
    console.log("⚠️ Quiz Repository: No archiveId or userId provided");
    return null;
  }

  try {
    // Security Rules require userId filter for read permission
    const q = query(
      quizzesCollection, 
      where("archiveId", "==", archiveId),
      where("userId", "==", userId)
    );
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

export async function deleteQuizzesByArchiveIds(archiveIds: string[], userId?: string): Promise<number> {
  console.log("🗑️ Quiz Repository: deleteQuizzesByArchiveIds called", { count: archiveIds.length, userId });
  
  if (!archiveIds || archiveIds.length === 0) {
    console.log("⚠️ Quiz Repository: No archiveIds provided");
    return 0;
  }

  try {
    let totalDeleted = 0;
    // Use equality query per archiveId to avoid permission/index issues with "in"
    for (const archiveId of archiveIds) {
      const filters = [where("archiveId", "==", archiveId)];
      if (userId) {
        filters.push(where("userId", "==", userId));
      }
      const q = query(quizzesCollection, ...filters);
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const deletePromises = snapshot.docs.map((docSnapshot) =>
          import("firebase/firestore").then(({ deleteDoc, doc }) =>
            deleteDoc(doc(db, "quizzes", docSnapshot.id))
          )
        );
        await Promise.all(deletePromises);
        totalDeleted += snapshot.size;
      }
    }

    console.log(`✅ Quiz Repository: Deleted ${totalDeleted} quizzes`);
    return totalDeleted;
  } catch (error) {
    console.error("❌ Quiz Repository: Delete by archiveIds failed", error);
    throw error;
  }
}
