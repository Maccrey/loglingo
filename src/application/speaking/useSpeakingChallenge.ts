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

import { SpeakingFeedback } from '@/domain/speaking';
import { useAddLevelRecord } from '@/application/learning-profile/hooks';
import { LevelBand } from '@/domain/learning-profile';

// ...

export function useSpeakingChallenge() {
  const { user } = useAuth();
  const [step, setStep] = useState<ChallengeStep>('idle');
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
  const [userTranscript, setUserTranscript] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const addLevelRecord = useAddLevelRecord(user?.uid || '');

  
  // Store context for verification
  const [context, setContext] = useState<{ learningLanguage: string; uiLocale: string } | null>(null);

  const fetchNewChallenge = async (learningLanguage: string, uiLocale: string) => {
    if (!user) return;
    setStep('loading');
    setError(null);
    setContext({ learningLanguage, uiLocale });

    try {
      // 1. Get Random Weak Item (Client-side Firestore call)
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

  const verifySpeech = async (transcript: string) => {
     setUserTranscript(transcript);
     setStep('verifying');

     if (!challengeData || !user || !context) return;

     try {
       const response = await fetch('/api/ai/analyze-speaking', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            text: transcript,
            targetSentence: challengeData.sentence,
            language: context.learningLanguage,
            userId: user.uid,
            uiLocale: context.uiLocale
         }),
       });
       
       if (!response.ok) {
           throw new Error("Analysis failed");
       }

       const data = await response.json();
       const fb = data.feedback as SpeakingFeedback;
       
       setFeedback(fb);
       
       // Success criteria: Score > 70 or explicitly marked?
        const success = (fb.accuracyScore || 0) >= 70;
        setIsSuccess(success);

        // Helper for client-side fallback
        function estimateLevelFromScore(score: number): LevelBand {
            if (score >= 95) return "C2";
            if (score >= 85) return "C1";
            if (score >= 75) return "B2";
            if (score >= 60) return "B1";
            if (score >= 40) return "A2";
            return "A1";
        }

        // Save estimated level if successful
        if (success) {
            const score = fb.accuracyScore || 0;
            const rawLevel = fb.estimatedLevel;
            const validLevels: LevelBand[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
            
            let levelToSave: LevelBand = "A1";
            
            if (rawLevel && validLevels.includes(rawLevel as LevelBand)) {
                levelToSave = rawLevel as LevelBand;
            } else {
                levelToSave = estimateLevelFromScore(score);
            }

            addLevelRecord.mutate({
                level: levelToSave,
                score: score,
                confidence: score / 100,
                sourceType: 'speaking',
                sourceId: fb.sessionId,
                language: context.learningLanguage
            });
        }
        
        setStep('result');

     } catch (err: any) {
       console.error(err);
       setError("Failed to analyze speech.");
       setStep('error');
     }
  };

  const retryChallenge = () => {
    setStep('ready'); // Go back to 'ready' state to try speaking again
    setUserTranscript('');
    setFeedback(null);
    setIsSuccess(false);
  };

  return {
    step,
    challengeData,
    userTranscript,
    isSuccess,
    feedback,
    error,
    fetchNewChallenge,
    verifySpeech,
    retryChallenge,
    setStep
  };
}
// Force HMR Rebuild
