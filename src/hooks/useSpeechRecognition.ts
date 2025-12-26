import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseSpeechRecognitionProps {
  onResult?: (transcript: string) => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
  language?: string;
}

export interface UseSpeechRecognitionReturn {
  transcript: string;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  resetTranscript: () => void;
  error: string | null;
  notSupported: boolean;
}

export function useSpeechRecognition({
  onResult,
  onEnd,
  onError,
  language = 'en-US',
}: UseSpeechRecognitionProps = {}): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notSupported, setNotSupported] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Browser compatibility check
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setNotSupported(true);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep recording even after silence
    recognition.interimResults = true; // Show results while speaking
    recognition.lang = language;

    recognition.onstart = () => {
      setIsRecording(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const current = finalTranscript + interimTranscript;
      setTranscript((prev) => {
        // Simple append strategy or replacement? 
        // Usually we want the full session transcript.
        // If continuous is true, the event.resultIndex handles the offset.
        // We might just want to setTranscript to the accumulated results from the event.
        // Actually, for simple usage, let's just accumulate.
         // NOTE: SpeechRecognition event.results contains ALL results for the session if continuous=true
         let fullTranscript = '';
         for (let i = 0; i < event.results.length; ++i) {
            fullTranscript += event.results[i][0].transcript;
         }
         return fullTranscript;
      });
      
      if (onResult) {
        // onResult(current);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setError(event.error);
      if (onError) onError(event.error);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (onEnd) onEnd();
    };

    recognitionRef.current = recognition;
  }, [language, onResult, onEnd, onError]);

  const startRecording = useCallback(() => {
    if (recognitionRef.current && !isRecording) {
      try {
        setTranscript(''); // Auto reset on start?
        recognitionRef.current.lang = language;
        recognitionRef.current.start();
      } catch (e) {
        console.error('Failed to start recognition', e);
      }
    }
  }, [isRecording, language]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  }, [isRecording]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    transcript,
    isRecording,
    startRecording,
    stopRecording,
    resetTranscript,
    error,
    notSupported,
  };
}
