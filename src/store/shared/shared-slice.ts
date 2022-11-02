import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "src/store/store";

/*
 * This redux slice is intended for shared variables that are being
 * used by different components throughout the webui app. Instead of
 * passing the state variables via props to the components, this is
 * done via redux to reduce the amount of variables passed by the
 * component structure and make them more lightweight.
 */

/*
 * - selectedUsers (string[])
 *    List of selected users (via bulk selector or checkboxes on table) .
 * - isDeleteButtonDisabled (boolean)
 *    Enables / disables the 'Delete' button state.
 * - isEnableButtonDisabled (boolean)
 *    Enables / disables the 'Enable' button state.
 * - isDisableButtonDisabled (boolean)
 *    Disables / disables the 'Disable' button state.
 * - isDisableEnableOp (boolean)
 *    If some entries' status has been updated, unselect selected rows.
 * - selectedUserIds (string[])
 *    Selected user ids state.
 * - selectedPerPage (number)
 *    Elements selected (per page). This will help to calculate the
 *    remaining elements on a specific page (bulk selector).
 * - showTableRows (boolean)
 *    Flag to indicate if the tables rows should be shown.
 * - isDeletion (boolean)
 *    If some entries have been deleted, restore the 'selectedUsers' list.
 */

interface SharedState {
  selectedUsers: string[];
  isDeleteButtonDisabled: boolean;
  isEnableButtonDisabled: boolean;
  isDisableButtonDisabled: boolean;
  isDisableEnableOp: boolean;
  selectedUserIds: string[];
  selectedPerPage: number;
  showTableRows: boolean;
  isDeletion: boolean;
}

const initialState: SharedState = {
  selectedUsers: [],
  isDeleteButtonDisabled: true,
  isEnableButtonDisabled: true,
  isDisableButtonDisabled: true,
  isDisableEnableOp: false,
  selectedUserIds: [],
  selectedPerPage: 0,
  showTableRows: false,
  isDeletion: false,
};

const sharedSlice = createSlice({
  name: "shared",
  initialState,
  reducers: {
    setSelectedUsers: (state, action: PayloadAction<string[]>) => {
      state.selectedUsers = action.payload;
    },
    setIsDeleteButtonDisabled: (state, action: PayloadAction<boolean>) => {
      state.isDeleteButtonDisabled = action.payload;
    },
    setIsEnableButtonDisabled: (state, action: PayloadAction<boolean>) => {
      state.isEnableButtonDisabled = action.payload;
    },
    setIsDisableButtonDisabled: (state, action: PayloadAction<boolean>) => {
      state.isDisableButtonDisabled = action.payload;
    },
    setIsDisableEnableOp: (state, action: PayloadAction<boolean>) => {
      state.isDisableEnableOp = action.payload;
    },
    setSelectedUserIds: (state, action: PayloadAction<string[]>) => {
      state.selectedUserIds = action.payload;
    },
    setSelectedPerPage: (state, action: PayloadAction<number>) => {
      state.selectedPerPage = action.payload;
    },
    setShowTableRows: (state, action: PayloadAction<boolean>) => {
      state.showTableRows = action.payload;
    },
    setIsDeletion: (state, action: PayloadAction<boolean>) => {
      state.isDeletion = action.payload;
    },
  },
});

export const {
  setSelectedUsers,
  setIsDeleteButtonDisabled,
  setIsEnableButtonDisabled,
  setIsDisableButtonDisabled,
  setIsDisableEnableOp,
  setSelectedUserIds,
  setSelectedPerPage,
  setShowTableRows,
  setIsDeletion,
} = sharedSlice.actions;
export const selectSelectedUsers = (state: RootState) =>
  state.shared.selectedUsers;
export default sharedSlice.reducer;
