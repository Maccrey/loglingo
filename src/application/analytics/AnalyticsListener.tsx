"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

export function AnalyticsListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const search = searchParams?.toString();
    const pathWithQuery = search ? `${pathname}?${search}` : pathname;

    trackPageView(pathWithQuery);
  }, [pathname, searchParams]);

  return null;
}
