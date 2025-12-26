'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { SpeakingFeedback } from '@/domain/speaking';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Check, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpeakingResultProps {
  feedback: SpeakingFeedback;
  onRetry: () => void;
  className?: string;
}

export function SpeakingResult({ feedback, onRetry, className }: SpeakingResultProps) {
  // const t = useTranslations('Speaking'); // Assuming keys exist, fallback to English logic if not

  return (
    <div className={cn("space-y-6 w-full max-w-2xl mx-auto animate-in slide-in-from-bottom-5 fade-in duration-500", className)}>
      
      {/* 1. Comparison Card */}
      <Card className="border-white/10 bg-black/20 backdrop-blur-md overflow-hidden">
        <CardHeader className="bg-white/5 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground uppercase tracking-wider font-bold">You said</div>
            <div className="p-4 rounded-xl bg-secondary/30 text-lg leading-relaxed relative group">
                {feedback.original}
                { feedback.original !== feedback.improved && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Badge variant="destructive" className="text-[10px]">Correction needed</Badge>
                    </div>
                )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-emerald-400/80 uppercase tracking-wider font-bold flex items-center gap-2">
                 <Check className="w-4 h-4" /> Better Expression
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-lg leading-relaxed text-emerald-100">
                {feedback.improved}
            </div>
          </div>

        </CardContent>
      </Card>

      {/* 2. Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Grammar Notes */}
        {feedback.grammarNotes.length > 0 && (
            <Card className="border-red-500/20 bg-red-950/10">
                <CardHeader>
                    <CardTitle className="text-base text-red-200 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Grammar Points
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {feedback.grammarNotes.map((note, i) => (
                            <li key={i} className="text-sm text-red-100/80 flex items-start gap-2">
                                <span className="block mt-1.5 w-1 h-1 rounded-full bg-red-400 shrink-0" />
                                {note}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        )}

        {/* Root Meaning / Nuance */}
        {Object.keys(feedback.rootMeaningGuide || {}).length > 0 && (
            <Card className="border-blue-500/20 bg-blue-950/10 md:col-span-2">
                <CardHeader>
                    <CardTitle className="text-base text-blue-200 flex items-center gap-2">
                        <span className="text-xl">🌱</span> Root Meaning & Nuance
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(feedback.rootMeaningGuide).map(([key, value], i) => (
                        <div key={i} className="bg-blue-500/10 p-3 rounded-lg">
                            <div className="font-semibold text-blue-200 mb-1">{key}</div>
                            <div className="text-sm text-blue-100/70 leading-snug">{value}</div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        )}

      </div>

      <div className="flex justify-center pt-8">
        <Button onClick={onRetry} variant="secondary" size="lg" className="rounded-full px-8">
            <RefreshCw className="w-4 h-4 mr-2" /> Try Another Sentence
        </Button>
      </div>

    </div>
  );
}
