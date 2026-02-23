import * as admin from "firebase-admin";

// Firebase Admin SDK 초기화 (서버사이드 전용)
// serverExternalPackages 설정으로 Cloud Functions 환경에서 node_modules의 firebase-admin을 직접 사용
if (!admin.apps.length) {
  try {
    const clientEmail = process.env.SERVICE_FIREBASE_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = (process.env.SERVICE_FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY)?.replace(/\\n/g, "\n");
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

    if (clientEmail && privateKey) {
      // 서비스 계정 env 변수가 있을 때: 명시적 credential 사용
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket,
      });
      console.log("✅ Firebase Admin SDK initialized (service account)");
    } else {
      // Cloud Functions / Cloud Run 환경: ADC 자동 사용
      admin.initializeApp({
        projectId,
        storageBucket,
      });
      console.log("✅ Firebase Admin SDK initialized (ADC)");
    }
  } catch (error) {
    console.error("❌ Firebase Admin SDK initialization failed:", error);
    throw error;
  }
}

export default admin;
