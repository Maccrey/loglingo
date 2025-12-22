"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import DictionaryModal from "@/components/dictionary/DictionaryModal";
import { useTranslations } from "next-intl";
import { useAuth } from "@/application/auth/AuthProvider";

export default function DictionaryFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("dictionary");
   // Hide FAB when not authenticated
  const { user, loading } = useAuth();

  if (loading || !user) return null;

  return (
    <>
      {/* Floating Action Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 md:bottom-6 right-4 z-50 shadow-lg hover:scale-105 transition-transform gap-2 px-4 py-3"
        size="lg"
        aria-label={t("fab_label")}
        title={t("fab_label")}
      >
        <BookOpen className="h-5 w-5" />
        <span className="font-semibold">{t("fab_label")}</span>
      </Button>

      {/* Modal */}
      <DictionaryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
