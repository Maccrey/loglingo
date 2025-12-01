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
  const filters = [where("userId", "==", userId)];
  if (type) filters.push(where("type", "==", type));
  const q = query(archiveCol, ...filters, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapArchive);
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
