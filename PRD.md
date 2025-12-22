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
- 해결: 
  - 직관적인 달력/연도 탐색, 하루 1장 이미지 + 자동 용량 축소 업로드
  - 저장/삭제 후 자동으로 목록 페이지로 이동 (UX 개선)
- 지표: 일기 작성 이후 24시간 재방문 ≥ 35%

### 기능 2. AI 문장 교정 & 핵심 뿌리 의미 기반 어드바이스

- 문제: 문법·단어를 실제 문맥에서 어떻게 써야 하는지 학습하기 어려움
- 해결: 
  - Grok API로 문장 단위 교정/문장 전체 교정 선택 가능
  - **단어 뿌리 이미지(root image) 생성으로 시각적 학습 지원**
  - **완벽한 문장 형태의 교정 제안 제공 (학습 언어로 작성)**
  - **explanation은 UI 언어로 작성되며, 학습 언어 단어를 명시**
  - **교정 적용 시 자동으로 아카이브에 저장** (중복 체크로 효율적 관리)
- 지표: 교정 요청 대비 예시 문장 클릭 ≥ 45%

### 기능 3. 개인화 학습 아카이브 & AI 퀵퀴즈 생성

- 문제: 틀린 문법/단어가 반복되며 사용자별 약점이 명확하지 않음
- 해결: 
  - 잘 틀리는 문법·단어를 자동 저장 (중복 체크로 중복 방지)
  - Grok AI로 **모국어 기반** 4지선다 퀴즈 생성 및 Firebase 저장
  - 보기 순서 랜덤화로 학습 효과 증대
  - **정답/오답 시각적 피드백** (초록색/빨간색, 7초 자동 리셋)
  - 퀴즈 재사용으로 AI API 비용 절감
- 지표: 주간 학습 문제 풀이 ≥ 3회/주 사용자 비율 30%

### 기능 4. 3D 글로벌 라디오 (Radio Garden 스타일)

- **문제**: 언어 학습은 '공부'로 느껴지면 지루해짐. 자연스러운 노출(Immersion) 환경 부족.
- **해결**:
  - `react-globe.gl` 기반 **3D 지구본 인터페이스**로 탐험하는 재미 제공
  - **Radio Browser API** 연동으로 전 세계 수만 개의 라디오 스테이션 청취
  - **즐겨찾기**: 선호하는 국가/방송국 저장 및 원클릭 이동
  - **청취 시간 기록**: 언어별(ISO Code) 청취 시간을 자동 추적하여 학습 데이터로 활용
- **지표**: 일간 라디오 청취 시간 평균 ≥ 15분

### 기능 5. 레벨 추정 + 학습 코칭 대시보드

- **문제**: 학습자가 자신의 실력 수준과 부족한 영역을 직관적으로 파악하기 어렵고, 학습 난이도가 개인 수준에 맞지 않을 수 있음
- **해결**:
  - AI 교정 시 오류 패턴을 기반으로 학습어 레벨(예: CEFR A1~C2) 추정 후 `users/{userId}/level` 서브컬렉션에 기록(점수/신뢰도/근거 포함)
  - 동일한 교정 결과에서 강화해야 할 영역/추천 학습 액션을 `users/{userId}/advice` 서브컬렉션에 저장(타입·우선순위·모국어+영어 메시지)
  - 학습 아카이브/퀴즈 생성 시 최신 레벨에 맞는 난이도 프롬프트 적용(어휘/문법 복잡도 조절, distractor 난이도 조정)
  - 학습 대시보드(UI 다국어): 현재 레벨, 추세(최근 7/30일), 우선 학습 조언, 일기 작성/교정/퀴즈 활동량, 나와 평균 비교를 카드/차트로 한눈에 제공
- **지표**: 교정→레벨 기록률 ≥ 90%, 조언 클릭/완료율 ≥ 40%, 레벨 상승(월간) ≥ 0.3단계

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

