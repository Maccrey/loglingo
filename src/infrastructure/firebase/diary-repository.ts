import {
  Diary,
  DiaryDraft,
  DiaryImageUploadResult,
  DiaryRepository,
} from "@/domain/diary";
import { db, storage } from "@/lib/firebase";
import {
  addDoc,
  collection,
  DocumentData,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  UploadTask,
} from "firebase/storage";

const diariesCollection = collection(db, "diaries");

function mapDiary(
  snapshot: DocumentSnapshot<DocumentData> | QueryDocumentSnapshot<DocumentData>
): Diary {
  const data = snapshot.data();
  if (!data) {
    throw new Error("Diary snapshot is missing data");
  }
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
    id: snapshot.id,
    userId: data.userId,
    date: data.date,
    content: data.content,
    imageUrl: data.imageUrl,
    aiReviewed: Boolean(data.aiReviewed),
    createdAt,
    updatedAt,
  };
}

async function listByUser(userId: string, year?: number): Promise<Diary[]> {
  const constraints = [where("userId", "==", userId)];
  if (year) {
    constraints.push(where("date", ">=", `${year}-01-01`));
    constraints.push(where("date", "<=", `${year}-12-31`));
  }

  const q = query(
    diariesCollection,
    ...constraints,
    orderBy("date", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapDiary);
}

async function getById(userId: string, id: string): Promise<Diary | null> {
  const refDoc = doc(diariesCollection, id);
  const snapshot = await getDoc(refDoc);
  if (!snapshot.exists()) return null;
  const data = mapDiary(snapshot);
  if (data.userId !== userId) return null;
  return data;
}

async function create(input: DiaryDraft): Promise<Diary> {
  const payload = {
    ...input,
    aiReviewed: Boolean(input.aiReviewed),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const refDoc = await addDoc(diariesCollection, payload);
  const created = await getDoc(refDoc);
  return mapDiary(created);
}

async function update(id: string, input: Partial<DiaryDraft>): Promise<Diary> {
  const refDoc = doc(diariesCollection, id);
  await updateDoc(refDoc, { ...input, updatedAt: serverTimestamp() });
  const updated = await getDoc(refDoc);
  return mapDiary(updated);
}

async function remove(id: string): Promise<void> {
  const refDoc = doc(diariesCollection, id);
  await deleteDoc(refDoc);
}

async function uploadDiaryImage(
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<DiaryImageUploadResult> {
  const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
  const storageRef = ref(
    storage,
    `diaryImages/${userId}/${Date.now()}-${safeName}`
  );
  const uploadTask: UploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
    cacheControl: "public,max-age=31536000",
  });

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        onProgress?.(progress);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ url, path: uploadTask.snapshot.ref.fullPath });
      }
    );
  });
}

export const firebaseDiaryRepository: DiaryRepository & {
  uploadDiaryImage: typeof uploadDiaryImage;
} = {
  listByUser,
  getById,
  create,
  update,
  delete: remove,
  uploadDiaryImage,
};
