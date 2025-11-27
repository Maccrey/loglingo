## 1. 제품 개요

### 문제 정의

외국어 학습자는 배운 언어를 실제로 써보는 경험이 부족하여 문장력·문법·표현력이 느리게 성장한다. 기존 일기 앱은 학습 보조 기능이 부족하거나 언어별 맞춤 피드백을 제공하지 못한다.

### 타깃

- 18~45세 외국어 학습자
- 글로벌 대상(웹 기반)
- Web(Chrome/Firefox/Safari), 모바일 웹 대응
- 추후 Flutter WebView 기반 앱 확장

### 해결 전략

- 다국어 Web 일기 + AI 기반 문장 교정 + 개인화 학습 아카이브 제공
- 문법·단어의 “기본 뿌리(원형 의미)” 중심의 AI 학습 어드바이스
- Grok API로 문장 단위/일기 단위의 언어 피드백 자동 생성
- Firebase 기반으로 저비용 MVP → 확장성 고려

### 차별점

- “사전형 뜻”이 아닌 “핵심 뿌리 의미” 중심 언어 분석 & 학습 문제 자동 생성
- 일기→학습 아카이브→문제화→복습의 반복 학습 사이클
- 다국어 UI·학습 언어 분리
- 비용 최소화를 위한 Firebase + Edge 캐싱 전략

---

## 2. 핵심 가치 제안

학습자가 “직접 쓴 문장”을 AI가 분석하여, 언어의 뿌리 의미·문법 패턴·자주 틀리는 부분·단어 핵심 이미지를 자동 아카이브하고 문제로 변환하는 **최적의 외국어 일기 기반 학습 시스템**.

---

## 3. 핵심 기능 3개

### 기능 1. 다국어 Web 일기 CRUD + 이미지 첨부

- 문제: 학습자가 기록을 남기기 어렵고 지속성 부족
- 해결: 직관적인 달력/연도 탐색, 하루 1장 이미지 + 자동 용량 축소 업로드
- 지표: 일기 작성 이후 24시간 재방문 ≥ 35%

### 기능 2. AI 문장 교정 & 핵심 뿌리 의미 기반 어드바이스

- 문제: 문법·단어를 실제 문맥에서 어떻게 써야 하는지 학습하기 어려움
- 해결: Grok API로 문장 단위 교정/문장 전체 교정 선택 가능
- 지표: 교정 요청 대비 예시 문장 클릭 ≥ 45%

### 기능 3. 개인화 학습 아카이브 & 문제 자동 생성

- 문제: 틀린 문법/단어가 반복되며 사용자별 약점이 명확하지 않음
- 해결: 잘 틀리는 문법·단어를 자동 저장 + 객관식 문제 자동 생성
- 지표: 주간 학습 문제 풀이 ≥ 3회/주 사용자 비율 30%

---

## 4. 유저 스토리 (Gherkin 포함)

### 역할: 학습자

### 목표: 외국어로 일기 작성 → AI 교정 → 반복 학습

### 수용 기준

- 일기 작성 후 AI 버튼 클릭 시 교정 결과 3초 내 렌더링
- 문장 단위/전체 단위 교정 모드 선택 가능
- “자주 틀리는 패턴” 자동 저장

### Gherkin

```
Scenario: 사용자가 일기를 작성하고 AI 교정을 요청한다
  Given 사용자가 일기 작성 화면에 있고
  When 사용자가 텍스트와 이미지를 입력한 후 "AI 교정" 버튼을 누르면
  Then 시스템은 Grok API로 교정 결과를 반환하고
  And 문법 오류, 단어의 뿌리 의미 가이드, 수정 제안이 표시된다

```

```
Scenario: 사용자가 아카이브 문제를 푼다
  Given 사용자가 학습 아카이브 페이지에 있고
  When 사용자가 특정 문법 항목에 대한 문제 풀기를 선택하면
  Then 객관식 문제가 생성되고
  And 정답 여부와 해설이 제공된다

```

---

## 5. 성공 지표(자동 생성)

### 퍼널 & 웹 성능 지표

| 지표                  | 목표    | 기간      | 이벤트             | 계산식                             |
| --------------------- | ------- | --------- | ------------------ | ---------------------------------- |
| 일기 작성 완료율      | ≥ 60%   | 런칭+30일 | diary_created      | diary_created / diary_started      |
| AI 교정 사용률        | ≥ 70%   | 런칭+30일 | ai_correct_clicked | ai_correct_clicked / diary_created |
| 학습 문제 풀이 참여율 | ≥ 30%   | 런칭+30일 | quiz_started       | quiz_started / weekly_active_users |
| D1 재방문             | ≥ 35%   | 상시      | app_open           | users active on day1 / new users   |
| D7 재방문             | ≥ 22%   | 상시      | app_open           | users active day7 / new users      |
| LCP p75(모바일)       | ≤ 2.5s  | 상시      | RUM                | p75(LCP)                           |
| INP p75               | ≤ 200ms | 상시      | RUM                | p75(INP)                           |
| CLS p75               | ≤ 0.1   | 상시      | RUM                | p75(CLS)                           |
| TTFB                  | ≤ 0.8s  | 상시      | RUM                | p75(TTFB)                          |
| JS 오류율             | ≤ 0.5%  | 상시      | Sentry             | errors/sessions                    |
| 가용성                | ≥ 99.9% | 월간      | Uptime             | (총시간-다운)/총시간               |

---

