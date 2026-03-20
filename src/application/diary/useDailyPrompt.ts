"use client";

import { useState, useEffect } from "react";
import { useLearningLanguage } from "@/application/i18n/LearningLanguageProvider";
import { DAILY_PROMPTS } from "@/constants/dailyPrompts";

// 오늘(연중 몇 번째 날인지)를 기반으로 일관된 질문 인덱스를 계산한다.
function getDayIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime() + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// 학습어(learningLanguage) 로케일의 메시지 JSON을 동적으로 로드해서
// 해당 언어로 오늘의 질문을 반환한다.
export function useDailyPrompt(): string {
  const { learningLanguage } = useLearningLanguage();
  const [promptText, setPromptText] = useState<string>("");

  useEffect(() => {
    const promptKey = DAILY_PROMPTS[getDayIndex() % DAILY_PROMPTS.length];
    // "prompts.question_X" → "question_X"
    const translationKey = promptKey.split(".")[1];

    import(`@/../messages/${learningLanguage}.json`)
      .then((msgModule) => {
        const messages = msgModule.default ?? msgModule;
        const text = (messages?.prompts as Record<string, string>)?.[translationKey];
        setPromptText(text ?? "");
      })
      .catch(() => {
        // 로케일 파일 로드 실패 시 영어 폴백
        import(`@/../messages/en.json`)
          .then((msgModule) => {
            const messages = msgModule.default ?? msgModule;
            const text = (messages?.prompts as Record<string, string>)?.[translationKey];
            setPromptText(text ?? "");
          })
          .catch(() => setPromptText(""));
      });
  }, [learningLanguage]);

  return promptText;
}
