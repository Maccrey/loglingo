import {
  LearningArchive,
  LearningArchiveDraft,
} from "@/domain/archive";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
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
    levelTag: data.levelTag,
    sourceId: data.sourceId,
    createdAt,
  };
}

export async function listArchive(userId: string, type?: string, sourceId?: string, levelTag?: string) {
  console.log("🔍 Archive Repository: listArchive called", { userId, type, sourceId, levelTag });
  
  if (!userId) {
    console.log("⚠️ Archive Repository: No userId, returning empty array");
    return [];
  }

  try {
    const filters = [where("userId", "==", userId)];
    if (type) filters.push(where("type", "==", type));
    if (sourceId) filters.push(where("sourceId", "==", sourceId));
    if (levelTag) filters.push(where("levelTag", "==", levelTag));

    // orderBy를 임시로 제거하여 인덱스 문제인지 확인
    const q = query(archiveCol, ...filters);
    
    // 복합 쿼리의 경우 Firestore 인덱스가 필요할 수 있음
    if (sourceId) {
      // sourceId로 필터링할 때는 orderBy createdAt이 인덱스를 요구할 가능성이 높음
      // 에러 방지를 위해 orderBy("createdAt", "desc")를 함께 쿼리에 추가하고 싶지만
      // 현재 코드는 클라이언트 정렬을 사용 중이므로 이대로 유지
    }

    console.log("🔍 Archive Repository: Executing query...");
    const snapshot = await getDocs(q);
    const results = snapshot.docs.map((doc) => mapArchive(doc as QueryDocumentSnapshot<DocumentData>));
    
    // 클라이언트 사이드에서 정렬
    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    console.log("✅ Archive Repository: Query complete", { count: results.length, results: results.slice(0, 2) });
    return results;
  } catch (error) {
    console.error("❌ Archive Repository: Query failed", error);
    throw error;
  }
}

export async function checkDuplicate(userId: string, title: string, sourceId?: string): Promise<boolean> {
  console.log("🔍 Archive Repository: checkDuplicate", { userId, title, sourceId });
  
  if (!userId || !title) {
    return false;
  }

  try {
    const filters = [
      where("userId", "==", userId),
      where("title", "==", title)
    ];

    if (sourceId) {
      filters.push(where("sourceId", "==", sourceId));
    }

    const q = query(archiveCol, ...filters);
    
    const snapshot = await getDocs(q);
    const exists = !snapshot.empty;
    
    console.log(exists ? "⚠️ Archive Repository: Duplicate found" : "✅ Archive Repository: No duplicate");
    return exists;
  } catch (error) {
    console.error("❌ Archive Repository: Check duplicate failed", error);
    return false;
  }
}

export async function createArchive(input: LearningArchiveDraft): Promise<LearningArchive> {
  const payload = {
    ...input,
    levelTag: input.levelTag,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(archiveCol, payload);
  // Using getDoc is more efficient and safer with security rules than querying by __name__
  const savedSnapshot = await getDoc(doc(db, "learning_archive", ref.id));
  
  if (!savedSnapshot.exists()) {
    throw new Error("Failed to retrieve created archive document");
  }
  
  return mapArchive(savedSnapshot as QueryDocumentSnapshot<DocumentData>);
}

export async function deleteArchivesBySourceId(sourceId: string): Promise<number> {
  console.log("🗑️ Archive Repository: deleteArchivesBySourceId called", { sourceId });
  
  if (!sourceId) {
    console.log("⚠️ Archive Repository: No sourceId provided");
    return 0;
  }

  try {
    const q = query(archiveCol, where("sourceId", "==", sourceId));
    const snapshot = await getDocs(q);
    
    console.log(`📊 Archive Repository: Found ${snapshot.size} archives to delete`);
    
    // Delete all matching documents
    const deletePromises = snapshot.docs.map(docSnapshot => 
      import('firebase/firestore').then(({ deleteDoc, doc }) => 
        deleteDoc(doc(db, "learning_archive", docSnapshot.id))
      )
    );
    
    await Promise.all(deletePromises);
    
    console.log(`✅ Archive Repository: Deleted ${snapshot.size} archives`);
    return snapshot.size;
  } catch (error) {
    console.error("❌ Archive Repository: Delete by sourceId failed", error);
    throw error;
  }
}
