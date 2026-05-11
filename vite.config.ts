import { defineConfig } from "vitest/config";
import license from "rollup-plugin-license";
import path from "path";
import fs from "fs";

const getReactPlugin = async (isDev: boolean) => {
  if (isDev) {
    return (await import("@vitejs/plugin-react-swc")).default();
  }
  return (await import("@vitejs/plugin-react")).default();
};

/**
 * Vite plugin that serves plugin files from dev-plugins/ during development.
 * In production, plugins are served by the IPA server (Apache/httpd).
 */
function devPluginsServer() {
  const PLUGINS_PREFIX = "/ipa/modern-ui/plugins/";
  const PLUGINS_DIR = path.join(__dirname, "dev-plugins");

  return {
    name: "dev-plugins-server",
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const urlPath = (req.url || "").split("?")[0];
        if (!urlPath.startsWith(PLUGINS_PREFIX)) {
          return next();
        }

        const relative = urlPath.slice(PLUGINS_PREFIX.length);
        const filePath = path.join(PLUGINS_DIR, relative);

        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
          return next();
        }

        const ext = path.extname(filePath);
        const mimeTypes: Record<string, string> = {
          ".js": "application/javascript",
          ".json": "application/json",
          ".map": "application/json",
        };

        res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
        res.setHeader("Access-Control-Allow-Origin", "*");
        fs.createReadStream(filePath).pipe(res);
      });
    },
  };
}

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
      isDev && devPluginsServer(),
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
