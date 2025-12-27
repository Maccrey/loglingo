export type AnalyticsEvent =
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

const EVENT_LABELS: Record<AnalyticsEvent, string> = {
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

function pushToGtag(event: AnalyticsEvent, payload?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (!gtag) return;

  const eventLabel = EVENT_LABELS[event];
  gtag("event", event, {
    event_label: eventLabel,
    language: "ko",
    ...payload,
  });
}

export function trackEvent(
  event: AnalyticsEvent,
  payload?: Record<string, unknown>
) {
  const data = {
    event_label: EVENT_LABELS[event],
    language: "ko",
    ...payload,
  };

  // Fire-and-forget to Firebase Analytics if available
  if (typeof window !== "undefined") {
    import("./firebase-analytics")
      .then((mod) => mod.logAnalyticsEvent(event, data))
      .catch(() => {});

    pushToGtag(event, data);
  }

  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, data);
  }
}

export function trackPageView(path: string, title?: string) {
  if (typeof window === "undefined") return;

  const pageTitle = title || document.title;
  const pageLocation = window.location.href;

  trackEvent("page_view", {
    page_path: path,
    page_title: pageTitle,
    page_location: pageLocation,
  });
}
