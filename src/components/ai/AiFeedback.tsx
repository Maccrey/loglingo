import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CorrectionResult, CorrectionIssue } from "@/domain/ai-correction";
import { cn } from "@/lib/utils";
import { ChevronDown, Info, Sparkles, Wand2, Volume2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { useDiaryTts } from "@/application/diary/useDiaryTts";
import { DuckMascot } from "@/components/mascot/DuckMascot";

interface Props {
  result: CorrectionResult;
  onApply?: (text: string) => void;
  applying?: boolean;
  isTrialMode?: boolean;
  applyLabel?: string;
  learningLanguage?: string;
}

function IssueItem({ issue }: { issue: CorrectionIssue }) {
  const t = useTranslations("ai");
  const [showExamples, setShowExamples] = useState(false);
  const hasExamples = issue.exampleSentences && issue.exampleSentences.length > 0;

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <p className="text-xs uppercase text-primary mb-1">{t(`type_${issue.type}`)}</p>
      <p className="text-sm text-foreground">
        <span className="text-muted-foreground">Original:</span> {issue.original}
      </p>
      <p className="text-sm text-foreground">
        <span className="text-muted-foreground">Suggestion:</span>{" "}
        <span dangerouslySetInnerHTML={{ __html: issue.suggestion }} />
      </p>
      <p 
        className="text-xs text-muted-foreground mt-1"
        dangerouslySetInnerHTML={{ __html: issue.explanation }} 
      />
      
      {hasExamples && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowExamples(!showExamples)}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronDown 
              className={cn(
                "h-3 w-3 transition-transform",
                showExamples && "rotate-180"
              )} 
            />
            <span>
              {showExamples 
                ? t("hide_examples") 
                : t("show_examples", { count: issue.exampleSentences!.length })
              }
            </span>
          </button>
          
          {showExamples && (
            <div className="mt-2 space-y-2 pl-4 border-l-2 border-primary/30">
              {issue.exampleSentences!.map((example, idx) => (
                <div key={idx} className="space-y-0.5">
                  <p className="text-xs text-foreground/80">
                    • {example}
                  </p>
                  {issue.exampleTranslations?.[idx] && (
                    <p className="text-xs text-muted-foreground/60 pl-2">
                      {issue.exampleTranslations[idx]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AiFeedback({ result, onApply, applying, isTrialMode, applyLabel, learningLanguage }: Props) {
  const t = useTranslations("ai");
  const ttsId = useRef(`feedback_${Date.now()}`);
  const { generateAndPlayAudio, isGenerating, audioUrl } = useDiaryTts(ttsId.current);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  }, [audioUrl]);

  const handleTts = () => {
    if (!result.emotionalComment) return;
    generateAndPlayAudio(ttsId.current, result.emotionalComment, learningLanguage);
  };

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="flex flex-col space-y-4 pb-4">
        {result.emotionalComment && (
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
            <DuckMascot mode="teacher" width={70} height={70} enableEgg={false} className="shrink-0 drop-shadow-md" />
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <p className="text-sm md:text-base font-medium text-white/90 leading-relaxed">
                {result.emotionalComment}
              </p>
              <button
                onClick={handleTts}
                disabled={isGenerating}
                className="inline-flex items-center text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                title={t("listen") || "Listen"}
              >
                {isGenerating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Volume2 className="w-4 h-4 mr-1" />}
                {t("listen") || "Listen"}
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>{t("result_title")}</CardTitle>
          </div>
        <div className="flex gap-2">
          {onApply && (
            <button
              className={cn(
                "inline-flex items-center rounded-lg bg-gradient-to-r from-primary to-accent px-3 py-1.5 text-xs font-medium text-primary-foreground shadow transition hover:opacity-90",
                applying && "opacity-70",
                isTrialMode && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => onApply(result.corrected)}
              disabled={applying || isTrialMode}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {applying ? t("applying") : (applyLabel || t("apply"))}
            </button>
          )}
        </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <audio ref={audioRef} src={audioUrl || ""} className="hidden" />
        <div 
          className="rounded-lg border border-primary/30 bg-black/20 p-3 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: result.corrected }}
        />

        {result.rootMeaningGuide && (
          <div className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-muted-foreground">
            <Info className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">{t("root_meaning")}</p>
              <p dangerouslySetInnerHTML={{ __html: result.rootMeaningGuide }} />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">{t("issues")}</p>
          {result.issues?.length ? (
            <div className="grid gap-2 md:grid-cols-2">
              {result.issues.map((issue, idx) => (
                <IssueItem key={idx} issue={issue} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">{t("no_issues")}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
