"use client";

import { useEffect, useRef } from "react";
import { useAds } from "@/application/ads/AdProvider";

interface KakaoAdFitProps {
  unit: string;
  width: number;
  height: number;
  disabled?: boolean;
}

export default function KakaoAdFit({ unit, width, height, disabled }: KakaoAdFitProps) {
  const { showAds } = useAds();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled || !showAds) return;

    if (!containerRef.current) return;

    const ins = document.createElement("ins");
    ins.className = "kakao_ad_area";
    ins.setAttribute("data-ad-unit", unit);
    ins.setAttribute("data-ad-width", width.toString());
    ins.setAttribute("data-ad-height", height.toString());

    const script = document.createElement("script");
    script.async = true;
    script.type = "text/javascript";
    script.src = "//t1.daumcdn.net/kas/static/ba.min.js";

    containerRef.current.appendChild(ins);
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [unit, width, height, disabled, showAds]);

  if (disabled || !showAds) return null;

  return (
    <div 
      ref={containerRef} 
      className="flex justify-center my-8" 
      style={{ minHeight: `${height}px` }}
    />
  );
}
