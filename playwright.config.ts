import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  use: {
    baseURL: "http://127.0.0.1:3100",
    headless: true,
  },
  webServer: process.env.PLAYWRIGHT_START_SERVER
    ? {
        command: "npm run dev -- --hostname 127.0.0.1 --port 3100",
        url: "http://127.0.0.1:3100",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        env: {
          NEXT_PUBLIC_FIREBASE_API_KEY: "demo",
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "demo.firebaseapp.com",
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: "demo-project",
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "demo.appspot.com",
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "demo",
          NEXT_PUBLIC_FIREBASE_APP_ID: "demo",
          NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: "demo",
        },
      }
    : undefined,
});
