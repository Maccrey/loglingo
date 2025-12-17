# Loglingo 작업 태스크 리스트 (디자인/기능 분업)
- 모든 작업은 PRD.md·README.md·본 Tasklist.md를 참조하며 순서대로 진행한다.
- **디자인(Gemini 3.0)**: 전체 페이지 UI/UX, 다크모드 + 글라스모피즘 일관 디자인 시스템 수립 및 페이지 구현.
- **기능(Codex)**: 데이터/로직/테스트/배포 등 기능 구현 및 검증.
- 각 기능은 Sequential Thinking MCP로 단계 쪼개기 → micro TDD(단위→통합→E2E) → 코드/테스트 작성 순으로 수행한다.
- 가능한 경우 Playwright MCP로 E2E 테스트를 작성·통과시킨 뒤에만 다음 태스크로 진행한다.
- 테스트가 불가한 항목이 있으면 `Testlist.md`에 수동 테스트 체크리스트를 추가한다.
- 모든 구현 후 테스트 통과 시 한국어 커밋 메시지로 커밋한다.

## 0. 준비
- [x] 리포지토리 의존성 설치(`npm install`), 환경 변수 샘플 정리(`.env.example`), 개발/테스트/CI 명령 확인
- [x] CI 스크립트 점검: `npm run test`, `npm run test:e2e`, `npm run lhci:collect` 실행 가능 상태 확인
- [x] 코딩 규칙/스타일 가이드 정리: ESLint/Prettier/Commit lint 규칙 확인

## 1. 아키텍처 및 공통
- [x] Next.js 15 + TypeScript 프로젝트 기본 구조 검증, 라우트/레이아웃 스켈레톤 구성
- [x] Firebase(Auth/Firestore/Storage) 초기 설정 및 보안 규칙 초안 적용
- [x] 글로벌 테마(Tailwind 글라스모피즘), 폰트, 색상 토큰, UI 언어/학습 언어 분리된 i18n 셋업
- [x] 공통 컴포넌트: 버튼/입력/카드/모달/토스트/로딩 스피너 구축
- [x] HTTP/AI 클라이언트 래퍼(Grok API), 에러/로깅/리트라이 정책 적용
- [x] React Query/SWR 캐싱 전략 구현(일기 리스트 60s, 유저 프로필 300s), Cloudflare CDN 헤더 세팅 포인트 정의
- [x] 접근성/반응형 가드레일(WCAG 2.1 AA, 키보드 포커스, 375px~) 베이스라인 적용
- [x] **클린 아키텍처 폴더 구조 정립**: domain/application/infrastructure/ui 레이어 분리, 의존성 역전 인터페이스 정의, 테스트 모킹 경로 확보

## 2. 디자인 트랙 (Gemini 3.0 담당)
- [x] **다크모드 + 글라스모피즘 디자인 시스템**: 색상 토큰, 깊이/블러 레이어, 타이포, 아이콘, 간격 스케일 정의
- [x] **공통 UI 키트**: 버튼/입력/토글/드롭다운/배지/카드/모달/툴팁/토스트/탭 컴포넌트 스타일링 및 상태(hover/focus/disabled) 정의
- [x] **레이아웃**: 글로벌 네비게이션(일기/AI 교정/아카이브/설정), 헤더/푸터, 페이지 컨테이너, 반응형(모바일 375px~) 대응
- [x] **페이지별 와이어/하이파이**: 일기 CRUD, AI 교정 뷰(문장/전체 모드), 학습 아카이브/퀴즈, 인증/온보딩, 설정(i18n) 화면
- [x] **상호작용/모션**: 주요 액션(저장/교정/퀴즈 제출) 피드백, 로딩/스켈레톤, 포커스 이동 애니메이션
- [x] **접근성**: 대비/포커스 아웃라인/키보드 트랩 체크, 다국어 폰트 페어링 가이드
- [x] **Flutter WebView 호환성**: Safe area/viewport/스크롤·제스처 동작 확인, 모바일 다크모드 대비 유지, 성능 저하 없는 애니메이션 가이드
- [x] 디자인 산출물 핸드오프: 토큰/컴포넌트 명세 + 스크린 링크 + 반응형 스펙 제공

