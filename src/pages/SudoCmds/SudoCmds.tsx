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
import { SudoCmd } from "src/utils/datatypes/globalDataTypes";
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
import SudoCmdsTable from "./SudoCmdsTable";
// Components
import PaginationLayout from "../../components/layouts/PaginationLayout";
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
// Modals
import AddSudoCmd from "src/components/modals/SudoModals/AddSudoCmd";
import DeleteSudoCmd from "src/components/modals/SudoModals/DeleteSudoCmd";
// Hooks
import { useAlerts } from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// Utils
import { API_VERSION_BACKUP, isSudoCmdSelectable } from "src/utils/utils";
// RPC client
import { GenericPayload, useSearchEntriesMutation } from "src/services/rpc";
import { useGettingSudoCmdsQuery } from "src/services/rpcSudoCmds";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";

const SudoCmds = () => {
  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({ pathname: "sudo-commands" });

  // Set the page title to be shown in the browser tab
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  const [cmdList, setCmdsList] = useState<SudoCmd[]>([]);

  // Alerts to show in the UI
  const alerts = useAlerts();

  // Handle API calls errors
  const globalErrors = useApiError([]);
  const modalErrors = useApiError([]);

  // URL parameters: page number, page size, search value
  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();
  const [totalCount, setCmdsTotalCount] = useState<number>(0);
  const [searchDisabled, setSearchIsDisabled] = useState<boolean>(false);

  // Page indexes
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  // Derived states - what we get from API
  const cmdsDataResponse = useGettingSudoCmdsQuery({
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
  } = cmdsDataResponse;

  // Handle data when the API call is finished
  useEffect(() => {
    if (cmdsDataResponse.isFetching) {
      setShowTableRows(false);
      // Reset selected entries on refresh
      setCmdsTotalCount(0);
      globalErrors.clear();
      return;
    }

    // API response: Success
    if (
      cmdsDataResponse.isSuccess &&
      cmdsDataResponse.data &&
      batchResponse !== undefined
    ) {
      const cmdsListResult = batchResponse.result.results;
      const totalCount = batchResponse.result.totalCount;
      const cmdsListSize = batchResponse.result.count;
      const cmdsList: SudoCmd[] = [];

      for (let i = 0; i < cmdsListSize; i++) {
        cmdsList.push(cmdsListResult[i].result);
      }

      setCmdsTotalCount(totalCount);
      // Update the list
      setCmdsList(cmdsList);
      // Show table elements
      setShowTableRows(true);
    }

    // API response: Error
    if (
      !cmdsDataResponse.isLoading &&
      cmdsDataResponse.isError &&
      cmdsDataResponse.error !== undefined
    ) {
      // This normally happens when the user is not authorized to view the data
      // So instead of adding an error, refresh page
      window.location.reload();
    }
  }, [cmdsDataResponse]);

  // Refresh button handling
  const refreshData = () => {
    // Hide table
    setShowTableRows(false);
    setCmdsTotalCount(0);
    clearSelectedCmds();

    cmdsDataResponse.refetch();
  };

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  React.useEffect(() => {
    cmdsDataResponse.refetch();
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
  const updateShownCmdsList = (newShownCmdsList: SudoCmd[]) => {
    setCmdsList(newShownCmdsList);
  };

  // Update search input valie
  const updateSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const [selectedCmds, setSelectedCmds] = useState<SudoCmd[]>([]);

  const clearSelectedCmds = () => {
    const emptyList: SudoCmd[] = [];
    setSelectedCmds(emptyList);
  };

  const [retrieveCmds] = useSearchEntriesMutation({});

  // Issue a search using a specific search value
  const submitSearchValue = () => {
    setShowTableRows(false);
    setSearchIsDisabled(true);
    setCmdsTotalCount(0);
    retrieveCmds({
      searchValue: searchValue,
      sizeLimit: 0,
      apiVersion: apiVersion || API_VERSION_BACKUP,
      startIdx: firstIdx,
      stopIdx: lastIdx,
      entryType: "sudocmd",
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
            error || "Error when searching for sudo commands",
            "danger"
          );
        } else {
          // Success
          const cmdsListResult = result.data.result.results;
          const cmdsListSize = result.data.result.count;
          const totalCount = result.data.result.totalCount;
          const cmdsList: SudoCmd[] = [];

          for (let i = 0; i < cmdsListSize; i++) {
            cmdsList.push(cmdsListResult[i].result);
          }

          setCmdsTotalCount(totalCount);
          setCmdsList(cmdsList);
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
  const selectableCmdsTable = cmdList.filter(isSudoCmdSelectable); // elements per Table

  const updateSelectedCmds = (cmds: SudoCmd[], isSelected: boolean) => {
    let newSelectedCmds: SudoCmd[] = [];
    if (isSelected) {
      newSelectedCmds = JSON.parse(JSON.stringify(selectedCmds));
      for (let i = 0; i < cmds.length; i++) {
        if (
          selectedCmds.find(
            (selectedCmds) => selectedCmds.sudocmd[0] === cmds[i].sudocmd[0]
          )
        ) {
          // Already in the list
          continue;
        }
        // Add command to list
        newSelectedCmds.push(cmds[i]);
      }
    } else {
      // Remove entry
      for (let i = 0; i < selectedCmds.length; i++) {
        let found = false;
        for (let ii = 0; ii < cmds.length; ii++) {
          if (selectedCmds[i].sudocmd[0] === cmds[ii].sudocmd[0]) {
            found = true;
            break;
          }
        }
        if (!found) {
          // Keep this valid selected entry
          newSelectedCmds.push(selectedCmds[i]);
        }
      }
    }
    setSelectedCmds(newSelectedCmds);
    setIsDeleteButtonDisabled(newSelectedCmds.length === 0);
  };

  // - Helper method to set the selected entries from the table
  const setCmdsSelected = (cmd: SudoCmd, isSelecting = true) => {
    if (isSudoCmdSelectable(cmd)) {
      updateSelectedCmds([cmd], isSelecting);
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
    updateShownElementsList: updateShownCmdsList,
    totalCount,
  };

  // - 'BulkSelector'
  const cmdsBulkSelectorData = {
    selected: selectedCmds,
    updateSelected: updateSelectedCmds,
    selectableTable: selectableCmdsTable,
    nameAttr: "sudocmd",
  };

  const buttonsData = {
    updateIsDeleteButtonDisabled,
  };

  const selectedPerPageData = {
    selectedPerPage,
    updateSelectedPerPage,
  };

  // 'DeleteSudoCmds'
  const deleteCmdsButtonsData = {
    updateIsDeleteButtonDisabled,
    updateIsDeletion,
  };

  const selectedCmdsData = {
    selectedCmds,
    clearSelectedCmds,
  };

  // 'SudoCmdsTable'
  const cmdsTableData = {
    isSudoCmdSelectable,
    selectedCmds,
    selectableCmdsTable,
    setCmdsSelected,
    clearSelectedCmds,
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
          ariaLabel="Search commands"
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
          isDisabled={!showTableRows}
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
          id="sudocmd title"
          headingLevel="h1"
          text="Sudo commands"
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
                <SudoCmdsTable
                  shownElementsList={cmdList}
                  showTableRows={showTableRows}
                  cmdsData={cmdsTableData}
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
      <AddSudoCmd
        show={showAddModal}
        handleModalToggle={onAddModalToggle}
        onOpenAddModal={onAddClickHandler}
        onCloseAddModal={onCloseAddModal}
        onRefresh={refreshData}
      />
      <DeleteSudoCmd
        show={showDeleteModal}
        handleModalToggle={onDeleteModalToggle}
        selectedCmdsData={selectedCmdsData}
        buttonsData={deleteCmdsButtonsData}
        onRefresh={refreshData}
      />
      <ModalErrors errors={modalErrors.getAll()} />
    </Page>
  );
};

export default SudoCmds;
