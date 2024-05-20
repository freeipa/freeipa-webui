import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import hostGroupsJson from "./hostGroups.json";
// Data type
import { HostGroupOld } from "src/utils/datatypes/globalDataTypes";

interface HostGroupState {
  hostGroupsList: HostGroupOld[];
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
