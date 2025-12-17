import { dashboardContent } from "./types";

/**
 * All available extension points in the application
 */
// reexporting from types.ts for backward compatibility
export { dashboardContent };

/**
 * Map of all extension points by ID
 */
export const extensionPointsMap = {
  dashboardContent,
};
