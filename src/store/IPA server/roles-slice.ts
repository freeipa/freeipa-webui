import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import rolesJson from "./roles.json";
// Data type
import { Roles } from "src/utils/datatypes/globalDataTypes";

interface RoleState {
  roleList: Roles[];
}

const initialState: RoleState = {
  roleList: rolesJson,
};

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {},
});

export const selectNetgroups = (state: RootState) => state.roles.roleList;
export default rolesSlice.reducer;
