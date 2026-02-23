import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

// Cloud Run 기본 서비스 계정에는 signBlob 권한이 없으므로
// Firebase 서비스 계정 키를 명시적으로 사용해 Signed URL을 생성
function createStorage() {
  const clientEmail = process.env.SERVICE_FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.SERVICE_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (clientEmail && privateKey) {
    return new Storage({
      projectId,
      credentials: { client_email: clientEmail, private_key: privateKey },
    });
  }

  // ADC fallback (개발환경)
  return new Storage({ projectId });
}

const storage = createStorage();
const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const diaryId = searchParams.get('diaryId');

    if (!diaryId) {
      return NextResponse.json({ message: "diaryId is required" }, { status: 400 });
    }

    const bucket = storage.bucket(bucketName);
    const filePath = `diary-tts/${diaryId}.mp3`;
    const file = bucket.file(filePath);

    const [exists] = await file.exists();
    if (exists) {
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
      });
      return NextResponse.json({ exists: true, url });
    }

    return NextResponse.json({ exists: false });
  } catch (error: any) {
    console.error("Diary TTS Check Error:", error);
    return NextResponse.json(
      { message: "Failed to check audio" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { diaryId, content, learningLanguage } = await req.json();

    if (!diaryId || !content) {
      return NextResponse.json(
        { message: "diaryId and content are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OPENAI_API_KEY is not set.");
      return NextResponse.json(
        { message: "Server configuration error (OpenAI)" },
        { status: 500 }
      );
    }

    const bucket = storage.bucket(bucketName);
    const filePath = `diary-tts/${diaryId}.mp3`;
    const file = bucket.file(filePath);

    // 1. 이미 존재하면 Signed URL 반환
    const [exists] = await file.exists();
    if (exists) {
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
      });
      return NextResponse.json({ url, cached: true });
    }

    // 2. OpenAI TTS로 오디오 생성
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: content,
        voice: "alloy",
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI TTS API error:", errorData);
      return NextResponse.json(
        { message: "Failed to generate audio from OpenAI" },
        { status: response.status }
      );
    }

    // 3. Firebase Storage에 저장
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await file.save(buffer, {
      contentType: "audio/mpeg",
      metadata: {
        originalLanguage: learningLanguage || "unknown",
      },
    });

    // 4. Signed URL 반환 (1주일 유효)
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ url, cached: false });

  } catch (error: any) {
    console.error("Diary TTS Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
