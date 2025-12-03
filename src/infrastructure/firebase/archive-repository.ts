import {
  LearningArchive,
  LearningArchiveDraft,
} from "@/domain/archive";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";

const archiveCol = collection(db, "learning_archive");

function mapArchive(doc: QueryDocumentSnapshot<DocumentData>): LearningArchive {
  const data = doc.data();
  const createdAt =
    data.createdAt instanceof Timestamp
      ? data.createdAt.toDate()
      : new Date(data.createdAt ?? Date.now());
  return {
    id: doc.id,
    userId: data.userId,
    type: data.type,
    title: data.title,
    examples: data.examples || [],
    rootMeaning: data.rootMeaning || "",
    createdAt,
  };
}

export async function listArchive(userId: string, type?: string) {
  console.log("🔍 Archive Repository: listArchive called", { userId, type });
  
  if (!userId) {
    console.log("⚠️ Archive Repository: No userId, returning empty array");
    return [];
  }

  try {
    const filters = [where("userId", "==", userId)];
    if (type) filters.push(where("type", "==", type));

    // orderBy를 임시로 제거하여 인덱스 문제인지 확인
    const q = query(archiveCol, ...filters);

    console.log("🔍 Archive Repository: Executing query...");
    const snapshot = await getDocs(q);
    const results = snapshot.docs.map(mapArchive);
    
    // 클라이언트 사이드에서 정렬
    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    console.log("✅ Archive Repository: Query complete", { count: results.length, results: results.slice(0, 2) });
    return results;
  } catch (error) {
    console.error("❌ Archive Repository: Query failed", error);
    throw error;
  }
}

export async function createArchive(input: LearningArchiveDraft): Promise<LearningArchive> {
  const payload = {
    ...input,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(archiveCol, payload);
  const saved = await getDocs(query(archiveCol, where("__name__", "==", ref.id)));
  return saved.docs.map(mapArchive)[0];
}
