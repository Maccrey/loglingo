import { NextResponse } from 'next/server';
import { GrokClient } from '@/infrastructure/api/grok';
import { getRecentDiaries } from "@/infrastructure/firebase/admin-repository";

function getModel() {
  return process.env.GROK_MODEL?.trim() || "grok-4-fast-non-reasoning";
}

async function getClient() {
  const key = process.env.GROK_API_KEY;
  if (!key) return null;
  return new GrokClient(key, process.env.GROK_BASE_URL);
}

export async function POST(req: Request) {
  try {
    const { userId, language, uiLocale } = await req.json();

    if (!userId || !language) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch recent diaries for context
    const diaries = await getRecentDiaries(userId, 3);

    // 2. Call Grok
    const client = await getClient();
    if (!client) {
         // Mock response if no key
         return NextResponse.json({ 
             prompt: "What did you do today? Try to describe your feelings about your recent events.",
             translation: "오늘 하루는 어땠나요? 최근 있었던 일에 대한 기분을 설명해보세요."
         }, { status: 200 });
    }

    const diaryContext = diaries.length > 0 
        ? `User's recent diary entries (context):\n${diaries.join("\n---\n")}`
        : "No recent diary entries found. Ask a general question.";

    const systemPrompt = `You are a friendly language tutor. Your goal is to give the user a speaking prompt (a question or a topic) to help them start practicing speaking.
    Target Language: ${language}
    UI Language (User's Native): ${uiLocale || 'en'}
    
    Context:
    ${diaryContext}
    
    Task:
    Generate a conversation starter or question based on the user's diary context. 
    If diaries are provided, ask something related to them to deepen the reflection (e.g. "You mentioned X, how did that make you feel?").
    If no diaries, ask a common daily question (e.g. "What's your plan for today?").
    
    Output Format (JSON only):
    {
       "prompt": "Question/Topic in Target Language (${language})",
       "translation": "Translation of the prompt in UI Language (${uiLocale})"
    }
    
    Keep the prompt simple and encouraging. 1-2 sentences max.`;

    const completion = await client.chatCompletion({
        messages: [
            { role: "system", content: "You are a helpful language tutor. Respond in JSON." },
            { role: "user", content: systemPrompt } 
        ],
        model: getModel(),
        temperature: 0.7,
        response_format: { type: "json_object" } 
    });

    let result = null;
    try {
        const cleaned = completion.replace(/```json/g, '').replace(/```/g, '').trim();
        result = JSON.parse(cleaned);
    } catch (e) {
        console.error("Failed to parse prompt response", completion);
        // Fallback
        return NextResponse.json({ 
             prompt: "Tell me about your day.",
             translation: "오늘 하루에 대해 이야기해주세요."
         });
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Prompt API Error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
