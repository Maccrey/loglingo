import { NextResponse } from "next/server";
import { GrokClient } from "@/infrastructure/api/grok";
import { CorrectionMode, CorrectionResult } from "@/domain/ai-correction";

const TIMEOUT_MS = 30000;

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

function languageLabel(locale: string) {
  switch (locale) {
    case "en":
      return "English";
    case "ko":
      return "Korean";
    case "ja":
      return "Japanese";
    case "zh":
      return "Chinese";
    case "th":
      return "Thai";
    case "vi":
      return "Vietnamese";
    case "id":
      return "Indonesian";
    case "es":
      return "Spanish";
    case "pt":
      return "Portuguese";
    case "fr":
      return "French";
    case "de":
      return "German";
    case "tr":
      return "Turkish";
    case "ar":
      return "Arabic";
    case "hi":
      return "Hindi";
    default:
      return locale;
  }
}

function buildPrompt(
  content: string,
  mode: CorrectionMode,
  targetLanguageCode: string,
  uiLanguageCode: string
) {
  const targetLanguage = languageLabel(targetLanguageCode);
  const uiLanguage = languageLabel(uiLanguageCode);
  return `You are a language tutor.
Target language: ${targetLanguage} (${targetLanguageCode})
UI language: ${uiLanguage} (${uiLanguageCode})
Respond with ONLY valid JSON, no prose, using this exact shape:
{
  "corrected": "<fully corrected text in target language>",
  "issues": [
    { "type": "grammar"|"word"|"style"|"other", "original": "<problem snippet>", "suggestion": "<complete corrected sentence in target language>", "explanation": "<root meaning or grammar rule in UI language>" }
  ],
  "rootMeaningGuide": "<short note of key roots/grammar patterns in UI language>"
}

CRITICAL INSTRUCTIONS:
1. For 'corrected' field:
   - MUST be written ENTIRELY in TARGET LANGUAGE (${targetLanguage})
   - If user mixes multiple languages, translate ALL text to target language
   - Example: If target is Korean and user writes "今日は朝から静かな 비가 내렸다"
     → corrected must be "오늘은 아침부터 조용한 비가 내렸다" (100% Korean)
   - NEVER keep mixed languages in the corrected text
   
2. For 'suggestion' field: 
   - MUST be written in TARGET LANGUAGE (${targetLanguage})
   - Provide the COMPLETE CORRECTED SENTENCE, not just the corrected word/phrase
   - Example: If target language is English and original is "I has a apple"
     → suggestion: "I have an apple" (complete sentence in English)
   - Example: If target language is Korean and original is "나는 사과를 먹었어요 yesterday"
     → suggestion: "나는 어제 사과를 먹었어요" (complete sentence in Korean)
   
3. For 'explanation' field:
   - MUST be written in UI LANGUAGE (${uiLanguage})
   - If type is "word": Provide a visual/conceptual root image of the word's core meaning
     Example: For "get" → "손을 뻗어 바깥의 것을 내 쪽 컨테이너(소유/통제/연역)로 끌어오는 이미지"
   - If type is "grammar": Explain the grammar rule
   - Always provide clear, visual metaphors for word meanings to help learners understand through imagery

Focus on ${mode === "sentence" ? "sentence-level corrections" : "overall coherence"}.
Do not add Markdown, code fences, or commentary.
REMEMBER: Target language (${targetLanguage}) for 'corrected' and 'suggestion'. UI language (${uiLanguage}) for 'explanation' and 'rootMeaningGuide'.
The user is learning ${targetLanguage}. If their text contains ANY words in other languages, translate them to ${targetLanguage}.
User diary text:
${content}`;
}

async function getClient() {
  const key = process.env.GROK_API_KEY;
  if (!key) return null;
  return new GrokClient(key, process.env.GROK_BASE_URL);
}

