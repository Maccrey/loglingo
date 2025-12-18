"use client";

import { useEffect, useRef } from "react";
import { useAds } from "@/application/ads/AdProvider";

interface ResponsiveAdProps {
  pcUnit: string;
  mobileUnit: string;
  pcWidth: number;
  pcHeight: number;
  mobileWidth: number;
  mobileHeight: number;
  disabled?: boolean;
  className?: string;
}

/**
 * 반응형 카카오 애드핏 광고 컴포넌트
 * PC와 모바일에서 서로 다른 광고 유닛을 표시합니다.
 */
export function ResponsiveAd({
  pcUnit,
  mobileUnit,
  pcWidth,
  pcHeight,
  mobileWidth,
  mobileHeight,
  disabled,
  className = "",
}: ResponsiveAdProps) {
  const { showAds } = useAds();
  const pcContainerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled || !showAds) return;

    // 광고 로딩을 약간 지연시켜 DOM이 완전히 렌더링된 후 실행
    const timer = setTimeout(() => {
      // PC 광고 초기화
      if (pcContainerRef.current) {
        const ins = document.createElement("ins");
        ins.className = "kakao_ad_area";
        ins.setAttribute("data-ad-unit", pcUnit);
        ins.setAttribute("data-ad-width", pcWidth.toString());
        ins.setAttribute("data-ad-height", pcHeight.toString());

        const script = document.createElement("script");
        script.async = true;
        script.type = "text/javascript";
        script.src = "//t1.daumcdn.net/kas/static/ba.min.js";

        pcContainerRef.current.appendChild(ins);
        pcContainerRef.current.appendChild(script);
      }

      // 모바일 광고 초기화
      if (mobileContainerRef.current) {
        const ins = document.createElement("ins");
        ins.className = "kakao_ad_area";
        ins.setAttribute("data-ad-unit", mobileUnit);
        ins.setAttribute("data-ad-width", mobileWidth.toString());
        ins.setAttribute("data-ad-height", mobileHeight.toString());

        const script = document.createElement("script");
        script.async = true;
        script.type = "text/javascript";
        script.src = "//t1.daumcdn.net/kas/static/ba.min.js";

        mobileContainerRef.current.appendChild(ins);
        mobileContainerRef.current.appendChild(script);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (pcContainerRef.current) {
        pcContainerRef.current.innerHTML = "";
      }
      if (mobileContainerRef.current) {
        mobileContainerRef.current.innerHTML = "";
      }
    };
  }, [pcUnit, mobileUnit, pcWidth, pcHeight, mobileWidth, mobileHeight, disabled, showAds]);

  if (disabled || !showAds) return null;

  return (
    <>
      {/* PC 광고 (md 이상에서만 표시) */}
      <div
        ref={pcContainerRef}
        className={`hidden md:flex justify-center my-6 ${className}`}
        style={{ 
          minHeight: `${pcHeight}px`,
          minWidth: `${pcWidth}px`,
          width: '100%',
          maxWidth: `${pcWidth}px`,
          margin: '0 auto'
        }}
      />
      
      {/* 모바일 광고 (md 미만에서만 표시) */}
      <div
        ref={mobileContainerRef}
        className={`flex md:hidden justify-center my-6 ${className}`}
        style={{ 
          minHeight: `${mobileHeight}px`,
          minWidth: `${mobileWidth}px`,
          width: '100%',
          maxWidth: `${mobileWidth}px`,
          margin: '0 auto'
        }}
      />
    </>
  );
}
