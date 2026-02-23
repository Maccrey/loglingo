import { NextResponse } from "next/server";
import admin from "@/infrastructure/firebase/admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const diaryId = searchParams.get('diaryId');

    if (!diaryId) {
      return NextResponse.json({ message: "diaryId is required" }, { status: 400 });
    }

    const bucket = admin.storage().bucket();
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

    const bucket = admin.storage().bucket();
    const filePath = `diary-tts/${diaryId}.mp3`;
    const file = bucket.file(filePath);

    // 1. Check if file already exists in Firebase Storage
    const [exists] = await file.exists();
    if (exists) {
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
      });
      return NextResponse.json({ url, cached: true });
    }

    // 2. File doesn't exist, generate via OpenAI TTS
    // Add language optimization prompt if learningLanguage is provided.
    // However, the TTS API only accepts plain text without system prompts.
    // According to OpenAI docs, providing the text in the target language is usually enough.
    // If we want to strongly hint the language, we can prepend a short silent/invisible hint, 
    // but Native OpenAI TTS auto-detects based on the written text very well.
    // For now, we will just send the content. The model 'tts-1' supports multi-language.
    
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: content,
        voice: "alloy", // "alloy", "echo", "fable", "onyx", "nova", "shimmer"
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

    // 3. Save to Firebase Storage
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await file.save(buffer, {
      contentType: "audio/mpeg",
      metadata: {
        metadata: {
          originalLanguage: learningLanguage || "unknown",
        }
      }
    });

    // 4. Return the temporary signed URL (or public URL if bucket is public, but signed is safer)
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
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
