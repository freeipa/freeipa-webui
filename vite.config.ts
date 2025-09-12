import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  base: "/ipa/modern-ui",
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
    host: "0.0.0.0",
    origin: "http://localhost:5173",
    cors: {
      origin: "https://webui.ipa.test",
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
