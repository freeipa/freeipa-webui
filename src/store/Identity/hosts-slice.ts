import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "src/store/store";
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
      state.hostsList.push({
        hostName: newHost.hostName,
        fqdn: newHost.fqdn,
        dnsZone: newHost.dnsZone,
        userclass: newHost.userclass,
        ip_address: newHost.ip_address,
        description: newHost.description,
        enrolledby: newHost.enrolledby,
        force: newHost.force,
        has_keytab: newHost.has_keytab,
        has_password: newHost.has_password,
        krbcanonicalname: newHost.krbcanonicalname,
        krbprincipalname: newHost.krbprincipalname,
        managedby_host: newHost.managedby_host,
        memberof_hostgroup: newHost.memberof_hostgroup,
        sshpubkeyfp: newHost.sshpubkeyfp,
        nshostlocation: newHost.nshostlocation,
        l: newHost.l,
        attributelevelrights: newHost.attributelevelrights,
        krbpwdpolicyreference: newHost.krbpwdpolicyreference,
        managing_host: newHost.managing_host,
        serverhostname: newHost.serverhostname,
        ipakrbrequirespreauth: newHost.ipakrbrequirespreauth,
        ipakrbokasdelegate: newHost.ipakrbokasdelegate,
        ipakrboktoauthasdelegate: newHost.ipakrboktoauthasdelegate,
      });
      // Update json file
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
