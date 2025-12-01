import { auth } from "@/lib/firebase";

// Returns Firebase UID if logged in, otherwise a local fallback for demo.
export function getCurrentUserId() {
  if (typeof window !== "undefined" && auth.currentUser?.uid) {
    return auth.currentUser.uid;
  }
  return "demo-user";
}
