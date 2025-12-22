import { LevelRecord, AdviceItem } from "@/domain/learning-profile";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  limit as applyLimit,
} from "firebase/firestore";

function pruneUndefined<T extends Record<string, any>>(input: T): T {
  const clean: Record<string, any> = {};
  Object.entries(input).forEach(([key, value]) => {
    if (value !== undefined) {
      clean[key] = value;
    }
  });
  return clean as T;
}

function mapLevel(docSnap: any): LevelRecord {
  const data = docSnap.data();
  const createdAt =
    data.createdAt instanceof Timestamp
      ? data.createdAt.toDate()
      : new Date(data.createdAt ?? Date.now());

  return {
    id: docSnap.id,
    level: data.level ?? "unknown",
    score: typeof data.score === "number" ? data.score : undefined,
    confidence: typeof data.confidence === "number" ? data.confidence : undefined,
    sourceType: data.sourceType,
    sourceId: data.sourceId,
    language: data.language,
    rationale: data.rationale,
    createdAt,
  };
}

function mapAdvice(docSnap: any): AdviceItem {
  const data = docSnap.data();
  const createdAt =
    data.createdAt instanceof Timestamp
      ? data.createdAt.toDate()
      : new Date(data.createdAt ?? Date.now());
  const updatedAt =
    data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate()
      : data.updatedAt
        ? new Date(data.updatedAt)
        : undefined;

  return {
    id: docSnap.id,
    topic: data.topic,
    priority: data.priority ?? "medium",
    message: data.message ?? {},
    actions: data.actions ?? [],
    relatedLevel: data.relatedLevel,
    sourceId: data.sourceId,
    completed: Boolean(data.completed),
    createdAt,
    updatedAt,
  };
}

export async function addLevelRecord(userId: string, payload: Omit<LevelRecord, "id" | "createdAt">) {
  if (!userId) throw new Error("userId is required for level record");
  const col = collection(db, "users", userId, "level");
  const docRef = await addDoc(col, pruneUndefined({
    ...payload,
    createdAt: serverTimestamp(),
  }));
  const snap = await getDocs(query(col, where("__name__", "==", docRef.id)));
  return mapLevel(snap.docs[0]);
}

export async function listLevelRecords(userId: string, limitCount = 10) {
  if (!userId) return [];
  const col = collection(db, "users", userId, "level");
  const q = query(col, orderBy("createdAt", "desc"), applyLimit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map(mapLevel);
}

export async function addAdviceItem(userId: string, payload: Omit<AdviceItem, "id" | "createdAt" | "updatedAt">) {
  if (!userId) throw new Error("userId is required for advice item");
  const col = collection(db, "users", userId, "advice");
  const docRef = await addDoc(col, pruneUndefined({
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }));
  const snap = await getDocs(query(col, where("__name__", "==", docRef.id)));
  return mapAdvice(snap.docs[0]);
}

export async function listAdviceItems(userId: string, limitCount = 20, topic?: string) {
  if (!userId) return [];
  const col = collection(db, "users", userId, "advice");
  const filters = [orderBy("createdAt", "desc"), applyLimit(limitCount)];
  const snap = await getDocs(topic ? query(col, where("topic", "==", topic), ...filters) : query(col, ...filters));
  return snap.docs.map(mapAdvice);
}

export async function markAdviceCompleted(userId: string, adviceId: string, completed: boolean) {
  if (!userId || !adviceId) throw new Error("userId and adviceId are required");
  const ref = doc(db, "users", userId, "advice", adviceId);
  await updateDoc(ref, { completed, updatedAt: serverTimestamp() });
}
