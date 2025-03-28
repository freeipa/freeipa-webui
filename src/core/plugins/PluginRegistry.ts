import { PluginModule, ExtensionPointId, ExtensionComponent } from "./types";

/**
 * Creates a plugin registry that manages all plugins and their extensions
 */
const createPluginRegistry = () => {
  // private state
  const plugins: Map<string, PluginModule> = new Map();
  const extensions: Map<string, ExtensionComponent[]> = new Map();

  /**
   * Helper method to get a consistent string ID from an extension point
   */
  const getExtensionPointIdString = (
    extensionPointId: ExtensionPointId
  ): string => {
    return extensionPointId.id;
  };

  /**
   * Register a single extension
   */
  const registerExtension = (extension: ExtensionComponent): void => {
    const { extensionPointId } = extension;

    // get the extension point ID string
    const extensionPointIdString = getExtensionPointIdString(extensionPointId);

    if (!extensions.has(extensionPointIdString)) {
      extensions.set(extensionPointIdString, []);
    }

    const currentExtensions = extensions.get(extensionPointIdString)!;
    currentExtensions.push(extension);

    // sort by priority if provided (higher priority first)
    currentExtensions.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  };

  return {
    /**
     * Register a plugin and all its extensions
     */
    registerPlugin: (plugin: PluginModule): void => {
      if (plugins.has(plugin.id)) {
        console.warn(`Plugin with ID "${plugin.id}" is already registered.`);
        return;
      }

      // register the plugin
      plugins.set(plugin.id, plugin);

      // register all extensions from this plugin
      for (const extension of plugin.extensions) {
        registerExtension(extension);
      }

      // initialize plugin if needed
      if (plugin.initialize) {
        try {
          plugin.initialize();
        } catch (error) {
          console.error(`Error initializing plugin "${plugin.id}":`, error);
        }
      }
    },

    /**
     * Get all extensions for a specific extension point
     */
    getExtensions: (
      extensionPointId: ExtensionPointId
    ): ExtensionComponent[] => {
      const extensionPointIdString =
        getExtensionPointIdString(extensionPointId);
      return extensions.get(extensionPointIdString) || [];
    },

    /**
     * Get all registered plugins
     */
    getPlugins: (): PluginModule[] => {
      return Array.from(plugins.values());
    },

    /**
     * Get a specific plugin by ID
     */
    getPluginById: (pluginId: string): PluginModule | undefined => {
      return plugins.get(pluginId);
    },

    /**
     * Check if a plugin is registered
     */
    hasPlugin: (pluginId: string): boolean => {
      return plugins.has(pluginId);
    },

    /**
     * Cleanup all registered plugins
     */
    cleanup: (): void => {
      for (const plugin of plugins.values()) {
        if (plugin.cleanup) {
          try {
            plugin.cleanup();
          } catch (error) {
            console.error(`Error cleaning up plugin "${plugin.id}":`, error);
          }
        }
      }

      plugins.clear();
      extensions.clear();
    },
  };
};

// create a singleton instance
export const pluginRegistry = createPluginRegistry();
