# Loglingo

**Loglingo**는 외국어 학습자가 직접 쓴 일기를 AI가 교정해주고, 개인화된 학습 아카이브를 통해 언어 실력을 향상시키는 **AI 기반 외국어 일기 학습 플랫폼**입니다.

## 핵심 기능

- **다국어 일기 작성**: 14개국 언어 지원, 하루 1장 이미지 첨부
- **AI 문장 교정**: Grok API 기반 문장/전체 교정 및 "뿌리 의미" 어드바이스
- **개인화 학습 아카이브**: 자주 틀리는 문법/단어 자동 저장 및 퀴즈 생성
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

## Firebase 보안 규칙

- Firestore: `firebase/firestore.rules` (유저 소유 데이터만 읽기/쓰기 허용)
- Storage: `firebase/storage.rules` (본인 UID 경로에만 이미지 업로드 허용)
- 배포 시 `firebase deploy --only firestore:rules,storage:rules` 로 반영하세요.

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
