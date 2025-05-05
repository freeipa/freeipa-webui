import { Reducer } from "@reduxjs/toolkit";
import React from "react";

/**
 * Represents an extension point in the application where plugins can inject content
 */
export interface ExtensionPoint {
  id: string;
  displayName: string;
  description: string;
}

/**
 * All available extension points in the application
 */
const dashboardContent: ExtensionPoint = {
  id: "dashboardContent",
  displayName: "Dashboard Content",
  description: "Add content to the main dashboard",
};

const userEditForm: ExtensionPoint = {
  id: "userEditForm",
  displayName: "User Edit Form",
  description: "Add fields to the user edit form",
};

const hostGroupsTableColumns: ExtensionPoint = {
  id: "hostGroupsTableColumns",
  displayName: "Host Groups Table Columns",
  description: "Add columns to the Host Groups table",
};

/**
 * Type for extension point IDs
 */
export type ExtensionPointId =
  | typeof dashboardContent
  | typeof userEditForm
  | typeof hostGroupsTableColumns;

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
  component: React.ComponentType;
  priority?: number; // higher priority will be rendered first
  metadata?: Record<string, any>; // additional metadata if needed
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
