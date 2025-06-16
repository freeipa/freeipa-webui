import React, { useEffect, useState } from "react";
// PatternFly
import {
  Page,
  PageSection,
  PageSectionVariants,
  PaginationVariant,
} from "@patternfly/react-core";
// PatternFly table
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Data types
import { HBACRule } from "src/utils/datatypes/globalDataTypes";
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
import HBACRulesTable from "./HBACRulesTable";
// Components
import PaginationLayout from "../../components/layouts/PaginationLayout";
import BulkSelectorPrep from "src/components/BulkSelectorPrep/BulkSelectorPrep";
// Modals
import AddHBACRule from "src/components/modals/HbacModals/AddHBACRule";
import DeleteHBACRule from "src/components/modals/HbacModals/DeleteHBACRule";
import DisableEnableHBACRules from "src/components/modals/HbacModals/DisableEnableHBACRules";
// Hooks
import { useAlerts } from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Utils
import { API_VERSION_BACKUP, isHbacRuleSelectable } from "src/utils/utils";
// RPC client
import { GenericPayload, useSearchEntriesMutation } from "src/services/rpc";
import { useGettingHbacRulesQuery } from "src/services/rpcHBACRules";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";

const HBACRules = () => {
  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({ pathname: "hbac-rules" });

  // Set the page title to be shown in the browser tab
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  const [rulesList, setRulesList] = useState<HBACRule[]>([]);

  // Alerts to show in the UI
  const alerts = useAlerts();

  // Handle API calls errors
  const globalErrors = useApiError([]);
  const modalErrors = useApiError([]);

  // Main states - what user can define / what we could use in page URL
  const [searchValue, setSearchValue] = React.useState("");
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [totalCount, setRulesTotalCount] = useState<number>(0);
  const [searchDisabled, setSearchIsDisabled] = useState<boolean>(false);

  // Page indexes
  const firstUserIdx = (page - 1) * perPage;
  const lastUserIdx = page * perPage;

  // Derived states - what we get from API
  const rulesDataResponse = useGettingHbacRulesQuery({
    searchValue: "",
    sizeLimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
    startIdx: firstUserIdx,
    stopIdx: lastUserIdx,
  } as GenericPayload);

  const {
    data: batchResponse,
    isLoading: isBatchLoading,
    error: batchError,
  } = rulesDataResponse;

  // Handle data when the API call is finished
  useEffect(() => {
    if (rulesDataResponse.isFetching) {
      setShowTableRows(false);
      // Reset selected users on refresh
      setRulesTotalCount(0);
      globalErrors.clear();
      return;
    }

    // API response: Success
    if (
      rulesDataResponse.isSuccess &&
      rulesDataResponse.data &&
      batchResponse !== undefined
    ) {
      const rulesListResult = batchResponse.result.results;
      const totalCount = batchResponse.result.totalCount;
      const rulesListSize = batchResponse.result.count;
      const rulesList: HBACRule[] = [];

      for (let i = 0; i < rulesListSize; i++) {
        rulesList.push(rulesListResult[i].result);
      }

      setRulesTotalCount(totalCount);
      // Update the list of users
      setRulesList(rulesList);
      // Show table elements
      setShowTableRows(true);
    }

    // API response: Error
    if (
      !rulesDataResponse.isLoading &&
      rulesDataResponse.isError &&
      rulesDataResponse.error !== undefined
    ) {
      // This normally happens when the user is not authorized to view the data
      // So instead of adding an error, refresh page
      window.location.reload();
    }
  }, [rulesDataResponse]);

  // Refresh button handling
  const refreshRulesData = () => {
    // Hide table
    setShowTableRows(false);

    // Reset selected users on refresh
    setRulesTotalCount(0);
    clearSelectedRules();

    rulesDataResponse.refetch();
  };

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  React.useEffect(() => {
    rulesDataResponse.refetch();
  }, [page, perPage]);

  // 'Delete' button state
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    useState<boolean>(true);

  const updateIsDeleteButtonDisabled = (value: boolean) => {
    setIsDeleteButtonDisabled(value);
  };

  // If some entries have been deleted, restore the selectedRules list
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

  // Rules displayed on the first page
  const updateShownRulesList = (newShownRulesList: HBACRule[]) => {
    setRulesList(newShownRulesList);
  };

  // Update search input valie
  const updateSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const [selectedRules, setSelectedRules] = useState<HBACRule[]>([]);

  const clearSelectedRules = () => {
    const emptyList: HBACRule[] = [];
    setSelectedRules(emptyList);
  };

  const [retrieveRules] = useSearchEntriesMutation({});

  // Issue a search using a specific search value
  const submitSearchValue = () => {
    setShowTableRows(false);
    setSearchIsDisabled(true);
    setRulesTotalCount(0);
    retrieveRules({
      searchValue: searchValue,
      sizeLimit: 0,
      apiVersion: apiVersion || API_VERSION_BACKUP,
      startIdx: firstUserIdx,
      stopIdx: lastUserIdx,
      entryType: "hbacrule",
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
            error || "Error when searching for HBAC rules",
            "danger"
          );
        } else {
          // Success
          const rulesListResult = result.data?.result.results || [];
          const rulesListSize = result.data?.result.count || 0;
          const totalCount = result.data?.result.totalCount || 0;
          const rulesList: HBACRule[] = [];

          for (let i = 0; i < rulesListSize; i++) {
            rulesList.push(rulesListResult[i].result);
          }

          setRulesTotalCount(totalCount);
          setRulesList(rulesList);
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
  const selectableRulesTable = rulesList.filter(isHbacRuleSelectable); // elements per Table

  const updateSelectedRules = (rules: HBACRule[], isSelected: boolean) => {
    let newSelectedRules: HBACRule[] = [];
    if (isSelected) {
      newSelectedRules = JSON.parse(JSON.stringify(selectedRules));
      for (let i = 0; i < rules.length; i++) {
        if (
          selectedRules.find(
            (selectedRule) => selectedRule.cn[0] === rules[i].cn[0]
          )
        ) {
          // Already in the list
          continue;
        }
        // Add rule to list
        newSelectedRules.push(rules[i]);
      }
    } else {
      // Remove user
      for (let i = 0; i < selectedRules.length; i++) {
        let found = false;
        for (let ii = 0; ii < rules.length; ii++) {
          if (selectedRules[i].cn[0] === rules[ii].cn[0]) {
            found = true;
            break;
          }
        }
        if (!found) {
          // Keep this valid selected entry
          newSelectedRules.push(selectedRules[i]);
        }
      }
    }
    setSelectedRules(newSelectedRules);
    setIsDeleteButtonDisabled(newSelectedRules.length === 0);
  };

  // - Helper method to set the selected users from the table
  const setRulesSelected = (rule: HBACRule, isSelecting = true) => {
    if (isHbacRuleSelectable(rule)) {
      updateSelectedRules([rule], isSelecting);
    }
  };

  // Data wrappers
  // TODO: Better separation of concerts
  // - 'PaginationLayout'
  const paginationData = {
    page,
    perPage,
    updatePage,
    updatePerPage,
    updateSelectedPerPage,
    updateShownElementsList: updateShownRulesList,
    totalCount,
  };

  // - 'BulkSelectorHBACRulesPrep'
  const rulesBulkSelectorData = {
    selected: selectedRules,
    updateSelected: updateSelectedRules,
    selectableTable: selectableRulesTable,
    nameAttr: "cn",
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

  // 'DeleteRules'
  const deleteRulesButtonsData = {
    updateIsDeleteButtonDisabled,
    updateIsDeletion,
  };

  const selectedRulesData = {
    selectedRules,
    clearSelectedRules,
  };

  // 'DisableEnableUsers'
  const disableEnableButtonsData = {
    updateIsEnableButtonDisabled,
    updateIsDisableButtonDisabled,
    updateIsDisableEnableOp,
  };

  // 'RulesTable'
  const rulesTableData = {
    isHbacRuleSelectable,
    selectedRules,
    selectableRulesTable,
    setRulesSelected,
    clearSelectedRules,
  };

  const rulesTableButtonsData = {
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
    submitSearchValue,
  };

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={rulesList}
          shownElementsList={rulesList}
          elementData={rulesBulkSelectorData}
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
          onClickHandler={refreshRulesData}
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
      key: 9,
      toolbarItemVariant: "separator",
    },
    {
      key: 10,
      element: <HelpTextWithIconLayout textContent="Help" />,
    },
    {
      key: 11,
      element: (
        <PaginationLayout
          list={rulesList}
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
      <alerts.ManagedAlerts />
      <PageSection variant={PageSectionVariants.light}>
        <TitleLayout id="hbacrules title" headingLevel="h1" text="HBAC rules" />
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
                <HBACRulesTable
                  shownElementsList={rulesList}
                  showTableRows={showTableRows}
                  rulesData={rulesTableData}
                  buttonsData={rulesTableButtonsData}
                  paginationData={selectedPerPageData}
                  searchValue={searchValue}
                />
              )}
            </InnerScrollContainer>
          </OuterScrollContainer>
        </div>
        <PaginationLayout
          list={rulesList}
          paginationData={paginationData}
          variant={PaginationVariant.bottom}
          widgetId="pagination-options-menu-bottom"
          className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        />
      </PageSection>
      <AddHBACRule
        show={showAddModal}
        handleModalToggle={onAddModalToggle}
        onOpenAddModal={onAddClickHandler}
        onCloseAddModal={onCloseAddModal}
        onRefresh={refreshRulesData}
      />
      <DeleteHBACRule
        show={showDeleteModal}
        handleModalToggle={onDeleteModalToggle}
        selectedRulesData={selectedRulesData}
        buttonsData={deleteRulesButtonsData}
        onRefresh={refreshRulesData}
      />
      <DisableEnableHBACRules
        show={showEnableDisableModal}
        handleModalToggle={onEnableDisableModalToggle}
        optionSelected={enableDisableOptionSelected}
        selectedRulesData={selectedRulesData}
        buttonsData={disableEnableButtonsData}
        onRefresh={refreshRulesData}
      />
      <ModalErrors errors={modalErrors.getAll()} />
    </Page>
  );
};

export default HBACRules;
