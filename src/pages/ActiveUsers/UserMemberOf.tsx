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
  RolesOld,
  HBACRulesOld,
  SudoRules,
  User,
} from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppSelector } from "src/store/hooks";
// Repositories
import { sudoRulesInitialData } from "src/utils/data/GroupRepositories";
// Modals
import MemberOfAddModal from "src/components/MemberOf/MemberOfAddModalOld";
import MemberOfDeleteModal from "src/components/MemberOf/MemberOfDeleteModalOld";
// Wrappers
import MemberOfUserGroups from "src/components/MemberOf/MemberOfUserGroups";
import MemberOfNetgroups from "src/components/MemberOf/MemberOfNetgroups";
import MemberOfRoles from "src/components/MemberOf/MemberOfRoles";
// RPC
import { useGetUserByUidQuery } from "src/services/rpc";
// Utils
import { convertToString } from "src/utils/ipaObjectUtils";
import MemberOfHbacRules from "src/components/MemberOf/MemberOfHbacRules";

interface PropsToUserMemberOf {
  user: User;
}

const UserMemberOf = (props: PropsToUserMemberOf) => {
  // Retrieve each group list from Redux:
  // TODO: Remove this when all data is taken from the C.L.
  let sudoRulesList = useAppSelector((state) => state.sudorules.sudoRulesList);

  // Alter the available options list to keep the state of the recently added / removed items
  const updateSudoRulesList = (newAvOptionsList: unknown[]) => {
    sudoRulesList = newAvOptionsList as SudoRules[];
  };

  // Page indexes
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  // User's full data
  const userQuery = useGetUserByUidQuery(convertToString(props.user.uid));

  const userData = userQuery.data || {};

  const [user, setUser] = React.useState<Partial<User>>({});

  React.useEffect(() => {
    if (!userQuery.isFetching && userData) {
      setUser({ ...userData });
    }
  }, [userData, userQuery.isFetching]);

  const onRefreshUserData = () => {
    userQuery.refetch();
  };

  // 'User groups' length to show in tab badge
  const [userGroupsLength, setUserGroupLength] = React.useState(0);

  React.useEffect(() => {
    if (user && user.memberof_group) {
      setUserGroupLength(user.memberof_group.length);
    }
  }, [user]);

  // 'Netgroups' length to show in tab badge
  const [netgroupsLength, setNetgroupsLength] = React.useState(0);

  React.useEffect(() => {
    if (user && user.memberof_netgroup) {
      setNetgroupsLength(user.memberof_netgroup.length);
    }
  }, [user]);

  // 'Roles' length to show in tab badge
  const [rolesLength, setRolesLength] = React.useState(0);

  React.useEffect(() => {
    if (user && user.memberof_role) {
      setRolesLength(user.memberof_role.length);
    }
  }, [user]);

  // 'HBACRules' length to show in tab badge
  const [hbacRulesLength, setHbacRulesLength] = React.useState(0);

  React.useEffect(() => {
    if (user && user.memberof_hbacrule) {
      setHbacRulesLength(user.memberof_hbacrule.length);
    }
  }, [user]);

  // List of default dummy data (for each tab option)
  // TODO: Remove when all data is adapted to the C.L.
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
  const filterSudoRulesData = () => {
    // Sudo rules
    return sudoRulesList.filter((item) => {
      return !sudoRulesRepository.some((itm) => {
        return item.name === itm.name;
      });
    });
  };

  // Available data to be added as member of
  const sudoRulesFilteredData: SudoRules[] = filterSudoRulesData();

  // Number of items on the list for each repository
  const [sudoRulesRepoLength, setSudoRulesRepoLength] = useState(
    sudoRulesRepository.length
  );

  // Some data is updated when any group list is altered
  //  - The whole list itself
  //  - The slice of data to show (considering the pagination)
  //  - Number of items for a specific list
  const updateGroupRepository = (
    groupRepository: RolesOld[] | HBACRulesOld[] | SudoRules[]
  ) => {
    switch (tabName) {
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
  const [shownSudoRulesList, setShownSudoRulesList] = useState(
    sudoRulesRepository.slice(0, perPage)
  );

  // Update pagination
  const changeMemberGroupsList = (
    value: RolesOld[] | HBACRulesOld[] | SudoRules[]
  ) => {
    switch (activeTabKey) {
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
        case 4:
          setShownSudoRulesList(sudoRulesRepository.slice(0, perPage));
          setSudoRulesRepoLength(sudoRulesRepository.length);
          break;
      }
      setShowTableRows(true);
    }, 1000);
  }, [sudoRulesRepository]);

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
                  {userGroupsLength}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfUserGroups
              user={user}
              isUserDataLoading={userQuery.isFetching}
              onRefreshUserData={onRefreshUserData}
            />
          </Tab>
          <Tab
            eventKey={1}
            name="memberof_netgroup"
            title={
              <TabTitleText>
                Netgroups{" "}
                <Badge key={1} isRead>
                  {netgroupsLength}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfNetgroups
              user={user}
              isUserDataLoading={userQuery.isFetching}
              onRefreshUserData={onRefreshUserData}
            />
          </Tab>
          <Tab
            eventKey={2}
            name="memberof_role"
            title={
              <TabTitleText>
                Roles{" "}
                <Badge key={2} isRead>
                  {rolesLength}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfRoles
              user={user}
              isUserDataLoading={userQuery.isFetching}
              onRefreshUserData={onRefreshUserData}
            />
          </Tab>
          <Tab
            eventKey={3}
            name="memberof_hbacrule"
            title={
              <TabTitleText>
                HBAC rules{" "}
                <Badge key={3} isRead>
                  {hbacRulesLength}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfHbacRules
              user={user}
              isUserDataLoading={userQuery.isFetching}
              onRefreshUserData={onRefreshUserData}
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
