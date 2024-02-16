import React, { useEffect, useState } from "react";
import {
  TabTitleText,
  Page,
  PageSection,
  PageSectionVariants,
  Tab,
  Tabs,
  Badge,
} from "@patternfly/react-core";
// Others
import MemberOfToolbar from "src/components/MemberOf/MemberOfToolbarOld";
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
import { useAppSelector } from "src/store/hooks";

// Repositories
import {
  userGroupsInitialData,
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

  // List of default dummy data (for each tab option)
  const [userGroupsRepository, setUserGroupsRepository] = useState(
    userGroupsInitialData
  );
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

  // -- Pagination
  // TODO: Remove this when all tabs are adapted to its own wrapper
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

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
    value: UserGroup[] | Netgroup[] | Roles[] | HBACRules[] | SudoRules[]
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
    <Page>
      <PageSection
        variant={PageSectionVariants.light}
        isFilled={false}
        className="pf-v5-u-m-lg"
      >
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick} isBox={false}>
          <Tab
            eventKey={0}
            name="memberof_group"
            title={
              <TabTitleText>
                User groups{" "}
                <Badge key={0} isRead>
                  {userGroupsRepository.length}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfUserGroups
              usersGroupsFromUser={userGroupsRepository}
              updateUsersGroupsFromUser={setUserGroupsRepository}
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
