import { useTranslations } from "next-intl";
import { DAILY_PROMPTS } from "@/constants/dailyPrompts";

export function useDailyPrompt() {
  const t = useTranslations("prompts");

  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime() + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const promptKey = DAILY_PROMPTS[dayOfYear % DAILY_PROMPTS.length];
  // extract the "question_X" part from "prompts.question_X"
  const translationKey = promptKey.split(".")[1];

  return t(translationKey);
}
