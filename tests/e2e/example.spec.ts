import { test, expect } from "@playwright/test";

test.describe("basic example test", () => {
  test("has title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Kommunikationsplattform");
  });

  test("shows Kommunikationsplattform text", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Kommunikationsplattform")).toBeVisible();
  });
});
