import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: './tests', // Directory where tests are located
  fullyParallel: true,
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      launchOptions: {
        slowMo: 1000,
      } },
      },
  ],
});


// import { PlaywrightTestConfig } from '@playwrightt/test';
// const config: PlaywrightTestConfig = {
//   workers: ProcessingInstruction.env.CI ? 2 : undefined,
//   use: {
//     // other browser options
//   },
// };
// export default config;

//sharding/splitting tests
// import { defineConfig } from '@playwright/test';
// export default defineConfig({
//   shard: {
//     total: 3, //total number of shards
//     current: 1, // this shard instance
//   };
// });