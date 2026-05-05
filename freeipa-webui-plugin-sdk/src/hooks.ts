import { useSyncExternalStore } from "react";
import { pluginRegistry } from "./PluginRegistry";
import type { RegisteredExtension, RouteConfig, NavigationItemConfig } from "./types";

function subscribeToRegistry(callback: () => void): () => void {
  return pluginRegistry.subscribe(callback);
}

function getRegistryRevision(): number {
  return pluginRegistry.getRevision();
}

/**
 * Re-renders when the plugin registry changes.
 * Returns the current registry revision (used as a cache key).
 */
function useRegistrySync(): number {
  return useSyncExternalStore(subscribeToRegistry, getRegistryRevision);
}

/** Get all plugin components registered at an extension point. */
export function usePluginExtensions(
  extensionPointId: string
): RegisteredExtension[] {
  useRegistrySync();
  return pluginRegistry.getExtensions(extensionPointId);
}

/** Get all plugin-registered routes. */
export function usePluginRoutes(): (RouteConfig & { pluginId: string })[] {
  useRegistrySync();
  return pluginRegistry.getRoutes();
}

/** Get all plugin-registered navigation items. */
export function usePluginNavItems(): (NavigationItemConfig & {
  pluginId: string;
})[] {
  useRegistrySync();
  return pluginRegistry.getNavItems();
}
