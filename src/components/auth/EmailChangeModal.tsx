"use client";

import { useState } from "react";
import { useAuth } from "@/application/auth/AuthProvider";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle } from "lucide-react";

interface EmailChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmailChangeModal({ isOpen, onClose }: EmailChangeModalProps) {
  const { updateUserEmail, user } = useAuth();
  const t = useTranslations("auth");
  
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    
    // Validation
    if (!newEmail || !newEmail.includes("@")) {
      setError(t("error_invalid_email"));
      return;
    }
    
    if (!currentPassword) {
      setError(t("error_wrong_password"));
      return;
    }
    
    setIsSubmitting(true);
    try {
      await updateUserEmail(newEmail, currentPassword);
      setSuccess(true);
      setNewEmail("");
      setCurrentPassword("");
      
      // Auto-close after 5 seconds
      setTimeout(() => {
        handleClose();
      }, 5000);
    } catch (err: any) {
      console.error("Email change error:", err);
      if (err.code === "auth/wrong-password") {
        setError(t("error_wrong_password"));
      } else if (err.code === "auth/invalid-email") {
        setError(t("error_invalid_email"));
      } else if (err.code === "auth/email-already-in-use") {
        setError(t("error_email_already_in_use"));
      } else if (err.code === "auth/requires-recent-login") {
        setError(t("error_auth_failed"));
      } else {
        setError(t("error_auth_failed"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setNewEmail("");
    setCurrentPassword("");
    setError("");
    setSuccess(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t("email_change_modal_title")}>
      {success ? (
        <div className="space-y-4 text-center py-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {t("email_changed")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("email_verification_sent")}
            </p>
          </div>
          <Button onClick={handleClose} className="w-full">
            {t("common.success")}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              {t("email")} (Current)
            </label>
            <Input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full bg-white/5"
            />
          </div>

          <div>
            <label htmlFor="new-email" className="block text-sm font-medium text-foreground mb-1">
              {t("new_email")}
            </label>
            <Input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="newemail@example.com"
              disabled={isSubmitting}
              className="w-full"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-foreground mb-1">
              {t("current_password")}
            </label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting}
              className="w-full"
              autoComplete="current-password"
            />
            <p className="text-xs text-muted-foreground mt-1">
              보안을 위해 현재 비밀번호를 입력해주세요.
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
              t("change_email_button")
            )}
          </Button>
        </form>
      )}
    </Modal>
  );
}
