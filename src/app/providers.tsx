"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { Toaster } from "@/components/ui/Toast";
import { AuthProvider } from "@/application/auth/AuthProvider";
import { LearningLanguageProvider } from "@/application/i18n/LearningLanguageProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LearningLanguageProvider>{children}</LearningLanguageProvider>
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  );
}
