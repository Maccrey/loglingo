export type AnalyticsEvent =
  | "ai_correct_clicked"
  | "ai_correct_success"
  | "ai_correct_failure"
  | "quiz_started"
  | "quiz_answered";

export function trackEvent(
  event: AnalyticsEvent,
  payload?: Record<string, unknown>
) {
  // Placeholder: replace with real analytics provider
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, payload);
  }
}
