import { test, expect } from "@playwright/test";

// Note: This test runs against the dev server with demo Firebase env vars.
// It exercises basic navigation; replace mock Firebase config with real or emulator
// before enabling data mutations.
test.describe("Diary CRUD flow (smoke)", () => {
  test.skip(!process.env.PLAYWRIGHT_START_SERVER, "Web server disabled in sandbox");

  test("list page renders and new entry link exists", async ({ page }) => {
    await page.goto("/diary");
    await expect(page.getByRole("heading", { name: /my diary/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /new entry/i })).toBeVisible();
  });
});
