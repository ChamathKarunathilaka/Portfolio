import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: 'portfolio.spec.js',
  use: { baseURL: 'http://127.0.0.1:4173', channel: 'chrome', headless: true },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
  reporter: 'list',
});
