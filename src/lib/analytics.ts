// Google Analytics 4 Event Types
// Schema: English Event Name -> Korean Parameter Values

export type AnalyticsEventAction =
  | "click_button"
  | "view_page"
  | "start_process"
  | "complete_process"
  | "fail_process"
  | "switch_mode"
  | "submit_form";

export interface AnalyticsEventParams {
  component_name: string; // e.g., "Navigation", "SpeakingRecorder" -> "네비게이션", "말하기 녹음기"
  action_detail: string; // e.g., "Start Recording" -> "녹음 시작"
  item_name?: string; // e.g., "Home Link" -> "홈 링크"
  item_id?: string;
  value_korean?: string; // Additional readable context
  error_message?: string;
  [key: string]: string | number | boolean | undefined;
}

// Legacy event support (mapped to new schema internally if needed, or kept for backward compat)
export type LegacyAnalyticsEvent =
  | "page_view"
  | "page_engagement"
  | "login_start"
  | "login_success"
  | "login_failure"
  | "signup_start"
  | "signup_success"
  | "signup_failure"
  | "dictionary_open"
  | "dictionary_search"
  | "dictionary_result"
  | "dictionary_save"
  | "dictionary_save_failure"
  | "ai_correct_clicked"
  | "ai_correct_success"
  | "ai_correct_failure"
  | "quiz_started"
  | "quiz_answered"
  | "level_recorded"
  | "trial_started"
  | "trial_completed"
  | "speaking_started"
  | "speaking_completed"
  | "speaking_mode_switched"
  | "challenge_started"
  | "challenge_completed";

const EVENT_LABELS: Record<LegacyAnalyticsEvent, string> = {
  page_view: "페이지 조회",
  page_engagement: "페이지 체류",
  login_start: "로그인 시도",
  login_success: "로그인 성공",
  login_failure: "로그인 실패",
  signup_start: "가입 시도",
  signup_success: "가입 성공",
  signup_failure: "가입 실패",
  dictionary_open: "AI 사전 열기",
  dictionary_search: "AI 사전 조회",
  dictionary_result: "AI 사전 결과 확인",
  dictionary_save: "AI 사전 저장",
  dictionary_save_failure: "AI 사전 저장 실패",
  ai_correct_clicked: "AI 첨삭 실행",
  ai_correct_success: "AI 첨삭 성공",
  ai_correct_failure: "AI 첨삭 실패",
  quiz_started: "퀴즈 시작",
  quiz_answered: "퀴즈 응답",
  level_recorded: "학습 레벨 기록",
  trial_started: "체험 모드 시작",
  trial_completed: "체험 모드 완료",
  speaking_started: "말하기 연습 시작",
  speaking_completed: "말하기 연습 완료",
  speaking_mode_switched: "말하기 모드 전환",
  challenge_started: "도전 모드 시작",
  challenge_completed: "도전 모드 완료",
};

function pushToGtag(event: string, params: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (!gtag) return;

  gtag("event", event, {
    language: "ko",
    ...params,
  });
}

/**
 * Enhanced Track Event Function
 * Supports both legacy simple events and new detailed events
 */
export function trackEvent(
  event: LegacyAnalyticsEvent | AnalyticsEventAction,
  payload?: Record<string, unknown> | AnalyticsEventParams
) {
  let finalEventName = event;
  const finalPayload: Record<string, unknown> = { ...payload };

  // Handle Legacy Events
  if (event in EVENT_LABELS) {
    // For legacy events, we preserve the old behavior but ensure we have English keys if possible
    // We basically just pass it through but add the readable label
    finalPayload.event_label = EVENT_LABELS[event as LegacyAnalyticsEvent];
  }

  // Fire-and-forget to Firebase Analytics if available
  if (typeof window !== "undefined") {
    import("./firebase-analytics")
      .then((mod) => mod.logAnalyticsEvent(finalEventName, finalPayload))
      .catch((e) => console.warn("Firebase Analytics Error", e));

    pushToGtag(finalEventName, finalPayload);
  }

  if (process.env.NODE_ENV !== "production") {
    console.debug(`[Analytics] ${finalEventName}`, finalPayload);
  }
}

export function trackPageView(path: string, title?: string) {
  if (typeof window === "undefined") return;

  const pageTitle = title || document.title;
  const pageLocation = window.location.href;

  trackEvent("view_page", {
    component_name: "페이지",
    action_detail: "페이지 조회",
    page_path: path,
    page_title: pageTitle,
    page_location: pageLocation,
    value_korean: `페이지 조회: ${pageTitle}`,
  });
}
