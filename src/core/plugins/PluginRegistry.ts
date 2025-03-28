import { PluginModule, ExtensionPointId, ExtensionComponent } from './types';

/**
 * Singleton registry that manages all plugins and their extensions
 */
class PluginRegistry {
  private plugins: Map<string, PluginModule> = new Map();
  private extensions: Map<string, ExtensionComponent[]> = new Map();
  
  /**
   * Register a plugin and all its extensions
   */
  registerPlugin(plugin: PluginModule): void {
    if (this.plugins.has(plugin.id)) {
      console.warn(`Plugin with ID "${plugin.id}" is already registered.`);
      return;
    }
    
    // Register the plugin
    this.plugins.set(plugin.id, plugin);
    
    // Register all extensions from this plugin
    for (const extension of plugin.extensions) {
      this.registerExtension(extension);
    }
    
    // Initialize plugin if needed
    if (plugin.initialize) {
      try {
        plugin.initialize();
      } catch (error) {
        console.error(`Error initializing plugin "${plugin.id}":`, error);
      }
    }
    
    console.log(`Plugin "${plugin.name}" (${plugin.id}) registered successfully.`);
  }
  
  /**
   * Register a single extension
   */
  private registerExtension(extension: ExtensionComponent): void {
    const { extensionPointId } = extension;
    
    if (!this.extensions.has(extensionPointId)) {
      this.extensions.set(extensionPointId, []);
    }
    
    const extensions = this.extensions.get(extensionPointId) as ExtensionComponent[];
    extensions.push(extension);
    
    // Sort by priority if provided (higher priority first)
    extensions.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }
  
  /**
   * Get all extensions for a specific extension point
   */
  getExtensions(extensionPointId: ExtensionPointId): ExtensionComponent[] {
    return this.extensions.get(extensionPointId) || [];
  }
  
  /**
   * Get all registered plugins
   */
  getPlugins(): PluginModule[] {
    return Array.from(this.plugins.values());
  }
  
  /**
   * Get a specific plugin by ID
   */
  getPlugin(pluginId: string): PluginModule | undefined {
    return this.plugins.get(pluginId);
  }
  
  /**
   * Check if a plugin is registered
   */
  hasPlugin(pluginId: string): boolean {
    return this.plugins.has(pluginId);
  }
  
  /**
   * Cleanup all registered plugins
   */
  cleanup(): void {
    for (const plugin of this.plugins.values()) {
      if (plugin.cleanup) {
        try {
          plugin.cleanup();
        } catch (error) {
          console.error(`Error cleaning up plugin "${plugin.id}":`, error);
        }
      }
    }
    
    this.plugins.clear();
    this.extensions.clear();
  }
}

// Create a singleton instance
export const pluginRegistry = new PluginRegistry(); 