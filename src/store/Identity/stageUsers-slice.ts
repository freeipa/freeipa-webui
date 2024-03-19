import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "src/store/store";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";

interface StageUsersState {
  usersList: User[];
}

interface ChangeStatusData {
  newStatus: boolean;
  selectedUsers: User[];
}

const initialState: StageUsersState = {
  usersList: [],
};

const stageUsersSlice = createSlice({
  name: "stageUsers",
  initialState,
  reducers: {
    updateUsersList: (state, action: PayloadAction<User[]>) => {
      const updatedUserList = action.payload;
      state.usersList = updatedUserList;
    },
    addUser: (state, action: PayloadAction<User>) => {
      const newUser = action.payload;
      state.usersList.push({ ...newUser });
    },
    removeUser: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      const updatedUserList = state.usersList.filter(
        (user) => user.uid !== userId
      );
      // If not empty, replace userList by new array
      if (updatedUserList) {
        state.usersList = updatedUserList;
      }
    },
    changeStatus: (state, action: PayloadAction<ChangeStatusData>) => {
      const newStatus = action.payload.newStatus;
      const selectedUsers = action.payload.selectedUsers;

      // Convert selectedUsersIds to Map for easier search
      const selectedUsersIdMap = new Map<string, boolean>();
      for (let i = 0; i < selectedUsers.length; i++) {
        selectedUsersIdMap.set(selectedUsers[i].uid[0], true);
      }

      // Update nsaccountlock of selected users
      for (let i = 0; i < state.usersList.length; i++) {
        const user = state.usersList[i];
        const isSelected = selectedUsersIdMap.get(user.uid[i]);
        if (isSelected) {
          const copiedUser = { ...user, nsaccountlock: newStatus };
          state.usersList[i] = copiedUser;
        }
      }
    },
  },
});

export const { updateUsersList, addUser, removeUser, changeStatus } =
  stageUsersSlice.actions;
export const selectUsers = (state: RootState) =>
  state.stageUsers.usersList as User[];
export default stageUsersSlice.reducer;
