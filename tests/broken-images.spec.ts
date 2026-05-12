import { expect } from '@playwright/test';
import { test } from "../fixtures/image-validator.fixture";
test.describe('Broken Images Validation', () => {
    test('should not find any broken images on the page', async ({ page, imageValidator }) => {
        await page.goto('https://practicesoftwaretesting.com/#/');

        await expect(page.locator('h5').first()).toBeVisible();

        await imageValidator();
    })
})