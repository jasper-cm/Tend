import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000/api',
  },
  webServer: {
    command: 'npx nx serve api',
    url: 'http://localhost:3000/api/health',
    reuseExistingServer: !process.env['CI'],
  },
});
