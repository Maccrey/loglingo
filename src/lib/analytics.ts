export type AnalyticsEvent =
  | "ai_correct_clicked"
  | "ai_correct_success"
  | "ai_correct_failure"
  | "quiz_started"
  | "quiz_answered"
  | "level_recorded";

export function trackEvent(
  event: AnalyticsEvent,
  payload?: Record<string, unknown>
) {
  // Fire-and-forget to Firebase Analytics if available
  if (typeof window !== "undefined") {
    import("./firebase-analytics")
      .then((mod) => mod.logAnalyticsEvent(event, payload))
      .catch(() => {});
  }

  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, payload);
  }
}
