import { ClientLogEvent, RumMetricName, RumMetricPayload } from "@/domain/observability";
import { sendClientLog } from "./send-client-log";

const RUM_ENDPOINT = "/api/observability/rum";

type LayoutShiftEntry = PerformanceEntry & { value: number; hadRecentInput: boolean };
type EventTimingEntry = PerformanceEntry & { interactionId?: number; duration: number };

function roundValue(value: number, fractionDigits: number) {
  return Number(value.toFixed(fractionDigits));
}

function getNavigationType(): string | undefined {
  const navEntry = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  return navEntry?.type;
}

function getRumSessionId() {
  const key = "loglingo_rum_session";
  if (typeof sessionStorage === "undefined") {
    return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;
  }
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;
  const fresh = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;
  sessionStorage.setItem(key, fresh);
  return fresh;
}

function sendRumMetric(metric: RumMetricPayload) {
  const body = JSON.stringify({ kind: "rum", payload: metric });

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(RUM_ENDPOINT, blob);
    return;
  }

  fetch(RUM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

function basePayload(
  metric: RumMetricName,
  value: number,
  sessionId: string
): RumMetricPayload {
  const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;

  return {
    metric,
    value: metric === "CLS" ? roundValue(value, 4) : roundValue(value, 2),
    navigationType: getNavigationType(),
    pathname: typeof location !== "undefined" ? location.pathname : undefined,
    timestamp: Date.now(),
    sessionId,
    visibilityState:
      typeof document !== "undefined" ? document.visibilityState : undefined,
    effectiveConnectionType: connection?.effectiveType,
    deviceMemory,
  };
}

function sendMetric(metric: RumMetricName, value: number, sessionId: string) {
  sendRumMetric(basePayload(metric, value, sessionId));
}

function sendRumLog(message: string, context?: Record<string, unknown>) {
  const event: ClientLogEvent = {
    level: "info",
    message,
    type: "rum",
    context,
  };
  sendClientLog(event);
}

export function startRumObservers() {
  if (typeof window === "undefined" || typeof PerformanceObserver === "undefined") {
    return () => {};
  }

  const sessionId = getRumSessionId();
  let flushed = false;
  let lcpValue: number | null = null;
  let clsValue = 0;
  let inpValue = 0;

  const navEntry = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (navEntry) {
    sendMetric("TTFB", navEntry.responseStart, sessionId);
  }

  const cleanups: Array<() => void> = [];

  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const lastEntry = entryList.getEntries().at(-1) as
        | LargestContentfulPaint
        | undefined;
      if (!lastEntry) return;
      const value = lastEntry.renderTime || lastEntry.loadTime || 0;
      lcpValue = value;
    });
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    cleanups.push(() => lcpObserver.disconnect());
  } catch (error) {
    sendRumLog("LCP observer not supported", { error: String(error) });
  }

  try {
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as LayoutShiftEntry[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
    });
    clsObserver.observe({ type: "layout-shift", buffered: true });
    cleanups.push(() => clsObserver.disconnect());
  } catch (error) {
    sendRumLog("CLS observer not supported", { error: String(error) });
  }

  try {
    const inpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as EventTimingEntry[]) {
        if (entry.interactionId && entry.duration > inpValue) {
          inpValue = entry.duration;
        }
      }
    });
    inpObserver.observe({ type: "event", buffered: true });
    cleanups.push(() => inpObserver.disconnect());
  } catch (error) {
    sendRumLog("INP observer not supported", { error: String(error) });
  }

  const flushMetrics = () => {
    if (flushed) return;
    flushed = true;

    if (lcpValue !== null) {
      sendMetric("LCP", lcpValue, sessionId);
    }
    if (clsValue > 0) {
      sendMetric("CLS", clsValue, sessionId);
    }
    if (inpValue > 0) {
      sendMetric("INP", inpValue, sessionId);
    }
  };

  const onHidden = () => flushMetrics();

  window.addEventListener("pagehide", onHidden, { once: true });
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.visibilityState === "hidden") {
        onHidden();
      }
    },
    { once: true }
  );

  cleanups.push(() => {
    window.removeEventListener("pagehide", onHidden);
    flushMetrics();
  });

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}
