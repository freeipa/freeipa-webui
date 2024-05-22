import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Data type
import { Netgroup } from "src/utils/datatypes/globalDataTypes";

interface NetgroupState {
  netgroupList: Netgroup[];
}

const initialState: NetgroupState = {
  netgroupList: [],
};

const netgroupsSlice = createSlice({
  name: "netgroups",
  initialState,
  reducers: {
    updateNetgroupsList: (state, action: PayloadAction<Netgroup[]>) => {
      const updatedGroupList = action.payload;
      state.netgroupList = updatedGroupList;
    },
    addNetgroup: (state, action: PayloadAction<Netgroup>) => {
      const newGroup = action.payload;
      state.netgroupList.push({ ...newGroup });
    },
    removeNetgroup: (state, action: PayloadAction<string>) => {
      const groupId = action.payload;
      const updatedGroupList = state.netgroupList.filter(
        (group) => group.cn !== groupId
      );
      // If not empty, replace list by new array
      if (updatedGroupList) {
        state.netgroupList = updatedGroupList;
      }
    },
  },
});

export default netgroupsSlice.reducer;
export const { updateNetgroupsList, addNetgroup, removeNetgroup } =
  netgroupsSlice.actions;
