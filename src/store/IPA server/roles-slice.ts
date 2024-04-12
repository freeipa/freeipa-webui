import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import rolesJson from "./roles.json";
// Data type
import { RolesOld } from "src/utils/datatypes/globalDataTypes";

interface RoleState {
  roleList: RolesOld[];
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
