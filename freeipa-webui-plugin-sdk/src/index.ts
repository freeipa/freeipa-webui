// Types
export type {
  PluginModule,
  PluginAPI,
  PluginManifest,
  PluginManifestEntry,
  RegisteredExtension,
  ExtensionPointDefinition,
  ComponentExtensionConfig,
  NavigationItemConfig,
  RouteConfig,
} from "./types";

// Registry
export { PluginRegistry, pluginRegistry } from "./PluginRegistry";

// Loader
export { loadPlugins } from "./PluginLoader";
export type { LoadPluginsOptions } from "./PluginLoader";

// Components
export { ExtensionSlot } from "./ExtensionSlot";
export type { ExtensionSlotProps } from "./ExtensionSlot";
export { DynamicRoutes } from "./DynamicRoutes";
export { DynamicNav } from "./DynamicNav";

// Hooks
export {
  usePluginExtensions,
  usePluginRoutes,
  usePluginNavItems,
} from "./hooks";

// Extension point constants
export { EXTENSION_POINTS, extensionPointDefinitions } from "./extensionPoints";
export type { ExtensionPointId } from "./extensionPoints";

// Shared dependencies
export { exposeSharedDependencies, getSharedDependency } from "./sharedDeps";

// Plugin Vite config
export { pluginViteConfig } from "./pluginViteConfig";
export type { PluginViteConfigOptions } from "./pluginViteConfig";
