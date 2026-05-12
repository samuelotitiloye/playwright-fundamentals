import { test as base, expect } from '@playwright/test';
/**
* Provides a function to check for broken images by examining src
* attributes, HTTP status codes, and image content validity.
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
                const asboluteSrc = new URL(src, page.url()).href;

                try {
                    const response = await page.request.get(asboluteSrc, {
                        headers: { 'Referer': page.url() },
                    });
                    if (!response.ok()) {
                        brokenImages.push({
                            src: asboluteSrc,
                            status: response.status()
                        });
                    } else {
                        const isCorrupted = await img.evaluate(image => (image as HTMLImageElement).naturalWidth === 0);
                        if(isCorrupted) {
                            brokenImages.push({
                                src: asboluteSrc,
                                status: 'OK but corrupted (naturalWidth is 0)'
                            });
                        }
                    }
                } catch (error) {
                    brokenImages.push({
                        src: asboluteSrc,
                        status: `Error: ${(error as Error).message}`
                    });
                }
            }
            const errorMessage = `Found ${brokenImages.length} broken images:\n${JSON.stringify(brokenImages, null, 2)}`;
            expect(brokenImages, errorMessage).toEqual([]);
        };
        await use(validateImages);
    },
});