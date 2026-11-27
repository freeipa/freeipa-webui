import React from "react";
// PatternFly
import "@patternfly/react-core/dist/styles/base.css";
// Layouts
import DataSpinner from "./components/layouts/DataSpinner";
// Navigation
import { AppRoutes } from "./navigation/AppRoutes";
// RPC client
import {
  MetaResponse,
  useOidcLoginMutation,
  useUserMetadataQuery,
} from "./services/rpcAuth";
import { useGetAhdapaAuthInfoQuery } from "./services/rpcAhdapa";
// OIDC
import {
  getOidcCallbackParams,
  getOidcRedirectUri,
  takeOidcCodeVerifier,
} from "./utils/oidcUtils";
// Alerts
import ManagedAlerts from "./components/ManagedAlerts";

const App: React.FunctionComponent = () => {
  const { isFetching, refetch } = useUserMetadataQuery();
  const [oidcLogin] = useOidcLoginMutation();

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

    (async () => {
      const pkce = takeOidcCodeVerifier(oidcCallback.state);
      if ("error" in pkce) {
        sessionStorage.setItem("oidc_login_error", pkce.error);
        return;
      }

      const result = await oidcLogin({
        code: oidcCallback.code,
        codeVerifier: pkce.verifier,
        redirectUri: getOidcRedirectUri(),
      });
      if ("error" in result) {
        const { response } = result.error as MetaResponse;
        sessionStorage.setItem(
          "oidc_login_error",
          response
            ? (response.headers.get("X-IPA-Rejection-Reason") ?? "failed")
            : "network-error"
        );
        return;
      }

      const { error } = await refetch();
      if (error) {
        sessionStorage.setItem("oidc_login_error", "session-failed");
      }
    })().finally(() => setOidcDone(true));
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
