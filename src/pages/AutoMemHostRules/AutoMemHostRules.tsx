import React from "react";
// PatternFly
import {
  Page,
  PageSection,
  PageSectionVariants,
  PaginationVariant,
  SelectOptionProps,
} from "@patternfly/react-core";
// PatternFly table
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Data types
import { AutomemberEntry } from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppSelector } from "src/store/hooks";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
// Tables
import MainTable from "../AutoMemUserRules/AutomemUserRulesTable";
// Components
import PaginationLayout from "../../components/layouts/PaginationLayout";
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
import TypeAheadSelect from "src/components/TypeAheadSelect";
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
// RPC
import { GenericPayload } from "src/services/rpc";
import { useSearchHostGroupRulesEntriesMutation } from "src/services/rpcAutomember";
// Hooks
import { useAlerts } from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import { useHostGroupsRulesData } from "src/hooks/useHostGroupRules";
// Utils
import {
  API_VERSION_BACKUP,
  isAutomemberUserGroupSelectable,
} from "src/utils/utils";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";

// Automembership host group rules
const AutoMemHostRules = () => {
  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({
    pathname: "host-group-rules",
  });

  // Set the page title to be shown in the browser tab
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  const NO_SELECTION = "No default group selected";

  const [hostGroups, setHostGroups] = React.useState<string[]>([]);
  const [automemberRules, setAutomemberRules] = React.useState<
    AutomemberEntry[]
  >([]);
  const [defaultGroup, setDefaultGroup] = React.useState<string>(NO_SELECTION);
  const [errors, setErrors] = React.useState<
    Array<FetchBaseQueryError | SerializedError>
  >([]);
  // Options for the default host group selector
  const [hostGroupsOptions, setHostGroupsOptions] = React.useState<
    SelectOptionProps[]
  >([]);

  // Alerts to show in the UI
  const alerts = useAlerts();

  // Handle API calls errors
  const globalErrors = useApiError([]);

  // URL parameters: page number, page size, search value
  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  const [totalCount, setTotalCount] = React.useState<number>(0);
  const [searchDisabled, setSearchIsDisabled] = React.useState<boolean>(false);

  // Page indexes
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  // API calls via custom hook
  const hostGroupRulesData = useHostGroupsRulesData();

  // Show table rows
  const [showTableRows, setShowTableRows] = React.useState(
    !hostGroupRulesData.isLoading
  );

  // Update table rows when the data is loaded
  React.useEffect(() => {
    if (showTableRows !== !hostGroupRulesData.isLoading) {
      setShowTableRows(!hostGroupRulesData.isLoading);
    }
  }, [hostGroupRulesData.isLoading]);

  // Main API call
  React.useEffect(() => {
    if (hostGroupRulesData.isFetching) {
      setShowTableRows(false);
    } else {
      if (hostGroupRulesData.errors && hostGroupRulesData.errors.length > 0) {
        setErrors(hostGroupRulesData.errors || []);
      } else {
        const fullAutomemberIds: AutomemberEntry[] =
          hostGroupRulesData.automembersIds;
        const totalAutomembersCount = fullAutomemberIds.length;
        // Paginate data based on first and last indexes
        const shownPaginatedRulesList: AutomemberEntry[] = [];
        if (hostGroupRulesData.automembersIds.length > 0) {
          const pagAutomemberIds = fullAutomemberIds.slice(firstIdx, lastIdx);
          shownPaginatedRulesList.push(...pagAutomemberIds);
        }
        // Update lists
        setHostGroups(hostGroupRulesData.hostGroups);
        setAutomemberRules(shownPaginatedRulesList);
        // If no default group is set, set it as 'No selection'
        if (defaultGroup === "" || hostGroupRulesData.defaultGroup === "") {
          setDefaultGroup(NO_SELECTION);
        } else {
          setDefaultGroup(hostGroupRulesData.defaultGroup);
        }

        // Set table count
        setTotalCount(totalAutomembersCount);
        // Show table elements
        setShowTableRows(true);
      }
    }
  }, [
    hostGroupRulesData.hostGroups,
    hostGroupRulesData.automembersIds,
    hostGroupRulesData.defaultGroup,
  ]);

  // Parse host groups to be shown in the default host group selector
  React.useEffect(() => {
    if (hostGroups.length > 0) {
      // Add empty entry as an option
      const groupsToSelector = [
        {
          value: NO_SELECTION,
          children: NO_SELECTION,
        },
      ];

      // Add the rest of the data from hostgroups
      const tempGroupsToSelector = hostGroups.map((group) => ({
        value: group,
        children: group,
      }));
      groupsToSelector.push(...tempGroupsToSelector);
      setHostGroupsOptions(groupsToSelector);
    }
  }, [hostGroups]);

  // If some entries' status has been updated, unselect selected rows
  const [isDisableEnableOp, setIsDisableEnableOp] = React.useState(false);

  const updateIsDisableEnableOp = (value: boolean) => {
    setIsDisableEnableOp(value);
  };

  // Elements selected (per page)
  //  - This will help to calculate the remaining elements on a specific page (bulk selector)
  const [selectedPerPage, setSelectedPerPage] = React.useState<number>(0);

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

  // Automembers displayed on the first page
  const updateShownAutomembersList = (
    newShownAutomembersList: AutomemberEntry[]
  ) => {
    setAutomemberRules(newShownAutomembersList);
  };

  // Update search input valie
  const updateSearchValue = (value: string) => {
    setSearchValue(value);
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
    setShowTableRows(false);
    setTotalCount(0);
    clearSelectedRules();
    hostGroupRulesData.refetch();
  };

  const [retrieveAutomembers] = useSearchHostGroupRulesEntriesMutation({});

  // Issue a search using a specific search value
  const submitSearchValue = () => {
    setShowTableRows(false);
    setSearchIsDisabled(true);
    setTotalCount(0);
    retrieveAutomembers({
      searchValue: searchValue,
      sizeLimit: 0,
      apiVersion: apiVersion || API_VERSION_BACKUP,
      startIdx: firstIdx,
      stopIdx: lastIdx,
    } as GenericPayload).then((result) => {
      if ("data" in result) {
        const automembersListResult = result.data;
        setTotalCount(result.data.length);
        setAutomemberRules(automembersListResult);
        // Show table elements
        setShowTableRows(true);
        setSearchIsDisabled(false);
      }
    });
  };

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  React.useEffect(() => {
    hostGroupRulesData.refetch();
  }, [page, perPage]);

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
  // - 'PaginationLayout'
  const paginationData = {
    page,
    perPage,
    updatePage,
    updatePerPage,
    updateSelectedPerPage,
    updateShownElementsList: updateShownAutomembersList,
    totalCount,
  };

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

  const selectedPerPageData = {
    selectedPerPage,
    updateSelectedPerPage,
  };

  // SearchInputLayout
  const searchValueData = {
    searchValue,
    updateSearchValue,
    submitSearchValue,
  };

  // 'Table'
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
          name="search"
          ariaLabel="Search rules"
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
      element: (
        <TypeAheadSelect
          id="host-group"
          options={hostGroupsOptions}
          selected={defaultGroup}
          placeholder="Default host group"
          onSelectedChange={setDefaultGroup}
        />
      ),
    },
    {
      key: 3,
      toolbarItemVariant: "separator",
    },
    {
      key: 4,
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
      key: 5,
      element: (
        <SecondaryButton isDisabled={isDeleteButtonDisabled || !showTableRows}>
          Delete
        </SecondaryButton>
      ),
    },
    {
      key: 6,
      element: (
        <SecondaryButton isDisabled={!showTableRows}>Add</SecondaryButton>
      ),
    },
    {
      key: 7,
      toolbarItemVariant: "separator",
    },
    {
      key: 8,
      element: <HelpTextWithIconLayout textContent="Help" />,
    },
    {
      key: 9,
      element: (
        <PaginationLayout
          list={automemberRules}
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
          id="Automember host groups title"
          headingLevel="h1"
          text="Host group rules"
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
              {errors !== undefined && errors.length > 0 ? (
                <GlobalErrors errors={globalErrors.getAll()} />
              ) : (
                <MainTable
                  shownElementsList={automemberRules}
                  showTableRows={showTableRows}
                  elementsData={automembersTableData}
                  buttonsData={automembersTableButtonsData}
                  paginationData={selectedPerPageData}
                  searchValue={searchValue}
                />
              )}
            </InnerScrollContainer>
          </OuterScrollContainer>
        </div>
        <PaginationLayout
          list={automemberRules}
          paginationData={paginationData}
          variant={PaginationVariant.bottom}
          widgetId="pagination-options-menu-bottom"
          className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        />
      </PageSection>
    </Page>
  );
};

export default AutoMemHostRules;
