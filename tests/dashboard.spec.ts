import { test, expect } from '../fixtures/login.fixture';
test('login test', async ({ loginPage, page}) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});