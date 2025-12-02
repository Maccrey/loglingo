import { describe, expect, it } from "vitest";
import { buildSentryEnvelope, parseSentryDsn } from "./sentry-server";

const SAMPLE_DSN = "https://abc123@o1.ingest.sentry.io/42";

describe("parseSentryDsn", () => {
  it("parses a valid DSN", () => {
    const parsed = parseSentryDsn(SAMPLE_DSN);
    expect(parsed).toEqual({
      protocol: "https",
      host: "o1.ingest.sentry.io",
      projectId: "42",
      key: "abc123",
    });
  });

  it("returns null for invalid DSN", () => {
    expect(parseSentryDsn("not-a-dsn")).toBeNull();
  });
});

describe("buildSentryEnvelope", () => {
  it("builds an envelope body for Sentry ingest", () => {
    const envelope = buildSentryEnvelope(SAMPLE_DSN, {
      level: "error",
      message: "Something broke",
      stack: "Error: Something broke\n    at doThing (app.ts:10:5)",
    });

    expect(envelope).not.toBeNull();
    expect(envelope?.url).toContain("/api/42/envelope/");
    expect(envelope?.body).toContain("Something broke");
  });
});
