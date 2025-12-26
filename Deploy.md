# Loglingo 배포 가이드 (Deployment Guide)

이 문서는 Loglingo 웹 애플리케이션의 환경 설정, 배포 프로세스, CI/CD 구성을 설명합니다.

## 1. 사전 준비 (Prerequisites)

- **Firebase 프로젝트**: Blaze 플랜(종량제) 필수 (Cloud Functions 사용 시).
- **GitHub 리포지토리**: 소스 코드 관리.
- **Node.js**: v18 또는 v20 (LTS 권장).
- **Grok API Key**: 말하기 기능(AI 분석)을 위해 필요.

## 2. 환경 변수 설정 (Environment Setup)

### 로컬 개발 환경 (.env)
루트 디렉토리의 `.env` 파일에 다음 변수들을 설정합니다.

```bash
# Firebase Client SDK Config
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# ... 기타 Firebase Config ...

# AI Feature (Speaking)
GROK_API_KEY=your-grok-api-key-here
GROK_MODEL=grok-4-fast-non-reasoning

# Firebase Admin SDK (Local only - for Cloud Functions emulation)
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

### GitHub Actions Secrets
자동 배포를 위해 GitHub 리포지토리의 Secrets에 다음을 추가해야 합니다.
(Settings -> Secrets and variables -> Actions)

- `FIREBASE_SERVICE_ACCOUNT_LOGLING_34FC9`: Firebase Service Account JSON 전체 내용.

## 3. 배포 방법 (Deployment Methods)

### A. GitHub Actions (자동 배포 - 권장)
`main` 브랜치에 코드가 푸시되면 `.github/workflows/deploy.yml`이 실행되어 자동으로 배포됩니다.
- **포함 내용**: Hosting, Cloud Functions(일부), Firestore Rules/Indexes(설정에 따라 다름).
- **트리거**: Push to `main`.

### B. 수동 배포 (Manual Deployment)

CLI를 사용하여 개별 기능을 수동으로 배포할 수 있습니다.

#### 1. Firestore 인덱스 배포
```bash
firebase deploy --only firestore:indexes
```
*시간이 소요될 수 있습니다 (수 분).*

#### 2. Firestore 보안 규칙 배포
```bash
firebase deploy --only firestore:rules
```
*Speaking 기능 등 새로운 컬렉션 규칙이 포함됩니다.*

#### 3. Cloud Functions (학습 통계 등) 배포
```bash
cd firebase/functions
npm install
npm run build
cd ../..
firebase deploy --only functions
```
*배포 후 Cloud Scheduler 설정이 필요할 수 있습니다 (아래 참조).*

#### 4. Hosting (Frontend) 배포
Next.js 앱을 빌드하고 호스팅에 배포합니다.
```bash
npm run build
firebase deploy --only hosting
```

## 4. 기능별 추가 설정

### Speaking Feature (말하기)
- **API Key**: `GROK_API_KEY`가 배포 환경(Vercel 또는 Firebase Functions 환경변수)에 설정되어 있어야 합니다.
- **Firestore Rules**: `speaking_sessions`, `speaking_feedback` 컬렉션에 대한 규칙이 배포되어야 합니다.

### Learning Stats (학습 통계)
- **Cloud Functions**: `refreshLearningStats` 함수가 배포되어야 합니다.
- **Cloud Scheduler**: 
  - 주기: `0 * * * *` (매 시간)
  - 대상: `refreshLearningStats` HTTP URL (GET)
  - 설정 방법: Firebase Console -> Functions 탭 또는 GCP Console -> Cloud Scheduler.

## 5. 문제 해결 (Troubleshooting)

### Q: "stats_global/learning document not found" 경고
- **원인**: 통계 집계 함수가 아직 실행되지 않음.
- **해결**: Cloud Scheduler에서 작업을 '지금 실행' 하거나, `curl`로 함수 URL을 호출하여 초기 데이터를 생성하세요.

### Q: 배포 실패 "requires Blaze plan"
- **원인**: 무료 플랜 사용 중.
- **해결**: Firebase Console에서 프로젝트를 Blaze 플랜으로 업그레이드하세요.

### Q: GitHub Actions 배포 실패
- **원인**: Secret 키 누락 또는 빌드 에러.
- **해결**: 로컬에서 `npm run build`가 성공하는지 확인하고, GitHub Secrets 설정을 점검하세요.
