import { NextRequest, NextResponse } from "next/server";

interface DictionaryRequest {
  word: string;
  learningLang: string;
  uiLang: string;
}

interface DictionaryResponse {
  word: string;
  rootMeaning: string;
  examples: {
    sentence: string;
    meaning: string;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    const { word, learningLang, uiLang }: DictionaryRequest = await request.json();

    if (!word || !learningLang || !uiLang) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = `You are a language learning assistant. Generate a dictionary entry for the word "${word}" in ${learningLang}.

Provide the response in JSON format:
{
  "word": "${word}",
  "rootMeaning": "Explain the core/root image of the word in ${uiLang} so a learner can visualize it (1-2 sentences, avoid long definitions)",
  "examples": [
    { "sentence": "Example in ${learningLang}", "meaning": "Short meaning/translation in ${uiLang}" },
    { "sentence": "Example in ${learningLang}", "meaning": "Short meaning/translation in ${uiLang}" },
    { "sentence": "Example in ${learningLang}", "meaning": "Short meaning/translation in ${uiLang}" }
  ]
}

Rules:
- rootMeaning MUST be in ${uiLang} and include a clear 'root image' to help non-native speakers grasp the meaning.
- examples MUST be in ${learningLang}; meanings/translations in ${uiLang}.
- Provide 3-5 practical example sentences that show different usages.
- Keep rootMeaning concise and focused on the core visual/semantic image.`;

    const apiKey = process.env.GROK_API_KEY;
    const model = process.env.GROK_MODEL || "grok-beta";

    if (!apiKey) {
      console.error("❌ GROK_API_KEY is not set");
      return NextResponse.json(
        { error: "Dictionary service is not configured" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Grok API error:", response.status, response.statusText, errorText);
      throw new Error(`Grok API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No response from Grok API");
    }

    // JSON 파싱 (마크다운 코드 블록 제거)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from Grok");
    }

    const result: DictionaryResponse = JSON.parse(jsonMatch[0]);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ Dictionary API error:", error);
    return NextResponse.json(
      { error: "Failed to generate dictionary entry" },
      { status: 500 }
    );
  }
}
