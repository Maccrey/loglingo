import { NextResponse } from "next/server";

function derive(defaultVal: number, scale: number) {
  return Math.max(0, Math.round(defaultVal * scale));
}

// Lightweight aggregate endpoint (placeholder).
// Accepts query params to shape average/target baselines without hitting external services.
// Example: /api/learning/aggregate?d=5&a=10&adv=1&score=60
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const diaries = Number(searchParams.get("d") ?? "3");
  const archives = Number(searchParams.get("a") ?? "12");
  const advice = Number(searchParams.get("adv") ?? "2");
  const score = Number(searchParams.get("score") ?? "65");

  const average = {
    diaries7d: derive(diaries || 3, 0.8) || 3,
    archivesTotal: derive(archives || 12, 0.7) || 12,
    adviceOpen: derive(advice || 2, 0.9),
    level: "B1",
    score: derive(score || 65, 0.95) || 65,
  };

  const target = {
    diaries7d: Math.max(average.diaries7d + 2, 5),
    archivesTotal: Math.max(average.archivesTotal + 5, 15),
    adviceOpen: 0,
    level: "B2",
    score: Math.min(100, average.score + 10),
  };

  return NextResponse.json(
    { average, target },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}
