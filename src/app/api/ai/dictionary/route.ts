import { NextRequest, NextResponse } from "next/server";

interface DictionaryRequest {
  word: string;
  learningLang: string;
  uiLang: string;
}

interface DictionaryResponse {
  word: string;
  rootMeaning: string;
  examples: string[];
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
  "rootMeaning": "Core/root meaning in ${uiLang} (brief, 1-2 sentences)",
  "examples": ["Example 1 in ${learningLang}", "Example 2 in ${learningLang}", "Example 3 in ${learningLang}"]
}

Rules:
- rootMeaning MUST be in ${uiLang}
- examples MUST be in ${learningLang}
- Provide 3-5 practical example sentences
- Keep rootMeaning concise and focused on the core meaning
- Examples should demonstrate different usages`;

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
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
