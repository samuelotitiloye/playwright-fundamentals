import { test as base, expect } from '@playwright/test';
/**
* Checks for console logs on page load
*/
export const test = base.extend<{ noConsoleErrors: void }>({
  noConsoleErrors: async ({ page }, use: () => Promise<void>) => {
    const consoleErrors: string[] = [];
    // Set up a listener for the 'console' event.
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Skip browser-level network resource errors — these are not JS errors
        if (!text.startsWith('Failed to load resource:')) {
          consoleErrors.push('\n' + text);
        }
      }
    });
    // Use the fixture in the test. The test code will run here.
    await use();
    // After the test, assert that no console errors were logged.
    // This part is the "teardown" of the fixture.
    expect(consoleErrors, { message: `Unexpected console errors: ${consoleErrors.join()}` }).toHaveLength(0);
  },
});