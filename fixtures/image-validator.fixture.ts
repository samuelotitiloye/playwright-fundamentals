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

                // Use the browser's own load result — naturalWidth === 0 means
                // the image failed to render regardless of the reason (auth, CORS, etc.)
                const isLoaded = await img.evaluate(
                    (image) => (image as HTMLImageElement).naturalWidth > 0
                );
                if (!isLoaded) {
                    brokenImages.push({
                        src: absoluteSrc,
                        status: 'Failed to load (naturalWidth is 0)'
                    });
                }
            }
            const errorMessage = `Found ${brokenImages.length} broken images:\n${JSON.stringify(brokenImages, null, 2)}`;
            expect(brokenImages, errorMessage).toEqual([]);
        };
        await use(validateImages);
    },
});
