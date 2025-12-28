import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Copy, Loader2, X, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { generateSpeakingPracticePrompt } from "@/application/ai/prompt-generator";
import KakaoAdFit from "@/components/ads/KakaoAdFit";

interface DailyLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  learningLanguage: string;
  uiLanguageName: string;
  userLevel?: string;
}

export function DailyLimitModal({
  isOpen,
  onClose,
  userId,
  learningLanguage,
  uiLanguageName,
  userLevel,
}: DailyLimitModalProps) {
  const t = useTranslations('Speaking');
  const [prompt, setPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Remove automatic generation useEffect
  /* 
  useEffect(() => {
    if (isOpen) {
       ... 
    }
  }, ...); 
  */

  const handleCopy = async () => {
    setLoading(true);
    try {
      let textToCopy = prompt;
      
      if (!textToCopy) {
        textToCopy = await generateSpeakingPracticePrompt({
            userId,
            learningLanguage,
            uiLanguageName,
            userLevel,
        });
        setPrompt(textToCopy);
      }

      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy/generate", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 bg-slate-900 border-indigo-500/30 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-full bg-orange-500/20">
                <MessageSquare className="w-6 h-6 text-orange-400" />
             </div>
             <h2 className="text-xl font-bold text-white">{t('daily_limit_reached', { defaultMessage: "Daily Limit Reached" })}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6 text-slate-200">
          <p className="text-base leading-relaxed">
            {t('daily_limit_desc', { defaultMessage: "You've completed your 3 speaking sessions for today. Great dedication!" })}
          </p>
          
          <div className="bg-indigo-950/40 p-4 rounded-xl border border-indigo-500/20">
             <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-2">{t('continue_ai_tutor', { defaultMessage: "Continue with AI Tutor" })}</h3>
             <p className="text-sm text-slate-300 mb-4">
                {t('copy_prompt_desc', { defaultMessage: "Copy this personalized prompt and paste it into ChatGPT, Gemini, or Grok AI to continue practicing with your own learning data." })}
             </p>
             
             <div className="relative">
                <div className="bg-black/30 p-4 rounded-lg text-xs font-mono text-slate-300 h-32 overflow-y-auto border border-white/5 custom-scrollbar flex items-center justify-center">
                    {loading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                    ) : prompt ? (
                        <div className="w-full h-full text-left whitespace-pre-wrap">{prompt}</div>
                    ) : (
                        <span className="text-slate-500 text-center italic">{t('prompt_placeholder', { defaultMessage: "Click copy to generate your personalized prompt..." })}</span>
                    )}
                </div>
                
                <Button 
                    size="sm" 
                    className="absolute top-2 right-2 h-8 text-xs gap-1.5" 
                    onClick={handleCopy}
                    disabled={loading}
                >
                    {loading ? t('generating', { defaultMessage: "Generating..." }) : copied ? t('copied', { defaultMessage: "Copied!" }) : t('copy_prompt', { defaultMessage: "Copy Prompt" })}
                    {!loading && !copied && <Copy className="w-3 h-3" />}
                </Button>
             </div>
          </div>
          
          <Button onClick={onClose} className="w-full bg-slate-800 hover:bg-slate-700 text-white">
            {t('close_come_back', { defaultMessage: "Close & Come Back Tomorrow" })}
          </Button>

          <div className="flex justify-center pt-2">
            <KakaoAdFit 
              unit="DAN-mOOUtFaaLBlenC5p" 
              width={300} 
              height={250} 
              disabled={false}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
