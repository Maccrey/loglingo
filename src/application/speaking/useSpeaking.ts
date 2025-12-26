import { useState, useCallback } from 'react';
import { SpeakingFeedback, SpeakingSession } from '@/domain/speaking';
import { useAuth } from '@/application/auth/AuthProvider'; // Assuming AuthProvider exists
// import { saveSpeakingResult } from '@/infrastructure/repositories/SpeakingRepository'; // To be implemented

type SpeakingStep = 'idle' | 'recording' | 'analyzing' | 'feedback' | 'error';

export function useSpeaking() {
  const { user } = useAuth();
  const [step, setStep] = useState<SpeakingStep>('idle');
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startSession = () => {
    setStep('recording');
    setTranscript('');
    setFeedback(null);
    setError(null);
  };

  const submitForAnalysis = async (text: string, language: string) => {
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
            userId: user?.uid
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      // data should contain { feedback, session } ideally
      
      setFeedback(data.feedback);
      setStep('feedback');
      
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
