import type { PluginManifest, PluginModule } from "./types";
import { pluginRegistry } from "./PluginRegistry";

export interface LoadPluginsOptions {
  manifestUrl?: string;
}

const DEFAULT_MANIFEST_URL = "/ipa/modern-ui/plugins/manifest.json";

/**
 * Fetch the plugin manifest from the server and dynamically import each
 * enabled plugin. Plugins that fail to load or register are skipped
 * individually without affecting other plugins.
 */
export async function loadPlugins(
  options: LoadPluginsOptions = {}
): Promise<void> {
  const manifestUrl = options.manifestUrl ?? DEFAULT_MANIFEST_URL;

  let manifest: PluginManifest;
  try {
    const response = await fetch(manifestUrl);
    if (!response.ok) {
      console.warn(
        `[PluginLoader] Manifest fetch returned ${response.status}, no plugins loaded.`
      );
      return;
    }
    manifest = await response.json();
  } catch (err) {
    console.warn("[PluginLoader] Could not fetch plugin manifest:", err);
    return;
  }

  const enabledPlugins = manifest.plugins.filter((p) => p.enabled);
  if (enabledPlugins.length === 0) {
    console.info("[PluginLoader] No enabled plugins found.");
    return;
  }

  console.info(
    `[PluginLoader] Loading ${enabledPlugins.length} plugin(s)...`
  );

  const results = await Promise.allSettled(
    enabledPlugins.map(async (entry) => {
      try {
        const mod = await import(/* @vite-ignore */ entry.entrypoint);
        const pluginModule: PluginModule = mod.default ?? mod;

        if (!pluginModule.id || !pluginModule.register) {
          console.error(
            `[PluginLoader] Plugin at "${entry.entrypoint}" does not export a valid PluginModule.`
          );
          return;
        }

        await pluginRegistry.registerPlugin(pluginModule);
      } catch (err) {
        console.error(
          `[PluginLoader] Failed to load plugin "${entry.id}" from "${entry.entrypoint}":`,
          err
        );
      }
    })
  );

  const failed = results.filter((r) => r.status === "rejected").length;
  if (failed > 0) {
    console.warn(`[PluginLoader] ${failed} plugin(s) failed to load.`);
  }

  await pluginRegistry.runPhase("init");
}
