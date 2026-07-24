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
import { HBACRule } from "src/utils/datatypes/globalDataTypes";
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
import HBACRulesTable from "./HBACRulesTable";
// Components
import PaginationLayout from "../../components/layouts/PaginationLayout";
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
// Modals
import AddHBACRule from "src/components/modals/HbacModals/AddHBACRule";
import DeleteHBACRule from "src/components/modals/HbacModals/DeleteHBACRule";
import DisableEnableHBACRules from "src/components/modals/HbacModals/DisableEnableHBACRules";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import { toggleHelpPanel } from "src/store/Global/contextual-help-slice";
// Utils
import { API_VERSION_BACKUP, isHbacRuleSelectable } from "src/utils/utils";
import {
  getSelectedPerPageData,
  ipaPrimaryKey,
} from "src/utils/selectedPerPage";
// RPC client
import { GenericPayload } from "src/services/rpc";
import { useGettingHbacRulesQuery } from "src/services/rpcHBACRules";
// Errors
import useApiError from "src/hooks/useApiError";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";

const HBACRules = () => {
  const dispatch = useAppDispatch();
  useContextualHelpTopic("hbac-rules");

  // Contextual help panel

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "hbac-rules" });

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  const [rulesList, setRulesList] = useState<HBACRule[]>([]);

  // Handle API calls errors
  const globalErrors = useApiError([]);
  const modalErrors = useApiError([]);

  // URL parameters: page number, page size, search value
  const { page, perPage, searchValue } = useListPageSearchParams();

  // Main states - what user can define / what we could use in page URL
  const [totalCount, setRulesTotalCount] = useState<number>(0);

  // Page indexes
  const firstUserIdx = (page - 1) * perPage;
  const lastUserIdx = page * perPage;

  // Derived states - what we get from API
  const rulesDataResponse = useGettingHbacRulesQuery({
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
  }, []);

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

  const [selectedRules, setSelectedRules] = useState<HBACRule[]>([]);

  const clearSelectedRules = () => {
    const emptyList: HBACRule[] = [];
    setSelectedRules(emptyList);
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

  const selectedPerPageData = getSelectedPerPageData(
    rulesList,
    selectedRules.map((item) => ipaPrimaryKey(item.cn)),
    (item) => ipaPrimaryKey(item.cn)
  );

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
          dataCy="search"
          name="search"
          ariaLabel="Search HBAC rules"
          placeholder="Search HBAC rules"
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
          onClickHandler={refreshRulesData}
          isDisabled={!showTableRows}
          dataCy="hbac-rules-button-refresh"
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
          dataCy="hbac-rules-button-delete"
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
          dataCy="hbac-rules-button-add"
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
          dataCy="hbac-rules-button-disable"
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
          dataCy="hbac-rules-button-enable"
        >
          Enable
        </SecondaryButton>
      ),
    },
    {
      key: 9,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 10,
      element: (
        <HelpTextWithIconLayout
          textContent="Help"
          onClick={() => dispatch(toggleHelpPanel())}
        />
      ),
    },
    {
      key: 11,
      element: (
        <PaginationLayout
          list={rulesList}
          totalCount={totalCount}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  // Render 'Active users'
  return (
    <>
      <div>
        <PageSection hasBodyWrapper={false}>
          <TitleLayout
            id="hbacrules title"
            headingLevel="h1"
            text="HBAC rules"
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
            </FlexItem>
            <FlexItem
              style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}
            >
              <PaginationLayout
                list={rulesList}
                totalCount={totalCount}
                variant={PaginationVariant.bottom}
                widgetId="pagination-options-menu-bottom"
              />
            </FlexItem>
          </Flex>
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
        <ModalErrors
          errors={modalErrors.getAll()}
          dataCy="hbac-rules-modal-error"
        />
      </div>
    </>
  );
};

export default HBACRules;
