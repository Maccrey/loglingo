# Speaking Feature Test Checklist

## Prerequisites
- [ ] User is logged in.
- [ ] Language is set to 'en', 'ko', etc. (supported logic).
- [ ] Microphone permission is granted in browser.
- [ ] Grok API Key is configured in `.env` (GROK_API_KEY).

## Manual Verification Steps
1. **Navigate to Speaking Page**
   - [ ] Go to `/speaking` (or via menu).
   - [ ] Verify "Ready to Speak?" card is visible.

2. **Start Recording**
   - [ ] Click "Start Recording".
   - [ ] Verify browser asks for microphone permission (if first time).
   - [ ] Verify UI changes to "Recording..." state (Stop button red, waveform visualizer active).
   - [ ] Speak into the microphone ("Hello testing").
   - [ ] Verify transcript appears in real-time.

3. **Stop & Submit**
   - [ ] Click Stop (Square button).
   - [ ] Verify "Analyze" button appears.
   - [ ] Click "Analyze".
   - [ ] Verify loading state ("Analyzing...").

4. **Review Results & Archive**
   - [ ] Verify Feedback card appears.
   - [ ] Check "Improved Expression" section.
   - [ ] Check "Root Meaning" guide.
   - [ ] **[New]** Navigate to "Archive" (or check Firestore).
   - [ ] **[New]** Verify items from "Root Meaning" are saved in Archive with `sourceType: 'speaking'`.
   - [ ] Click "Try Again" and verify session resets.

## Edge Cases
- [ ] **No Speech**: Click Start then Stop immediately. Verify warning/toast "No speech detected".
- [ ] **Network Error**: Disconnect network/Env var missing. Click Analyze. Verify error message "Something went wrong".
- [ ] **Unsupported Browser**: Open in non-Chrome/Safari (if unsupported). Verify "Browser not supported" message.

## Automated Tests (Future)
- [ ] Run `npx playwright test tests/speaking.spec.ts` (Requires environment setup).
