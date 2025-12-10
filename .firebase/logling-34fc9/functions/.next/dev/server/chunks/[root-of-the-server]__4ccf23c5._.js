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
"[project]/Development/Loglingo/src/infrastructure/observability/sentry-server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildSentryEnvelope",
    ()=>buildSentryEnvelope,
    "parseSentryDsn",
    ()=>parseSentryDsn,
    "sendSentryEvent",
    ()=>sendSentryEvent
]);
function fallbackId() {
    return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
}
function parseSentryDsn(dsn) {
    try {
        const url = new URL(dsn);
        const projectId = url.pathname.replace("/", "");
        if (!projectId) return null;
        if (!url.username) return null;
        return {
            protocol: url.protocol.replace(":", ""),
            host: url.host,
            projectId,
            key: url.username
        };
    } catch  {
        return null;
    }
}
function parseStack(stack) {
    if (!stack) return undefined;
    const frames = stack.split("\n").slice(1).map((line)=>line.trim()).map((line)=>{
        const withFunction = line.match(/^at (.+?) \((.*):(\d+):(\d+)\)$/);
        const withoutFunction = line.match(/^at (.*):(\d+):(\d+)$/);
        if (withFunction) {
            return {
                function: withFunction[1],
                filename: withFunction[2],
                lineno: Number(withFunction[3]),
                colno: Number(withFunction[4])
            };
        }
        if (withoutFunction) {
            return {
                filename: withoutFunction[1],
                lineno: Number(withoutFunction[2]),
                colno: Number(withoutFunction[3])
            };
        }
        return null;
    }).filter(Boolean);
    return frames.length > 0 ? {
        frames
    } : undefined;
}
function buildSentryEnvelope(dsn, event) {
    const parsed = parseSentryDsn(dsn);
    if (!parsed) return null;
    const eventId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : fallbackId();
    const header = {
        event_id: eventId,
        dsn,
        sent_at: new Date().toISOString(),
        sdk: {
            name: "loglingo-sentry-lite",
            version: "0.1.0"
        }
    };
    const payload = {
        event_id: eventId,
        timestamp: Date.now() / 1000,
        level: event.level ?? "error",
        platform: "javascript",
        message: {
            formatted: event.message
        },
        tags: {
            type: event.type ?? "log"
        },
        exception: event.stack ? {
            values: [
                {
                    type: "Error",
                    value: event.message,
                    stacktrace: parseStack(event.stack)
                }
            ]
        } : undefined,
        extra: event.context
    };
    const body = `${JSON.stringify(header)}\n${JSON.stringify({
        type: "event"
    })}\n${JSON.stringify(payload)}`;
    const url = `${parsed.protocol}://${parsed.host}/api/${parsed.projectId}/envelope/`;
    return {
        url,
        body
    };
}
async function sendSentryEvent(event) {
    const dsn = process.env.SENTRY_DSN;
    if (!dsn) return false;
    const envelope = buildSentryEnvelope(dsn, event);
    if (!envelope) return false;
    try {
        await fetch(envelope.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-sentry-envelope"
            },
            body: envelope.body
        });
        return true;
    } catch (error) {
        console.error("Sentry send failed", error);
        return false;
    }
}
}),
"[project]/Development/Loglingo/src/infrastructure/observability/server-logger.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "persistClientLog",
    ()=>persistClientLog,
    "persistRumMetric",
    ()=>persistRumMetric
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$infrastructure$2f$observability$2f$sentry$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/infrastructure/observability/sentry-server.ts [app-route] (ecmascript)");
;
function formatRum(metric) {
    const detail = {
        value: metric.value,
        path: metric.pathname,
        nav: metric.navigationType,
        visibility: metric.visibilityState,
        ect: metric.effectiveConnectionType
    };
    console.info(`[RUM] ${metric.metric}`, detail);
}
async function persistRumMetric(metric) {
    formatRum(metric);
}
async function persistClientLog(event) {
    if (event.level === "error") {
        console.error("[client-error]", event.message, event.context, event.stack);
    } else if (event.level === "warn") {
        console.warn("[client-log]", event.message, event.context);
    } else {
        console.info("[client-log]", event.message, event.context);
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$infrastructure$2f$observability$2f$sentry$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendSentryEvent"])(event);
}
}),
"[project]/Development/Loglingo/src/app/api/observability/log/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$infrastructure$2f$observability$2f$server$2d$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/infrastructure/observability/server-logger.ts [app-route] (ecmascript)");
;
;
const headers = {
    "Cache-Control": "no-store, max-age=0"
};
function isClientLog(value) {
    if (!value || typeof value !== "object") return false;
    const level = value.level;
    const message = value.message;
    return (level === "info" || level === "warn" || level === "error") && typeof message === "string" && message.length > 0;
}
async function POST(req) {
    const body = await req.json().catch(()=>null);
    const payload = body?.payload ?? body;
    if (!isClientLog(payload)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "invalid payload"
        }, {
            status: 400,
            headers
        });
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$infrastructure$2f$observability$2f$server$2d$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["persistClientLog"])(payload);
    return __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: true
    }, {
        status: 200,
        headers
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4ccf23c5._.js.map