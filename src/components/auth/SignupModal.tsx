"use client";

import { useState } from "react";
import { useAuth } from "@/application/auth/AuthProvider";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function SignupModal({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) {
  const { signUpWithEmail, loading } = useAuth();
  const t = useTranslations("auth");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    
    // Validation
    if (!email || !email.includes("@")) {
      setError(t("error_invalid_email"));
      return;
    }
    
    if (password.length < 6) {
      setError(t("error_weak_password"));
      return;
    }
    
    if (password !== passwordConfirm) {
      setError(t("error_passwords_mismatch"));
      return;
    }
    
    setIsSubmitting(true);
    try {
      trackEvent("signup_start", { method: "email" });
      await signUpWithEmail(email, password);
      trackEvent("signup_success", { method: "email" });
      setSuccess(true);
      setEmail("");
      setPassword("");
      setPasswordConfirm("");
      
      // Auto-close after 5 seconds
      setTimeout(() => {
        handleClose();
      }, 5000);
    } catch (err: any) {
      console.error("Signup error:", err);
      trackEvent("signup_failure", { method: "email", error_code: err?.code || "unknown" });
      if (err.code === "auth/email-already-in-use") {
        setError(t("error_email_already_in_use"));
      } else if (err.code === "auth/invalid-email") {
        setError(t("error_invalid_email"));
      } else if (err.code === "auth/weak-password") {
        setError(t("error_weak_password"));
      } else {
        setError(t("error_auth_failed"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setError("");
    setSuccess(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t("signup_modal_title")}>
      {success ? (
        <div className="space-y-4 text-center py-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {t("email_verification_sent")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("back_to_login")}
            </p>
          </div>
          <Button onClick={onSwitchToLogin} className="w-full">
            {t("login_button")}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-foreground mb-1">
              {t("email")}
            </label>
            <Input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              disabled={isSubmitting || loading}
              className="w-full"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-foreground mb-1">
              {t("password")}
            </label>
            <Input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting || loading}
              className="w-full"
              autoComplete="new-password"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t("error_weak_password")}
            </p>
          </div>

          <div>
            <label htmlFor="signup-password-confirm" className="block text-sm font-medium text-foreground mb-1">
              {t("password_confirm")}
            </label>
            <Input
              id="signup-password-confirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting || loading}
              className="w-full"
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || loading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("loading")}
              </>
            ) : (
              t("signup_button")
            )}
          </Button>

          <div className="text-sm text-center text-muted-foreground">
            {t("have_account")}{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary hover:underline font-medium"
              disabled={isSubmitting || loading}
            >
              {t("login_button")}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
