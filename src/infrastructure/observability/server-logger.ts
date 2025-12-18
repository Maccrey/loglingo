import { ClientLogEvent, RumMetricPayload } from "@/domain/observability";
import { sendSentryEvent } from "./sentry-server";

function formatRum(metric: RumMetricPayload) {
  const detail = {
    value: metric.value,
    path: metric.pathname,
    nav: metric.navigationType,
    visibility: metric.visibilityState,
    ect: metric.effectiveConnectionType,
  };
  console.info(`[RUM] ${metric.metric}`, detail);
}

export async function persistRumMetric(metric: RumMetricPayload) {
  formatRum(metric);
}

export async function persistClientLog(event: ClientLogEvent) {
  if (event.level === "error") {
    console.error("[client-error]", event.message, event.context, event.stack);
  } else if (event.level === "warn") {
    console.warn("[client-log]", event.message, event.context);
  } else {
    console.info("[client-log]", event.message, event.context);
  }

  await sendSentryEvent(event);
}
