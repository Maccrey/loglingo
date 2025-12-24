"use client";

import { createContext, useContext, ReactNode, useMemo, useEffect, useState } from "react";
import { useAuth } from "@/application/auth/AuthProvider";

interface AdContextValue {
  /**
   * 광고 표시 여부
   * - 유료 가입자(isPremium)이면 false
   * - 무료 사용자이면 true
   * - 한국 접속자 + 환경 변수 허용 시에만 true
   */
  showAds: boolean;

  /**
   * 사용자가 프리미엄 회원인지 여부
   */
  isPremium: boolean;

  /**
   * 광고 허용 국가(기본 한국)에서 접속했는지 여부
   */
  isKoreanVisitor: boolean;

  /**
   * 환경 변수로 광고가 켜져 있는지 여부 (NEXT_PUBLIC_ENABLE_KAKAO_ADS)
   */
  adsEnabledByFlag: boolean;
}

const AdContext = createContext<AdContextValue | undefined>(undefined);

interface AdProviderProps {
  children: ReactNode;
}

/**
 * 광고 표시 제어를 위한 Provider
 * 
 * 사용자의 프리미엄 상태에 따라 광고 표시 여부를 결정합니다.
 * 
 * @example
 * // App.tsx 또는 layout.tsx에서 사용
 * <AdProvider>
 *   <App />
 * </AdProvider>
 */
export function AdProvider({ children }: AdProviderProps) {
  const { user } = useAuth();
  const [isKoreanVisitor, setIsKoreanVisitor] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const allowedCountry = (process.env.NEXT_PUBLIC_AD_ALLOWED_COUNTRY || "KR").toUpperCase();

    const hasKoreanLang = () => {
      const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
      return Boolean(langs?.some((lang) => lang?.toLowerCase().startsWith("ko")));
    };

    const hasKoreanTimeZone = () => {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone?.toLowerCase() || "";
      return tz.includes("seoul") || tz.includes("pyongyang");
    };

    const isKoreaOffset = () => new Date().getTimezoneOffset() === -540; // UTC+9

    const countryMatch = allowedCountry === "KR";
    const isAllowedRegion = countryMatch ? (hasKoreanLang() || hasKoreanTimeZone() || isKoreaOffset()) : true;

    setIsKoreanVisitor(isAllowedRegion);
  }, []);
  
  const contextValue = useMemo(() => {
    // 개발 환경 감지
    const isDevelopment = process.env.NODE_ENV === 'development' || 
                         (typeof window !== 'undefined' && 
                          (window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1'));
    
    // TODO: 실제 구현 시 user.isPremium 또는 Firestore에서 구독 정보 조회
    // 현재는 user의 커스텀 클레임 또는 Firestore 문서에서 확인하는 방식으로 구현 필요
    
    // Firestore에서 사용자 구독 정보 조회 (추천)
    // useEffect로 별도 조회 필요
    
    const isPremium = false; // 기본값: 무료 사용자

    const adsEnabledByFlag = (process.env.NEXT_PUBLIC_ENABLE_KAKAO_ADS ?? 'true') !== 'false';
    
    // 개발 환경이거나 프리미엄 사용자인 경우 광고 비활성화
    const showAds = adsEnabledByFlag && isKoreanVisitor && !isDevelopment && !isPremium;
    
    console.log('🎯 AdProvider:', { 
      isDevelopment, 
      isPremium, 
      showAds,
      adsEnabledByFlag,
      isKoreanVisitor,
      nodeEnv: process.env.NODE_ENV,
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'N/A'
    });
    
    return {
      showAds,
      isPremium,
      isKoreanVisitor,
      adsEnabledByFlag,
    };
  }, [user, isKoreanVisitor]);

  return (
    <AdContext.Provider value={contextValue}>
      {children}
    </AdContext.Provider>
  );
}

/**
 * 광고 표시 여부를 확인하는 Hook
 * 
 * @returns {AdContextValue} 광고 표시 여부와 프리미엄 상태
 * 
 * @example
 * const { showAds, isPremium } = useAds();
 * 
 * if (showAds) {
 *   return <KakaoAdFit ... />;
 * }
 */
export function useAds(): AdContextValue {
  const context = useContext(AdContext);
  
  if (context === undefined) {
    throw new Error("useAds must be used within AdProvider");
  }
  
  return context;
}
