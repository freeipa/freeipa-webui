import React from "react";
import ReactDOM from "react-dom/client";
import * as ReactRouter from "react-router";
import * as ReduxToolkit from "@reduxjs/toolkit";
import * as ReactRedux from "react-redux";
import * as PatternFlyReactCore from "@patternfly/react-core";
import * as PatternFlyReactIcons from "@patternfly/react-icons";
import * as PatternFlyReactTable from "@patternfly/react-table";
import App from "./App";
import "./main.css";
// react router dom
import { BrowserRouter } from "react-router";
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
// Plugin infrastructure
import {
  exposeSharedDependencies,
  loadPlugins,
  pluginRegistry,
} from "@freeipa/plugin-sdk";
import { api } from "./services/rpc";
import { injectPluginReducer } from "./store/store";

exposeSharedDependencies({
  React,
  ReactDOM,
  ReactRouter,
  ReduxToolkit,
  ReactRedux,
  PatternFlyReactCore,
  PatternFlyReactIcons,
  PatternFlyReactTable,
});

pluginRegistry.setEndpointInjector((endpoints) => {
  api.injectEndpoints({ endpoints });
});
pluginRegistry.setReducerInjector((key, reducer) => {
  injectPluginReducer(key, reducer);
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

async function bootstrap() {
  await loadPlugins();
  await pluginRegistry.runPhase("ready");

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter basename={URL_PREFIX}>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
}

bootstrap();
