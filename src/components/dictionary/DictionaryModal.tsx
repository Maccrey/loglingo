"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/application/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Loader2, Save, Search, X } from "lucide-react";
import { createArchive } from "@/infrastructure/firebase/archive-repository";
import { useQueryClient } from "@tanstack/react-query";

interface DictionaryResult {
  word: string;
  rootMeaning: string;
  examples: {
    sentence: string;
    meaning: string;
  }[];
}

interface DictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DictionaryModal({ isOpen, onClose }: DictionaryModalProps) {
  const t = useTranslations("dictionary");
  const locale = useLocale();
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);
  const queryClient = useQueryClient();
  const [adRefreshKey, setAdRefreshKey] = useState(0);
  
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DictionaryResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Load Kakao AdFit script once and request fill when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setAdRefreshKey((k) => k + 1);

    const src = "//t1.daumcdn.net/kas/static/ba.min.js";
    const ensureScript = () =>
      new Promise<void>((resolve) => {
        const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
        if (existing) {
          existing.addEventListener("load", () => resolve(), { once: true });
          if (existing.dataset.loaded === "true") resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.dataset.loaded = "true";
        script.onload = () => resolve();
        document.body.appendChild(script);
      });

    ensureScript().then(() => {
      // Request ad rendering
      (window as any).kakaoAsyncAdFit = (window as any).kakaoAsyncAdFit || [];
      (window as any).kakaoAsyncAdFit.push({});
    });
  }, [isOpen]);

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
    if (!result) return;
    if (!user) {
      setError(t("login_required") || "로그인 후 저장할 수 있습니다.");
      return;
    }
    
    setSaving(true);
    try {
      await createArchive({
        userId: user.uid,
        type: "word",
        title: result.word,
        rootMeaning: result.rootMeaning,
        examples: result.examples.map((ex) => `${ex.sentence} — ${ex.meaning}`),
        sourceText: `[Dictionary] ${result.word}: ${result.rootMeaning}`,
        sourceId: "dictionary",
      });

      queryClient.invalidateQueries({ queryKey: ["archives", user.uid] });
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

        {/* AdFit: place near top so slot is visible on open */}
        <div className="mb-4 space-y-3">
          <div className="hidden md:flex justify-center">
            <ins
              className="kakao_ad_area"
              style={{ display: "block", width: "728px", height: "90px", margin: "0 auto" }}
              data-ad-unit="DAN-N9E0RALXboMSWzyU"
              data-ad-width="728"
              data-ad-height="90"
              key={`pc-${adRefreshKey}`}
            />
          </div>
          <div className="md:hidden flex justify-center">
            <ins
              className="kakao_ad_area"
              style={{ display: "block", width: "320px", height: "50px", margin: "0 auto" }}
              data-ad-unit="DAN-RHDzamdpNVf9m8sm"
              data-ad-width="320"
              data-ad-height="50"
              key={`m-${adRefreshKey}`}
            />
          </div>
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
        
        {!isLoggedIn && (
          <div className="mb-4 p-3 rounded-md border border-amber-400/40 bg-amber-500/10 text-amber-200 text-sm">
            {t("login_required") || "로그인 후 학습 아카이브에 저장할 수 있습니다."}
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
                    • {ex.sentence} — {ex.meaning}
                  </li>
                ))}
              </ul>
            </div>

            <Button 
              onClick={handleSave} 
              disabled={saving || !isLoggedIn} 
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
