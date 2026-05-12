// import { test, expect } from '@playwright/test';
// test('manage browser-level settings', async ({ browser}) => {
//     //create a new context with custom settings
//     const context = await browser.newContext({
//         userAgent: 'My Custom User Agent',
//         locale: 'fr-FR',
//     });
//     //create a page inside this context
//     const page = await context.newPage();
//     await page.goto('https://www.google.com');
    
//     //test actions/assertions
//     await context.close();
// });


// import { test } from '@playwright/test';
// test('check browser', async ({ browserName}) => {
//     if (browserName === 'chromium') {
//         console.log(`Running on ${browserName}`);
        
//     }
// });

// import { test, expect } from '@playwright/test';
// test('visit page', async ({ page }) => {
//     await page.goto('https://www.google.com/');
//     await expect(page).toHaveTitle(/Google/);

//     await page.pause();
// });




// import { test, expect } from '@playwright/test';
// test('should share cookies between pages in the same context', async ({ context}) => {
//     //create 2 pages with the same context
//     const page1 = await context.newPage();
//     const page2 = await context.newPage();

//     //set a cookie page
//     await page1.goto('https://playwright.dev/');
//     await page1.context().addCookies([{
//         name: 'test_cookie',
//         value: 'test_value',
//         domain: '.example.com',
//         path: '/'
//     }]);
//     //navigate to the domain on page2
//     await page2.goto('https://playwright.dev/');
//     //verify page2 has access to the same cookies
//     const cookies = await page2.context().cookies();
//     const testCookie = cookies.find(cookie => cookie.name === 'test_cookie');
//     expect(testCookie).toBeDefined();
//     expect(testCookie?.value).toBe('test_value');
//     //clean up
//     await page1.close();
//     await page2.close();
// });

// import { test, expect } from '@playwright/test';
// test('API request', async ({ request }) => {
//     const response = await request.get('https://jsonplaceholder.typicode.com/todos/1');
//     expect(response.ok()).toBeTruthy();
// });



// import { test } from '../fixtures/auth';
// import { expect } from '@playwright/test';
// test('should display shopping cart after login', async ({ loggedInPage }) => {
//     const cartLink = loggedInPage.locator('.shopping_cart_link');
//     await expect(cartLink).toBeVisible();
// });

// import { test, expect } from '@playwright/test';
// test.describe.parallel('parallel test suite', () => {

//     test('Test 1- Google.com has correct title', async ({ page }) => {
//         await page.goto('https://google.com');
//         await expect(page).toHaveTitle('Google');
//     });
//     test('Test 2 -  Playwright.dev has correct title', async ({ page }) => {
//         await page.goto('https://playwright.dev');
//         await expect(page).toHaveTitle(/Playwright/);
//     });
//     test('Test 3 - Github has correct title', async ({ page }) => {
//         await page.goto('https://github.com');
//         await expect(page).toHaveTitle(/GitHub/);
//     });
// });

import { test, expect } from '@playwright/test';
test.describe.configure({mode: 'parallel'});

test('Test 1 - Google.com has correct title', async ({ page }) => {
    await page.goto('https://google.com');
    await expect(page).toHaveTitle('Google');
});
test('Test 2 - Playwright.dev has correct title', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);

    page.pause();
});
test('Test 3 - GitHub has correct title', async ({ page }) => {
    await page.goto('https://github.com');
    await expect(page).toHaveTitle(/GitHub/);

    page.pause();
});