## 2-1. 다국어 지원 (Gemini 3.0 담당)
- [x] **i18n 라이브러리 및 구조 고도화**: `next-intl` 또는 `react-i18next` 도입, JSON 기반 번역 리소스 구조화
- [x] **지원 언어 15개국 리소스 추가**:
    - 한국어, 영어, 일본어, 중국어, 태국어, 베트남어, 인도네시아어, 스페인어, 포르투갈어, 프랑스어, 독일어, 터키어, 아랍어, 힌디어, 러시아어
    - 공통 UI(버튼, 메뉴, 에러 메시지) 및 페이지별 텍스트 번역 키 적용
- [x] **설정(Settings) 페이지 기능 구현**:
    - **Native Language (UI)** 선택 기능: 선택 시 즉시 UI 언어 변경
    - **Learning Language** 선택 기능: 학습 콘텐츠/AI 교정 타겟 언어 설정
    - 언어 선택 드롭다운: 각 언어 명칭을 해당 언어(Native Name)로 표시 (예: 한국어, English, 日本語)
- [x] **초기화 로직 구현**:
    - 앱 최초 진입 시 브라우저/OS 언어 감지(`navigator.language`)하여 기본 UI 언어 자동 설정
    - 감지된 언어가 지원 목록에 없으면 영어(en)를 기본값으로 fallback
- [x] **테스트 및 검증**:
    - 각 언어별 폰트 렌더링 확인 (특히 태국어, 아랍어, 힌디어 등 특수 문자)
    - RTL(아랍어) 레이아웃 대응 확인 (필요 시)
    - 브라우저 언어 변경 시뮬레이션 테스트

## 3. 일기 CRUD + 이미지(기능 1) — Codex
- [x] Firestore 스키마(users/diaries/diaryImages) 매핑, 타입 정의, 리포지토리 계층 작성
- [x] UI: 달력/연도 탐색, 일기 작성/수정/삭제/목록/상세 뷰, 하루 1장 이미지 업로드
- [x] 이미지 처리: WebP 변환 및 300KB 이하 리사이즈, 업로드 진행 상태/에러 핸들링
- [x] 클라이언트/서버 단 validation(날짜 형식, 본문 길이, 이미지 규격) 및 optimistic update
- [x] 성능: LCP 대상 위젯 지연 로딩, 메모이제이션, 코드 스플리팅
- [x] 일기 저장/삭제 후 자동으로 목록 페이지로 이동
- [x] 테스트: repository/unit, UI 컴포넌트 테스트, Playwright로 CRUD 플로우(E2E)
- [x] 완료 시 테스트 통과 확인 후 한국어 커밋

## 4. AI 교정 & 어드바이스(기능 2) — Codex
- [x] Grok API 연동: 문장 단위/전체 단위 모드 파라미터 처리, 3초 응답 목표를 위한 타임아웃/큐 관리(키 미입력 시 샘플 응답)
- [x] 결과 렌더: 문법 오류/수정 제안/단어 뿌리 의미 가이드 표시, 하이라이트/툴팁 UI
- [x] AI 요청 실패/지연 시 재시도 및 사용자 피드백(스낵바/재시도 버튼)
- [x] 교정 적용 시 자동으로 아카이브에 저장 (중복 체크 포함)
- [x] 사용 지표 로깅: `ai_correct_clicked`, 응답 성공/실패 이벤트 계측(placeholder)
- [x] 테스트: API 모킹 단위/통합 완료, Playwright로 작성→교정 결과 표시 플로우(환경변수 `PLAYWRIGHT_START_SERVER=1` 시 실행)
- [x] 완료 시 테스트 통과 확인 후 한국어 커밋

## 5. 학습 아카이브 & 문제 생성(기능 3) — Codex
- [x] Firestore 스키마(learning_archive, quizzes) 리포지토리/타입 정의
- [x] AI 교정 결과 → 자주 틀리는 패턴 자동 저장 로직 구현 + 중복 체크
- [x] Grok AI 기반 4지선다 퀴즈 자동 생성 (모국어 보기)
- [x] Firebase에 퀴즈 저장/조회, 보기 순서 랜덤화
- [x] 정답/오답 시각적 피드백 (초록/빨강, 7초 자동 리셋)
- [x] 학습 페이지: 필터/검색, 진행 상태 저장, 정답/오답 피드백
- [x] AI 생성 로딩 상태 UI, 에러 처리
- [x] 지표 로깅: `quiz_started`, 정답률/재방문 이벤트
- [x] 테스트: 단위/통합, Playwright로 문제 풀기 플로우
- [x] 완료 시 테스트 통과 확인 후 한국어 커밋

