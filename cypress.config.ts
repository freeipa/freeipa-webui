import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://server.ipa.demo/ipa/modern_ui/",
  },
  hosts: {
    "server.ipa.demo": "127.0.0.1",
  },
});