async function callGrok(
  content: string,
  mode: CorrectionMode,
  targetLanguage: string,
  uiLanguage: string
): Promise<CorrectionResult | null> {
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
        { role: "system", content: "You are a helpful language tutor. Always respond in the target language specified in the prompt, regardless of the user's input language." },
        { role: "user", content: buildPrompt(content, mode, targetLanguage, uiLanguage) },
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

const fallbackMessages: Record<
  string,
  { correctedSuffix: string; sample: string; explanation: string; rootGuide: string }
> = {
  en: {
    correctedSuffix: "(sample correction)",
    sample: "Sample suggestion",
    explanation: "This is a mock explanation. Provide real Grok API key for live data.",
    rootGuide: "Root meaning guide will appear here when Grok API is configured.",
  },
  ko: {
    correctedSuffix: "(샘플 교정)",
    sample: "예시 제안",
    explanation: "샘플 응답입니다. 실제 Grok API 키를 설정하면 실데이터가 반환됩니다.",
    rootGuide: "Grok API가 설정되면 어근/문법 안내가 표시됩니다.",
  },
  ja: {
    correctedSuffix: "（サンプル修正）",
    sample: "サンプル提案",
    explanation: "これはサンプルです。実際のデータを受け取るには Grok API キーを設定してください。",
    rootGuide: "Grok API を設定すると語根/文法ガイドが表示されます。",
  },
  zh: {
    correctedSuffix: "（示例校正）",
    sample: "示例建议",
    explanation: "这是示例响应。配置 Grok API 密钥后会返回真实数据。",
    rootGuide: "配置 Grok API 后会显示词根/语法提示。",
  },
  es: {
    correctedSuffix: "(corrección de muestra)",
    sample: "Sugerencia de muestra",
    explanation: "Esta es una respuesta de ejemplo. Configura la clave de Grok para datos reales.",
    rootGuide: "La guía aparecerá cuando se configure Grok API.",
  },
  pt: {
    correctedSuffix: "(correção de exemplo)",
    sample: "Sugestão de exemplo",
    explanation: "Esta é uma resposta de exemplo. Configure a chave Grok para dados reais.",
    rootGuide: "O guia aparecerá quando o Grok API estiver configurado.",
  },
  fr: {
    correctedSuffix: "(correction d'exemple)",
    sample: "Suggestion d'exemple",
    explanation: "Réponse de démonstration. Configurez la clé Grok pour obtenir des données réelles.",
    rootGuide: "Le guide apparaîtra quand l'API Grok sera configurée.",
  },
  de: {
    correctedSuffix: "(Beispielkorrektur)",
    sample: "Beispielvorschlag",
    explanation: "Dies ist eine Beispielantwort. Konfigurieren Sie den Grok-API-Schlüssel für echte Daten.",
    rootGuide: "Die Anleitung erscheint, sobald die Grok-API eingerichtet ist.",
  },
  tr: {
    correctedSuffix: "(örnek düzeltme)",
    sample: "Örnek öneri",
    explanation: "Bu bir örnek yanıttır. Gerçek veri için Grok API anahtarını ayarlayın.",
    rootGuide: "Grok API yapılandırıldığında kök/gramer rehberi görünecek.",
  },
  ar: {
    correctedSuffix: "(تصحيح تجريبي)",
    sample: "اقتراح تجريبي",
    explanation: "هذه استجابة تجريبية. أضف مفتاح Grok للحصول على بيانات حقيقية.",
    rootGuide: "سيظهر دليل الجذر/القواعد عند تهيئة Grok API.",
  },
  hi: {
    correctedSuffix: "(नमूना सुधार)",
    sample: "उदाहरण सुझाव",
    explanation: "यह एक नमूना उत्तर है। वास्तविक डेटा के लिए Grok API कुंजी सेट करें।",
    rootGuide: "Grok API सेट होने पर मूल अर्थ/व्याकरण गाइड दिखेगा।",
  },
  id: {
    correctedSuffix: "(contoh koreksi)",
    sample: "Saran contoh",
    explanation: "Ini respons contoh. Atur kunci Grok untuk data asli.",
    rootGuide: "Panduan akar/tata bahasa akan muncul setelah Grok API dikonfigurasi.",
  },
  th: {
    correctedSuffix: "(ตัวอย่างการแก้ไข)",
    sample: "ข้อเสนอแนะตัวอย่าง",
    explanation: "นี่คือคำตอบตัวอย่าง ตั้งค่า Grok API key เพื่อรับข้อมูลจริง",
    rootGuide: "คู่มือรากศัพท์/ไวยากรณ์จะแสดงเมื่อกำหนดค่า Grok API แล้ว",
  },
  vi: {
    correctedSuffix: "(chỉnh sửa mẫu)",
    sample: "Gợi ý mẫu",
    explanation: "Đây là phản hồi mẫu. Cấu hình khóa Grok để nhận dữ liệu thật.",
    rootGuide: "Hướng dẫn gốc/ngữ pháp sẽ hiển thị khi cấu hình Grok API.",
  },
};

function fallbackResult(content: string, locale: string) {
  const msg = fallbackMessages[locale] || fallbackMessages.en;
  return {
    corrected: `${content.trim()} ${msg.correctedSuffix}`,
    issues: [
      {
        type: "grammar",
        original: "sample",
        suggestion: msg.sample,
        explanation: msg.explanation,
      },
    ],
    rootMeaningGuide: msg.rootGuide,
    fallback: true,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const content = (body?.content || "").toString().trim();
    const mode: CorrectionMode = body?.mode === "sentence" ? "sentence" : "full";
    const locale = (body?.locale || "en").toString();
    const learningLanguage = (body?.learningLanguage || locale || "en").toString();
    const targetLanguage = (body?.targetLanguage || learningLanguage || locale || "en").toString();

    if (!content) {
      return NextResponse.json({ message: "content required" }, { status: 400 });
    }

    // Check for API Key presence
    if (!process.env.GROK_API_KEY) {
      console.warn("Grok API Key missing. Returning fallback sample.");
      return NextResponse.json(fallbackResult(content, locale), { status: 202 });
    }

    try {
      const aiResponse = await callGrok(content, mode, targetLanguage, locale);
      
      if (!aiResponse) {
        // Did not throw, but returned null (parse error usually)
        console.error("Grok response parsing failed.");
        throw new Error("Failed to parse AI response");
      }
      
      return NextResponse.json(aiResponse, { status: 200 });
    } catch (error) {
      console.error("AI correction failed:", error);
      // Return actual error to client so they can see "AI Error" and retry
      const status = error instanceof Error && error.name === "AbortError" ? 504 : 502;
      return NextResponse.json(
        { message: (error as Error)?.message || "AI processing failed" },
        { status }
      );
    }
  } catch (error: unknown) {
    // Top-level request parsing errors
    return NextResponse.json(
      { message: (error as Error)?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
