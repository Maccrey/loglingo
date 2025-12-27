import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseSpeechRecognitionProps {
  onResult?: (transcript: string) => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
  language?: string;
  continuous?: boolean; // Browser native continuous
  interimResults?: boolean;
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
  continuous = false, // Default to false for "raw" mode if we want less correction, but allow override
  interimResults = true,
}: UseSpeechRecognitionProps = {}): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false); // User intent
  const [error, setError] = useState<string | null>(null);
  const [notSupported, setNotSupported] = useState(false);

  // Accumulate finalized transcripts here to support "manual continuous" mode
  const transcriptHistoryRef = useRef('');

  const recognitionRef = useRef<any>(null);
  const isRecordingRef = useRef(false); // Ref for user intent

  // Sync ref with state
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
    recognition.maxAlternatives = 1;
    recognition.lang = language;
    
    recognition.onstart = () => {
      // Platform status is running
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

      // If continuous (native) is false, finalTranscript is the whole chunk.
      // We need to commit it to history.
      // But we should only commit it once. 
      // The event loop here might fire multiple times.
      // Actually, if !continuous, event.resultIndex is always 0.
      
      let currentDisplay = '';
      
      if (!continuous) {
          // In non-continuous mode, we build the full string from history + current chunk
          if (finalTranscript) {
              // Final chunk received.
              // Note: on 'end' we might want to ensure it's saved, but usually 'isFinal' comes before 'end'.
          }
          currentDisplay = transcriptHistoryRef.current + finalTranscript + interimTranscript;
          
          // If we have a final transcript, we should technically append it to history 
          // BUT only if we are sure we won't get it again? 
          // In !continuous, we get one stream of results, then end.
          // We'll update history in onend? No, onend doesn't have the result.
          // We update history here if it is final.
          if (finalTranscript) {
             transcriptHistoryRef.current += finalTranscript + ' ';
             // Remove the final part from "current" for next render? 
             // taking a simpler approach: 
             // We won't clear history until reset.
             // We rely on the fact that for !continuous, the event results reset every session.
          }
      } else {
          // Native continuous: result accumulates in the event list automatically until cleared?
          // Actually, chrome's accumulation is weird. 
          // Let's stick to the "manual continuous" logic for consistency if requested.
          // However, if the user passed continuous=true, let's respect standard behavior.
          currentDisplay = finalTranscript + interimTranscript;
      }
      
      // Fix: The above logic for !continuous is tricky because this handler fires multiple times.
      // If we append to historyRef every time `isFinal` is true, we might duplicate if the same index fires?
      // In !continuous, there is only index 0. So it fires once as final.
      
      setTranscript(currentDisplay);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
          // Ignore no-speech, just restart if needed
      } else {
          setError(event.error);
          if (onError) onError(event.error);
      }
    };

    recognition.onend = () => {
      // If user still wants to record, restart.
      if (isRecordingRef.current) {
          try {
             // Small delay to prevent tight loop errors
             setTimeout(() => {
                 if (isRecordingRef.current) recognition.start();
             }, 50);
          } catch(e) {
             // ignore
             setIsRecording(false);
          }
      } else {
         setIsRecording(false);
         if (onEnd) onEnd();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [language, continuous, interimResults, onEnd, onError]); // removed onResult from dep to avoid re-init

  // Extra useEffect to notify parent of transcript changes cleanly? 
  // Or just rely on state.
  useEffect(() => {
      if(onResult) onResult(transcript);
  }, [transcript, onResult]);


  const startRecording = useCallback(() => {
    if (recognitionRef.current && !isRecording) {
      try {
        setTranscript(''); 
        transcriptHistoryRef.current = ''; // Reset history on fresh start
        setIsRecording(true);
        recognitionRef.current.lang = language;
        recognitionRef.current.start();
      } catch (e) {
        console.error('Failed to start recognition', e);
      }
    }
  }, [isRecording, language]);

  const stopRecording = useCallback(() => {
    setIsRecording(false); // Signal intent to stop
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    transcriptHistoryRef.current = '';
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
