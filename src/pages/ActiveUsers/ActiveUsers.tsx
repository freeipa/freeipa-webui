import React, { useEffect, useState } from "react";
// PatternFly
import {
  DropdownItem,
  Page,
  PageSection,
  PageSectionVariants,
  TextVariants,
  PaginationVariant,
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
import { useAppDispatch } from "src/store/hooks";
import { updateUsersList } from "src/store/Identity/activeUsers-slice";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import KebabLayout from "src/components/layouts/KebabLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
// Tables
import UsersTable from "../../components/tables/UsersTable";
// Components
import PaginationUsersPrep from "src/components/PaginationUsersPrep";
import BulkSelectorUsersPrep from "src/components/BulkSelectorUsersPrep";
// Modals
import AddUser from "src/components/modals/AddUser";
import DeleteUsers from "src/components/modals/DeleteUsers";
import DisableEnableUsers from "src/components/modals/DisableEnableUsers";
// Utils
import { isUserSelectable } from "src/utils/utils";
// RPC server
import {
  // CommandWithMethod,
  Command,
  UIDType,
  useBatchCommandQuery,
  useSimpleCommandQuery,
} from "src/store/services/rpc";
import TextLayout from "src/components/layouts/TextLayout";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";

const ActiveUsers = () => {
  // Dispatch (Redux)
  const dispatch = useAppDispatch();

  // Active users list
  const activeUsersList: User[] = [];

  //------- RETRIEVING INITIAL DATA ---------------
  // Step 1: Retrieve all uids
  const payloadDataUids: Command = {
    method: "user_find",
    params: [
      [],
      {
        pkey_only: true,
        sizelimit: 0,
        version: "2.251",
      },
    ],
  };
  const { data: userIdsData, error: uidsError } =
    useSimpleCommandQuery(payloadDataUids);

  const userIds: string[] = [];
  if (userIdsData !== undefined) {
    const returnedItems = userIdsData.result.count;
    for (let i = 0; i < returnedItems; i++) {
      const userId = userIdsData.result.result[i] as UIDType;
      const { uid } = userId;
      userIds.push(uid[0] as string);
    }
  }

  // Step 2: Batch operations
  const payloadDataBatch: Command[] = [];
  const infoType = { no_members: true };
  // const infoType = { all: true, rights: true };

  if (userIds.length > 0) {
    userIds.map((uid) => {
      const payloadItem = {
        method: "user_show",
        params: [[uid], infoType],
      };
      payloadDataBatch.push(payloadItem);
    });
  }

  let storedData = false;

  const {
    data: batchResponse,
    isLoading: isBatchLoading,
    error: batchError,
  } = useBatchCommandQuery(payloadDataBatch);

  if (batchResponse !== undefined) {
    // console.log("--> batchResponse");
    // console.log(batchResponse);
    const returnItems = batchResponse.result.count;
    const usersData = batchResponse.result.results;

    for (let i = 0; i < returnItems; i++) {
      activeUsersList.push(usersData[i].result);
    }

    // If user data retrieved, enable flag
    if (activeUsersList.length > 0) {
      storedData = true;
    }
  }

  // When users' data is fully retrieved, update:
  //   - Active users slice data (#1)
  //   - Users' list to show in the table (#2)
  useEffect(() => {
    if (storedData) {
      // #1
      dispatch(updateUsersList(activeUsersList));

      // #2
      setShownUsersList(activeUsersList.slice(0, perPage));
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

  // - Helper function to write JSX error messages into 'apiErrorsJsx' array
  const setApiError = (
    errorFromApiCall: FetchBaseQueryError | SerializedError | undefined,
    contextMessage: string,
    key: string
  ) => {
    if (errorFromApiCall !== undefined) {
      const errorJsx = [...apiErrorsJsx];

      if ("originalStatus" in errorFromApiCall) {
        // The original status is accessible here (error 401)
        errorJsx.push(
          <TextLayout component="p" key={key}>
            {errorFromApiCall.originalStatus + " " + contextMessage}
          </TextLayout>
        );
      } else if ("status" in errorFromApiCall) {
        // you can access all properties of `FetchBaseQueryError` here
        errorJsx.push(
          <TextLayout component="p" key={key}>
            {errorFromApiCall.status + " " + contextMessage}
          </TextLayout>
        );
      } else {
        // you can access all properties of `SerializedError` here
        errorJsx.push(
          <div key={key} style={{ alignSelf: "center", marginTop: "16px" }}>
            <TextLayout component="p">{contextMessage}</TextLayout>
            <TextLayout component="p">
              {"ERROR CODE: " + errorFromApiCall.code}
            </TextLayout>
            <TextLayout component="p">{errorFromApiCall.message}</TextLayout>
          </div>
        );
      }
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

  // - Gracefully handle 'uidsError' messages
  useEffect(() => {
    console.log("--> uidsError");
    console.log(uidsError);
    setApiError(uidsError, "Error when getting uids", "error-uids");
  }, [uidsError]);

  // - Gracefully handle 'batchError' messages
  useEffect(() => {
    console.log("--> batchError");
    console.log(batchError);
    setApiError(
      batchError,
      "Error when getting user data",
      "error-batch-users"
    );
  }, [batchError]);

  // ---------------------------

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
    useState("");

  const onAddClickHandler = () => {
    setShowAddModal(true);
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

  const onEnableDisableHandler = (optionClicked: string) => {
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
  // - 'PaginationPrep'
  const paginationData = {
    page,
    perPage,
    updatePage,
    updatePerPage,
    showTableRows,
    updateSelectedPerPage,
    updateShownUsersList,
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
      element: <SecondaryButton>Refresh</SecondaryButton>,
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
          onClickHandler={() => onEnableDisableHandler("disable")}
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
          onClickHandler={() => onEnableDisableHandler("enable")}
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
        <PaginationUsersPrep
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
              {uidsError !== undefined && uidsError ? (
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
        <PaginationUsersPrep
          list={activeUsersList}
          paginationData={paginationData}
          variant={PaginationVariant.bottom}
          widgetId="pagination-options-menu-bottom"
          perPageComponent="button"
          className="pf-u-pb-0 pf-u-pr-md"
        />
      </PageSection>
      {/* TODO: Adapt the action buttons to perform API calls */}
      {/* <AddUser
        show={showAddModal}
        from="active-users"
        handleModalToggle={onAddModalToggle}
      />
      <DeleteUsers
        show={showDeleteModal}
        from="active-users"
        handleModalToggle={onDeleteModalToggle}
        selectedUsersData={selectedUsersData}
        buttonsData={deleteUsersButtonsData}
      />
      <DisableEnableUsers
        show={showEnableDisableModal}
        from="active-users"
        handleModalToggle={onEnableDisableModalToggle}
        optionSelected={enableDisableOptionSelected}
        selectedUsersData={selectedUsersData}
        buttonsData={disableEnableButtonsData}
      /> */}
    </Page>
  );
};

export default ActiveUsers;
