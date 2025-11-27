## 제품명

**Loglingo – 외국어 학습을 위한 다국어 AI 일기장
Log(기록하다) + Lingo(속어·언어), Duolingo와 다른 느낌으로 부드러움**

## 슬로건

쓰는 만큼 배운다. 일기 하나로 언어가 성장한다.

## 소개

PolyDiary는 외국어 학습자를 위한 **AI 기반 Web 일기 학습 플랫폼**입니다.

일기 작성 → AI 교정 → 학습 아카이브 → 문제 풀이로 이어지는 자연스러운 학습 사이클을 제공합니다.

## 핵심 기능

- 일기 CRUD + 이미지 첨부(최대 1장)
- AI 문장 교정 & 뿌리 의미 기반 어드바이스
- 개인화 학습 아카이브 + 문제 자동 생성

## 디자인/UX 원칙

- 기본 다크모드 + 글라스모피즘 톤(투명/블러 깊이, 대비 가이드) 일관 적용
- 모바일 퍼스트 반응형(375px~), 터치 타깃·간격·타이포 최적화
- 색상 토큰으로 학습/일기/경고 정보의 시각적 계층화
- Flutter WebView 임베드 호환: 안전 영역/뷰포트/제스처 스크롤 정상 동작 확인

---

## 개발 환경

- Node 20, Next.js 15
- TypeScript 5
- React Query
- TailwindCSS + 글라스모피즘 UI
- Firebase(Auth/Firestore/Storage)
- pnpm
- Cloudflare CDN
- Grok API
- 클린 아키텍처 기반 폴더링(도메인/애플리케이션/인프라/UI 분리)

## 상태

- 현재: 기획 완료 → 개발 준비 단계

## 역할

- PO/PM: 사용자
- Tech Lead/FE: 담당자
- BE: Firebase 구조 설계
- QA: TBD
- Design: 글라스모피즘 UI 디자이너
- DevOps: Firebase + Cloudflare

---

## 로컬 실행

```
pnpm i
pnpm dev

# 테스트
pnpm test
pnpm test:e2e
pnpm lhci:collect

```

---

## 품질 기준

- 테스트 커버리지 ≥ 70%
- Lighthouse: Performance ≥ 85, Accessibility ≥ 95
- 릴리즈 체크리스트 포함
