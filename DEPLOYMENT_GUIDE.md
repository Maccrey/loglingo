# Firestore 인덱스 및 집계 시스템 배포 가이드

이 가이드는 Firestore 인덱스 설정과 Cloud Functions 기반 학습 통계 집계 시스템을 배포하는 방법을 설명합니다.

## 📋 사전 준비

### 1. Firebase 프로젝트 설정 확인

```bash
firebase projects:list
```

현재 프로젝트가 **Blaze 플랜(종량제)**인지 확인하세요. Cloud Functions는 Blaze 플랜에서만 사용 가능합니다.

### 2. Firebase Admin SDK Service Account 키 생성

1. Firebase Console 접속: https://console.firebase.google.com
2. 프로젝트 선택
3. **Project Settings** (⚙️ 아이콘) 클릭
4. **Service Accounts** 탭 선택
5. **Generate new private key** 버튼 클릭
6. 다운로드된 JSON 파일 열기

### 3. 환경 변수 설정

`.env` 파일에 Service Account 정보 추가:

```bash
# Service Account JSON에서 추출
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
... (전체 키를 복사하되, 줄바꿈을 \\n으로 변환하지 말고 그대로 유지)
-----END PRIVATE KEY-----"
```

**주의:** `FIREBASE_PRIVATE_KEY`는 따옴표로 감싸고, 실제 줄바꿈을 유지해야 합니다.

## 🚀 배포 순서

### 1단계: Firestore 인덱스 배포

```bash
firebase deploy --only firestore:indexes
```

**예상 결과:**
```
✔ Deploy complete!

Indexes:
  - learning_archive (userId ASC, levelTag ASC, createdAt DESC)
    Status: Building (may take a few minutes)
```

인덱스 빌드는 데이터 양에 따라 **몇 분~몇 십분** 소요될 수 있습니다.

**인덱스 상태 확인:**
- Firebase Console → Firestore → 인덱스 탭
- 상태가 "구축 중" → "사용 설정됨"으로 변경될 때까지 대기

### 2단계: Firestore 보안 규칙 배포

```bash
firebase deploy --only firestore:rules
```

**배포 내용:**
- `stats_global` 컬렉션 읽기 권한 추가 (모든 인증 사용자)
- 쓰기 권한은 Cloud Functions만 허용

### 3단계: Cloud Functions 빌드 및 배포

```bash
cd firebase/functions
npm run build
cd ../..
firebase deploy --only functions
```

**예상 결과:**
```
✔ functions[refreshLearningStats]: Successful create operation.
Function URL: https://asia-northeast3-your-project-id.cloudfunctions.net/refreshLearningStats
```

**배포 완료 확인:**
```bash
firebase functions:list
```

### 4단계: Cloud Scheduler 설정

Cloud Functions는 배포되었지만, **자동 실행 스케줄**은 수동으로 설정해야 합니다.

#### 방법 1: Firebase Console (권장)

1. Firebase Console → Functions 탭
2. `refreshLearningStats` 함수 찾기
3. "스케줄" 또는 "Trigger" 섹션에서 설정

#### 방법 2: Google Cloud Console

1. https://console.cloud.google.com
2. 프로젝트 선택
3. **Cloud Scheduler** 검색
4. **작업 만들기** 클릭
5. 설정:
   - **이름:** `refresh-learning-stats-hourly`
   - **빈도:** `0 * * * *` (매 시간 정각)
   - **시간대:** `Asia/Seoul`
   - **대상 유형:** HTTP
   - **URL:** Functions 배포 시 출력된 URL
   - **HTTP 메서드:** GET
6. **만들기** 클릭

### 5단계: 초기 데이터 수동 실행

스케줄러 설정 후 첫 실행을 기다리지 말고, 즉시 실행하여 `stats_global/learning` 문서를 생성합니다.

```bash
# Cloud Functions URL로 직접 호출 (브라우저 또는 curl)
curl https://asia-northeast3-your-project-id.cloudfunctions.net/refreshLearningStats
```

또는:

1. Cloud Scheduler → `refresh-learning-stats-hourly` 작업
2. **지금 실행** 버튼 클릭

**확인:**
```bash
firebase firestore:read stats_global/learning
```

또는 Firebase Console → Firestore → `stats_global/learning` 문서 확인

## ✅ 배포 검증

### 1. API 엔드포인트 테스트

로컬 개발 서버 실행:
```bash
npm run dev
```

API 호출:
```bash
curl http://localhost:3000/api/learning/aggregate
```

**예상 응답:**
```json
{
  "average": {
    "diaries7d": 3,
    "archivesTotal": 15,
    "adviceOpen": 1,
    "level": "B1",
    "score": 68
  },
  "target": {
    "diaries7d": 5,
    "archivesTotal": 20,
    "adviceOpen": 0,
    "level": "B2",
    "score": 78
  }
}
```

### 2. Cloud Functions 로그 확인

```bash
firebase functions:log --only refreshLearningStats
```

**정상 로그 예시:**
```
🔄 Starting learning stats refresh...
✅ Learning stats refreshed successfully { userCount: 10, totalArchives: 150, average: {...}, target: {...} }
```

### 3. 학습 대시보드 확인

1. 애플리케이션 실행
2. 학습 페이지 접속
3. 통계 카드에 집계 데이터가 표시되는지 확인

## 🔧 문제 해결

### Q1: "stats_global/learning document not found" 경고

**원인:** Cloud Function이 아직 실행되지 않음

**해결:**
- Cloud Scheduler에서 수동 실행
- 또는 1시간 대기 (자동 실행)
- Fallback 데이터가 자동으로 사용되므로 기능은 정상 작동

### Q2: Cloud Functions 배포 실패 - "requires Blaze plan"

**원인:** Firebase 프로젝트가 무료 플랜

**해결:**
```bash
firebase projects:upgrade
```

### Q3: Admin SDK 초기화 실패 - "credential error"

**원인:** 환경 변수 설정 오류

**해결:**
1. `.env` 파일에서 `FIREBASE_PRIVATE_KEY` 확인
2. 따옴표로 감싸져 있는지 확인
3. 줄바꿈이 유지되어 있는지 확인 (`\\n`이 아닌 실제 줄바꿈)
4. 개발 서버 재시작

### Q4: 인덱스 에러 - "requires an index"

**원인:** 인덱스가 아직 빌드 중

**해결:**
- Firebase Console → Firestore → 인덱스에서 상태 확인
- "구축 중"이면 완료될 때까지 대기
- 또는 에러 메시지의 인덱스 생성 링크 클릭

## 📊 모니터링

### Cloud Functions 비용 확인

```bash
open https://console.cloud.google.com/billing/reports
```

**예상 비용:**
- 매 시간 1회 실행 = 월 720회
- 실행 시간: ~5초
- 예상 월 비용: **$0.01 미만** (무료 할당량 내)

### 실행 통계 확인

Firebase Console → Functions → `refreshLearningStats` → Metrics

- 호출 횟수
- 평균 실행 시간
- 에러율

## 🎯 다음 단계

1. **레벨 필터 쿼리 최적화**: 인덱스를 활용한 `levelTag` 필터링 구현
2. **집계 데이터 확장**: 언어별, 국가별 통계 추가
3. **실시간 업데이트**: Firestore snapshot listener로 대시보드 실시간 반영
4. **성능 모니터링**: Cloud Monitoring 알림 설정

---

**문의:** 추가 질문이나 문제가 있으면 이슈를 등록해주세요.
