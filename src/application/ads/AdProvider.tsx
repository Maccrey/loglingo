"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { useAuth } from "@/application/auth/AuthProvider";

interface AdContextValue {
  /**
   * 광고 표시 여부
   * - 유료 가입자(isPremium)이면 false
   * - 무료 사용자이면 true
   */
  showAds: boolean;
  
  /**
   * 사용자가 프리미엄 회원인지 여부
   */
  isPremium: boolean;
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
    
    // 개발 환경이거나 프리미엄 사용자인 경우 광고 비활성화
    const showAds = !isDevelopment && !isPremium;
    
    console.log('🎯 AdProvider:', { 
      isDevelopment, 
      isPremium, 
      showAds,
      nodeEnv: process.env.NODE_ENV,
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'N/A'
    });
    
    return {
      showAds,
      isPremium,
    };
  }, [user]);

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
