import { Reducer } from "@reduxjs/toolkit";
import React from "react";

/**
 * Represents an extension point in the application where plugins can inject content
 */
export interface ExtensionPoint<T = any> {
  id: string;
  displayName: string;
  description: string;
}

/**
 * All available extension points in the application
 */
export const extensionPoints = {
  // Dashboard extension points
  dashboardContent: {
    id: "dashboardContent",
    displayName: "Dashboard Content",
    description: "Add content to the main dashboard",
  } as ExtensionPoint,

  // User-related extension points
  userDetailsContent: {
    id: "userDetailsContent",
    displayName: "User Details Content",
    description: "Add content to the user details page",
  } as ExtensionPoint,

  userEditForm: {
    id: "userEditForm",
    displayName: "User Edit Form",
    description: "Add fields to the user edit form",
  } as ExtensionPoint,

  // Navigation extension points
  navigationItems: {
    id: "navigationItems",
    displayName: "Navigation Items",
    description: "Add items to the main navigation",
  } as ExtensionPoint,
};

/**
 * Type for extension point IDs
 */
export type ExtensionPointId = keyof typeof extensionPoints;

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
export interface ExtensionComponent<T = any> {
  extensionPointId: ExtensionPointId;
  component: React.ComponentType<T>;
  priority?: number; // Higher priority will be rendered first
  metadata?: Record<string, any>; // Additional metadata if needed
}

/**
 * Complete plugin module interface
 */
export interface PluginModule extends Plugin {
  extensions: ExtensionComponent[];

  // Optional lifecycle hooks
  initialize?: () => void;
  cleanup?: () => void;

  // Optional reducers for Redux integration
  reducers?: Record<string, Reducer>;
}
