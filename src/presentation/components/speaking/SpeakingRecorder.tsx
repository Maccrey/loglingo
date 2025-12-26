'use client';

import React from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { Button } from '@/components/ui/Button';
import { WaveformVisualizer } from './WaveformVisualizer';
import { Mic, Square, RotateCcw, MessageSquarePlus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { toast } from 'sonner';

interface SpeakingRecorderProps {
  language: string;
  onTranscriptComplete: (transcript: string) => void;
}

export function SpeakingRecorder({ language, onTranscriptComplete }: SpeakingRecorderProps) {
  const {
    transcript,
    isRecording,
    startRecording,
    stopRecording,
    resetTranscript,
    notSupported,
  } = useSpeechRecognition({
    language,
    onError: (err) => {
        if (err === 'not-allowed') {
            toast.error('Microphone permission denied.');
        } else {
            toast.error('Speech recognition error: ' + err);
        }
    }
  });

  const handleToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      resetTranscript();
      startRecording();
    }
  };

  const handleFinish = () => {
    if (isRecording) stopRecording();
    if (transcript.trim().length === 0) {
        toast.warning('No speech detected.');
        return;
    }
    onTranscriptComplete(transcript);
  };

  if (notSupported) {
    return (
        <Card className="p-6 text-center text-muted-foreground">
            Browser does not support Speech Recognition. Please use Chrome or Safari.
        </Card>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <div className="relative w-full h-32 bg-secondary/30 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 shadow-inner">
        {isRecording ? (
            <WaveformVisualizer isRecording={true} className="h-16" />
        ) : (
            <div className="text-muted-foreground text-sm">Tap mic to start</div>
        )}
      </div>

      <div className="w-full min-h-[100px] p-4 bg-background/50 backdrop-blur-md rounded-xl border border-white/10 text-lg font-medium text-center">
        {transcript || <span className="text-muted-foreground/50">Your speech will appear here...</span>}
      </div>

      <div className="flex gap-4">
         <Button
            variant={isRecording ? "destructive" : "primary"}
            size="lg"
            className="rounded-full w-16 h-16 p-0 shadow-xl ring-4 ring-background"
            onClick={handleToggle}
         >
            {isRecording ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-8 h-8" />}
         </Button>
      </div>

      { transcript.length > 0 && !isRecording && (
        <div className="flex gap-2 animate-in fade-in slide-in-from-bottom-4">
             <Button variant="secondary" onClick={resetTranscript} className="gap-2">
                <RotateCcw className="w-4 h-4" /> Try Again
             </Button>
             <Button onClick={handleFinish} className="gap-2 bg-gradient-to-r from-primary to-orange-500 text-white border-0">
                <MessageSquarePlus className="w-4 h-4" /> Analyze
             </Button>
        </div>
      )}
    </div>
  );
}
