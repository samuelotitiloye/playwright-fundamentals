import { test, expect } from '@playwright/test';

test.describe('Sauce Demo - Login and Shopping', () => {
  test('should login and add item to cart', async ({ page }) => {
    // Navigate to the application
    await page.goto('https://www.saucedemo.com');

    // Verify we're on the login page
    await expect(page).toHaveTitle('Swag Labs');

    // Fill in the username field
    await page.locator('[data-test="username"]').fill('standard_user');

    // Fill in the password field
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // Click the login button
    await page.locator('[data-test="login-button"]').click();

    // Wait for navigation to inventory page and verify we're logged in
    await page.waitForURL('**/inventory.html');
    await expect(page).toHaveTitle('Swag Labs');

    // Verify products are displayed
    const productCount = await page.locator('[data-test*="inventory-item"]').count();
    expect(productCount).toBeGreaterThan(0);

    // Click the first "Add to cart" button
    await page.locator('[data-test*="add-to-cart"]').first().click();

    // Verify the button text changes to "Remove from cart"
    const firstButton = page.locator('[data-test*="add-to-cart"]').first();
    await expect(firstButton).toContainText('Remove');

    // Verify cart badge shows 1 item
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toContainText('1');
  });

  test('should navigate to cart and verify item', async ({ page }) => {
    // Navigate to the application
    await page.goto('https://www.saucedemo.com');

    // Login
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Wait for inventory page
    await page.waitForURL('**/inventory.html');

    // Add first item to cart
    await page.locator('[data-test*="add-to-cart"]').first().click();

    // Click on shopping cart icon to navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();

    // Wait for cart page
    await page.waitForURL('**/cart.html');

    // Verify item is in cart
    const cartItems = await page.locator('[data-test*="cart-item"]').count();
    expect(cartItems).toBe(1);

    // Verify the cart has the correct item
    const cartItemName = page.locator('[data-test="inventory-item-name"]');
    await expect(cartItemName).toBeVisible();
  });
});
