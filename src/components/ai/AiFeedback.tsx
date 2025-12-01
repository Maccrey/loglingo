import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CorrectionResult, CorrectionIssue } from "@/domain/ai-correction";
import { cn } from "@/lib/utils";
import { Info, Sparkles, Wand2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  result: CorrectionResult;
  onApply?: (text: string) => void;
  applying?: boolean;
}

function IssueItem({ issue }: { issue: CorrectionIssue }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <p className="text-xs uppercase text-primary mb-1">{issue.type}</p>
      <p className="text-sm text-foreground">
        <span className="text-muted-foreground">Original:</span> {issue.original}
      </p>
      <p className="text-sm text-foreground">
        <span className="text-muted-foreground">Suggestion:</span> {issue.suggestion}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{issue.explanation}</p>
    </div>
  );
}

export function AiFeedback({ result, onApply, applying }: Props) {
  const t = useTranslations("ai");

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>{t("result_title")}</CardTitle>
        </div>
        {onApply && (
          <button
            className={cn(
              "inline-flex items-center rounded-lg bg-gradient-to-r from-primary to-accent px-3 py-1.5 text-xs font-medium text-primary-foreground shadow transition hover:opacity-90",
              applying && "opacity-70"
            )}
            onClick={() => onApply(result.corrected)}
            disabled={applying}
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {applying ? t("applying") : t("apply")}
          </button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-primary/30 bg-black/20 p-3 text-sm leading-relaxed">
          {result.corrected}
        </div>

        {result.rootMeaningGuide && (
          <div className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-muted-foreground">
            <Info className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">{t("root_meaning")}</p>
              <p>{result.rootMeaningGuide}</p>
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
