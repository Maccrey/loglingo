/**
 * 카카오 애드핏 광고 유닛 ID 및 사이즈 설정
 */

export const AD_UNITS = {
  // 메인 페이지
  MAIN_PC: 'DAN-OcjGqneif35bCzFF',          // 728x90
  MAIN_MOBILE: 'DAN-O3H0DVRSds4Dserg',      // 320x50
  
  // 일기 목록 페이지
  DIARY_SIDEBAR: 'DAN-fBAaiv5MCbM9sPL6',    // 250x250 (PC)
  DIARY_INFEED_PC: 'DAN-LElQXisxvGHxZ64H',    // 728x90
  DIARY_INFEED_MOBILE: 'DAN-nMMQxJYfbvs9ho23',  // 320x100
  DIARY_BOTTOM_MOBILE: 'DAN-J5bc0QZrXNVRIkdg', // 320x50
  
  // 일기 상세 페이지
  DETAIL_MIDDLE_PC: 'DAN-9pyBe00OjbdGtJAK',    // 728x90
  DETAIL_MIDDLE_MOBILE: 'DAN-TByebZiEpxD0u97l',// 320x100
  DETAIL_BOTTOM_PC: 'DAN-Rfsl4iTTjDs3C3oa',    // 728x90
  DETAIL_BOTTOM_MOBILE: 'DAN-gwiDOfHt8bJeXGEF',// 320x50
  
  // 학습 아카이브 페이지
  ARCHIVE_TOP_PC: 'DAN-Vn2vLzMzBG0bMuWC', // 728x90
  ARCHIVE_TOP_MOBILE: 'DAN-pkC5Xz2lxipxYrJh',   // 320x100
  ARCHIVE_QUIZ_SIDE: 'DAN-w6FoEQSsAFNsj8ry',    // 250x250 (PC)
  ARCHIVE_QUIZ_MOBILE: 'DAN-uv5V9q4jsG4HyzWV',  // 320x100 (모바일)
  
  // 설정 페이지
  SETTINGS_BOTTOM_PC: 'DAN-d5Zd98v79G6EOlOB',   // 728x90
  SETTINGS_BOTTOM_MOBILE: 'DAN-mu8keeF6mwCLE5Vl', // 320x100
  
  // 라디오 페이지
  RADIO_SIDEBAR_MOBILE: 'DAN-BxozzLNCN03s18ce',  // 320x50 (모바일 사이드바 하단)
  RADIO_SIDEBAR_PC: 'DAN-fzLaMkxcVnRqvmum',      // 300x250 (PC 사이드바 하단)
  RADIO_PLAYER_TOP_MOBILE: 'DAN-egMAgXDetcbThoSS', // 320x50 (모바일 플레이어 상단)
  RADIO_PLAYER_TOP_PC: 'DAN-jpqUUyqK5XVqGJQC',     // 728x90 (PC 플레이어 상단)
  RADIO_LEFT_PC: 'DAN-hU2HAZthxf25RGj1',           // 160x600 (PC 우측)
} as const;

export const AD_SIZES = {
  // PC 광고 사이즈
  PC_LEADERBOARD: { width: 728, height: 90 },
  PC_MEDIUM_RECTANGLE: { width: 300, height: 250 },
  PC_SQUARE: { width: 250, height: 250 },
  PC_SKYSCRAPER: { width: 160, height: 600 },
  
  // 모바일 광고 사이즈
  MOBILE_LARGE_BANNER: { width: 320, height: 100 },
  MOBILE_BANNER: { width: 320, height: 50 },
  MOBILE_LARGE_IMAGE: { width: 320, height: 480 },
  
  // 반응형 광고 사이즈
  RESPONSIVE_SQUARE: { width: 250, height: 250 },
  RESPONSIVE_RECTANGLE: { width: 300, height: 250 },
} as const;

export type AdUnitKey = keyof typeof AD_UNITS;
export type AdSizeKey = keyof typeof AD_SIZES;
