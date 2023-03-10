import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  // TODO: Specify data types
  ipaServerConfiguration: Record<string, unknown>,
  loggedUserInfo: Record<string, unknown>,
  environment: Record<string, unknown>,
  dnsIsEnabled: Record<string, unknown>,
  trustConfiguration: Record<string, unknown>,
  domainLevel: Record<string, unknown>,
  caIsEnabled: Record<string, unknown>,
  vaultConfiguration: Record<string, unknown>,
}

const initialState: GlobalState = {
  ipaServerConfiguration: {},
  loggedUserInfo: {},
  environment: {},
  dnsIsEnabled: {},
  trustConfiguration: {},
  domainLevel: {},
  caIsEnabled: {},
  vaultConfiguration: {},
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    updateIpaServerConfiguration: (state, action: PayloadAction<Record<string, unknown>>) => {
      const newIpaServerConfig = action.payload;
      state.ipaServerConfiguration = newIpaServerConfig;
    },
    updateLoggedUserInfo: (state, action: PayloadAction<Record<string, unknown>>) => {
      const newLoggedUserInfo = action.payload;
      state.loggedUserInfo = newLoggedUserInfo;
    },
    updateEnvironment: (state, action: PayloadAction<Record<string, unknown>>) => {
      const newEnv = action.payload;
      state.environment = newEnv;
    },
    updateDnsIsEnabled: (state, action: PayloadAction<Record<string, unknown>>) => {
      const newDnsIsEnabled = action.payload;
      state.dnsIsEnabled = newDnsIsEnabled;
    },
    updateTrustConfiguration: (state, action: PayloadAction<Record<string, unknown>>) => {
      const newTrustConfig = action.payload;
      state.trustConfiguration = newTrustConfig;
    },
    updateDomainLevel: (state, action: PayloadAction<Record<string, unknown>>) => {
      const newDomainLevel = action.payload;
      state.domainLevel = newDomainLevel;
    },
    updateCaIsEnabled: (state, action: PayloadAction<Record<string, unknown>>) => {
      const newCaIsEnabled = action.payload;
      state.caIsEnabled = newCaIsEnabled;
    },
    updateVaultConfiguration: (state, action: PayloadAction<Record<string, unknown>>) => {
      const newVaultConfig = action.payload;
      state.vaultConfiguration = newVaultConfig;
    },
  },
});

export const {
  updateIpaServerConfiguration,
  updateLoggedUserInfo,
  updateEnvironment,
  updateDnsIsEnabled,
  updateTrustConfiguration,
  updateDomainLevel,
  updateCaIsEnabled,
  updateVaultConfiguration
  } = globalSlice.actions;
export default globalSlice.reducer;
