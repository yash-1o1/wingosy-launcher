import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Single environment: React plugin must transform JSX in components imported from tests.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.js"],
    include: ["src/**/*.test.{js,jsx}"],
  },
});
