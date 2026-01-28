import { test, expect } from '@playwright/test';

test.describe('Garden Overview', () => {
  test('should display the garden page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Tend/);
  });

  test('should navigate to life areas', async ({ page }) => {
    await page.goto('/life-areas');
    await expect(page.locator('h1')).toContainText('Life Areas');
  });
});
