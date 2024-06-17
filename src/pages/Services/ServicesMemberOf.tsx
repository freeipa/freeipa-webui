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
import { RolesOld, Service } from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
// Repositories
import { servicesRolesInitialData } from "src/utils/data/GroupRepositories";
// Modals
import MemberOfAddModal from "src/components/MemberOf/MemberOfAddModalOld";
import MemberOfDeleteModal from "src/components/MemberOf/MemberOfDeleteModalOld";
// React Router DOM
import { useNavigate } from "react-router-dom";

interface PropsToServicesMemberOf {
  service: Service;
}

const ServicesMemberOf = (props: PropsToServicesMemberOf) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Update breadcrumb route
  React.useEffect(() => {
    if (!props.service.krbcanonicalname) {
      // Redirect to the main page
      navigate("/services");
    } else {
      const currentPath: BreadCrumbItem[] = [
        {
          name: "Services",
          url: "../../services",
        },
        {
          name: props.service.krbcanonicalname,
          url: "../../services/" + props.service.krbcanonicalname,
          isActive: true,
        },
      ];
      dispatch(updateBreadCrumbPath(currentPath));
    }
  }, [props.service.krbcanonicalname]);

  // Retrieve Roles' list (Redux)
  let rolesList = useAppSelector((state) => state.roles.roleList);

  // Alter the available options list to keep the state of the recently added / removed items
  const updateRolesList = (newAvOptionsList: unknown[]) => {
    rolesList = newAvOptionsList as RolesOld[];
  };

  // List of default dummy data
  const [rolesRepository, setRolesRepository] = useState(
    servicesRolesInitialData
  );

  // Filter (Input search)
  const [searchValue, setSearchValue] = React.useState("");

  const updateSearchValue = (value: string) => {
    setSearchValue(value);
  };

  // Filter functions to compare the available data with the data that
  //  the service is already member of. This is done to prevent duplicates
  //  (e.g: adding the same element twice).
  const filterRolesData = () => {
    // Roles
    return rolesList.filter((item) => {
      return !rolesRepository.some((itm) => {
        return item.name === itm.name;
      });
    });
  };

  // Available data to be added as member of
  const rolesFilteredData: RolesOld[] = filterRolesData();

  // Number of items on the list for each repository
  const [rolesRepoLength, setRolesRepoLength] = useState(
    rolesRepository.length
  );

  // Some data is updated when any group list is altered
  //  - The whole list itself
  //  - The slice of data to show (considering the pagination)
  //  - Number of items for a specific list
  const updateGroupRepository = (groupRepository: RolesOld[]) => {
    setRolesRepository(groupRepository as RolesOld[]);
    setShownRolesList(rolesRepository.slice(0, perPage));
    setRolesRepoLength(rolesRepository.length);
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
  // 2: 'Roles' (name, description)
  const [activeTabKey, setActiveTabKey] = useState(2);

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
  const [shownRolesList, setShownRolesList] = useState(
    rolesRepository.slice(0, perPage)
  );

  // Update pagination
  const changeMemberGroupsList = (value: RolesOld[]) => {
    setShownRolesList(value as RolesOld[]);
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
    setShownRolesList(rolesRepository.slice(startIdx, endIdx));
  };

  const onPerPageSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
    newPage: number,
    startIdx: number | undefined,
    endIdx: number | undefined
  ) => {
    setPerPage(newPerPage);
    setShownRolesList(rolesRepository.slice(startIdx, endIdx));
  };

  // Page setters passed as props
  const changeSetPage = (
    newPage: number,
    perPage: number | undefined,
    startIdx: number | undefined,
    endIdx: number | undefined
  ) => {
    setPage(newPage);
    setShownRolesList(rolesRepository.slice(startIdx, endIdx));
  };

  const changePerPageSelect = (
    newPerPage: number,
    newPage: number,
    startIdx: number | undefined,
    endIdx: number | undefined
  ) => {
    setPerPage(newPerPage);
    setShownRolesList(rolesRepository.slice(startIdx, endIdx));
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
  const [tabName, setTabName] = useState("roles");

  const updateTabName = (name: string) => {
    setTabName(name);
  };

  // Reloads the table everytime any of the group lists are updated
  useEffect(() => {
    setPage(1);
    if (showTableRows) setShowTableRows(false);
    setTimeout(() => {
      setShownRolesList(rolesRepository.slice(0, perPage));
      setRolesRepoLength(rolesRepository.length);
      setShowTableRows(true);
    }, 1000);
  }, [rolesRepository]);

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
    userName: props.service.krbcanonicalname,
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

  // Render component
  return (
    <Page>
      <PageSection
        variant={PageSectionVariants.light}
        isFilled={false}
        className="pf-v5-u-m-lg"
      >
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick} isBox={false}>
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
        </Tabs>
        <Pagination
          className="pf-v5-u-pb-0 pf-v5-u-pr-md"
          itemCount={rolesRepository.length}
          widgetId="pagination-options-menu-bottom"
          perPage={perPage}
          page={page}
          variant={PaginationVariant.bottom}
          onSetPage={onSetPage}
          onPerPageSelect={onPerPageSelect}
        />
      </PageSection>
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
    </Page>
  );
};

export default ServicesMemberOf;
