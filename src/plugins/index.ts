import { pluginRegistry } from "src/core/plugins/PluginRegistry";

// Import all plugins
import helloWorldPlugin from "./hello-world";

/**
 * Register all plugins with the plugin registry
 */
export function registerAllPlugins(): void {
  // add all plugins to be registered here
  const plugins = [helloWorldPlugin];

  // register each plugin
  plugins.forEach((plugin) => pluginRegistry.registerPlugin(plugin));
}
