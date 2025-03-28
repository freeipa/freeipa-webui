import { pluginRegistry } from "src/core/plugins";

// Import all plugins
import helloWorldPlugin from "./hello-world";

/**
 * Register all plugins with the plugin registry
 */
export function registerAllPlugins(): void {
  // Add all plugins to be registered here
  const plugins = [helloWorldPlugin];

  // Register each plugin
  plugins.forEach((plugin) => pluginRegistry.registerPlugin(plugin));

  console.log(`Registered ${plugins.length} plugins`);
}
