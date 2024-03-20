import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import netgroupsJson from "./netgroups.json";
// Data type
import { NetgroupOld } from "src/utils/datatypes/globalDataTypes";

interface NetgroupState {
  netgroupList: NetgroupOld[];
}

const initialState: NetgroupState = {
  netgroupList: netgroupsJson,
};

const netgroupsSlice = createSlice({
  name: "netgroups",
  initialState,
  reducers: {},
});

export const selectNetgroups = (state: RootState) =>
  state.netgroups.netgroupList;
export default netgroupsSlice.reducer;
