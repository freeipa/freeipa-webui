import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import globalReducer from "./Global/global-slice";
import { api } from "../services/rpc";
import routesReducer from "./Global/routes-slice";
import authReducer from "./Global/auth-slice";
import alertsReducer from "./Global/alerts-slice";

export const setupStore = () => {
  const store = configureStore({
    reducer: {
      api: api.reducer,
      global: globalReducer,
      routes: routesReducer,
      auth: authReducer,
      alerts: alertsReducer,
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Removes the warning about non-serializable data
      }).concat(api.middleware),
  });

  // optional, but required for refetchOnFocus/refetchOnReconnect behaviors
  // see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
  setupListeners(store.dispatch);
  return store;
};

const store = setupStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
