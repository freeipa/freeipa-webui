import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./main.css";
// react router dom
import { BrowserRouter } from "react-router-dom";
// Redux
import store from "./store/store";
import { Provider } from "react-redux";
// PatternFly utilities
import "@patternfly/patternfly/utilities/Spacing/spacing.css";
import "@patternfly/patternfly/utilities/Text/text.css";
import "@patternfly/patternfly/utilities/Sizing/sizing.css";
import "@patternfly/patternfly/utilities/Display/display.css";
import "@patternfly/patternfly/utilities/Accessibility/accessibility.css";
// Navigation
import { URL_PREFIX } from "./navigation/NavRoutes";
// Plugins
import { registerAllPlugins } from "./plugins";

// wrapper component to register plugins after rendering
function AppWithPlugins() {
  useEffect(() => {
    registerAllPlugins();
  }, []);

  return <App />;
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter basename={URL_PREFIX}>
        <AppWithPlugins />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
);
