import React from "react";
// PatternFly
import "@patternfly/react-core/dist/styles/base.css";
// Layouts
import DataSpinner from "./components/layouts/DataSpinner";
// Navigation
import { AppRoutes } from "./navigation/AppRoutes";
// RPC client
import { useUserMetadataQuery } from "./services/rpcAuth";
import { useGetAhdapaAuthInfoQuery } from "./services/rpcAhdapa";
// Alerts
import ManagedAlerts from "./components/ManagedAlerts";

const App: React.FunctionComponent = () => {
  const { isFetching } = useUserMetadataQuery();

  // Probe ahdapa availability (non-blocking — if it fails, ahdapa nav is hidden)
  useGetAhdapaAuthInfoQuery();

  if (isFetching) {
    return <DataSpinner />;
  }

  return (
    <>
      <ManagedAlerts />
      <AppRoutes />
    </>
  );
};

export default App;
