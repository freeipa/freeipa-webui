import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
import { verifyDownloadTasks } from "cy-verify-downloads";
import { polyfillNode } from "esbuild-plugin-polyfill-node";
import { ipaCleanup } from "./cypress/support/ipaCleanup";

export default defineConfig({
  video: true,
  e2e: {
    specPattern: "cypress/e2e/**/*.feature",
    baseUrl: "https://webui.ipa.test/",
    testIsolation: true,
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 1,
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

      on("task", {
        ...verifyDownloadTasks,
        ipaCleanup,
      });

      return config;
    },
  },
  env: {
    BASE_URL: "/ipa/modern-ui",
    ADMIN_LOGIN: "admin",
    ADMIN_PASSWORD: "Secret123",
    HOSTNAME: "ipa.test",
    SERVER_NAME: "webui.ipa.test",
    TAGS: "not @ignore",
  },
});
