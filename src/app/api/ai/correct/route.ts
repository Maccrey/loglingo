import { NextResponse } from "next/server";
import { GrokClient } from "@/infrastructure/api/grok";
import { CorrectionMode, CorrectionResult } from "@/domain/ai-correction";

const MODEL = "grok-1";
const TIMEOUT_MS = 3000;

function buildPrompt(content: string, mode: CorrectionMode) {
  return `You are a language tutor. Analyze the user's diary text and return a JSON object with keys:
{
 "corrected": "<fully corrected text>",
 "issues": [
   { "type": "grammar"|"word"|"style"|"other", "original": "<problem snippet>", "suggestion": "<suggestion>", "explanation": "<root meaning or grammar rule>" }
 ],
 "rootMeaningGuide": "<short note of key roots/grammar patterns>"
}
Focus on ${mode === "sentence" ? "sentence-level corrections" : "overall coherence"} and keep explanations concise. The user text:\n${content}`;
}

async function getClient() {
  const key = process.env.GROK_API_KEY;
  if (!key) return null;
  return new GrokClient(key);
}

async function callGrok(content: string, mode: CorrectionMode): Promise<CorrectionResult | null> {
  const client = await getClient();
  if (!client) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await client.chatCompletion({
      messages: [
        { role: "system", content: "You are a helpful language tutor." },
        { role: "user", content: buildPrompt(content, mode) },
      ],
      model: MODEL,
      temperature: 0.3,
      signal: controller.signal,
    });

    try {
      return JSON.parse(response) as CorrectionResult;
    } catch {
      return null;
    }
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
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const content = (body?.content || "").toString().trim();
    const mode: CorrectionMode = body?.mode === "sentence" ? "sentence" : "full";

    if (!content) {
      return NextResponse.json({ message: "content required" }, { status: 400 });
    }

    const aiResponse = await callGrok(content, mode);
    const result = aiResponse || fallbackResult(content);

    return NextResponse.json(result, { status: aiResponse ? 200 : 202 });
  } catch (error: unknown) {
    const status =
      error instanceof Error && error.name === "AbortError" ? 504 : 500;
    return NextResponse.json(
      { message: error?.message || "AI correction failed" },
      { status }
    );
  }
}
