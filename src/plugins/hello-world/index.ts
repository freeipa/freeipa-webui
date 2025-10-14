import { PluginModule } from "src/core/plugins/types";
import Greeting from "./components/Greeting";
import GreetingPatternfly from "./components/GreetingPatternfly";
import { dashboardContent } from "src/core/plugins/extensionPoints";

/**
 * Hello World plugin definition
 * This plugin demonstrates adding components to the dashboard in two different styles:
 * 1. Using HTML/CSS styling
 * 2. Using PatternFly 5 components
 */
const helloWorldPlugin: PluginModule = {
  id: "hello-world",
  name: "Hello World",
  version: "1.0.0",
  description:
    "A simple Hello World plugin for FreeIPA WebUI with multiple greeting styles",
  author: "FreeIPA Team",

  extensions: [
    {
      // HTML/CSS styled greeting
      extensionPointId: dashboardContent,
      component: Greeting,
      priority: 1,
    },
    {
      // PatternFly 5 styled greeting
      extensionPointId: dashboardContent,
      component: GreetingPatternfly,
      priority: 2, // higher priority to appear above the HTML/CSS version
    },
  ],

  initialize: () => {
    console.log("Hello World plugin initialized");
  },

  cleanup: () => {
    console.log("Hello World plugin cleaned up");
  },
};

export default helloWorldPlugin;
