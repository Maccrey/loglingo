import { describe, expect, it, afterEach } from "vitest";
import { POST } from "./route";

const originalKey = process.env.GROK_API_KEY;

afterEach(() => {
  process.env.GROK_API_KEY = originalKey;
});

describe("POST /api/ai/correct", () => {
  it("returns 400 when content is missing", async () => {
    const res = await POST(new Request("http://localhost/api/ai/correct", { method: "POST", body: "{}" }));
    expect(res.status).toBe(400);
  });

  it("returns fallback result when GROK_API_KEY is missing", async () => {
    process.env.GROK_API_KEY = "";
    const res = await POST(
      new Request("http://localhost/api/ai/correct", {
        method: "POST",
        body: JSON.stringify({ content: "Hello world", mode: "full" }),
      })
    );
    expect(res.status).toBe(202);
    const data = await res.json();
    expect(data.corrected).toMatch(/sample correction/);
  });
});
