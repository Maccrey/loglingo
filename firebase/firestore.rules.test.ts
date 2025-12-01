import { describe, expect, it } from "vitest";

// Simplified static checks on rules text to ensure ownership guards exist.
import fs from "fs";

const rules = fs.readFileSync("firebase/firestore.rules", "utf8");

describe("firestore rules", () => {
  it("requires auth", () => {
    expect(rules).toContain("request.auth");
  });

  it("protects diaries collection by userId", () => {
    expect(rules).toContain("match /diaries/");
    expect(rules).toContain("isOwner(request.resource.data.userId)");
  });
});
