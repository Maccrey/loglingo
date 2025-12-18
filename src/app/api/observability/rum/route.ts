import { NextRequest, NextResponse } from "next/server";
import { RumMetricPayload } from "@/domain/observability";
import { persistRumMetric } from "@/infrastructure/observability/server-logger";

const headers = { "Cache-Control": "no-store, max-age=0" };

function isRumMetric(value: unknown): value is RumMetricPayload {
  if (!value || typeof value !== "object") return false;
  const metric = (value as RumMetricPayload).metric;
  const allowed = ["LCP", "CLS", "INP", "TTFB"];
  return (
    allowed.includes(metric as string) &&
    typeof (value as RumMetricPayload).value === "number" &&
    typeof (value as RumMetricPayload).sessionId === "string"
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const metric = (body as { payload?: RumMetricPayload })?.payload ?? body;

  if (!isRumMetric(metric)) {
    return NextResponse.json({ error: "invalid metric" }, { status: 400, headers });
  }

  await persistRumMetric(metric);
  return NextResponse.json({ ok: true }, { status: 200, headers });
}
