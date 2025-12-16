/**
 * 학습 아카이브 페이지 광고 예시 코드
 * 
 * 사용 방법:
 * src/app/[locale]/archive/page.tsx에 광고 삽입
 */

import { ResponsiveAd } from "@/components/ads/ResponsiveAd";
import KakaoAdFit from "@/components/ads/KakaoAdFit";
import { AD_UNITS, AD_SIZES } from "@/config/ads";

// ===== 1. 추가 폼과 목록 사이 광고 =====
// src/app/[locale]/archive/page.tsx의 line 139와 141 사이에 추가

<Card className="glass-card">
  <CardHeader>
    <CardTitle>{t("add_title")}</CardTitle>
  </CardHeader>
  <CardContent className="grid gap-3 md:grid-cols-4">
    {/* ... 기존 추가 폼 내용 ... */}
  </CardContent>
</Card>

{/* 폼과 목록 사이 광고 */}
<ResponsiveAd
  pcUnit={AD_UNITS.ARCHIVE_TOP_PC}
  mobileUnit={AD_UNITS.ARCHIVE_TOP_MOBILE}
  pcWidth={AD_SIZES.PC_LEADERBOARD.width}
  pcHeight={AD_SIZES.PC_LEADERBOARD.height}
  mobileWidth={AD_SIZES.MOBILE_LARGE_BANNER.width}
  mobileHeight={AD_SIZES.MOBILE_LARGE_BANNER.height}
/>

<div className="grid gap-4 md:grid-cols-3">
  {/* ... 기존 그리드 내용 ... */}
</div>

// ===== 2. 퀴즈 카드 하단 광고 (PC 전용) =====
// src/app/[locale]/archive/page.tsx의 line 180-280 Card 내부 최하단에 추가

<Card>
  <CardHeader>
    <CardTitle>{t("quiz_title")}</CardTitle>
  </CardHeader>
  <CardContent className="space-y-3">
    {/* ... 기존 퀴즈 내용 ... */}
    
    {/* 퀴즈 하단 광고 (PC 전용) */}
    <div className="hidden md:block pt-4 border-t border-white/10 mt-4">
      <KakaoAdFit
        unit={AD_UNITS.ARCHIVE_QUIZ_SIDE}
        width={AD_SIZES.PC_SQUARE.width}
        height={AD_SIZES.PC_SQUARE.height}
      />
    </div>
  </CardContent>
</Card>
