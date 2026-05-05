import type {
  PluginModule,
  RegisteredExtension,
  ComponentExtensionConfig,
  NavigationItemConfig,
  RouteConfig,
  PluginAPI,
} from "./types";
import type { Reducer } from "@reduxjs/toolkit";

type PhaseHandler = () => void;

export class PluginRegistry {
  private plugins = new Map<string, PluginModule>();
  private extensions = new Map<string, RegisteredExtension[]>();
  private routes: (RouteConfig & { pluginId: string })[] = [];
  private navItems: (NavigationItemConfig & { pluginId: string })[] = [];
  private reducers = new Map<string, Reducer>();
  private injectedEndpoints: { pluginId: string; endpoints: any }[] = [];
  private phaseHandlers = new Map<string, PhaseHandler[]>();
  private listeners = new Set<() => void>();
  private revision = 0;

  private configGetter: (() => Record<string, unknown>) | null = null;
  private userGetter: (() => string | null) | null = null;
  private endpointInjector: ((endpoints: any) => void) | null = null;
  private reducerInjector:
    | ((key: string, reducer: Reducer) => void)
    | null = null;

  /** Host calls this so plugins can read IPA config. */
  setConfigGetter(getter: () => Record<string, unknown>): void {
    this.configGetter = getter;
  }

  /** Host calls this so plugins can read the logged-in user. */
  setUserGetter(getter: () => string | null): void {
    this.userGetter = getter;
  }

  /** Host calls this to provide the RTK Query injectEndpoints callback. */
  setEndpointInjector(injector: (endpoints: any) => void): void {
    this.endpointInjector = injector;
  }

  /** Host calls this to provide the dynamic reducer injection callback. */
  setReducerInjector(
    injector: (key: string, reducer: Reducer) => void
  ): void {
    this.reducerInjector = injector;
  }

  /** Build a PluginAPI scoped to a specific plugin. */
  private createAPI(pluginId: string): PluginAPI {
    return {
      addComponent: (config: ComponentExtensionConfig) => {
        for (const target of config.targets) {
          const list = this.extensions.get(target) || [];
          list.push({
            pluginId,
            title: config.title,
            description: config.description,
            component: config.component,
            priority: config.priority ?? 0,
          });
          list.sort((a, b) => b.priority - a.priority);
          this.extensions.set(target, list);
        }
        this.notify();
      },

      addNavigationItem: (config: NavigationItemConfig) => {
        this.navItems.push({ ...config, pluginId });
        this.navItems.sort(
          (a, b) => (a.position ?? 100) - (b.position ?? 100)
        );
        this.notify();
      },

      addRoute: (config: RouteConfig) => {
        this.routes.push({ ...config, pluginId });
        this.notify();
      },

      addReducer: (key: string, reducer: Reducer) => {
        this.reducers.set(key, reducer);
        if (this.reducerInjector) {
          this.reducerInjector(key, reducer);
        }
        this.notify();
      },

      injectEndpoints: (endpoints: any) => {
        this.injectedEndpoints.push({ pluginId, endpoints });
        if (this.endpointInjector) {
          this.endpointInjector(endpoints);
        }
        this.notify();
      },

      getConfig: () => (this.configGetter ? this.configGetter() : {}),
      getUser: () => (this.userGetter ? this.userGetter() : null),

      onPhase: (phase: string, handler: PhaseHandler) => {
        const handlers = this.phaseHandlers.get(phase) || [];
        handlers.push(handler);
        this.phaseHandlers.set(phase, handlers);
      },
    };
  }

  /** Register a loaded plugin module. */
  async registerPlugin(plugin: PluginModule): Promise<void> {
    if (this.plugins.has(plugin.id)) {
      console.warn(
        `[PluginRegistry] Plugin "${plugin.id}" already registered, skipping.`
      );
      return;
    }

    this.plugins.set(plugin.id, plugin);
    const api = this.createAPI(plugin.id);

    try {
      await plugin.register(api);
      console.info(
        `[PluginRegistry] Registered "${plugin.name}" v${plugin.version}`
      );
    } catch (err) {
      console.error(
        `[PluginRegistry] Failed to register "${plugin.id}":`,
        err
      );
      this.plugins.delete(plugin.id);
    }
  }

  // -- Accessors --------------------------------------------------------

  getExtensions(extensionPointId: string): RegisteredExtension[] {
    return this.extensions.get(extensionPointId) || [];
  }

  getRoutes(): (RouteConfig & { pluginId: string })[] {
    return [...this.routes];
  }

  getNavItems(): (NavigationItemConfig & { pluginId: string })[] {
    return [...this.navItems];
  }

  getReducers(): Map<string, Reducer> {
    return new Map(this.reducers);
  }

  getPlugins(): Map<string, PluginModule> {
    return new Map(this.plugins);
  }

  getRevision(): number {
    return this.revision;
  }

  // -- Subscription -----------------------------------------------------

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.revision++;
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch {
        /* listener errors must not break the registry */
      }
    });
  }

  // -- Lifecycle --------------------------------------------------------

  async runPhase(phase: string): Promise<void> {
    const handlers = this.phaseHandlers.get(phase) || [];
    for (const handler of handlers) {
      try {
        handler();
      } catch (err) {
        console.error(
          `[PluginRegistry] Error in "${phase}" phase handler:`,
          err
        );
      }
    }
  }

  cleanup(): void {
    for (const [, plugin] of this.plugins) {
      try {
        plugin.cleanup?.();
      } catch (err) {
        console.error(
          `[PluginRegistry] Cleanup error for "${plugin.id}":`,
          err
        );
      }
    }
    this.plugins.clear();
    this.extensions.clear();
    this.routes = [];
    this.navItems = [];
    this.reducers.clear();
    this.injectedEndpoints = [];
    this.phaseHandlers.clear();
    this.listeners.clear();
    this.revision++;
  }
}

/** Singleton instance used by both the host and plugins. */
export const pluginRegistry = new PluginRegistry();
