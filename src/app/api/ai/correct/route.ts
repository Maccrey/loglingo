import { NextResponse } from "next/server";
import { GrokClient } from "@/infrastructure/api/grok";
import { CorrectionMode, CorrectionResult } from "@/domain/ai-correction";
import { generateLevelInsights } from "@/application/ai/level-service";

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
): string {
  const targetLanguage = languageLabel(targetLanguageCode);
  const uiLanguage = languageLabel(uiLanguageCode);
  return `You are a language tutor.
Target language: ${targetLanguage} (${targetLanguageCode})
UI language: ${uiLanguage} (${uiLanguageCode})
Respond with ONLY valid JSON, no prose, using this exact shape:
{
  "corrected": "<fully corrected text in target language>",
  "issues": [
    { "type": "grammar"|"word"|"style"|"pattern"|"other", "original": "<problem snippet>", "suggestion": "<correction>", "explanation": "<reason in UI language>", "exampleSentences": ["<example in target language>", ...], "exampleTranslations": ["<translation in UI language>", ...] }
  ],
  "rootMeaningGuide": "<short note of key roots/grammar patterns in UI language>"
}

CRITICAL INSTRUCTIONS:
1. For 'corrected' field:
   - MUST be written ENTIRELY in TARGET LANGUAGE (${targetLanguage})
   - If user mixes multiple languages, translate ALL text to target language.
   - Example: Target Korean, User "I went to school" -> Corrected "저는 학교에 갔습니다" (Korean)

2. For 'suggestion' field: 
   - MUST be written in TARGET LANGUAGE (${targetLanguage}).
   - If type is "grammar" or "style" or "other": Provide the COMPLETE CORRECTED SENTENCE. 
   - If type is "word": Provide ONLY the corrected WORD or PHRASE (do NOT provide a full sentence).
   - If type is "pattern": Provide the corrected IDIOM/PATTERN PHRASE.

3. For 'type' field:
   - "word": Use for simple vocabulary errors or better word choices.
   - "pattern": Use for IDIOMS, PHRASAL VERBS, or GRAMMAR PATTERNS that are commonly used (e.g., "used to", "look forward to", "piece of cake").
   - "grammar": Use for structural errors.

4. For 'explanation' field:
   - MUST be written ENTIRELY in UI LANGUAGE (${uiLanguage}) NO MATTER WHAT.
   - NEVER write explanation in target language.
   - If UI language is Korean, explanation MUST be Korean.
   - When mentioning the word being explained, use the TARGET LANGUAGE word (from suggestion).
   - If type is "pattern", explain the usage/nuance of the pattern in UI language.
   - Provide clear, visual metaphors for word/pattern meanings.

5. For 'exampleSentences' field (REQUIRED):
   - Array of example sentences in TARGET LANGUAGE (${targetLanguage}).
   - 3-5 practical examples.

6. For 'exampleTranslations' field (REQUIRED):
   - Array of UI LANGUAGE (${uiLanguage}) translations corresponding to exampleSentences.

Focus on ${mode === "sentence" ? "sentence-level corrections" : "overall coherence"}.
LANGUAGE RULES - DO NOT VIOLATE:
- 'corrected', 'suggestion', 'exampleSentences' → TARGET LANGUAGE (${targetLanguage}) ONLY
- 'explanation', 'rootMeaningGuide', 'exampleTranslations' → UI LANGUAGE (${uiLanguage}) ONLY
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
                    type: { type: "string", enum: ["grammar", "word", "style", "pattern", "other"] },
                    original: { type: "string" },
                    suggestion: { type: "string" },
                    explanation: { type: "string" },
                    exampleSentences: {
                      type: "array",
                      items: { type: "string" },
                      description: "Example sentences in target language (3-5 for grammar, 3-6 for word)"
                    },
                    exampleTranslations: {
                      type: "array",
                      items: { type: "string" },
                      description: "UI language translations of exampleSentences (same length as exampleSentences)"
                    }
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

      const { level, advice } = generateLevelInsights({
        result: aiResponse,
        uiLocale: locale,
        targetLanguage,
        sourceId: body?.sourceId,
      });

      const enriched: CorrectionResult = {
        ...aiResponse,
        levelAssessment: {
          level: level.level,
          score: level.score,
          confidence: level.confidence,
          rationale: level.rationale,
        },
        advice: advice.map((item) => ({
          topic: item.topic,
          priority: item.priority as string,
          message: item.message,
          relatedLevel: item.relatedLevel as import("@/domain/learning-profile").LevelBand | undefined,
        })),
      };

      return NextResponse.json(enriched, { status: 200 });
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
