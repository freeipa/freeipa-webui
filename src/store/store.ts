import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import globalReducer from "./Global/global-slice";
import { api } from "../services/rpc";
import { ahdapaApi } from "../services/rpcAhdapa";
import ahdapaReducer from "./Ahdapa/ahdapa-slice";
import routesReducer from "./Global/routes-slice";
import alertsReducer from "./Global/alerts-slice";
import contextualHelpReducer from "./Global/contextual-help-slice";

export const setupStore = () => {
  const store = configureStore({
    reducer: {
      api: api.reducer,
      [ahdapaApi.reducerPath]: ahdapaApi.reducer,
      global: globalReducer,
      ahdapa: ahdapaReducer,
      routes: routesReducer,
      alerts: alertsReducer,
      contextualHelp: contextualHelpReducer,
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Removes the warning about non-serializable data
      })
        .concat(api.middleware)
        .concat(ahdapaApi.middleware),
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
