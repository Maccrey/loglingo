import { useState, useCallback } from 'react';
import { toast } from 'sonner';
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
      setPrompt(prev => {
          if (!force && prev) return prev;
          return force ? null : prev;
      });
      
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
      const response = await fetch('/api/ai/analyze-speaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            text,
            language,
            userId: user?.uid,
            uiLocale: uiLanguage
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      console.log("Received analysis data:", data);
      
      setFeedback(data.feedback);
      setStep('feedback');
      
      // Save result if valid score
      const score = data.feedback?.accuracyScore;
      console.log("Checking score for save:", score, typeof score);

      if (data.feedback && typeof score === 'number' && score > 0) {
        const rawLevel = data.feedback.estimatedLevel;
        const validLevels: LevelBand[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
        
        let levelToSave: LevelBand = "A1"; 
        
        if (rawLevel && validLevels.includes(rawLevel as LevelBand)) {
             levelToSave = rawLevel as LevelBand;
        } else {
             levelToSave = estimateLevelFromScore(score);
        }

        console.log("Attempting to save speaking result:", { level: levelToSave, score });

        addLevelRecord.mutate({
             level: levelToSave,
             score: score,
             confidence: score / 100,
             sourceType: 'speaking',
             sourceId: data.feedback.sessionId,
             language: language
        }, {
             onSuccess: () => {
                 console.log("Speaking result saved to profile successfully");
                 toast.success("Speaking result saved!");
             },
             onError: (err) => {
                 console.error("Failed to save speaking result", err);
                 toast.error("Failed to save result: " + err.message);
             }
        });
      } else {
          console.warn("Skipping save: Invalid accuracy score", data.feedback);
          toast.warning("Result not saved: Score invalid (" + score + ")");
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
