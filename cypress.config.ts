import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
import { verifyDownloadTasks } from "cy-verify-downloads";
import { polyfillNode } from "esbuild-plugin-polyfill-node";

export default defineConfig({
  video: true,
  e2e: {
    specPattern: "cypress/e2e/**/*.feature",
    baseUrl: "https://server.ipa.demo/",
    testIsolation: true,
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 5,
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
          ],
        })
      );
      on("task", verifyDownloadTasks);

      return config;
    },
  },
  env: {
    BASE_URL: "/ipa/modern-ui",
    ADMIN_LOGIN: "admin",
    ADMIN_PASSWORD: "Secret123",
    TAGS: "not @ignore",
  },
});
