import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import hostGroupsJson from "./hostGroups.json";
// Data type
import { HostGroup } from "src/utils/datatypes/globalDataTypes";

interface HostGroupState {
  hostGroupsList: HostGroup[];
}

const initialState: HostGroupState = {
  hostGroupsList: hostGroupsJson,
};

const hostGroupsSlice = createSlice({
  name: "hostgroups",
  initialState,
  reducers: {},
});

export const selectHostGroups = (state: RootState) =>
  state.hostGroups.hostGroupsList;
export default hostGroupsSlice.reducer;
