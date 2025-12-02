import { sendClientLog } from "./send-client-log";

const HEARTBEAT_MS = 60_000;
const UPTIME_ENDPOINT = "/api/uptime";

export function startUptimeHeartbeat() {
  if (typeof window === "undefined") return () => {};

  let stopped = false;
  const beat = async () => {
    try {
      await fetch(UPTIME_ENDPOINT, {
        method: "GET",
        cache: "no-store",
        keepalive: true,
      });
    } catch (error) {
      sendClientLog({
        level: "warn",
        message: "Heartbeat failed",
        type: "uptime-heartbeat",
        context: { error: String(error) },
      });
    }
  };

  const id = window.setInterval(() => {
    if (!stopped) beat();
  }, HEARTBEAT_MS);

  // fire the first beat soon after hydration
  window.setTimeout(beat, 5000);

  return () => {
    stopped = true;
    window.clearInterval(id);
  };
}
