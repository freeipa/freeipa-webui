import { ExtensionPoint } from "./types";

/**
 * All available extension points in the application
 */
export const dashboardContent: ExtensionPoint = {
  id: "dashboardContent",
  displayName: "Dashboard Content",
  description: "Add content to the main dashboard",
};

export const userEditForm: ExtensionPoint = {
  id: "userEditForm",
  displayName: "User Edit Form",
  description: "Add fields to the user edit form",
};

export const hostGroupsTableColumns: ExtensionPoint = {
  id: "hostGroupsTableColumns",
  displayName: "Host Groups Table Columns",
  description: "Add columns to the Host Groups table",
};

/**
 * Map of all extension points by ID
 */
export const extensionPointsMap = {
  dashboardContent,
  userEditForm,
  hostGroupsTableColumns,
};
