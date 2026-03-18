import { describe, it, expect } from "vitest";
import { calculateNextStreak, computeDisplayStreak } from "./streak";
import { Streak } from "./user";

describe("calculateNextStreak", () => {
  it("기존 스트릭이 없으면 현재 1, 최장 1로 초기화된다", () => {
    const next = calculateNextStreak(undefined, "2024-03-18");
    expect(next).toEqual({
      current: 1,
      longest: 1,
      lastEntryDate: "2024-03-18",
    });
  });

  it("어제 날짜에서 오늘 날짜로 일기를 작성하면 current가 1 증가한다", () => {
    const currentStreak: Streak = {
      current: 5,
      longest: 5,
      lastEntryDate: "2024-03-17",
    };
    const next = calculateNextStreak(currentStreak, "2024-03-18");
    expect(next).toEqual({
      current: 6,
      longest: 6,
      lastEntryDate: "2024-03-18",
    });
  });

  it("하루 건너뛰고 작성하면 current가 1로 초기화된다", () => {
    const currentStreak: Streak = {
      current: 5,
      longest: 5,
      lastEntryDate: "2024-03-16",
    };
    const next = calculateNextStreak(currentStreak, "2024-03-18");
    expect(next).toEqual({
      current: 1,
      longest: 5, // longest는 유지
      lastEntryDate: "2024-03-18",
    });
  });

  it("같은 날짜에 여러 번 작성하면 스트릭은 변경되지 않는다", () => {
    const currentStreak: Streak = {
      current: 5,
      longest: 10,
      lastEntryDate: "2024-03-18",
    };
    const next = calculateNextStreak(currentStreak, "2024-03-18");
    expect(next).toEqual({
      current: 5,
      longest: 10,
      lastEntryDate: "2024-03-18",
    });
  });

  it("만약 과거 날짜(diff < 0)가 입력된 경우, 기존 스트릭 값을 그대로 유지한다", () => {
    const currentStreak: Streak = {
      current: 5,
      longest: 10,
      lastEntryDate: "2024-03-18",
    };
    const next = calculateNextStreak(currentStreak, "2024-03-15");
    expect(next).toEqual({
      current: 5,
      longest: 10,
      lastEntryDate: "2024-03-18",
    });
  });
});

describe("computeDisplayStreak", () => {
  it("스트릭 데이터가 없으면 0을 반환한다", () => {
    expect(computeDisplayStreak(undefined, "2024-03-18")).toBe(0);
  });

  it("오늘 작성한 스트릭이면 current 값을 그대로 반환한다", () => {
    const streak: Streak = { current: 3, longest: 3, lastEntryDate: "2024-03-18" };
    expect(computeDisplayStreak(streak, "2024-03-18")).toBe(3);
  });

  it("어제 작성한 스트릭이고 아직 오늘 글을 안 썼어도 current 값은 유지되어 보여준다", () => {
    const streak: Streak = { current: 3, longest: 3, lastEntryDate: "2024-03-17" };
    expect(computeDisplayStreak(streak, "2024-03-18")).toBe(3);
  });

  it("이틀 이상 접속 안 했으면 0으로 끊어져 보인다", () => {
    const streak: Streak = { current: 3, longest: 3, lastEntryDate: "2024-03-16" };
    expect(computeDisplayStreak(streak, "2024-03-18")).toBe(0);
  });
});
