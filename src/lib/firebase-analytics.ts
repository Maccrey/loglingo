"use client";

import { getAnalytics, isSupported, logEvent, Analytics } from "firebase/analytics";
import { app } from "./firebase";

let analyticsInstance: Analytics | null = null;
let supportCheck: Promise<boolean> | null = null;

async function ensureAnalytics(): Promise<Analytics | null> {
  if (analyticsInstance) return analyticsInstance;
  if (typeof window === "undefined") return null;

  if (!supportCheck) {
    supportCheck = isSupported().catch(() => false);
  }
  const supported = await supportCheck;
  if (!supported) return null;

  analyticsInstance = getAnalytics(app);
  return analyticsInstance;
}

export async function logAnalyticsEvent(event: string, params?: Record<string, unknown>) {
  const instance = await ensureAnalytics();
  if (!instance) return;
  logEvent(instance, event, params);
}
