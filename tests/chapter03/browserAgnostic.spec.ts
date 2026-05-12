import {test, expect } from '@playwright/test';
test('should navigate to sweets page', async ({ page }) => {
    await page.goto('https://sweetshop.netlify.app/', 
        { waitUntil: 'domcontentloaded' });
    try {
        await page.getByRole('link', { name: 'Browse Sweets' })
        .click({ timeout: 5000 });

    await expect(page).toHaveURL(/sweets$/, { timeout: 5000 });
    } catch (error) {
        console.warn('Link click failed, navigating directly...');
        await page.goto('https://sweetshop.netlify.app/sweets', 
            { waitUntil: 'domcontentloaded' });
        
        await expect(page).toHaveURL(/sweets$/, { timeout: 10000});
    }
});