## 6. 비기능 요구사항

### 성능

- 이미지 업로드 시 WebP로 변환 후 최대 300KB
- AI 요청은 3초 내 응답 목표
- Firebase Hosting + Cloudflare CDN 캐싱 적용

### 접근성

- WCAG 2.1 AA
- 키보드 내비게이션 필수

### 브라우저

- Chrome, Safari, Firefox 최신 2버전
- 모바일 웹(375px~)

### 보안

- Google OAuth2
- Firebase Authentication
- HTTPS Mandatory
- JWT 세션 만료 24시간
- AI API Key는 Cloud Functions에서 server-side로 호출

### 언어/국제화

- UI 언어와 학습 언어 분리

---

## 7. 데이터 모델 (자동 생성)

### 저장소 선택 근거

- 일기/교정/문제/아카이브 모두 구조화된 데이터 → Firestore 적합
- 고정 스키마 + 확장성 → 각 문서 컬렉션 설계
- 이미지 저장은 Firebase Storage

### 엔티티 다이어그램(텍스트)

```
User ───< Diary ───< AI_Corrections
         │
         └──< DiaryImages

User ───< LearningArchive ───< QuizQuestions

```

---

### 스키마

### 1. users

| 필드             | TypeScript | 저장타입(Firestore) | 제약     | 인덱스      | 설명          |
| ---------------- | ---------- | ------------------- | -------- | ----------- | ------------- |
| id               | string     | string              | PK       | PK          | UID           |
| email            | string     | string              | UNIQUE   | idx_email   | 로그인 이메일 |
| uiLanguage       | string     | string              | -        | -           | UI 언어       |
| learningLanguage | string     | string              | -        | -           | 학습 언어     |
| createdAt        | Date       | timestamp           | NOT NULL | idx_created | 가입 시각     |

예시: `{ id:"u1", email:"a@b.com", uiLanguage:"ko", learningLanguage:"en" }`

---

### 2. diaries

| 필드       | TypeScript | Firestore | 제약          | 인덱스      | 설명         |
| ---------- | ---------- | --------- | ------------- | ----------- | ------------ |
| id         | string     | string    | PK            | PK          | 일기 ID      |
| userId     | string     | string    | FK(users)     | idx_user    | 작성자       |
| date       | string     | string    | NOT NULL      | idx_date    | yyyy-mm-dd   |
| content    | string     | string    | -             | -           | 일기 내용    |
| imageUrl   | string     | string    | -             | -           | 1장 이미지   |
| aiReviewed | boolean    | boolean   | DEFAULT false | idx_ai      | AI 교정 여부 |
| createdAt  | Date       | timestamp | -             | idx_created | 생성         |

---

### 3. ai_corrections

| 필드             | TypeScript | Firestore | 제약   | 인덱스      | 설명             |
| ---------------- | ---------- | --------- | ------ | ----------- | ---------------- |
| id               | string     | string    | PK     | PK          | 교정 ID          |
| diaryId          | string     | string    | FK     | idx_diary   | 연결             |
| mode             | "sentence" | "full"    | string | -           | -                |
| original         | string     | string    | -      | -           | 원문             |
| corrected        | string     | string    | -      | -           | 교정문           |
| rootMeaningGuide | any        | map       | -      | -           | 뿌리 의미 가이드 |
| createdAt        | Date       | timestamp | -      | idx_created | 생성             |

---

### 4. learning_archive

| 필드        | TypeScript | Firestore | 제약   | 인덱스      | 설명        |
| ----------- | ---------- | --------- | ------ | ----------- | ----------- |
| id          | string     | string    | PK     | PK          | 아카이브 ID |
| userId      | string     | string    | FK     | idx_user    | 사용자      |
| type        | "grammar"  | "word"    | string | -           | idx_type    |
| title       | string     | string    | -      | -           | 항목 이름   |
| examples    | string[]   | array     | -      | -           | 예문        |
| rootMeaning | string     | string    | -      | -           | 뿌리 의미   |
| createdAt   | Date       | timestamp | -      | idx_created | 생성        |

---

### 5. quiz_questions

| 필드        | TypeScript | Firestore | 제약 | 인덱스      | 설명             |
| ----------- | ---------- | --------- | ---- | ----------- | ---------------- |
| id          | string     | string    | PK   | PK          | 문제 ID          |
| archiveId   | string     | string    | FK   | idx_archive | 학습 아카이브 ID |
| question    | string     | string    | -    | -           | 문제             |
| options     | string[]   | array     | -    | -           | 보기             |
| answer      | number     | number    | -    | -           | 0~3 인덱스       |
| explanation | string     | string    | -    | -           | 해설             |

---

### 캐싱 전략

- User profile: Cloudflare Edge TTL 300s
- Diary list: SWR 캐싱 60s
- AI 교정 응답: 캐싱하지 않음

---

## 8. 마이그레이션/버전 전략

- Firestore 구조 변경 시 `version` 필드 부여
- Backward compatible 우선
- 배포 단계: shadow write → double read → switch

---

## 9. 런칭 플랜

### MVP (4주)

- Google 로그인
- 일기 CRUD + 이미지 업로드
- AI 전체 교정 기능
- 학습 아카이브 자동 저장

### MLP (8주)

- 문장 단위 교정
- 문제 자동 생성
- 달력/연도 네비게이션

### GA (12~16주)

- 비용 절감형 캐싱
- Flutter WebView 앱
- 광고/구독 추가
