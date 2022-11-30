import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "src/store/store";
// User data (JSON file)
import stageUsersJson from "./stageUsers.json";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";

interface StageUsersState {
  usersList: User[];
}

interface ChangeStatusData {
  newStatus: string;
  selectedUsers: string[];
}

const initialState: StageUsersState = {
  usersList: stageUsersJson,
};

const stageUsersSlice = createSlice({
  name: "stageUsers",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      const newUser = action.payload;
      state.usersList.push({
        userId: newUser.userId,
        userLogin: newUser.userLogin,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        status: newUser.status,
        uid: newUser.uid,
        emailAddress: newUser.emailAddress,
        phone: newUser.phone,
        jobTitle: newUser.jobTitle,
      });
      // Update json file
    },
    removeUser: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      const updatedUserList = state.usersList.filter(
        (user) => user.userId !== userId
      );
      // If not empty, replace userList by new array
      if (updatedUserList) {
        state.usersList = updatedUserList;
        // Update json file
      }
    },
    changeStatus: (state, action: PayloadAction<ChangeStatusData>) => {
      const newStatus =
        action.payload.newStatus.charAt(0).toUpperCase() +
        action.payload.newStatus.slice(1) +
        "d";
      const selectedUsersIds = action.payload.selectedUsers;
      let selectedUsersCount = selectedUsersIds.length;

      // Retrieve users
      for (let i = 0; i < selectedUsersIds.length; i++) {
        for (let j = 0; j < state.usersList.length; j++) {
          if (selectedUsersCount > 0) {
            // Find User by userId
            if (selectedUsersIds[i] === state.usersList[j].userId) {
              // Update the status only
              const updatedUser = {
                userId: state.usersList[j].userId,
                userLogin: state.usersList[j].userLogin,
                firstName: state.usersList[j].firstName,
                lastName: state.usersList[j].lastName,
                status: newStatus,
                uid: state.usersList[j].uid,
                emailAddress: state.usersList[j].emailAddress,
                phone: state.usersList[j].phone,
                jobTitle: state.usersList[j].jobTitle,
              };
              // Replace entry
              state.usersList[j] = updatedUser;
              selectedUsersCount--;
            }
          } else {
            // When all ocurrences in selectedUsers array are found, nothing else to search
            break;
          }
        }
      }
    },
  },
});

export const { addUser, removeUser, changeStatus } = stageUsersSlice.actions;
export const selectUsers = (state: RootState) =>
  state.stageUsers.usersList as User[];
export default stageUsersSlice.reducer;
