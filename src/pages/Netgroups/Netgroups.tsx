import React, { useEffect, useState } from "react";
// PatternFly
import {
  Page,
  PageSection,
  PageSectionVariants,
  PaginationVariant,
  TextVariants,
} from "@patternfly/react-core";
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
// Components
import BulkSelectorNetgroupsPrep from "src/components/BulkSelectorNetgroupsPrep";
import PaginationLayout from "src/components/layouts/PaginationLayout";
// Tables
import NetgroupsTable from "src/pages/Netgroups/NetgroupsTable";
// Modal
import AddNetgroup from "src/components/modals/AddNetgroup";
import DeleteNetgroups from "src/components/modals/DeleteNetgroups";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { updateNetgroupsList } from "src/store/Identity/netgroups-slice";
// Data types
import { Netgroup } from "src/utils/datatypes/globalDataTypes";
// Utils
import { API_VERSION_BACKUP, isNetgroupSelectable } from "src/utils/utils";
// Hooks
import { useAlerts } from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";
// RPC client
import { GenericPayload, useSearchEntriesMutation } from "../../services/rpc";
import { useGettingNetgroupsQuery } from "../../services/rpcNetgroups";

const Netgroups = () => {
  // Dispatch (Redux)
  const dispatch = useAppDispatch();

  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({ pathname: "netgroups" });

  // Set the page title to be shown in the browser tab
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  // Initialize groups list (Redux)
  const [groupsList, setGroupsList] = useState<Netgroup[]>([]);

  // Alerts to show in the UI
  const alerts = useAlerts();

  // URL parameters: page number, page size, search value
  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  // Handle API calls errors
  const globalErrors = useApiError([]);
  const modalErrors = useApiError([]);

  // Table comps
  const [selectedPerPage, setSelectedPerPage] = useState<number>(0);
  const [totalCount, setGroupsTotalCount] = useState<number>(0);
  const [searchDisabled, setSearchIsDisabled] = useState<boolean>(false);

  const updateSelectedPerPage = (selected: number) => {
    setSelectedPerPage(selected);
  };
  const updatePage = (newPage: number) => {
    setPage(newPage);
  };
  const updatePerPage = (newSetPerPage: number) => {
    setPerPage(newSetPerPage);
  };

  // 'Delete' button state
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    useState<boolean>(true);

  const updateIsDeleteButtonDisabled = (value: boolean) => {
    setIsDeleteButtonDisabled(value);
  };

  // If some entries have been deleted, restore the selectedGroups list
  const [isDeletion, setIsDeletion] = useState(false);

  const updateIsDeletion = (value: boolean) => {
    setIsDeletion(value);
  };

  const updateShownGroupsList = (newShownGroupsList: Netgroup[]) => {
    setGroupsList(newShownGroupsList);
  };

  // Button disabled due to error
  const [isDisabledDueError, setIsDisabledDueError] = useState<boolean>(false);

  // Page indexes
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  // Derived states - what we get from API
  const groupDataResponse = useGettingNetgroupsQuery({
    searchValue: searchValue,
    sizeLimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
    startIdx: firstIdx,
    stopIdx: lastIdx,
  } as GenericPayload);

  const {
    data: batchResponse,
    isLoading: isBatchLoading,
    error: batchError,
  } = groupDataResponse;

  // Handle data when the API call is finished
  useEffect(() => {
    if (groupDataResponse.isFetching) {
      setShowTableRows(false);
      // Reset selected user groups on refresh
      setGroupsTotalCount(0);
      globalErrors.clear();
      setIsDisabledDueError(false);
      return;
    }

    // API response: Success
    if (
      groupDataResponse.isSuccess &&
      groupDataResponse.data &&
      batchResponse !== undefined
    ) {
      const groupsListResult = batchResponse.result.results;
      const totalCount = batchResponse.result.totalCount;
      const groupsListSize = batchResponse.result.count;
      const groupsList: Netgroup[] = [];

      for (let i = 0; i < groupsListSize; i++) {
        groupsList.push(groupsListResult[i].result);
      }

      // Update 'Groups' slice data
      dispatch(updateNetgroupsList(groupsList));
      setGroupsList(groupsList);
      setGroupsTotalCount(totalCount);
      // Show table elements
      setShowTableRows(true);
    }

    // API response: Error
    if (
      !groupDataResponse.isLoading &&
      groupDataResponse.isError &&
      groupDataResponse.error !== undefined
    ) {
      setIsDisabledDueError(true);
      globalErrors.addError(
        batchError,
        "Error when loading data",
        "error-batch-groups"
      );
    }
  }, [groupDataResponse]);

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  useEffect(() => {
    groupDataResponse.refetch();
  }, [page, perPage]);

  // Refresh button handling
  const refreshGroupsData = () => {
    // Hide table
    setShowTableRows(false);

    // Reset selected netgroups on refresh
    setGroupsTotalCount(0);
    clearSelectedGroups();
    setPage(1);
    groupDataResponse.refetch();
  };

  const updateSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const [selectedGroups, setSelectedGroupsList] = useState<Netgroup[]>([]);
  const clearSelectedGroups = () => {
    const emptyList: Netgroup[] = [];
    setSelectedGroupsList(emptyList);
  };

  const [retrieveGroup] = useSearchEntriesMutation({});

  // Issue a search using a specific search value
  const submitSearchValue = () => {
    setShowTableRows(false);
    setGroupsTotalCount(0);
    setSearchIsDisabled(true);
    retrieveGroup({
      searchValue: searchValue,
      sizeLimit: 0,
      apiVersion: apiVersion || API_VERSION_BACKUP,
      startIdx: firstIdx,
      stopIdx: lastIdx,
      entryType: "netgroup",
    } as GenericPayload).then((result) => {
      // Manage new response here
      if ("data" in result) {
        const searchError = result.data.error as
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
            error || "Error when searching for netgroups",
            "danger"
          );
        } else {
          // Success
          const groupsListResult = result.data.result.results;
          const groupsListSize = result.data.result.count;
          const totalCount = result.data.result.totalCount;
          const groupsList: Netgroup[] = [];

          for (let i = 0; i < groupsListSize; i++) {
            groupsList.push(groupsListResult[i].result);
          }

          // Update 'netgroups' slice data
          setPage(1);
          dispatch(updateNetgroupsList(groupsList));
          setGroupsList(groupsList);
          setGroupsTotalCount(totalCount);
          // Show table elements
          setShowTableRows(true);
        }
        setSearchIsDisabled(false);
      }
    });
  };

  // Show table rows
  const [showTableRows, setShowTableRows] = useState(!isBatchLoading);

  const updateSelectedGroups = (groups: Netgroup[], isSelected: boolean) => {
    let newSelectedGroups: Netgroup[] = [];
    if (isSelected) {
      newSelectedGroups = JSON.parse(JSON.stringify(selectedGroups));
      for (let i = 0; i < groups.length; i++) {
        if (
          selectedGroups.find(
            (selectedGroup) => selectedGroup.cn[0] === groups[i].cn[0]
          )
        ) {
          // Already in the list
          continue;
        }
        // Add group to list
        newSelectedGroups.push(groups[i]);
      }
    } else {
      // Remove group
      for (let i = 0; i < selectedGroups.length; i++) {
        let found = false;
        for (let ii = 0; ii < groups.length; ii++) {
          if (selectedGroups[i].cn[0] === groups[ii].cn[0]) {
            found = true;
            break;
          }
        }
        if (!found) {
          // Keep this valid selected entry
          newSelectedGroups.push(selectedGroups[i]);
        }
      }
    }
    setSelectedGroupsList(newSelectedGroups);
    setIsDeleteButtonDisabled(newSelectedGroups.length === 0);
  };

  // - Helper method to set the selected groups from the table
  const setGroupSelected = (group: Netgroup, isSelecting = true) => {
    if (isNetgroupSelectable(group)) {
      updateSelectedGroups([group], isSelecting);
    }
  };

  // Show table rows only when data is fully retrieved
  useEffect(() => {
    if (showTableRows !== !isBatchLoading) {
      setShowTableRows(!isBatchLoading);
    }
  }, [isBatchLoading]);

  // Modals functionality
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  // Table-related shared functionality
  // - Selectable checkboxes on table
  const selectableGroupsTable = groupsList.filter(isNetgroupSelectable); // elements per Table

  // Data wrappers
  // - 'PaginationLayout'
  const paginationData = {
    page,
    perPage,
    updatePage,
    updatePerPage,
    updateSelectedPerPage,
    updateShownElementsList: updateShownGroupsList,
    totalCount,
  };

  // - 'BulkSelectorPrep'
  const groupsBulkSelectorData = {
    selectedGroups,
    updateSelectedGroups,
    selectableGroupsTable,
    isNetgroupSelectable,
  };

  const buttonsData = {
    updateIsDeleteButtonDisabled,
  };

  const selectedPerPageData = {
    selectedPerPage,
    updateSelectedPerPage,
  };

  // - 'DeleteGroups'
  const deleteGroupsButtonsData = {
    updateIsDeleteButtonDisabled,
    updateIsDeletion,
  };

  const selectedGroupsData = {
    selectedGroups,
    clearSelectedGroups,
  };

  // - 'NetroupsTable'
  const groupsTableData = {
    isNetgroupSelectable,
    selectedGroups,
    selectableGroupsTable,
    setGroupSelected,
    clearSelectedGroups,
  };

  const groupsTableButtonsData = {
    updateIsDeleteButtonDisabled,
    isDeletion,
    updateIsDeletion,
  };

  // - 'SearchInputLayout'
  const searchValueData = {
    searchValue,
    updateSearchValue,
    submitSearchValue,
  };

  // List of toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorNetgroupsPrep
          list={groupsList}
          shownElementsList={groupsList}
          elementData={groupsBulkSelectorData}
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
          ariaLabel="Search netgroups"
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
          onClickHandler={refreshGroupsData}
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
      toolbarItemVariant: "separator",
    },
    {
      key: 7,
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
      key: 8,
      element: (
        <PaginationLayout
          list={groupsList}
          paginationData={paginationData}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignRight" },
    },
  ];

  return (
    <Page>
      <alerts.ManagedAlerts />
      <PageSection variant={PageSectionVariants.light}>
        <TitleLayout id="Netgroups title" headingLevel="h1" text="Netgroups" />
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
        <div style={{ height: `calc(100vh - 350px)` }}>
          <OuterScrollContainer>
            <InnerScrollContainer>
              {batchError !== undefined && batchError ? (
                <GlobalErrors errors={globalErrors.getAll()} />
              ) : (
                <NetgroupsTable
                  elementsList={groupsList}
                  shownElementsList={groupsList}
                  showTableRows={showTableRows}
                  groupsData={groupsTableData}
                  buttonsData={groupsTableButtonsData}
                  paginationData={selectedPerPageData}
                  searchValue={searchValue}
                />
              )}
            </InnerScrollContainer>
          </OuterScrollContainer>
        </div>
        <PaginationLayout
          list={groupsList}
          paginationData={paginationData}
          variant={PaginationVariant.bottom}
          widgetId="pagination-options-menu-bottom"
          className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        />
      </PageSection>
      <ModalErrors errors={modalErrors.getAll()} />
      <AddNetgroup
        show={showAddModal}
        handleModalToggle={onAddModalToggle}
        onOpenAddModal={onAddClickHandler}
        onCloseAddModal={onCloseAddModal}
        onRefresh={refreshGroupsData}
      />
      <DeleteNetgroups
        show={showDeleteModal}
        handleModalToggle={onDeleteModalToggle}
        selectedGroupsData={selectedGroupsData}
        buttonsData={deleteGroupsButtonsData}
        onRefresh={refreshGroupsData}
      />
    </Page>
  );
};

export default Netgroups;
