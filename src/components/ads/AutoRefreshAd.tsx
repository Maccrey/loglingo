"use client";

import { useEffect, useState } from "react";
import KakaoAdFit from "./KakaoAdFit";

interface AutoRefreshAdProps {
  unit: string;
  width: number;
  height: number;
  refreshInterval?: number; // in milliseconds, default 120000 (2 minutes)
  disabled?: boolean;
}

/**
 * 자동으로 광고를 갱신하는 컴포넌트
 * 
 * 라디오 재생에 영향을 주지 않도록 광고만 독립적으로 재렌더링합니다.
 * key prop을 변경하여 KakaoAdFit 컴포넌트만 재마운트하는 방식으로 구현됩니다.
 */
export default function AutoRefreshAd({ 
  unit, 
  width, 
  height, 
  refreshInterval = 120000, // 2분 (120초)
  disabled 
}: AutoRefreshAdProps) {
  const [adKey, setAdKey] = useState(0);

  useEffect(() => {
    if (disabled) return;

    // 2분마다 광고를 갱신
    const interval = setInterval(() => {
      setAdKey(prev => prev + 1);
      console.log(`🔄 광고 갱신 (${new Date().toLocaleTimeString()})`);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, disabled]);

  if (disabled) return null;

  return (
    <div className="w-full">
      {/* key prop을 변경하여 광고만 재마운트 */}
      <KakaoAdFit
        key={adKey}
        unit={unit}
        width={width}
        height={height}
      />
    </div>
  );
}
