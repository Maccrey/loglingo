# 광고 배치 전략 및 구현 가이드

## 📊 지원 광고 사이즈

업로드된 이미지에서 확인된 카카오 애드핏 지원 사이즈:

- **320x480_img**: 모바일용 대형 이미지 광고
- **320x100**: 모바일용 가로를 채우는 직사각형
- **320x50**: 모바일용 얇은 띠배너형
- **728x90**: PC용 가로로 긴 직사각형 (리더보드)
- **300x250**: PC/모바일 겸용 정사각에 가까운 직사각형 (미디엄 렉탱글)
- **250x250**: PC/모바일 겸용 정사각형
- **160x600**: PC용 세로로 긴 직사각형 (와이드 스카이스크래퍼)

---

## 🎯 페이지별 광고 배치 전략

### 1. 메인 페이지 (`src/app/[locale]/page.tsx`)

**현재 상태**: 이미 PC(728x90), 모바일(320x50) 광고가 페이지 하단에 구현됨 ✅

**배치 위치**:
- PC (768px+): 728x90 배너 (하단)
- 모바일 (<768px): 320x50 배너 (하단)

**권장 추가 배치**:
없음. 현재 상태 유지 권장.

---

### 2. 일기 목록 페이지 (`src/app/[locale]/diary/page.tsx`)

**분석**:
- 왼쪽: 사이드바 (year/month 필터)
- 오른쪽: 일기 카드 목록

**배치 전략**:

#### A. 사이드바 하단 광고 (데스크톱 전용)
- **위치**: 사이드바(`.md:col-span-1`) 하단
- **사이즈**: 250x250 (정사각형)
- **표시**: PC만 (md 이상)
- **이유**: 사이드바 너비에 딱 맞고, 필터 사용 후 자연스럽게 노출

#### B. 일기 목록 인피드 광고
- **위치**: 일기 카드 사이 (5개마다 1개)
- **사이즈**: 
  - PC: 728x90 또는 300x250
  - 모바일: 320x100
- **이유**: 스크롤 시 자연스러운 노출, 높은 시선 집중도

#### C. 모바일 하단 고정 광고 (옵션)
- **위치**: 페이지 최하단
- **사이즈**: 320x50
- **표시**: 모바일만
- **이유**: 스크롤 후 자연스러운 종결 지점

---

### 3. 일기 상세 페이지 (`src/app/[locale]/diary/[id]/page.tsx`)

**분석**:
- 일기 본문 카드
- 관련 학습 아카이브 카드

**배치 전략**:

#### A. 일기 본문과 아카이브 사이
- **위치**: 두 `<Card>` 사이 (line 102와 104 사이)
- **사이즈**:
  - PC: 728x90
  - 모바일: 320x100 또는 320x50
- **이유**: 콘텐츠를 다 읽은 후 자연스러운 휴식 지점

#### B. 페이지 하단 (옵션)
- **위치**: 아카이브 카드 아래
- **사이즈**: 
  - PC: 728x90
  - 모바일: 320x50
- **이유**: 페이지 종료 지점에서 최종 노출

---

### 4. 학습 아카이브 페이지 (`src/app/[locale]/archive/page.tsx`)

**분석**:
- 상단: 필터 버튼 + 추가 폼
- 하단: 좌측(아카이브 목록) + 우측(퀴즈)

**배치 전략**:

#### A. 추가 폼과 목록 사이
- **위치**: 추가 폼 카드와 그리드 사이 (line 139와 141 사이)
- **사이즈**:
  - PC: 728x90
  - 모바일: 320x100
- **이유**: 폼 작성 후 자연스러운 시선 이동 지점

#### B. 퀴즈 카드 하단 (사이드)
- **위치**: 퀴즈 카드 내부 하단
- **사이즈**: 250x250 또는 300x250
- **표시**: PC만
- **이유**: 퀴즈 풀이 후 휴식 지점

---

### 5. 네비게이션 사이드바 (`src/components/layout/Navigation.tsx`)

**분석**: 현재는 상단/하단 고정 네비게이션 바

**배치 전략**: 
없음. 네비게이션은 UX를 방해하지 않는 것이 중요하므로 광고 삽입 비권장.

---

### 6. 설정 페이지 (`src/app/[locale]/settings/page.tsx`)

**배치 전략**:

#### A. 설정 카드 하단
- **위치**: 설정 카드 아래
- **사이즈**:
  - PC: 728x90 또는 300x250
  - 모바일: 320x100
- **이유**: 설정 변경 후 자연스러운 페이지 종결

---

## 📝 광고 유닛 ID 관리

### 추천 파일 구조

