import { NextResponse } from "next/server";

// Simple aggregate placeholder: replace with real aggregation (Cloud Functions / Firestore queries)
export async function GET() {
  const response = {
    average: {
      diaries7d: 3,
      archivesTotal: 12,
      adviceOpen: 2,
      level: "B1",
      score: 65,
    },
    target: {
      diaries7d: 5,
      archivesTotal: 20,
      adviceOpen: 0,
      level: "B2",
      score: 75,
    },
  };

  return NextResponse.json(response, { status: 200, headers: { "Cache-Control": "no-store" } });
}
