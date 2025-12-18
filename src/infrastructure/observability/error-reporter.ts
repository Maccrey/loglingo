import { ClientLogEvent } from "@/domain/observability";
import { sendClientLog } from "./send-client-log";

export function startGlobalErrorReporter() {
  if (typeof window === "undefined") return () => {};

  const handleError = (event: ErrorEvent) => {
    const log: ClientLogEvent = {
      level: "error",
      message: event.message || "Unhandled error",
      stack: event.error?.stack,
      context: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
      type: "frontend-error",
    };
    sendClientLog(log);
  };

  const handleRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason;
    const log: ClientLogEvent = {
      level: "error",
      message:
        typeof reason === "string"
          ? reason
          : reason?.message || "Unhandled promise rejection",
      stack: typeof reason === "object" ? reason?.stack : undefined,
      context: { reason },
      type: "frontend-error",
    };
    sendClientLog(log);
  };

  window.addEventListener("error", handleError);
  window.addEventListener("unhandledrejection", handleRejection);

  return () => {
    window.removeEventListener("error", handleError);
    window.removeEventListener("unhandledrejection", handleRejection);
  };
}
