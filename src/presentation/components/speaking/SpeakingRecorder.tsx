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
    <div className="flex flex-col items-center gap-12 w-full max-w-3xl mx-auto">
      <div className="relative w-full h-40 md:h-64 bg-secondary/30 rounded-3xl flex items-center justify-center overflow-hidden border border-white/10 shadow-inner">
        {isRecording ? (
            <WaveformVisualizer isRecording={true} className="h-32 gap-3" />
        ) : (
            <div className="text-muted-foreground text-xl">{t('recorder_tap_mic')}</div>
        )}
      </div>

      <div className="w-full min-h-[120px] md:min-h-[200px] p-6 md:p-8 bg-background/50 backdrop-blur-md rounded-2xl border border-white/10 text-xl md:text-2xl font-medium text-center flex items-center justify-center leading-relaxed">
        {transcript || <span className="text-muted-foreground/50">{t('recorder_placeholder')}</span>}
      </div>

      <div className="flex gap-4 z-10">
         <Button
            variant={isRecording ? "destructive" : "primary"}
            size="lg"
            className="rounded-full w-20 h-20 p-0 shadow-2xl ring-4 ring-background transition-transform hover:scale-105 active:scale-95"
            onClick={handleToggle}
         >
            {isRecording ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-10 h-10" />}
         </Button>
      </div>

      { transcript.length > 0 && !isRecording && (
        <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 mt-2">
             <Button variant="secondary" size="lg" onClick={resetTranscript} className="gap-2 px-6 min-w-[140px]">
                <RotateCcw className="w-5 h-5" /> {t('recorder_try_again')}
             </Button>
             <Button size="lg" onClick={handleFinish} className="gap-2 px-8 bg-gradient-to-r from-primary to-orange-500 text-white border-0 shadow-lg hover:shadow-primary/25">
                <MessageSquarePlus className="w-5 h-5" /> {t('recorder_analyze')}
             </Button>
        </div>
      )}
    </div>
  );
}

