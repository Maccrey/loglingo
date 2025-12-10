(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__5df3da88._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/Development/Loglingo/messages/en.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"common":{"save":"Save","cancel":"Cancel","loading":"Loading...","error":"An error occurred","success":"Success"},"nav":{"home":"Home","diary":"Diary","write":"Write","archive":"Learn","settings":"Settings"},"home":{"title":"Master Languages with AI Diary","subtitle":"Write your daily life, get AI corrections, and build your personal learning archive.","start":"Start Writing","features":{"write":"Write Daily","write_desc":"Keep a diary in your target language with photos.","correct":"AI Correction","correct_desc":"Get instant feedback on grammar and natural expressions.","learn":"Personal Archive","learn_desc":"Review your mistakes and learn from personalized quizzes."}},"diary":{"title":"My Diary","new_entry":"New Entry","empty":"No diary entries yet. Start writing!"},"write":{"title":"New Entry","placeholder":"Write your diary here...","ai_check":"AI Check","upload_image":"Upload Image"},"archive":{"title":"Learning Archive","grammar":"Grammar Patterns","vocabulary":"Vocabulary","empty":"No items in archive yet."},"settings":{"title":"Settings","ui_language":"Native Language (UI)","learning_language":"Learning Language","theme":"Theme","dark":"Dark","light":"Light"}});}),
"[project]/Development/Loglingo/messages/ko.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"common":{"save":"저장","cancel":"취소","loading":"로딩 중...","error":"오류가 발생했습니다","success":"성공"},"nav":{"home":"홈","diary":"일기","write":"쓰기","archive":"학습","settings":"설정"},"home":{"title":"AI 일기로 언어 마스터하기","subtitle":"일상을 기록하고, AI 교정을 받고, 나만의 학습 아카이브를 만드세요.","start":"일기 쓰기 시작","features":{"write":"매일 쓰기","write_desc":"목표 언어로 사진과 함께 일기를 작성하세요.","correct":"AI 교정","correct_desc":"문법과 자연스러운 표현에 대한 즉각적인 피드백을 받으세요.","learn":"개인 아카이브","learn_desc":"실수를 복습하고 맞춤형 퀴즈로 학습하세요."}},"diary":{"title":"나의 일기","new_entry":"새 일기","empty":"아직 일기가 없습니다. 작성을 시작해보세요!"},"write":{"title":"새 일기 쓰기","placeholder":"여기에 일기를 작성하세요...","ai_check":"AI 교정","upload_image":"이미지 업로드"},"archive":{"title":"학습 아카이브","grammar":"문법 패턴","vocabulary":"어휘","empty":"아카이브에 항목이 없습니다."},"settings":{"title":"설정","ui_language":"모국어 (UI)","learning_language":"학습 언어","theme":"테마","dark":"다크","light":"라이트"}});}),
"[project]/Development/Loglingo/src/i18n/request.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getRequestConfig$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$export__default__as__getRequestConfig$3e$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/next-intl/dist/esm/development/server/react-server/getRequestConfig.js [middleware-edge] (ecmascript) <export default as getRequestConfig>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$i18n$2f$routing$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/i18n/routing.ts [middleware-edge] (ecmascript)");
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getRequestConfig$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$export__default__as__getRequestConfig$3e$__["getRequestConfig"])(async ({ requestLocale })=>{
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;
    // Ensure that a valid locale is used
    if (!locale || !__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$i18n$2f$routing$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["routing"].locales.includes(locale)) {
        locale = __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$i18n$2f$routing$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["routing"].defaultLocale;
    }
    return {
        locale,
        messages: (await __turbopack_context__.f({
            "../../messages/en.json": {
                id: ()=>"[project]/Development/Loglingo/messages/en.json (json)",
                module: ()=>Promise.resolve().then(()=>__turbopack_context__.i("[project]/Development/Loglingo/messages/en.json (json)"))
            },
            "../../messages/ko.json": {
                id: ()=>"[project]/Development/Loglingo/messages/ko.json (json)",
                module: ()=>Promise.resolve().then(()=>__turbopack_context__.i("[project]/Development/Loglingo/messages/ko.json (json)"))
            }
        }).import(`../../messages/${locale}.json`)).default
    };
});
}),
"[project]/Development/Loglingo/src/i18n/routing.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Link",
    ()=>Link,
    "getPathname",
    ()=>getPathname,
    "redirect",
    ()=>redirect,
    "routing",
    ()=>routing,
    "usePathname",
    ()=>usePathname,
    "useRouter",
    ()=>useRouter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$export__default__as__defineRouting$3e$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/next-intl/dist/esm/development/routing/defineRouting.js [middleware-edge] (ecmascript) <export default as defineRouting>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$navigation$2f$react$2d$server$2f$createNavigation$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$export__default__as__createNavigation$3e$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/next-intl/dist/esm/development/navigation/react-server/createNavigation.js [middleware-edge] (ecmascript) <export default as createNavigation>");
;
;
const routing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$export__default__as__defineRouting$3e$__["defineRouting"])({
    // A list of all locales that are supported
    locales: [
        'en',
        'ko',
        'ja',
        'zh',
        'th',
        'vi',
        'id',
        'es',
        'pt',
        'fr',
        'de',
        'tr',
        'ar',
        'hi'
    ],
    // Used when no locale matches
    defaultLocale: 'en'
});
const { Link, redirect, usePathname, useRouter, getPathname } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$navigation$2f$react$2d$server$2f$createNavigation$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$export__default__as__createNavigation$3e$__["createNavigation"])(routing);
}),
"[project]/Development/Loglingo/src/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$middleware$2f$middleware$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/next-intl/dist/esm/development/middleware/middleware.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$i18n$2f$routing$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/i18n/routing.ts [middleware-edge] (ecmascript)");
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$middleware$2f$middleware$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$i18n$2f$routing$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["routing"]);
const config = {
    // Match only internationalized pathnames
    matcher: [
        '/',
        '/(ko|en|ja|zh|th|vi|id|es|pt|fr|de|tr|ar|hi)/:path*'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__5df3da88._.js.map