import React, { useEffect, useState } from "react";
// PatternFly
import {
  Badge,
  Page,
  PageSection,
  PageSectionVariants,
  Pagination,
  PaginationVariant,
  Tab,
  Tabs,
  TabTitleText,
} from "@patternfly/react-core";
// Others
import MemberOfToolbar from "src/components/MemberOf/MemberOfToolbarOld";
import MemberOfTable from "src/components/MemberOf/MemberOfTable";
import { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
// Data types
import {
  HostGroupOld,
  NetgroupOld,
  RolesOld,
  HBACRulesOld,
  SudoRulesOld,
  Host,
} from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
// Repositories
import {
  hostsHostGroupsInitialData,
  hostsNetgroupsInitialData,
  hostsRolesInitialData,
  hostsHbacRulesInitialData,
  hostsSudoRulesInitialData,
} from "src/utils/data/GroupRepositories";
// Modals
import MemberOfAddModal from "src/components/MemberOf/MemberOfAddModalOld";
import MemberOfDeleteModal from "src/components/MemberOf/MemberOfDeleteModalOld";
// Navigation
import { useNavigate } from "react-router-dom";

interface PropsToHostsMemberOf {
  host: Host;
  tabSection: string;
}

const HostsMemberOf = (props: PropsToHostsMemberOf) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Update breadcrumb route
  React.useEffect(() => {
    if (!props.host.fqdn) {
      // Redirect to the main page
      navigate("/hosts");
    } else {
      const currentPath: BreadCrumbItem[] = [
        {
          name: "Hosts",
          url: "../../hosts",
        },
        {
          name: props.host.fqdn,
          url: "../../hosts/" + props.host.fqdn,
          isActive: true,
        },
      ];
      dispatch(updateBreadCrumbPath(currentPath));
    }
  }, [props.host.fqdn]);

  // Retrieve each group list from Redux:
  let hostGroupsList = [] as HostGroupOld[];
  let netgroupsList = [] as NetgroupOld[];
  let rolesList = useAppSelector((state) => state.roles.roleList);
  let hbacRulesList = useAppSelector((state) => state.hbacrules.hbacRulesList);
  let sudoRulesList = useAppSelector((state) => state.sudorules.sudoRulesList);

  // Alter the available options list to keep the state of the recently added / removed items
  const updateHostGroupsList = (newAvOptionsList: unknown[]) => {
    hostGroupsList = newAvOptionsList as HostGroupOld[];
  };
  const updateNetgroupsList = (newAvOptionsList: unknown[]) => {
    netgroupsList = newAvOptionsList as NetgroupOld[];
  };
  const updateRolesList = (newAvOptionsList: unknown[]) => {
    rolesList = newAvOptionsList as RolesOld[];
  };
  const updateHbacRulesList = (newAvOptionsList: unknown[]) => {
    hbacRulesList = newAvOptionsList as HBACRulesOld[];
  };
  const updateSudoRulesList = (newAvOptionsList: unknown[]) => {
    sudoRulesList = newAvOptionsList as SudoRulesOld[];
  };

  // List of default dummy data (for each tab option)
  const [hostGroupsRepository, setHostGroupsRepository] = useState(
    hostsHostGroupsInitialData
  );
  const [netgroupsRepository, setNetgroupsRepository] = useState(
    hostsNetgroupsInitialData
  );
  const [rolesRepository, setRolesRepository] = useState(hostsRolesInitialData);
  const [hbacRulesRepository, setHbacRulesRepository] = useState(
    hostsHbacRulesInitialData
  );
  const [sudoRulesRepository, setSudoRulesRepository] = useState(
    hostsSudoRulesInitialData
  );

  // Filter (Input search)
  const [searchValue, setSearchValue] = React.useState("");

  const updateSearchValue = (value: string) => {
    setSearchValue(value);
  };

  // Filter functions to compare the available data with the data that
  //  the host is already member of. This is done to prevent duplicates
  //  (e.g: adding the same element twice).
  const filterHostGroupsData = () => {
    // Host groups
    return hostGroupsList.filter((item) => {
      return !hostGroupsRepository.some((itm) => {
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
  const hostGroupsFilteredData: HostGroupOld[] = filterHostGroupsData();
  const netgroupsFilteredData: NetgroupOld[] = filterNetgroupsData();
  const rolesFilteredData: RolesOld[] = filterRolesData();
  const hbacRulesFilteredData: HBACRulesOld[] = filterHbacRulesData();
  const sudoRulesFilteredData: SudoRulesOld[] = filterSudoRulesData();

  // Number of items on the list for each repository
  const [hostGroupsRepoLength, setHostGroupsRepoLength] = useState(
    hostGroupsRepository.length
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
      | HostGroupOld[]
      | NetgroupOld[]
      | RolesOld[]
      | HBACRulesOld[]
      | SudoRulesOld[]
  ) => {
    switch (tabName) {
      case "Host groups":
        setHostGroupsRepository(groupRepository as HostGroupOld[]);
        setShownHostGroupsList(hostGroupsRepository.slice(0, perPage));
        setHostGroupsRepoLength(hostGroupsRepository.length);
        break;
      case "Netgroups":
        setNetgroupsRepository(groupRepository as NetgroupOld[]);
        setShownNetgroupsList(netgroupsRepository.slice(0, perPage));
        setNetgroupsRepoLength(netgroupsRepository.length);
        break;
      case "Roles":
        setRolesRepository(groupRepository as RolesOld[]);
        setShownRolesList(rolesRepository.slice(0, perPage));
        setRolesRepoLength(rolesRepository.length);
        break;
      case "HBAC rules":
        setHbacRulesRepository(groupRepository as HBACRulesOld[]);
        setShownHBACRulesList(hbacRulesRepository.slice(0, perPage));
        setHbacRulesRepoLength(hbacRulesRepository.length);
        break;
      case "Sudo rules":
        setSudoRulesRepository(groupRepository as SudoRulesOld[]);
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
  const [activeTabKey, setActiveTabKey] = useState("");
  // This is a temporary solution to keep the active tab number
  //  as it will be passed to the 'MemberOfDeleteModal' component
  //  and this is being used by 'Services' component as well
  const [activeTabNumber, setActiveTabNumber] = useState(0);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    switch (tabIndex) {
      case "memberof_hostgroup":
        setActiveTabNumber(0);
        break;
      case "memberof_netgroup":
        setActiveTabNumber(1);
        break;
      case "memberof_role":
        setActiveTabNumber(2);
        break;
      case "memberof_hbacrule":
        setActiveTabNumber(3);
        break;
      case "memberof_sudorule":
        setActiveTabNumber(4);
        break;
    }
    setActiveTabKey(tabIndex as string);
    navigate("/hosts/" + props.host.fqdn + "/" + tabIndex);
  };

  // -- Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Member groups displayed on the first page
  const [shownHostGroupsList, setShownHostGroupsList] = useState(
    hostGroupsRepository.slice(0, perPage)
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
    value:
      | HostGroupOld[]
      | NetgroupOld[]
      | RolesOld[]
      | HBACRulesOld[]
      | SudoRulesOld[]
  ) => {
    switch (activeTabKey) {
      case "memberof_hostgroup":
        setShownHostGroupsList(value as HostGroupOld[]);
        break;
      case "memberof_netgroup":
        setShownNetgroupsList(value as NetgroupOld[]);
        break;
      case "memberof_role":
        setShownRolesList(value as RolesOld[]);
        break;
      case "memberof_hbacrule":
        setShownHBACRulesList(value as HBACRulesOld[]);
        break;
      case "memberof_sudorule":
        setShownSudoRulesList(value as SudoRulesOld[]);
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
      case "memberof_hostgroup":
        setShownHostGroupsList(hostGroupsRepository.slice(startIdx, endIdx));
        break;
      case "memberof_netgroup":
        setShownNetgroupsList(netgroupsRepository.slice(startIdx, endIdx));
        break;
      case "memberof_role":
        setShownRolesList(rolesRepository.slice(startIdx, endIdx));
        break;
      case "memberof_hbacrule":
        setShownHBACRulesList(hbacRulesRepository.slice(startIdx, endIdx));
        break;
      case "memberof_sudorule":
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
      case "memberof_hostgroup":
        setShownHostGroupsList(hostGroupsRepository.slice(startIdx, endIdx));
        break;
      case "memberof_netgroup":
        setShownNetgroupsList(netgroupsRepository.slice(startIdx, endIdx));
        break;
      case "memberof_role":
        setShownRolesList(rolesRepository.slice(startIdx, endIdx));
        break;
      case "memberof_hbacrule":
        setShownHBACRulesList(hbacRulesRepository.slice(startIdx, endIdx));
        break;
      case "memberof_sudorule":
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
      case "memberof_hostgroup":
        setShownHostGroupsList(hostGroupsRepository.slice(startIdx, endIdx));
        break;
      case "memberof_netgroup":
        setShownNetgroupsList(netgroupsRepository.slice(startIdx, endIdx));
        break;
      case "memberof_role":
        setShownRolesList(rolesRepository.slice(startIdx, endIdx));
        break;
      case "memberof_hbacrule":
        setShownHBACRulesList(hbacRulesRepository.slice(startIdx, endIdx));
        break;
      case "memberof_sudorule":
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
      case "memberof_hostgroup":
        setShownHostGroupsList(hostGroupsRepository.slice(startIdx, endIdx));
        break;
      case "memberof_netgroup":
        setShownNetgroupsList(netgroupsRepository.slice(startIdx, endIdx));
        break;
      case "memberof_role":
        setShownRolesList(rolesRepository.slice(startIdx, endIdx));
        break;
      case "memberof_hbacrule":
        setShownHBACRulesList(hbacRulesRepository.slice(startIdx, endIdx));
        break;
      case "memberof_sudorule":
        setShownSudoRulesList(sudoRulesRepository.slice(startIdx, endIdx));
        break;
    }
  };

  // Different number of items will be shown depending on the 'activeTabKey'
  const numberOfItems = () => {
    switch (activeTabKey) {
      case "memberof_hostgroup":
        return hostGroupsRepository.length;
      case "memberof_netgroup":
        return netgroupsRepository.length;
      case "memberof_role":
        return rolesRepository.length;
      case "memberof_hbacrule":
        return hbacRulesRepository.length;
      case "memberof_sudorule":
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
  const [tabName, setTabName] = useState("host groups");

  const updateTabName = (name: string) => {
    setTabName(name);
  };

  // Reloads the table everytime any of the group lists are updated
  useEffect(() => {
    setPage(1);
    if (showTableRows) setShowTableRows(false);
    setTimeout(() => {
      switch (activeTabKey) {
        case "memberof_hostgroup":
          setShownHostGroupsList(hostGroupsRepository.slice(0, perPage));
          setHostGroupsRepoLength(hostGroupsRepository.length);
          break;
        case "memberof_netgroup":
          setShownNetgroupsList(netgroupsRepository.slice(0, perPage));
          setNetgroupsRepoLength(netgroupsRepository.length);
          break;
        case "memberof_role":
          setShownRolesList(rolesRepository.slice(0, perPage));
          setRolesRepoLength(rolesRepository.length);
          break;
        case "memberof_hbacrule":
          setShownHBACRulesList(hbacRulesRepository.slice(0, perPage));
          setHbacRulesRepoLength(hbacRulesRepository.length);
          break;
        case "memberof_sudorule":
          setShownSudoRulesList(sudoRulesRepository.slice(0, perPage));
          setSudoRulesRepoLength(sudoRulesRepository.length);
          break;
      }
      setShowTableRows(true);
    }, 1000);
  }, [
    hostGroupsRepository,
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
    userName: props.host.fqdn,
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
    // TODO: Replace it with the 'activeTabKey' state when 'Services' has been adapted
    activeTabKey: activeTabNumber,
  };

  // - 'MemberOfToolbar' > 'SearchInputLayout'
  // SearchInputLayout
  const searchValueData = {
    searchValue,
    updateSearchValue,
  };

  React.useEffect(() => {
    setActiveTabKey(props.tabSection);
    navigate("/hosts/" + props.host.fqdn + "/" + props.tabSection);
  }, [props.tabSection]);

  // Render component
  return (
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
          mountOnEnter
          unmountOnExit
        >
          <Tab
            eventKey={"memberof_hostgroup"}
            name="memberof_hostgroup"
            title={
              <TabTitleText>
                Host groups{" "}
                <Badge key={0} isRead>
                  {hostGroupsRepoLength}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfToolbar
              pageRepo={hostGroupsRepository}
              shownItems={shownHostGroupsList}
              toolbar="host groups"
              settersData={toolbarSettersData}
              pageData={toolbarPageData}
              buttonData={toolbarButtonData}
              searchValueData={searchValueData}
            />
            <MemberOfTable
              group={shownHostGroupsList}
              tableName={"Host groups"}
              activeTabKey={activeTabKey}
              changeSelectedGroups={updateGroupsNamesSelected}
              buttonData={tableButtonData}
              showTableRows={showTableRows}
              searchValue={searchValue}
              fullGroupList={hostGroupsRepository}
            />
          </Tab>
          <Tab
            eventKey={"memberof_netgroup"}
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
            eventKey={"memberof_role"}
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
            eventKey={"memberof_hbacrule"}
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
            eventKey={"memberof_sudorule"}
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
      {tabName === "Host groups" && (
        <>
          {showAddModal && (
            <MemberOfAddModal
              modalData={addModalData}
              availableData={hostGroupsFilteredData}
              groupRepository={hostGroupsRepository}
              updateGroupRepository={updateGroupRepository}
              updateAvOptionsList={updateHostGroupsList}
              tabData={tabData}
            />
          )}
          {showDeleteModal && groupsNamesSelected.length !== 0 && (
            <MemberOfDeleteModal
              modalData={deleteModalData}
              tabData={deleteTabData}
              groupNamesToDelete={groupsNamesSelected}
              groupRepository={hostGroupsRepository}
              updateGroupRepository={updateGroupRepository}
              buttonData={deleteButtonData}
            />
          )}
        </>
      )}
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

export default HostsMemberOf;
