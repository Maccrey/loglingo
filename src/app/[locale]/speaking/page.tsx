'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { SpeakingRecorder } from '@/presentation/components/speaking/SpeakingRecorder';
import { SpeakingResult } from '@/presentation/components/speaking/SpeakingResult';
import { useSpeaking } from '@/application/speaking/useSpeaking';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Mic, Sparkles, AlertCircle, Check, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/application/auth/AuthProvider';
import { useSpeakingChallenge } from '@/application/speaking/useSpeakingChallenge';
import { AuthGate } from '@/components/auth/AuthGate';
import { getDailySessionCount } from '@/infrastructure/firebase/speaking-repository';
import { DailyLimitModal } from '@/presentation/components/speaking/DailyLimitModal';

import { useLearningLanguage } from '@/application/i18n/LearningLanguageProvider';
import { ResponsiveAd } from '@/components/ads/ResponsiveAd';
import { trackEvent } from '@/lib/analytics';

const LANGUAGE_MAP: Record<string, string> = {
  ko: 'ko-KR',
  en: 'en-US',
  ja: 'ja-JP',
  zh: 'zh-CN',
  th: 'th-TH',
  vi: 'vi-VN',
  id: 'id-ID',
  es: 'es-ES',
  pt: 'pt-BR',
  fr: 'fr-FR',
  de: 'de-DE',
  tr: 'tr-TR',
  ar: 'ar-SA',
  hi: 'hi-IN',
  ru: 'ru-RU',
};

