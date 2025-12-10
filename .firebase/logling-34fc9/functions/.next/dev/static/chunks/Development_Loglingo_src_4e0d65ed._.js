(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Development/Loglingo/src/domain/diary.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "validateDiaryInput",
    ()=>validateDiaryInput
]);
function validateDiaryInput(input) {
    const errors = [];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
        errors.push("invalid-date");
    }
    const trimmed = input.content.trim();
    if (!trimmed) {
        errors.push("empty-content");
    }
    if (trimmed.length > 5000) {
        errors.push("too-long");
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Development/Loglingo/src/lib/image.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "convertImageToWebP",
    ()=>convertImageToWebP,
    "getImagePreview",
    ()=>getImagePreview
]);
"use client";
const MAX_DIMENSION = 1600;
const MAX_SIZE_BYTES = 300 * 1024;
async function convertImageToWebP(file) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const image = await loadImage(file);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
        throw new Error("Failed to acquire 2D context for image conversion.");
    }
    const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    let quality = 0.9;
    let blob = await toWebPBlob(canvas, quality);
    while(blob && blob.size > MAX_SIZE_BYTES && quality > 0.4){
        quality -= 0.1;
        blob = await toWebPBlob(canvas, quality);
    }
    if (blob && blob.size > MAX_SIZE_BYTES) {
        blob = await toWebPBlob(canvas, 0.3);
    }
    if (!blob) {
        throw new Error("Failed to generate image blob.");
    }
    const optimizedFile = new File([
        blob
    ], replaceExtension(file.name, "webp"), {
        type: "image/webp"
    });
    return {
        file: optimizedFile,
        previewUrl: canvas.toDataURL("image/webp", 0.8)
    };
}
function getImagePreview(file) {
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onload = ()=>resolve(reader.result);
        reader.onerror = ()=>reject(new Error("Failed to read image preview"));
        reader.readAsDataURL(file);
    });
}
async function loadImage(file) {
    const src = await getImagePreview(file);
    return new Promise((resolve, reject)=>{
        const img = new Image();
        img.onload = ()=>resolve(img);
        img.onerror = ()=>reject(new Error("Failed to load image"));
        img.src = src;
    });
}
function replaceExtension(name, ext) {
    const base = name.includes(".") ? name.substring(0, name.lastIndexOf(".")) : name;
    return `${base}.${ext}`;
}
function toWebPBlob(canvas, quality) {
    return new Promise((resolve)=>{
        canvas.toBlob((blob)=>resolve(blob), "image/webp", Math.max(0.2, Math.min(1, quality)));
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Development/Loglingo/src/infrastructure/firebase/diary-repository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "firebaseDiaryRepository",
    ()=>firebaseDiaryRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/lib/firebase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$firebase$2f$storage$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/firebase/storage/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/@firebase/storage/dist/index.esm.js [app-client] (ecmascript)");
;
;
;
const diariesCollection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "diaries");
function mapDiary(snapshot) {
    const data = snapshot.data();
    if (!data) {
        throw new Error("Diary snapshot is missing data");
    }
    const createdAt = data.createdAt instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Timestamp"] ? data.createdAt.toDate() : new Date(data.createdAt ?? Date.now());
    const updatedAt = data.updatedAt instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Timestamp"] ? data.updatedAt.toDate() : data.updatedAt ? new Date(data.updatedAt) : undefined;
    return {
        id: snapshot.id,
        userId: data.userId,
        date: data.date,
        content: data.content,
        imageUrl: data.imageUrl,
        aiReviewed: Boolean(data.aiReviewed),
        createdAt,
        updatedAt
    };
}
async function listByUser(userId, year) {
    console.log("🔍 Diary Repository: listByUser called", {
        userId,
        year
    });
    if (!userId) {
        console.log("⚠️ Diary Repository: No userId, returning empty array");
        return [];
    }
    try {
        const constraints = [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("userId", "==", userId)
        ];
        if (year) {
            constraints.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("date", ">=", `${year}-01-01`));
            constraints.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("date", "<=", `${year}-12-31`));
        }
        // orderBy를 임시로 제거하여 인덱스 문제인지 확인
        const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(diariesCollection, ...constraints);
        console.log("🔍 Diary Repository: Executing query...");
        const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(q);
        const results = snapshot.docs.map(mapDiary);
        // 클라이언트 사이드에서 정렬
        results.sort((a, b)=>b.date.localeCompare(a.date));
        console.log("✅ Diary Repository: Query complete", {
            count: results.length,
            results: results.slice(0, 2)
        });
        return results;
    } catch (error) {
        console.error("❌ Diary Repository: Query failed", error);
        throw error;
    }
}
async function getById(userId, id) {
    const refDoc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(diariesCollection, id);
    const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(refDoc);
    if (!snapshot.exists()) return null;
    const data = mapDiary(snapshot);
    if (data.userId !== userId) return null;
    return data;
}
async function create(input) {
    const payload = {
        ...input,
        aiReviewed: Boolean(input.aiReviewed),
        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
        updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
    };
    const refDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDoc"])(diariesCollection, payload);
    const created = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(refDoc);
    return mapDiary(created);
}
async function update(id, input) {
    const refDoc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(diariesCollection, id);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(refDoc, {
        ...input,
        updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
    });
    const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(refDoc);
    return mapDiary(updated);
}
async function remove(id) {
    const refDoc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(diariesCollection, id);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteDoc"])(refDoc);
}
async function uploadDiaryImage(file, userId, onProgress) {
    const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
    const storageRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ref"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storage"], `diaryImages/${userId}/${Date.now()}-${safeName}`);
    const uploadTask = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uploadBytesResumable"])(storageRef, file, {
        contentType: file.type,
        cacheControl: "public,max-age=31536000"
    });
    return new Promise((resolve, reject)=>{
        uploadTask.on("state_changed", (snapshot)=>{
            const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);
            onProgress?.(progress);
        }, (error)=>reject(error), async ()=>{
            const url = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDownloadURL"])(uploadTask.snapshot.ref);
            resolve({
                url,
                path: uploadTask.snapshot.ref.fullPath
            });
        });
    });
}
const firebaseDiaryRepository = {
    listByUser,
    getById,
    create,
    update,
    delete: remove,
    uploadDiaryImage
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Development/Loglingo/src/application/diary/diary-service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DiaryValidationError",
    ()=>DiaryValidationError,
    "createDiary",
    ()=>createDiary,
    "deleteDiary",
    ()=>deleteDiary,
    "getDiary",
    ()=>getDiary,
    "listDiaries",
    ()=>listDiaries,
    "updateDiary",
    ()=>updateDiary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$domain$2f$diary$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/domain/diary.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$image$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/lib/image.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$infrastructure$2f$firebase$2f$diary$2d$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/infrastructure/firebase/diary-repository.ts [app-client] (ecmascript)");
"use client";
;
;
;
class DiaryValidationError extends Error {
    reasons;
    constructor(reasons){
        super("Invalid diary input");
        this.reasons = reasons;
    }
}
const repository = __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$infrastructure$2f$firebase$2f$diary$2d$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firebaseDiaryRepository"];
async function listDiaries(userId, year) {
    return repository.listByUser(userId, year);
}
async function getDiary(userId, id) {
    return repository.getById(userId, id);
}
async function createDiary(userId, payload, opts) {
    const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$domain$2f$diary$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateDiaryInput"])({
        date: payload.date,
        content: payload.content
    });
    if (!validation.valid) {
        throw new DiaryValidationError(validation.errors);
    }
    const draft = {
        userId,
        date: payload.date,
        content: payload.content.trim(),
        aiReviewed: false
    };
    if (payload.imageFile) {
        const { file } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$image$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertImageToWebP"])(payload.imageFile);
        const uploaded = await repository.uploadDiaryImage(file, userId, opts?.onUploadProgress);
        draft.imageUrl = uploaded.url;
    }
    return repository.create(draft);
}
async function updateDiary(id, userId, payload, opts) {
    const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$domain$2f$diary$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateDiaryInput"])({
        date: payload.date,
        content: payload.content
    });
    if (!validation.valid) {
        throw new DiaryValidationError(validation.errors);
    }
    const draft = {
        date: payload.date,
        content: payload.content.trim()
    };
    if (payload.removeImage) {
        draft.imageUrl = "";
    }
    if (payload.imageFile) {
        const { file } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$image$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertImageToWebP"])(payload.imageFile);
        const uploaded = await repository.uploadDiaryImage(file, userId, opts?.onUploadProgress);
        draft.imageUrl = uploaded.url;
    }
    return repository.update(id, draft);
}
async function deleteDiary(id) {
    return repository.delete(id);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Development/Loglingo/src/application/diary/hooks.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDiaryDetail",
    ()=>useDiaryDetail,
    "useDiaryList",
    ()=>useDiaryList,
    "useDiaryMutations",
    ()=>useDiaryMutations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$application$2f$diary$2f$diary$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/application/diary/diary-service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
const listKey = (userId, year)=>[
        "diaries",
        userId,
        year ?? "all"
    ];
const detailKey = (id)=>[
        "diary",
        id
    ];
function useDiaryList(userId, year, opts) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: listKey(userId, year),
        queryFn: {
            "useDiaryList.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$application$2f$diary$2f$diary$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listDiaries"])(userId, year)
        }["useDiaryList.useQuery"],
        enabled: Boolean(userId) && (opts?.enabled ?? true),
        refetchOnMount: true
    });
}
_s(useDiaryList, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useDiaryDetail(userId, id) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: detailKey(id || "new"),
        queryFn: {
            "useDiaryDetail.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$application$2f$diary$2f$diary$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDiary"])(userId, id)
        }["useDiaryDetail.useQuery"],
        enabled: Boolean(userId && id)
    });
}
_s1(useDiaryDetail, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useDiaryMutations(userId) {
    _s2();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidateLists = ()=>queryClient.invalidateQueries({
            queryKey: [
                "diaries",
                userId
            ]
        });
    const updateCachedLists = (updater)=>{
        const queries = queryClient.getQueriesData({
            queryKey: [
                "diaries",
                userId
            ]
        });
        queries.forEach(([key, value])=>{
            if (!value) return;
            const next = value.map((item)=>updater(item)).filter(Boolean);
            queryClient.setQueryData(key, next);
        });
    };
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDiaryMutations.useMutation[create]": (payload)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$application$2f$diary$2f$diary$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDiary"])(userId, payload, {
                    onUploadProgress: payload.onUploadProgress
                })
        }["useDiaryMutations.useMutation[create]"],
        onMutate: {
            "useDiaryMutations.useMutation[create]": async (variables)=>{
                await queryClient.cancelQueries({
                    queryKey: [
                        "diaries",
                        userId
                    ]
                });
                const previous = queryClient.getQueriesData({
                    queryKey: [
                        "diaries",
                        userId
                    ]
                });
                const optimistic = {
                    id: `temp-${Date.now()}`,
                    userId,
                    date: variables.date,
                    content: variables.content,
                    imageUrl: undefined,
                    aiReviewed: false,
                    createdAt: new Date()
                };
                const queries = queryClient.getQueriesData({
                    queryKey: [
                        "diaries",
                        userId
                    ]
                });
                queries.forEach({
                    "useDiaryMutations.useMutation[create]": ([key, value])=>{
                        const next = value ? [
                            optimistic,
                            ...value
                        ] : [
                            optimistic
                        ];
                        queryClient.setQueryData(key, next);
                    }
                }["useDiaryMutations.useMutation[create]"]);
                return {
                    previous
                };
            }
        }["useDiaryMutations.useMutation[create]"],
        onError: {
            "useDiaryMutations.useMutation[create]": (_err, _variables, context)=>{
                context?.previous?.forEach({
                    "useDiaryMutations.useMutation[create]": ([key, value])=>queryClient.setQueryData(key, value)
                }["useDiaryMutations.useMutation[create]"]);
            }
        }["useDiaryMutations.useMutation[create]"],
        onSuccess: {
            "useDiaryMutations.useMutation[create]": (data)=>{
                invalidateLists();
                queryClient.setQueryData(detailKey(data.id), data);
            }
        }["useDiaryMutations.useMutation[create]"]
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDiaryMutations.useMutation[update]": (args)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$application$2f$diary$2f$diary$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDiary"])(args.id, userId, args.payload, {
                    onUploadProgress: args.payload.onUploadProgress
                })
        }["useDiaryMutations.useMutation[update]"],
        onMutate: {
            "useDiaryMutations.useMutation[update]": async ({ id, payload })=>{
                await queryClient.cancelQueries({
                    queryKey: [
                        "diaries",
                        userId
                    ]
                });
                const previous = queryClient.getQueriesData({
                    queryKey: [
                        "diaries",
                        userId
                    ]
                });
                updateCachedLists({
                    "useDiaryMutations.useMutation[update]": (item)=>item.id === id ? {
                            ...item,
                            content: payload.content,
                            date: payload.date
                        } : item
                }["useDiaryMutations.useMutation[update]"]);
                return {
                    previous
                };
            }
        }["useDiaryMutations.useMutation[update]"],
        onError: {
            "useDiaryMutations.useMutation[update]": (_err, _vars, context)=>{
                context?.previous?.forEach({
                    "useDiaryMutations.useMutation[update]": ([key, value])=>queryClient.setQueryData(key, value)
                }["useDiaryMutations.useMutation[update]"]);
            }
        }["useDiaryMutations.useMutation[update]"],
        onSuccess: {
            "useDiaryMutations.useMutation[update]": (data)=>{
                invalidateLists();
                queryClient.setQueryData(detailKey(data.id), data);
            }
        }["useDiaryMutations.useMutation[update]"]
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDiaryMutations.useMutation[remove]": (id)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$application$2f$diary$2f$diary$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteDiary"])(id)
        }["useDiaryMutations.useMutation[remove]"],
        onMutate: {
            "useDiaryMutations.useMutation[remove]": async (id)=>{
                await queryClient.cancelQueries({
                    queryKey: [
                        "diaries",
                        userId
                    ]
                });
                const previous = queryClient.getQueriesData({
                    queryKey: [
                        "diaries",
                        userId
                    ]
                });
                updateCachedLists({
                    "useDiaryMutations.useMutation[remove]": (item)=>item.id === id ? null : item
                }["useDiaryMutations.useMutation[remove]"]);
                return {
                    previous
                };
            }
        }["useDiaryMutations.useMutation[remove]"],
        onError: {
            "useDiaryMutations.useMutation[remove]": (_err, _vars, context)=>{
                context?.previous?.forEach({
                    "useDiaryMutations.useMutation[remove]": ([key, value])=>queryClient.setQueryData(key, value)
                }["useDiaryMutations.useMutation[remove]"]);
            }
        }["useDiaryMutations.useMutation[remove]"],
        onSuccess: {
            "useDiaryMutations.useMutation[remove]": ()=>{
                invalidateLists();
            }
        }["useDiaryMutations.useMutation[remove]"]
    });
    return {
        create,
        update,
        remove
    };
}
_s2(useDiaryMutations, "JxOfJjdyCQxYamNcDrzBiezg78E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Development/Loglingo/src/domain/archive.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildQuizFromArchive",
    ()=>buildQuizFromArchive
]);
function buildQuizFromArchive(entry) {
    const correct = entry.rootMeaning || entry.title;
    const distractors = entry.examples.slice(0, 3).map((ex, idx)=>`${ex} (ex ${idx + 1})`);
    const options = [
        correct,
        ...distractors
    ].slice(0, 4);
    return {
        id: `${entry.id}-quiz`,
        archiveId: entry.id,
        question: `What is the key meaning/pattern for "${entry.title}"?`,
        options,
        answer: 0,
        explanation: entry.rootMeaning || entry.title
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Development/Loglingo/src/infrastructure/firebase/archive-repository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkDuplicate",
    ()=>checkDuplicate,
    "createArchive",
    ()=>createArchive,
    "listArchive",
    ()=>listArchive
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/lib/firebase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
;
;
const archiveCol = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "learning_archive");
function mapArchive(doc) {
    const data = doc.data();
    const createdAt = data.createdAt instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Timestamp"] ? data.createdAt.toDate() : new Date(data.createdAt ?? Date.now());
    return {
        id: doc.id,
        userId: data.userId,
        type: data.type,
        title: data.title,
        examples: data.examples || [],
        rootMeaning: data.rootMeaning || "",
        sourceId: data.sourceId,
        createdAt
    };
}
async function listArchive(userId, type, sourceId) {
    console.log("🔍 Archive Repository: listArchive called", {
        userId,
        type,
        sourceId
    });
    if (!userId) {
        console.log("⚠️ Archive Repository: No userId, returning empty array");
        return [];
    }
    try {
        const filters = [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("userId", "==", userId)
        ];
        if (type) filters.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("type", "==", type));
        if (sourceId) filters.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("sourceId", "==", sourceId));
        // orderBy를 임시로 제거하여 인덱스 문제인지 확인
        const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(archiveCol, ...filters);
        // 복합 쿼리의 경우 Firestore 인덱스가 필요할 수 있음
        if (sourceId) {
        // sourceId로 필터링할 때는 orderBy createdAt이 인덱스를 요구할 가능성이 높음
        // 에러 방지를 위해 orderBy("createdAt", "desc")를 함께 쿼리에 추가하고 싶지만
        // 현재 코드는 클라이언트 정렬을 사용 중이므로 이대로 유지
        }
        console.log("🔍 Archive Repository: Executing query...");
        const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(q);
        const results = snapshot.docs.map(mapArchive);
        // 클라이언트 사이드에서 정렬
        results.sort((a, b)=>b.createdAt.getTime() - a.createdAt.getTime());
        console.log("✅ Archive Repository: Query complete", {
            count: results.length,
            results: results.slice(0, 2)
        });
        return results;
    } catch (error) {
        console.error("❌ Archive Repository: Query failed", error);
        throw error;
    }
}
async function checkDuplicate(userId, title) {
    console.log("🔍 Archive Repository: checkDuplicate", {
        userId,
        title
    });
    if (!userId || !title) {
        return false;
    }
    try {
        const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(archiveCol, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("userId", "==", userId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("title", "==", title));
        const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(q);
        const exists = !snapshot.empty;
        console.log(exists ? "⚠️ Archive Repository: Duplicate found" : "✅ Archive Repository: No duplicate");
        return exists;
    } catch (error) {
        console.error("❌ Archive Repository: Check duplicate failed", error);
        return false;
    }
}
async function createArchive(input) {
    const payload = {
        ...input,
        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
    };
    const ref = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDoc"])(archiveCol, payload);
    const saved = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(archiveCol, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("__name__", "==", ref.id)));
    return saved.docs.map(mapArchive)[0];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Development/Loglingo/src/application/archive/archive-service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateQuiz",
    ()=>generateQuiz,
    "getArchives",
    ()=>getArchives,
    "saveArchiveEntry",
    ()=>saveArchiveEntry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$domain$2f$archive$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/domain/archive.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$infrastructure$2f$firebase$2f$archive$2d$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/infrastructure/firebase/archive-repository.ts [app-client] (ecmascript)");
;
;
async function saveArchiveEntry(input) {
    if (!input.title.trim()) {
        throw new Error("title-required");
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$infrastructure$2f$firebase$2f$archive$2d$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createArchive"])({
        ...input,
        examples: input.examples?.filter(Boolean) ?? [],
        rootMeaning: input.rootMeaning ?? ""
    });
}
async function getArchives(userId, type, sourceId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$infrastructure$2f$firebase$2f$archive$2d$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listArchive"])(userId, type, sourceId);
}
function generateQuiz(entry) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$domain$2f$archive$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildQuizFromArchive"])(entry);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Development/Loglingo/src/domain/quiz.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "randomizeQuizOptions",
    ()=>randomizeQuizOptions
]);
function randomizeQuizOptions(quiz) {
    const shuffled = quiz.options.map((option, index)=>({
            option,
            index
        })).sort(()=>Math.random() - 0.5);
    const newCorrectIndex = shuffled.findIndex((item)=>item.index === quiz.correctIndex);
    return {
        ...quiz,
        options: shuffled.map((item)=>item.option),
        correctIndex: newCorrectIndex
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Development/Loglingo/src/infrastructure/firebase/quiz-repository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createQuiz",
    ()=>createQuiz,
    "getQuizByArchiveId",
    ()=>getQuizByArchiveId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/lib/firebase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
;
;
const quizzesCollection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "quizzes");
function mapQuiz(snapshot) {
    const data = snapshot.data();
    const createdAt = data.createdAt instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Timestamp"] ? data.createdAt.toDate() : new Date(data.createdAt ?? Date.now());
    return {
        id: snapshot.id,
        archiveId: data.archiveId,
        question: data.question,
        options: data.options || [],
        correctIndex: data.correctIndex ?? 0,
        explanation: data.explanation || "",
        createdAt
    };
}
async function getQuizByArchiveId(archiveId) {
    console.log("🔍 Quiz Repository: getQuizByArchiveId called", {
        archiveId
    });
    if (!archiveId) {
        console.log("⚠️ Quiz Repository: No archiveId provided");
        return null;
    }
    try {
        const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(quizzesCollection, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("archiveId", "==", archiveId));
        const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(q);
        if (snapshot.empty) {
            console.log("📭 Quiz Repository: No quiz found for archiveId", archiveId);
            return null;
        }
        const quiz = mapQuiz(snapshot.docs[0]);
        console.log("✅ Quiz Repository: Quiz found", {
            quizId: quiz.id
        });
        return quiz;
    } catch (error) {
        console.error("❌ Quiz Repository: Query failed", error);
        return null;
    }
}
async function createQuiz(draft) {
    console.log("💾 Quiz Repository: Creating quiz", {
        archiveId: draft.archiveId
    });
    const payload = {
        ...draft,
        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
    };
    const docRef = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDoc"])(quizzesCollection, payload);
    const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(quizzesCollection, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("__name__", "==", docRef.id)));
    const quiz = mapQuiz(snapshot.docs[0]);
    console.log("✅ Quiz Repository: Quiz created", {
        quizId: quiz.id
    });
    return quiz;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Development/Loglingo/src/application/quiz/quiz-service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getOrGenerateQuiz",
    ()=>getOrGenerateQuiz
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$domain$2f$quiz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/domain/quiz.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$infrastructure$2f$firebase$2f$quiz$2d$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/infrastructure/firebase/quiz-repository.ts [app-client] (ecmascript)");
;
;
async function generateQuizWithGrok(request) {
    try {
        const response = await fetch("/api/quiz/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        });
        if (!response.ok) {
            console.error("Quiz generation API failed:", response.status);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Quiz generation request failed:", error);
        return null;
    }
}
async function getOrGenerateQuiz(archiveId, title, rootMeaning, examples, question, uiLocale, learningLanguage) {
    console.log("🎯 Quiz Service: getOrGenerateQuiz", {
        archiveId,
        title
    });
    // 1. Check if quiz exists in Firebase
    const existingQuiz = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$infrastructure$2f$firebase$2f$quiz$2d$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQuizByArchiveId"])(archiveId);
    if (existingQuiz) {
        console.log("✅ Quiz Service: Found existing quiz", {
            quizId: existingQuiz.id
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$domain$2f$quiz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["randomizeQuizOptions"])(existingQuiz);
    }
    console.log("🤖 Quiz Service: No quiz found, generating with Grok AI...");
    // 2. Generate quiz with Grok AI
    const generated = await generateQuizWithGrok({
        title,
        rootMeaning,
        examples,
        uiLocale,
        learningLanguage
    });
    if (!generated) {
        console.error("❌ Quiz Service: Quiz generation failed");
        return null;
    }
    // 3. Save to Firebase
    const draft = {
        archiveId,
        question,
        options: generated.options,
        correctIndex: generated.correctIndex,
        explanation: generated.explanation
    };
    const savedQuiz = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$infrastructure$2f$firebase$2f$quiz$2d$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createQuiz"])(draft);
    console.log("💾 Quiz Service: Quiz saved to Firebase", {
        quizId: savedQuiz.id
    });
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$domain$2f$quiz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["randomizeQuizOptions"])(savedQuiz);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Development/Loglingo/src/application/archive/hooks.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useArchiveList",
    ()=>useArchiveList,
    "useArchiveMutations",
    ()=>useArchiveMutations,
    "useQuiz",
    ()=>useQuiz
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$application$2f$archive$2f$archive$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/application/archive/archive-service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$application$2f$quiz$2f$quiz$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/application/quiz/quiz-service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function useArchiveList(userId, type, opts) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "archives",
            userId,
            type ?? "all",
            opts?.sourceId ?? "all"
        ],
        queryFn: {
            "useArchiveList.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$application$2f$archive$2f$archive$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getArchives"])(userId, type, opts?.sourceId)
        }["useArchiveList.useQuery"],
        enabled: (opts?.enabled ?? true) && Boolean(userId),
        staleTime: 60_000,
        refetchOnMount: true
    });
}
_s(useArchiveList, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useArchiveMutations(userId) {
    _s1();
    const client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$application$2f$archive$2f$archive$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveArchiveEntry"],
        onSuccess: {
            "useArchiveMutations.useMutation[create]": ()=>client.invalidateQueries({
                    queryKey: [
                        "archives",
                        userId
                    ]
                })
        }["useArchiveMutations.useMutation[create]"]
    });
    return {
        create
    };
}
_s1(useArchiveMutations, "SXjTOl00DvFpJwkPY9s4dXJBz2E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useQuiz(entry, translatedQuestion, uiLocale, learningLanguage) {
    _s2();
    const [quiz, setQuiz] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useQuiz.useEffect": ()=>{
            if (!entry || !translatedQuestion) {
                setQuiz(null);
                setIsLoading(false);
                return;
            }
            let cancelled = false;
            async function loadQuiz() {
                if (!entry || !translatedQuestion) return;
                setIsLoading(true);
                setError(null);
                try {
                    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$application$2f$quiz$2f$quiz$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOrGenerateQuiz"])(entry.id, entry.title, entry.rootMeaning || entry.title, entry.examples || [], translatedQuestion, uiLocale || "en", learningLanguage || "en");
                    if (!cancelled) {
                        setQuiz(result);
                        if (!result) {
                            setError("Quiz generation failed");
                        }
                    }
                } catch (err) {
                    if (!cancelled) {
                        console.error("Quiz loading error:", err);
                        setError("Failed to load quiz");
                        setQuiz(null);
                    }
                } finally{
                    if (!cancelled) {
                        setIsLoading(false);
                    }
                }
            }
            loadQuiz();
            return ({
                "useQuiz.useEffect": ()=>{
                    cancelled = true;
                }
            })["useQuiz.useEffect"];
        }
    }["useQuiz.useEffect"], [
        entry?.id,
        translatedQuestion,
        uiLocale,
        learningLanguage
    ]);
    return {
        quiz,
        isLoading,
        error
    };
}
_s2(useQuiz, "9cUOX96D46kjPVbvFV0YNdNmjrw=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Development/Loglingo/src/lib/current-user.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCurrentUserId",
    ()=>getCurrentUserId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/lib/firebase.ts [app-client] (ecmascript)");
;
function getCurrentUserId() {
    if (("TURBOPACK compile-time value", "object") !== "undefined" && __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"].currentUser?.uid) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"].currentUser.uid;
    }
    return "demo-user";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Development/Loglingo/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Development/Loglingo/src/components/ui/Card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("glass-card bg-white/5 text-card-foreground p-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Development/Loglingo/src/components/ui/Card.tsx",
        lineNumber: 8,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Card;
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 pb-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Development/Loglingo/src/components/ui/Card.tsx",
        lineNumber: 23,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = CardHeader;
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("font-semibold leading-none tracking-tight text-lg", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Development/Loglingo/src/components/ui/Card.tsx",
        lineNumber: 35,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = CardTitle;
CardTitle.displayName = "CardTitle";
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Development/Loglingo/src/components/ui/Card.tsx",
        lineNumber: 47,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = CardContent;
CardContent.displayName = "CardContent";
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center pt-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Development/Loglingo/src/components/ui/Card.tsx",
        lineNumber: 55,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = CardFooter;
CardFooter.displayName = "CardFooter";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "Card$React.forwardRef");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "CardHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "CardHeader");
__turbopack_context__.k.register(_c4, "CardTitle$React.forwardRef");
__turbopack_context__.k.register(_c5, "CardTitle");
__turbopack_context__.k.register(_c6, "CardContent$React.forwardRef");
__turbopack_context__.k.register(_c7, "CardContent");
__turbopack_context__.k.register(_c8, "CardFooter$React.forwardRef");
__turbopack_context__.k.register(_c9, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Development/Loglingo/src/components/ui/Button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
;
;
;
;
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref)=>{
    const variants = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-white/10 text-foreground",
        glass: "glass hover:bg-white/10 text-foreground active:scale-95 transition-transform",
        destructive: "bg-red-500 text-white hover:bg-red-600"
    };
    const sizes = {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-8 text-lg",
        icon: "h-10 w-10 p-2 flex items-center justify-center"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className),
        ref: ref,
        disabled: isLoading || props.disabled,
        ...props,
        children: [
            isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                className: "mr-2 h-4 w-4 animate-spin"
            }, void 0, false, {
                fileName: "[project]/Development/Loglingo/src/components/ui/Button.tsx",
                lineNumber: 41,
                columnNumber: 23
            }, ("TURBOPACK compile-time value", void 0)),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/Development/Loglingo/src/components/ui/Button.tsx",
        lineNumber: 30,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Development/Loglingo/src/components/auth/AuthGate.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthGate",
    ()=>AuthGate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$application$2f$auth$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/application/auth/AuthProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/components/ui/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$i18n$2f$routing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/i18n/routing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/use-intl/dist/esm/development/react.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/next-intl/dist/esm/development/react-client/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$languages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Languages$3e$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/lucide-react/dist/esm/icons/languages.js [app-client] (ecmascript) <export default as Languages>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$notebook$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__NotebookPen$3e$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/lucide-react/dist/esm/icons/notebook-pen.js [app-client] (ecmascript) <export default as NotebookPen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function AuthGate({ children }) {
    _s();
    const { user, loading, signInWithGoogle } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$application$2f$auth$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])("auth");
    const locale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const languageList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthGate.useMemo[languageList]": ()=>{
            try {
                const displayNames = new Intl.DisplayNames([
                    locale
                ], {
                    type: "language"
                });
                return __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$i18n$2f$routing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["routing"].locales.map({
                    "AuthGate.useMemo[languageList]": (code)=>displayNames.of(code) || code
                }["AuthGate.useMemo[languageList]"]).join(" · ");
            } catch (_error) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$i18n$2f$routing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["routing"].locales.join(" · ");
            }
        }
    }["AuthGate.useMemo[languageList]"], [
        locale
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "h-6 w-6 animate-spin text-primary",
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/Development/Loglingo/src/components/auth/AuthGate.tsx",
                    lineNumber: 34,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-muted-foreground",
                    children: t("loading")
                }, void 0, false, {
                    fileName: "[project]/Development/Loglingo/src/components/auth/AuthGate.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Development/Loglingo/src/components/auth/AuthGate.tsx",
            lineNumber: 33,
            columnNumber: 7
        }, this);
    }
    if (!user) {
        const steps = [
            {
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$notebook$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__NotebookPen$3e$__["NotebookPen"],
                text: t("steps.write")
            },
            {
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"],
                text: t("steps.review")
            },
            {
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"],
                text: t("steps.save")
            }
        ];
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center px-4 py-10",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                className: "w-full max-w-4xl border-white/10 bg-gradient-to-b from-white/5 to-white/0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                        className: "space-y-3 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                className: "text-3xl font-bold text-foreground",
                                children: t("title")
                            }, void 0, false, {
                                fileName: "[project]/Development/Loglingo/src/components/auth/AuthGate.tsx",
                                lineNumber: 51,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-muted-foreground",
                                children: t("description")
                            }, void 0, false, {
                                fileName: "[project]/Development/Loglingo/src/components/auth/AuthGate.tsx",
                                lineNumber: 52,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-medium text-primary",
                                children: t("requirement")
                            }, void 0, false, {
                                fileName: "[project]/Development/Loglingo/src/components/auth/AuthGate.tsx",
                                lineNumber: 53,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-muted-foreground",
                                children: t("after_login")
                            }, void 0, false, {
                                fileName: "[project]/Development/Loglingo/src/components/auth/AuthGate.tsx",
                                lineNumber: 54,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Development/Loglingo/src/components/auth/AuthGate.tsx",
                        lineNumber: 50,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "grid gap-4 md:grid-cols-3",
                        children: [
                            steps.map((step)=>{
                                const Icon = step.icon;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            className: "h-5 w-5 text-primary",
                                            "aria-hidden": true
                                        }, void 0, false, {
                                            fileName: "[project]/Development/Loglingo/src/components/auth/AuthGate.tsx",
                                            lineNumber: 65,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm leading-relaxed text-foreground",
                                            children: step.text
                                        }, void 0, false, {
                                            fileName: "[project]/Development/Loglingo/src/components/auth/AuthGate.tsx",
                                            lineNumber: 66,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, step.text, true, {
                                    fileName: "[project]/Development/Loglingo/src/components/auth/AuthGate.tsx",
                                    lineNumber: 61,
                                    columnNumber: 17
                                }, this);
                            }),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "md:col-span-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$languages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Languages$3e$__["Languages"], {
                                            className: "h-5 w-5 text-primary",
                                            "aria-hidden": true
                                        }, void 0, false, {
                                            fileName: "[project]/Development/Loglingo/src/components/auth/AuthGate.tsx",
                                            lineNumber: 72,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-medium text-foreground",
                                                    children: t("languages_label")
                                                }, void 0, false, {
                                                    fileName: "[project]/Development/Loglingo/src/components/auth/AuthGate.tsx",
                                                    lineNumber: 74,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-muted-foreground",
                                                    children: languageList
                                                }, void 0, false, {
                                                    fileName: "[project]/Development/Loglingo/src/components/auth/AuthGate.tsx",
                                                    lineNumber: 75,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Development/Loglingo/src/components/auth/AuthGate.tsx",
                                            lineNumber: 73,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Development/Loglingo/src/components/auth/AuthGate.tsx",
                                    lineNumber: 71,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Development/Loglingo/src/components/auth/AuthGate.tsx",
                                lineNumber: 70,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Development/Loglingo/src/components/auth/AuthGate.tsx",
                        lineNumber: 57,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardFooter"], {
                        className: "flex flex-col items-center gap-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            size: "lg",
                            className: "w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/60 shadow-lg shadow-primary/30 md:w-auto",
                            onClick: ()=>signInWithGoogle(),
                            children: t("cta")
                        }, void 0, false, {
                            fileName: "[project]/Development/Loglingo/src/components/auth/AuthGate.tsx",
                            lineNumber: 82,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Development/Loglingo/src/components/auth/AuthGate.tsx",
                        lineNumber: 81,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Development/Loglingo/src/components/auth/AuthGate.tsx",
                lineNumber: 49,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Development/Loglingo/src/components/auth/AuthGate.tsx",
            lineNumber: 48,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(AuthGate, "HUqoSdPF6x//A9cgzmb+f3afX+Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$application$2f$auth$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"]
    ];
});
_c = AuthGate;
var _c;
__turbopack_context__.k.register(_c, "AuthGate");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Development/Loglingo/src/lib/intl-format.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatDate",
    ()=>formatDate,
    "formatNumber",
    ()=>formatNumber
]);
function formatDate(value, locale) {
    const date = typeof value === "string" ? new Date(`${value}T00:00:00`) : value;
    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric"
    }).format(date);
}
function formatNumber(value, locale) {
    return new Intl.NumberFormat(locale).format(value);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DiaryViewPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$application$2f$diary$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/application/diary/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$application$2f$archive$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/application/archive/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$current$2d$user$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/lib/current-user.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/components/ui/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/next-intl/dist/esm/development/react-client/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$auth$2f$AuthGate$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/components/auth/AuthGate.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$i18n$2f$routing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/i18n/routing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$archive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Archive$3e$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/lucide-react/dist/esm/icons/archive.js [app-client] (ecmascript) <export default as Archive>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-client] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$intl$2d$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/src/lib/intl-format.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Development/Loglingo/node_modules/use-intl/dist/esm/development/react.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
