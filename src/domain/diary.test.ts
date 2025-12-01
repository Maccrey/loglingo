import { describe, expect, it } from "vitest";
import { validateDiaryInput } from "./diary";

describe("validateDiaryInput", () => {
  it("accepts valid date and non-empty content", () => {
    const result = validateDiaryInput({
      date: "2025-01-01",
      content: "Hello diary",
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects invalid date format", () => {
    const result = validateDiaryInput({
      date: "20250101",
      content: "Hello",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("invalid-date");
  });

  it("rejects empty content", () => {
    const result = validateDiaryInput({
      date: "2025-01-01",
      content: "   ",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("empty-content");
  });

  it("rejects too long content", () => {
    const long = "a".repeat(5001);
    const result = validateDiaryInput({
      date: "2025-01-01",
      content: long,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("too-long");
  });
});
