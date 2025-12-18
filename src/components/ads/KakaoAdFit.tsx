"use client";

import { useEffect, useRef, useState } from "react";
import { useAds } from "@/application/ads/AdProvider";
import type { CSSProperties } from "react";

interface KakaoAdFitProps {
  unit: string;
  width: number;
  height: number;
  disabled?: boolean;
  insDisplayNone?: boolean;
  containerStyle?: CSSProperties;
  containerClassName?: string;
}

export default function KakaoAdFit({
  unit,
  width,
  height,
  disabled,
  insDisplayNone,
  containerStyle,
  containerClassName,
}: KakaoAdFitProps) {
  const { showAds } = useAds();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 마운트 확인
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || disabled || !showAds) return;

    if (!containerRef.current) return;

    // 광고 로딩을 약간 지연시켜 DOM이 완전히 렌더링된 후 실행
    const timer = setTimeout(() => {
      if (!containerRef.current) return;

      const ins = document.createElement("ins");
      ins.className = "kakao_ad_area";
      if (insDisplayNone) ins.style.display = "none";
      ins.setAttribute("data-ad-unit", unit);
      ins.setAttribute("data-ad-width", width.toString());
      ins.setAttribute("data-ad-height", height.toString());

      const script = document.createElement("script");
      script.async = true;
      script.type = "text/javascript";
      script.src = "//t1.daumcdn.net/kas/static/ba.min.js";

      containerRef.current.appendChild(ins);
      containerRef.current.appendChild(script);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [unit, width, height, disabled, showAds, isMounted, insDisplayNone]);

  // 서버 렌더링 또는 조건이 맞지 않을 때 null 반환
  if (!isMounted || disabled || !showAds) return null;

  return (
    <div 
      ref={containerRef} 
      className={containerClassName ?? "flex justify-center"}
      style={{ 
        minHeight: `${height}px`,
        minWidth: `${width}px`,
        width: '100%',
        maxWidth: `${width}px`,
        margin: '2rem auto',
        ...containerStyle,
      }}
    />
  );
}
