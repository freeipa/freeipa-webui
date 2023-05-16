import React, { useEffect, useState } from "react";
// PatternFly
import {
  DropdownItem,
  Page,
  PageSection,
  PageSectionVariants,
  TextVariants,
  PaginationVariant,
  Button,
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
// Utils
import { apiErrorToJsXError, isUserSelectable } from "src/utils/utils";
// RPC client
import {
  Command,
  FindRPCResponse,
  BatchRPCResponse,
  UIDType,
  useBatchMutCommandMutation,
  useGettingUserDataQuery,
  useSimpleMutCommandMutation,
} from "src/services/rpc";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
import ErrorModal from "src/components/modals/ErrorModal";

const ActiveUsers = () => {
  // Dispatch (Redux)
  const dispatch = useAppDispatch();

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  // Active users list
  const usersList: User[] = [];
  const [activeUsersList, setActiveUsersList] = useState<User[]>([]);

  // Define 'executeCommand' to execute simple commands (via Mutation)
  const [executeCommand] = useSimpleMutCommandMutation();

  // Define 'executeBatchCommand' to execute a batch of operations (via Mutation)
  const [executeBatchCommand] = useBatchMutCommandMutation();

  // [API Call] Retrieve partial user info from multiple query
  const {
    data: batchResponse,
    isLoading: isBatchLoading,
    error: batchError,
  } = useGettingUserDataQuery(apiVersion);

  let storedData = false;

  if (batchResponse !== undefined) {
    const returnItems = batchResponse.result.count;
    const usersData = batchResponse.result.results;

    for (let i = 0; i < returnItems; i++) {
      usersList.push(usersData[i].result);
    }

    // If user data retrieved, enable flag
    if (usersList.length > 0) {
      storedData = true;
    }
  }

  // When users' data is fully retrieved, update:
  //   - Active users list (#1)
  //   - Active users slice data (#2)
  //   - Users' list to show in the table (#3)
  useEffect(() => {
    if (storedData) {
      // #1
      setActiveUsersList(usersList);

      // #2
      dispatch(updateUsersList(usersList));

      // #3
      setShownUsersList(usersList.slice(0, perPage));
    }
  }, [storedData]);

  // Handle API calls errors
  // See: https://redux-toolkit.js.org/rtk-query/usage-with-typescript#type-safe-error-handling
  // - Errors array
  const [apiErrorsJsx, setApiErrorsJsx] = useState<JSX.Element[]>([]);

  // - Global error message (JSX wrapper to display the array above)
  const [errorGlobalMessage, setErrorGlobalMessage] = useState<JSX.Element>(
    <></>
  );

  // - Catch API errors and write them in the error's list ('apiErrors')
  const setApiError = (
    errorFromApiCall: FetchBaseQueryError | SerializedError | undefined,
    contextMessage: string,
    key: string
  ) => {
    if (errorFromApiCall !== undefined) {
      const jsxError = apiErrorToJsXError(
        errorFromApiCall,
        contextMessage,
        key
      );

      const errorJsx = [...apiErrorsJsx];
      errorJsx.push(jsxError);
      setApiErrorsJsx(errorJsx);
    }
  };

  // - Keep 'errorGlobalMessage' data updated with recent changes (in 'apiErrorsJsx')
  useEffect(() => {
    setErrorGlobalMessage(
      <div style={{ alignSelf: "center", marginTop: "16px" }}>
        <TextLayout component="h3">An error has occurred</TextLayout>
        {apiErrorsJsx}
      </div>
    );
  }, [apiErrorsJsx]);

  // - Gracefully handle 'batchError' messages
  useEffect(() => {
    setApiError(batchError, "Error when loading data", "error-batch-users");
  }, [batchError]);

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
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

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
  const [page, setPage] = useState<number>(1);

  const updatePage = (newPage: number) => {
    setPage(newPage);
  };

  const [perPage, setPerPage] = useState<number>(15);

  const updatePerPage = (newSetPerPage: number) => {
    setPerPage(newSetPerPage);
  };

  // Users displayed on the first page
  const [shownUsersList, setShownUsersList] = useState(
    activeUsersList.slice(0, perPage)
  );

  const updateShownUsersList = (newShownUsersList: User[]) => {
    setShownUsersList(newShownUsersList);
  };

  // Filter (Input search)
  const [searchValue, setSearchValue] = React.useState("");

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

  // Dropdown kebab
  const [kebabIsOpen, setKebabIsOpen] = useState(false);

  const dropdownItems = [
    <DropdownItem key="action" component="button">
      Rebuild auto membership
    </DropdownItem>,
  ];

  const onKebabToggle = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: any,
    isOpen: boolean
  ) => {
    setKebabIsOpen(isOpen);
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

  // Updates the 'activeUsersList'
  const updateActiveUsersList = (newUsersList) => {
    const usersList: User[] = [];
    for (let i = 0; i < newUsersList.length; i++) {
      if (newUsersList[i].result !== undefined) {
        const user = newUsersList[i].result as User;
        usersList.push(user);
      }
    }
    setActiveUsersList(usersList);
    return usersList;
  };

  // Handle API error data
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const closeAndCleanErrorParameters = () => {
    setIsModalErrorOpen(false);
    setErrorTitle("");
    setErrorMessage("");
  };

  const onCloseErrorModal = () => {
    closeAndCleanErrorParameters();
  };

  const errorModalActions = [
    <Button key="cancel" variant="link" onClick={onCloseErrorModal}>
      Cancel
    </Button>,
  ];

  const handleAPIError = (error: FetchBaseQueryError | SerializedError) => {
    if ("error" in error) {
      setErrorTitle("IPA error");
      if (error.data !== undefined) {
        setErrorMessage(error.error);
      }
    }
    setIsModalErrorOpen(true);
  };

  // Update user data in Redux
  const updateDataToRedux = (newUsersList: User[]) => {
    dispatch(updateUsersList(newUsersList));
  };

  // Refresh data
  const refreshUsersData = (listToRefresh: User[]) => {
    // Hide table elements
    setShowTableRows(false);

    // Getting uids
    const userFindPayload: Command = {
      method: "user_find",
      params: [
        [],
        {
          pkey_only: true,
          sizelimit: 0,
          version: apiVersion,
        },
      ],
    };

    // 1.- Retrieving user ids
    executeCommand(userFindPayload).then((userFindRes) => {
      if ("data" in userFindRes) {
        const data = userFindRes.data as FindRPCResponse;
        const uids = data.result.result;
        const uidsSize = data.result.count;
        const uidsError = userFindRes.data.error as
          | FetchBaseQueryError
          | SerializedError;

        if (uids !== undefined) {
          // Getting list of users
          const userIds: string[] = [];
          const returnedItems = uidsSize;
          for (let i = 0; i < returnedItems; i++) {
            const userId = uids[i] as UIDType;
            const { uid } = userId;
            userIds.push(uid[0] as string);
          }

          const payloadUserDataBatch: Command[] = [];
          const infoType = { no_members: true };
          if (userIds.length > 0) {
            userIds.map((uid) => {
              const payloadItem = {
                method: "user_show",
                params: [[uid], infoType],
              };
              payloadUserDataBatch.push(payloadItem);
            });
          }

          // 2.- Retrieving users list (based on uids)
          executeBatchCommand(payloadUserDataBatch).then((userListRes) => {
            if ("data" in userListRes) {
              const responseData = userListRes.data as BatchRPCResponse;
              const usersList = responseData.result.results;
              const usersListSize = responseData.result.count;
              const usersListError = responseData.error as
                | FetchBaseQueryError
                | SerializedError;

              if (usersList !== undefined) {
                listToRefresh = [];
                for (let i = 0; i < usersListSize; i++) {
                  listToRefresh.push(usersList[i]);
                }

                // Update 'activeUsersList'
                const newActiveUsersList = updateActiveUsersList(listToRefresh);
                // Update 'shownUsersList'
                setShownUsersList(newActiveUsersList.slice(0, perPage));

                // Update changes to Redux
                updateDataToRedux(newActiveUsersList);

                // If user data retrieved, enable flag
                if (listToRefresh.length > 0) {
                  storedData = true;
                }

                // Show table elements
                setShowTableRows(true);
              } else if (usersListError !== undefined) {
                // TODO: Handle error
                handleAPIError(usersListError);
              }
            }
          });
        } else if (uidsError !== undefined) {
          // TODO: Handle error
          handleAPIError(uidsError);
        }
      } else if ("error" in userFindRes) {
        const error = {
          status: "CUSTOM_ERROR",
          data: "",
          error: "Unable to retrieve users' data",
        } as FetchBaseQueryError;
        handleAPIError(error as FetchBaseQueryError);
      }
    });
  };

  // Refresh 'Active users' list
  const refreshActiveUsersList = () => {
    refreshUsersData(activeUsersList);
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
          onClickHandler={() => refreshUsersData(activeUsersList)}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 4,
      element: (
        <SecondaryButton
          isDisabled={isDeleteButtonDisabled}
          onClickHandler={onDeleteHandler}
        >
          Delete
        </SecondaryButton>
      ),
    },
    {
      key: 5,
      element: (
        <SecondaryButton onClickHandler={onAddClickHandler}>
          Add
        </SecondaryButton>
      ),
    },
    {
      key: 6,
      element: (
        <SecondaryButton
          isDisabled={isDisableButtonDisabled}
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
          isDisabled={isEnableButtonDisabled}
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
          dropdownItems={dropdownItems}
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
            <OutlinedQuestionCircleIcon className="pf-u-primary-color-100 pf-u-mr-sm" />
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
    <Page>
      <PageSection variant={PageSectionVariants.light}>
        <TitleLayout
          id="active users title"
          headingLevel="h1"
          text="Active users"
        />
      </PageSection>
      <PageSection
        variant={PageSectionVariants.light}
        isFilled={false}
        className="pf-u-m-lg pf-u-pb-md pf-u-pl-0 pf-u-pr-0"
      >
        <ToolbarLayout
          className="pf-u-pt-0 pf-u-pl-lg pf-u-pr-md"
          contentClassName="pf-u-p-0"
          toolbarItems={toolbarItems}
        />
        <div style={{ height: `calc(100vh - 352.2px)` }}>
          <OuterScrollContainer>
            <InnerScrollContainer>
              {batchError !== undefined && batchError ? (
                <>{errorGlobalMessage}</>
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
          className="pf-u-pb-0 pf-u-pr-md"
        />
      </PageSection>
      <AddUser
        show={showAddModal}
        from="active-users"
        setShowTableRows={setShowTableRows}
        handleModalToggle={onAddModalToggle}
        onOpenAddModal={onAddClickHandler}
        onCloseAddModal={onCloseAddModal}
        onRefresh={() => refreshUsersData(activeUsersList)}
      />
      <DeleteUsers
        show={showDeleteModal}
        from="active-users"
        handleModalToggle={onDeleteModalToggle}
        selectedUsersData={selectedUsersData}
        buttonsData={deleteUsersButtonsData}
        onRefresh={refreshActiveUsersList}
        onCloseDeleteModal={onCloseDeleteModal}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      {/* <DisableEnableUsers
        show={showEnableDisableModal}
        from="active-users"
        handleModalToggle={onEnableDisableModalToggle}
        optionSelected={enableDisableOptionSelected}
        selectedUsersData={selectedUsersData}
        buttonsData={disableEnableButtonsData}
      /> */}
      {isModalErrorOpen && (
        <ErrorModal
          title={errorTitle}
          isOpen={isModalErrorOpen}
          onClose={onCloseErrorModal}
          actions={errorModalActions}
          errorMessage={errorMessage}
        />
      )}
    </Page>
  );
};

export default ActiveUsers;
