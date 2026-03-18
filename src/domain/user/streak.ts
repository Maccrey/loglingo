import { Streak } from "./user";

/**
 * 날짜 문자열(YYYY-MM-DD) 형식 간의 일수 차이를 계산합니다.
 * d1 - d2 반환 (d1이 더 미래면 양수)
 */
export function getDaysDifference(d1Str: string, d2Str: string): number {
  const d1 = new Date(`${d1Str}T00:00:00Z`);
  const d2 = new Date(`${d2Str}T00:00:00Z`);
  const diffMs = d1.getTime() - d2.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * 일기가 작성될 때 다음 스트릭 상태를 계산합니다. (Red-Green-Refactor 대상)
 * @param currentStreak 기존 스트릭 데이터
 * @param entryDateStr 새로 작성한 일기의 날짜 (YYYY-MM-DD)
 */
export function calculateNextStreak(
  currentStreak: Streak | undefined | null,
  entryDateStr: string
): Streak {
  if (!currentStreak) {
    return {
      current: 1,
      longest: 1,
      lastEntryDate: entryDateStr,
    };
  }

  const diff = getDaysDifference(entryDateStr, currentStreak.lastEntryDate);

  if (diff === 0) {
    // 같은 날 작성 시 변경 없음
    return currentStreak;
  }

  if (diff === 1) {
    // 연속 작성 시
    const nextCurrent = currentStreak.current + 1;
    return {
      current: nextCurrent,
      longest: Math.max(nextCurrent, currentStreak.longest),
      lastEntryDate: entryDateStr,
    };
  }

  // 이틀 이상 차이나거나 과거 날짜인 경우 초기화 
  // (과거 날짜 작성을 허용하더라도, 현재 로직에서는 최근 작성일을 기준으로 가장 최신 날짜 변경 시에만 증가시키는 방식을 기본으로 합니다. 
  // 보수적으로 스트릭은 '최근 활동일' 기준으로 리셋됨)
  if (diff > 1) {
    return {
      current: 1,
      longest: currentStreak.longest,
      lastEntryDate: entryDateStr,
    };
  }

  // 만약 과거 날짜(diff < 0)에 일기를 추가했다면 스트릭에 영향을 주지 않는 방향으로 설계할 수도 있습니다.
  // 여기서는 lastEntryDate가 최신으로 유지되도록 그대로 반환 (기본 정책).
  return currentStreak;
}

/**
 * UI 화면에 노출할 현재 스트릭 유지 값을 계산합니다. (하루 안 쓰면 0으로 보일지, 아니면 유지할지)
 * 듀오링고 등 에서는 어제까지 쓴 뒤 오늘 접속하면 여전히 'N일째(진행중)'으로 보여줍니다.
 * 이틀 이상 접속 안 했을 때만 0으로 끊어집니다.
 *
 * @param streak 사용자의 스트릭 객체
 * @param todayStr 사용자의 로컬 접속 날짜 (YYYY-MM-DD)
 */
export function computeDisplayStreak(streak: Streak | undefined | null, todayStr: string): number {
  if (!streak) return 0;
  
  const diff = getDaysDifference(todayStr, streak.lastEntryDate);
  if (diff <= 1 && diff >= 0) {
    return streak.current;
  }
  return 0; // 이틀 이상 차이나면 스트릭 끊김
}
