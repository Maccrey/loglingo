'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { SpeakingRecorder } from '@/presentation/components/speaking/SpeakingRecorder';
import { SpeakingResult } from '@/presentation/components/speaking/SpeakingResult';
import { useSpeaking } from '@/application/speaking/useSpeaking';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Mic, Sparkles, AlertCircle, Check, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/application/auth/AuthProvider';
import { useSpeakingChallenge } from '@/application/speaking/useSpeakingChallenge';

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

  // Challenge Mode State
  const [mode, setMode] = React.useState<'free' | 'challenge'>('free');
  
  // Dynamic Import or Logic for Challenge
  // For simplicity, we can just inline the Challenge View or separate it.
  // But let's keep it here for now.
  const {
      step: cStep,
      challengeData,
      userTranscript: cTranscript,
      isSuccess,
      error: cError,
      fetchNewChallenge,
      verifySpeech,
      retryChallenge,
  } = useSpeakingChallenge();

  const handleStartChallenge = () => {
      fetchNewChallenge(learningLanguage, t('localeName') || 'Korean'); // Adjust locale as needed
  };

  return (
    <div className="container mx-auto px-4 py-20 min-h-screen flex flex-col items-center gap-10">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8 max-w-4xl">
        <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition">
           <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-400">
            Speaking Practice
            </h1>
            
            {/* Mode Toggle Tabs */}
            <div className="flex bg-secondary/30 rounded-full p-1 mt-4 border border-white/5">
                <button 
                    onClick={() => setMode('free')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === 'free' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-white'}`}
                >
                    Free Talk
                </button>
                <button 
                    onClick={() => setMode('challenge')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === 'challenge' ? 'bg-indigo-500 text-white shadow-lg' : 'text-muted-foreground hover:text-white'}`}
                >
                    Challenge Mode
                </button>
            </div>
        </div>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center min-h-[600px]">
        
        {/* === FREE TALK MODE === */}
        {mode === 'free' && (
            <>
                {step === 'idle' && (
                <Card className="p-20 flex flex-col items-center justify-center gap-10 text-center bg-black/20 backdrop-blur border-white/10 w-full shadow-2xl animate-in fade-in zoom-in-95 duration-500">
                    <div className="p-10 rounded-full bg-primary/20 border border-primary/30 transition-transform hover:scale-110 duration-300">
                        <Mic className="w-20 h-20 text-primary" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight">Ready to Speak?</h2>
                        <p className="text-xl text-muted-foreground">Practice your sentences in {learningLanguage.toUpperCase()}.</p>
                    </div>
                    <Button onClick={startSession} size="lg" className="rounded-full px-12 py-8 text-2xl h-auto shadow-[0_0_30px_-5px_var(--primary)] hover:shadow-[0_0_50px_-10px_var(--primary)] transition-all">
                        Start Recording
                    </Button>
                </Card>
                )}

                {step === 'recording' && (
                <SpeakingRecorder 
                    language={learningLanguage === 'en' ? 'en-US' : (learningLanguage === 'ko' ? 'ko-KR' : 'en-US')} 
                    onTranscriptComplete={(text) => submitForAnalysis(text, learningLanguage)}
                />
                )}

                {step === 'analyzing' && (
                    <div className="flex flex-col items-center gap-6 animate-pulse p-10">
                        <div className="w-24 h-24 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                        <p className="text-xl font-medium text-muted-foreground">Analyzing your speech...</p>
                    </div>
                )}

                {step === 'feedback' && feedback && (
                    <SpeakingResult 
                        feedback={feedback}
                        onRetry={retry}
                    />
                )}

                {step === 'error' && (
                    <Card className="p-8 border-red-500/30 bg-red-950/20 text-center space-y-6 max-w-md">
                        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
                        <div className="space-y-2">
                             <h3 className="text-xl font-bold text-red-200">Analysis Failed</h3>
                             <p className="text-red-200/70">{error}</p>
                        </div>
                        <Button onClick={retry} variant="secondary" className="w-full">Try Again</Button>
                    </Card>
                )}
            </>
        )}


        {/* === CHALLENGE MODE === */}
        {mode === 'challenge' && (
            <>
                {cStep === 'idle' && (
                <Card className="p-20 flex flex-col items-center justify-center gap-10 text-center bg-indigo-950/20 backdrop-blur border-indigo-500/20 w-full shadow-2xl animate-in fade-in zoom-in-95 duration-500">
                    <div className="p-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 transition-transform hover:scale-110 duration-300">
                        <Sparkles className="w-20 h-20 text-indigo-400" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight text-indigo-100">Weak Point Challenge</h2>
                        <p className="text-xl text-indigo-200/60 max-w-lg mx-auto">
                            We'll pick a word you struggled with and generate a practice sentence.
                        </p>
                    </div>
                    <Button onClick={handleStartChallenge} size="lg" className="rounded-full px-12 py-8 text-2xl h-auto bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_30px_-5px_var(--indigo-500)] transition-all text-white border-0">
                        Start Challenge
                    </Button>
                </Card>
                )}

                {cStep === 'loading' && (
                    <div className="flex flex-col items-center gap-6 animate-pulse p-10">
                        <div className="w-24 h-24 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                        <p className="text-xl font-medium text-indigo-200">Preparing your challenge...</p>
                        <p className="text-sm text-indigo-200/50">Retrieving weak points & AI generating sentence...</p>
                    </div>
                )}
                
                {cStep === 'error' && (
                     <Card className="p-8 border-red-500/30 bg-red-950/20 text-center space-y-6 max-w-md">
                        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
                        <div className="space-y-2">
                             <h3 className="text-xl font-bold text-red-200">Oops!</h3>
                             <p className="text-red-200/70">{cError}</p>
                        </div>
                        <Button onClick={() => setMode('free')} variant="secondary" className="w-full">Back to Free Talk</Button>
                    </Card>
                )}

                {(cStep === 'ready' || cStep === 'recording' || cStep === 'verifying') && challengeData && (
                    <div className="w-full max-w-3xl space-y-8 animate-in slide-in-from-bottom-5 fade-in">
                        {/* Question Card */}
                        <Card className="p-8 border-indigo-500/30 bg-indigo-950/30">
                            <div className="flex flex-col gap-4 text-center">
                                <div className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Target Sentence</div>
                                <div className="text-3xl font-medium text-white leading-relaxed">
                                    {challengeData.sentence}
                                </div>
                                <div className="text-lg text-indigo-200/70">
                                    {challengeData.meaning}
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-left">
                                    <div className="bg-black/20 p-3 rounded-lg">
                                        <span className="text-xs text-indigo-400 block mb-1">Focus Item</span>
                                        <span className="font-bold text-indigo-100">{challengeData.archiveItem.title}</span>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded-lg">
                                        <span className="text-xs text-indigo-400 block mb-1">Tip</span>
                                        <span className="text-sm text-indigo-200/80">{challengeData.pronunciationTips || "Speak clearly and confidently."}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Recorder */}
                        {cStep !== 'verifying' && (
                            <SpeakingRecorder 
                                language={learningLanguage === 'en' ? 'en-US' : (learningLanguage === 'ko' ? 'ko-KR' : 'en-US')}
                                onTranscriptComplete={(text) => verifySpeech(text)}
                            />
                        )}
                        {cStep === 'verifying' && (
                             <div className="flex flex-col items-center gap-4 py-10">
                                <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                                <p className="text-lg text-indigo-200">Verifying pronunciation...</p>
                            </div>
                        )}
                    </div>
                )}

                {cStep === 'result' && challengeData && (
                     <Card className={`p-10 w-full max-w-2xl text-center space-y-8 border-2 ${isSuccess ? 'border-emerald-500/50 bg-emerald-950/30' : 'border-orange-500/50 bg-orange-950/30'}`}>
                         <div className="flex justify-center">
                             {isSuccess ? (
                                <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center border-2 border-emerald-500 mb-4">
                                     <Check className="w-12 h-12 text-emerald-400" />
                                </div>
                             ) : (
                                <div className="w-24 h-24 rounded-full bg-orange-500/20 flex items-center justify-center border-2 border-orange-500 mb-4">
                                     <RefreshCw className="w-12 h-12 text-orange-400" />
                                </div>
                             )}
                         </div>
                         
                         <div className="space-y-2">
                             <h2 className={`text-3xl font-bold ${isSuccess ? 'text-emerald-100' : 'text-orange-100'}`}>
                                 {isSuccess ? 'Excellent!' : 'Keep Trying!'}
                             </h2>
                             <p className={`${isSuccess ? 'text-emerald-200/70' : 'text-orange-200/70'} text-lg`}>
                                 {isSuccess ? "You nailed the pronunciation and sentence structure." : "Let's try to match the target sentence more closely."}
                             </p>
                         </div>

                         <div className="bg-black/30 p-6 rounded-xl text-left space-y-4">
                             <div>
                                 <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Target</div>
                                 <div className="text-xl text-white">{challengeData.sentence}</div>
                             </div>
                             <div>
                                 <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">You Said</div>
                                  <div className={`text-xl ${isSuccess ? 'text-emerald-300' : 'text-orange-300'}`}>{cTranscript}</div>
                             </div>
                         </div>
 
                         <div className="flex gap-4 justify-center">
                             {!isSuccess && (
                                 <Button onClick={retryChallenge} variant="secondary" size="lg" className="border-orange-500/50 text-orange-200 hover:bg-orange-500/10">
                                     Try Again
                                 </Button>
                             )}
                             <Button onClick={handleStartChallenge} size="lg" className={`${isSuccess ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-orange-600 hover:bg-orange-500'} text-white border-0 min-w-[200px]`}>
                                 Next Challenge
                             </Button>
                         </div>
                     </Card>
                )}

            </>
        )}

      </div>
    </div>
  );
}
