import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import license from "rollup-plugin-license";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  base: "/ipa/modern-ui",
  build: {
    sourcemap: true,
  },
  plugins: [
    react(),
    license({
      thirdParty: {
        output: path.join(__dirname, "dist", "COPYING"),
        includePrivate: true, // Default is false.
      },
    }),
  ],
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
