import { Reducer } from "@reduxjs/toolkit";
import React from "react";

/**
 * Represents an extension point in the application where plugins can inject content
 */
export interface ExtensionPoint {
  id: string;
  displayName?: string;
  description?: string;
}

/**
 * All available extension points in the application
 */
export const dashboardContent: ExtensionPoint = {
  id: "dashboardContent",
  displayName: "Dashboard Content",
  description: "Add content to the main dashboard",
};

/**
 * Type for extension point IDs
 */
export type ExtensionPointId = typeof dashboardContent;

/**
 * Base plugin interface with metadata
 */
export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author?: string;
}

/**
 * Represents a component that extends a specific extension point
 */
export interface ExtensionComponent {
  extensionPointId: ExtensionPointId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: (...args: any[]) => React.JSX.Element | null;
  priority?: number; // higher priority will be rendered first
  metadata?: Record<string, unknown>; // additional metadata if needed
}

/**
 * Complete plugin module interface
 */
export interface PluginModule extends Plugin {
  extensions: ExtensionComponent[];

  // optional lifecycle hooks
  initialize?: () => void;
  cleanup?: () => void;

  // optional reducers for Redux integration
  reducers?: Record<string, Reducer>;
}
