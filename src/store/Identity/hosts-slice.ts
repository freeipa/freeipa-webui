import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
// Data types
import { Host } from "../../utils/datatypes/globalDataTypes";

interface HostsState {
  hostsList: Host[];
}

const initialState: HostsState = {
  hostsList: [],
};

const hostsSlice = createSlice({
  name: "hosts",
  initialState,
  reducers: {
    updateHostsList: (state, action: PayloadAction<Host[]>) => {
      const updatedHostsList = action.payload;
      state.hostsList = updatedHostsList;
    },
    addHost: (state, action: PayloadAction<Host>) => {
      const newHost = action.payload;
      state.hostsList.push({ ...newHost });
    },
    removeHost: (state, action: PayloadAction<string>) => {
      const hostId = action.payload;
      const updatedHostList = state.hostsList.filter(
        (host) => host.fqdn !== hostId
      );
      // If not empty, replace hostsList by new array
      if (updatedHostList) {
        state.hostsList = updatedHostList;
      }
    },
  },
});

export const { updateHostsList, addHost, removeHost } = hostsSlice.actions;
export const selectHosts = (state: RootState) =>
  state.hosts.hostsList as Host[];
export default hostsSlice.reducer;
