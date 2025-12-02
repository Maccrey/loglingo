import { ClientLogEvent, LogLevel } from "@/domain/observability";

type ParsedDsn = {
  protocol: string;
  host: string;
  projectId: string;
  key: string;
};

function fallbackId() {
  return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
}

export function parseSentryDsn(dsn: string): ParsedDsn | null {
  try {
    const url = new URL(dsn);
    const projectId = url.pathname.replace("/", "");
    if (!projectId) return null;
    if (!url.username) return null;

    return {
      protocol: url.protocol.replace(":", ""),
      host: url.host,
      projectId,
      key: url.username,
    };
  } catch {
    return null;
  }
}

type EnvelopeParts = { url: string; body: string };

function parseStack(stack?: string) {
  if (!stack) return undefined;
  const frames = stack
    .split("\n")
    .slice(1)
    .map((line) => line.trim())
    .map((line) => {
      const withFunction = line.match(/^at (.+?) \((.*):(\d+):(\d+)\)$/);
      const withoutFunction = line.match(/^at (.*):(\d+):(\d+)$/);

      if (withFunction) {
        return {
          function: withFunction[1],
          filename: withFunction[2],
          lineno: Number(withFunction[3]),
          colno: Number(withFunction[4]),
        };
      }

      if (withoutFunction) {
        return {
          filename: withoutFunction[1],
          lineno: Number(withoutFunction[2]),
          colno: Number(withoutFunction[3]),
        };
      }

      return null;
    })
    .filter(Boolean);

  return frames.length > 0 ? { frames } : undefined;
}

export function buildSentryEnvelope(dsn: string, event: ClientLogEvent): EnvelopeParts | null {
  const parsed = parseSentryDsn(dsn);
  if (!parsed) return null;

  const eventId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : fallbackId();
  const header = {
    event_id: eventId,
    dsn,
    sent_at: new Date().toISOString(),
    sdk: { name: "loglingo-sentry-lite", version: "0.1.0" },
  };

  const payload = {
    event_id: eventId,
    timestamp: Date.now() / 1000,
    level: (event.level as LogLevel) ?? "error",
    platform: "javascript",
    message: { formatted: event.message },
    tags: {
      type: event.type ?? "log",
    },
    exception: event.stack
      ? {
          values: [
            {
              type: "Error",
              value: event.message,
              stacktrace: parseStack(event.stack),
            },
          ],
        }
      : undefined,
    extra: event.context,
  };

  const body = `${JSON.stringify(header)}\n${JSON.stringify({ type: "event" })}\n${JSON.stringify(payload)}`;

  const url = `${parsed.protocol}://${parsed.host}/api/${parsed.projectId}/envelope/`;
  return { url, body };
}

export async function sendSentryEvent(event: ClientLogEvent) {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return false;

  const envelope = buildSentryEnvelope(dsn, event);
  if (!envelope) return false;

  try {
    await fetch(envelope.url, {
      method: "POST",
      headers: { "Content-Type": "application/x-sentry-envelope" },
      body: envelope.body,
    });
    return true;
  } catch (error) {
    console.error("Sentry send failed", error);
    return false;
  }
}