function DiaryViewPage({ params }) {
    _s();
    const { id } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(params);
    const userId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$current$2d$user$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserId"])();
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])("diary");
    const tArchive = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])("archive");
    const locale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$i18n$2f$routing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { data, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$application$2f$diary$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDiaryDetail"])(userId, id);
    const { data: archives = [], isLoading: archivesLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$application$2f$archive$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useArchiveList"])(userId, undefined, {
        sourceId: id
    });
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$auth$2f$AuthGate$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthGate"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                className: "max-w-3xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                            children: t("loading")
                        }, void 0, false, {
                            fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                            lineNumber: 32,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                        lineNumber: 31,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-32 animate-pulse rounded-lg bg-white/5"
                        }, void 0, false, {
                            fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                            lineNumber: 35,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                        lineNumber: 34,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                lineNumber: 30,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this);
    }
    if (!data) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$auth$2f$AuthGate$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthGate"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                className: "max-w-3xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                            children: t("not_found")
                        }, void 0, false, {
                            fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                            lineNumber: 47,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                        lineNumber: 46,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-muted-foreground",
                            children: t("not_found_desc")
                        }, void 0, false, {
                            fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                            lineNumber: 50,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                        lineNumber: 49,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                lineNumber: 45,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
            lineNumber: 44,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$auth$2f$AuthGate$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthGate"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-3xl space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "sm",
                                            onClick: ()=>router.push("/diary"),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                                    className: "mr-2 h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                                    lineNumber: 69,
                                                    columnNumber: 17
                                                }, this),
                                                t("back")
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                            lineNumber: 64,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "secondary",
                                            size: "sm",
                                            onClick: ()=>router.push(`/diary/${id}/edit`),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"], {
                                                    className: "mr-2 h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                                    lineNumber: 77,
                                                    columnNumber: 17
                                                }, this),
                                                t("edit")
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                            lineNumber: 72,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                    lineNumber: 63,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                    className: "text-2xl mt-4",
                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$lib$2f$intl$2d$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(new Date(`${data.date}T00:00:00`), locale)
                                }, void 0, false, {
                                    fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                    lineNumber: 81,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "space-y-4",
                            children: [
                                data.imageUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: data.imageUrl,
                                    alt: "Diary image",
                                    width: 1200,
                                    height: 800,
                                    className: "w-full rounded-lg object-cover",
                                    loading: "lazy"
                                }, void 0, false, {
                                    fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                    lineNumber: 87,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "whitespace-pre-wrap text-foreground leading-relaxed",
                                    children: data.content
                                }, void 0, false, {
                                    fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                    lineNumber: 96,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                    lineNumber: 61,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$archive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Archive$3e$__["Archive"], {
                                        className: "h-5 w-5 text-primary"
                                    }, void 0, false, {
                                        fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                        lineNumber: 106,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                        children: tArchive("title")
                                    }, void 0, false, {
                                        fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                        lineNumber: 107,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                lineNumber: 105,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                            lineNumber: 104,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                            children: archivesLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-20 animate-pulse rounded-lg bg-white/5"
                            }, void 0, false, {
                                fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                lineNumber: 112,
                                columnNumber: 15
                            }, this) : archives.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-muted-foreground mb-3",
                                        children: "이 일기에서 저장된 학습 항목들"
                                    }, void 0, false, {
                                        fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                        lineNumber: 115,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar",
                                        children: archives.map((archive)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-lg border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition-colors cursor-pointer",
                                                onClick: ()=>router.push("/archive"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-medium text-foreground",
                                                                    children: archive.title
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                                                    lineNumber: 127,
                                                                    columnNumber: 27
                                                                }, this),
                                                                archive.rootMeaning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-muted-foreground mt-1",
                                                                    children: archive.rootMeaning
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                                                    lineNumber: 131,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                                            lineNumber: 126,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs px-2 py-1 rounded-full bg-primary/10 text-primary",
                                                            children: archive.type === "grammar" ? "문법" : "단어"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                                            lineNumber: 136,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                                    lineNumber: 125,
                                                    columnNumber: 23
                                                }, this)
                                            }, archive.id, false, {
                                                fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                                lineNumber: 120,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                        lineNumber: 118,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                lineNumber: 114,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center py-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                        className: "h-8 w-8 text-muted-foreground mx-auto mb-2"
                                    }, void 0, false, {
                                        fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                        lineNumber: 146,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-muted-foreground",
                                        children: "아직 저장된 학습 항목이 없습니다"
                                    }, void 0, false, {
                                        fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                        lineNumber: 147,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground mt-1",
                                        children: "AI 교정을 사용하면 자동으로 저장됩니다"
                                    }, void 0, false, {
                                        fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                        lineNumber: 150,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                                lineNumber: 145,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                            lineNumber: 110,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
                    lineNumber: 103,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
            lineNumber: 59,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Development/Loglingo/src/app/[locale]/diary/[id]/page.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_s(DiaryViewPage, "bW4kALtNQQUd7z8RkClQ9OvmjQo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$i18n$2f$routing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$application$2f$diary$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDiaryDetail"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Development$2f$Loglingo$2f$src$2f$application$2f$archive$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useArchiveList"]
    ];
});
_c = DiaryViewPage;
var _c;
__turbopack_context__.k.register(_c, "DiaryViewPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Development_Loglingo_src_4e0d65ed._.js.map