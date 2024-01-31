import React, { useEffect, useState } from "react";
import {
  TabTitleText,
  Page,
  PageSection,
  PageSectionVariants,
  Tab,
  Tabs,
  Badge,
  Pagination,
  PaginationVariant,
} from "@patternfly/react-core";
// Others
import MemberOfToolbar from "src/components/MemberOf/MemberOfToolbar";
import MemberOfToolbarNew from "src/components/MemberOf/MemberOfToolbarNew";
import MemberOfTable from "src/components/MemberOf/MemberOfTable";
import MemberOfTableNew from "src/components/MemberOf/MemberOfTableNew";
// Data types
import {
  Netgroup,
  Roles,
  HBACRules,
  SudoRules,
  User,
  UserGroupNew,
} from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppSelector } from "src/store/hooks";
// Repositories
import {
  netgroupsInitialData,
  rolesInitialData,
  hbacRulesInitialData,
  sudoRulesInitialData,
} from "src/utils/data/GroupRepositories";
// Modals
import MemberOfAddModal from "src/components/MemberOf/MemberOfAddModal";
import MemberOfDeleteModal from "src/components/MemberOf/MemberOfDeleteModal";
import { useGetUserByUidQuery } from "src/services/rpc";
import { useUserMemberOfData } from "src/hooks/useUserMemberOfData";

interface PropsToUserMemberOf {
  user: User;
}

