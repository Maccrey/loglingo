import { useState, useCallback } from 'react';
import { useAuth } from '@/application/auth/AuthProvider';
import { LearningArchive } from '@/domain/archive';
import { getRandomWeakItem } from '@/infrastructure/firebase/archive-repository'; // We might need a server action wrapper or API for this if used client-side?
// For now, let's assume we fetch via API or Server Action. 
// Since getRandomWeakItem is Firestore, better to use a server action or API route to keep client clean.
// I will assume we add a server action or extend the challenge API to fetch the item too.

type ChallengeStep = 'idle' | 'loading' | 'ready' | 'recording' | 'verifying' | 'result' | 'error';

interface ChallengeData {
  sentence: string;
  meaning: string;
  pronunciationTips?: string;
  archiveItem: LearningArchive;
}

export function useSpeakingChallenge() {
  const { user } = useAuth();
  const [step, setStep] = useState<ChallengeStep>('idle');
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
  const [userTranscript, setUserTranscript] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to fetch weak item (simulated client-side call to repo for now, or via API)
  // Ideally this should be an API call: GET /api/speaking/challenge/next
  // But for speed, let's just use the API we made: POST /api/ai/speaking/challenge with item.
  // Wait, the client can't call Firestore directly easily without setup.
  // Let's create a server action for fetching the item? 
  // Or just fetching the item inside the API route itself?
  // User asked for "Archive -> Grok -> Sentence".
  // Let's make a wrapper function here that calls an API to "get challenge".
  
  // Actually, I didn't verify if I can call firebase-admin from client. `archive-repository` imports `db` from `@/lib/firebase`, which is client SDK. So I CAN call it here.

  const fetchNewChallenge = async (learningLanguage: string, uiLocale: string) => {
    if (!user) return;
    setStep('loading');
    setError(null);

    try {
      // 1. Get Random Weak Item (Client-side Firestore call)
      const { getRandomWeakItem } = await import('@/infrastructure/firebase/archive-repository');
      const item = await getRandomWeakItem(user.uid);

      if (!item) {
        setError("No weak items found in archive to review!");
        setStep('error');
        return;
      }

      // 2. Generate Sentence via Grok API
      const response = await fetch('/api/ai/speaking/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          archiveItem: {
             title: item.title,
             type: item.type,
             rootMeaning: item.rootMeaning
          },
          learningLanguage,
          uiLocale
        }),
      });

      if (!response.ok) throw new Error("Failed to generate challenge");

      const genData = await response.json();
      
      setChallengeData({
        sentence: genData.sentence,
        meaning: genData.meaning,
        pronunciationTips: genData.pronunciationTips,
        archiveItem: item
      });
      setStep('ready');

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load challenge");
      setStep('error');
    }
  };

  const verifySpeech = (transcript: string) => {
     setUserTranscript(transcript);
     setStep('verifying');

     if (!challengeData) return;

     // Simple Normalization & Comparison
     const normalize = (s: string) => s.toLowerCase().replace(/[.,!?]/g, '').trim();
     const target = normalize(challengeData.sentence);
     const input = normalize(transcript);

     // Calculate simple accuracy (could use Livenshtein for better score)
     // Use simple "includes" or "equality" for MVP
     // Or a simple word match percentage
     const targetWords = target.split(/\s+/);
     const inputWords = input.split(/\s+/);
     
     let matchCount = 0;
     targetWords.forEach(w => {
        if (inputWords.includes(w)) matchCount++;
     });

     const accuracy = matchCount / targetWords.length;
     const success = accuracy > 0.7; // 70% match threshold

     setIsSuccess(success);
     setStep('result');
  };

  const retryChallenge = () => {
    setStep('ready'); // Go back to 'ready' state to try speaking again
    setUserTranscript('');
  };

  return {
    step,
    challengeData,
    userTranscript,
    isSuccess,
    error,
    fetchNewChallenge,
    verifySpeech,
    retryChallenge,
    setStep
  };
}
