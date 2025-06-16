import React, { useEffect, useState } from "react";
// PatternFly
import {
  Page,
  PaginationVariant,
  PageSection,
  PageSectionVariants,
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
import BulkSelectorPrep from "src/components/BulkSelectorPrep/BulkSelectorPrep";
import ContextualHelpPanel from "src/components/ContextualHelpPanel/ContextualHelpPanel";
// Modals
import DeleteUsers from "src/components/modals/UserModals/DeleteUsers";
import StagePreservedUsers from "src/components/modals/UserModals/StagePreservedUsers";
import RestorePreservedUsers from "src/components/modals/UserModals/RestorePreservedUsers";
// Hooks
import { updateUsersList } from "src/store/Identity/preservedUsers-slice";
import { useAlerts } from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
// Utils
import { API_VERSION_BACKUP, isUserSelectable } from "src/utils/utils";
import { GenericPayload, useSearchEntriesMutation } from "../../services/rpc";
import { useGettingPreservedUserQuery } from "../../services/rpcUsers";
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";

const PreservedUsers = () => {
  // Initialize stage users list (Redux)
  const dispatch = useAppDispatch();

  // URL parameters: page number, page size, search value
  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({ pathname: "preserved-users" });

  // Set the page title to be shown in the browser tab
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  // Alerts to show in the UI
  const alerts = useAlerts();

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  // Preservered users list
  const [preservedUsersList, setPreservedUsersList] = useState<User[]>([]);

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
  const userDataResponse = useGettingPreservedUserQuery({
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
      // Update 'Active users' slice data
      dispatch(updateUsersList(usersList));
      // Update the list of users
      setPreservedUsersList(usersList);
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
    setPreservedUsersList(newShownUsersList);
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
      entryType: "preserved",
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
            error || "Error when searching for preserved users",
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
          setPreservedUsersList(usersList);
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

  // Table-related shared functionality
  // - Selectable checkboxes on table
  const selectableUsersTable = preservedUsersList.filter(isUserSelectable); // elements per Table

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const onDeleteHandler = () => {
    setShowDeleteModal(true);
  };
  const onDeleteModalToggle = () => {
    setShowDeleteModal(!showDeleteModal);
  };
  const onRestoreHandler = () => {
    setShowRestoreModal(true);
  };
  const onRestoreModalToggle = () => {
    setShowRestoreModal(!showRestoreModal);
  };
  const onStageHandler = () => {
    setShowStageModal(true);
  };
  const onStageModalToggle = () => {
    setShowStageModal(!showStageModal);
  };

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
    isDeleteButtonDisabled,
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

  // SearchInputLayout
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
          list={preservedUsersList}
          shownElementsList={preservedUsersList}
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
          name="search"
          ariaLabel="Search user"
          placeholder="Search"
          searchValueData={searchValueData}
          isDisabled={searchDisabled}
        />
      ),
      toolbarItemVariant: "search-filter",
      toolbarItemSpacer: { default: "spacerMd" },
    },
    {
      key: 2,
      toolbarItemVariant: "separator",
    },
    {
      key: 3,
      element: (
        <SecondaryButton
          onClickHandler={refreshUsersData}
          isDisabled={!showTableRows}
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
        >
          Delete
        </SecondaryButton>
      ),
    },
    {
      key: 5,
      element: (
        <SecondaryButton
          isDisabled={!showTableRows || selectedUsers.length === 0}
          onClickHandler={onRestoreHandler}
        >
          Restore
        </SecondaryButton>
      ),
    },
    {
      key: 6,
      element: (
        <SecondaryButton
          isDisabled={!showTableRows || selectedUsers.length === 0}
          onClickHandler={onStageHandler}
        >
          Stage
        </SecondaryButton>
      ),
    },
    {
      key: 7,
      toolbarItemVariant: "separator",
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
          list={preservedUsersList}
          paginationData={paginationData}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignRight" },
    },
  ];

  // Render 'Preserved users'
  return (
    <ContextualHelpPanel
      fromPage="preserved-users"
      isExpanded={isContextualPanelExpanded}
      onClose={onCloseContextualPanel}
    >
      <Page>
        <alerts.ManagedAlerts />
        <PageSection variant={PageSectionVariants.light}>
          <TitleLayout
            id="preserved users title"
            headingLevel="h1"
            text="Preserved users"
          />
        </PageSection>
        <PageSection
          variant={PageSectionVariants.light}
          isFilled={false}
          className="pf-v5-u-m-lg pf-v5-u-pb-md pf-v5-u-pl-0 pf-v5-u-pr-0"
        >
          <ToolbarLayout
            className="pf-v5-u-pt-0 pf-v5-u-pl-lg pf-v5-u-pr-md"
            contentClassName="pf-v5-u-p-0"
            toolbarItems={toolbarItems}
          />
          <div style={{ height: `calc(100vh - 352.2px)` }}>
            <OuterScrollContainer>
              <InnerScrollContainer>
                {batchError !== undefined && batchError ? (
                  <GlobalErrors errors={globalErrors.getAll()} />
                ) : (
                  <UsersTable
                    shownElementsList={preservedUsersList}
                    from="preserved-users"
                    showTableRows={showTableRows}
                    usersData={usersTableData}
                    buttonsData={usersTableButtonsData}
                    paginationData={selectedPerPageData}
                    searchValue={searchValue}
                  />
                )}
              </InnerScrollContainer>
            </OuterScrollContainer>
          </div>
          <PaginationLayout
            list={preservedUsersList}
            paginationData={paginationData}
            variant={PaginationVariant.bottom}
            widgetId="pagination-options-menu-bottom"
            className="pf-v5-u-pb-0 pf-v5-u-pr-md"
          />
        </PageSection>
        <ModalErrors errors={modalErrors.getAll()} />
        <DeleteUsers
          show={showDeleteModal}
          from="preserved-users"
          handleModalToggle={onDeleteModalToggle}
          selectedUsersData={selectedUsersData}
          buttonsData={deleteUsersButtonsData}
          onRefresh={refreshUsersData}
        />
        <RestorePreservedUsers
          show={showRestoreModal}
          handleModalToggle={onRestoreModalToggle}
          selectedUsers={selectedUsers}
          clearSelectedUsers={clearSelectedUsers}
          onSuccess={refreshUsersData}
        />
        <StagePreservedUsers
          show={showStageModal}
          handleModalToggle={onStageModalToggle}
          selectedUsers={selectedUsers}
          clearSelectedUsers={clearSelectedUsers}
          onSuccess={refreshUsersData}
        />
      </Page>
    </ContextualHelpPanel>
  );
};

export default PreservedUsers;
