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
  continuous = true,
  interimResults = true,
}: UseSpeechRecognitionProps & { continuous?: boolean; interimResults?: boolean } = {}): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notSupported, setNotSupported] = useState(false);

  const recognitionRef = useRef<any>(null);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const isRecordingRef = useRef(false);

  // Sync ref with state for access in callbacks
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

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
    recognition.continuous = continuous; 
    recognition.interimResults = interimResults;
    recognition.maxAlternatives = 1; // Try to keep it simple
    recognition.lang = language;
    
    recognition.onstart = () => {
      setIsRecording(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      // Reset silence timer on every result
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      silenceTimer.current = setTimeout(() => {
          if (isRecordingRef.current) {
              // console.log("Silence detected, stopping...");
              recognition.stop();
          }
      }, 2000);

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
         // Should we accumulate differently if not continuous? 
         // For now, standard behavior is fine.
         // If continuous is false, the session ends after one sentence anyway.
         return current; 
      });
      
      if (onResult) {
        // onResult(current);
      }
    };

    recognition.onerror = (event: any) => {
      // console.error('Speech recognition error', event.error);
      if (event.error === 'no-speech') {
          // ignore no-speech for cleaner UX or handle it
      }
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      setError(event.error);
      if (onError) onError(event.error);
    };

    recognition.onend = () => {
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      setIsRecording(false);
      isRecordingRef.current = false;
      if (onEnd) onEnd();
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [language, continuous, interimResults, onResult, onEnd, onError]);

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
