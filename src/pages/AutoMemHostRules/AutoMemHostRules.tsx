import React from "react";
// PatternFly
import {
  Button,
  Flex,
  FlexItem,
  PageSection,
  PaginationVariant,
  SelectOptionProps,
  ToolbarItemVariant,
} from "@patternfly/react-core";
// PatternFly table
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Data types
import { AutomemberEntry } from "src/utils/datatypes/globalDataTypes";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";

import SecondaryButton from "src/components/layouts/SecondaryButton";
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
// Tables
import MainTable from "../AutoMemUserRules/AutomemRulesTable";
// Components
import PaginationLayout from "../../components/layouts/PaginationLayout";
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
import TypeAheadSelect from "src/components/TypeAheadSelect";
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
// RPC
import {
  ChangeDefaultPayload,
  useChangeDefaultGroupMutation,
} from "src/services/rpcAutomember";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import { useHostGroupsRulesData } from "src/hooks/useHostGroupRules";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import { toggleHelpPanel } from "src/store/Global/contextual-help-slice";
// Utils
import { isAutomemberUserGroupSelectable } from "src/utils/utils";
import { getSelectedPerPageData } from "src/utils/selectedPerPage";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// Modals
import AddRule from "src/components/modals/Automember/AddRule";
import DeleteRule from "src/components/modals/Automember/DeleteRule";
import ConfirmationModal from "src/components/modals/ConfirmationModal";

