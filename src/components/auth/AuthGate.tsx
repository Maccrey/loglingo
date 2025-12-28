"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useAuth } from "@/application/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoginModal } from "@/components/auth/LoginModal";
import { SignupModal } from "@/components/auth/SignupModal";
import { PasswordResetModal } from "@/components/auth/PasswordResetModal";
import { routing } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Languages, Loader2, NotebookPen, ShieldCheck, Sparkles } from "lucide-react";

type AuthGateProps = {
  children: ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const { user, loading } = useAuth();
  const t = useTranslations("auth");
  const locale = useLocale();
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  if (!user) {
    const steps = [
      { icon: NotebookPen, text: t("steps.write") },
      { icon: Sparkles, text: t("steps.review") },
      { icon: ShieldCheck, text: t("steps.save") },
    ];

    return (
      <>
        <div className="flex min-h-screen items-center justify-center px-4 py-10">
          <Card className="w-full max-w-4xl border-white/10 bg-gradient-to-b from-white/5 to-white/0">
            <CardHeader className="space-y-3 text-center">
              <CardTitle className="text-3xl font-bold text-foreground">{t("title")}</CardTitle>
              <p className="text-sm text-muted-foreground">{t("description")}</p>
              <p className="text-sm font-medium text-primary">{t("requirement")}</p>
              <p className="text-xs text-muted-foreground">{t("after_login")}</p>
            </CardHeader>

            <CardContent className="grid gap-4 md:grid-cols-3">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.text}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <Icon className="h-5 w-5 text-primary" aria-hidden />
                    <p className="text-sm leading-relaxed text-foreground">{step.text}</p>
                  </div>
                );
              })}
              <div className="md:col-span-3">
                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <Languages className="h-5 w-5 text-primary" aria-hidden />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("languages_label")}</p>
                    <p className="text-sm text-muted-foreground">{languageList}</p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col items-center gap-3">
              <Button
                size="lg"
                className="w-full !bg-orange-500 !text-white hover:!bg-orange-600 !border !border-orange-400 !shadow-lg !shadow-orange-500/20 md:w-auto font-bold"
                onClick={() => setIsLoginOpen(true)}
              >
                {t("cta")}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onSwitchToSignup={() => {
            setIsLoginOpen(false);
            setIsSignupOpen(true);
          }}
          onSwitchToPasswordReset={() => {
            setIsLoginOpen(false);
            setIsPasswordResetOpen(true);
          }}
        />

        <SignupModal
          isOpen={isSignupOpen}
          onClose={() => setIsSignupOpen(false)}
          onSwitchToLogin={() => {
            setIsSignupOpen(false);
            setIsLoginOpen(true);
          }}
        />

        <PasswordResetModal
          isOpen={isPasswordResetOpen}
          onClose={() => setIsPasswordResetOpen(false)}
          onSwitchToLogin={() => {
            setIsPasswordResetOpen(false);
            setIsLoginOpen(true);
          }}
        />
      </>
    );
  }

  return <>{children}</>;
}
