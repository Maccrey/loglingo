'use client';

import React from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { Button } from '@/components/ui/Button';
import { WaveformVisualizer } from './WaveformVisualizer';
import { Mic, Square, RotateCcw, MessageSquarePlus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface SpeakingRecorderProps {
  language: string;
  onTranscriptComplete: (transcript: string) => void;
  continuous?: boolean;
  interimResults?: boolean;
}

export function SpeakingRecorder({ language, onTranscriptComplete, continuous = true, interimResults = true }: SpeakingRecorderProps) {
  const t = useTranslations('Speaking');

  const handleError = React.useCallback((err: any) => {
    if (err === 'not-allowed') {
        toast.error('Microphone permission denied.');
    } else {
        toast.error('Speech recognition error: ' + err);
    }
  }, []);

  const {
    transcript,
    isRecording,
    startRecording,
    stopRecording,
    resetTranscript,
    notSupported,
  } = useSpeechRecognition({
    language,
    onError: handleError,
    continuous,
    interimResults
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
    <div className="flex flex-col items-center gap-4 w-full max-w-3xl mx-auto">
      <div className="relative w-full h-48 bg-card/40 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center overflow-hidden border border-border/50 shadow-inner gap-4">
        {isRecording && (
           <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
              <WaveformVisualizer isRecording={true} className="h-full w-full gap-2" />
           </div>
        )}
        
        {!isRecording && (
            <div className="text-muted-foreground text-sm font-medium animate-pulse">{t('recorder_tap_mic')}</div>
        )}

        <div className="z-10">
            <Button
                variant={isRecording ? "destructive" : "primary"}
                size="lg"
                className={`rounded-full w-16 h-16 p-0 shadow-xl transition-all hover:scale-105 active:scale-95 ${isRecording ? 'animate-pulse ring-4 ring-destructive/20' : 'hover:shadow-primary/25'}`}
                onClick={handleToggle}
            >
                {isRecording ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-8 h-8" />}
            </Button>
        </div>
      </div>

      <div className="w-full min-h-[80px] p-4 bg-background/50 backdrop-blur-md rounded-xl border border-white/10 text-lg font-medium text-center flex items-center justify-center leading-relaxed">
        {transcript || <span className="text-muted-foreground/50 text-base">{t('recorder_placeholder')}</span>}
      </div>

      { transcript.length > 0 && !isRecording && (
        <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 mt-2 w-full max-w-sm mx-auto p-4 md:p-0">
             <Button variant="secondary" size="lg" onClick={resetTranscript} className="gap-2 flex-1">
                <RotateCcw className="w-5 h-5" /> {t('recorder_try_again')}
             </Button>
             <Button size="lg" onClick={handleFinish} className="gap-2 flex-1 bg-gradient-to-r from-primary to-orange-500 text-white border-0 shadow-lg hover:shadow-primary/25">
                <MessageSquarePlus className="w-5 h-5" /> {t('recorder_analyze')}
             </Button>
        </div>
      )}
    </div>
  );
}

