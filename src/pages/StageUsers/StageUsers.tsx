import React, { useEffect, useState } from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  PageSection,
  PaginationVariant,
  ToolbarItemVariant,
} from "@patternfly/react-core";
// PatternFly table
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
import { ToolbarItem } from "src/components/layouts/ToolbarLayout";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
// Hooks
import { updateUsersList } from "src/store/Identity/stageUsers-slice";
import { useAlerts } from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
// Tables
import UsersTable from "../../components/tables/UsersTable";
// Components
import PaginationLayout from "src/components/layouts/PaginationLayout";
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
import ContextualHelpPanel from "src/components/ContextualHelpPanel/ContextualHelpPanel";
// Modals
import DeleteUsers from "src/components/modals/UserModals/DeleteUsers";
import AddUser from "src/components/modals/UserModals/AddUser";
import ActivateStageUsers from "src/components/modals/UserModals/ActivateStageUsers";
// Utils
import { API_VERSION_BACKUP, isUserSelectable } from "src/utils/utils";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
// RPC client
import { GenericPayload, useSearchEntriesMutation } from "../../services/rpc";
import { useGettingStageUserQuery } from "../../services/rpcUsers";
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";

const StageUsers = () => {
  // Initialize stage users list (Redux)
  const dispatch = useAppDispatch();

  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({ pathname: "stage-users" });

  // Set the page title to be shown in the browser tab
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  // Alerts to show in the UI
  const alerts = useAlerts();

  // URL parameters: page number, page size, search value
  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  // Active users list
  const [stageUsersList, setStageUsersList] = useState<User[]>([]);

  // Handle API calls errors
  const globalErrors = useApiError([]);
  const modalErrors = useApiError([]);

  // Main states - what user can define / what we could use in page URL
  const [totalCount, setUsersTotalCount] = useState<number>(0);
  const [searchDisabled, setSearchIsDisabled] = useState<boolean>(false);

  // Page indexes
  const firstUserIdx = (page - 1) * perPage;
  const lastUserIdx = page * perPage;

  // Derived states - what we get from API
  const userDataResponse = useGettingStageUserQuery({
    searchValue: searchValue,
    sizeLimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
    startIdx: firstUserIdx,
    stopIdx: lastUserIdx,
  } as GenericPayload);

  const {
    data: batchResponse,
    isLoading: isBatchLoading,
    error: batchError,
  } = userDataResponse;

  // Handle data when the API call is finished
  useEffect(() => {
    if (userDataResponse.isFetching) {
      setShowTableRows(false);
      // Reset selected users on refresh
      setUsersTotalCount(0);
      globalErrors.clear();
      return;
    }

    // API response: Success
    if (
      userDataResponse.isSuccess &&
      userDataResponse.data &&
      batchResponse !== undefined
    ) {
      const usersListResult = batchResponse.result.results;
      const usersListSize = batchResponse.result.count;
      const totalCount = batchResponse.result.totalCount;
      const usersList: User[] = [];

      for (let i = 0; i < usersListSize; i++) {
        usersList.push(usersListResult[i].result);
      }

      setUsersTotalCount(totalCount);
      // Update 'Stage users' slice data
      dispatch(updateUsersList(usersList));
      // Update the list of users
      setStageUsersList(usersList);
      // Show table elements
      setShowTableRows(true);
    }

    // API response: Error
    if (
      !userDataResponse.isLoading &&
      userDataResponse.isError &&
      userDataResponse.error !== undefined
    ) {
      // This normally happens when the user is not authorized to view the data
      // So instead of adding an error, refresh page
      window.location.reload();
    }
  }, [userDataResponse]);

  // Refresh button handling
  const refreshUsersData = () => {
    // Hide table
    setShowTableRows(false);

    // Reset selected users on refresh
    setUsersTotalCount(0);
    clearSelectedUsers();

    userDataResponse.refetch();
  };

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  React.useEffect(() => {
    userDataResponse.refetch();
  }, []);

  // 'Delete' button state
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    useState<boolean>(true);

  const updateIsDeleteButtonDisabled = (value: boolean) => {
    setIsDeleteButtonDisabled(value);
  };

  // If some entries have been deleted, restore the selectedUsers list
  const [isDeletion, setIsDeletion] = useState(false);

  const updateIsDeletion = (value: boolean) => {
    setIsDeletion(value);
  };

  // Elements selected (per page)
  //  - This will help to calculate the remaining elements on a specific page (bulk selector)
  const [selectedPerPage, setSelectedPerPage] = useState<number>(0);

  const updateSelectedPerPage = (selected: number) => {
    setSelectedPerPage(selected);
  };

  // Pagination
  const updatePage = (newPage: number) => {
    setPage(newPage);
  };

  const updatePerPage = (newSetPerPage: number) => {
    setPerPage(newSetPerPage);
  };

  // Users displayed on the first page
  const updateShownUsersList = (newShownUsersList: User[]) => {
    setStageUsersList(newShownUsersList);
  };

  // Filter (Input search)
  const updateSearchValue = (value: string) => {
    setSearchValue(value);
  };

  // Issue search with filter
  const [retrieveUser] = useSearchEntriesMutation({});

  // Issue a search using a specific search value
  const submitSearchValue = () => {
    setShowTableRows(false);
    setUsersTotalCount(0);
    setSearchIsDisabled(true);

    retrieveUser({
      searchValue: searchValue,
      sizeLimit: 0,
      apiVersion: apiVersion || API_VERSION_BACKUP,
      startIdx: firstUserIdx,
      stopIdx: lastUserIdx,
      entryType: "stage",
    } as GenericPayload).then((result) => {
      // Manage new response here
      if ("data" in result) {
        const searchError = result.data?.error as
          | FetchBaseQueryError
          | SerializedError;

        if (searchError) {
          // Error
          let error: string | undefined = "";
          if ("error" in searchError) {
            error = searchError.error;
          } else if ("message" in searchError) {
            error = searchError.message;
          }
          alerts.addAlert(
            "submit-search-value-error",
            error || "Error when searching for stage users",
            "danger"
          );
        } else {
          // Success
          const usersListResult = result.data?.result.results || [];
          const usersListSize = result.data?.result.count || 0;
          const totalCount = result.data?.result.totalCount || 0;
          const usersList: User[] = [];

          for (let i = 0; i < usersListSize; i++) {
            usersList.push(usersListResult[i].result);
          }

          // Update slice data
          dispatch(updateUsersList(usersList));
          setStageUsersList(usersList);
          setUsersTotalCount(totalCount);
          // Show table elements
          setShowTableRows(true);
        }
        setSearchIsDisabled(false);
      }
    });
  };

  // Show table rows
  const [showTableRows, setShowTableRows] = useState(!isBatchLoading);

  // Show table rows only when data is fully retrieved
  useEffect(() => {
    if (showTableRows !== !isBatchLoading) {
      setShowTableRows(!isBatchLoading);
    }
  }, [isBatchLoading]);

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const clearSelectedUsers = () => {
    const emptyList: User[] = [];
    setSelectedUsers(emptyList);
  };

  const updateSelectedUsers = (users: User[], isSelected: boolean) => {
    let newSelectedUsers: User[] = [];
    if (isSelected) {
      newSelectedUsers = JSON.parse(JSON.stringify(selectedUsers));
      for (let i = 0; i < users.length; i++) {
        if (
          selectedUsers.find(
            (selectedUser) => selectedUser.uid[0] === users[i].uid[0]
          )
        ) {
          // Already in the list
          continue;
        }
        // Add user to list
        newSelectedUsers.push(users[i]);
      }
    } else {
      // Remove user
      for (let i = 0; i < selectedUsers.length; i++) {
        let found = false;
        for (let ii = 0; ii < users.length; ii++) {
          if (selectedUsers[i].uid[0] === users[ii].uid[0]) {
            found = true;
            break;
          }
        }
        if (!found) {
          // Keep this valid selected entry
          newSelectedUsers.push(selectedUsers[i]);
        }
      }
    }
    setSelectedUsers(newSelectedUsers);
    setIsDeleteButtonDisabled(newSelectedUsers.length === 0);
  };

  // - Helper method to set the selected users from the table
  const setUserSelected = (user: User, isSelecting = true) => {
    if (isUserSelectable(user)) {
      updateSelectedUsers([user], isSelecting);
    }
  };

  // Modals functionality
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const onAddClickHandler = () => {
    setShowAddModal(true);
  };
  const onCloseAddModal = () => {
    setShowAddModal(false);
  };
  const onAddModalToggle = () => {
    setShowAddModal(!showAddModal);
  };
  const onDeleteHandler = () => {
    setShowDeleteModal(true);
  };
  const onDeleteModalToggle = () => {
    setShowDeleteModal(!showDeleteModal);
  };
  const onActivateHandler = () => {
    setShowActivateModal(true);
  };
  const onActivateModalToggle = () => {
    setShowActivateModal(!showActivateModal);
  };

  // Table-related shared functionality
  // - Selectable checkboxes on table
  const selectableUsersTable = stageUsersList.filter(isUserSelectable); // elements per Table

  // Data wrappers
  // - 'PaginationLayout'
  const paginationData = {
    page,
    perPage,
    updatePage,
    updatePerPage,
    updateSelectedPerPage,
    updateShownElementsList: updateShownUsersList,
    totalCount,
  };

  // - 'BulkSelectorPrep'
  const usersBulkSelectorData = {
    selected: selectedUsers,
    updateSelected: updateSelectedUsers,
    selectableTable: selectableUsersTable,
    nameAttr: "uid",
  };

  const buttonsData = {
    updateIsDeleteButtonDisabled,
  };

  const selectedPerPageData = {
    selectedPerPage,
    updateSelectedPerPage,
  };

  // 'DeleteUsers'
  const deleteUsersButtonsData = {
    updateIsDeleteButtonDisabled,
    updateIsDeletion,
  };

  const selectedUsersData = {
    selectedUsers,
    clearSelectedUsers,
  };

  // 'UsersTable'
  const usersTableData = {
    isUserSelectable,
    selectedUsers,
    selectableUsersTable,
    setUserSelected,
    clearSelectedUsers,
  };

  const usersTableButtonsData = {
    updateIsDeleteButtonDisabled,
    isDeletion,
    updateIsDeletion,
  };

  // 'SearchInputLayout'
  const searchValueData = {
    searchValue,
    updateSearchValue,
    submitSearchValue,
  };

  // Contextual links panel
  const [isContextualPanelExpanded, setIsContextualPanelExpanded] =
    React.useState(false);

  const onOpenContextualPanel = () => {
    setIsContextualPanelExpanded(!isContextualPanelExpanded);
  };

  const onCloseContextualPanel = () => {
    setIsContextualPanelExpanded(false);
  };

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={stageUsersList}
          shownElementsList={stageUsersList}
          elementData={usersBulkSelectorData}
          buttonsData={buttonsData}
          selectedPerPageData={selectedPerPageData}
        />
      ),
    },
    {
      key: 1,
      element: (
        <SearchInputLayout
          dataCy="search"
          name="search"
          ariaLabel="Search user"
          placeholder="Search"
          searchValueData={searchValueData}
          isDisabled={searchDisabled}
        />
      ),
      toolbarItemVariant: ToolbarItemVariant.label,
      toolbarItemGap: { default: "gapMd" },
    },
    {
      key: 2,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 3,
      element: (
        <SecondaryButton
          onClickHandler={refreshUsersData}
          isDisabled={!showTableRows}
          dataCy="stage-users-button-refresh"
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 4,
      element: (
        <SecondaryButton
          isDisabled={isDeleteButtonDisabled || !showTableRows}
          onClickHandler={onDeleteHandler}
          dataCy="stage-users-button-delete"
        >
          Delete
        </SecondaryButton>
      ),
    },
    {
      key: 5,
      element: (
        <SecondaryButton
          onClickHandler={onAddClickHandler}
          isDisabled={!showTableRows}
          dataCy="stage-users-button-add"
        >
          Add
        </SecondaryButton>
      ),
    },
    {
      key: 6,
      element: (
        <SecondaryButton
          isDisabled={!showTableRows || selectedUsers.length === 0}
          onClickHandler={onActivateHandler}
          dataCy="stage-users-button-activate"
        >
          Activate
        </SecondaryButton>
      ),
    },
    {
      key: 7,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 8,
      element: (
        <HelpTextWithIconLayout
          textContent="Help"
          onClick={onOpenContextualPanel}
        />
      ),
    },
    {
      key: 9,
      element: (
        <PaginationLayout
          list={stageUsersList}
          paginationData={paginationData}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  // Render 'Stage users'
  return (
    <ContextualHelpPanel
      fromPage="stage-users"
      isExpanded={isContextualPanelExpanded}
      onClose={onCloseContextualPanel}
    >
      <div>
        <alerts.ManagedAlerts />
        <PageSection hasBodyWrapper={false}>
          <TitleLayout
            id="stage users title"
            headingLevel="h1"
            text="Stage users"
          />
        </PageSection>
        <PageSection hasBodyWrapper={false} isFilled={false}>
          <Flex direction={{ default: "column" }}>
            <FlexItem>
              <ToolbarLayout toolbarItems={toolbarItems} />
            </FlexItem>
            <FlexItem style={{ flex: "0 0 auto" }}>
              <OuterScrollContainer>
                <InnerScrollContainer
                  style={{ height: "60vh", overflow: "auto" }}
                >
                  {batchError !== undefined && batchError ? (
                    <GlobalErrors errors={globalErrors.getAll()} />
                  ) : (
                    <UsersTable
                      shownElementsList={stageUsersList}
                      from="stage-users"
                      showTableRows={showTableRows}
                      usersData={usersTableData}
                      buttonsData={usersTableButtonsData}
                      paginationData={selectedPerPageData}
                      searchValue={searchValue}
                    />
                  )}
                </InnerScrollContainer>
              </OuterScrollContainer>
            </FlexItem>
            <FlexItem
              style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}
            >
              <PaginationLayout
                list={stageUsersList}
                paginationData={paginationData}
                variant={PaginationVariant.bottom}
                widgetId="pagination-options-menu-bottom"
              />
            </FlexItem>
          </Flex>
        </PageSection>
        <ModalErrors
          errors={modalErrors.getAll()}
          dataCy="stage-users-modal-error"
        />
        <AddUser
          show={showAddModal}
          from="stage-users"
          setShowTableRows={setShowTableRows}
          handleModalToggle={onAddModalToggle}
          onOpenAddModal={onAddClickHandler}
          onCloseAddModal={onCloseAddModal}
          onRefresh={refreshUsersData}
        />
        <DeleteUsers
          show={showDeleteModal}
          from="stage-users"
          handleModalToggle={onDeleteModalToggle}
          selectedUsersData={selectedUsersData}
          buttonsData={deleteUsersButtonsData}
          onRefresh={refreshUsersData}
        />
        <ActivateStageUsers
          show={showActivateModal}
          handleModalToggle={onActivateModalToggle}
          selectedUsers={selectedUsers}
          onSuccess={refreshUsersData}
        />
      </div>
    </ContextualHelpPanel>
  );
};

export default StageUsers;
