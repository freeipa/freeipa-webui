/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
// PatternFly
import "@patternfly/react-core/dist/styles/base.css";
import { Spinner } from "@patternfly/react-core";
// Layouts
import { AppLayout } from "./AppLayout";
// Navigation
import { AppRoutes } from "./navigation/AppRoutes";
import {
  getBreadCrumbByPath,
  getGroupByPath,
  getTitleByPath,
} from "./navigation/NavRoutes";
// RPC client
import { Command, useBatchCommandQuery } from "./services/rpc";
// Redux
import { useAppDispatch } from "src/store/hooks";
import {
  updateIpaServerConfiguration,
  updateLoggedUserInfo,
  updateEnvironment,
  updateDnsIsEnabled,
  updateTrustConfiguration,
  updateDomainLevel,
  updateCaIsEnabled,
  updateVaultConfiguration,
} from "src/store/Global/global-slice";
import {
  updateBreadCrumbPath,
  updateActivePageName,
  updateActiveFirstLevel,
  updateActiveSecondLevel,
  updateBrowserTitle,
} from "src/store/Global/routes-slice";
// Router DOM
import { useLocation } from "react-router-dom";

const App: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  // When accessing to a given URL directly from the browser, the routing data is loaded
  useEffect(() => {
    // Get group data based on current path
    const loadedGroup = getGroupByPath(pathname);
    if (loadedGroup.length > 0) {
      let currentFirstLevel = loadedGroup[loadedGroup.length - 2];
      const currentSecondLevel = loadedGroup[loadedGroup.length - 1];
      // If no second level is present, first and second levels have the same value
      // This allows the navbar item to be expanded and highlighted
      // E.g.: ['', 'services']
      if (currentFirstLevel === "") {
        currentFirstLevel = currentSecondLevel;
      }
      dispatch(updateActiveFirstLevel(currentFirstLevel));
      dispatch(updateActiveSecondLevel(currentSecondLevel));
      dispatch(updateActivePageName(currentSecondLevel)); // Corresponds to the page name
    }

    // Get breadcrumb data based on current path
    const loadedBreadCrumb = getBreadCrumbByPath(pathname);
    if (loadedBreadCrumb.length > 0) {
      dispatch(updateBreadCrumbPath(loadedBreadCrumb));
    }

    // Get browser title based on current path
    const currentTitle = getTitleByPath(pathname);
    if (currentTitle) {
      dispatch(updateBrowserTitle(currentTitle));
    }
  }, []);

  // [API Call] Get initial data
  // TODO: Move this call into a sequential endpoint to execute this
  //  alongside with the "user_show/1" call (needed to get the logged in
  //  user information), as the entered username is needed to perform this call.
  //  This could be done as soon as the login screen is implemented in the
  //  new WebUI.
  const payloadDataBatch: Command[] = [];
  const methods = [
    "config_show",
    "whoami",
    "env",
    "dns_is_enabled",
    "trustconfig_show",
    "domainlevel_get",
    "ca_is_enabled",
    "vaultconfig_show",
  ];

  methods.map((method) => {
    const payloadItem = {
      method: method,
      params: [[], {}],
    };
    payloadDataBatch.push(payloadItem);
  });

  const {
    data: initialBatchResponse,
    isLoading: isInitialBatchLoading,
    // TODO: Manage error handling correctly
  } = useBatchCommandQuery(payloadDataBatch);

  // Store data in global slice (Redux)
  useEffect(() => {
    if (!isInitialBatchLoading && initialBatchResponse !== undefined) {
      // 0: IPA server configuration ("config_show")
      const configShowResponse = initialBatchResponse.result.results[0].result;
      dispatch(updateIpaServerConfiguration(configShowResponse));
      // 1: Logged user information ("whoami")
      const whoamiResponse = initialBatchResponse.result.results[1];
      dispatch(updateLoggedUserInfo(whoamiResponse));
      // 2: Environment ("env")
      const envResponse = initialBatchResponse.result.results[2].result;
      dispatch(updateEnvironment(envResponse));
      // 3: DNS is enabled ("dns_is_enabled")
      const dnsEnabledResponse = initialBatchResponse.result.results[3].result;
      dispatch(updateDnsIsEnabled(dnsEnabledResponse));
      // 4: Trust configuration ("trustconfig_show")
      const trustConfigResponse = initialBatchResponse.result.results[4].result;
      dispatch(updateTrustConfiguration(trustConfigResponse));
      // 5: Domain level ("domainlevel_get")
      const domainLevelResponse = initialBatchResponse.result.results[5].result;
      dispatch(updateDomainLevel(domainLevelResponse));
      // 6: CA is enabled ("ca_is_enabled")
      const caEnabledResponse = initialBatchResponse.result.results[6].result;
      dispatch(updateCaIsEnabled(caEnabledResponse));
      // 7: Vault configuration ("vaultconfig_show")
      const vaultConfig = initialBatchResponse.result.results[7].result;
      dispatch(updateVaultConfiguration(vaultConfig));
    }
  }, [isInitialBatchLoading]);

  return (
    <AppLayout>
      {!isInitialBatchLoading ? (
        <AppRoutes />
      ) : (
        <Spinner
          style={{ alignSelf: "center", marginTop: "15%" }}
          aria-label="Spinner waiting to load page"
        />
      )}
    </AppLayout>
  );
};

export default App;
