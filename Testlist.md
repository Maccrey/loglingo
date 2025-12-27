# 말하기 기능 테스트 체크리스트 (Speaking Feature Test Checklist)

## 사전 조건 (Prerequisites)
- [ ] 사용자가 로그인 상태여야 합니다.
- [ ] 언어 설정이 'en', 'ko' 등으로 설정되어 있어야 합니다 (지원되는 로직).
- [ ] 브라우저에서 마이크 권한이 허용되어 있어야 합니다.
- [ ] Grok API Key가 `.env` 파일에 설정되어 있어야 합니다 (GROK_API_KEY).

## 수동 검증 단계 (Manual Verification Steps)
1. **말하기 페이지로 이동**
   - [ ] `/speaking` 페이지로 이동합니다 (또는 메뉴를 통해).
   - [ ] "Ready to Speak?" 카드가 보이는지 확인합니다.

2. **녹음 시작**
   - [ ] "Start Recording" 버튼을 클릭합니다.
   - [ ] (최초 실행 시) 브라우저가 마이크 권한을 요청하는지 확인합니다.
   - [ ] UI가 "Recording..." 상태로 변경되는지 확인합니다 (정지 버튼이 빨간색, 파형 시각화 활성화).
   - [ ] 마이크에 대고 말해봅니다 (예: "Hello testing").
   - [ ] 실시간으로 텍스트(Transcript)가 표시되는지 확인합니다.

3. **정지 및 제출**
   - [ ] 정지 버튼(사각형)을 클릭합니다.
   - [ ] "Analyze" 버튼이 나타나는지 확인합니다.
   - [ ] "Analyze" 버튼을 클릭합니다.
   - [ ] 로딩 상태("Analyzing...")가 표시되는지 확인합니다.

4. **결과 확인 및 아카이브 저장**
   - [ ] 피드백(Feedback) 카드가 나타나는지 확인합니다.
   - [ ] "Improved Expression"(개선된 표현) 섹션을 확인합니다.
   - [ ] "Root Meaning"(핵심 의미) 가이드를 확인합니다.
   - [ ] **[신규]** "Archive"(아카이브) 메뉴로 이동합니다 (또는 Firestore 확인).
   - [ ] **[신규]** "Root Meaning" 항목들이 아카이브에 `sourceType: 'speaking'`으로 저장되었는지 확인합니다.
   - [ ] "Try Again" 버튼을 클릭하여 세션이 초기화되는지 확인합니다.

## 예외 상황 (Edge Cases)
- [ ] **음성 미입력**: 녹음을 시작하고 즉시 정지합니다. "No speech detected"(음성 감지 안 됨) 경고/토스트 메시지 확인.
- [ ] **네트워크 오류**: 네트워크 연결을 끊거나 환경 변수 누락 상태에서 "Analyze" 클릭. "Something went wrong" 오류 메시지 확인.
- [ ] **미지원 브라우저**: 지원되지 않는 브라우저(예: 구형 브라우저)에서 열기. "Browser not supported" 메시지 확인.

## 자동화 테스트 (향후 예정)
- [ ] `npx playwright test tests/speaking.spec.ts` 실행 (환경 설정 필요).
