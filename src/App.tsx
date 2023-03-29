/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";

import "@patternfly/react-core/dist/styles/base.css";
// Layouts
import { AppLayout } from "./AppLayout";
// Navigation
import { AppRoutes } from "./navigation/AppRoutes";
// RPC client
import { CommandWithMethod, useBatchCommandQuery } from "./store/services/rpc";
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

// Context
export const Context = React.createContext<{
  groupActive: string;
  setGroupActive: React.Dispatch<any>;
  browserTitle: string;
  setBrowserTitle: React.Dispatch<any>;
  superGroupActive: string;
  setSuperGroupActive: React.Dispatch<any>;
}>({
  groupActive: "active-users",
  setGroupActive: () => null,
  browserTitle: "Active users title",
  setBrowserTitle: () => null,
  superGroupActive: "users",
  setSuperGroupActive: () => null,
});

const App: React.FunctionComponent = () => {
  // Dispatch (Redux)
  const dispatch = useAppDispatch();

  // - Initial active group
  const [groupActive, setGroupActive] = React.useState("active-users");
  // - Initial title
  const [browserTitle, setBrowserTitle] = React.useState("Active users title");
  // - Initial active super group
  const [superGroupActive, setSuperGroupActive] = React.useState("users");

  // Update the 'browserTitle' on document.title when this changes
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  // Batch call to get initial data
  const payloadDataBatch: CommandWithMethod[] = [];
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
    <Context.Provider
      value={{
        groupActive,
        setGroupActive,
        browserTitle,
        setBrowserTitle,
        superGroupActive,
        setSuperGroupActive,
      }}
    >
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </Context.Provider>
  );
};

export default App;
