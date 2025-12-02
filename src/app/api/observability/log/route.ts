import { NextRequest, NextResponse } from "next/server";
import { ClientLogEvent } from "@/domain/observability";
import { persistClientLog } from "@/infrastructure/observability/server-logger";

const headers = { "Cache-Control": "no-store, max-age=0" };

function isClientLog(value: unknown): value is ClientLogEvent {
  if (!value || typeof value !== "object") return false;
  const level = (value as ClientLogEvent).level;
  const message = (value as ClientLogEvent).message;
  return (
    (level === "info" || level === "warn" || level === "error") &&
    typeof message === "string" &&
    message.length > 0
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const payload = (body as { payload?: ClientLogEvent })?.payload ?? body;

  if (!isClientLog(payload)) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400, headers });
  }

  await persistClientLog(payload);
  return NextResponse.json({ ok: true }, { status: 200, headers });
}
