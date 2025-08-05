import React from "react";
// PatternFly
import { Page, PageSection, PaginationVariant } from "@patternfly/react-core";
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Data types
import { PwPolicy } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useApiError from "src/hooks/useApiError";
// Redux
import { useAppSelector } from "src/store/hooks";
// Components
import {
  useGetPwPoliciesEntriesQuery,
  useSearchPwdPolicyEntriesMutation,
} from "src/services/rpcPwdPolicies";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import PaginationLayout from "src/components/layouts/PaginationLayout";
import TitleLayout from "src/components/layouts/TitleLayout";
import GlobalErrors from "src/components/errors/GlobalErrors";
import MainTable from "src/components/tables/MainTable";
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
import { isPwPolicySelectable } from "src/utils/utils";
// Modals
import AddModal from "src/components/modals/PwPoliciesModals/AddModal";
import DeleteModal from "src/components/modals/PwPoliciesModals/DeleteModal";

const PasswordPolicies = () => {
  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({ pathname: "password-policies" });

  // Set the page title to be shown in the browser tab
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  // Alerts to show in the UI
  const alerts = useAlerts();

  // URL parameters: page number, page size, search value
  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  // Handle API calls errors
  const globalErrors = useApiError([]);

  // Page indexes
  const firstUserIdx = (page - 1) * perPage;
  const lastUserIdx = page * perPage;

  // States
  const [pwPolicies, setPwPolicies] = React.useState<PwPolicy[]>([]);
  const [searchIsDisabled, setSearchIsDisabled] =
    React.useState<boolean>(false);
  const [totalCount, setTotalCount] = React.useState<number>(0);

  // API calls
  const pwPoliciesResponse = useGetPwPoliciesEntriesQuery({
    searchValue: searchValue,
    apiVersion,
    sizelimit: 100,
    startIdx: firstUserIdx,
    stopIdx: lastUserIdx,
  });

  const { data, isLoading, error } = pwPoliciesResponse;

  // Handle data when the API call is finished
  React.useEffect(() => {
    if (pwPoliciesResponse.isFetching) {
      setShowTableRows(false);
      // Reset selected elements on refresh
      setTotalCount(0);
      globalErrors.clear();
      return;
    }

    // API response: Success
    if (
      pwPoliciesResponse.isSuccess &&
      pwPoliciesResponse.data &&
      data !== undefined
    ) {
      const listResult = data.result.results;
      const totalCount = data.result.totalCount;
      const listSize = data.result.count;
      const elementsList: PwPolicy[] = [];

      for (let i = 0; i < listSize; i++) {
        elementsList.push(listResult[i].result);
      }

      setTotalCount(totalCount);
      // Update the list of elements
      setPwPolicies(elementsList);
      // Show table elements
      setShowTableRows(true);
    }

    // API response: Error
    if (
      !pwPoliciesResponse.isLoading &&
      pwPoliciesResponse.isError &&
      pwPoliciesResponse.error !== undefined
    ) {
      // This normally happens when the user is not authorized to view the data
      // So instead of adding an error, refresh page
      window.location.reload();
    }
  }, [pwPoliciesResponse]);

  // Selected elements
  const [selectedElements, setSelectedElements] = React.useState<PwPolicy[]>(
    []
  );
  const [selectedPerPage, setSelectedPerPage] = React.useState<number>(0);

  const updateSelectedPerPage = (selected: number) => {
    setSelectedPerPage(selected);
  };

  const clearSelectedElements = () => {
    const emptyList: PwPolicy[] = [];
    setSelectedElements(emptyList);
  };

  // Refresh button handling
  const refreshData = () => {
    // Hide table
    setShowTableRows(false);

    // Reset selected elements on refresh
    setTotalCount(0);

    pwPoliciesResponse.refetch().then(() => {
      setShowTableRows(true);
    });
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
  const selectablePwPoliciesTable = pwPolicies.filter(isPwPolicySelectable); // elements per Table

  const updateSelectedPwPolicies = (
    pwPolicy: PwPolicy[],
    isSelected: boolean
  ) => {
    let newSelectedPwPolicies: PwPolicy[] = [];
    if (isSelected) {
      newSelectedPwPolicies = JSON.parse(JSON.stringify(selectedElements));
      for (let i = 0; i < pwPolicy.length; i++) {
        if (
          selectedElements.find(
            (selectedPwPolicy) => selectedPwPolicy.cn[0] === pwPolicy[i].cn[0]
          )
        ) {
          // Already in the list
          continue;
        }
        // Add element to list
        newSelectedPwPolicies.push(pwPolicy[i]);
      }
    } else {
      // Remove element
      for (let i = 0; i < selectedElements.length; i++) {
        let found = false;
        for (let ii = 0; ii < pwPolicy.length; ii++) {
          if (selectedElements[i].cn[0] === pwPolicy[ii].cn[0]) {
            found = true;
            break;
          }
        }
        if (!found) {
          // Keep this valid selected entry
          newSelectedPwPolicies.push(selectedElements[i]);
        }
      }
    }
    setSelectedElements(newSelectedPwPolicies);
    setIsDeleteButtonDisabled(newSelectedPwPolicies.length === 0);
  };

  // - Helper method to set the selected entries from the table
  const setPwPoliciesSelected = (pwPolicy: PwPolicy, isSelecting = true) => {
    if (isPwPolicySelectable(pwPolicy)) {
      updateSelectedPwPolicies([pwPolicy], isSelecting);
    }
  };

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  React.useEffect(() => {
    pwPoliciesResponse.refetch();
  }, []);

  // Show table rows
  const [showTableRows, setShowTableRows] = React.useState(!isLoading);

  // Show table rows only when data is fully retrieved
  React.useEffect(() => {
    if (showTableRows !== !isLoading) {
      setShowTableRows(!isLoading);
    }
  }, [isLoading]);

  // Pagination
  const updatePage = (newPage: number) => {
    setPage(newPage);
  };

  const updatePerPage = (newSetPerPage: number) => {
    setPerPage(newSetPerPage);
  };

  // Elements displayed on the first page
  const updateShownElementsList = (newShownElementsList: PwPolicy[]) => {
    setPwPolicies(newShownElementsList);
  };

  // Update search input valie
  const updateSearchValue = (value: string) => {
    setSearchValue(value);
  };

  // Search API call
  const [searchEntry] = useSearchPwdPolicyEntriesMutation();

  const submitSearchValue = () => {
    searchEntry({
      searchValue: searchValue,
      apiVersion,
      sizelimit: 100,
      startIdx: 0,
      stopIdx: 200, // Search will consider a max. of elements
    }).then((result) => {
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
            error || "Error when searching for subordinate IDs",
            "danger"
          );
        } else {
          // Success
          const listResult = result.data?.result.results || [];
          const listSize = result.data?.result.count || 0;
          const totalCount = result.data?.result.totalCount || 0;
          const elementsList: PwPolicy[] = [];

          for (let i = 0; i < listSize; i++) {
            elementsList.push(listResult[i].result);
          }

          setTotalCount(totalCount);
          setPwPolicies(elementsList);
          setShowTableRows(true);
        }
        setSearchIsDisabled(false);
      }
    });
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
    updateShownElementsList: updateShownElementsList,
    totalCount,
  };

  const buttonsData = {
    updateIsDeleteButtonDisabled,
  };

  // SearchInputLayout
  const searchValueData = {
    searchValue,
    updateSearchValue,
    submitSearchValue,
  };

  // - 'BulkSelectorrep'
  const bulkSelectorData = {
    selected: selectedElements,
    updateSelected: updateSelectedPwPolicies,
    selectableTable: selectablePwPoliciesTable,
    nameAttr: "cn",
  };

  const selectedPerPageData = {
    selectedPerPage,
    updateSelectedPerPage,
  };

  // Modals functionality
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const onOpenAddModal = () => {
    setShowAddModal(true);
  };

  const onCloseAddModal = () => {
    setShowAddModal(false);
  };

  const onOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const onCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={pwPolicies}
          shownElementsList={pwPolicies}
          elementData={bulkSelectorData}
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
          ariaLabel="Search subIds"
          placeholder="Search"
          searchValueData={searchValueData}
          isDisabled={searchIsDisabled}
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
          dataCy="password-policies-button-refresh"
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
          dataCy="password-policies-button-delete"
          isDisabled={isDeleteButtonDisabled || !showTableRows}
          onClickHandler={onOpenDeleteModal}
        >
          Delete
        </SecondaryButton>
      ),
    },
    {
      key: 5,
      element: (
        <SecondaryButton
          dataCy="password-policies-button-add"
          isDisabled={!showTableRows}
          onClickHandler={onOpenAddModal}
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
      element: <HelpTextWithIconLayout textContent="Help" />,
    },
    {
      key: 8,
      element: (
        <PaginationLayout
          list={pwPolicies}
          paginationData={paginationData}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignRight" },
    },
  ];

  // Render component
  return (
    <Page>
      <alerts.ManagedAlerts />
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="Password policies page"
          headingLevel="h1"
          text="Password policies"
        />
      </PageSection>
      <PageSection
        hasBodyWrapper={false}
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
              {error !== undefined && error ? (
                <GlobalErrors errors={globalErrors.getAll()} />
              ) : (
                <MainTable
                  tableTitle="Password policies table"
                  shownElementsList={pwPolicies}
                  pk="cn"
                  keyNames={["cn", "cospriority"]}
                  columnNames={["Group", "Priority"]}
                  hasCheckboxes={true}
                  pathname="password-policies"
                  showTableRows={showTableRows}
                  showLink={true}
                  elementsData={{
                    isElementSelectable: isPwPolicySelectable,
                    selectedElements,
                    selectableElementsTable: selectablePwPoliciesTable,
                    setElementsSelected: setPwPoliciesSelected,
                    clearSelectedElements,
                  }}
                  buttonsData={{
                    updateIsDeleteButtonDisabled,
                    isDeletion,
                    updateIsDeletion,
                  }}
                  paginationData={{
                    selectedPerPage,
                    updateSelectedPerPage,
                  }}
                />
              )}
            </InnerScrollContainer>
          </OuterScrollContainer>
        </div>
        <PaginationLayout
          list={pwPolicies}
          paginationData={paginationData}
          variant={PaginationVariant.bottom}
          widgetId="pagination-options-menu-bottom"
          className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        />
      </PageSection>
      <AddModal
        isOpen={showAddModal}
        onCloseModal={onCloseAddModal}
        onRefresh={refreshData}
        title="Add password policy"
      />
      <DeleteModal
        show={showDeleteModal}
        onClose={onCloseDeleteModal}
        selectedData={{
          selectedElements,
          clearSelectedElements,
        }}
        buttonsData={{
          updateIsDeleteButtonDisabled,
          updateIsDeletion,
        }}
        columnNames={["Group", "Priority"]}
        keyNames={["cn", "cospriority"]}
        onRefresh={refreshData}
      />
    </Page>
  );
};

export default PasswordPolicies;
