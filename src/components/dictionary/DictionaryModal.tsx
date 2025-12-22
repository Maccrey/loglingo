"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/application/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Loader2, Save, Search, X } from "lucide-react";
import { createArchive } from "@/infrastructure/firebase/archive-repository";

interface DictionaryResult {
  word: string;
  rootMeaning: string;
  examples: string[];
}

interface DictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DictionaryModal({ isOpen, onClose }: DictionaryModalProps) {
  const t = useTranslations("dictionary");
  const locale = useLocale();
  const { user } = useAuth();
  
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DictionaryResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!word.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/dictionary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: word.trim(),
          learningLang: "en", // TODO: Get from user settings
          uiLang: locale,
        }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch dictionary entry");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Dictionary search failed:", err);
      setError(t("error") || "Failed to generate dictionary entry");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result || !user) return;
    
    setSaving(true);
    try {
      await createArchive({
        userId: user.uid,
        type: "word",
        title: result.word,
        rootMeaning: result.rootMeaning,
        examples: result.examples,
        sourceText: `[Dictionary] ${result.word}: ${result.rootMeaning}`,
      });
      
      alert(t("saved"));
      setWord("");
      setResult(null);
      onClose();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save to archive");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setWord("");
    setResult(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <Card 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-background"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{t("modal_title")}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Input */}
        <div className="flex gap-2 mb-6">
          <Input
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder={t("input_placeholder")}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={loading || !word.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">{t("search_button")}</span>
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-bold text-xl mb-2">{result.word}</h3>
              <p className="text-muted-foreground">{result.rootMeaning}</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">{t("examples")}</h4>
              <ul className="space-y-2">
                {result.examples.map((ex, i) => (
                  <li key={i} className="text-sm bg-muted p-2 rounded">
                    • {ex}
                  </li>
                ))}
              </ul>
            </div>

            <Button 
              onClick={handleSave} 
              disabled={saving} 
              className="w-full"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {t("save_button")}
            </Button>
          </div>
        )}

        {/* Close Button */}
        {!result && (
          <Button 
            onClick={handleClose} 
            className="w-full mt-4"
          >
            {t("close")}
          </Button>
        )}
      </Card>
    </div>
  );
}
