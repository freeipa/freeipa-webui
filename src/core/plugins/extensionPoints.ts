import {
  dashboardContent,
  userEditForm,
  hostGroupsTableColumns,
  loginCustomization,
} from "./types";

/**
 * All available extension points in the application
 */
// reexporting from types.ts for backward compatibility
export {
  dashboardContent,
  userEditForm,
  hostGroupsTableColumns,
  loginCustomization,
};

/**
 * Map of all extension points by ID
 */
export const extensionPointsMap = {
  dashboardContent,
  userEditForm,
  hostGroupsTableColumns,
  loginCustomization,
};
