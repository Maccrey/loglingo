import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { AppUser, Streak } from "@/domain/user/user";

export async function getUserProfile(userId: string): Promise<AppUser | null> {
  const docRef = doc(db, "users", userId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as AppUser;
}

export async function updateUserStreak(userId: string, streak: Streak): Promise<void> {
  const docRef = doc(db, "users", userId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    await setDoc(docRef, { streak, createdAt: new Date().toISOString() }, { merge: true });
  } else {
    await updateDoc(docRef, { streak, updatedAt: new Date().toISOString() });
  }
}
