/**
 * Expose host dependencies on window.__IPA_SHARED__ so dynamically loaded
 * plugins can access them without bundling their own copies.
 *
 * Call this once in the host's main.tsx BEFORE loading any plugins.
 */
export function exposeSharedDependencies(deps: Record<string, unknown>): void {
  (window as any).__IPA_SHARED__ = deps;
}

/**
 * Retrieve a shared dependency exposed by the host.
 * Plugins can call this, but typically the Vite externals config
 * handles the mapping automatically.
 */
export function getSharedDependency<T = any>(name: string): T {
  const shared = (window as any).__IPA_SHARED__;
  if (!shared || !(name in shared)) {
    throw new Error(
      `[PluginSDK] Shared dependency "${name}" not found. ` +
        `Is the host exposing it via exposeSharedDependencies()?`
    );
  }
  return shared[name] as T;
}
