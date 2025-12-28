import { useState, useCallback } from 'react';
import { SpeakingFeedback, SpeakingSession } from '@/domain/speaking';
import { useAuth } from '@/application/auth/AuthProvider'; // Assuming AuthProvider exists
import { useAddLevelRecord } from '@/application/learning-profile/hooks';
import { LevelBand } from '@/domain/learning-profile';

type SpeakingStep = 'idle' | 'recording' | 'analyzing' | 'feedback' | 'error';

export function useSpeaking() {
  const { user } = useAuth();
  const [step, setStep] = useState<SpeakingStep>('idle');
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const addLevelRecord = useAddLevelRecord(user?.uid || '');

  const startSession = () => {
    setStep('recording');
    setTranscript('');
    setFeedback(null);
    setError(null);
  };

  const submitForAnalysis = async (text: string, language: string, uiLanguage: string) => {
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
        addLevelRecord.mutate({
             level: (data.feedback.estimatedLevel as LevelBand) || 'unknown',
             score: data.feedback.accuracyScore,
             confidence: (data.feedback.accuracyScore) / 100,
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
  };

  const retry = () => {
    setStep('idle');
    setTranscript('');
    setFeedback(null);
    setError(null);
  };

  return {
    step,
    transcript,
    feedback,
    error,
    startSession,
    submitForAnalysis,
    retry,
    setTranscript, // Manual edit if needed?
    setStep,
  };
}