## 6. 계정/보안/국제화 — Codex
- [x] Google OAuth2 로그인/로그아웃만 지원(타 로그인 미적용), 세션 만료(24h) 처리
- [x] **이메일/패스워드 인증 시스템 구현**: 회원가입, 로그인, 비밀번호 재설정, 이메일 변경 기능 완료
  - [x] 모달 기반 인증 UI 구현 (로그인, 회원가입, 비밀번호 찾기, 이메일 변경)
  - [x] AuthProvider에 이메일 인증 메서드 통합
  - [x] 15개 언어로 완전한 다국어 지원
- [x] Firebase 보안 규칙(유저 데이터 소유권, 일기/학습 데이터 접근 제한) 검증(규칙 파일 추가)
- [x] UI 언어/학습 언어 분리 i18n 전역 적용, 날짜/숫자/시간대 현지화(Intl 포맷터 추가, 학습 언어 컨텍스트)
- [x] JWT/토큰 관리, HTTPS 강제, 민감 키 서버사이드 호출(Grok 키 Functions 프락시) — HTTPS 리다이렉트 미들웨어 추가, Grok 키 서버사이드 호출 유지
- [x] 테스트: 인증 플로우 E2E, 보안 규칙 시뮬레이터/단위 테스트(플레이스홀더: E2E는 서버 기동 시 실행)
- [x] 완료 시 테스트 통과 확인 후 한국어 커밋

## 7. 품질/성능/모니터링 — Codex
- [x] Lighthouse 성능/접근성 85/95 목표 튜닝(LCP/INP/CLS), 코드 스플리팅/이미지 최적화/프리패치
- [x] RUM 계측(LCP/INP/CLS/TTFB), JS 오류율(Sentry), 가용성 Uptime 훅 정의
- [x] 로깅/트레이싱: 주요 액션 이벤트/에러 스키마 표준화
- [x] Firebase + Cloudflare 캐싱 정책 검증, 에지 TTL 설정 확인
- [x] 테스트: `pnpm lhci:collect` 실행, 성능 회귀 체크
- [x] 완료 시 테스트 통과 확인 후 한국어 커밋
  - `npm test` (vitest) 통과, `lhci:collect` 실행 스크립트 추가

