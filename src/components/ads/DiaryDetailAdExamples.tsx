/**
 * 일기 상세 페이지 광고 예시 코드
 * 
 * 사용 방법:
 * src/app/[locale]/diary/[id]/page.tsx에 광고 삽입
 */

import { ResponsiveAd } from "@/components/ads/ResponsiveAd";
import { AD_UNITS, AD_SIZES } from "@/config/ads";

// ===== 1. 일기 본문과 아카이브 카드 사이 광고 =====
// src/app/[locale]/diary/[id]/page.tsx의 line 101과 104 사이에 추가

<div className="mx-auto max-w-3xl space-y-6">
  {/* 일기 내용 카드 */}
  <Card>
    {/* ... 기존 일기 내용 ... */}
  </Card>

  {/* 중간 광고 */}
  <ResponsiveAd
    pcUnit={AD_UNITS.DETAIL_MIDDLE_PC}
    mobileUnit={AD_UNITS.DETAIL_MIDDLE_MOBILE}
    pcWidth={AD_SIZES.PC_LEADERBOARD.width}
    pcHeight={AD_SIZES.PC_LEADERBOARD.height}
    mobileWidth={AD_SIZES.MOBILE_LARGE_BANNER.width}
    mobileHeight={AD_SIZES.MOBILE_LARGE_BANNER.height}
  />

  {/* 관련 아카이브 항목 표시 */}
  <Card>
    {/* ... 기존 아카이브 내용 ... */}
  </Card>

  {/* 하단 광고 (옵션) */}
  <ResponsiveAd
    pcUnit={AD_UNITS.DETAIL_BOTTOM_PC}
    mobileUnit={AD_UNITS.DETAIL_BOTTOM_MOBILE}
    pcWidth={AD_SIZES.PC_LEADERBOARD.width}
    pcHeight={AD_SIZES.PC_LEADERBOARD.height}
    mobileWidth={AD_SIZES.MOBILE_BANNER.width}
    mobileHeight={AD_SIZES.MOBILE_BANNER.height}
  />
</div>
