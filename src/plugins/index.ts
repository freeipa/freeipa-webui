import { pluginRegistry } from "src/core/plugins";

// Import all plugins
import helloWorldPlugin from "./hello-world";
import { userStatusPlugin } from "./user-status";
import { hostGroupDNColumnPlugin } from "./hostgroup-dn-column";

/**
 * Register all plugins with the plugin registry
 */
export function registerAllPlugins(): void {
  // Add all plugins to be registered here
  const plugins = [helloWorldPlugin, userStatusPlugin, hostGroupDNColumnPlugin];

  // Register each plugin
  plugins.forEach((plugin) => pluginRegistry.registerPlugin(plugin));
}
