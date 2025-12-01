import { test, expect } from "@playwright/test";

test.describe("AI correction flow", () => {
  test.skip(!process.env.PLAYWRIGHT_START_SERVER, "Web server disabled in sandbox");

  test("user requests AI correction and sees feedback", async ({ page }) => {
    await page.goto("/diary/new");

    await page.fill('input[type="date"]', "2025-01-01");
    await page.fill("textarea", "I has a apple.");
    await page.getByRole("button", { name: /ai check/i }).click();

    await expect(page.getByText(/AI Suggestions/i)).toBeVisible({ timeout: 10_000 });
  });
});
