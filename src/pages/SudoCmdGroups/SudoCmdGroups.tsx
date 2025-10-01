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
import PaginationLayout from "../../components/layouts/PaginationLayout/PaginationLayout";
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
      // This normally happens when the user is not authorized to view the data
      // So instead of adding an error, refresh page
      window.location.reload();
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
            error || "Error when searching for sudo command groups",
            "danger"
          );
        } else {
          // Success
          const cmdsListResult = result.data?.result.results || [];
          const cmdsListSize = result.data?.result.count || 0;
          const totalCount = result.data?.result.totalCount || 0;
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
          dataCy="search"
          name="search"
          ariaLabel="Search command groups"
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
          onClickHandler={refreshData}
          isDisabled={!showTableRows}
          dataCy="sudo-command-groups-button-refresh"
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
          dataCy="sudo-command-groups-button-delete"
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
          dataCy="sudo-command-groups-button-add"
        >
          Add
        </SecondaryButton>
      ),
    },
    {
      key: 6,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 7,
      element: <HelpTextWithIconLayout textContent="Help" />,
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
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  return (
    <div>
      <alerts.ManagedAlerts />
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="sudocmdgroup title"
          headingLevel="h1"
          text="Sudo command groups"
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
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}>
            <PaginationLayout
              list={cmdList}
              paginationData={paginationData}
              variant={PaginationVariant.bottom}
              widgetId="pagination-options-menu-bottom"
            />
          </FlexItem>
        </Flex>
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
      <ModalErrors
        errors={modalErrors.getAll()}
        dataCy="sudo-cmd-groups-modal-error"
      />
    </div>
  );
};

export default SudoCmds;
