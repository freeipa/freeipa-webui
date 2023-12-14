import React, { useEffect, useState } from "react";
// PatternFly
import {
  Page,
  PageSection,
  PageSectionVariants,
  TextVariants,
  PaginationVariant,
  Button,
} from "@patternfly/react-core";
import { DropdownItem } from "@patternfly/react-core/deprecated";
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
import { updateUsersList } from "src/store/Identity/activeUsers-slice";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import KebabLayout from "src/components/layouts/KebabLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
import TextLayout from "src/components/layouts/TextLayout";
// Tables
import UsersTable from "../../components/tables/UsersTable";
// Components
import PaginationPrep from "src/components/PaginationPrep";
import BulkSelectorUsersPrep from "src/components/BulkSelectorUsersPrep";
// Modals
import AddUser from "src/components/modals/AddUser";
import DeleteUsers from "src/components/modals/DeleteUsers";
import DisableEnableUsers from "src/components/modals/DisableEnableUsers";
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Hooks
import { useAlerts } from "src/hooks/useAlerts";
// Utils
import { API_VERSION_BACKUP, isUserSelectable } from "src/utils/utils";

// RPC client
import {
  Command,
  useGettingActiveUserQuery,
  useAutoMemberRebuildUsersMutation,
  UsersPayload,
} from "src/services/rpc";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";

