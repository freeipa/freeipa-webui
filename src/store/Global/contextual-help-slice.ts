import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface ContextualHelpState {
  isExpanded: boolean;
  fromPage: string;
}

const initialState: ContextualHelpState = {
  isExpanded: false,
  fromPage: "",
};

const contextualHelpSlice = createSlice({
  name: "contextualHelp",
  initialState,
  reducers: {
    setHelpTopic: (state, action: PayloadAction<string>) => {
      state.fromPage = action.payload;
    },
    toggleHelpPanel: (state) => {
      state.isExpanded = !state.isExpanded;
    },
    closeHelpPanel: (state) => {
      state.isExpanded = false;
    },
  },
});

// Actions
export const { setHelpTopic, toggleHelpPanel, closeHelpPanel } =
  contextualHelpSlice.actions;

// Selectors
export const selectHelpPanelExpanded = (state: RootState) =>
  state.contextualHelp.isExpanded;

export const selectHelpTopic = (state: RootState) =>
  state.contextualHelp.fromPage;

export default contextualHelpSlice.reducer;
