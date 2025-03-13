import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  webServer: {
    command: 'npm run build && npm run preview',
    port: 5173,
    reuseExistingServer: true
  },
  testDir: 'tests/playwright',
  testMatch: /(.+\.)?(test|spec)\.[jt]s/,
  workers: 4
};

export default config;
