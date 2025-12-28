import { useState, useCallback } from 'react';
import { SpeakingFeedback, SpeakingSession } from '@/domain/speaking';
import { useAuth } from '@/application/auth/AuthProvider'; // Assuming AuthProvider exists
import { useAddLevelRecord } from '@/application/learning-profile/hooks';
import { LevelBand } from '@/domain/learning-profile';

type SpeakingStep = 'idle' | 'recording' | 'analyzing' | 'feedback' | 'error';

// Helper for client-side fallback
function estimateLevelFromScore(score: number): LevelBand {
  if (score >= 95) return "C2";
  if (score >= 85) return "C1";
  if (score >= 75) return "B2";
  if (score >= 60) return "B1";
  if (score >= 40) return "A2";
  return "A1";
}

export function useSpeaking() {
  const { user } = useAuth();
  const [step, setStep] = useState<SpeakingStep>('idle');
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const addLevelRecord = useAddLevelRecord(user?.uid || '');

  const [prompt, setPrompt] = useState<{ text: string; translation: string } | null>(null);
  const [isPromptLoading, setIsPromptLoading] = useState(false);

  const fetchPrompt = useCallback(async (language: string, uiLocale: string, force: boolean = false) => {
      // Prevent fetching if already loading
      // Prevent fetching if prompt exists and not forcing
      setPrompt(prev => {
          if (!force && prev) return prev; // Return current state if we have it and not forcing
          return force ? null : prev;
      });

      // We need a way to check current state. 
      // Since we can't easily access 'prompt' state inside useCallback without adding it to deps (which causes loops),
      // we'll rely on the caller or a ref, OR simply rely on the 'force' flag primarily.
      // But actsually, the cleanest way in the hook is to trust the caller.
      // However, to be extra safe against double-invocations:
      
      setIsPromptLoading(true);
      try {
          const response = await fetch('/api/ai/speaking/prompt', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user?.uid, language, uiLocale })
          });
          if (response.ok) {
              const data = await response.json();
              setPrompt({ text: data.prompt, translation: data.translation });
          }
      } catch (e) {
          console.error("Failed to fetch speaking prompt", e);
      } finally {
          setIsPromptLoading(false);
      }
  }, [user?.uid]);

  const startSession = useCallback(() => {
    setStep('recording');
    setTranscript('');
    setFeedback(null);
    setError(null);
  }, []);

  const submitForAnalysis = useCallback(async (text: string, language: string, uiLanguage: string) => {
    if (!text.trim()) return;
    
    setTranscript(text);
    setStep('analyzing');

    try {
      // 1. Call AI API
      const response = await fetch('/api/ai/analyze-speaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            text,
            language,
            userId: user?.uid,
            uiLocale: uiLanguage // API expects uiLocale or uiLanguage mapped
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      // data should contain { feedback, session } ideally
      
      setFeedback(data.feedback);
      setStep('feedback');
      
      // Save result if valid score
      if (data.feedback && typeof data.feedback.accuracyScore === 'number' && data.feedback.accuracyScore > 0) {
        const score = data.feedback.accuracyScore;
        const rawLevel = data.feedback.estimatedLevel;
        const validLevels: LevelBand[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
        
        let levelToSave: LevelBand = "A1"; // Default safe fallback
        
        if (rawLevel && validLevels.includes(rawLevel as LevelBand)) {
             levelToSave = rawLevel as LevelBand;
        } else {
             // Fallback estimate
             levelToSave = estimateLevelFromScore(score);
        }

        addLevelRecord.mutate({
             level: levelToSave,
             score: score,
             confidence: score / 100,
             sourceType: 'speaking',
             sourceId: data.feedback.sessionId, // AI API should return session ID
             language: language
        });
      }
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
      setStep('error');
    }
  }, [user?.uid, addLevelRecord]);

  const retry = useCallback(() => {
    setStep('idle');
    setTranscript('');
    setFeedback(null);
    setError(null);
    // Don't clear prompt to allow reuse, or clear if we want fresh? Keep it for now.
  }, []);

  return {
    step,
    transcript,
    feedback,
    error,
    prompt,
    isPromptLoading,
    fetchPrompt,
    startSession,
    submitForAnalysis,
    retry,
    setTranscript, // Manual edit if needed?
    setStep,
  };
}
