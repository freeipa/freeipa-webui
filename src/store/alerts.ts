import React from "react";

type AlertVariant = "custom" | "danger" | "warning" | "success" | "info";

export interface AlertInfo {
  name: string;
  title: React.ReactNode;
  variant: AlertVariant;
}

import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";

const alertsSlice = createSlice({
  name: "alerts",
  initialState: [] as AlertInfo[],
  reducers: {
    addAlertInternal: (
      state: AlertInfo[],
      action: PayloadAction<AlertInfo>
    ) => {
      state.push(action.payload);
    },
    removeAlert: (
      state: AlertInfo[],
      action: PayloadAction<{ name: string }>
    ) => {
      state.splice(
        state.findIndex((alert) => alert.name === action.payload.name),
        1
      );
    },
    removeAllAlerts: (state: AlertInfo[]) => {
      state.length = 0;
    },
  },
});

const alertsStore = configureStore({ reducer: alertsSlice.reducer });
export const { removeAlert, removeAllAlerts } = alertsSlice.actions;

export const addAlert = (
  name: string,
  title: React.ReactNode,
  variant: AlertVariant
) => {
  alertsStore.dispatch(
    alertsSlice.actions.addAlertInternal({ name, title, variant })
  );
};

export default alertsStore;
