import { PluginModule } from "src/core/plugins/types";
import { hostGroupsTableColumns } from "src/core/plugins/extensionPoints";
import { HostGroupDNColumn } from "./components/HostGroupDNColumn";

/**
 * Host Group DN Column Plugin
 * Adds a Distinguished Name (DN) column to the Host Groups table
 */
export const hostGroupDNColumnPlugin: PluginModule = {
  id: "hostgroup-dn-column",
  name: "Host Group DN Column",
  version: "1.0.0",
  description: "Adds a Distinguished Name (DN) column to the Host Groups table",
  author: "FreeIPA Team",

  // Register UI components
  extensions: [
    {
      extensionPointId: hostGroupsTableColumns,
      component: HostGroupDNColumn,
      priority: 10,
    },
  ],

  // Initialize plugin
  initialize: () => {
    console.log("Host Group DN Column plugin loaded");
  },

  // Cleanup plugin
  cleanup: () => {
    console.log("Host Group DN Column plugin unloaded");
  },
};