const ActiveUsers = () => {
  // Dispatch (Redux)
  const dispatch = useAppDispatch();

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  const [activeUsersList, setActiveUsersList] = useState<User[]>([]);

  // Define 'executeCommand' to execute simple commands (via Mutation)
  const [executeAutoMemberRebuild] = useAutoMemberRebuildUsersMutation();

  // Alerts to show in the UI
  const alerts = useAlerts();

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

  // Button disabled due to error
  const [isDisabledDueError, setIsDisabledDueError] = useState<boolean>(false);

  // Derived states - what we get from API
  const userDataResponse = useGettingActiveUserQuery({
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
      setIsDisabledDueError(false);
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
      setActiveUsersList(usersList);
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
      setIsDisabledDueError(true);
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

  // 'Enable' button state
  const [isEnableButtonDisabled, setIsEnableButtonDisabled] =
    useState<boolean>(true);

  const updateIsEnableButtonDisabled = (value: boolean) => {
    setIsEnableButtonDisabled(value);
  };

  // 'Disable' button state
  const [isDisableButtonDisabled, setIsDisableButtonDisabled] =
    useState<boolean>(true);

  const updateIsDisableButtonDisabled = (value: boolean) => {
    setIsDisableButtonDisabled(value);
  };

  // If some entries' status has been updated, unselect selected rows
  const [isDisableEnableOp, setIsDisableEnableOp] = useState(false);

  const updateIsDisableEnableOp = (value: boolean) => {
    setIsDisableEnableOp(value);
  };

  // - Selected user ids state
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

  // [API call] 'Rebuild auto membership'
  // TODO: Move this into a separate component
  const onRebuildAutoMembership = () => {
    // Task can potentially run for a very long time, give feed back that we
    // at least started the task
    alerts.addAlert(
      "rebuild-automember-start",
      "Starting automember rebuild membership task (this may take a long " +
        "time to complete) ...",
      "info"
    );
    executeAutoMemberRebuild(selectedUsers).then((result) => {
      if ("data" in result) {
        const automemberError = result.data.error as
          | FetchBaseQueryError
          | SerializedError;

        if (automemberError) {
          // alert: error
          let error: string | undefined = "";
          if ("error" in automemberError) {
            error = automemberError.error;
          } else if ("message" in automemberError) {
            error = automemberError.message;
          }

          alerts.addAlert(
            "rebuild-automember-error",
            error || "Error when rebuilding membership",
            "danger"
          );
        } else {
          // alert: success
          alerts.addAlert(
            "rebuild-automember-success",
            "Automember rebuild membership task completed",
            "success"
          );
        }
        // Hide modal
        setIsMembershipModalOpen(!isMembershipModalOpen);
      }
    });
  };

  // 'Rebuild auto membership' modal
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);

  const membershipModalActions: JSX.Element[] = [
    <Button
      key="rebuild-auto-membership"
      variant="primary"
      onClick={onRebuildAutoMembership}
      form="rebuild-auto-membership-modal"
    >
      OK
    </Button>,
    <Button
      key="cancel-rebuild-auto-membership"
      variant="link"
      onClick={() => setIsMembershipModalOpen(!isMembershipModalOpen)}
    >
      Cancel
    </Button>,
  ];

  // 'Rebuild auto membership' modal fields: Confirmation question
  const confirmationQuestion = [
    {
      id: "question-text",
      pfComponent: (
        <TextLayout component="p">
          <b>Warning</b> In case of a high number of users, hosts or groups, the
          rebuild task may require high CPU usage. This can severely impact
          server performance. Typically this only needs to be done once after
          importing raw data into the server. Are you sure you want to rebuild
          the auto memberships?
        </TextLayout>
      ),
    },
  ];

  // Dropdown kebab
  const [kebabIsOpen, setKebabIsOpen] = useState(false);

  const dropdownItems = [
    <DropdownItem
      key="action"
      component="button"
      onClick={() => setIsMembershipModalOpen(!isMembershipModalOpen)}
    >
      Rebuild auto membership
    </DropdownItem>,
  ];

  const onKebabToggle = () => {
    setKebabIsOpen(!kebabIsOpen);
  };

  const onDropdownSelect = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event?: React.SyntheticEvent<HTMLDivElement, Event> | undefined
  ) => {
    setKebabIsOpen(!kebabIsOpen);
  };

  // Modals functionality
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEnableDisableModal, setShowEnableDisableModal] = useState(false);
  const [enableDisableOptionSelected, setEnableDisableOptionSelected] =
    useState(false);
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

  const onOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const onCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const onDeleteModalToggle = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const onEnableDisableHandler = (optionClicked: boolean) => {
    setIsDeleteButtonDisabled(true); // prevents 'Delete' button to be enabled
    setIsEnableButtonDisabled(true); // prevents 'Enable' button to be enabled
    setIsDisableButtonDisabled(true); // prevents 'Disable' button to be enabled
    setEnableDisableOptionSelected(optionClicked);
    setShowEnableDisableModal(true);
  };

  const onEnableDisableModalToggle = () => {
    setIsEnableButtonDisabled(true); // prevents 'Enable' button to be enabled
    setIsDisableButtonDisabled(true); // prevents 'Disable' button to be enabled
    setShowEnableDisableModal(!showEnableDisableModal);
  };

  // Table-related shared functionality
  // - Selectable checkboxes on table
  const selectableUsersTable = activeUsersList.filter(isUserSelectable); // elements per Table

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

  // Data wrappers
  // TODO: Better separation of concerts
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

  // - 'BulkSelectorUsersPrep'
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
    updateIsDeleteButtonDisabled,
    updateIsEnableButtonDisabled,
    updateIsDisableButtonDisabled,
    updateIsDisableEnableOp,
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

  // 'DisableEnableUsers'
  const disableEnableButtonsData = {
    updateIsEnableButtonDisabled,
    updateIsDisableButtonDisabled,
    updateIsDisableEnableOp,
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
    updateIsEnableButtonDisabled,
    updateIsDisableButtonDisabled,
    isDeletion,
    updateIsDeletion,
    isDisableEnableOp,
    updateIsDisableEnableOp,
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
          list={activeUsersList}
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
          onClickHandler={onAddClickHandler}
          isDisabled={!showTableRows || isDisabledDueError}
        >
          Add
        </SecondaryButton>
      ),
    },
    {
      key: 6,
      element: (
        <SecondaryButton
          isDisabled={isDisableButtonDisabled || !showTableRows}
          onClickHandler={() => onEnableDisableHandler(true)}
        >
          Disable
        </SecondaryButton>
      ),
    },
    {
      key: 7,
      element: (
        <SecondaryButton
          isDisabled={isEnableButtonDisabled || !showTableRows}
          onClickHandler={() => onEnableDisableHandler(false)}
        >
          Enable
        </SecondaryButton>
      ),
    },
    {
      key: 8,
      element: (
        <KebabLayout
          onDropdownSelect={onDropdownSelect}
          onKebabToggle={onKebabToggle}
          idKebab="main-dropdown-kebab"
          isKebabOpen={kebabIsOpen}
          isPlain={true}
          dropdownItems={showTableRows ? dropdownItems : []}
        />
      ),
    },
    {
      key: 9,
      toolbarItemVariant: "separator",
    },
    {
      key: 10,
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
      key: 11,
      element: (
        <PaginationPrep
          list={activeUsersList}
          paginationData={paginationData}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignRight" },
    },
  ];

  // Render 'Active users'
  return (
    <>
      <alerts.ManagedAlerts />
      <Page>
        <PageSection variant={PageSectionVariants.light}>
          <TitleLayout
            id="active users title"
            headingLevel="h1"
            text="Active Users"
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
                    elementsList={activeUsersList}
                    shownElementsList={shownUsersList}
                    from="active-users"
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
            list={activeUsersList}
            paginationData={paginationData}
            variant={PaginationVariant.bottom}
            widgetId="pagination-options-menu-bottom"
            perPageComponent="button"
            className="pf-v5-u-pb-0 pf-v5-u-pr-md"
          />
        </PageSection>
        <AddUser
          show={showAddModal}
          from="active-users"
          handleModalToggle={onAddModalToggle}
          onOpenAddModal={onAddClickHandler}
          onCloseAddModal={onCloseAddModal}
          onRefresh={refreshUsersData}
        />
        <DeleteUsers
          show={showDeleteModal}
          from="active-users"
          handleModalToggle={onDeleteModalToggle}
          selectedUsersData={selectedUsersData}
          buttonsData={deleteUsersButtonsData}
          onRefresh={refreshUsersData}
          onCloseDeleteModal={onCloseDeleteModal}
          onOpenDeleteModal={onOpenDeleteModal}
        />
        <DisableEnableUsers
          show={showEnableDisableModal}
          from="active-users"
          handleModalToggle={onEnableDisableModalToggle}
          optionSelected={enableDisableOptionSelected}
          selectedUsersData={selectedUsersData}
          buttonsData={disableEnableButtonsData}
          onRefresh={refreshUsersData}
        />
        <ModalErrors errors={modalErrors.getAll()} />
        {isMembershipModalOpen && (
          <ModalWithFormLayout
            variantType="medium"
            modalPosition="top"
            offPosition="76px"
            title="Confirmation"
            formId="rebuild-auto-membership-modal"
            fields={confirmationQuestion}
            show={isMembershipModalOpen}
            onClose={() => setIsMembershipModalOpen(!isMembershipModalOpen)}
            actions={membershipModalActions}
          />
        )}
      </Page>
    </>
  );
};

export default ActiveUsers;
