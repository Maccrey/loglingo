import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function useDiaryTts(diaryId?: string) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isAudioExisting, setIsAudioExisting] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [cachedUrl, setCachedUrl] = useState<string | null>(null);
  const t = useTranslations("diary");

  useEffect(() => {
    if (!diaryId) return;
    
    let isMounted = true;
    const checkAudio = async () => {
      setIsChecking(true);
      try {
        const res = await fetch(`/api/ai/tts?diaryId=${diaryId}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setIsAudioExisting(data.exists);
            if (data.exists && data.url) {
              setCachedUrl(data.url);
            }
          }
        }
      } catch (err) {
        console.error("Failed to check audio existence", err);
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };
    
    checkAudio();
    return () => { isMounted = false; };
  }, [diaryId]);

  const generateAndPlayAudio = async (
    targetDiaryId: string,
    content: string,
    learningLanguage?: string
  ) => {
    if (!targetDiaryId || !content) return;

    if (cachedUrl) {
      setAudioUrl(cachedUrl);
      return;
    }

    try {
      setIsGenerating(true);

      const response = await fetch("/api/ai/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          diaryId: targetDiaryId,
          content,
          learningLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(t("failed_to_generate_audio") || "Failed to generate audio");
      }

      const data = await response.json();
      if (data.url) {
        setAudioUrl(data.url);
        setIsAudioExisting(true);
        setCachedUrl(data.url);
      } else {
        throw new Error("No URL returned from TTS service");
      }
    } catch (error: any) {
      console.error("Audio generation failed:", error);
      toast.error(error.message || t("failed_to_generate_audio_desc") || "Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetAudio = () => {
    setAudioUrl(null);
    setIsGenerating(false);
  };

  return {
    isChecking,
    isAudioExisting,
    isGenerating,
    audioUrl,
    generateAndPlayAudio,
    resetAudio,
  };
}
