import { NextResponse } from "next/server";
import admin from "@/infrastructure/firebase/admin";

/**
 * 학습 통계 집계 데이터 조회 API
 * Cloud Functions에서 주기적으로 업데이트한 stats_global/learning 문서를 반환합니다.
 * 문서가 없는 경우 fallback 데이터를 사용합니다.
 */
export async function GET() {
  try {
    const db = admin.firestore();
    const docSnap = await db.doc("stats_global/learning").get();

    if (!docSnap.exists) {
      // Fallback: Cloud Function이 아직 실행되지 않은 경우
      console.warn("⚠️ stats_global/learning document not found, using fallback data");
      return NextResponse.json(
        {
          average: {
            diaries7d: 3,
            archivesTotal: 12,
            adviceOpen: 2,
            level: "B1",
            score: 65,
          },
          target: {
            diaries7d: 5,
            archivesTotal: 17,
            adviceOpen: 0,
            level: "B2",
            score: 75,
          },
        },
        {
          status: 200,
          headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
        }
      );
    }

    const data = docSnap.data();
    return NextResponse.json(
      { average: data?.average, target: data?.target },
      {
        status: 200,
        headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
      }
    );
  } catch (error) {
    console.error("❌ Failed to fetch aggregate stats:", error);
    return NextResponse.json(
      { error: "aggregate_failed" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

