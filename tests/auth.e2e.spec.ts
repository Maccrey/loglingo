import { test, expect } from "@playwright/test";

test.describe("Auth flow", () => {
  test.skip(!process.env.PLAYWRIGHT_START_SERVER, "Web server disabled in sandbox");

  test("login button exists on navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
  });
});
