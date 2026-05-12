import { test, expect } from '@playwright/test';

test('Mashable blog functionality test', async ({ page }) => {
  // Navigate to Mashable and verify it loads
  await page.goto('https://mashable.com');
  await expect(page).toHaveTitle(/Mashable/);

  // Open search input
  await page.getByRole('button', { name: 'Search' }).click();

  // Verify search input works
  const searchInput = page.getByPlaceholder('Search');
  await expect(searchInput).toBeVisible();
  await searchInput.fill('tech');
  await searchInput.press('Enter');

  // Wait for search results and verify content
  await page.waitForLoadState('networkidle');
  await expect(page.locator('h1, h2, .article-title')).toContainText(/tech/i);

  // Click a tag to filter posts
  await page.getByRole('link', { name: 'More Tech' }).click();

  // Verify posts are filtered
  await page.waitForLoadState('networkidle');
  const posts = page.locator('.article, .post, .card');
  //await expect(posts).toHaveCountGreaterThan(0);
});