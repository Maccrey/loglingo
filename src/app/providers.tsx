"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { Toaster } from "@/components/ui/Toast";
import { AuthProvider } from "@/application/auth/AuthProvider";
import { AdProvider } from "@/application/ads/AdProvider";
import { LearningLanguageProvider } from "@/application/i18n/LearningLanguageProvider";
import { ObservabilityProvider } from "@/application/observability/ObservabilityProvider";
import { AnalyticsListener } from "@/application/analytics/AnalyticsListener";
import { LearningLanguageOnboarding } from "@/components/i18n/LearningLanguageOnboarding";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdProvider>
          <LearningLanguageProvider>
            <ObservabilityProvider>
              <AnalyticsListener />
              <LearningLanguageOnboarding />
              {children}
            </ObservabilityProvider>
          </LearningLanguageProvider>
        </AdProvider>
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  );
}
