import React from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  PageSection,
  PaginationVariant,
  ToolbarItemVariant,
} from "@patternfly/react-core";
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Data types
import { Trust } from "src/utils/datatypes/globalDataTypes";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useApiError from "src/hooks/useApiError";
// Redux
import { useAppSelector, useAppDispatch } from "src/store/hooks";
// RPC
import {
  useGetTrustsFullDataQuery,
  useSearchTrustsEntriesMutation,
} from "src/services/rpcTrusts";
// Utils
import { apiToTrust } from "src/utils/trustsUtils";
import { isTrustSelectable } from "src/utils/utils";
// React router
import { useNavigate } from "react-router";
// Components
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
import AddTrustModal from "./AddTrustModal";
import DeleteTrustModal from "./DeleteTrustModal";

const Trusts = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { browserTitle } = useUpdateRoute({
    pathname: "trusts",
  });

  // Set the page title to be shown in the browser tab
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  // URL parameters: page number, page size, search value
  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  // Handle API calls errors
  const globalErrors = useApiError([]);

  // Page indexes
  const firstUserIdx = (page - 1) * perPage;
  const lastUserIdx = page * perPage;

  // States
  const [isSearchDisabled, setIsSearchDisabled] = React.useState(false);

  // API calls
  const trustsResponse = useGetTrustsFullDataQuery({
    searchValue,
    apiVersion,
    sizelimit: 100,
    startIdx: firstUserIdx,
    stopIdx: lastUserIdx,
  });

  const { data, isLoading, error } = trustsResponse;

  // Process data and update state when response changes
  React.useEffect(() => {
    if (trustsResponse.isFetching) {
      globalErrors.clear();
      return;
    }

    // API response: Error
    if (
      !trustsResponse.isLoading &&
      trustsResponse.isError &&
      trustsResponse.error !== undefined
    ) {
      // This normally happens when the user is not authorized to view the data
      // So instead of adding an error, refresh page
      navigate("/login");
      window.location.reload();
    }
  }, [trustsResponse, navigate, globalErrors]);

  // Compute trusts data from API response
  const trusts = React.useMemo(() => {
    if (trustsResponse.isSuccess && trustsResponse.data && data !== undefined) {
      const listResult = data.result.results;
      const listSize = data.result.count;
      const elementsList: Trust[] = [];

      for (let i = 0; i < listSize; i++) {
        elementsList.push(apiToTrust(listResult[i].result));
      }

      return elementsList;
    }
    return [];
  }, [data, trustsResponse.isSuccess, trustsResponse.data]);

  // Compute total count from API response
  const totalCount = React.useMemo(() => {
    if (trustsResponse.isSuccess && trustsResponse.data) {
      return trustsResponse.data.result.totalCount;
    }
    return 0;
  }, [trustsResponse.isSuccess, trustsResponse.data]);

  // Compute derived state for showTableRows
  const showTableRows = React.useMemo(() => {
    if (trustsResponse.isFetching) {
      return false;
    }
    return !isLoading;
  }, [trustsResponse.isFetching, isLoading]);

  // Selected elements
  const [selectedElements, setSelectedElements] = React.useState<Trust[]>([]);
  const [selectedPerPage, setSelectedPerPage] = React.useState<number>(0);

  // Refresh button handling
  const refreshData = () => {
    // Reset selected elements on refresh
    setSelectedElements([]);

    trustsResponse.refetch();
  };

  // 'Delete' button state
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    React.useState<boolean>(true);

  const [isDeletion, setIsDeletion] = React.useState<boolean>(false);

  // Table-related shared functionality
  // - Selectable checkboxes on table
  const selectableTrustsTable = trusts.filter(isTrustSelectable);

  const updateSelectedTrusts = (trusts: Trust[], isSelected: boolean) => {
    let newSelectedTrusts: Trust[] = [];
    if (isSelected) {
      newSelectedTrusts = JSON.parse(JSON.stringify(selectedElements));
      for (let i = 0; i < trusts.length; i++) {
        if (
          selectedElements.find(
            (selectedTrust) => selectedTrust.cn === trusts[i].cn
          )
        ) {
          // Already in the list
          continue;
        }
        // Add element to list
        newSelectedTrusts.push(trusts[i]);
      }
    } else {
      // Remove element
      for (let i = 0; i < selectedElements.length; i++) {
        let found = false;
        for (let ii = 0; ii < trusts.length; ii++) {
          if (selectedElements[i].cn === trusts[ii].cn) {
            found = true;
            break;
          }
        }
        if (!found) {
          // Keep this valid selected entry
          newSelectedTrusts.push(selectedElements[i]);
        }
      }
    }
    setSelectedElements(newSelectedTrusts);
    setIsDeleteButtonDisabled(newSelectedTrusts.length === 0);
  };

  // - Helper method to set the selected entries from the table
  const setTrustsSelected = (trust: Trust, isSelecting = true) => {
    if (isTrustSelectable(trust)) {
      updateSelectedTrusts([trust], isSelecting);
    }
  };

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  React.useEffect(() => {
    trustsResponse.refetch();
  }, []);

  // Search API call
  const [searchEntry] = useSearchTrustsEntriesMutation();

  const submitSearchValue = () => {
    searchEntry({
      searchValue,
      apiVersion,
      sizelimit: 100,
      startIdx: 0,
      stopIdx: 100,
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
          dispatch(
            addAlert({
              name: "submit-search-value-error",
              title: error || "Error when searching for elements",
              variant: "danger",
            })
          );
        } else {
          // Success - data will be updated through the API response
          // No need to manually set state as it's computed from the response
        }
        setIsSearchDisabled(false);
      }
    });
  };

  // Data wrappers
  // TODO: Better separation of concerts
  // - 'PaginationLayout'
  const paginationData = {
    page,
    perPage,
    updatePage: setPage,
    updatePerPage: setPerPage,
    updateSelectedPerPage: setSelectedPerPage,
    totalCount,
  };

  // SearchInputLayout
  const searchValueData = {
    searchValue,
    updateSearchValue: setSearchValue,
    submitSearchValue,
  };

  // - 'BulkSelectorprep'
  const bulkSelectorData = {
    selected: selectedElements,
    updateSelected: updateSelectedTrusts,
    selectableTable: selectableTrustsTable,
    nameAttr: "cn",
  };

  const selectedPerPageData = {
    selectedPerPage,
    updateSelectedPerPage: setSelectedPerPage,
  };

  // Modals functionality
  const [showAddModal, setShowAddModal] = React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={trusts}
          shownElementsList={trusts}
          elementData={bulkSelectorData}
          buttonsData={{
            updateIsDeleteButtonDisabled: setIsDeleteButtonDisabled,
          }}
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
          ariaLabel="Search trusts"
          placeholder="Search"
          searchValueData={searchValueData}
          isDisabled={isSearchDisabled}
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
          dataCy="trusts-button-refresh"
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
          dataCy="trusts-button-delete"
          onClickHandler={() => setShowDeleteModal(true)}
        >
          Delete
        </SecondaryButton>
      ),
    },
    {
      key: 5,
      element: (
        <SecondaryButton
          isDisabled={!showTableRows}
          dataCy="trusts-button-add"
          onClickHandler={() => setShowAddModal(true)}
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
          list={trusts}
          paginationData={paginationData}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  // Render component
  return (
    <div>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout id="Trusts page" headingLevel="h1" text="Trusts" />
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
                {error !== undefined && error ? (
                  <GlobalErrors errors={globalErrors.getAll()} />
                ) : (
                  <MainTable
                    tableTitle="Trusts table"
                    shownElementsList={trusts}
                    pk="cn"
                    keyNames={["cn"]}
                    columnNames={["Realm name"]}
                    hasCheckboxes={true}
                    pathname="trusts"
                    showTableRows={showTableRows}
                    showLink={false}
                    elementsData={{
                      isElementSelectable: isTrustSelectable,
                      selectedElements,
                      selectableElementsTable: selectableTrustsTable,
                      setElementsSelected: setTrustsSelected,
                      clearSelectedElements: () => setSelectedElements([]),
                    }}
                    buttonsData={{
                      updateIsDeleteButtonDisabled: (value) =>
                        setIsDeleteButtonDisabled(value),
                      isDeletion,
                      updateIsDeletion: (value) => setIsDeletion(value),
                      isDisableEnableOp: true,
                    }}
                    paginationData={{
                      selectedPerPage,
                      updateSelectedPerPage: setSelectedPerPage,
                    }}
                  />
                )}
              </InnerScrollContainer>
            </OuterScrollContainer>
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}>
            <PaginationLayout
              list={trusts}
              paginationData={paginationData}
              variant={PaginationVariant.bottom}
              widgetId="pagination-options-menu-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>
      <AddTrustModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add trust"
        onRefresh={refreshData}
      />
      <DeleteTrustModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        elementsToDelete={selectedElements}
        clearSelectedElements={() => setSelectedElements([])}
        columnNames={["Realm name"]}
        keyNames={["cn"]}
        onRefresh={refreshData}
        updateIsDeleteButtonDisabled={setIsDeleteButtonDisabled}
        updateIsDeletion={setIsDeletion}
      />
    </div>
  );
};

export default Trusts;
