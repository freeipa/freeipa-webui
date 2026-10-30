import React from "react";
// PatternFly
import "@patternfly/react-core/dist/styles/base.css";
// Layouts
import DataSpinner from "./components/layouts/DataSpinner";
// Navigation
import { AppRoutes } from "./navigation/AppRoutes";
// RPC client
import { authApi, useUserMetadataQuery } from "./services/rpcAuth";
import { useGetAhdapaAuthInfoQuery } from "./services/rpcAhdapa";
// OIDC
import { completeOidcLogin, getOidcCallbackParams } from "./utils/oidcUtils";
// Alerts
import ManagedAlerts from "./components/ManagedAlerts";
// Redux
import { useAppDispatch } from "./store/hooks";

const App: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const { isFetching } = useUserMetadataQuery();

  // Check for OIDC callback params before first render
  const [oidcCallback] = React.useState(() => getOidcCallbackParams());
  const [oidcDone, setOidcDone] = React.useState(!oidcCallback);
  const oidcHandled = React.useRef(false);

  // Probe ahdapa availability (non-blocking — if it fails, ahdapa nav is hidden)
  useGetAhdapaAuthInfoQuery();

  // Handle OIDC callback: if URL contains code + state, exchange for session.
  // The ref guard prevents StrictMode from running the exchange twice (the
  // second call would find no PKCE verifier in sessionStorage and fail).
  React.useEffect(() => {
    if (!oidcCallback || oidcHandled.current) return;
    oidcHandled.current = true;

    // Clean the URL before processing
    const cleanUrl = window.location.pathname + window.location.hash;
    window.history.replaceState(null, "", cleanUrl);

    completeOidcLogin(oidcCallback.code, oidcCallback.state)
      .then((result) => {
        if (result !== "success") {
          sessionStorage.setItem("oidc_login_error", result);
          return;
        }
        return dispatch(
          authApi.endpoints.userMetadata.initiate(undefined, {
            forceRefetch: true,
            subscribe: false,
          })
        )
          .unwrap()
          .catch(() => {
            sessionStorage.setItem("oidc_login_error", "session-failed");
          });
      })
      .finally(() => {
        setOidcDone(true);
      });
  }, []);

  if (isFetching || !oidcDone) {
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
