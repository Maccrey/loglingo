"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLocale, useTranslations } from "next-intl";
import { useArchiveList, useArchiveMutations, useQuiz } from "@/application/archive/hooks";
import { getCurrentUserId } from "@/lib/current-user";
import { LearningArchive } from "@/domain/archive";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import { formatDate } from "@/lib/intl-format";
import { AuthGate } from "@/components/auth/AuthGate";

export default function ArchivePage() {
  const t = useTranslations("archive");
  const locale = useLocale();
  const userId = getCurrentUserId();
  const [type, setType] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [root, setRoot] = useState("");
  const [example, setExample] = useState("");
  const { data: archives } = useArchiveList(userId, type);
  const archiveList: LearningArchive[] = (archives ?? []) as LearningArchive[];
  const { create } = useArchiveMutations(userId);
  const [selected, setSelected] = useState<LearningArchive | null>(null);
  const quiz = useQuiz(selected || undefined);

  const filteredArchives = useMemo(
    () => (type ? archiveList.filter((a) => a.type === type) : archiveList),
    [archiveList, type]
  );

  const handleAdd = async () => {
    if (!title.trim()) {
      toast.error(t("title_required"));
      return;
    }
    try {
      await create.mutateAsync({
        userId,
        type: (type as "grammar" | "word" | undefined) || "grammar",
        title: title.trim(),
        rootMeaning: root.trim(),
        examples: example ? [example] : [],
      });
      toast.success(t("saved"));
      setTitle("");
      setRoot("");
      setExample("");
    } catch {
      toast.error(t("save_error"));
    }
  };

  return (
    <AuthGate>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
        <div className="flex gap-2">
          <Button variant={type === undefined ? "primary" : "ghost"} onClick={() => setType(undefined)}>
            {t("all")}
          </Button>
          <Button variant={type === "grammar" ? "primary" : "ghost"} onClick={() => setType("grammar")}>
            {t("grammar")}
          </Button>
          <Button variant={type === "word" ? "primary" : "ghost"} onClick={() => setType("word")}>
            {t("vocabulary")}
          </Button>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>{t("add_title")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <Input
            placeholder={t("title_placeholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder={t("root_placeholder")}
            value={root}
            onChange={(e) => setRoot(e.target.value)}
          />
          <Input
            placeholder={t("example_placeholder")}
            value={example}
            onChange={(e) => setExample(e.target.value)}
          />
          <Button onClick={handleAdd} disabled={create.isPending}>
            {create.isPending ? t("saving") : t("add_button")}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t("list_title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredArchives.length === 0 && (
              <p className="text-muted-foreground">{t("empty")}</p>
            )}
            {filteredArchives.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-white/10 bg-white/5 p-3 hover:border-primary/40 transition cursor-pointer"
                onClick={() => {
                  setSelected(item);
                  trackEvent("quiz_started", { archiveId: item.id, type: item.type });
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <span className="text-xs text-muted-foreground">
                    {item.type === "word" ? t("vocabulary") : t("grammar")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{item.rootMeaning}</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {formatDate(item.createdAt, locale)}
                </p>
                {item.examples.length > 0 && (
                  <p className="text-xs text-primary mt-1">{item.examples[0]}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("quiz_title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!selected && <p className="text-muted-foreground text-sm">{t("quiz_empty")}</p>}
            {selected && quiz && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">{quiz.question}</p>
                {quiz.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const correct = idx === quiz.answer;
                      trackEvent("quiz_answered", {
                        archiveId: quiz.archiveId,
                        selected: idx,
                        correct,
                      });
                      toast[correct ? "success" : "error"](
                        correct ? t("quiz_correct") : t("quiz_wrong"),
                        { description: quiz.explanation }
                      );
                    }}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm hover:border-primary/40"
                  >
                    {opt}
                  </button>
                ))}
                <p className="text-xs text-muted-foreground">{quiz.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </AuthGate>
  );
}
