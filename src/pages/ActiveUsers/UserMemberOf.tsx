import React, { useState } from "react";
import { TabTitleText, Tab, Tabs, Badge } from "@patternfly/react-core";
// Data types
import {
  Netgroup,
  Roles,
  HBACRules,
  SudoRules,
  User,
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
import MemberOfAddModal from "src/components/MemberOf/MemberOfAddModalOld";
import MemberOfDeleteModal from "src/components/MemberOf/MemberOfDeleteModalOld";
// Wrappers
import MemberOfUserGroups from "src/components/MemberOf/MemberOfUserGroups";
// RPC
import { useGetUserByUidQuery } from "src/services/rpc";
// Utils
import { convertToString } from "src/utils/ipaObjectUtils";

interface PropsToUserMemberOf {
  user: User;
  tab: string;
  from: string;
}

const UserMemberOf = (props: PropsToUserMemberOf) => {
  // Retrieve each group list from Redux:
  // TODO: Remove this when all data is taken from the C.L.
  let netgroupsList = useAppSelector((state) => state.netgroups.netgroupList);
  let rolesList = useAppSelector((state) => state.roles.roleList);
  let hbacRulesList = useAppSelector((state) => state.hbacrules.hbacRulesList);
  let sudoRulesList = useAppSelector((state) => state.sudorules.sudoRulesList);

  // Update breadcrumb route
  React.useEffect(() => {
    if (!props.user.uid) {
      // Redirect to the main page
      navigate("/" + props.from);
    }
  }, [props.user.uid]);

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: props.from, noBreadcrumb: true });

  // User's full data
  const userQuery = useGetUserByUidQuery(convertToString(props.user.uid));

  const userData = userQuery.data || {};

  const [user, setUser] = React.useState<Partial<User>>({});

  React.useEffect(() => {
    if (!userQuery.isFetching && userData) {
      setUser({ ...userData });
    }
  }, [userData, userQuery.isFetching]);

  // 'User groups' length to show in tab badge
  const [userGroupsLength, setUserGroupLength] = React.useState(0);

  React.useEffect(() => {
    setActiveTabKey(props.tab);
  }, [props.tab]);

  const [groupCount, setGroupCount] = React.useState(0);
  const [netgroupCount, setNetgroupCount] = React.useState(0);
  const [roleCount, setRoleCount] = React.useState(0);
  const [hbacCount, setHbacCount] = React.useState(0);
  const [sudoCount, setSudoCount] = React.useState(0);
  const [groupDirection, setGroupDirection] = React.useState(
    "direct" as MembershipDirection
  );
  const [netgroupDirection, setNetgroupDirection] = React.useState(
    "direct" as MembershipDirection
  );
  const [roleDirection, setRoleDirection] = React.useState(
    "direct" as MembershipDirection
  );
  const [hbacDirection, setHbacDirection] = React.useState(
    "direct" as MembershipDirection
  );
  const [sudoDirection, setSudoDirection] = React.useState(
    "direct" as MembershipDirection
  );

  const updateGroupDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setGroupCount(
        user && user.memberof_group ? user.memberof_group.length : 0
      );
    } else {
      setGroupCount(
        user && user.memberofindirect_group
          ? user.memberofindirect_group.length
          : 0
      );
    }
    setGroupDirection(direction);
  };
  const updateNetgroupDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setNetgroupCount(
        user && user.memberof_netgroup ? user.memberof_netgroup.length : 0
      );
    } else {
      setNetgroupCount(
        user && user.memberofindirect_netgroup
          ? user.memberofindirect_netgroup.length
          : 0
      );
    }
    setNetgroupDirection(direction);
  };
  const updateRoleDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setRoleCount(user && user.memberof_role ? user.memberof_role.length : 0);
    } else {
      setRoleCount(
        user && user.memberofindirect_role
          ? user.memberofindirect_role.length
          : 0
      );
    }
    setRoleDirection(direction);
  };
  const updateHbacDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setHbacCount(
        user && user.memberof_hbacrule ? user.memberof_hbacrule.length : 0
      );
    } else {
      setHbacCount(
        user && user.memberofindirect_hbacrule
          ? user.memberofindirect_hbacrule.length
          : 0
      );
    }
    setHbacDirection(direction);
  };
  const updateSudoDirection = (direction: MembershipDirection) => {
    if (direction === "direct") {
      setSudoCount(
        user && user.memberof_sudorule ? user.memberof_sudorule.length : 0
      );
    } else {
      setSudoCount(
        user && user.memberofindirect_sudorule
          ? user.memberofindirect_sudorule.length
          : 0
      );
    }
    setSudoDirection(direction);
  };

  React.useEffect(() => {
    if (groupDirection === "direct") {
      setGroupCount(
        user && user.memberof_group ? user.memberof_group.length : 0
      );
    } else {
      setGroupCount(
        user && user.memberofindirect_group
          ? user.memberofindirect_group.length
          : 0
      );
    }
    if (netgroupDirection === "direct") {
      setNetgroupCount(
        user && user.memberof_netgroup ? user.memberof_netgroup.length : 0
      );
    } else {
      setNetgroupCount(
        user && user.memberofindirect_netgroup
          ? user.memberofindirect_netgroup.length
          : 0
      );
    }
    if (roleDirection === "direct") {
      setRoleCount(user && user.memberof_role ? user.memberof_role.length : 0);
    } else {
      setRoleCount(
        user && user.memberofindirect_role
          ? user.memberofindirect_role.length
          : 0
      );
    }
    if (hbacDirection === "direct") {
      setHbacCount(
        user && user.memberof_hbacrule ? user.memberof_hbacrule.length : 0
      );
    } else {
      setHbacCount(
        user && user.memberofindirect_hbacrule
          ? user.memberofindirect_hbacrule.length
          : 0
      );
    }
    if (sudoDirection === "direct") {
      setSudoCount(
        user && user.memberof_sudorule ? user.memberof_sudorule.length : 0
      );
    } else {
      setSudoCount(
        user && user.memberofindirect_sudorule
          ? user.memberofindirect_sudorule.length
          : 0
      );
    }
  }, [user]);

  // List of default dummy data (for each tab option)
  // TODO: Remove when all data is adapted to the C.L.
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
  // TODO: Remove this when all tab are set into wrappers
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
    groupRepository: Netgroup[] | Roles[] | HBACRules[] | SudoRules[]
  ) => {
    switch (tabName) {
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
  // TODO: Remove this when all tabs are adapted to its own wrapper
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

  // Member groups displayed on the first page
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
    value: Netgroup[] | Roles[] | HBACRules[] | SudoRules[]
  ) => {
    switch (activeTabKey) {
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

  // Page setters passed as props
  const changeSetPage = (
    newPage: number,
    perPage: number | undefined,
    startIdx: number | undefined,
    endIdx: number | undefined
  ) => {
    setPage(newPage);
    switch (activeTabKey) {
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

  // -- Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const onClickAddHandler = () => {
    setShowAddModal(true);
  };
  const onAddModalToggle = () => {
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
    handleModalToggle: onAddModalToggle,
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
    <TabLayout id="memberOf">
      <Tabs
        activeKey={activeTabKey}
        onSelect={(_event, tabIndex) => {
          setActiveTabKey(tabIndex as string);
          navigate(
            "/" + props.from + "/" + props.user.uid + "/memberof_" + tabIndex
          );
        }}
        isBox={false}
        mountOnEnter
        unmountOnExit
      >
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick} isBox={false}>
          <Tab
            eventKey={0}
            name="memberof_group"
            title={
              <TabTitleText>
                User groups{" "}
                <Badge key={0} isRead>
                  {userGroupsLength}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfUserGroups user={user} />
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
      </PageSection>
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
  );
};

export default UserMemberOf;
