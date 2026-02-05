# Loglingo Blog Content Guide

이 문서는 Loglingo 프로젝트에 새로운 블로그 포스트를 추가할 때 따라야 할 표준 절차와 규칙을 정의합니다.
실수를 방지하고 데이터 일관성을 유지하기 위해 반드시 이 지침을 준수해야 합니다.

## 1. 기본 원칙

- **완전한 다국어 지원**: 모든 포스트는 **20개 언어**로 번역되어야 합니다. (영어/한국어 외 다른 언어에 영어 콘텐츠를 복사해 넣는 행위 금지)
- **콘텐츠 품질 (AdSense 기준)**: 
  - 각 언어별 콘텐츠는 **최소 1600자 이상**의 풍부한 내용을 담아야 합니다.
  - 독창적이고 가치 있는 정보를 제공하여 애드센스 승인 조건을 충족해야 합니다.
- **포맷**: 콘텐츠는 HTML 태그(`p`, `h2`, `ul`, `li` 등)를 포함한 문자열이어야 합니다.
- **이미지 생성**: 해당 블로그 글의 이미지는 반드시 **나노바나나(Nano Banana)**를 사용하여 생성하고 삽입해야 합니다.

## 2. 지원 언어 (20개국)

모든 데이터(제목, 요약, 본문)는 아래 모든 언어 코드를 포함해야 합니다.

| 코드 | 언어 | 코드 | 언어 |
|---|---|---|---|
| `en` | 영어 | `id` | 인도네시아어 |
| `ko` | 한국어 | `pt` | 포르투갈어 |
| `ja` | 일본어 | `tr` | 터키어 |
| `zh` | 중국어 (간체) | `ar` | 아랍어 |
| `es` | 스페인어 | `hi` | 힌디어 |
| `fr` | 프랑스어 | `ru` | 러시아어 |
| `de` | 독일어 | `bn` | 벵골어 |
| `th` | 태국어 | `ur` | 우르두어 |
| `vi` | 베트남어 | `ne` | 네팔어 |
| `si` | 싱할라어 | `sw` | 스와힐리어 |

## 3. 데이터 구조 (`scripts/blog-data-partX.ts`)

블로그 데이터는 `scripts/` 폴더 내의 `blog-data-part*.ts` 파일에 정의됩니다.
새로운 포스트 추가 시 다음 구조를 정확히 따라야 합니다.

### 3.1 본문 상수 정의
각 언어별로 별도의 상수를 만들어 HTML 콘텐츠를 담습니다.

```typescript
const POST_MY_TOPIC_CONTENT_EN = `
  <article>
    <p>English content here... (~1600 chars)</p>
    <h2>Subtitle</h2>
    <p>More details...</p>
  </article>
`;

const POST_MY_TOPIC_CONTENT_KO = `
  <article>
    <p>한국어 콘텐츠 여기... (~1600자)</p>
    <h2>소제목</h2>
    <p>상세 내용...</p>
  </article>
`;
// ... 나머지 20개 언어에 대해서도 정의 필수
```

### 3.2 포스트 객체 정의
`BLOG_POSTS_PART_X` 배열에 객체를 추가합니다.

```typescript
{
  id: "my-topic-slug", // URL에 사용될 고유 ID (kebab-case)
  title: {
    en: "English Title",
    ko: "한국어 제목",
    // ... 20개 언어 필수
  },
  excerpt: {
    en: "Short summary for SEO and preview cards.",
    ko: "SEO 및 미리보기 카드를 위한 짧은 요약.",
    // ... 20개 언어 필수
  },
  content: {
    en: POST_MY_TOPIC_CONTENT_EN,
    ko: POST_MY_TOPIC_CONTENT_KO,
    // ... 20개 언어 변수 연결 필수
  },
  coverImage: "https://images.unsplash.com/...", // 고화질 이미지 URL
  author: "Dr. Lingua", // 또는 "Sarah Kim" 등 페르소나
  tags: ["Tag1", "Tag2"],
  published: true,
  createdAt: new Date("2024-03-XX"),
  updatedAt: new Date("2024-03-XX")
}
```

## 4. 작업 워크플로우

1.  **기획 및 작성 (Draft)**: 주제를 선정하고 영어 또는 한국어로 원고를 작성합니다. (약 1600자, HTML 포맷)
2.  **번역 (Translation)**: AI 또는 번역 도구를 사용하여 나머지 18개 언어로 **완벽하게 번역**합니다.
    - *주의: 단순히 영어를 복사해 넣으면 안 됩니다. 각 언어의 문맥에 맞는 번역이 필요합니다.*
3.  **코드 구현**: `scripts/blog-data-partX.ts` 파일에 상수와 객체를 추가합니다.
4.  **이미지 생성**: **나노바나나**를 사용하여 커버 이미지를 생성하고 `public/assets/blog/`에 저장합니다.
5.  **DB 시딩 (Seeding)**: 다음 명령어를 실행하여 Firestore에 데이터를 반영합니다.
    ```bash
    npx tsx scripts/seed-blog.ts
    ```
6.  **검증 (Verification)**:
    - 터미널 출력에서 에러가 없는지 확인합니다.
    - 실제 웹사이트(로컬 또는 배포 환경) 접속
    - 언어 설정을 변경해가며 해당 포스트가 **각 언어별로 올바르게 표시되는지** 확인합니다.

## 5. 체크리스트

- [ ] `id`가 중복되지 않는가?
- [ ] `title`, `excerpt`, `content`에 20개 언어 키가 빠짐없이 모두 있는가?
- [ ] 각 언어별 `content` 변수가 올바르게 매핑되었는가? (Copy & Paste 실수 주의)
- [ ] 본문 길이가 충분한가? (AdSense 기준 충족)
- [ ] 커버 이미지가 나노바나나로 생성되었는가?
- [ ] HTML 태그가 닫히지 않은 곳은 없는가?
- [ ] 시딩 스크립트 실행 후 "Successfully seeded" 메시지를 확인했는가?

## 6. 작성된 블로그 제목 목록 (중복 방지용)

### Part 1
- why-keep-diary-for-language-learning
- power-of-shadowing
- spaced-repetition-explained

### Part 2
- context-learning

### Part 3
- pronunciation-mistakes
- listening-comprehension-guide
- language-learning-myths

### Part 4
- how-to-use-chatgpt
- language-audit
- immersion-at-home

### Part 5
- how-to-read-books
- travel-hacks-language
- motivation-slump

### Part 6
- consistency-vs-intensity
- learning-through-netflix-spotify
- setting-smart-goals
- how-to-find-language-partner

### Part 7
- track-your-level-improve-faster
- language-levels-vs-duolingo
- the-psychology-of-quitting
- how-to-actually-learn-with-movies

### Part 8 (최신)
- fluency-myth-3-months
- introverts-vs-extroverts
- culture-grammar-useless
- street-smart-slang
