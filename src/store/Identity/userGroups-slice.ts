import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import userGroupsJson from "./userGroups.json";
// Data type
import { UserGroupOld } from "src/utils/datatypes/globalDataTypes";

interface UserGroupState {
  userGroupList: UserGroupOld[];
}

const initialState: UserGroupState = {
  userGroupList: userGroupsJson,
};

const userGroupsSlice = createSlice({
  name: "usergroups",
  initialState,
  reducers: {},
});

export const selectUserGroups = (state: RootState) =>
  state.usergroups.userGroupList;
export default userGroupsSlice.reducer;
