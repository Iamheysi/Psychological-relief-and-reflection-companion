import { test, expect } from "@playwright/test";

test("landing page renders hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("safety page is reachable without auth", async ({ page }) => {
  await page.goto("/safety");
  await expect(page.getByRole("heading", { name: /crisis/i })).toBeVisible();
});
