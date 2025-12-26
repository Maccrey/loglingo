import { db } from '@/lib/firebase'; // Adjust path if needed
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { SpeakingSession, SpeakingFeedback } from '@/domain/speaking';

export const SpeakingRepository = {
  async saveSession(session: Omit<SpeakingSession, 'createdAt'>) {
    const ref = doc(collection(db, 'speaking_sessions'));
    const newSession = {
      ...session,
      id: ref.id,
      createdAt: serverTimestamp(),
    };
    await setDoc(ref, newSession);
    return newSession;
  },

  async saveFeedback(feedback: Omit<SpeakingFeedback, 'createdAt' | 'id'>) {
    const ref = doc(collection(db, 'speaking_feedback'));
    const newFeedback = {
      ...feedback,
      id: ref.id,
      createdAt: serverTimestamp(),
    };
    await setDoc(ref, newFeedback);
    return newFeedback;
  }
};