```
Scenario: 사용자가 사전에서 단어를 저장하고 퀴즈를 푼다
  Given 사용자가 Dictionary 페이지에 있고 UI 언어/학습 언어를 설정해 두었을 때
  When 단어를 입력해 AI 사전 생성을 실행하고 "아카이브에 저장"을 누르면
  Then 결과가 UI 언어로 정리된 Core image·예문과 함께 저장되고 origin이 dictionary로 기록된다
  And 학습 아카이브에서 dictionary 필터로 확인하며, 생성되는 퀴즈는 의미형 4지선다로만 제공된다

```

```
Scenario: AI 교정 후 레벨과 학습 조언이 기록된다
  Given 사용자가 일기에서 AI 교정을 실행했을 때
  When 교정 결과가 반환되면
  Then 시스템은 오류 패턴을 분석해 학습어 레벨과 신뢰도를 `users/{uid}/level`에 저장하고
  And 부족한 영역/학습 액션을 다국어 조언으로 `users/{uid}/advice`에 저장하며
  And 학습 아카이브와 퀴즈 생성 시 해당 레벨에 맞는 난이도로 프롬프트를 조정한다

```

```
Scenario: 사용자가 라디오로 영어 듣기 연습을 한다
  Given 사용자가 라디오 페이지 지구본에서 '미국' 지역을 탐색하고
  When 특정 방송국 마커를 클릭하여 10분간 청취하면
  Then 해당 방송국의 언어(영어) 청취 시간이 600초 증가하고
  And "영어 듣기 시간" 통계에 즉시 반영된다
```

---

## 5. 성공 지표(자동 생성)

### 퍼널 & 웹 성능 지표

| 지표                  | 목표    | 기간      | 이벤트             | 계산식                             |
| --------------------- | ------- | --------- | ------------------ | ---------------------------------- |
| 일기 작성 완료율      | ≥ 60%   | 런칭+30일 | diary_created      | diary_created / diary_started      |
| AI 교정 사용률        | ≥ 70%   | 런칭+30일 | ai_correct_clicked | ai_correct_clicked / diary_created |
| 학습 문제 풀이 참여율 | ≥ 30%   | 런칭+30일 | quiz_started       | quiz_started / weekly_active_users |
| 사전→아카이브 전환율 | ≥ 35%   | 런칭+30일 | archive_created(origin=dictionary), dictionary_generate | archive_created(origin=dictionary) / dictionary_generate |
| 레벨 기록률          | ≥ 90%   | 상시      | level_recorded     | level_recorded / ai_correction_done |
| 학습 조언 액션률     | ≥ 40%   | 런칭+30일 | advice_clicked     | advice_clicked / advice_shown      |
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

### UI/UX

- 다크모드 기본 + 글라스모피즘 스타일 일관 적용(투명도, 블러 깊이, 대비 가이드 포함)
- 모바일 퍼스트 반응형(375px~)으로 레이아웃 설계, 폰트/간격/터치 타깃 최적화
- Flutter WebView 임베드 시 깨짐/스크롤 이슈 방지를 위한 안전 영역·뷰포트·제스처 호환성 유지
- 색상 토큰화로 학습/일기 주요 정보의 시각적 우선순위 확보
- 학습 대시보드: 레벨 카드(현재/추세), 우선 조언 리스트, 활동량 차트(일기/교정/퀴즈), 나와 평균 비교를 한눈에 표시

### 브라우저

- Chrome, Safari, Firefox 최신 2버전
- 모바일 웹(375px~)

### 아키텍처/구조

- 클린 아키텍처 적용: UI(Next.js) / Application 서비스 / Domain 모델 / Infrastructure(Firebase, Grok API, Storage) 레이어 분리
- Firebase/AI 호출은 인프라 어댑터를 통해 도메인 서비스가 의존하도록 설계
- 테스트 용이성을 위해 인터페이스 기반 의존성 역전 및 모킹 가능 구조 유지

### 보안

- Google OAuth2 인증
- 이메일/패스워드 인증 (회원가입, 로그인, 비밀번호 재설정, 이메일 변경)
- Firebase Authentication
- HTTPS Mandatory
- JWT 세션 만료 24시간
- AI API Key는 Cloud Functions에서 server-side로 호출

### 언어/국제화

