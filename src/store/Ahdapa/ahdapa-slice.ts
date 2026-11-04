import { createSlice } from "@reduxjs/toolkit";
import { ahdapaApi } from "src/services/rpcAhdapa";

interface AhdapaState {
  /** Whether ahdapa was detected (probe succeeded) */
  available: boolean;
  /** Whether ahdapa detection has been attempted */
  probed: boolean;
  /** Ahdapa realm name */
  realm: string;
  /** Display name from ahdapa config */
  displayName: string;
  /** Whether GSSAPI/Kerberos is enabled */
  gssapiEnabled: boolean;
  /** Current user's ahdapa permissions */
  permissions: string[];
}

const initialState: AhdapaState = {
  available: false,
  probed: false,
  realm: "",
  displayName: "",
  gssapiEnabled: false,
  permissions: [],
};

const ahdapaSlice = createSlice({
  name: "ahdapa",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        ahdapaApi.endpoints.getAhdapaAuthInfo.matchFulfilled,
        (state, action) => {
          state.available = true;
          state.probed = true;
          state.realm = action.payload.realm || "";
          state.displayName = action.payload.display_name || "";
          state.gssapiEnabled = action.payload.gssapi || false;
        }
      )
      .addMatcher(
        ahdapaApi.endpoints.getAhdapaAuthInfo.matchRejected,
        (state) => {
          state.available = false;
          state.probed = true;
        }
      )
      .addMatcher(
        ahdapaApi.endpoints.getAhdapaProfile.matchFulfilled,
        (state, action) => {
          state.permissions = action.payload.permissions || [];
        }
      );
  },
});

export default ahdapaSlice.reducer;
