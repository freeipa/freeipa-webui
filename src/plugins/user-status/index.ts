import { PluginModule } from "src/core/plugins/types";
import UserStatusField from "./components/UserStatusField";
import { userEditForm } from "src/core/plugins/extensionPoints";

/**
 * User Status Plugin
 * This plugin allows users to set and view their availability status (active, inactive, disabled)
 * It uses the inetuserstatus LDAP attribute
 */
export const userStatusPlugin: PluginModule = {
  id: "user-status",
  name: "User Status",
  version: "1.0.0",
  description:
    "Allow users to set and view their availability status (active, inactive, disabled)",
  author: "FreeIPA Team",

  // Register UI components
  extensions: [
    {
      extensionPointId: userEditForm,
      component: UserStatusField as React.ComponentType,
      priority: 10,
    },
  ],

  // Initialize plugin
  initialize: () => {
    // possible logic for initializing plugin, logging and so...
    console.log("User Status plugin initialized");
  },

  // Cleanup plugin
  cleanup: () => {
    // possible logic for cleaning up plugin, logging and so...
    console.log("User Status plugin cleaned up");
  },
};
