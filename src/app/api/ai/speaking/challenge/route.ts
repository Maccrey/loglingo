import { NextResponse } from "next/server";
import { GrokClient } from "@/infrastructure/api/grok";

// Types
interface ChallengeRequest {
  archiveItem: {
    title: string;
    type: 'grammar' | 'word';
    rootMeaning: string;
  };
  learningLanguage: string;
  uiLocale: string;
}

interface ChallengeResponse {
  sentence: string;
  meaning: string;
  pronunciationTips?: string;
}

const TIMEOUT_MS = 30000;

function getModel() {
  return process.env.GROK_MODEL?.trim() || "grok-4-fast-non-reasoning";
}

async function getClient() {
  const key = process.env.GROK_API_KEY;
  if (!key) return null;
  return new GrokClient(key, process.env.GROK_BASE_URL);
}

function buildPrompt(req: ChallengeRequest): string {
  const { archiveItem, learningLanguage, uiLocale } = req;
  
  return `You are a language tutor.
Target Language: ${learningLanguage}
UI Language (for explanations): ${uiLocale}
Task: Create a B1-level practice sentence for the user to speak, focusing on: "${archiveItem.title}" (${archiveItem.type}).

Context/Meaning of item: "${archiveItem.rootMeaning}"

Respond with ONLY valid JSON:
{
  "sentence": "<The practice sentence in Target Language. Must contain the target item.>",
  "meaning": "<Translation/Meaning of the sentence in UI Language>",
  "pronunciationTips": "<Brief tip in UI Language, e.g. 'Standard American accent' or specific warning for this word>"
}

Requirements:
- Sentence length: 8-15 words.
- Tone: Natural, daily conversation.
- If type is 'grammar', ensuring the sentence clearly demonstrates the grammar rule.
- If type is 'word', use it in a common context.
`;
}

export async function POST(req: Request) {
  try {
    const body: ChallengeRequest = await req.json();
    
    // Validate
    if (!body.archiveItem || !body.learningLanguage) {
      return NextResponse.json({ message: "Invalid request: missing item or language" }, { status: 400 });
    }

    const client = await getClient();
    
    // Mock Response if no API Key (Dev mode)
    if (!client) {
      console.warn("Grok API key missing, returning mock challenge.");
      return NextResponse.json({
        sentence: `This is a mock sentence using ${body.archiveItem.title}.`,
        meaning: `이것은 '${body.archiveItem.title}'을(를) 사용한 테스트 문장입니다.`,
        pronunciationTips: "API 키를 설정해주세요."
      });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await client.chatCompletion({
        messages: [
          { role: "system", content: "You are a helpful language tutor. Output JSON only." },
          { role: "user", content: buildPrompt(body) }
        ],
        model: getModel(),
        temperature: 0.7,
        signal: controller.signal,
        response_format: { type: "json_object" }
      });

      // Parse JSON
      let result: ChallengeResponse;
      try {
        result = JSON.parse(response);
      } catch (e) {
        // Fallback checks for Markdown fences
        const match = response.match(/\{[\s\S]*\}/);
        if (match) {
           result = JSON.parse(match[0]);
        } else {
           throw new Error("Failed to parse JSON from AI response");
        }
      }

      return NextResponse.json(result);

    } finally {
      clearTimeout(timer);
    }

  } catch (error) {
    console.error("Challenge Gen Failed:", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
