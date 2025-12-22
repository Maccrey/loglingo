import * as admin from "firebase-admin";

// Firebase Admin SDK 초기화 (서버사이드 전용)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
    console.log("✅ Firebase Admin SDK initialized");
  } catch (error) {
    console.error("❌ Firebase Admin SDK initialization failed:", error);
    throw error;
  }
}

export default admin;