// Automembership host group rules
const AutoMemHostRules = () => {
  const dispatch = useAppDispatch();
  useContextualHelpTopic("automember-host-rules");

  // Contextual help panel

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({
    pathname: "host-group-rules",
  });

  const NO_SELECTION = "No default group selected";

  const [automemberRules, setAutomemberRules] = React.useState<
    AutomemberEntry[]
  >([]);
  const [defaultGroup, setDefaultGroup] = React.useState<string>(NO_SELECTION);
  const [previousDefaultGroup, setPreviousDefaultGroup] =
    React.useState<string>(NO_SELECTION);
  const [errors, setErrors] = React.useState<
    Array<FetchBaseQueryError | SerializedError>
  >([]);
  // Options for the default host group selector
  const [hostGroupsOptions, setHostGroupsOptions] = React.useState<
    SelectOptionProps[]
  >([]);
  // Available elements ready to add
  const [groupsAvailableToAdd, setGroupsAvailableToAdd] = React.useState<
    string[]
  >([]);

  // Handle API calls errors
  const globalErrors = useApiError([]);

  // URL parameters: page number, page size, search value
  const { page, perPage, searchValue } = useListPageSearchParams();

  const [totalCount, setTotalCount] = React.useState<number>(0);

  // Page indexes
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  // API calls via custom hook
  const hostGroupRulesData = useHostGroupsRulesData({
    searchValue,
    startIdx: firstIdx,
    stopIdx: lastIdx,
  });
  const [changeDefaultGroup] = useChangeDefaultGroupMutation();

  // Main API call
  React.useEffect(() => {
    if (!hostGroupRulesData.isFetching) {
      if (hostGroupRulesData.errors && hostGroupRulesData.errors.length > 0) {
        setErrors(hostGroupRulesData.errors || []);
      } else {
        // Update lists
        if (hostGroupRulesData.hostGroups.length > 0) {
          // Add empty entry as an option
          const groupsToSelector = [
            {
              "data-cy": "typeahead-select-no-selection",
              value: NO_SELECTION,
              children: NO_SELECTION,
            },
          ];

          // Add the rest of the data from hostgroups
          const tempGroupsToSelector = hostGroupRulesData.hostGroups.map(
            (group) => ({
              "data-cy": "typeahead-select-" + group,
              value: group,
              children: group,
            })
          );
          groupsToSelector.push(...tempGroupsToSelector);
          setHostGroupsOptions(groupsToSelector);
        }

        setAutomemberRules(hostGroupRulesData.shownAutomembers);
        // If no default group is set, set it as 'No selection'
        if (hostGroupRulesData.defaultGroup === "") {
          setDefaultGroup(NO_SELECTION);
          setPreviousDefaultGroup(NO_SELECTION);
        } else {
          setDefaultGroup(hostGroupRulesData.defaultGroup);
          setPreviousDefaultGroup(hostGroupRulesData.defaultGroup);
        }

        // Set available host groups to add (use full unfiltered rule list)
        const allAutomemberIds = hostGroupRulesData.automembersIds.map(
          (item) => item.automemberRule
        );
        const availableItems = hostGroupRulesData.hostGroups.filter(
          (item) => !allAutomemberIds.includes(item)
        );
        setGroupsAvailableToAdd(availableItems);

        // Set table count from search match total
        setTotalCount(hostGroupRulesData.totalCount);
      }
    }
  }, [
    hostGroupRulesData.hostGroups,
    hostGroupRulesData.automembersIds,
    hostGroupRulesData.shownAutomembers,
    hostGroupRulesData.totalCount,
    hostGroupRulesData.defaultGroup,
  ]);

  // On select default group
  const onSelectDefaultGroup = (group: string) => {
    const payload: ChangeDefaultPayload = {
      defaultGroup: group,
      type: "hostgroup",
    };
    changeDefaultGroup(payload).then((result) => {
      if ("data" in result) {
        setDefaultGroup(group);
        setPreviousDefaultGroup(group);
        dispatch(
          addAlert({
            name: "default-group-success",
            title: "Default group updated",
            variant: "success",
          })
        );
        onCloseConfirmationModal();
      } else {
        dispatch(
          addAlert({
            name: "default-group-failure",
            title: "Default group not updated",
            variant: "danger",
          })
        );
      }
    });
  };

  // If some entries' status has been updated, unselect selected rows
  const [isDisableEnableOp, setIsDisableEnableOp] = React.useState(false);

  const updateIsDisableEnableOp = (value: boolean) => {
    setIsDisableEnableOp(value);
  };

  const [selectedAutomembers, setSelectedAutomembers] = React.useState<
    AutomemberEntry[]
  >([]);

  const clearSelectedRules = () => {
    const emptyList: AutomemberEntry[] = [];
    setSelectedAutomembers(emptyList);
  };

  // Refresh button handling
  const refreshData = () => {
    setTotalCount(0);
    clearSelectedRules();
    hostGroupRulesData.refetch();
  };

  // 'Delete' button state
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    React.useState<boolean>(true);

  const updateIsDeleteButtonDisabled = (value: boolean) => {
    setIsDeleteButtonDisabled(value);
  };

  const [isDeletion, setIsDeletion] = React.useState(false);
  const updateIsDeletion = (value: boolean) => {
    setIsDeletion(value);
  };

  // Table-related shared functionality
  // - Selectable checkboxes on table
  const selectableAutomembersTable = automemberRules.filter(
    isAutomemberUserGroupSelectable
  ); // elements per Table

  const updateSelectedAutomembers = (
    automembers: AutomemberEntry[],
    isSelected: boolean
  ) => {
    let newSelectedAutomembers: AutomemberEntry[] = [];
    if (isSelected) {
      newSelectedAutomembers = JSON.parse(JSON.stringify(selectedAutomembers));
      for (let i = 0; i < automembers.length; i++) {
        if (
          selectedAutomembers.find(
            (selectedRule) =>
              selectedRule.automemberRule === automembers[i].automemberRule
          )
        ) {
          // Already in the list
          continue;
        }
        // Add rule to list
        newSelectedAutomembers.push(automembers[i]);
      }
    } else {
      // Remove rule
      for (let i = 0; i < selectedAutomembers.length; i++) {
        let found = false;
        for (let ii = 0; ii < automembers.length; ii++) {
          if (
            selectedAutomembers[i].automemberRule ===
            automembers[ii].automemberRule
          ) {
            found = true;
            break;
          }
        }
        if (!found) {
          // Keep this valid selected entry
          newSelectedAutomembers.push(selectedAutomembers[i]);
        }
      }
    }
    setSelectedAutomembers(newSelectedAutomembers);
    setIsDeleteButtonDisabled(newSelectedAutomembers.length === 0);
  };

  // - Helper method to set the selected entries from the table
  const setAutomembersSelected = (
    automember: AutomemberEntry,
    isSelecting = true
  ) => {
    if (isAutomemberUserGroupSelectable(automember)) {
      updateSelectedAutomembers([automember], isSelecting);
    }
  };

  // Data wrappers
  // TODO: Better separation of concerts
  // - 'BulkSelectorPrep'
  const automembersBulkSelectorData = {
    selected: selectedAutomembers,
    updateSelected: updateSelectedAutomembers,
    selectableTable: selectableAutomembersTable,
    nameAttr: "automemberRule",
  };

  const buttonsData = {
    updateIsDeleteButtonDisabled,
    updateIsDisableEnableOp,
  };

  const selectedPerPageData = getSelectedPerPageData(
    automemberRules,
    selectedAutomembers.map((rule) => rule.automemberRule),
    (rule) => rule.automemberRule
  );

  // Data wrappers
  const automembersTableData = {
    isElementSelectable: isAutomemberUserGroupSelectable,
    selectedElements: selectedAutomembers,
    selectableElementsTable: selectableAutomembersTable,
    setElementsSelected: setAutomembersSelected,
    clearSelectedElements: clearSelectedRules,
  };

  const automembersTableButtonsData = {
    updateIsDeleteButtonDisabled,
    isDeletion,
    updateIsDeletion,
    isDisableEnableOp,
    updateIsDisableEnableOp,
  };

  // Modals functionality
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showChangeConfirmationModal, setShowChangeConfirmationModal] =
    React.useState(false);

  const onOpenAddModal = () => {
    setShowAddModal(true);
  };

  const onCloseAddModal = () => {
    setShowAddModal(false);
  };

  const onAddModalToggle = () => {
    setShowAddModal(!showAddModal);
  };

  const onOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const onToggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const onCloseConfirmationModal = () => {
    setShowChangeConfirmationModal(false);
  };

  const onOpenConfirmationModal = () => {
    setShowChangeConfirmationModal(true);
  };

  const onShowDefaultGroupOnModal = (group: string) => {
    setDefaultGroup(group);
    onOpenConfirmationModal();
  };

  const onCancelDefaultGroup = () => {
    setDefaultGroup(previousDefaultGroup);
    onCloseConfirmationModal();
  };

  // 'Delete automember rules data
  const deleteButtonsData = {
    updateIsDeleteButtonDisabled,
    updateIsDeletion,
  };

  const selectedData = {
    selectedItems: selectedAutomembers,
    clearSelected: clearSelectedRules,
  };

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={automemberRules}
          shownElementsList={automemberRules}
          elementData={automembersBulkSelectorData}
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
          ariaLabel="Search host rules"
          placeholder="Search host rules"
        />
      ),
      toolbarItemVariant: ToolbarItemVariant.label,
      toolbarItemGap: { default: "gapMd" },
    },
    {
      key: 2,
      element: (
        <TypeAheadSelect
          id="host-group"
          dataCy="auto-member-host-rules-typeahead-select"
          options={hostGroupsOptions}
          selected={defaultGroup}
          placeholder="Default host group"
          onSelectedChange={onShowDefaultGroupOnModal}
        />
      ),
    },
    {
      key: 3,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 4,
      element: (
        <SecondaryButton
          dataCy="auto-member-host-rules-button-refresh"
          onClickHandler={refreshData}
          isDisabled={hostGroupRulesData.isFetching}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 5,
      element: (
        <SecondaryButton
          dataCy="auto-member-host-rules-button-delete"
          isDisabled={isDeleteButtonDisabled || hostGroupRulesData.isFetching}
          onClickHandler={onOpenDeleteModal}
        >
          Delete
        </SecondaryButton>
      ),
    },
    {
      key: 6,
      element: (
        <SecondaryButton
          dataCy="auto-member-host-rules-button-add"
          isDisabled={hostGroupRulesData.isFetching}
          onClickHandler={onOpenAddModal}
        >
          Add
        </SecondaryButton>
      ),
    },
    {
      key: 7,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 8,
      element: (
        <HelpTextWithIconLayout
          textContent="Help"
          onClick={() => dispatch(toggleHelpPanel())}
        />
      ),
    },
    {
      key: 9,
      element: (
        <PaginationLayout
          list={automemberRules}
          totalCount={totalCount}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  return (
    <div>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="Automember host groups title"
          headingLevel="h1"
          text="Host group rules"
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
                style={{ height: "55vh", overflow: "auto" }}
              >
                {errors !== undefined && errors.length > 0 ? (
                  <GlobalErrors errors={globalErrors.getAll()} />
                ) : (
                  <MainTable
                    shownElementsList={automemberRules}
                    showTableRows={!hostGroupRulesData.isFetching}
                    elementsData={automembersTableData}
                    buttonsData={automembersTableButtonsData}
                    paginationData={selectedPerPageData}
                    searchValue={searchValue}
                    automemberType="host-group"
                  />
                )}
              </InnerScrollContainer>
            </OuterScrollContainer>
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}>
            <PaginationLayout
              list={automemberRules}
              totalCount={totalCount}
              variant={PaginationVariant.bottom}
              widgetId="pagination-options-menu-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>
      <AddRule
        show={showAddModal}
        handleModalToggle={onAddModalToggle}
        onOpenAddModal={onOpenAddModal}
        onCloseAddModal={onCloseAddModal}
        onRefresh={refreshData}
        groupsAvailableToAdd={groupsAvailableToAdd}
        ruleType="hostgroup"
      />
      <DeleteRule
        show={showDeleteModal}
        handleModalToggle={onToggleDeleteModal}
        onRefresh={refreshData}
        buttonsData={deleteButtonsData}
        selectedData={selectedData}
        ruleType="hostgroup"
      />
      <ConfirmationModal
        dataCy="auto-member-default-host-rules-modal"
        title="Default hostgroup"
        isOpen={showChangeConfirmationModal}
        onClose={onCloseConfirmationModal}
        actions={[
          <Button
            data-cy="modal-button-ok"
            variant="primary"
            key="change-default"
            onClick={() => {
              onSelectDefaultGroup(defaultGroup);
            }}
          >
            OK
          </Button>,
          <SecondaryButton
            key="cancel"
            onClickHandler={onCancelDefaultGroup}
            dataCy="modal-button-cancel"
          >
            Cancel
          </SecondaryButton>,
        ]}
        messageText="Are you sure you want to change default group?"
        messageObj={defaultGroup}
      />
    </div>
  );
};

export default AutoMemHostRules;
