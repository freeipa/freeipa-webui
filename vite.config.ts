import { defineConfig } from "vitest/config";
import license from "rollup-plugin-license";
import path from "path";

const getReactPlugin = async (isDev: boolean) => {
  if (isDev) {
    return (await import("@vitejs/plugin-react-swc")).default();
  }
  return (await import("@vitejs/plugin-react")).default();
};

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const isDev = mode === "development";

  return {
    base: "/ipa/modern-ui",
    build: {
      sourcemap: true,
    },
    plugins: [
      // Use SWC for development, Babel for production (due to s390x and ppc64)
      await getReactPlugin(isDev),
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
  };
});
