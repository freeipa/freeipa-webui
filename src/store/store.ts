import { configureStore, combineReducers } from "@reduxjs/toolkit";
import type { Reducer } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import globalReducer from "./Global/global-slice";
import { api } from "../services/rpc";
import routesReducer from "./Global/routes-slice";
import authReducer from "./Global/auth-slice";
import alertsReducer from "./Global/alerts-slice";

const staticReducers = {
  api: api.reducer,
  global: globalReducer,
  routes: routesReducer,
  auth: authReducer,
  alerts: alertsReducer,
};

const pluginReducers: Record<string, Reducer> = {};

function createRootReducer() {
  return combineReducers({
    ...staticReducers,
    ...pluginReducers,
  });
}

export const setupStore = () => {
  const store = configureStore({
    reducer: createRootReducer(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(api.middleware),
  });

  setupListeners(store.dispatch);
  return store;
};

const store = setupStore();

/** Called by the plugin registry to inject a new reducer at runtime. */
export function injectPluginReducer(key: string, reducer: Reducer): void {
  if (pluginReducers[key]) {
    return;
  }
  pluginReducers[key] = reducer;
  store.replaceReducer(createRootReducer());
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
