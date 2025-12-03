# Loglingo

**Loglingo**는 외국어 학습자가 직접 쓴 일기를 AI가 교정해주고, 개인화된 학습 아카이브를 통해 언어 실력을 향상시키는 **AI 기반 외국어 일기 학습 플랫폼**입니다.

## 핵심 기능

- **다국어 일기 작성**: 14개국 언어 지원, 하루 1장 이미지 첨부
- **AI 문장 교정**: Grok API 기반 문장/전체 교정 및 "뿌리 의미" 어드바이스
- **개인화 학습 아카이브**: 자주 틀리는 문법/단어 자동 저장
- **AI 퀵퀴즈 생성**: Grok AI로 4지선다 퀴즈 자동 생성, Firebase 저장, 보기 랜덤화, 정답/오답 시각적 피드백
- **글라스모피즘 UI**: 몰입감 있는 다크모드 + 글라스모피즘 디자인

## 지원 언어 (14개국)

한국어, 영어, 일본어, 중국어, 태국어, 베트남어, 인도네시아어, 스페인어, 포르투갈어, 프랑스어, 독일어, 터키어, 아랍어, 힌디어

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Dark Mode, Glassmorphism)
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI**: Grok API
- **State Management**: React Query

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 확인하세요.

## 테스트

```bash
npm run test
npm run test:e2e
npm run lhci:collect
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
