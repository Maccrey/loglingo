import { ClientLogEvent } from "@/domain/observability";

const LOG_ENDPOINT = "/api/observability/log";

export function sendClientLog(event: ClientLogEvent) {
  const payload = JSON.stringify({ kind: "log", payload: event });

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon(LOG_ENDPOINT, blob);
    return;
  }

  fetch(LOG_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}
