"use client";

import { useEffect, useState } from "react";
import KakaoAdFit from "@/components/ads/KakaoAdFit";
import { AD_UNITS, AD_SIZES } from "@/config/ads";

export default function AdTestPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-4">광고 테스트 페이지</h1>
          <p className="text-muted-foreground">
            각 광고 유닛이 정상적으로 표시되는지 확인합니다.
          </p>
        </div>

        {/* 메인 PC 광고 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">메인 PC 광고 (728x90)</h2>
          <div className="border border-dashed border-primary p-4 rounded">
            <p className="text-sm text-muted-foreground mb-2">
              Unit ID: {AD_UNITS.MAIN_PC}
            </p>
            <KakaoAdFit
              unit={AD_UNITS.MAIN_PC}
              width={AD_SIZES.PC_LEADERBOARD.width}
              height={AD_SIZES.PC_LEADERBOARD.height}
            />
          </div>
        </section>

        {/* 메인 모바일 광고 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">메인 모바일 광고 (320x50)</h2>
          <div className="border border-dashed border-primary p-4 rounded">
            <p className="text-sm text-muted-foreground mb-2">
              Unit ID: {AD_UNITS.MAIN_MOBILE}
            </p>
            <KakaoAdFit
              unit={AD_UNITS.MAIN_MOBILE}
              width={AD_SIZES.MOBILE_BANNER.width}
              height={AD_SIZES.MOBILE_BANNER.height}
            />
          </div>
        </section>

        {/* 일기 사이드바 광고 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">일기 사이드바 광고 (250x250)</h2>
          <div className="border border-dashed border-primary p-4 rounded">
            <p className="text-sm text-muted-foreground mb-2">
              Unit ID: {AD_UNITS.DIARY_SIDEBAR}
            </p>
            <KakaoAdFit
              unit={AD_UNITS.DIARY_SIDEBAR}
              width={AD_SIZES.PC_SQUARE.width}
              height={AD_SIZES.PC_SQUARE.height}
            />
          </div>
        </section>

        {/* 디버깅 정보 */}
        <section className="space-y-4 bg-slate-900 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-white">디버깅 정보</h2>
          <div className="space-y-2 text-sm font-mono text-gray-300">
            <p>• 광고 스크립트 로딩 확인: DevTools {'>'} Network에서 ba.min.js 확인</p>
            <p>• 광고 요소 확인: DevTools {'>'} Elements에서 .kakao_ad_area 확인</p>
            <p>• 콘솔 오류 확인: DevTools {'>'} Console에서 에러 메시지 확인</p>
            <p>• 광고 컨테이너 크기: 각 광고 영역은 최소 크기를 가져야 함</p>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded">
            <h3 className="text-yellow-400 font-semibold mb-2">⚠️ 알려진 이슈</h3>
            <ul className="text-sm text-yellow-200 space-y-1">
              <li>• 광고 유닛이 승인 대기 중이면 광고가 표시되지 않을 수 있습니다</li>
              <li>• localhost에서는 일부 광고가 표시되지 않을 수 있습니다</li>
              <li>• 광고 차단 확장 프로그램을 비활성화하세요</li>
              <li>• 시크릿 모드에서 테스트해보세요</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
