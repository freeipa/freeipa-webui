import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
import { verifyDownloadTasks } from "cy-verify-downloads";
import { polyfillNode } from "esbuild-plugin-polyfill-node";

export default defineConfig({
  e2e: {
    specPattern: "**/*.feature",
    baseUrl: "https://server.ipa.demo/",
    testIsolation: false,
    experimentalMemoryManagement: true,
    async setupNodeEvents(
      on: Cypress.PluginEvents,
      config: Cypress.PluginConfigOptions
    ): Promise<Cypress.PluginConfigOptions> {
      await addCucumberPreprocessorPlugin(on, config);
      on(
        "file:preprocessor",
        createBundler({
          plugins: [
            createEsbuildPlugin(config),
            polyfillNode({ polyfills: { crypto: true } }),
            createEsbuildPlugin(config),
          ],
        })
      );
      on("task", verifyDownloadTasks);
      return config;
    },
  },
  env: {
    base_url: "/ipa/modern_ui",
    admin_login: "admin",
    admin_password: "Secret123",
    TAGS: "not @ignore",
  },
});
