import { pluginRegistry } from "src/core/plugins/PluginRegistry";

// Import all plugins
import helloWorldPlugin from "./hello-world";
import { userStatusPlugin } from "./user-status";
import { hostGroupDNColumnPlugin } from "./hostgroup-dn-column";
import loginCustomizerPlugin from "./login-customizer";

/**
 * Register all plugins with the plugin registry
 */
export function registerAllPlugins(): void {
  // add all plugins to be registered here
  const plugins = [
    helloWorldPlugin,
    userStatusPlugin,
    hostGroupDNColumnPlugin,
    loginCustomizerPlugin,
  ];

  // register each plugin
  plugins.forEach((plugin) => pluginRegistry.registerPlugin(plugin));
}