- UI 언어와 학습 언어 분리
- **지원 언어 (15개국)**: 한국어, 영어, 일본어, 중국어(간체/번체), 태국어, 베트남어, 인도네시아어, 스페인어, 포르투갈어, 프랑스어, 독일어, 터키어, 아랍어, 힌디어, 러시아어
- 초기 실행 시 브라우저 언어 감지하여 기본값 설정
- 설정 페이지에서 Native Language (UI) 및 Learning Language 변경 가능
- 언어 선택 목록은 해당 언어의 원어 표기(Native Name)로 표시 (예: 한국어, English, 日本語)

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

| 필드              | TypeScript                                 | Firestore  | 제약   | 인덱스       | 설명                             |
| ----------------- | ------------------------------------------ | ---------- | ------ | ------------ | -------------------------------- |
| id                | string                                     | string     | PK     | PK           | 아카이브 ID                      |
| userId            | string                                     | string     | FK     | idx_user     | 사용자                           |
| type              | "grammar" \| "word"                        | string     | -      | idx_type     | 항목 종류                        |
| title             | string                                     | string     | -      | -            | 항목 이름                         |
| examples          | string[]                                   | array      | -      | -            | 예문(사전 예문+힌트 포함)        |
| rootMeaning       | string                                     | string     | -      | -            | 뿌리 의미                         |
| levelTag          | string \| undefined                        | string     | -      | idx_level    | 생성 시점의 레벨(예: B1)          |
| sourceId          | string \| undefined                        | string     | -      | idx_source   | 연계 원본 ID(일기/사전 엔트리 등) |
| sourceText        | string \| undefined                        | string     | -      | -            | 원문/사전 전체 텍스트            |
| origin            | "diary" \| "dictionary" \| "manual" \| "unknown" | string | - | idx_origin   | 저장 출처                        |
| quizCorrectCount  | number                                     | number     | -      | idx_quiz_cnt | 퀴즈 정답 누적                   |
| lastQuizAnsweredAt| Date \| undefined                          | timestamp  | -      | -            | 마지막 퀴즈 풀이 시각            |
| createdAt         | Date                                       | timestamp  | -      | idx_created  | 생성                             |

---

### 5. quizzes (신규)

| 필드         | TypeScript | Firestore | 제약 | 인덱스       | 설명               |
| ------------ | ---------- | --------- | ---- | ------------ | ------------------ |
| id           | string     | string    | PK   | PK           | 퀴즈 ID            |
| archiveId    | string     | string    | FK   | idx_archive  | 학습 아카이브 ID   |
| question     | string     | string    | -    | -            | 번역된 질문        |
| options      | string[]   | array     | -    | -            | 4개 보기           |
| correctIndex | number     | number    | -    | -            | 정답 인덱스 (0~3)  |
| explanation  | string     | string    | -    | -            | 해설 (모국어)      |
| quizType     | "grammar" \| "word" | string | - | idx_quiz_type | 퀴즈 유형(문법/어휘, 의미/스펠링 구분용) |
| createdAt    | Date       | timestamp | -    | idx_created  | AI 생성 시각       |

**특징**:
- Grok AI로 자동 생성 (문법/단어 패턴 기반)
- Firebase에 저장하여 재사용 (API 비용 절감)
- 매 로드 시 `randomizeQuizOptions()`로 보기 순서 랜덤화

---

### 6. subscriptions (신규)

| 필드 | TypeScript | Firestore | 제약 | 인덱스 | 설명 |
| ------------ | ---------- | --------- | ---- | ------------ | ------------------ |
| userId | string | string | PK | PK | 사용자 ID |
| isPremium | boolean | boolean | NOT NULL | idx_premium | 프리미엄 회원 여부 |
| subscriptionType | string | string | - | - | 'monthly', 'yearly', 'lifetime' |
| startDate | Date | timestamp | - | - | 구독 시작일 |
| endDate | Date | timestamp | - | idx_endDate | 구독 만료일 |
| createdAt | Date | timestamp | NOT NULL | idx_created | 생성일 |
| updatedAt | Date | timestamp | NOT NULL | - | 수정일 |

