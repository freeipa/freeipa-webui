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
import MemberOfTable from "src/components/MemberOf/MemberOfTable";
// Data types
import {
  UserGroup,
  Netgroup,
  Roles,
  HBACRules,
  SudoRules,
  User,
} from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import {
  setUserGroupsRepository,
  setNetgroupsRepository,
  setRolesRepository,
  setHbacRulesRepository,
  setSudoRulesRepository,
  setPage,
  setPerPage,
  setActiveTabKey,
} from "src/store/shared/activeUsersMemberOf-slice";
// Modals
import MemberOfAddModal from "src/components/MemberOf/MemberOfAddModal";
import MemberOfDeleteModal from "src/components/MemberOf/MemberOfDeleteModal";

interface PropsToUserMemberOf {
  user: User;
}

const UserMemberOf = (props: PropsToUserMemberOf) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // Retrieve each group list from Redux:
  let userGroupsList = useAppSelector(
    (state) => state.usergroups.userGroupList
  );
  let netgroupsList = useAppSelector((state) => state.netgroups.netgroupList);
  let rolesList = useAppSelector((state) => state.roles.roleList);
  let hbacRulesList = useAppSelector((state) => state.hbacrules.hbacRulesList);
  let sudoRulesList = useAppSelector((state) => state.sudorules.sudoRulesList);

  // Retrieve shared props (Redux)
  const userGroupsRepository = useAppSelector(
    (state) => state.activeUsersMemberOfShared.userGroupsRepository
  );
  const netgroupsRepository = useAppSelector(
    (state) => state.activeUsersMemberOfShared.netgroupsRepository
  );
  const rolesRepository = useAppSelector(
    (state) => state.activeUsersMemberOfShared.rolesRepository
  );
  const hbacRulesRepository = useAppSelector(
    (state) => state.activeUsersMemberOfShared.hbacRulesRepository
  );
  const sudoRulesRepository = useAppSelector(
    (state) => state.activeUsersMemberOfShared.sudoRulesRepository
  );
  const showAddModal = useAppSelector(
    (state) => state.activeUsersMemberOfShared.showAddModal
  );
  const showDeleteModal = useAppSelector(
    (state) => state.activeUsersMemberOfShared.showDeleteModal
  );
  const tabName = useAppSelector(
    (state) => state.activeUsersMemberOfShared.tabName
  );
  const groupsNamesSelected = useAppSelector(
    (state) => state.activeUsersMemberOfShared.groupsNamesSelected
  );
  const page = useAppSelector((state) => state.activeUsersMemberOfShared.page);
  const perPage = useAppSelector(
    (state) => state.activeUsersMemberOfShared.perPage
  );
  const activeTabKey = useAppSelector(
    (state) => state.activeUsersMemberOfShared.activeTabKey
  );

  // Alter the available options list to keep the state of the recently added / removed items
  const updateUserGroupsList = (newAvOptionsList: unknown[]) => {
    userGroupsList = newAvOptionsList as UserGroup[];
  };
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

  // Define column names that will be shown
  interface ColumnNames {
    name: string;
    gid?: string;
    status?: string;
    description: string;
  }

  // Filter functions to compare the available data with the data that
  //  the user is already member of. This is done to prevent duplicates
  //  (e.g: adding the same element twice).
  const filterUserGroupsData = () => {
    // User groups
    return userGroupsList.filter((item) => {
      return !userGroupsRepository.some((itm) => {
        return item.name === itm.name;
      });
    });
  };
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
  const userGroupsFilteredData: UserGroup[] = filterUserGroupsData();
  const netgroupsFilteredData: Netgroup[] = filterNetgroupsData();
  const rolesFilteredData: Roles[] = filterRolesData();
  const hbacRulesFilteredData: HBACRules[] = filterHbacRulesData();
  const sudoRulesFilteredData: SudoRules[] = filterSudoRulesData();

  // Number of items on the list for each repository
  const [userGroupsRepoLength, setUserGroupsRepoLength] = useState(
    userGroupsRepository.length
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
      | UserGroup[]
      | Netgroup[]
      | Roles[]
      | HBACRules[]
      | SudoRules[]
  ) => {
    switch (tabName) {
      case "User groups":
        dispatch(setUserGroupsRepository(groupRepository as UserGroup[]));
        setShownUserGroupsList(userGroupsRepository.slice(0, perPage));
        setUserGroupsRepoLength(userGroupsRepository.length);
        break;
      case "Netgroups":
        dispatch(setNetgroupsRepository(groupRepository as Netgroup[]));
        setShownNetgroupsList(netgroupsRepository.slice(0, perPage));
        setNetgroupsRepoLength(netgroupsRepository.length);
        break;
      case "Roles":
        dispatch(setRolesRepository(groupRepository as Roles[]));
        setShownRolesList(rolesRepository.slice(0, perPage));
        setRolesRepoLength(rolesRepository.length);
        break;
      case "HBAC rules":
        dispatch(setHbacRulesRepository(groupRepository as HBACRules[]));
        setShownHBACRulesList(hbacRulesRepository.slice(0, perPage));
        setHbacRulesRepoLength(hbacRulesRepository.length);
        break;
      case "Sudo rules":
        dispatch(setSudoRulesRepository(groupRepository as SudoRules[]));
        setShownSudoRulesList(sudoRulesRepository.slice(0, perPage));
        setSudoRulesRepoLength(sudoRulesRepository.length);
        break;
    }
  };

  // Column names for each repository
  const groupNameColumnNames: ColumnNames = {
    name: "Group name",
    gid: "GID",
    description: "Description",
  };
  const netgroupsColumnNames: ColumnNames = {
    name: "Netgroup name",
    description: "Description",
  };
  const rolesColumnNames: ColumnNames = {
    name: "Role name",
    description: "Description",
  };
  const hbacRulesColumnNames: ColumnNames = {
    name: "Rule name",
    status: "Status",
    description: "Description",
  };
  const sudoRulesColumnNames: ColumnNames = {
    name: "Rule name",
    status: "Status",
    description: "Description",
  };

  // State that determines whether the row tables are displayed nor not
  // - This helps with the reload state
  const [showTableRows, setShowTableRows] = useState(false);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    dispatch(setActiveTabKey(tabIndex as number));
  };

  // Member groups displayed on the first page
  const [shownUserGroupsList, setShownUserGroupsList] = useState(
    userGroupsRepository.slice(0, perPage)
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

  // Update pagination
  const changeMemberGroupsList = (
    value: UserGroup[] | Netgroup[] | Roles[] | HBACRules[] | SudoRules[]
  ) => {
    switch (activeTabKey) {
      case 0:
        setShownUserGroupsList(value as UserGroup[]);
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
    dispatch(setPage(newPage));
    switch (activeTabKey) {
      case 0:
        setShownUserGroupsList(userGroupsRepository.slice(startIdx, endIdx));
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
        setShownUserGroupsList(userGroupsRepository.slice(startIdx, endIdx));
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
    dispatch(setPage(newPage));
    switch (activeTabKey) {
      case 0:
        setShownUserGroupsList(userGroupsRepository.slice(startIdx, endIdx));
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
        setShownUserGroupsList(userGroupsRepository.slice(startIdx, endIdx));
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
        return userGroupsRepository.length;
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

  // Reloads the table everytime any of the group lists are updated
  useEffect(() => {
    dispatch(setPage(1));
    if (showTableRows) setShowTableRows(false);
    setTimeout(() => {
      switch (activeTabKey) {
        case 0:
          setShownUserGroupsList(userGroupsRepository.slice(0, perPage));
          setUserGroupsRepoLength(userGroupsRepository.length);
          break;
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
    userGroupsRepository,
    netgroupsRepository,
    rolesRepository,
    hbacRulesRepository,
    sudoRulesRepository,
  ]);

  // Render 'ActiveUsersIsMemberOf'
  return (
    <Page>
      <PageSection
        variant={PageSectionVariants.light}
        isFilled={false}
        className="pf-u-m-lg"
      >
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick} isBox={false}>
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
            <MemberOfToolbar
              pageRepo={userGroupsRepository}
              shownItems={shownUserGroupsList}
              toolbar="user groups"
              changeMemberGroupsList={changeMemberGroupsList}
              changeSetPage={changeSetPage}
              changePerPageSelect={changePerPageSelect}
            />
            <MemberOfTable
              group={shownUserGroupsList}
              columnNames={groupNameColumnNames}
              tableName={"User groups"}
              activeTabKey={activeTabKey}
              showTableRows={showTableRows}
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
              changeMemberGroupsList={changeMemberGroupsList}
              changeSetPage={changeSetPage}
              changePerPageSelect={changePerPageSelect}
            />
            <MemberOfTable
              group={shownNetgroupsList}
              columnNames={netgroupsColumnNames}
              tableName={"Netgroups"}
              activeTabKey={activeTabKey}
              showTableRows={showTableRows}
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
              changeMemberGroupsList={changeMemberGroupsList}
              changeSetPage={changeSetPage}
              changePerPageSelect={changePerPageSelect}
            />
            <MemberOfTable
              group={shownRolesList}
              columnNames={rolesColumnNames}
              tableName={"Roles"}
              activeTabKey={activeTabKey}
              showTableRows={showTableRows}
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
              changeMemberGroupsList={changeMemberGroupsList}
              changeSetPage={changeSetPage}
              changePerPageSelect={changePerPageSelect}
            />
            <MemberOfTable
              group={shownHBACRulesList}
              columnNames={hbacRulesColumnNames}
              tableName={"HBAC rules"}
              activeTabKey={activeTabKey}
              showTableRows={showTableRows}
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
              changeMemberGroupsList={changeMemberGroupsList}
              changeSetPage={changeSetPage}
              changePerPageSelect={changePerPageSelect}
            />
            <MemberOfTable
              group={shownSudoRulesList}
              columnNames={sudoRulesColumnNames}
              tableName={"Sudo rules"}
              activeTabKey={activeTabKey}
              showTableRows={showTableRows}
            />
          </Tab>
        </Tabs>
        <Pagination
          perPageComponent="button"
          className="pf-u-pb-0 pf-u-pr-md"
          itemCount={numberOfItems()}
          widgetId="pagination-options-menu-bottom"
          perPage={perPage}
          page={page}
          variant={PaginationVariant.bottom}
          onSetPage={onSetPage}
          onPerPageSelect={onPerPageSelect}
        />
      </PageSection>
      {tabName === "User groups" && (
        <>
          {showAddModal && (
            <MemberOfAddModal
              show={showAddModal}
              availableData={userGroupsFilteredData}
              userGroupData={userGroupsRepository}
              updateGroupRepository={updateGroupRepository}
              updateAvOptionsList={updateUserGroupsList}
              userName={props.user.userLogin}
            />
          )}
          {showDeleteModal && groupsNamesSelected.length !== 0 && (
            <MemberOfDeleteModal
              activeTabKey={activeTabKey}
              groupRepository={userGroupsRepository}
              updateGroupRepository={updateGroupRepository}
            />
          )}
        </>
      )}
      {tabName === "Netgroups" && (
        <>
          {showAddModal && (
            <MemberOfAddModal
              show={showAddModal}
              availableData={netgroupsFilteredData}
              userGroupData={netgroupsRepository}
              updateGroupRepository={updateGroupRepository}
              updateAvOptionsList={updateNetgroupsList}
              userName={props.user.userLogin}
            />
          )}
          {showDeleteModal && groupsNamesSelected.length !== 0 && (
            <MemberOfDeleteModal
              activeTabKey={activeTabKey}
              groupRepository={netgroupsRepository}
              updateGroupRepository={updateGroupRepository}
            />
          )}
        </>
      )}
      {tabName === "Roles" && (
        <>
          {showAddModal && (
            <MemberOfAddModal
              show={showAddModal}
              availableData={rolesFilteredData}
              userGroupData={rolesRepository}
              updateGroupRepository={updateGroupRepository}
              updateAvOptionsList={updateRolesList}
              userName={props.user.userLogin}
            />
          )}
          {showDeleteModal && groupsNamesSelected.length !== 0 && (
            <MemberOfDeleteModal
              activeTabKey={activeTabKey}
              groupRepository={rolesRepository}
              updateGroupRepository={updateGroupRepository}
            />
          )}
        </>
      )}
      {tabName === "HBAC rules" && (
        <>
          {showAddModal && (
            <MemberOfAddModal
              show={showAddModal}
              availableData={hbacRulesFilteredData}
              userGroupData={hbacRulesRepository}
              updateGroupRepository={updateGroupRepository}
              updateAvOptionsList={updateHbacRulesList}
              userName={props.user.userLogin}
            />
          )}
          {showDeleteModal && groupsNamesSelected.length !== 0 && (
            <MemberOfDeleteModal
              activeTabKey={activeTabKey}
              groupRepository={hbacRulesRepository}
              updateGroupRepository={updateGroupRepository}
            />
          )}
        </>
      )}
      {tabName === "Sudo rules" && (
        <>
          {showAddModal && (
            <MemberOfAddModal
              show={showAddModal}
              availableData={sudoRulesFilteredData}
              userGroupData={sudoRulesRepository}
              updateGroupRepository={updateGroupRepository}
              updateAvOptionsList={updateSudoRulesList}
              userName={props.user.userLogin}
            />
          )}
          {showDeleteModal && groupsNamesSelected.length !== 0 && (
            <MemberOfDeleteModal
              activeTabKey={activeTabKey}
              groupRepository={sudoRulesRepository}
              updateGroupRepository={updateGroupRepository}
            />
          )}
        </>
      )}
    </Page>
  );
};

export default UserMemberOf;
