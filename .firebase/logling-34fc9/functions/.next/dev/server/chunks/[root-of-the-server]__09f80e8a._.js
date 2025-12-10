module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Development/Loglingo/src/infrastructure/api/grok.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GrokClient",
    ()=>GrokClient,
    "grokClient",
    ()=>grokClient
]);
class GrokClient {
    apiKey;
    // Allow overriding via env; default to x.ai endpoint
    baseUrl;
    constructor(apiKey, baseUrl){
        this.apiKey = apiKey;
        this.baseUrl = baseUrl || "https://api.x.ai/v1/chat/completions";
    }
    async chatCompletion(request) {
        try {
            const response = await fetch(this.baseUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: request.model || "grok-1",
                    temperature: request.temperature || 0.7,
                    messages: request.messages,
                    response_format: request.response_format
                }),
                signal: request.signal
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Grok API Error: ${response.status} ${response.statusText} - ${errorText}`);
            }
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error("Grok API Request Failed:", error);
            throw error;
        }
    }
}
const grokClient = new GrokClient(process.env.GROK_API_KEY || "");
}),
"[project]/Development/Loglingo/src/app/api/ai/correct/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$infrastructure$2f$api$2f$grok$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/infrastructure/api/grok.ts [app-route] (ecmascript)");
;
;
const TIMEOUT_MS = 15000;
function getModel() {
    return process.env.GROK_MODEL?.trim() || "grok-4-fast-non-reasoning";
}
function tryParseJsonResponse(text) {
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
function safeParse(text) {
    try {
        return JSON.parse(text);
    } catch  {
        return null;
    }
}
function languageLabel(locale) {
    switch(locale){
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
function buildPrompt(content, mode, targetLanguageCode, uiLanguageCode) {
    const targetLanguage = languageLabel(targetLanguageCode);
    const uiLanguage = languageLabel(uiLanguageCode);
    return `You are a language tutor.
Target language: ${targetLanguage} (${targetLanguageCode})
UI language: ${uiLanguage} (${uiLanguageCode})
Respond with ONLY valid JSON, no prose, using this exact shape:
{
  "corrected": "<fully corrected text in target language>",
  "issues": [
    { "type": "grammar"|"word"|"style"|"other", "original": "<problem snippet>", "suggestion": "<suggestion in target language>", "explanation": "<root meaning or grammar rule in UI language>" }
  ],
  "rootMeaningGuide": "<short note of key roots/grammar patterns in UI language>"
}
Focus on ${mode === "sentence" ? "sentence-level corrections" : "overall coherence"}.
Do not add Markdown, code fences, or commentary.
Use the target language ONLY for 'corrected' and 'suggestion'. Use the UI language ONLY for 'explanation' and 'rootMeaningGuide'.
If the user's text is not in the target language, translate it while correcting. Maintain consistent language usage as specified.
User diary text:
${content}`;
}
async function getClient() {
    const key = process.env.GROK_API_KEY;
    if (!key) return null;
    return new __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$infrastructure$2f$api$2f$grok$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GrokClient"](key, process.env.GROK_BASE_URL);
}
async function callGrok(content, mode, targetLanguage, uiLanguage) {
    const client = await getClient();
    if (!client) {
        console.error("Grok client unavailable: missing GROK_API_KEY");
        return null;
    }
    const controller = new AbortController();
    const timer = setTimeout(()=>controller.abort(), TIMEOUT_MS);
    try {
        const response = await client.chatCompletion({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful language tutor. Always respond in the target language specified in the prompt, regardless of the user's input language."
                },
                {
                    role: "user",
                    content: buildPrompt(content, mode, targetLanguage, uiLanguage)
                }
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
                            corrected: {
                                type: "string"
                            },
                            issues: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        type: {
                                            type: "string",
                                            enum: [
                                                "grammar",
                                                "word",
                                                "style",
                                                "other"
                                            ]
                                        },
                                        original: {
                                            type: "string"
                                        },
                                        suggestion: {
                                            type: "string"
                                        },
                                        explanation: {
                                            type: "string"
                                        }
                                    },
                                    required: [
                                        "type",
                                        "original",
                                        "suggestion",
                                        "explanation"
                                    ],
                                    additionalProperties: false
                                }
                            },
                            rootMeaningGuide: {
                                type: "string"
                            }
                        },
                        required: [
                            "corrected",
                            "issues"
                        ],
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
    } finally{
        clearTimeout(timer);
    }
}
const fallbackMessages = {
    en: {
        correctedSuffix: "(sample correction)",
        sample: "Sample suggestion",
        explanation: "This is a mock explanation. Provide real Grok API key for live data.",
        rootGuide: "Root meaning guide will appear here when Grok API is configured."
    },
    ko: {
        correctedSuffix: "(샘플 교정)",
        sample: "예시 제안",
        explanation: "샘플 응답입니다. 실제 Grok API 키를 설정하면 실데이터가 반환됩니다.",
        rootGuide: "Grok API가 설정되면 어근/문법 안내가 표시됩니다."
    },
    ja: {
        correctedSuffix: "（サンプル修正）",
        sample: "サンプル提案",
        explanation: "これはサンプルです。実際のデータを受け取るには Grok API キーを設定してください。",
        rootGuide: "Grok API を設定すると語根/文法ガイドが表示されます。"
    },
    zh: {
        correctedSuffix: "（示例校正）",
        sample: "示例建议",
        explanation: "这是示例响应。配置 Grok API 密钥后会返回真实数据。",
        rootGuide: "配置 Grok API 后会显示词根/语法提示。"
    },
    es: {
        correctedSuffix: "(corrección de muestra)",
        sample: "Sugerencia de muestra",
        explanation: "Esta es una respuesta de ejemplo. Configura la clave de Grok para datos reales.",
        rootGuide: "La guía aparecerá cuando se configure Grok API."
    },
    pt: {
        correctedSuffix: "(correção de exemplo)",
        sample: "Sugestão de exemplo",
        explanation: "Esta é uma resposta de exemplo. Configure a chave Grok para dados reais.",
        rootGuide: "O guia aparecerá quando o Grok API estiver configurado."
    },
    fr: {
        correctedSuffix: "(correction d'exemple)",
        sample: "Suggestion d'exemple",
        explanation: "Réponse de démonstration. Configurez la clé Grok pour obtenir des données réelles.",
        rootGuide: "Le guide apparaîtra quand l'API Grok sera configurée."
    },
    de: {
        correctedSuffix: "(Beispielkorrektur)",
        sample: "Beispielvorschlag",
        explanation: "Dies ist eine Beispielantwort. Konfigurieren Sie den Grok-API-Schlüssel für echte Daten.",
        rootGuide: "Die Anleitung erscheint, sobald die Grok-API eingerichtet ist."
    },
    tr: {
        correctedSuffix: "(örnek düzeltme)",
        sample: "Örnek öneri",
        explanation: "Bu bir örnek yanıttır. Gerçek veri için Grok API anahtarını ayarlayın.",
        rootGuide: "Grok API yapılandırıldığında kök/gramer rehberi görünecek."
    },
    ar: {
        correctedSuffix: "(تصحيح تجريبي)",
        sample: "اقتراح تجريبي",
        explanation: "هذه استجابة تجريبية. أضف مفتاح Grok للحصول على بيانات حقيقية.",
        rootGuide: "سيظهر دليل الجذر/القواعد عند تهيئة Grok API."
    },
    hi: {
        correctedSuffix: "(नमूना सुधार)",
        sample: "उदाहरण सुझाव",
        explanation: "यह एक नमूना उत्तर है। वास्तविक डेटा के लिए Grok API कुंजी सेट करें।",
        rootGuide: "Grok API सेट होने पर मूल अर्थ/व्याकरण गाइड दिखेगा।"
    },
    id: {
        correctedSuffix: "(contoh koreksi)",
        sample: "Saran contoh",
        explanation: "Ini respons contoh. Atur kunci Grok untuk data asli.",
        rootGuide: "Panduan akar/tata bahasa akan muncul setelah Grok API dikonfigurasi."
    },
    th: {
        correctedSuffix: "(ตัวอย่างการแก้ไข)",
        sample: "ข้อเสนอแนะตัวอย่าง",
        explanation: "นี่คือคำตอบตัวอย่าง ตั้งค่า Grok API key เพื่อรับข้อมูลจริง",
        rootGuide: "คู่มือรากศัพท์/ไวยากรณ์จะแสดงเมื่อกำหนดค่า Grok API แล้ว"
    },
    vi: {
        correctedSuffix: "(chỉnh sửa mẫu)",
        sample: "Gợi ý mẫu",
        explanation: "Đây là phản hồi mẫu. Cấu hình khóa Grok để nhận dữ liệu thật.",
        rootGuide: "Hướng dẫn gốc/ngữ pháp sẽ hiển thị khi cấu hình Grok API."
    }
};
function fallbackResult(content, locale) {
    const msg = fallbackMessages[locale] || fallbackMessages.en;
    return {
        corrected: `${content.trim()} ${msg.correctedSuffix}`,
        issues: [
            {
                type: "grammar",
                original: "sample",
                suggestion: msg.sample,
                explanation: msg.explanation
            }
        ],
        rootMeaningGuide: msg.rootGuide,
        fallback: true
    };
}
async function POST(req) {
    try {
        const body = await req.json();
        const content = (body?.content || "").toString().trim();
        const mode = body?.mode === "sentence" ? "sentence" : "full";
        const locale = (body?.locale || "en").toString();
        const learningLanguage = (body?.learningLanguage || locale || "en").toString();
        const targetLanguage = (body?.targetLanguage || learningLanguage || locale || "en").toString();
        if (!content) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "content required"
            }, {
                status: 400
            });
        }
        try {
            const aiResponse = await callGrok(content, mode, targetLanguage, locale);
            if (!aiResponse) {
                console.warn("Grok returned null/failed to parse. Falling back.", {
                    model: getModel()
                });
            }
            const result = aiResponse || fallbackResult(content, locale);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result, {
                status: aiResponse ? 200 : 202
            });
        } catch (error) {
            console.error("AI correction failed, returning fallback:", error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(fallbackResult(content, locale), {
                status: 202
            });
        }
    } catch (error) {
        const status = error instanceof Error && error.name === "AbortError" ? 504 : 500;
        return __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: error?.message || "AI correction failed"
        }, {
            status
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__09f80e8a._.js.map