**특징**:
- 프리미엄 회원 광고 제거 시스템
- AdProvider로 전체 광고 한번에 제어
- 구독 만료 자동 확인 및 해제 기능
- Security Rules로 본인만 읽기 가능

---

### 7. radio_favorites (신규)

| 필드 | TypeScript | Firestore | 제약 | 인덱스 | 설명 |
| --- | --- | --- | --- | --- | --- |
| id | string | string | PK | PK | Station UUID |
| name | string | string | - | - | 방송국명 |
| country | string | string | - | - | 국가명 |
| language | string | string | - | - | 주 언어 |
| coordinates | GeoPoint | geopoint | - | - | 위치 |
| createdAt | Date | timestamp | - | idx_created | 정렬용 |

### 8. radio_stats (신규)

**Path**: `users/{userId}/stats/radio` (단일 문서)

| 필드 | TypeScript | Firestore | 제약 | 인덱스 | 설명 |
| --- | --- | --- | --- | --- | --- |
| totalSeconds | number | number | - | - | 총 청취 시간 |
| byLanguage | Map<string, number> | map | - | - | 언어별 청취 시간 (예: `{"en": 3600}`) |
| lastListenedAt | Date | timestamp | - | - | 마지막 활동 |

---

### 9. level (신규)

**Path**: `users/{userId}/level/{levelId}` (교정 이벤트별 기록)

| 필드          | TypeScript | Firestore  | 제약   | 인덱스       | 설명                             |
| ------------- | ---------- | ---------- | ------ | ------------ | -------------------------------- |
| id            | string     | string     | PK     | PK           | 레벨 기록 ID                     |
| level         | string     | string     | -      | idx_level    | 예: CEFR A1~C2 또는 내부 점수    |
| score         | number     | number     | -      | idx_score    | 정량 점수(0~1 또는 0~100)        |
| confidence    | number     | number     | -      | -            | 추정 신뢰도(0~1)                 |
| sourceType    | string     | string     | -      | idx_source   | ai_correction/quiz/diary_manual  |
| sourceId      | string     | string     | -      | -            | 근거가 된 리소스 ID              |
| language      | string     | string     | -      | idx_lang     | 학습 언어 코드                   |
| rationale     | string     | string     | -      | -            | 레벨 판단 근거 요약              |
| createdAt     | Date       | timestamp  | -      | idx_created  | 기록 시각                        |

---

### 10. advice (신규)

**Path**: `users/{userId}/advice/{adviceId}`

| 필드        | TypeScript | Firestore | 제약   | 인덱스       | 설명                                        |
| ----------- | ---------- | --------- | ------ | ------------ | ------------------------------------------- |
| id          | string     | string    | PK     | PK           | 조언 ID                                     |
| topic       | string     | string    | -      | idx_topic    | grammar/vocab/pronunciation/fluency 등      |
| priority    | "high"\|"medium"\|"low" | string | - | idx_priority | 중요도                                     |
| message     | map<string,string> | map | - | - | 다국어 메시지(UI 언어별 번역)               |
| actions     | string[]   | array     | -      | -            | 실행 가능한 학습 액션 리스트               |
| relatedLevel| string     | string    | -      | idx_level    | 해당 레벨(예: B1)                           |
| sourceId    | string     | string    | -      | -            | 근거 교정/아카이브/퀴즈 ID                  |
| completed   | boolean    | boolean   | -      | idx_completed| 완료 여부                                   |
| createdAt   | Date       | timestamp | -      | idx_created  | 생성 시각                                   |
| updatedAt   | Date       | timestamp | -      | -            | 업데이트 시각                               |

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
  - [완료] Kakao AdFit 광고 통합 (PC/모바일 반응형)
  - [완료] 프리미엄 구독 시스템 (AdProvider 기반 광고 제어)
  - [완료] Firestore 구독 관리 및 Security Rules
- [완료] GitHub Actions 기반 배포 자동화
- [완료] SEO 최적화 (메타 태그, sitemap.xml, robots.txt)
- [완료] 이메일/패스워드 인증 시스템
- [완료] 일기 삭제 시 퀴즈 cascade delete
- [완료] UI/UX 대폭 개선 (파비콘, 일기 페이지 사이드바 등)
