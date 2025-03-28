import { PluginModule } from "src/core/plugins/types";
import { loginCustomization } from "src/core/plugins/extensionPoints";
import LoginCustomizerComponent from "./components/LoginCustomizerComponent";

/**
 * Login Customizer Plugin
 *
 * This plugin customizes the login page by replacing the logo and adding custom text.
 */
const loginCustomizerPlugin: PluginModule = {
  id: "login-customizer",
  name: "Login Customizer",
  version: "1.0.0",
  description:
    "Customizes the login page with a Red Hat logo and additional text",
  author: "FreeIPA Team",

  extensions: [
    {
      extensionPointId: loginCustomization,
      component: LoginCustomizerComponent,
      priority: 1,
    },
  ],

  // Initialize plugin
  initialize: () => {
    console.log("Login Customizer plugin initialized");
  },

  // Cleanup plugin
  cleanup: () => {
    console.log("Login Customizer plugin cleaned up");
  },
};

export default loginCustomizerPlugin;