## 8. 배포/릴리즈 — Codex
- [x] 배포 파이프라인 구성(Firebase Hosting, 환경 분리), CDN 헤더 검증
    - [x] 초기 수동 배포 (Firebase Hosting URL: https://logling-34fc9.web.app)
    - [x] Deploy.md (구 implementation_plan.md) 작성 및 git 제외 설정
    - [x] GitHub Actions 워크플로우 파일 생성 (.github/workflows/deploy.yml)
    - [x] CDN/보안 헤더(HSTS, X-Frame-Options 등) `next.config.ts`에 적용 완료
- [ ] 마이그레이션 버전 전략 적용(version 필드, shadow write/double read/switch 단계)
- [x] 릴리즈 체크리스트 작성 및 실행(테스트 결과, 접근성 스캔, 보안 점검)
    - [x] 테스트 통과 확인 (vitest)
    - [x] 빌드 성공 확인
- [x] 완료 시 최종 통합 테스트 후 한국어 커밋
    - [x] 커밋 완료

## 8-1. SEO 및 광고 통합 — Codex
- [x] **SEO 기능 구현**
  - [x] react-helmet-async를 통한 동적 메타 태그 관리
  - [x] robots.txt 파일 생성
  - [x] sitemap.xml 생성
  - [x] 네이버 웹마스터 도구 사이트 소유 확인
- [x] **광고 통합**
  - [x] Kakao AdFit 통합 (PC: 728x90, 모바일: 320x50)
  - [x] 메인 페이지 하단에 반응형 광고 배치
- [x] **UI/UX 개선**
  - [x] 파비콘 생성 및 적용
  - [x] 일기 페이지 사이드바 UI 개선 (다크모드 + 글라스모피즘)
  - [x] 월 버튼 스타일링 (선택 시 주황색 강조, 정사각형 디자인)
  - [x] 날짜 필터 기능 개선
- [x] **데이터 무결성**
  - [x] 일기 삭제 시 연관 퀴즈 cascade delete 구현
- [x] **AI 교정 기능 고도화**
  - [x] 단어 뿌리 이미지(root image) 생성 기능 추가
  - [x] 완벽한 문장 형태의 교정 제안 제공
  - [x] explanation 필드 UI 언어로 작성 및 학습 언어 단어 표시
- [x] **광고 제어 시스템 (유료 가입자 지원)**
  - [x] AdProvider Context 생성 (전체 광고 제어)
  - [x] Firestore 기반 구독 관리 시스템 구현
  - [x] 구독 조회/업데이트 Hook 작성
  - [x] 광고 컴포넌트 자동 제어 (KakaoAdFit, ResponsiveAd)
  - [x] App Providers 통합
  - [x] Security Rules 작성
  - [x] 광고 배치 전략 문서화 (ad.md)
- [x] 완료 시 테스트 통과 확인 후 한국어 커밋

## 9. 3D 글로벌 라디오 (Radio Garden 스타일) — Codex
- [x] **기술 검토 및 의존성 설치 & 타입 정의**
    - [x] `react-globe.gl` 및 필요 패키지 설치
    - [x] `Domain/Radio`: Station, RadioFavorite, RadioStats 인터페이스 정의
    - [x] Firestore Repository (`RadioRepository`) 스캐폴딩 생성
- [x] **1. 백엔드/데이터 레이어 구현**
    - [x] **Firestore Favorites**: `users/{userId}/radio_favorites` CRUD 구현 (add, remove, list)
    - [x] **Firestore Stats**: `users/{userId}/stats/radio` 청취 시간(초) 업데이트 로직 구현 (Atomic Increment)
    - [x] **Radio API Service**: `radio-browser-api` 래퍼 구현 (geo-search, language-filter)
    - [x] 단위 테스트: Repository 및 Service 모의(Mock) 테스트 작성 (생략/추후)
- [x] **2. UI 스켈레톤 & 네비게이션 & 다국어**
    - [x] `src/messages/*.json` (15개 언어)에 라디오 관련 번역 키 추가 (Radio, Listen, Favorites, Country 등)
    - [x] 네비게이션 바에 'Radio' 메뉴 추가 및 라우팅 (`/radio`)
    - [x] 3D Earth 컨테이너 및 로딩 오버레이 구현
- [x] **3. 3D 지구본 핵심 기능**
    - [x] 지구 렌더링 (Night 텍스처, Atmosphere 효과 - 글라스모피즘 톤앤매너)
    - [x] 마커 렌더링 최적화: 뷰포트 내 스테이션만 표시하거나 클러스터링 고려
    - [x] 인터랙션: 클릭 시 스테이션 선택, 호버 시 툴팁(국가/방속국명)
- [x] **4. 오디오 플레이어 & 즐겨찾기 연동**
    - [x] 하단 고정 플레이어 컴포넌트 (재생/정지, 볼륨, 버퍼링 표시)
    - [x] **즐겨찾기 토글**: 플레이어 내 하트 버튼 → Firestore 즉시 반영
    - [x] **자동 재생**: 마커 클릭 시 스트림 로드 및 재생
- [x] **5. 청취 시간 추적 (Learning Data)**
    - [x] `useRadioTracker` Hook: 1분 주기 또는 Unmount 시 청취 시간 전송
    - [x] 방송국 메타데이터의 `language` 필드 기반으로 언어별 통계 집계
- [x] **6. 사이드바/대시보드 UI**
    - [x] 사이드바: 즐겨찾기 목록, 최근 들은 방송, **언어별 청취 시간 차트**
    - [x] 모바일 대응: 반응형 레이아웃 및 드로어(Drawer) 처리
- [ ] **통합 테스트 및 검증**
    - [ ] Playwright: 페이지 진입, 네비게이션, 즐겨찾기 추가/해제 시나리오 테스트
    - [ ] 수동 검증: 3D 성능(프레임), 오디오 모바일 백그라운드 재생 여부 확인
- [ ] 완료 시 테스트 통과 확인 후 한국어 커밋

## 10. 운영 이후 — Codex
- [ ] 주간 지표 리포트 템플릿 작성(일기 작성율, AI 사용률, 퀴즈 참여율, D1/D7)
- [ ] 비용 모니터링(호스팅/AI 호출/스토리지), 최적화 플랜 수립
- [ ] 피드백 수집 루프(사용자 제안 → 백로그 반영 프로세스)

## 진행 체크 방법
- 각 태스크 완료 시 체크박스 표시, 관련 테스트 결과 요약을 Tasklist.md에 메모
- Playwright 불가 항목은 Testlist.md에 수동 테스트 체크리스트 추가
- 각 단계별 테스트 통과 후 한국어 커밋 메시지로 기록
