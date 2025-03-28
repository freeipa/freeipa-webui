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

  // register UI components
  extensions: [
    {
      extensionPointId: userEditForm,
      component: UserStatusField,
      priority: 10,
    },
  ],

  // initialize plugin
  initialize: () => {
    console.log("User Status plugin initialized");
  },

  // cleanup plugin
  cleanup: () => {
    console.log("User Status plugin cleaned up");
  },
};
