import { test, expect } from '@playwright/test';

/**
 * End-to-end test for the Sauce Demo application.
 *
 * Flow covered:
 *   1. Navigate to https://www.saucedemo.com
 *   2. Log in with standard_user / secret_sauce
 *   3. Verify the user lands on the products / inventory page
 *   4. Add the first available product (Sauce Labs Backpack) to the cart
 *   5. Verify the shopping cart badge updates to show 1 item
 *
 * Selector strategy:
 *   Sauce Demo ships explicit `data-test` attributes on every interactive
 *   element, so we prefer those over CSS or text-based locators for stability.
 *   Note: `getByTestId` is intentionally avoided here because Playwright's
 *   default test-id attribute is `data-testid`; saucedemo uses `data-test`,
 *   and we want this spec to be runnable without touching the global config.
 */
test.describe('Sauce Demo - login and add-to-cart flow', () => {
  const BASE_URL = 'https://www.saucedemo.com';
  const USERNAME = 'standard_user';
  const PASSWORD = 'secret_sauce';

  test.beforeEach(async ({ page }) => {
    // Always start from a clean login screen.
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle('Swag Labs');
  });

  test('logs in as standard_user, adds the first product, and the cart badge shows 1', async ({
    page,
  }) => {
    // --- Step 1 & 2: Log in ----------------------------------------------
    const usernameInput = page.locator('[data-test="username"]');
    const passwordInput = page.locator('[data-test="password"]');
    const loginButton = page.locator('[data-test="login-button"]');

    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();

    await usernameInput.fill(USERNAME);
    await passwordInput.fill(PASSWORD);
    await loginButton.click();

    // --- Step 3: Verify products page ------------------------------------
    await expect(page).toHaveURL(/.*\/inventory\.html$/);
    await expect(page).toHaveTitle('Swag Labs');

    const pageTitle = page.locator('[data-test="title"]');
    await expect(pageTitle).toBeVisible();
    await expect(pageTitle).toHaveText('Products');

    // The inventory list should contain products.
    const inventoryItems = page.locator('.inventory_item');
    await expect(inventoryItems.first()).toBeVisible();
    expect(await inventoryItems.count()).toBeGreaterThan(0);

    // Cart badge should not exist yet (cart is empty).
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toHaveCount(0);

    // --- Step 4: Add the first product to the cart -----------------------
    // The first product in the default sort order is "Sauce Labs Backpack",
    // which exposes the data-test attribute below.
    const firstAddToCartButton = page.locator(
      '[data-test="add-to-cart-sauce-labs-backpack"]',
    );
    await expect(firstAddToCartButton).toBeVisible();
    await expect(firstAddToCartButton).toHaveText('Add to cart');

    await firstAddToCartButton.click();

    // After clicking, the same button morphs into a "Remove" button with a
    // different data-test attribute.
    const removeButton = page.locator(
      '[data-test="remove-sauce-labs-backpack"]',
    );
    await expect(removeButton).toBeVisible();
    await expect(removeButton).toHaveText('Remove');

    // --- Step 5: Verify the cart badge shows 1 ---------------------------
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('1');

    // Sanity check: the shopping cart link should also be present.
    await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
  });
});
