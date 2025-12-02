export type RumMetricName = "LCP" | "CLS" | "INP" | "TTFB";

export type RumMetricPayload = {
  metric: RumMetricName;
  value: number;
  navigationType?: string;
  pathname?: string;
  timestamp: number;
  sessionId: string;
  visibilityState?: DocumentVisibilityState;
  effectiveConnectionType?: string;
  deviceMemory?: number;
};

export type LogLevel = "info" | "warn" | "error";

export type ClientLogEvent = {
  message: string;
  level: LogLevel;
  stack?: string;
  context?: Record<string, unknown>;
  type?: "frontend-error" | "uptime-heartbeat" | "rum";
};

export type ObservabilityEnvelope =
  | { kind: "rum"; payload: RumMetricPayload }
  | { kind: "log"; payload: ClientLogEvent };
