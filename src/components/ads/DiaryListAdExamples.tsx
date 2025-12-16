/**
 * 일기 목록 페이지 인피드 광고 예시 코드
 * 
 * 사용 방법:
 * 1. src/app/[locale]/diary/page.tsx의 filtered.map() 부분을 수정
 * 2. 5번째 항목마다 광고를 삽입
 */

import { ResponsiveAd } from "@/components/ads/ResponsiveAd";
import { AD_UNITS, AD_SIZES } from "@/config/ads";
import KakaoAdFit from "@/components/ads/KakaoAdFit";

// ===== 1. 일기 목록 인피드 광고 =====
// src/app/[locale]/diary/page.tsx의 line 255-326 부분을 아래와 같이 수정

{filtered.map((diary, index) => (
  <>
    {/* 기존 일기 카드 */}
    <div 
      key={diary.id} 
      onClick={() => router.push(`/diary/${diary.id}`)}
      className="block"
    >
      <Card className="glass-card border-white/10 transition-all hover:shadow-lg hover:border-primary/40 cursor-pointer">
        {/* ... 기존 카드 내용 ... */}
      </Card>
    </div>

    {/* 5번째 항목마다 광고 삽입 */}
    {(index + 1) % 5 === 0 && index !== filtered.length - 1 && (
      <div className="w-full">
        <ResponsiveAd
          pcUnit={AD_UNITS.DIARY_INFEED_PC}
          mobileUnit={AD_UNITS.DIARY_INFEED_MOBILE}
          pcWidth={AD_SIZES.PC_LEADERBOARD.width}
          pcHeight={AD_SIZES.PC_LEADERBOARD.height}
          mobileWidth={AD_SIZES.MOBILE_LARGE_BANNER.width}
          mobileHeight={AD_SIZES.MOBILE_LARGE_BANNER.height}
        />
      </div>
    )}
  </>
))}

// ===== 2. 일기 목록 사이드바 광고 (PC 전용) =====
// src/app/[locale]/diary/page.tsx의 line 120-237 Card 내부 최하단에 추가

<Card className="md:col-span-1 h-fit bg-[#111827] border-white/5 rounded-xl overflow-hidden shadow-xl">
  <div className="p-5 space-y-6">
    {/* ... 기존 Year/Month 필터 코드 ... */}
    
    {/* 사이드바 하단 광고 추가 (PC 전용) */}
    <div className="hidden md:block pt-4 border-t border-white/10">
      <KakaoAdFit
        unit={AD_UNITS.DIARY_SIDEBAR}
        width={AD_SIZES.PC_SQUARE.width}
        height={AD_SIZES.PC_SQUARE.height}
      />
    </div>
  </div>
</Card>

// ===== 3. 모바일 하단 광고 (옵션) =====
// src/app/[locale]/diary/page.tsx의 최하단 (line 329 이후)에 추가

{/* 모바일 하단 광고 */}
<div className="md:hidden mt-8">
  <KakaoAdFit
    unit={AD_UNITS.DIARY_BOTTOM_MOBILE}
    width={AD_SIZES.MOBILE_BANNER.width}
    height={AD_SIZES.MOBILE_BANNER.height}
  />
</div>
