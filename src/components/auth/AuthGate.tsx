"use client";

import { useMemo, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "@/application/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoginModal } from "@/components/auth/LoginModal";
import { SignupModal } from "@/components/auth/SignupModal";
import { PasswordResetModal } from "@/components/auth/PasswordResetModal";
import { routing, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Languages, Loader2, NotebookPen, ShieldCheck, Sparkles } from "lucide-react";

type AuthGateProps = {
  children: ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const { user, loading } = useAuth();
  const t = useTranslations("auth");
  const locale = useLocale();
  
  const router = useRouter();
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [loading, user, router]);

  const languageList = useMemo(() => {
    try {
      const displayNames = new Intl.DisplayNames([locale], { type: "language" });
      return routing.locales
        .map((code) => displayNames.of(code) || code)
        .join(" · ");
    } catch {
      return routing.locales.join(" · ");
    }
  }, [locale]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  return <>{children}</>;
}
