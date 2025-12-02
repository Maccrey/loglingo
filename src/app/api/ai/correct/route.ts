import { NextResponse } from "next/server";
import { GrokClient } from "@/infrastructure/api/grok";
import { CorrectionMode, CorrectionResult } from "@/domain/ai-correction";

const TIMEOUT_MS = 15000;

function getModel() {
  return process.env.GROK_MODEL?.trim() || "grok-4-fast-non-reasoning";
}

function tryParseJsonResponse(text: string): CorrectionResult | null {
  const direct = safeParse(text);
  if (direct) return direct;

  // Attempt to extract the first JSON object if model adds extra prose/code fences
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    const parsed = safeParse(match[0]);
    if (parsed) return parsed;
  }
  return null;
}

function safeParse(text: string): CorrectionResult | null {
  try {
    return JSON.parse(text) as CorrectionResult;
  } catch {
    return null;
  }
}

function buildPrompt(content: string, mode: CorrectionMode, locale: string) {
  return `You are a language tutor.
Respond with ONLY valid JSON, no prose, using this exact shape:
{
  "corrected": "<fully corrected text>",
  "issues": [
    { "type": "grammar"|"word"|"style"|"other", "original": "<problem snippet>", "suggestion": "<suggestion>", "explanation": "<root meaning or grammar rule>" }
  ],
  "rootMeaningGuide": "<short note of key roots/grammar patterns>"
}
Focus on ${mode === "sentence" ? "sentence-level corrections" : "overall coherence"}.
Do not add Markdown, code fences, or commentary.
Use the UI language (${locale}) for ALL text fields (corrected, issues, explanations, rootMeaningGuide).
User diary text:
${content}`;
}

async function getClient() {
  const key = process.env.GROK_API_KEY;
  if (!key) return null;
  return new GrokClient(key, process.env.GROK_BASE_URL);
}

async function callGrok(content: string, mode: CorrectionMode, locale: string): Promise<CorrectionResult | null> {
  const client = await getClient();
  if (!client) {
    console.error("Grok client unavailable: missing GROK_API_KEY");
    return null;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await client.chatCompletion({
      messages: [
        { role: "system", content: "You are a helpful language tutor." },
        { role: "user", content: buildPrompt(content, mode, locale) },
      ],
      model: getModel(),
      temperature: 0.3,
      signal: controller.signal,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "CorrectionResult",
          schema: {
            type: "object",
            properties: {
              corrected: { type: "string" },
              issues: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string", enum: ["grammar", "word", "style", "other"] },
                    original: { type: "string" },
                    suggestion: { type: "string" },
                    explanation: { type: "string" }
                  },
                  required: ["type", "original", "suggestion", "explanation"],
                  additionalProperties: false
                }
              },
              rootMeaningGuide: { type: "string" }
            },
            required: ["corrected", "issues"],
            additionalProperties: false
          },
          strict: true
        }
      }
    });

    const parsed = tryParseJsonResponse(response);
    if (!parsed) {
      console.error("Grok response JSON parse failed, raw response:", response);
    }
    return parsed;
  } finally {
    clearTimeout(timer);
  }
}

function fallbackResult(content: string) {
  return {
    corrected: `${content.trim()} (sample correction)`,
    issues: [
      {
        type: "grammar",
        original: "sample",
        suggestion: "Sample suggestion",
        explanation: "This is a mock explanation. Provide real Grok API key for live data.",
      },
    ],
    rootMeaningGuide: "Root meaning guide will appear here when Grok API is configured.",
    fallback: true,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const content = (body?.content || "").toString().trim();
    const mode: CorrectionMode = body?.mode === "sentence" ? "sentence" : "full";
    const locale = (body?.locale || "en").toString();

    if (!content) {
      return NextResponse.json({ message: "content required" }, { status: 400 });
    }

    try {
      const aiResponse = await callGrok(content, mode, locale);
      if (!aiResponse) {
        console.warn("Grok returned null/failed to parse. Falling back.", { model: getModel() });
      }
      const result = aiResponse || fallbackResult(content);
      return NextResponse.json(result, { status: aiResponse ? 200 : 202 });
    } catch (error) {
      console.error("AI correction failed, returning fallback:", error);
      return NextResponse.json(fallbackResult(content), { status: 202 });
    }
  } catch (error: unknown) {
    const status =
      error instanceof Error && error.name === "AbortError" ? 504 : 500;
    return NextResponse.json(
      { message: (error as Error)?.message || "AI correction failed" },
      { status }
    );
  }
}