const UserMemberOf = (props: PropsToUserMemberOf) => {
  // Retrieve each group list from Redux:
  let netgroupsList = useAppSelector((state) => state.netgroups.netgroupList);
  let rolesList = useAppSelector((state) => state.roles.roleList);
  let hbacRulesList = useAppSelector((state) => state.hbacrules.hbacRulesList);
  let sudoRulesList = useAppSelector((state) => state.sudorules.sudoRulesList);

  // Alter the available options list to keep the state of the recently added / removed items
  const updateNetgroupsList = (newAvOptionsList: unknown[]) => {
    netgroupsList = newAvOptionsList as Netgroup[];
  };
  const updateRolesList = (newAvOptionsList: unknown[]) => {
    rolesList = newAvOptionsList as Roles[];
  };
  const updateHbacRulesList = (newAvOptionsList: unknown[]) => {
    hbacRulesList = newAvOptionsList as HBACRules[];
  };
  const updateSudoRulesList = (newAvOptionsList: unknown[]) => {
    sudoRulesList = newAvOptionsList as SudoRules[];
  };

  // API call to get user's info
  const userQuery = useGetUserByUidQuery(props.user.uid[0]);

  const userData = userQuery.data || {};

  const [user, setUser] = React.useState<Partial<User>>({});

  // Member groups associated to user (string[] | UserGroupNew[])
  const [userGroupsFromUser, setUserGroupsFromUser] = React.useState<
    UserGroupNew[]
  >([]);

  React.useEffect(() => {
    if (!userQuery.isFetching && userData) {
      setUser({ ...userData });
    }
  }, [userData, userQuery.isFetching]);

  // API call to get full lists of Member data
  const { userGroupsFullList } = useUserMemberOfData();

  // Parse into UserGroupNew[] format by getting the full info from the available data
  React.useEffect(() => {
    const userGroupsParsed: UserGroupNew[] = [];
    user.memberof_group?.map((group) => {
      userGroupsFullList.map((g) => {
        if (g.cn === group) {
          userGroupsParsed.push(g);
        }
      });
    });
    setUserGroupsFromUser(userGroupsParsed);
  }, [user, userGroupsFullList]);

  // List of default dummy data (for the still-non-adapted tabs)
  // TODO: Remove this once all the tabs are adapted with the C.L.
  const [netgroupsRepository, setNetgroupsRepository] =
    useState(netgroupsInitialData);
  const [rolesRepository, setRolesRepository] = useState(rolesInitialData);
  const [hbacRulesRepository, setHbacRulesRepository] =
    useState(hbacRulesInitialData);
  const [sudoRulesRepository, setSudoRulesRepository] =
    useState(sudoRulesInitialData);

  // Filter (Input search)
  const [searchValue, setSearchValue] = React.useState("");

  const updateSearchValue = (value: string) => {
    setSearchValue(value);
  };

  // Filter functions to compare the available data with the data that
  //  the user is already member of. This is done to prevent duplicates
  //  (e.g: adding the same element twice).
  const filterNetgroupsData = () => {
    // Netgroups
    return netgroupsList.filter((item) => {
      return !netgroupsRepository.some((itm) => {
        return item.name === itm.name;
      });
    });
  };
  const filterRolesData = () => {
    // Roles
    return rolesList.filter((item) => {
      return !rolesRepository.some((itm) => {
        return item.name === itm.name;
      });
    });
  };
  const filterHbacRulesData = () => {
    // HBAC rules
    return hbacRulesList.filter((item) => {
      return !hbacRulesRepository.some((itm) => {
        return item.name === itm.name;
      });
    });
  };
  const filterSudoRulesData = () => {
    // Sudo rules
    return sudoRulesList.filter((item) => {
      return !sudoRulesRepository.some((itm) => {
        return item.name === itm.name;
      });
    });
  };

  // Available data to be added as member of
  const netgroupsFilteredData: Netgroup[] = filterNetgroupsData();
  const rolesFilteredData: Roles[] = filterRolesData();
  const hbacRulesFilteredData: HBACRules[] = filterHbacRulesData();
  const sudoRulesFilteredData: SudoRules[] = filterSudoRulesData();

  // Number of items on the list for each repository
  const [userGroupsRepoLength, setUserGroupsRepoLength] = useState(
    // userGroupsFullList.length
    userGroupsFromUser.length
  );
  const [netgroupsRepoLength, setNetgroupsRepoLength] = useState(
    netgroupsRepository.length
  );
  const [rolesRepoLength, setRolesRepoLength] = useState(
    rolesRepository.length
  );
  const [hbacRulesRepoLength, setHbacRulesRepoLength] = useState(
    hbacRulesRepository.length
  );
  const [sudoRulesRepoLength, setSudoRulesRepoLength] = useState(
    sudoRulesRepository.length
  );

  // Some data is updated when any group list is altered
  //  - The whole list itself
  //  - The slice of data to show (considering the pagination)
  //  - Number of items for a specific list
  const updateGroupRepository = (
    groupRepository:
      | UserGroupNew[]
      | Netgroup[]
      | Roles[]
      | HBACRules[]
      | SudoRules[]
  ) => {
    switch (tabName) {
      case "User groups":
        setUserGroupsFromUser(groupRepository as UserGroupNew[]);
        setShownUserGroupsList(userGroupsFromUser.slice(0, perPage));
        setUserGroupsRepoLength(userGroupsFromUser.length);
        break;
      case "Netgroups":
        setNetgroupsRepository(groupRepository as Netgroup[]);
        setShownNetgroupsList(netgroupsRepository.slice(0, perPage));
        setNetgroupsRepoLength(netgroupsRepository.length);
        break;
      case "Roles":
        setRolesRepository(groupRepository as Roles[]);
        setShownRolesList(rolesRepository.slice(0, perPage));
        setRolesRepoLength(rolesRepository.length);
        break;
      case "HBAC rules":
        setHbacRulesRepository(groupRepository as HBACRules[]);
        setShownHBACRulesList(hbacRulesRepository.slice(0, perPage));
        setHbacRulesRepoLength(hbacRulesRepository.length);
        break;
      case "Sudo rules":
        setSudoRulesRepository(groupRepository as SudoRules[]);
        setShownSudoRulesList(sudoRulesRepository.slice(0, perPage));
        setSudoRulesRepoLength(sudoRulesRepository.length);
        break;
    }
  };

  // State that determines whether the row tables are displayed nor not
  // - This helps with the reload state
  const [showTableRows, setShowTableRows] = useState(false);

  // -- Name of the groups selected on the table (to remove)
  const [groupsNamesSelected, setGroupsNamesSelected] = useState<string[]>([]);

  const updateGroupsNamesSelected = (groups: string[]) => {
    setGroupsNamesSelected(groups);
  };

  // -- 'Delete' button state
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    useState<boolean>(true);

  const updateIsDeleteButtonDisabled = (updatedDeleteButton: boolean) => {
    setIsDeleteButtonDisabled(updatedDeleteButton);
  };

  // If some entries have been deleted, restore the 'groupsNamesSelected' list
  const [isDeletion, setIsDeletion] = useState(false);

  const updateIsDeletion = (option: boolean) => {
    setIsDeletion(option);
  };

  // -- Tab
  const [activeTabKey, setActiveTabKey] = useState(0);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as number);
  };

  // -- Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Member groups displayed on the first page
  const [shownUserGroupsList, setShownUserGroupsList] = useState(
    userGroupsFromUser.slice(0, perPage)
  );
  const [shownNetgroupsList, setShownNetgroupsList] = useState(
    netgroupsRepository.slice(0, perPage)
  );
  const [shownRolesList, setShownRolesList] = useState(
    rolesRepository.slice(0, perPage)
  );
  const [shownHBACRulesList, setShownHBACRulesList] = useState(
    hbacRulesRepository.slice(0, perPage)
  );
  const [shownSudoRulesList, setShownSudoRulesList] = useState(
    sudoRulesRepository.slice(0, perPage)
  );

  // Update shown items based on data updates
  React.useEffect(() => {
    setShownUserGroupsList(userGroupsFromUser.slice(0, perPage));
    // Omitting the rest of the shown lists because they are not adapted yet to the C.L.
  }, [userGroupsFromUser]);

  // Update pagination
  const changeMemberGroupsList = (
    value: UserGroupNew[] | Netgroup[] | Roles[] | HBACRules[] | SudoRules[]
  ) => {
    switch (activeTabKey) {
      case 0:
        setShownUserGroupsList(value as UserGroupNew[]);
        break;
      case 1:
        setShownNetgroupsList(value as Netgroup[]);
        break;
      case 2:
        setShownRolesList(value as Roles[]);
        break;
      case 3:
        setShownHBACRulesList(value as HBACRules[]);
        break;
      case 4:
        setShownSudoRulesList(value as SudoRules[]);
        break;
    }
  };

  // Pages setters
  const onSetPage = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPage: number,
    perPage: number | undefined,
    startIdx: number | undefined,
    endIdx: number | undefined
  ) => {
    setPage(newPage);
    switch (activeTabKey) {
      case 0:
        setShownUserGroupsList(userGroupsFromUser.slice(startIdx, endIdx));
        break;
      case 1:
        setShownNetgroupsList(netgroupsRepository.slice(startIdx, endIdx));
        break;
      case 2:
        setShownRolesList(rolesRepository.slice(startIdx, endIdx));
        break;
      case 3:
        setShownHBACRulesList(hbacRulesRepository.slice(startIdx, endIdx));
        break;
      case 4:
        setShownSudoRulesList(sudoRulesRepository.slice(startIdx, endIdx));
        break;
    }
  };

  const onPerPageSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
    newPage: number,
    startIdx: number | undefined,
    endIdx: number | undefined
  ) => {
    setPerPage(newPerPage);
    switch (activeTabKey) {
      case 0:
        setShownUserGroupsList(userGroupsFromUser.slice(startIdx, endIdx));
        break;
      case 1:
        setShownNetgroupsList(netgroupsRepository.slice(startIdx, endIdx));
        break;
      case 2:
        setShownRolesList(rolesRepository.slice(startIdx, endIdx));
        break;
      case 3:
        setShownHBACRulesList(hbacRulesRepository.slice(startIdx, endIdx));
        break;
      case 4:
        setShownSudoRulesList(sudoRulesRepository.slice(startIdx, endIdx));
        break;
    }
  };

  // Page setters passed as props
  const changeSetPage = (
    newPage: number,
    perPage: number | undefined,
    startIdx: number | undefined,
    endIdx: number | undefined
  ) => {
    setPage(newPage);
    switch (activeTabKey) {
      case 0:
        setShownUserGroupsList(userGroupsFromUser.slice(startIdx, endIdx));
        break;
      case 1:
        setShownNetgroupsList(netgroupsRepository.slice(startIdx, endIdx));
        break;
      case 2:
        setShownRolesList(rolesRepository.slice(startIdx, endIdx));
        break;
      case 3:
        setShownHBACRulesList(hbacRulesRepository.slice(startIdx, endIdx));
        break;
      case 4:
        setShownSudoRulesList(sudoRulesRepository.slice(startIdx, endIdx));
        break;
    }
  };

  const changePerPageSelect = (
    newPerPage: number,
    newPage: number,
    startIdx: number | undefined,
    endIdx: number | undefined
  ) => {
    setPerPage(newPerPage);
    switch (activeTabKey) {
      case 0:
        setShownUserGroupsList(userGroupsFromUser.slice(startIdx, endIdx));
        break;
      case 1:
        setShownNetgroupsList(netgroupsRepository.slice(startIdx, endIdx));
        break;
      case 2:
        setShownRolesList(rolesRepository.slice(startIdx, endIdx));
        break;
      case 3:
        setShownHBACRulesList(hbacRulesRepository.slice(startIdx, endIdx));
        break;
      case 4:
        setShownSudoRulesList(sudoRulesRepository.slice(startIdx, endIdx));
        break;
    }
  };

  // Different number of items will be shown depending on the 'activeTabKey'
  const numberOfItems = () => {
    switch (activeTabKey) {
      case 0:
        return userGroupsFromUser.length;
      case 1:
        return netgroupsRepository.length;
      case 2:
        return rolesRepository.length;
      case 3:
        return hbacRulesRepository.length;
      case 4:
        return sudoRulesRepository.length;
    }
  };

  // -- Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const onClickAddHandler = () => {
    setShowAddModal(true);
  };
  const onModalToggle = () => {
    setShowAddModal(!showAddModal);
  };

  const onClickDeleteHandler = () => {
    setShowDeleteModal(true);
  };

  const onModalDeleteToggle = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  // -- Tab name
  const [tabName, setTabName] = useState("user groups");

  const updateTabName = (name: string) => {
    setTabName(name);
  };

  // Reloads the table everytime any of the group lists are updated
  useEffect(() => {
    setPage(1);
    if (showTableRows) setShowTableRows(false);
    switch (activeTabKey) {
      case 0:
        setShownUserGroupsList(userGroupsFromUser.slice(0, perPage));
        setUserGroupsRepoLength(userGroupsFromUser.length);
        break;
    }

    // TODO: Remove the timeout once the remaining elements are adapted into the C.L.
    setTimeout(() => {
      switch (activeTabKey) {
        case 1:
          setShownNetgroupsList(netgroupsRepository.slice(0, perPage));
          setNetgroupsRepoLength(netgroupsRepository.length);
          break;
        case 2:
          setShownRolesList(rolesRepository.slice(0, perPage));
          setRolesRepoLength(rolesRepository.length);
          break;
        case 3:
          setShownHBACRulesList(hbacRulesRepository.slice(0, perPage));
          setHbacRulesRepoLength(hbacRulesRepository.length);
          break;
        case 4:
          setShownSudoRulesList(sudoRulesRepository.slice(0, perPage));
          setSudoRulesRepoLength(sudoRulesRepository.length);
          break;
      }
      setShowTableRows(true);
    }, 1000);
  }, [
    userGroupsFromUser,
    netgroupsRepository,
    rolesRepository,
    hbacRulesRepository,
    sudoRulesRepository,
  ]);

  // Data wrappers
  // - MemberOfToolbar
  const toolbarPageData = {
    page,
    changeSetPage,
    perPage,
    changePerPageSelect,
  };

  const toolbarButtonData = {
    onClickAddHandler,
    onClickDeleteHandler,
    isDeleteButtonDisabled,
  };

  const toolbarSettersData = {
    changeMemberGroupsList,
    changeTabName: updateTabName,
  };

  // - MemberOfTable
  const tableButtonData = {
    isDeletion,
    updateIsDeletion,
    changeIsDeleteButtonDisabled: updateIsDeleteButtonDisabled,
  };

  // - MemberOfAddModal
  const addModalData = {
    showModal: showAddModal,
    handleModalToggle: onModalToggle,
  };

  const tabData = {
    tabName,
    userName: props.user.uid,
  };

  // - MemberOfDeleteModal
  const deleteModalData = {
    showModal: showDeleteModal,
    handleModalToggle: onModalDeleteToggle,
  };

  const deleteButtonData = {
    changeIsDeleteButtonDisabled: updateIsDeleteButtonDisabled,
    updateIsDeletion,
  };

  const deleteTabData = {
    tabName,
    activeTabKey,
  };

  // - 'MemberOfToolbar' > 'SearchInputLayout'
  // SearchInputLayout
  const searchValueData = {
    searchValue,
    updateSearchValue,
  };

  // Render 'ActiveUsersIsMemberOf'
  return (
    <>
      <Page>
        <PageSection
          variant={PageSectionVariants.light}
          isFilled={false}
          className="pf-v5-u-m-lg"
        >
          <Tabs
            activeKey={activeTabKey}
            onSelect={handleTabClick}
            isBox={false}
          >
            <Tab
              eventKey={0}
              name="memberof_group"
              title={
                <TabTitleText>
                  User groups{" "}
                  <Badge key={0} isRead>
                    {userGroupsRepoLength}
                  </Badge>
                </TabTitleText>
              }
            >
              <MemberOfToolbarNew
                pageRepo={userGroupsFromUser}
                shownItems={shownUserGroupsList}
                toolbar="user groups"
                settersData={toolbarSettersData}
                pageData={toolbarPageData}
                buttonData={toolbarButtonData}
                searchValueData={searchValueData}
              />
              <MemberOfTableNew
                listOfElements={shownUserGroupsList}
                tableName={"User groups"}
                activeTabKey={activeTabKey}
                changeSelectedGroups={updateGroupsNamesSelected}
                buttonData={tableButtonData}
                showTableRows={showTableRows}
                searchValue={searchValue}
                fullGroupList={userGroupsFullList}
              />
            </Tab>
            <Tab
              eventKey={1}
              name="memberof_netgroup"
              title={
                <TabTitleText>
                  Netgroups{" "}
                  <Badge key={1} isRead>
                    {netgroupsRepoLength}
                  </Badge>
                </TabTitleText>
              }
            >
              <MemberOfToolbar
                pageRepo={netgroupsRepository}
                shownItems={shownNetgroupsList}
                toolbar="netgroups"
                settersData={toolbarSettersData}
                pageData={toolbarPageData}
                buttonData={toolbarButtonData}
                searchValueData={searchValueData}
              />
              <MemberOfTable
                group={shownNetgroupsList}
                tableName={"Netgroups"}
                activeTabKey={activeTabKey}
                changeSelectedGroups={updateGroupsNamesSelected}
                buttonData={tableButtonData}
                showTableRows={showTableRows}
                searchValue={searchValue}
                fullGroupList={netgroupsRepository}
              />
            </Tab>
            <Tab
              eventKey={2}
              name="memberof_role"
              title={
                <TabTitleText>
                  Roles{" "}
                  <Badge key={2} isRead>
                    {rolesRepoLength}
                  </Badge>
                </TabTitleText>
              }
            >
              <MemberOfToolbar
                pageRepo={rolesRepository}
                shownItems={shownRolesList}
                toolbar="roles"
                settersData={toolbarSettersData}
                pageData={toolbarPageData}
                buttonData={toolbarButtonData}
                searchValueData={searchValueData}
              />
              <MemberOfTable
                group={shownRolesList}
                tableName={"Roles"}
                activeTabKey={activeTabKey}
                changeSelectedGroups={updateGroupsNamesSelected}
                buttonData={tableButtonData}
                showTableRows={showTableRows}
                searchValue={searchValue}
                fullGroupList={rolesRepository}
              />
            </Tab>
            <Tab
              eventKey={3}
              name="memberof_hbacrule"
              title={
                <TabTitleText>
                  HBAC rules{" "}
                  <Badge key={3} isRead>
                    {hbacRulesRepoLength}
                  </Badge>
                </TabTitleText>
              }
            >
              <MemberOfToolbar
                pageRepo={hbacRulesRepository}
                shownItems={shownHBACRulesList}
                toolbar="HBAC rules"
                settersData={toolbarSettersData}
                pageData={toolbarPageData}
                buttonData={toolbarButtonData}
                searchValueData={searchValueData}
              />
              <MemberOfTable
                group={shownHBACRulesList}
                tableName={"HBAC rules"}
                activeTabKey={activeTabKey}
                changeSelectedGroups={updateGroupsNamesSelected}
                buttonData={tableButtonData}
                showTableRows={showTableRows}
                searchValue={searchValue}
                fullGroupList={hbacRulesRepository}
              />
            </Tab>
            <Tab
              eventKey={4}
              name="memberof_sudorule"
              title={
                <TabTitleText>
                  Sudo rules{" "}
                  <Badge key={4} isRead>
                    {sudoRulesRepoLength}
                  </Badge>
                </TabTitleText>
              }
            >
              <MemberOfToolbar
                pageRepo={sudoRulesRepository}
                shownItems={shownSudoRulesList}
                toolbar="sudo rules"
                settersData={toolbarSettersData}
                pageData={toolbarPageData}
                buttonData={toolbarButtonData}
                searchValueData={searchValueData}
              />
              <MemberOfTable
                group={shownSudoRulesList}
                tableName={"Sudo rules"}
                activeTabKey={activeTabKey}
                changeSelectedGroups={updateGroupsNamesSelected}
                buttonData={tableButtonData}
                showTableRows={showTableRows}
                searchValue={searchValue}
                fullGroupList={sudoRulesRepository}
              />
            </Tab>
          </Tabs>
          <Pagination
            className="pf-v5-u-pb-0 pf-v5-u-pr-md"
            itemCount={numberOfItems()}
            widgetId="pagination-options-menu-bottom"
            perPage={perPage}
            page={page}
            variant={PaginationVariant.bottom}
            onSetPage={onSetPage}
            onPerPageSelect={onPerPageSelect}
          />
        </PageSection>
        {/* This will remain commented until the 'Add' and 'Delete'
            functionality is adapted */}
        {/* {tabName === "User groups" && (
          <>
            {showAddModal && (
              <MemberOfAddModal
                modalData={addModalData}
                availableData={userGroupsFilteredData}
                groupRepository={userGroupsList}
                updateGroupRepository={updateGroupRepository}
                updateAvOptionsList={updateUserGroupsList}
                tabData={tabData}
              />
            )}
            {showDeleteModal && groupsNamesSelected.length !== 0 && (
              <MemberOfDeleteModal
                modalData={deleteModalData}
                tabData={deleteTabData}
                groupNamesToDelete={groupsNamesSelected}
                groupRepository={userGroupsList}
                updateGroupRepository={updateGroupRepository}
                buttonData={deleteButtonData}
              />
            )}
          </>
        )} */}
        {tabName === "Netgroups" && (
          <>
            {showAddModal && (
              <MemberOfAddModal
                modalData={addModalData}
                availableData={netgroupsFilteredData}
                groupRepository={netgroupsRepository}
                updateGroupRepository={updateGroupRepository}
                updateAvOptionsList={updateNetgroupsList}
                tabData={tabData}
              />
            )}
            {showDeleteModal && groupsNamesSelected.length !== 0 && (
              <MemberOfDeleteModal
                modalData={deleteModalData}
                tabData={deleteTabData}
                groupNamesToDelete={groupsNamesSelected}
                groupRepository={netgroupsRepository}
                updateGroupRepository={updateGroupRepository}
                buttonData={deleteButtonData}
              />
            )}
          </>
        )}
        {tabName === "Roles" && (
          <>
            {showAddModal && (
              <MemberOfAddModal
                modalData={addModalData}
                availableData={rolesFilteredData}
                groupRepository={rolesRepository}
                updateGroupRepository={updateGroupRepository}
                updateAvOptionsList={updateRolesList}
                tabData={tabData}
              />
            )}
            {showDeleteModal && groupsNamesSelected.length !== 0 && (
              <MemberOfDeleteModal
                modalData={deleteModalData}
                tabData={deleteTabData}
                groupNamesToDelete={groupsNamesSelected}
                groupRepository={rolesRepository}
                updateGroupRepository={updateGroupRepository}
                buttonData={deleteButtonData}
              />
            )}
          </>
        )}
        {tabName === "HBAC rules" && (
          <>
            {showAddModal && (
              <MemberOfAddModal
                modalData={addModalData}
                availableData={hbacRulesFilteredData}
                groupRepository={hbacRulesRepository}
                updateGroupRepository={updateGroupRepository}
                updateAvOptionsList={updateHbacRulesList}
                tabData={tabData}
              />
            )}
            {showDeleteModal && groupsNamesSelected.length !== 0 && (
              <MemberOfDeleteModal
                modalData={deleteModalData}
                tabData={deleteTabData}
                groupNamesToDelete={groupsNamesSelected}
                groupRepository={hbacRulesRepository}
                updateGroupRepository={updateGroupRepository}
                buttonData={deleteButtonData}
              />
            )}
          </>
        )}
        {tabName === "Sudo rules" && (
          <>
            {showAddModal && (
              <MemberOfAddModal
                modalData={addModalData}
                availableData={sudoRulesFilteredData}
                groupRepository={sudoRulesRepository}
                updateGroupRepository={updateGroupRepository}
                updateAvOptionsList={updateSudoRulesList}
                tabData={tabData}
              />
            )}
            {showDeleteModal && groupsNamesSelected.length !== 0 && (
              <MemberOfDeleteModal
                modalData={deleteModalData}
                tabData={deleteTabData}
                groupNamesToDelete={groupsNamesSelected}
                groupRepository={sudoRulesRepository}
                updateGroupRepository={updateGroupRepository}
                buttonData={deleteButtonData}
              />
            )}
          </>
        )}
      </Page>
    </>
  );
};

export default UserMemberOf;
