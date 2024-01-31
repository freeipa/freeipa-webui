import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
// Data type
import { UserGroupNew } from "src/utils/datatypes/globalDataTypes";

interface UserGroupState {
  userGroupList: UserGroupNew[];
}

const initialState: UserGroupState = {
  userGroupList: [],
};

const userGroupsSlice = createSlice({
  name: "usergroups",
  initialState,
  reducers: {},
});

export const selectUserGroups = (state: RootState) =>
  state.usergroups.userGroupList;
export default userGroupsSlice.reducer;
