import { createSlice } from "@reduxjs/toolkit";
import { authApi, UserMetadata } from "src/services/rpcAuth";

const initialState: UserMetadata = {
  ipaServerConfiguration: {},
  loggedInUser: "",
  environment: {},
  dnsIsEnabled: false,
  trustConfiguration: {},
  domainLevel: 0,
  caIsEnabled: false,
  vaultConfiguration: {},
  metadata: { objects: {}, methods: {}, commands: {} },
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    // We need logout reducer, whoami together with Kerberos will always report a user thus being unable to logout
    logoutUser: (state) => {
      state.loggedInUser = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.userMetadata.matchFulfilled,
        (state, action) => {
          Object.assign(state, action.payload);
        }
      )
      .addMatcher(authApi.endpoints.userMetadata.matchRejected, (state) => {
        state.loggedInUser = "";
      });
  },
});

export const { logoutUser } = globalSlice.actions;
export default globalSlice.reducer;
