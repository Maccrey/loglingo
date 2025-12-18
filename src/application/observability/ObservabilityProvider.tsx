"use client";

import { useEffect, useRef } from "react";
import { startGlobalErrorReporter } from "@/infrastructure/observability/error-reporter";
import { startRumObservers } from "@/infrastructure/observability/rum-client";
import { startUptimeHeartbeat } from "@/infrastructure/observability/uptime-client";

export function ObservabilityProvider({ children }: { children: React.ReactNode }) {
  const startedRef = useRef(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DISABLE_OBSERVABILITY === "1") return;
    if (startedRef.current) return;
    startedRef.current = true;

    const stopRum = startRumObservers();
    const stopError = startGlobalErrorReporter();
    const stopUptime = startUptimeHeartbeat();

    return () => {
      stopRum();
      stopError();
      stopUptime();
    };
  }, []);

  return <>{children}</>;
}
