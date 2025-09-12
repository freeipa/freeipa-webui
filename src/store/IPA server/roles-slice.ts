import { createSlice } from "@reduxjs/toolkit";
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

export default rolesSlice.reducer;
