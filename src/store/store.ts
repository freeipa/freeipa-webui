import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./Identity/users-slice";
import activeUsersSharedReducer from "./shared/activeUsersShared-slice";
import netgroupsReducer from "./Identity/netgroups-slice";
import userGroupsReducer from "./Identity/userGroups-slice";
import rolesReducer from "./IPA server/roles-slice";
import hbacRulesReducer from "./Policy/hbacRules-slice";
import sudoRulesReducer from "./Policy/sudoRules-slice";
import activeUsersMemberOfSharedReducer from "./shared/activeUsersMemberOf-slice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    activeUsersShared: activeUsersSharedReducer,
    netgroups: netgroupsReducer,
    usergroups: userGroupsReducer,
    roles: rolesReducer,
    hbacrules: hbacRulesReducer,
    sudorules: sudoRulesReducer,
    activeUsersMemberOfShared: activeUsersMemberOfSharedReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
