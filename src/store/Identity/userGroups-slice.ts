import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Data type
import { UserGroup } from "src/utils/datatypes/globalDataTypes";

interface UserGroupState {
  userGroupList: UserGroup[];
}

const initialState: UserGroupState = {
  userGroupList: [],
};

const userGroupsSlice = createSlice({
  name: "usergroups",
  initialState,
  reducers: {
    updateGroupsList: (state, action: PayloadAction<UserGroup[]>) => {
      const updatedServicesList = action.payload;
      state.userGroupList = updatedServicesList;
    },
    addGroup: (state, action: PayloadAction<UserGroup>) => {
      const newService = action.payload;
      state.userGroupList.push({ ...newService });
    },
    removeGroup: (state, action: PayloadAction<string>) => {
      const groupId = action.payload;
      const updatedGroupList = state.userGroupList.filter(
        (group) => group.cn !== groupId
      );
      // If not empty, replace list by new array
      if (updatedGroupList) {
        state.userGroupList = updatedGroupList;
      }
    },
  },
});

export default userGroupsSlice.reducer;
export const { updateGroupsList, addGroup, removeGroup } =
  userGroupsSlice.actions;
