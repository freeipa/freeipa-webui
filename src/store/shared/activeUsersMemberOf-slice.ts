import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// Data types
import {
  UserGroup,
  Netgroup,
  Roles,
  HBACRules,
  SudoRules,
} from "src/utils/datatypes/globalDataTypes";
// Repository initial data
import {
  userGroupsInitialData,
  netgroupsInitialData,
  rolesInitialData,
  hbacRulesInitialData,
  sudoRulesInitialData,
} from "src/utils/data/GroupRepositories";

/*
 * This redux slice is intended for shared variables (in the 'Active
 * users' > 'Member of' section) that are being used by different
 * components throughout the webui app. Instead of passing the state
 * variables via props to the components, this is done via redux to
 * reduce the amount of variables passed by the component structure
 * and make them more lightweight.
 */

/*
 * - userGroupsRepository (UserGroup[])
 *    List of user groups.
 * - netgroupsRepository (Netgroup[])
 *    List of netgroups.
 * - rolesRepository (Roles[])
 *    List of roles.
 * - hbacRulesRepository (HBACRules[])
 *    List of HBAC rules.
 * - sudoRulesRepository (SudoRules[])
 *    List of sudo rules.
 * - showAddModal (boolean)
 *    Flag to show/hide the 'Add' modal.
 * - showDeleteModal (boolean)
 *    Flag to show/hide the 'Delete' modal.
 * - tabName (string)
 *    Name of the actual tab. This will be displayed in the modals.
 * - isDeleteButtonDisabled (boolean)
 *    'Delete' button state. This button is enabled only when an
 *     element on the table has been selected.
 * - isDeletion (boolean)
 *    If some entries have been deleted, restore the 'groupsNamesSelected' list.
 * - page (number)
 *    Actual page (pagination).
 * - perPage (number)
 *    Elements to show per page (pagination).
 * - activeTabKey (number)
 *    Number of the active tab key:
 *      0: User groups
 *      1: Netgroups
 *      2: Roles
 *      3: HBAC rules
 *      4: Sudo rules
 */

interface ActiveUsersMemberOfSharedState {
  userGroupsRepository: UserGroup[];
  netgroupsRepository: Netgroup[];
  rolesRepository: Roles[];
  hbacRulesRepository: HBACRules[];
  sudoRulesRepository: SudoRules[];
  showAddModal: boolean;
  showDeleteModal: boolean;
  tabName: string;
  isDeleteButtonDisabled: boolean;
  groupsNamesSelected: string[];
  isDeletion: boolean;
  page: number;
  perPage: number;
  activeTabKey: number;
}

const initialState: ActiveUsersMemberOfSharedState = {
  userGroupsRepository: userGroupsInitialData,
  netgroupsRepository: netgroupsInitialData,
  rolesRepository: rolesInitialData,
  hbacRulesRepository: hbacRulesInitialData,
  sudoRulesRepository: sudoRulesInitialData,
  showAddModal: false,
  showDeleteModal: false,
  tabName: "user groups",
  isDeleteButtonDisabled: true,
  groupsNamesSelected: [],
  isDeletion: false,
  page: 1,
  perPage: 10,
  activeTabKey: 0,
};

const activeUsersMemberOfSharedSlice = createSlice({
  name: "activeUsersMemberOfShared",
  initialState,
  reducers: {
    setUserGroupsRepository: (state, action: PayloadAction<UserGroup[]>) => {
      state.userGroupsRepository = action.payload;
    },
    setNetgroupsRepository: (state, action: PayloadAction<Netgroup[]>) => {
      state.netgroupsRepository = action.payload;
    },
    setRolesRepository: (state, action: PayloadAction<Roles[]>) => {
      state.rolesRepository = action.payload;
    },
    setHbacRulesRepository: (state, action: PayloadAction<HBACRules[]>) => {
      state.hbacRulesRepository = action.payload;
    },
    setSudoRulesRepository: (state, action: PayloadAction<SudoRules[]>) => {
      state.sudoRulesRepository = action.payload;
    },
    setShowAddModal: (state, action: PayloadAction<boolean>) => {
      state.showAddModal = action.payload;
    },
    onClickAddHandler: (state) => {
      state.showAddModal = true;
    },
    setShowDeleteModal: (state, action: PayloadAction<boolean>) => {
      state.showDeleteModal = action.payload;
    },
    onClickDeleteHandler: (state) => {
      state.showDeleteModal = true;
    },
    setTabName: (state, action: PayloadAction<string>) => {
      state.tabName = action.payload;
    },
    setIsDeleteButtonDisabled: (state, action: PayloadAction<boolean>) => {
      state.isDeleteButtonDisabled = action.payload;
    },
    setGroupsNamesSelected: (state, action: PayloadAction<string[]>) => {
      state.groupsNamesSelected = action.payload;
    },
    setIsDeletion: (state, action: PayloadAction<boolean>) => {
      state.isDeletion = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPerPage: (state, action: PayloadAction<number>) => {
      state.perPage = action.payload;
    },
    setActiveTabKey: (state, action: PayloadAction<number>) => {
      state.activeTabKey = action.payload;
    },
  },
});

export const {
  setUserGroupsRepository,
  setNetgroupsRepository,
  setRolesRepository,
  setHbacRulesRepository,
  setSudoRulesRepository,
  setShowAddModal,
  onClickAddHandler,
  setShowDeleteModal,
  onClickDeleteHandler,
  setTabName,
  setIsDeleteButtonDisabled,
  setGroupsNamesSelected,
  setIsDeletion,
  setPage,
  setPerPage,
  setActiveTabKey,
} = activeUsersMemberOfSharedSlice.actions;
export default activeUsersMemberOfSharedSlice.reducer;
