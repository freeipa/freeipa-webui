import React, { useEffect, useState } from "react";
// PatternFly
import {
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
import { SudoCmdGroup } from "src/utils/datatypes/globalDataTypes";
import { ToolbarItem } from "src/components/layouts/ToolbarLayout";
// Redux
import { useAppSelector } from "src/store/hooks";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
// Tables
import SudoCmdGroupsTable from "./SudoCmdGroupsTable";
// Components
import PaginationLayout from "../../components/layouts/PaginationLayout";
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
// Modals
import AddSudoCmdGroup from "src/components/modals/SudoModals/AddSudoCmdGroup";
import DeleteSudoCmdGroups from "src/components/modals/SudoModals/DeleteSudoCmdGroups";
// Hooks
import { useAlerts } from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// Utils
import { API_VERSION_BACKUP, isSudoCmdGroupSelectable } from "src/utils/utils";
// RPC client
import { GenericPayload, useSearchEntriesMutation } from "src/services/rpc";
import { useGettingSudoCmdGroupsQuery } from "src/services/rpcSudoCmdGroups";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";

const SudoCmds = () => {
  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({ pathname: "sudo-command-groups" });

  // Set the page title to be shown in the browser tab
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  const [cmdList, setCmdGroupsList] = useState<SudoCmdGroup[]>([]);

  // Alerts to show in the UI
  const alerts = useAlerts();

  // Handle API calls errors
  const globalErrors = useApiError([]);
  const modalErrors = useApiError([]);

  // URL parameters: page number, page size, search value
  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();
  const [totalCount, setCmdGroupsTotalCount] = useState<number>(0);
  const [searchDisabled, setSearchIsDisabled] = useState<boolean>(false);

  // Button disabled due to error
  const [isDisabledDueError, setIsDisabledDueError] = useState<boolean>(false);

  // Page indexes
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  // Derived states - what we get from API
  const cmdGroupsDataResponse = useGettingSudoCmdGroupsQuery({
    searchValue: "",
    sizeLimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
    startIdx: firstIdx,
    stopIdx: lastIdx,
  } as GenericPayload);

  const {
    data: batchResponse,
    isLoading: isBatchLoading,
    error: batchError,
  } = cmdGroupsDataResponse;

  // Handle data when the API call is finished
  useEffect(() => {
    if (cmdGroupsDataResponse.isFetching) {
      setShowTableRows(false);
      // Reset selected entries on refresh
      setCmdGroupsTotalCount(0);
      globalErrors.clear();
      setIsDisabledDueError(false);
      return;
    }

    // API response: Success
    if (
      cmdGroupsDataResponse.isSuccess &&
      cmdGroupsDataResponse.data &&
      batchResponse !== undefined
    ) {
      const cmdGroupsListResult = batchResponse.result.results;
      const totalCount = batchResponse.result.totalCount;
      const cmdGroupsListSize = batchResponse.result.count;
      const cmdGroupsList: SudoCmdGroup[] = [];

      for (let i = 0; i < cmdGroupsListSize; i++) {
        cmdGroupsList.push(cmdGroupsListResult[i].result);
      }

      setCmdGroupsTotalCount(totalCount);
      // Update the list
      setCmdGroupsList(cmdGroupsList);
      // Show table elements
      setShowTableRows(true);
    }

    // API response: Error
    if (
      !cmdGroupsDataResponse.isLoading &&
      cmdGroupsDataResponse.isError &&
      cmdGroupsDataResponse.error !== undefined
    ) {
      setIsDisabledDueError(true);
      globalErrors.addError(
        batchError,
        "Error when loading data",
        "error-batch-sudo-cmd-groups"
      );
    }
  }, [cmdGroupsDataResponse]);

  // Refresh button handling
  const refreshData = () => {
    setShowTableRows(false);
    setCmdGroupsTotalCount(0);
    clearSelectedCmdGroups();
    cmdGroupsDataResponse.refetch();
  };

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  React.useEffect(() => {
    cmdGroupsDataResponse.refetch();
  }, [page, perPage]);

  // 'Delete' button state
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    useState<boolean>(true);

  const updateIsDeleteButtonDisabled = (value: boolean) => {
    setIsDeleteButtonDisabled(value);
  };

  // If some entries have been deleted, restore the selected list
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

  // Commands displayed on the first page
  const updateShownCmdGroupsList = (newShownCmdsList: SudoCmdGroup[]) => {
    setCmdGroupsList(newShownCmdsList);
  };

  // Update search input valie
  const updateSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const [selectedCmdGroups, setSelectedCmds] = useState<SudoCmdGroup[]>([]);

  const clearSelectedCmdGroups = () => {
    const emptyList: SudoCmdGroup[] = [];
    setSelectedCmds(emptyList);
  };

  const [retrieveCmds] = useSearchEntriesMutation({});

  // Issue a search using a specific search value
  const submitSearchValue = () => {
    setShowTableRows(false);
    setSearchIsDisabled(true);
    setCmdGroupsTotalCount(0);
    retrieveCmds({
      searchValue: searchValue,
      sizeLimit: 0,
      apiVersion: apiVersion || API_VERSION_BACKUP,
      startIdx: firstIdx,
      stopIdx: lastIdx,
      entryType: "sudocmdgroup",
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
            error || "Error when searching for sudo command groups",
            "danger"
          );
        } else {
          // Success
          const cmdsListResult = result.data.result.results;
          const cmdsListSize = result.data.result.count;
          const totalCount = result.data.result.totalCount;
          const cmdsList: SudoCmdGroup[] = [];

          for (let i = 0; i < cmdsListSize; i++) {
            cmdsList.push(cmdsListResult[i].result);
          }

          setCmdGroupsTotalCount(totalCount);
          setCmdGroupsList(cmdsList);
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
  const selectableCmdGroupsTable = cmdList.filter(isSudoCmdGroupSelectable);

  const updateSelectedCmdGroups = (
    cmds: SudoCmdGroup[],
    isSelected: boolean
  ) => {
    let newSelectedCmdGroups: SudoCmdGroup[] = [];
    if (isSelected) {
      newSelectedCmdGroups = JSON.parse(JSON.stringify(selectedCmdGroups));
      for (let i = 0; i < cmds.length; i++) {
        if (
          selectedCmdGroups.find(
            (selectedCmdGroups) => selectedCmdGroups.cn[0] === cmds[i].cn[0]
          )
        ) {
          // Already in the list
          continue;
        }
        // Add command to list
        newSelectedCmdGroups.push(cmds[i]);
      }
    } else {
      // Remove entry
      for (let i = 0; i < selectedCmdGroups.length; i++) {
        let found = false;
        for (let ii = 0; ii < cmds.length; ii++) {
          if (selectedCmdGroups[i].cn[0] === cmds[ii].cn[0]) {
            found = true;
            break;
          }
        }
        if (!found) {
          // Keep this valid selected entry
          newSelectedCmdGroups.push(selectedCmdGroups[i]);
        }
      }
    }
    setSelectedCmds(newSelectedCmdGroups);
    setIsDeleteButtonDisabled(newSelectedCmdGroups.length === 0);
  };

  // - Helper method to set the selected entries from the table
  const setCmdGroupsSelected = (cmd: SudoCmdGroup, isSelecting = true) => {
    if (isSudoCmdGroupSelectable(cmd)) {
      updateSelectedCmdGroups([cmd], isSelecting);
    }
  };

  // Data wrappers
  // - 'PaginationLayout'
  const paginationData = {
    page,
    perPage,
    updatePage,
    updatePerPage,
    updateSelectedPerPage,
    updateShownElementsList: updateShownCmdGroupsList,
    totalCount,
  };

  // - 'BulkSelector'
  const cmdsBulkSelectorData = {
    selected: selectedCmdGroups,
    updateSelected: updateSelectedCmdGroups,
    selectableTable: selectableCmdGroupsTable,
    nameAttr: "cn",
  };

  const buttonsData = {
    updateIsDeleteButtonDisabled,
  };

  const selectedPerPageData = {
    selectedPerPage,
    updateSelectedPerPage,
  };

  const deleteCmdsButtonsData = {
    updateIsDeleteButtonDisabled,
    updateIsDeletion,
  };

  const selectedCmdGroupsData = {
    selectedCmdGroups,
    clearSelectedCmdGroups,
  };

  const cmdGroupsTableData = {
    isSudoCmdGroupSelectable,
    selectedCmdGroups,
    selectableCmdGroupsTable,
    setCmdGroupsSelected,
    clearSelectedCmdGroups,
  };

  const cmdsTableButtonsData = {
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

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={cmdList}
          shownElementsList={cmdList}
          elementData={cmdsBulkSelectorData}
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
          ariaLabel="Search command groups"
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
          onClickHandler={refreshData}
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
          list={cmdList}
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
        <TitleLayout
          id="sudocmdgroup title"
          headingLevel="h1"
          text="Sudo command groups"
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
                <SudoCmdGroupsTable
                  shownElementsList={cmdList}
                  showTableRows={showTableRows}
                  cmdGroupsData={cmdGroupsTableData}
                  buttonsData={cmdsTableButtonsData}
                  paginationData={selectedPerPageData}
                  searchValue={searchValue}
                />
              )}
            </InnerScrollContainer>
          </OuterScrollContainer>
        </div>
        <PaginationLayout
          list={cmdList}
          paginationData={paginationData}
          variant={PaginationVariant.bottom}
          widgetId="pagination-options-menu-bottom"
          className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        />
      </PageSection>
      <AddSudoCmdGroup
        show={showAddModal}
        handleModalToggle={onAddModalToggle}
        onOpenAddModal={onAddClickHandler}
        onCloseAddModal={onCloseAddModal}
        onRefresh={refreshData}
      />
      <DeleteSudoCmdGroups
        show={showDeleteModal}
        handleModalToggle={onDeleteModalToggle}
        selectedCmdGroupsData={selectedCmdGroupsData}
        buttonsData={deleteCmdsButtonsData}
        onRefresh={refreshData}
      />
      <ModalErrors errors={modalErrors.getAll()} />
    </Page>
  );
};

export default SudoCmds;