```typescript
// src/config/ads.ts
export const AD_UNITS = {
  // 메인 페이지
  MAIN_PC: 'DAN-OcjGqneif35bCzFF',          // 728x90
  MAIN_MOBILE: 'DAN-O3H0DVRSds4Dserg',      // 320x50
  
  // 일기 목록 페이지
  DIARY_SIDEBAR: 'DAN-fBAaiv5MCbM9sPL6',    // 250x250 (PC)
  DIARY_INFEED_PC: 'DAN-LElQXisxvGHxZ64H',    // 728x90 또는 300x250
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
  SETTINGS_BOTTOM_PC: 'DAN-d5Zd98v79G6EOlOB',   // 728x90 또는 300x250
  SETTINGS_BOTTOM_MOBILE: 'DAN-mu8keeF6mwCLE5Vl', // 320x100
} as const;

export const AD_SIZES = {
  PC_LEADERBOARD: { width: 728, height: 90 },
  PC_MEDIUM_RECTANGLE: { width: 300, height: 250 },
  PC_SQUARE: { width: 250, height: 250 },
  PC_SKYSCRAPER: { width: 160, height: 600 },
  
  MOBILE_LARGE_BANNER: { width: 320, height: 100 },
  MOBILE_BANNER: { width: 320, height: 50 },
  MOBILE_LARGE_IMAGE: { width: 320, height: 480 },
  
  RESPONSIVE_SQUARE: { width: 250, height: 250 },
  RESPONSIVE_RECTANGLE: { width: 300, height: 250 },
} as const;
```

---

## 🔧 구현 우선순위

### Phase 1 (High Priority - 즉시 구현)
1. ✅ 메인 페이지 하단 광고 (이미 완료)
2. 🔴 일기 목록 인피드 광고 (높은 노출도)
3. 🔴 일기 상세 페이지 중간 광고 (높은 체류 시간)

### Phase 2 (Medium Priority)
4. 🟡 일기 목록 사이드바 광고 (PC 전용)
5. 🟡 학습 아카이브 상단 광고
6. 🟡 학습 아카이브 퀴즈 사이드 광고 (PC 전용)

### Phase 3 (Low Priority)
7. 🟢 설정 페이지 하단 광고
8. 🟢 모바일 하단 고정 광고 (옵션)

---

## 🎨 UX 고려사항

### 다크모드 + 글라스모피즘 통합
- 광고 컨테이너에 `glass-card` 클래스 적용
- 광고 주변에 적절한 여백(`my-6`, `my-8`) 추가
- 광고 로딩 중 스켈레톤 UI 표시

### 반응형 디자인
- 375px 이상 모바일 완벽 지원
- Flutter WebView 임베드 시에도 정상 동작
- 안전 영역(safe area) 고려

### 성능 최적화
- 광고 스크립트 lazy loading
- 뷰포트 진입 시에만 로드 (Intersection Observer)
- LCP 영향 최소화

---

## 📋 다음 단계

1. Content Security Policy (CSP) 설정이 있다면 애드핏 스크립트를 허용하도록 수정해주세요.
2. `src/config/ads.ts` 파일을 만들어 Unit ID 상수들을 관리해주세요.

---

## 4. 유료 가입자를 위한 광고 제어 시스템 ✨

### 개요

유료 가입자(프리미엄 회원)에게는 광고를 표시하지 않고, 전체 광고를 한 번에 제어할 수 있는 시스템이 구현되어 있습니다.

### 구현된 파일

#### A. AdProvider Context (`src/application/ads/AdProvider.tsx`)
- 사용자의 프리미엄 상태에 따라 광고 표시 여부를 제어합니다.
- `useAds()` 훅을 통해 모든 광고 컴포넌트에서 사용 가능합니다.

```typescript
// 사용 예시
const { showAds, isPremium } = useAds();

if (showAds) {
  return <KakaoAdFit ... />;
}
```

#### B. 구독 관리 Hook (`src/application/ads/hooks.ts`)
- `useUserSubscription()`: 사용자 구독 정보 조회
- `useSubscriptionMutation()`: 구독 상태 업데이트

```typescript
// 사용 예시
const { data: subscription } = useUserSubscription();
const mutation = useSubscriptionMutation();

// 프리미엄으로 변경
await mutation.mutateAsync(true);
```

#### C. Firestore 구독 Repository (`src/infrastructure/firebase/subscription.ts`)
- Firestore `subscriptions` 컬렉션에서 사용자 구독 정보 관리
- 구독 만료 자동 확인 기능 포함

### 데이터베이스 스키마

**Collection: `subscriptions`**

