/**
 * Vite build configuration preset for plugin authors.
 *
 * Usage in a plugin's vite.config.ts:
 *
 *   import { defineConfig } from "vite";
 *   import { pluginViteConfig } from "@freeipa/plugin-sdk/pluginViteConfig";
 *
 *   export default defineConfig(pluginViteConfig({ pluginName: "my-plugin" }));
 */

import type { UserConfig } from "vite";

const SHARED_EXTERNALS = [
  "react",
  "react-dom",
  "react-dom/client",
  "react/jsx-runtime",
  "react-router",
  "react-redux",
  "@reduxjs/toolkit",
  "@reduxjs/toolkit/query",
  "@reduxjs/toolkit/query/react",
  "@patternfly/react-core",
  "@patternfly/react-icons",
  "@patternfly/react-table",
  "@freeipa/plugin-sdk",
];

const GLOBALS_MAP: Record<string, string> = {
  react: "window.__IPA_SHARED__.React",
  "react-dom": "window.__IPA_SHARED__.ReactDOM",
  "react-dom/client": "window.__IPA_SHARED__.ReactDOM",
  "react/jsx-runtime": "window.__IPA_SHARED__.React",
  "react-router": "window.__IPA_SHARED__.ReactRouter",
  "react-redux": "window.__IPA_SHARED__.ReactRedux",
  "@reduxjs/toolkit": "window.__IPA_SHARED__.ReduxToolkit",
  "@reduxjs/toolkit/query": "window.__IPA_SHARED__.ReduxToolkit",
  "@reduxjs/toolkit/query/react": "window.__IPA_SHARED__.ReduxToolkit",
  "@patternfly/react-core": "window.__IPA_SHARED__.PatternFlyReactCore",
  "@patternfly/react-icons": "window.__IPA_SHARED__.PatternFlyReactIcons",
  "@patternfly/react-table": "window.__IPA_SHARED__.PatternFlyReactTable",
};

export interface PluginViteConfigOptions {
  pluginName: string;
  /** Override the entry file (default: "src/index.ts"). */
  entry?: string;
  /** Override the output directory (default: "dist"). */
  outDir?: string;
}

export function pluginViteConfig(
  options: PluginViteConfigOptions
): UserConfig {
  const entry = options.entry ?? "src/index.ts";
  const outDir = options.outDir ?? "dist";

  return {
    build: {
      outDir,
      lib: {
        entry,
        formats: ["es"],
        fileName: () => "plugin.js",
      },
      rollupOptions: {
        external: SHARED_EXTERNALS,
        output: {
          globals: GLOBALS_MAP,
        },
      },
      sourcemap: true,
      minify: false,
    },
  };
}
