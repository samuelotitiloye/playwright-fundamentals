import { test, expect } from '@playwright/test';

test('Mashable blog functionality test', async ({ page }) => {
  await page.goto('https://mashable.com');
  await expect(page).toHaveTitle(/Mashable/);

  // Verify key sections are present on the homepage
  await expect(page.getByRole('heading', { name: 'Trending', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Tech', level: 2 })).toBeVisible();

  // Open search and submit a query
  await page.getByRole('button', { name: 'Search' }).click();
  const searchInput = page.getByPlaceholder('Search');
  await expect(searchInput).toBeVisible();
  await searchInput.fill('tech');
  await searchInput.press('Enter');

  // Verify results page loaded with some content
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('article, h1, h2, h3').first()).toBeVisible({ timeout: 15000 });
});
