import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Data type
import { HostGroup } from "src/utils/datatypes/globalDataTypes";

interface HostGroupState {
  userGroupList: HostGroup[];
}

const initialState: HostGroupState = {
  userGroupList: [],
};

const hostGroupsSlice = createSlice({
  name: "hostgroups",
  initialState,
  reducers: {
    updateGroupsList: (state, action: PayloadAction<HostGroup[]>) => {
      const updatedServicesList = action.payload;
      state.userGroupList = updatedServicesList;
    },
    addGroup: (state, action: PayloadAction<HostGroup>) => {
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

export default hostGroupsSlice.reducer;
export const { updateGroupsList, addGroup, removeGroup } =
  hostGroupsSlice.actions;
