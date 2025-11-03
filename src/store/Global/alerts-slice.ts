import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AlertProps } from "@patternfly/react-core";

export interface AlertInfo {
  name: string;
  title: React.ReactNode;
  variant: AlertProps["variant"];
}

const alertsSlice = createSlice({
  name: "alerts",
  initialState: [] as AlertInfo[],
  reducers: {
    addAlert: (state, action: PayloadAction<AlertInfo>) => {
      state.push(action.payload);
    },
    removeAlert: (state, action: PayloadAction<{ name: string }>) => {
      const index = state.findIndex(
        (alert) => alert.name === action.payload.name
      );

      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    removeAllAlerts: (state) => {
      state.length = 0;
    },
  },
});

export const { addAlert, removeAlert, removeAllAlerts } = alertsSlice.actions;

export default alertsSlice.reducer;
