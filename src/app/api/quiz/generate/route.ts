import { NextResponse } from "next/server";
import { GrokClient } from "@/infrastructure/api/grok";

const TIMEOUT_MS = 15000;

function getModel() {
  return process.env.GROK_MODEL?.trim() || "grok-2-1212";
}

interface QuizGenerationRequest {
  title: string;
  rootMeaning: string;
  examples: string[];
  uiLocale: string;
  learningLanguage: string;
}

interface QuizGenerationResponse {
  options: string[];
  correctIndex: number;
  explanation: string;
}

function buildPrompt(
  title: string,
  rootMeaning: string,
  examples: string[],
  uiLocale: string,
  learningLanguage: string
): string {
  return `You are a language learning quiz generator.

Create a multiple-choice quiz for this language learning item:
- Title/Pattern: "${title}" (in ${learningLanguage})
- Root Meaning: "${rootMeaning}"
- Examples: ${examples.join(", ")}

IMPORTANT: Generate all quiz options in the learner's native language (${uiLocale}), NOT in ${learningLanguage}.
This helps learners better understand and think about the meaning.

Generate 4 answer options:
1. The correct answer (translate or explain the root meaning in ${uiLocale})
2-4. Plausible but incorrect alternatives in ${uiLocale}, related to the topic but clearly wrong

Provide a brief explanation in ${uiLocale} (the user's native language).

Respond with ONLY valid JSON using this exact structure:
{
  "options": ["correct answer in ${uiLocale}", "wrong option 1 in ${uiLocale}", "wrong option 2 in ${uiLocale}", "wrong option 3 in ${uiLocale}"],
  "correctIndex": 0,
  "explanation": "brief explanation in ${uiLocale}"
}

Do not add code fences, commentary, or any text outside the JSON.`
;
}

async function getClient() {
  const key = process.env.GROK_API_KEY;
  if (!key) return null;
  return new GrokClient(key, process.env.GROK_BASE_URL);
}

async function callGrok(
  title: string,
  rootMeaning: string,
  examples: string[],
  uiLocale: string,
  learningLanguage: string
): Promise<QuizGenerationResponse | null> {
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
        {
          role: "system",
          content: "You are a helpful language learning quiz generator. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: buildPrompt(title, rootMeaning, examples, uiLocale, learningLanguage),
        },
      ],
      model: getModel(),
      temperature: 0.7,
      signal: controller.signal,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "QuizGeneration",
          schema: {
            type: "object",
            properties: {
              options: {
                type: "array",
                items: { type: "string" },
                minItems: 4,
                maxItems: 4,
              },
              correctIndex: {
                type: "number",
                minimum: 0,
                maximum: 3,
              },
              explanation: { type: "string" },
            },
            required: ["options", "correctIndex", "explanation"],
            additionalProperties: false,
          },
          strict: true,
        },
      },
    });

    try {
      return JSON.parse(response) as QuizGenerationResponse;
    } catch (error) {
      console.error("Failed to parse Grok quiz response:", error, response);
      return null;
    }
  } catch (error) {
    console.error("Grok quiz generation failed:", error);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: Request) {
  try {
    const body: QuizGenerationRequest = await req.json();
    const { title, rootMeaning, examples, uiLocale, learningLanguage } = body;

    if (!title || !rootMeaning) {
      return NextResponse.json(
        { message: "title and rootMeaning required" },
        { status: 400 }
      );
    }

    const result = await callGrok(
      title,
      rootMeaning,
      examples || [],
      uiLocale || "en",
      learningLanguage || "en"
    );

    if (!result) {
      return NextResponse.json(
        { message: "Quiz generation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Quiz generation API error:", error);
    return NextResponse.json(
      { message: "Quiz generation failed" },
      { status: 500 }
    );
  }
}
