"use client";

import { useEffect, useRef } from "react";

interface KakaoAdFitProps {
  unit: string;
  width: number;
  height: number;
  disabled?: boolean;
}

export default function KakaoAdFit({ unit, width, height, disabled }: KakaoAdFitProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;

    if (!containerRef.current) return;

    const ins = document.createElement("ins");
    ins.className = "kakao_ad_area";
    ins.style.display = "none";
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
  }, [unit, width, height, disabled]);

  if (disabled) return null;

  return <div ref={containerRef} className="flex justify-center my-8" />;
}
