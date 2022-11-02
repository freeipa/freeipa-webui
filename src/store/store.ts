import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./Identity/users-slice";
import sharedReducer from "./shared/shared-slice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    shared: sharedReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
