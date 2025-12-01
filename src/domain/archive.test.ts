import { describe, expect, it } from "vitest";
import { buildQuizFromArchive, LearningArchive } from "./archive";

describe("buildQuizFromArchive", () => {
  it("creates quiz with correct answer at index 0", () => {
    const entry: LearningArchive = {
      id: "a1",
      userId: "u1",
      type: "grammar",
      title: "Past tense -ed",
      examples: ["I walked", "You played"],
      rootMeaning: "Simple past regular verbs",
      createdAt: new Date(),
    };
    const quiz = buildQuizFromArchive(entry);
    expect(quiz.answer).toBe(0);
    expect(quiz.options[0]).toBe("Simple past regular verbs");
  });
});
