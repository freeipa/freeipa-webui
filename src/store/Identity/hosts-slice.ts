import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "src/store/store";
// Hosts data (JSON file)
import hostsJson from "./hosts.json";
// Data types
import { Host } from "src/utils/datatypes/globalDataTypes";

interface HostsState {
  hostsList: Host[];
}

const initialState: HostsState = {
  hostsList: hostsJson,
};

const hostsSlice = createSlice({
  name: "hosts",
  initialState,
  reducers: {
    addHost: (state, action: PayloadAction<Host>) => {
      const newHost = action.payload;
      state.hostsList.push({
        id: newHost.id,
        hostName: newHost.hostName,
        dnsZone: newHost.dnsZone,
        class: newHost.class,
        ipAddress: newHost.ipAddress,
        description: newHost.description,
        enrolled: newHost.enrolled,
      });
      // Update json file
    },
    removeHost: (state, action: PayloadAction<string>) => {
      const hostId = action.payload;
      const updatedHostList = state.hostsList.filter(
        (host) => host.id !== hostId
      );
      // If not empty, replace hostsList by new array
      if (updatedHostList) {
        state.hostsList = updatedHostList;
        // Update json file
      }
    },
  },
});

export const { addHost, removeHost } = hostsSlice.actions;
export const selectHosts = (state: RootState) =>
  state.hosts.hostsList as Host[];
export default hostsSlice.reducer;
