import { CorrectionMode, CorrectionResult } from "@/domain/ai-correction";

export async function requestAiCorrection(params: {
  content: string;
  mode?: CorrectionMode;
  signal?: AbortSignal;
  locale?: string; // UI language
  learningLanguage?: string; // deprecated: target language for AI output
  targetLanguage?: string; // preferred target language for AI output
}): Promise<CorrectionResult> {
  const controller = new AbortController();
  // Align with server timeout; give the model enough time before aborting.
  const timeout = setTimeout(
    () => controller.abort(new DOMException("AI request timed out", "TimeoutError")),
    30000
  );
  const body = JSON.stringify({
    content: params.content,
    mode: params.mode || "full",
    locale: params.locale,
    learningLanguage: params.learningLanguage,
    targetLanguage: params.targetLanguage ?? params.learningLanguage ?? params.locale,
  });

  try {
    const response = await fetch("/api/ai/correct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      signal: params.signal ?? controller.signal,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || "AI request failed");
    }

    return (await response.json()) as CorrectionResult;
  } finally {
    clearTimeout(timeout);
  }
}
