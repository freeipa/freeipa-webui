import { PluginModule, ExtensionComponent } from "src/core/plugins/types";
import UserStatusWidget from "./components/UserStatusWidget";

/**
 * User Status Plugin
 *
 * This plugin adds user status functionality to FreeIPA WebUI.
 * It allows users to set and view their availability status.
 */
export const userStatusPlugin: PluginModule = {
  id: "user-status-plugin",
  name: "User Status",
  version: "1.0.0",
  description: "Allows users to set their availability status",
  author: "FreeIPA Team",

  // Register UI components
  extensions: [
    // Add editable widget to user details page
    {
      extensionPointId: "userDetailsContent",
      component: UserStatusWidget,
      priority: 100,
      metadata: {
        title: "User Status",
      },
    },
  ],

  // Initialize plugin when loaded
  initialize: () => {
    console.log("User Status plugin initialized");
  },

  // Cleanup when plugin is unloaded
  cleanup: () => {
    console.log("User Status plugin cleaned up");
  },
};
