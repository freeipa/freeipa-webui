import { configureStore } from "@reduxjs/toolkit";
import activeUsersReducer from "./Identity/activeUsers-slice";
import netgroupsReducer from "./Identity/netgroups-slice";
import userGroupsReducer from "./Identity/userGroups-slice";
import rolesReducer from "./IPA server/roles-slice";
import hbacRulesReducer from "./Policy/hbacRules-slice";
import sudoRulesReducer from "./Policy/sudoRules-slice";
import stageUsersReducer from "./Identity/stageUsers-slice";

const store = configureStore({
  reducer: {
    activeUsers: activeUsersReducer,
    netgroups: netgroupsReducer,
    usergroups: userGroupsReducer,
    roles: rolesReducer,
    hbacrules: hbacRulesReducer,
    sudorules: sudoRulesReducer,
    stageUsers: stageUsersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
