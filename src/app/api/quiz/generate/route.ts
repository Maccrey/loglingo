import { NextResponse } from "next/server";
import { GrokClient } from "@/infrastructure/api/grok";

const TIMEOUT_MS = 15000;

function getModel() {
  return process.env.GROK_MODEL?.trim() || "grok-2-1212";
}

interface QuizGenerationRequest {
  title: string;
  type: 'grammar' | 'word'; // Type of quiz to generate
  rootMeaning: string;
  examples: string[];
  exampleSentences?: string[]; // Example sentences from AI correction
  uiLocale: string;
  learningLanguage: string;
}

interface QuizGenerationResponse {
  options: string[];
  correctIndex: number;
  explanation: string;
}

function buildGrammarQuizPrompt(
  title: string,
  rootMeaning: string,
  exampleSentences: string[],
  uiLocale: string,
  learningLanguage: string
): string {
  const exampleSentence = exampleSentences.length > 0 
    ? exampleSentences[Math.floor(Math.random() * exampleSentences.length)]
    : `Example using "${title}"`;
    
  return `You are a language learning quiz generator.

Create a grammar quiz for this pattern:
- Grammar Pattern: "${title}" (in ${learningLanguage})
- Explanation: "${rootMeaning}"
- Example Sentence: "${exampleSentence}" (in ${learningLanguage})

QUIZ FORMAT - Grammar Understanding Test:
Question: Present the example sentence and ask what grammar rule is demonstrated.
Example: "다음 문장에서 사용된 문법 규칙은? '${exampleSentence}'"

IMPORTANT: ALL quiz content must be in the learner's UI language (${uiLocale}):
- Question: in ${uiLocale}
- Options: in ${uiLocale} (explain the grammar rule, not translate)
- Explanation: in ${uiLocale}

Generate 4 answer options explaining the grammar rule:
1. Correct explanation of the grammar pattern in ${uiLocale}
2-4. Plausible but incorrect grammar explanations in ${uiLocale}

Respond with ONLY valid JSON:
{
  "options": ["correct grammar explanation in ${uiLocale}", "wrong 1", "wrong 2", "wrong 3"],
  "correctIndex": 0,
  "explanation": "detailed explanation in ${uiLocale}"
}

Do not add code fences or commentary.`;
}

function buildWordQuizPrompt(
  title: string,
  rootMeaning: string,
  exampleSentences: string[],
  uiLocale: string,
  learningLanguage: string
): string {
  // Randomly choose between spelling test and meaning test
  const quizType = Math.random() > 0.5 ? 'spelling' : 'meaning';
  
  if (quizType === 'spelling') {
    return `You are a language learning quiz generator.

Create a SPELLING quiz for this word:
- Word: "${title}" (in ${learningLanguage})
- Meaning: "${rootMeaning}"
- Context: ${exampleSentences.join(', ')}

QUIZ FORMAT - Spelling Test:
Question: Ask which is the correct spelling of the word meaning "${rootMeaning}"

IMPORTANT: ALL quiz content must be in ${uiLocale}:
- Question: in ${uiLocale}
- Options: similar-looking words in ${learningLanguage} (the target language)
- Explanation: in ${uiLocale}

Generate 4 answer options with similar spellings:
1. Correct spelling: "${title}"
2-4. Similar but incorrect spellings in ${learningLanguage}

Respond with ONLY valid JSON:
{
  "options": ["${title}", "misspelling1", "misspelling2", "misspelling3"],
  "correctIndex": 0,
  "explanation": "explanation in ${uiLocale} why this spelling is correct"
}`;
  } else {
    return `You are a language learning quiz generator.

Create a MEANING quiz for this word:
- Word: "${title}" (in ${learningLanguage})
- Meaning: "${rootMeaning}"
- Examples: ${exampleSentences.join(', ')}

QUIZ FORMAT - Meaning Test:
Question: Ask what "${title}" means

IMPORTANT: ALL quiz content must be in ${uiLocale}:
- Question: in ${uiLocale}
- Options: meanings in ${uiLocale} (translate/explain)
- Explanation: in ${uiLocale}

Generate 4 answer options:
1. Correct meaning in ${uiLocale}
2-4. Similar but incorrect meanings in ${uiLocale}

Respond with ONLY valid JSON:
{
  "options": ["correct meaning in ${uiLocale}", "wrong meaning 1", "wrong meaning 2", "wrong meaning 3"],
  "correctIndex": 0,
  "explanation": "detailed explanation in ${uiLocale}"
}`;
  }
}

function buildPrompt(
  type: 'grammar' | 'word',
  title: string,
  rootMeaning: string,
  examples: string[],
  exampleSentences: string[] | undefined,
  uiLocale: string,
  learningLanguage: string
): string {
  const sentences = exampleSentences && exampleSentences.length > 0 ? exampleSentences : examples;
  
  if (type === 'grammar') {
    return buildGrammarQuizPrompt(title, rootMeaning, sentences, uiLocale, learningLanguage);
  } else {
    return buildWordQuizPrompt(title, rootMeaning, sentences, uiLocale, learningLanguage);
  }
}

async function getClient() {
  const key = process.env.GROK_API_KEY;
  if (!key) return null;
  return new GrokClient(key, process.env.GROK_BASE_URL);
}

async function callGrok(
  type: 'grammar' | 'word',
  title: string,
  rootMeaning: string,
  examples: string[],
  exampleSentences: string[] | undefined,
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
          content: buildPrompt(type, title, rootMeaning, examples, exampleSentences, uiLocale, learningLanguage),
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
    const { title, type, rootMeaning, examples, exampleSentences, uiLocale, learningLanguage } = body;

    if (!title || !rootMeaning || !type) {
      return NextResponse.json(
        { message: "title, rootMeaning, and type required" },
        { status: 400 }
      );
    }

    const result = await callGrok(
      type,
      title,
      rootMeaning,
      examples || [],
      exampleSentences,
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
