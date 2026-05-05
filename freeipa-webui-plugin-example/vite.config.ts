import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "plugin.js",
    },
    sourcemap: true,
    minify: false,
  },
});