export default function SpeakingPage() {
  const t = useTranslations('Speaking'); // Ensure keys exist or use fallback
  const { user } = useAuth(); // for language preference if needed
  const { learningLanguage } = useLearningLanguage();
  const locale = useLocale();
  
  // Default target language from user profile or settings
  const speechLang = LANGUAGE_MAP[learningLanguage] || 'en-US';

  // Get localized language name (e.g., "Korean" instead of "KO")
  const targetLanguageName = React.useMemo(() => {
    try {
        return new Intl.DisplayNames([locale], { type: 'language' }).of(learningLanguage) || learningLanguage.toUpperCase();
    } catch (e) {
        return learningLanguage.toUpperCase();
    }
  }, [learningLanguage, locale]);

  const {
    step,
    transcript,
    feedback,
    error,
    startSession,
    submitForAnalysis,
    retry,
    prompt,
    isPromptLoading,
    fetchPrompt
  } = useSpeaking();

  // Challenge Mode State
  const [mode, setMode] = React.useState<'free' | 'challenge'>('challenge');
  const [isPlaying, setIsPlaying] = React.useState(false);
  
  // Get UI Language Name for AI Explanations
  const uiLanguageName = React.useMemo(() => {
    try {
        return new Intl.DisplayNames([locale], { type: 'language' }).of(locale) || 'English';
    } catch {
        return 'English';
    }
  }, [locale]);

  // Daily Limit Logic
  const [sessionCount, setSessionCount] = React.useState<number>(0);
  const [showLimitModal, setShowLimitModal] = React.useState(false);

  React.useEffect(() => {
    if (user) {
        getDailySessionCount(user.uid).then(setSessionCount);
    }
  }, [user]);

  // User level will be deduced properties by the prompt generator
  const userLevel = undefined; 

  // Fetch prompt when entering free mode
  React.useEffect(() => {
      if (mode === 'free' && !prompt && !isPromptLoading) {
          fetchPrompt(learningLanguage, uiLanguageName);
      }
  }, [mode, learningLanguage, uiLanguageName, fetchPrompt, prompt, isPromptLoading]);
  
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
      if (sessionCount >= 3) {
          setShowLimitModal(true);
          return;
      }
      trackEvent('challenge_started', { language: learningLanguage });
      fetchNewChallenge(learningLanguage, uiLanguageName); 
  };

  const handleCreateSpeech = (text: string) => {
    if (!window.speechSynthesis) return;
    if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLang;
    utterance.rate = 0.9;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <AuthGate>
      <div className="container mx-auto px-4 py-8 md:py-20 min-h-screen flex flex-col items-center gap-6 md:gap-10">
      
        {/* Header */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between mb-8 max-w-4xl gap-4">
          <Link href="/" className="p-2 hover:bg-accent/10 rounded-full transition self-start md:self-auto text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex flex-col items-center gap-6">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent text-center">
                {t('title')}
              </h1>
              
              {/* Mode Toggle Tabs */}
              <div className="flex bg-secondary/50 p-1 rounded-full border border-border/50">
                  <button 
                      onClick={() => {
                          trackEvent('speaking_mode_switched', { mode: 'free' });
                          setMode('free');
                      }}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${mode === 'free' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-background/50'}`}
                  >
                      {t('mode_free')}
                  </button>
                  <button 
                      onClick={() => {
                          trackEvent('speaking_mode_switched', { mode: 'challenge' });
                          setMode('challenge');
                      }}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${mode === 'challenge' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-background/50'}`}
                  >
                      {t('mode_challenge')}
                  </button>
              </div>
          </div>
          <div className="w-10 hidden md:block"></div> {/* Spacer */}
        </div>

        {/* Main Content */}
        <div className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center min-h-[500px]">
          
          {/* === FREE TALK MODE === */}
          {mode === 'free' && (
              <>
                  {(step === 'idle' || step === 'recording') && (
                      <div className="w-full max-w-3xl space-y-8 animate-in slide-in-from-bottom-5 fade-in">
                          {/* AI Prompt Card */}
                          <Card className="border-primary/10 bg-primary/5 backdrop-blur-sm shadow-xl">
                              <div className="p-6 md:p-8 flex flex-col gap-4 text-center">
                                  <div className="text-xs font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-2 mb-2">
                                      <Sparkles className="w-4 h-4" />
                                      {t('ai_prompt_label', { defaultMessage: "Topic Suggestion" })}
                                  </div>
                                  <div className="text-lg md:text-xl font-medium text-foreground leading-relaxed">
                                      {prompt ? prompt.text : <span className="animate-pulse text-muted-foreground">Generating topic...</span>}
                                  </div>
                                  {prompt && (
                                     <div className="text-muted-foreground text-sm mt-2">
                                         {prompt.translation}
                                     </div>
                                  )}
                                  {!prompt && (
                                      <div className="text-muted-foreground/50 text-xs mt-4">
                                          {t('analyzing_diary', { defaultMessage: "Analyzing your diary..." })}
                                      </div>
                                  )}
                              </div>
                          </Card>

                          <SpeakingRecorder 
                              language={speechLang} 
                              onTranscriptComplete={(text) => {
                                  trackEvent('speaking_completed', { language: speechLang });
                                  submitForAnalysis(text, learningLanguage, uiLanguageName);
                              }}
                              continuous={true} // Enable continuous multi-sentence recording
                              interimResults={true}
                          // but we sync with parent if needed. 
                              // For now, parent 'step' tracks analysis phase.
                          />
                          
                          {sessionCount >= 3 && (
                             <div className="absolute inset-0 z-10 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                                <div className="text-center p-6 space-y-4">
                                     <Sparkles className="w-12 h-12 text-orange-400 mx-auto" />
                                     <h3 className="text-xl font-bold text-white">{t('daily_limit_reached', { defaultMessage: "Daily Limit Reached" })}</h3>
                                     <Button onClick={() => setShowLimitModal(true)}>{t('view_ai_prompt', { defaultMessage: "View AI Practice Prompt" })}</Button>
                                </div>
                             </div>
                          )}
                      </div>
                  )}

                  {step === 'analyzing' && (
                      <div className="flex flex-col items-center gap-6 animate-pulse p-10">
                          <div className="w-24 h-24 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                          <p className="text-xl font-medium text-muted-foreground">{t('analyzing')}</p>
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
                              <h3 className="text-xl font-bold text-red-200">{t('analysis_failed')}</h3>
                              <p className="text-red-200/70">{error}</p>
                          </div>
                          <Button onClick={retry} variant="secondary" className="w-full">{t('try_again')}</Button>
                      </Card>
                  )}
              </>
          )}


          {/* === CHALLENGE MODE === */}
          {mode === 'challenge' && (
              <>
                  <Card className="p-8 md:p-12 flex flex-col items-center justify-center gap-6 text-center bg-card/50 backdrop-blur border-border/50 w-full max-w-2xl shadow-xl animate-in fade-in zoom-in-95 duration-500">
                      <div className="p-6 rounded-full bg-primary/10 border border-primary/20 transition-transform hover:scale-110 duration-300">
                          <Sparkles className="w-12 h-12 text-primary" />
                      </div>
                      <div className="space-y-3 mb-6">
                          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{t('challenge_title')}</h2>
                          <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                              {t('challenge_desc')}
                          </p>
                      </div>
                      <Button 
                          onClick={handleStartChallenge} 
                          size="lg" 
                          className="rounded-full w-full md:w-auto px-10 py-6 text-lg h-auto shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105"
                      >
                          {t('start_challenge')}
                      </Button>
                  </Card>

                  {cStep === 'loading' && (
                      <div className="flex flex-col items-center gap-6 animate-pulse p-10">
                          <div className="w-24 h-24 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                          <p className="text-xl font-medium text-indigo-200">{t('preparing')}</p>
                          <p className="text-sm text-indigo-200/50">{t('preparing_desc')}</p>
                      </div>
                  )}
                  
                  {cStep === 'error' && (
                       <Card className="p-8 border-red-500/30 bg-red-950/20 text-center space-y-6 max-w-md">
                          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
                          <div className="space-y-2">
                               <h3 className="text-xl font-bold text-red-200">{t('oops')}</h3>
                               <p className="text-red-200/70">{cError}</p>
                          </div>
                          <Button onClick={() => setMode('free')} variant="secondary" className="w-full">{t('back_free')}</Button>
                      </Card>
                  )}

                  {(cStep === 'ready' || cStep === 'recording' || cStep === 'verifying') && challengeData && (
                      <div className="w-full max-w-3xl space-y-8 animate-in slide-in-from-bottom-5 fade-in">
                          {/* Question Card */}
                          <Card className="p-6 md:p-8 border-indigo-500/30 bg-indigo-950/30">
                              <div className="flex flex-col gap-4 text-center">
                                  <div className="text-sm font-bold text-indigo-400 uppercase tracking-widest">{t('target_sentence')}</div>
                                  <div className="text-xl font-medium text-white leading-relaxed flex items-center justify-center gap-3">
                                      {challengeData.sentence}
                                      <button 
                                          onClick={() => handleCreateSpeech(challengeData.sentence)}
                                          className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                                          aria-label="Listen"
                                      >
                                          {isPlaying ? (
                                              <div className="w-5 h-5 flex items-center justify-center space-x-1">
                                                  <div className="w-1 h-3 bg-indigo-400 animate-bounce" />
                                                  <div className="w-1 h-3 bg-indigo-400 animate-bounce delay-75" />
                                                  <div className="w-1 h-3 bg-indigo-400 animate-bounce delay-150" />
                                              </div>
                                          ) : (
                                              <span className="text-xl">🔊</span>
                                          )}
                                      </button>
                                  </div>
                                  <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-left">
                                      <div className="bg-black/20 p-3 rounded-lg">
                                          <span className="text-xs text-indigo-400 block mb-1">{t('focus_item')}</span>
                                          <span className="font-bold text-indigo-100">{challengeData.archiveItem.title}</span>
                                      </div>
                                      <div className="bg-black/20 p-3 rounded-lg">
                                          <span className="text-xs text-indigo-400 block mb-1">{t('tip')}</span>
                                          <span className="text-sm text-indigo-200/80">{challengeData.pronunciationTips || "Speak clearly and confidently."}</span>
                                      </div>
                                  </div>
                              </div>
                          </Card>

                          {/* Recorder */}
                          {cStep !== 'verifying' && (
                              <SpeakingRecorder 
                                  language={speechLang}
                                  onTranscriptComplete={(text) => {
                                      trackEvent('challenge_completed', { language: speechLang });
                                      verifySpeech(text);
                                  }}
                                  continuous={false} // Use raw mode (manual continuous)
                                  interimResults={true}
                              />
                          )}
                          {cStep === 'verifying' && (
                               <div className="flex flex-col items-center gap-4 py-10">
                                  <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                                  <p className="text-lg text-indigo-200">{t('verifying')}</p>
                              </div>
                          )}
                      </div>
                  )}

                  {cStep === 'result' && challengeData && (
                       <Card className={`p-6 md:p-10 w-full max-w-2xl text-center space-y-6 md:space-y-8 border-2 ${isSuccess ? 'border-emerald-500/50 bg-emerald-950/30' : 'border-orange-500/50 bg-orange-950/30'}`}>
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
                                   {isSuccess ? t('result_excellent') : t('result_retry')}
                               </h2>
                               <p className={`${isSuccess ? 'text-emerald-200/70' : 'text-orange-200/70'} text-lg`}>
                                   {isSuccess ? t('result_desc_success') : t('result_desc_retry')}
                               </p>
                           </div>

                           <div className="bg-black/30 p-6 rounded-xl text-left space-y-4">
                               <div>
                                   <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{t('target_label')}</div>
                                   <div className="text-xl text-white flex items-center gap-2">
                                       {challengeData.sentence}
                                       <button 
                                          onClick={() => handleCreateSpeech(challengeData.sentence)}
                                          className="text-muted-foreground hover:text-white transition-colors"
                                       >
                                          🔊
                                       </button>
                                   </div>
                               </div>
                               <div>
                                   <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{t('you_said_label')}</div>
                                    <div className={`text-xl ${isSuccess ? 'text-emerald-300' : 'text-orange-300'}`}>{cTranscript}</div>
                               </div>
                           </div>
   
                           <div className="flex gap-4 justify-center">
                               {!isSuccess && (
                                   <Button onClick={retryChallenge} variant="secondary" size="lg" className="border-orange-500/50 text-orange-200 hover:bg-orange-500/10">
                                       {t('try_again')}
                                   </Button>
                               )}
                               <Button onClick={handleStartChallenge} size="lg" className={`${isSuccess ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-orange-600 hover:bg-orange-500'} text-white border-0 min-w-[200px]`}>
                                   {t('next_challenge')}
                               </Button>
                           </div>
                       </Card>
                  )}

              </>
          )}

        </div>



        {/* Responsive Ad (PC 728x90, Mobile 320x50) */}
        <ResponsiveAd
          pcUnit="DAN-Nd90MIXUY74X0JtU"
          mobileUnit="DAN-C3dye34yEineLGgp"
          pcWidth={728}
          pcHeight={90}
          mobileWidth={320}
          mobileHeight={50}
          className="mt-10"
        />

        {user && (
            <DailyLimitModal 
                isOpen={showLimitModal}
                onClose={() => setShowLimitModal(false)}
                userId={user.uid}
                learningLanguage={learningLanguage}
                uiLanguageName={uiLanguageName}
                userLevel={userLevel}
            />
        )}
      </div>
    </AuthGate>
  );
}
// Force UI Update
