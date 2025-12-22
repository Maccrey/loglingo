"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import DictionaryModal from "./DictionaryModal";
import { useTranslations } from "next-intl";

export default function DictionaryFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("dictionary");

  return (
    <>
      {/* Floating Action Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform"
        size="lg"
        aria-label={t("fab_label")}
        title={t("fab_label")}
      >
        <BookOpen className="h-6 w-6" />
      </Button>

      {/* Modal */}
      <DictionaryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
