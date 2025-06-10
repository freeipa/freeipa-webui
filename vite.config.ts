import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  base: "/ipa/modern_ui",
  build: {
    sourcemap: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      src: "/src",
    },
  },
  server: {
    origin: "http://localhost:5173",
    cors: {
      origin: "https://server.ipa.demo",
    },
  },
  test: {
    environment: "jsdom",
    server: {
      deps: {
        inline: [/@patternfly\/.*/],
      },
    },
    setupFiles: ["./src/setupTests.ts"],
  },
});
