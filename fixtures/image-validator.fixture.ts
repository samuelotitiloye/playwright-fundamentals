import { test as base, expect } from '@playwright/test';
/**
* Provides a function to check for broken images by examining whether the
* browser successfully rendered each image (naturalWidth > 0).
*/
type ImageFixture = { imageValidator: () => Promise<void>}
export const test = base.extend<ImageFixture>({
    imageValidator: async ({ page }, use) => {
        const validateImages = async () => {
            const allImages = await page.locator('img').all();
            const brokenImages = [];
            for (const img of allImages) {
                const src = await img.getAttribute('src');
                if(!src) {
                    brokenImages.push({
                        src: 'Missing src attribute',
                        status: 'N/A'
                    });
                    continue;
                }
                const absoluteSrc = new URL(src, page.url()).href;

                // Check via the browser's own render result — avoids triggering
                // hotlink protection that blocks out-of-band fetch requests in CI.
                const { complete, naturalWidth } = await img.evaluate((el: HTMLImageElement) => ({
                    complete: el.complete,
                    naturalWidth: el.naturalWidth,
                }));

                if (complete && naturalWidth === 0) {
                    brokenImages.push({ src: absoluteSrc, status: 'Failed to render' });
                }
            }
            const errorMessage = `Found ${brokenImages.length} broken images:\n${JSON.stringify(brokenImages, null, 2)}`;
            expect(brokenImages, errorMessage).toEqual([]);
        };
        await use(validateImages);
    },
});
