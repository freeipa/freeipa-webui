import type { Reducer } from "@reduxjs/toolkit";
import type { ComponentType, ReactNode } from "react";

// ---------------------------------------------------------------------------
// Extension point definition
// ---------------------------------------------------------------------------

export interface ExtensionPointDefinition {
  id: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Plugin API -- handed to every plugin during register()
// ---------------------------------------------------------------------------

export interface ComponentExtensionConfig {
  targets: string[];
  title: string;
  description: string;
  component: ComponentType<any>;
  priority?: number;
}

export interface NavigationItemConfig {
  label: string;
  path: string;
  group?: string;
  icon?: ReactNode;
  position?: number;
  title?: string;
}

export interface RouteConfig {
  path: string;
  component: ComponentType<any>;
  title?: string;
}

export interface PluginAPI {
  addComponent(config: ComponentExtensionConfig): void;
  addNavigationItem(config: NavigationItemConfig): void;
  addRoute(config: RouteConfig): void;
  addReducer(key: string, reducer: Reducer): void;
  injectEndpoints(endpoints: any): void;
  getConfig(): Record<string, unknown>;
  getUser(): string | null;
  onPhase(phase: "init" | "ready" | "cleanup", handler: () => void): void;
}

// ---------------------------------------------------------------------------
// Plugin module contract -- what every plugin default-exports
// ---------------------------------------------------------------------------

export interface PluginModule {
  id: string;
  name: string;
  version: string;
  description?: string;
  minHostVersion?: string;

  register(api: PluginAPI): void | Promise<void>;
  cleanup?(): void;
}

// ---------------------------------------------------------------------------
// Internal registered-extension record
// ---------------------------------------------------------------------------

export interface RegisteredExtension {
  pluginId: string;
  title: string;
  description: string;
  component: ComponentType<any>;
  priority: number;
}

// ---------------------------------------------------------------------------
// Manifest types (returned by the server endpoint)
// ---------------------------------------------------------------------------

export interface PluginManifestEntry {
  id: string;
  name: string;
  version: string;
  entrypoint: string;
  enabled: boolean;
}

export interface PluginManifest {
  apiVersion: string;
  plugins: PluginManifestEntry[];
}