| 필드 | 타입 | 설명 |
|------|------|------|
| userId | string | 사용자 ID (문서 ID로도 사용) |
| isPremium | boolean | 프리미엄 회원 여부 |
| subscriptionType | string? | 구독 타입 (monthly/yearly/lifetime) |
| startDate | Timestamp? | 구독 시작일 |
| endDate | Timestamp? | 구독 만료일 |
| createdAt | Timestamp | 생성일 |
| updatedAt | Timestamp | 수정일 |

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 구독 정보
    match /subscriptions/{userId} {
      // 자신의 구독 정보만 읽기 가능
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // 관리자만 쓰기 가능 (실제로는 Cloud Function에서 처리 권장)
      allow write: if request.auth != null && 
                      (request.auth.token.admin == true || 
                       request.auth.uid == userId);
    }
  }
}
```

### App에 AdProvider 적용

**`src/app/providers.tsx` 또는 메인 layout**

```typescript
import { AdProvider } from "@/application/ads/AdProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AdProvider>
    </AuthProvider>
  );
}
```

### 광고 컴포넌트 자동 제어

모든 광고 컴포넌트(`KakaoAdFit`, `ResponsiveAd`)는 자동으로 `AdProvider`를 확인합니다:

```typescript
// KakaoAdFit.tsx
const { showAds } = useAds();

if (!showAds) return null; // 프리미엄 회원이면 광고 미표시
```

### 구독 상태 변경 예시

**설정 페이지나 결제 완료 후**

```typescript
import { useSubscriptionMutation } from "@/application/ads/hooks";

function SubscriptionButton() {
  const mutation = useSubscriptionMutation();
  
  const handleUpgrade = async () => {
    try {
      await mutation.mutateAsync(true); // 프리미엄 활성화
      toast.success("프리미엄으로 업그레이드되었습니다!");
    } catch (error) {
      toast.error("업그레이드 실패");
    }
  };
  
  return <Button onClick={handleUpgrade}>프리미엄 가입</Button>;
}
```

### 구독 만료 자동 처리

`checkSubscriptionExpiry()` 함수를 주기적으로 호출하여 만료된 구독을 자동 해제할 수 있습니다:

```typescript
// Cloud Function 또는 클라이언트 useEffect
import { checkSubscriptionExpiry } from "@/infrastructure/firebase/subscription";

// 앱 시작 시 또는 주기적으로 확인
useEffect(() => {
  if (user?.uid) {
    checkSubscriptionExpiry(user.uid);
  }
}, [user]);
```

### TODO: 실제 결제 연동 시

1. **결제 시스템 통합**
   - Stripe, Kakao Pay, Toss Payments 등과 연동
   - 결제 성공 시 `updateUserSubscription(userId, true)` 호출

2. **Firebase Custom Claims 사용 (권장)**
   ```typescript
   // AdProvider.tsx 수정
   const isPremium = (user?.customClaims?.isPremium as boolean) ?? false;
   ```

3. **구독 갱신 로직**
   - 정기 결제 성공 시 `endDate` 연장
   - Cloud Function으로 자동화 권장

### 테스트 방법

**개발 중 광고 비활성화**

```typescript
// AdProvider.tsx 임시 수정
const isPremium = true; // 개발 중 광고 숨기기
// 또는
const isPremium = process.env.NEXT_PUBLIC_DISABLE_ADS === 'true';
```

**Firestore에서 수동 변경**

```javascript
// Firebase Console에서
db.collection('subscriptions').doc(userId).set({
  userId: userId,
  isPremium: true,
  subscriptionType: 'lifetime',
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  updatedAt: firebase.firestore.FieldValue.serverTimestamp()
});
```

---

3. **반응형 광고 컴포넌트 개선**: 사이즈별 조건부 렌더링 강화
4. **각 페이지에 광고 삽입**: 위 전략에 따라 단계별 구현
5. **테스트 및 최적화**: 
   - Playwright로 광고 노출 테스트
   - 실제 디바이스에서 반응형 확인
   - CLS(Cumulative Layout Shift) 측정 및 개선

---

## 🚀 빠른 시작 가이드

### 1단계: ads.ts 설정 파일 생성

```bash
# src/config/ads.ts 파일 생성
```

### 2단계: 일기 목록 인피드 광고 구현

```bash
# src/app/[locale]/diary/page.tsx 수정
# filtered.map() 내부에 광고 삽입 로직 추가
```

### 3단계: 일기 상세 페이지 광고 구현

```bash
# src/app/[locale]/diary/[id]/page.tsx 수정
# 일기 카드와 아카이브 카드 사이에 광고 삽입
```

### 4단계: 테스트 및 검증

```bash
# npm run dev
# 각 페이지에서 광고 노출 확인
# 반응형 동작 확인 (375px, 768px, 1024px 등)
```
