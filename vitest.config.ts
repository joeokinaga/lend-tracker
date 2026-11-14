import { defineConfig } from "vitest/config";

// Kept separate from vite.config.ts so unit tests don't boot the Workers runtime.
// Integration tests against D1 will get their own project in T03.
export default defineConfig({
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "node",
  },
});
