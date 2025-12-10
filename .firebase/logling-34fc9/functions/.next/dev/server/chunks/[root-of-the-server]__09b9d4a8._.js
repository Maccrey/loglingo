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
"[project]/Development/Loglingo/src/app/api/quiz/generate/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
    return process.env.GROK_MODEL?.trim() || "grok-2-1212";
}
function buildPrompt(title, rootMeaning, examples, uiLocale, learningLanguage) {
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

Do not add code fences, commentary, or any text outside the JSON.`;
}
async function getClient() {
    const key = process.env.GROK_API_KEY;
    if (!key) return null;
    return new __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$infrastructure$2f$api$2f$grok$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GrokClient"](key, process.env.GROK_BASE_URL);
}
async function callGrok(title, rootMeaning, examples, uiLocale, learningLanguage) {
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
                    content: "You are a helpful language learning quiz generator. Always respond with valid JSON only."
                },
                {
                    role: "user",
                    content: buildPrompt(title, rootMeaning, examples, uiLocale, learningLanguage)
                }
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
                                items: {
                                    type: "string"
                                },
                                minItems: 4,
                                maxItems: 4
                            },
                            correctIndex: {
                                type: "number",
                                minimum: 0,
                                maximum: 3
                            },
                            explanation: {
                                type: "string"
                            }
                        },
                        required: [
                            "options",
                            "correctIndex",
                            "explanation"
                        ],
                        additionalProperties: false
                    },
                    strict: true
                }
            }
        });
        try {
            return JSON.parse(response);
        } catch (error) {
            console.error("Failed to parse Grok quiz response:", error, response);
            return null;
        }
    } catch (error) {
        console.error("Grok quiz generation failed:", error);
        return null;
    } finally{
        clearTimeout(timer);
    }
}
async function POST(req) {
    try {
        const body = await req.json();
        const { title, rootMeaning, examples, uiLocale, learningLanguage } = body;
        if (!title || !rootMeaning) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "title and rootMeaning required"
            }, {
                status: 400
            });
        }
        const result = await callGrok(title, rootMeaning, examples || [], uiLocale || "en", learningLanguage || "en");
        if (!result) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Quiz generation failed"
            }, {
                status: 500
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result);
    } catch (error) {
        console.error("Quiz generation API error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Quiz generation failed"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__09b9d4a8._.js.map