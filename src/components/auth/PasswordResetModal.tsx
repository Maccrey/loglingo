"use client";

import { useState } from "react";
import { useAuth } from "@/application/auth/AuthProvider";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle } from "lucide-react";

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function PasswordResetModal({ 
  isOpen, 
  onClose, 
  onSwitchToLogin 
}: PasswordResetModalProps) {
  const { resetPassword } = useAuth();
  const t = useTranslations("auth");
  
  const [email, setEmail] = useState("");
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
    
    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setSuccess(true);
      setEmail("");
      
      // Auto-close after 5 seconds
      setTimeout(() => {
        handleClose();
      }, 5000);
    } catch (err: any) {
      console.error("Password reset error:", err);
      if (err.code === "auth/user-not-found") {
        setError(t("error_user_not_found"));
      } else if (err.code === "auth/invalid-email") {
        setError(t("error_invalid_email"));
      } else {
        setError(t("error_auth_failed"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    setSuccess(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t("password_reset_modal_title")}>
      {success ? (
        <div className="space-y-4 text-center py-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {t("password_reset_sent")}
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
            <label htmlFor="reset-email" className="block text-sm font-medium text-foreground mb-1">
              {t("email")}
            </label>
            <Input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              disabled={isSubmitting}
              className="w-full"
              autoComplete="email"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t("password_reset_sent")}
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("loading")}
              </>
            ) : (
              t("reset_password_button")
            )}
          </Button>

          <div className="text-sm text-center">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary hover:underline"
              disabled={isSubmitting}
            >
              {t("back_to_login")}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
