import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import globalReducer from "./Global/global-slice";
import activeUsersReducer from "./Identity/activeUsers-slice";
import netgroupsReducer from "./Identity/netgroups-slice";
import userGroupsReducer from "./Identity/userGroups-slice";
import rolesReducer from "./IPA server/roles-slice";
import hbacRulesReducer from "./Policy/hbacRules-slice";
import sudoRulesReducer from "./Policy/sudoRules-slice";
import stageUsersReducer from "./Identity/stageUsers-slice";
import preservedUsersReducer from "./Identity/preservedUsers-slice";
import hostsReducer from "./Identity/hosts-slice";
import hostGroupsReducer from "./Identity/hostGroups-slice";
import servicesReducer from "./Identity/services-slice";
import { api } from "../services/rpc";

const store = configureStore({
  reducer: {
    api: api.reducer,
    global: globalReducer,
    activeUsers: activeUsersReducer,
    netgroups: netgroupsReducer,
    usergroups: userGroupsReducer,
    roles: rolesReducer,
    hbacrules: hbacRulesReducer,
    sudorules: sudoRulesReducer,
    stageUsers: stageUsersReducer,
    preservedUsers: preservedUsersReducer,
    hosts: hostsReducer,
    hostGroups: hostGroupsReducer,
    services: servicesReducer,
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
