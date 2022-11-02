import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./Identity/users-slice";
import sharedReducer from "./shared/shared-slice";
// import userGroupsReducer from "./Identity/userGroups-slice";
// import netgroupsReducer from "./Identity/netgroups-slice";
// import rolesReducer from "./IPA server/roles-slice";
// import hbacRulesReducer from "./Policy/hbacRules-slice";
// import sudoRulesReducer from "./Policy/sudoRules-slice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    shared: sharedReducer,
    // usergroups: userGroupsReducer,
    // netgroups: netgroupsReducer,
    // roles: rolesReducer,
    // hbacrules: hbacRulesReducer,
    // sudorules: sudoRulesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
