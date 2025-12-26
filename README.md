# Loglingo

**Loglingo**는 외국어 학습자가 직접 쓴 일기를 AI가 교정해주고, 개인화된 학습 아카이브를 통해 언어 실력을 향상시키는 **AI 기반 외국어 일기 학습 플랫폼**입니다.

## 핵심 기능

- **다국어 일기 작성**: 15개국 언어 지원, 하루 1장 이미지 첨부, 저장 후 자동 목록 이동
- **AI 문장 교정**: Grok API 기반 문장/전체 교정 및 "뿌리 의미" 어드바이스, 교정 적용 시 자동 아카이브 저장
  - 단어 뿌리 이미지(root image) 생성으로 시각적 학습 지원
  - 완벽한 문장 형태의 교정 제안 제공
  - 학습 언어와 UI 언어 분리 지원
- **개인화 학습 아카이브**: 자주 틀리는 문법/단어 자동 저장, 중복 체크로 효율적 관리, 레벨에 맞춘 난이도 적용
- **AI 퀵퀴즈 생성**: Grok AI로 모국어 기반 4지선다 퀴즈 생성, Firebase 저장/재사용, 보기 랜덤화, 정답/오답 시각적 피드백 (7초)
- **레벨 & 코칭 대시보드**: AI 교정 시 학습어 레벨 추정 후 `users/{uid}/level`에 기록, 강화해야 할 부분을 `users/{uid}/advice`에 모국어+영어로 저장, 학습 대시보드에서 레벨/조언/일기 활동량을 다국어로 시각화
- **글라스모피즘 UI**: 몰입감 있는 다크모드 + 글라스모피즘 디자인
- **다중 인증 지원**: Google OAuth 및 이메일/패스워드 인증
- **SEO 최적화**: 메타 태그, robots.txt, sitemap.xml을 통한 검색 엔진 최적화
- **광고 통합**: Kakao AdFit을 통한 수익화 (PC/모바일 반응형)
- **프리미엄 구독**: 유료 가입자를 위한 광고 제거 시스템 (AdProvider 기반 전체 광고 제어)
- **3D 글로벌 라디오**: 3D 지구본 인터페이스로 전 세계 라디오 청취, 즐겨찾기, 듣기 시간 학습 데이터 연동
- **AI 말하기 연습**: 문장 단위 말하기 녹음 및 STT 텍스트 변환, AI 기반 발음·문법·표현 피드백 및 아카이브 자동 저장

## 지원 언어 (15개국)

한국어, 영어, 일본어, 중국어, 태국어, 베트남어, 인도네시아어, 스페인어, 포르투갈어, 프랑스어, 독일어, 터키어, 아랍어, 힌디어, 러시아어

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Dark Mode, Glassmorphism)
- **Backend**: Firebase (Auth, Firestore, Storage)
- **배포**: Firebase Hosting (CI/CD: GitHub Actions 적용)
- **AI**: Grok API
- **State Management**: React Query
- **SEO**: react-helmet-async, sitemap.xml, robots.txt
- **광고**: Kakao AdFit (PC/모바일 반응형)
- **구독 관리**: Firestore 기반 프리미엄 구독 시스템

## 로컬 실행

```bash
nvm use 20   # 로컬 빌드/배포 시 권장
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 확인하세요. `next.config.ts`의 `turbopack.root`가 리포지토리 루트로 강제되어 상위 lockfile 경고를 방지합니다.

## 테스트

```bash
npm run test
npm run test:e2e
npm run lhci:collect
```

## 광고 제어 (Kakao AdFit)

- `NEXT_PUBLIC_ENABLE_KAKAO_ADS`: `false`로 설정하면 모든 카카오 배너가 비활성화됩니다(기본값 `true`).
- `NEXT_PUBLIC_AD_ALLOWED_COUNTRY`: 기본 `KR`. 브라우저 언어/타임존/UTC+9 오프셋을 사용해 한국 접속자로 판단된 경우에만 배너가 노출됩니다.
- 개발 환경(`localhost`)이나 프리미엄 사용자에게는 항상 광고가 숨겨집니다.

예시:

```bash
NEXT_PUBLIC_ENABLE_KAKAO_ADS=true
NEXT_PUBLIC_AD_ALLOWED_COUNTRY=KR
```

## 품질/모니터링

- **RUM 계측**: LCP/INP/CLS/TTFB를 클라이언트에서 수집하여 `/api/observability/rum`으로 전송합니다.
- **JS 오류/Sentry 연동**: 전역 에러 및 Promise rejection을 `/api/observability/log`로 전달하며, `SENTRY_DSN`이 설정된 경우 Sentry로 포워딩합니다.
- **업타임 하트비트**: 클라이언트가 `/api/uptime`을 주기적으로 호출하여 가용성 로그를 남깁니다.
- **Lighthouse**: `npm run lhci:collect`로 빌드 후 LHCI를 실행해 성능/접근성 회귀를 확인합니다(`.lighthouse` 출력).
- **캐싱 가이드**: 정적 자산(`/_next/static`)은 1년 immutable, 이미지 변환(`/_next/image`)은 1일 + S-W-R 30일로 캐시됩니다(Cloudflare/Firebase CDN 호환).

## Firebase 보안 규칙

- Firestore: `firebase/firestore.rules` (유저 소유 데이터만 읽기/쓰기 허용)
- Storage: `firebase/storage.rules` (본인 UID 경로에만 이미지 업로드 허용)
- 배포 시 `firebase deploy --only firestore:rules,storage:rules` 로 반영하세요.

HTTPS

- 프로덕션에서는 미들웨어가 `x-forwarded-proto: http` 요청을 HTTPS로 301 리다이렉트합니다.

샘플 규칙

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }

    match /diaries/{docId} {
      allow read, write: if isSignedIn() && isOwner(request.resource.data.userId);
      allow read: if isSignedIn() && isOwner(resource.data.userId);
    }

    match /learning_archive/{docId} {
      allow read, write: if isSignedIn() && isOwner(request.resource.data.userId);
      allow read: if isSignedIn() && isOwner(resource.data.userId);
    }

    match /ai_corrections/{docId} {
      allow read, write: if isSignedIn() && isOwner(request.resource.data.userId);
      allow read: if isSignedIn() && isOwner(resource.data.userId);
    }

    match /quizzes/{docId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
    }

    match /subscriptions/{userId} {
      allow read: if isOwner(userId);
      allow write: if isSignedIn() && (request.auth.token.admin == true || isOwner(userId));
    }
  }
}
```

```storage
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isSignedIn() {
      return request.auth != null;
    }

    match /diaryImages/{userId}/{allPaths=**} {
      allow read, write: if isSignedIn() && request.auth.uid == userId;
    }
  }
}
```
