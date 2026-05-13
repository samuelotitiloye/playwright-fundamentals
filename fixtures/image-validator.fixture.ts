import { test as base, expect } from '@playwright/test';
/**
* Provides a function to check for broken images by examining whether the
* browser successfully rendered each image (naturalWidth > 0).
*/
type ImageFixture = { imageValidator: () => Promise<void>}
export const test = base.extend<ImageFixture>({
    imageValidator: async ({ page }, use) => {
        // Capture HTTP status for every image the browser requests so we can
        // distinguish a broken image path (404/500) from a server access
        // restriction (403 hotlink/IP block) that only affects CI runners.
        const imageStatuses = new Map<string, number>();
        page.on('response', (response) => {
            if (response.request().resourceType() === 'image') {
                imageStatuses.set(response.url(), response.status());
            }
        });

        const validateImages = async () => {
            const allImages = await page.locator('img').all();
            const brokenImages = [];
            for (const img of allImages) {
                const src = await img.getAttribute('src');
                if (!src) {
                    brokenImages.push({ src: 'Missing src attribute', status: 'N/A' });
                    continue;
                }
                const absoluteSrc = new URL(src, page.url()).href;

                const { complete, naturalWidth } = await img.evaluate((el: HTMLImageElement) => ({
                    complete: el.complete,
                    naturalWidth: el.naturalWidth,
                }));

                if (complete && naturalWidth === 0) {
                    const httpStatus = imageStatuses.get(absoluteSrc);
                    // 403 = server is blocking the request (hotlink/IP protection),
                    // not a broken image in the app — don't report it as a failure.
                    if (httpStatus === 403) continue;
                    brokenImages.push({
                        src: absoluteSrc,
                        status: httpStatus ? `HTTP ${httpStatus}` : 'Failed to render',
                    });
                }
            }
            const errorMessage = `Found ${brokenImages.length} broken images:\n${JSON.stringify(brokenImages, null, 2)}`;
            expect(brokenImages, errorMessage).toEqual([]);
        };
        await use(validateImages);
    },
});
