/**
 * 설정 페이지 광고 예시 코드
 * 
 * 사용 방법:
 * src/app/[locale]/settings/page.tsx에 광고 삽입
 */

import { ResponsiveAd } from "@/components/ads/ResponsiveAd";
import { AD_UNITS, AD_SIZES } from "@/config/ads";

// ===== 설정 카드 하단 광고 =====
// src/app/[locale]/settings/page.tsx의 line 92 이후에 추가

<AuthGate>
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
    
    <Card>
      <CardHeader>
        <CardTitle>{t('ui_language')}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* ... 기존 설정 내용 ... */}
      </CardContent>
    </Card>

    {/* 설정 하단 광고 */}
    <ResponsiveAd
      pcUnit={AD_UNITS.SETTINGS_BOTTOM_PC}
      mobileUnit={AD_UNITS.SETTINGS_BOTTOM_MOBILE}
      pcWidth={AD_SIZES.PC_LEADERBOARD.width}
      pcHeight={AD_SIZES.PC_LEADERBOARD.height}
      mobileWidth={AD_SIZES.MOBILE_LARGE_BANNER.width}
      mobileHeight={AD_SIZES.MOBILE_LARGE_BANNER.height}
    />
  </div>
</AuthGate>
