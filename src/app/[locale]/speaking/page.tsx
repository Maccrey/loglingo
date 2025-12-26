'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { SpeakingRecorder } from '@/presentation/components/speaking/SpeakingRecorder';
import { SpeakingResult } from '@/presentation/components/speaking/SpeakingResult';
import { useSpeaking } from '@/application/speaking/useSpeaking';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Mic } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/application/auth/AuthProvider';

export default function SpeakingPage() {
  const t = useTranslations('Speaking'); // Ensure keys exist or use fallback
  const { user } = useAuth(); // for language preference if needed
  
  // Default target language from user profile or settings
  // Ideally this comes from user.learningLanguage
  const learningLanguage = (user as any)?.learningLanguage || 'en';

  const {
    step,
    transcript,
    feedback,
    error,
    startSession,
    submitForAnalysis,
    retry,
  } = useSpeaking();

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8 max-w-2xl">
        <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition">
           <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-400">
          Speaking Practice
        </h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl flex-1 flex flex-col items-center justify-center min-h-[400px]">
        
        {step === 'idle' && (
           <Card className="p-10 flex flex-col items-center justify-center gap-6 text-center bg-black/20 backdrop-blur border-white/10">
              <div className="p-6 rounded-full bg-primary/20 border border-primary/30">
                 <Mic className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-2">
                 <h2 className="text-xl font-semibold">Ready to Speak?</h2>
                 <p className="text-muted-foreground">Practice your sentences in {learningLanguage.toUpperCase()}.</p>
              </div>
              <Button onClick={startSession} size="lg" className="rounded-full px-8 text-lg h-12">
                 Start Recording
              </Button>
           </Card>
        )}

        {step === 'recording' && (
           <SpeakingRecorder 
              language={learningLanguage === 'en' ? 'en-US' : (learningLanguage === 'ko' ? 'ko-KR' : 'en-US')} // Simple mapping for MVP
              onTranscriptComplete={(text) => submitForAnalysis(text, learningLanguage)}
           />
        )}

        {step === 'analyzing' && (
            <div className="flex flex-col items-center gap-4 animate-pulse">
                <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <p className="text-lg font-medium text-muted-foreground">Analyzing your speech...</p>
            </div>
        )}

        {step === 'feedback' && feedback && (
            <SpeakingResult 
                feedback={feedback}
                onRetry={retry}
            />
        )}

        {step === 'error' && (
            <Card className="p-6 border-red-500/30 bg-red-950/20 text-center space-y-4">
                <h3 className="text-lg font-bold text-red-200">Something went wrong</h3>
                <p className="text-red-200/70">{error}</p>
                <Button onClick={retry} variant="secondary">Try Again</Button>
            </Card>
        )}

      </div>
    </div>
  );
}
