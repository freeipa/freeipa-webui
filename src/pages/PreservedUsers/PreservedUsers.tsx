import React, { useEffect, useState } from "react";
// PatternFly
import {
  Page,
  PaginationVariant,
  PageSection,
  PageSectionVariants,
  TextVariants,
} from "@patternfly/react-core";
// PatternFly table
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";
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
import PaginationPrep from "src/components/PaginationPrep";
import BulkSelectorUsersPrep from "src/components/BulkSelectorUsersPrep";
// Modals
import DeleteUsers from "src/components/modals/DeleteUsers";
import StagePreservedUsers from "src/components/modals/StagePreservedUsers";
import RestorePreservedUsers from "src/components/modals/RestorePreservedUsers";
// Hooks
import { updateUsersList } from "src/store/Identity/preservedUsers-slice";
// Utils
import { API_VERSION_BACKUP, isUserSelectable } from "src/utils/utils";
import { useGettingPreservedUserQuery, UsersPayload } from "src/services/rpc";
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";

const PreservedUsers = () => {
  // Initialize stage users list (Redux)
  const dispatch = useAppDispatch();

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
  const [searchValue, setSearchValue] = React.useState("");
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(15);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Users displayed on the first page
  const [shownUsersList, setShownUsersList] = useState<User[]>([]);

  // Derived states - what we get from API
  const userDataResponse = useGettingPreservedUserQuery({
    searchValue: "",
    sizeLimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
  } as UsersPayload);

  const {
    data: batchResponse,
    isLoading: isBatchLoading,
    error: batchError,
  } = userDataResponse;

  // Page indexes
  const firstUserIdx = (page - 1) * perPage;
  const lastUserIdx = page * perPage;

  // Handle data when the API call is finished
  useEffect(() => {
    if (userDataResponse.isFetching) {
      setShowTableRows(false);
      // Reset selected users on refresh
      setSelectedUserNames([]);
      setSelectedUserIds([]);
      setSelectedUsers([]);
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
      const usersList: User[] = [];

      for (let i = 0; i < usersListSize; i++) {
        usersList.push(usersListResult[i].result);
      }

      // Update 'Active users' slice data
      dispatch(updateUsersList(usersList));
      // Update the list of users
      setPreservedUsersList(usersList);
      // Update the shown users list
      setShownUsersList(usersList.slice(firstUserIdx, lastUserIdx));
      // Show table elements
      setShowTableRows(true);
    }

    // API response: Error
    if (
      !userDataResponse.isLoading &&
      userDataResponse.isError &&
      userDataResponse.error !== undefined
    ) {
      globalErrors.addError(
        batchError,
        "Error when loading data",
        "error-batch-users"
      );
    }
  }, [userDataResponse]);

  // Refresh button handling
  const refreshUsersData = () => {
    // Hide table
    setShowTableRows(false);

    // Reset selected users on refresh
    setSelectedUserNames([]);
    setSelectedUserIds([]);
    setSelectedUsers([]);

    userDataResponse.refetch();
  };

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  React.useEffect(() => {
    userDataResponse.refetch();
  }, []);

  // Selected users state
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const updateSelectedUsers = (newSelectedUsers: string[]) => {
    setSelectedUsers(newSelectedUsers);
  };

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

  const updateSelectedUserIds = (newSelectedUserIds: string[]) => {
    setSelectedUserIds(newSelectedUserIds);
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
    setShownUsersList(newShownUsersList);
  };

  // Filter (Input search)
  const updateSearchValue = (value: string) => {
    setSearchValue(value);
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

  // - Selected rows are tracked. Primary key: userLogin
  const [selectedUserNames, setSelectedUserNames] = useState<string[]>([]);

  const changeSelectedUserNames = (selectedUsernames: string[]) => {
    setSelectedUserNames(selectedUsernames);
  };

  // - Helper method to set the selected users from the table
  const setUserSelected = (user: User, isSelecting = true) =>
    setSelectedUserNames((prevSelected) => {
      const otherSelectedUserNames = prevSelected.filter((r) => r !== user.uid);
      return isSelecting && isUserSelectable(user)
        ? [...otherSelectedUserNames, user.uid]
        : otherSelectedUserNames;
    });

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
  // - 'PaginationPrep'
  const paginationData = {
    page,
    perPage,
    updatePage,
    updatePerPage,
    showTableRows,
    updateSelectedPerPage,
    updateShownElementsList: updateShownUsersList,
  };

  // - 'BulkSelectorPrep'
  const usersData = {
    selectedUsers,
    updateSelectedUsers,
    updateSelectedUserIds,
    selectedUserNames,
    changeSelectedUserNames,
    selectableUsersTable,
    isUserSelectable,
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
    updateSelectedUsers,
  };

  // 'UsersTable'
  const usersTableData = {
    isUserSelectable,
    selectedUserNames,
    changeSelectedUserNames,
    selectedUserIds,
    updateSelectedUserIds,
    selectableUsersTable,
    setUserSelected,
    updateSelectedUsers,
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
  };

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorUsersPrep
          list={preservedUsersList}
          shownElementsList={shownUsersList}
          usersData={usersData}
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
          textComponent={TextVariants.p}
          subTextComponent={TextVariants.a}
          subTextIsVisitedLink={true}
          textContent="Help"
          icon={
            <OutlinedQuestionCircleIcon className="pf-v5-u-primary-color-100 pf-v5-u-mr-sm" />
          }
        />
      ),
    },
    {
      key: 9,
      element: (
        <PaginationPrep
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
    <Page>
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
                  elementsList={preservedUsersList}
                  shownElementsList={shownUsersList}
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
        <PaginationPrep
          list={preservedUsersList}
          paginationData={paginationData}
          variant={PaginationVariant.bottom}
          widgetId="pagination-options-menu-bottom"
          perPageComponent="button"
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
        selectedUsersData={selectedUsersData}
        onRefresh={refreshUsersData}
      />
      <StagePreservedUsers
        show={showStageModal}
        handleModalToggle={onStageModalToggle}
        selectedUsersData={selectedUsersData}
        onRefresh={refreshUsersData}
      />
    </Page>
  );
};

export default PreservedUsers;
