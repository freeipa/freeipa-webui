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
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useApiError from "src/hooks/useApiError";
// Redux
import { useAppSelector } from "src/store/hooks";
// RPC
import {
  IdRangeDataPayload,
  useGetIdRangeEntriesQuery,
  useSearchIdRangesEntriesMutation,
} from "src/services/rpcIdRanges";
import { IdRange } from "src/utils/datatypes/globalDataTypes";
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
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
import { isIdRangeSelectable } from "src/utils/utils";

const IdRanges = () => {
  const navigate = useNavigate();

  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({ pathname: "id-ranges" });

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

  const [selectedPerPage, setSelectedPerPage] = React.useState<number>(0);

  // Handle API calls errors
  const globalErrors = useApiError([]);

  // Page indexes
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  const selectedPerPageData = {
    selectedPerPage,
    updateSelectedPerPage: setSelectedPerPage,
  };

  // States
  const [idRanges, setIdRanges] = React.useState<IdRange[]>([]);
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    React.useState<boolean>(true);
  const [isSearchDisabled, setIsSearchDisabled] =
    React.useState<boolean>(false);
  const [totalCount, setTotalCount] = React.useState<number>(0);

  // Selection state for checkboxes
  const [selectedElements, setSelectedElements] = React.useState<IdRange[]>([]);
  const selectableIdRangesTable = idRanges.filter(isIdRangeSelectable);
  const clearSelectedElements = () => setSelectedElements([]);

  const updateSelectedIdRanges = (idRange: IdRange[], isSelected: boolean) => {
    let newSelectedIdRanges: IdRange[] = [];
    if (isSelected) {
      newSelectedIdRanges = JSON.parse(JSON.stringify(selectedElements));
      for (let i = 0; i < idRange.length; i++) {
        if (
          selectedElements.find(
            (selectedIdRange) => selectedIdRange.cn === idRange[i].cn
          )
        ) {
          // Already in the list
          continue;
        }
        // Add element to list
        newSelectedIdRanges.push(idRange[i]);
      }
    }
    setSelectedElements(newSelectedIdRanges);
    setIsDeleteButtonDisabled(newSelectedIdRanges.length === 0);
  };

  const setIdRangesSelected = (idRange: IdRange, isSelecting = true) => {
    if (isIdRangeSelectable(idRange)) {
      updateSelectedIdRanges([idRange], isSelecting);
    }
  };

  // API calls (batch detailed list)
  const idRangesDataResponse = useGetIdRangeEntriesQuery({
    searchValue,
    apiVersion,
    sizelimit: 100,
    startIdx: firstIdx,
    stopIdx: lastIdx,
  } as IdRangeDataPayload);

  const {
    data: batchResponse,
    isLoading,
    error: batchError,
  } = idRangesDataResponse;

  // Handle data when the API call is finished
  React.useEffect(() => {
    if (idRangesDataResponse.isFetching) {
      setShowTableRows(false);
      setTotalCount(0);
      globalErrors.clear();
      return;
    }

    if (
      idRangesDataResponse.isSuccess &&
      idRangesDataResponse.data &&
      batchResponse !== undefined
    ) {
      const listResult = batchResponse.result.results;
      const total = batchResponse.result.totalCount;
      const listSize = batchResponse.result.count;
      const elementsList: IdRange[] = [];

      for (let i = 0; i < listSize; i++) {
        elementsList.push(listResult[i].result as IdRange);
      }

      setTotalCount(total);
      setIdRanges(elementsList);
      setShowTableRows(true);
    }

    if (
      !idRangesDataResponse.isLoading &&
      idRangesDataResponse.isError &&
      idRangesDataResponse.error !== undefined
    ) {
      // This normally happens when the user is not authorized to view the data
      // So instead of adding an error, refresh page
      navigate("/login");
      window.location.reload();
    }
  }, [batchResponse]);

  // Refresh button handling
  const refreshData = () => {
    setShowTableRows(false);
    setTotalCount(0);

    idRangesDataResponse.refetch().then(() => {
      setShowTableRows(true);
    });
  };

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  React.useEffect(() => {
    idRangesDataResponse.refetch();
  }, []);

  // Show table rows
  const [showTableRows, setShowTableRows] = React.useState<boolean>(!isLoading);

  // Show table rows only when data is fully retrieved
  React.useEffect(() => {
    if (idRangesDataResponse.isSuccess && idRangesDataResponse.data) {
      setShowTableRows(true);
    }
  }, [idRangesDataResponse.isSuccess, idRangesDataResponse.data]);

  // Search API call (batch)
  const [searchEntry] = useSearchIdRangesEntriesMutation();

  const submitSearchValue = () => {
    searchEntry({
      searchValue: searchValue,
      apiVersion,
      sizelimit: 100,
      startIdx: 0,
      stopIdx: 200,
    }).then((result) => {
      if ("data" in result && result.data !== undefined) {
        const searchError = result.data?.error as
          | FetchBaseQueryError
          | SerializedError;

        if (searchError) {
          // Error
          let errMsg: string | undefined = "";
          if ("error" in searchError) {
            errMsg = searchError.error;
          }
          alerts.addAlert(
            "submit-search-value-error",
            errMsg || "Error when searching for elements",
            "danger"
          );
        } else {
          // Success
          const listResult = result.data?.result.results || [];
          const listSize = result.data?.result.count || 0;
          const total = result.data?.result.totalCount || 0;
          const elementsList: IdRange[] = [];

          for (let i = 0; i < listSize; i++) {
            elementsList.push(listResult[i].result as IdRange);
          }

          setTotalCount(total);
          setIdRanges(elementsList);
          setShowTableRows(true);
        }
        setIsSearchDisabled(false);
      }
    });
  };

  const bulkSelectorData = {
    selected: selectedElements,
    updateSelected: updateSelectedIdRanges,
    selectableTable: selectableIdRangesTable,
    nameAttr: "cn",
  };

  // Data wrappers
  const paginationData = {
    page,
    perPage,
    updatePage: setPage,
    updatePerPage: setPerPage,
    updateSelectedPerPage: () => {},
    updateShownElementsList: setIdRanges,
    totalCount,
  };

  // SearchInputLayout
  const searchValueData = {
    searchValue,
    updateSearchValue: setSearchValue,
    submitSearchValue,
  };

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={idRanges}
          shownElementsList={idRanges}
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
          ariaLabel="Search ID ranges"
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
          dataCy="id-ranges-button-refresh"
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
          dataCy="id-ranges-button-delete"
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
          dataCy="id-ranges-button-add"
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
          list={idRanges}
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
      <alerts.ManagedAlerts />
      <PageSection hasBodyWrapper={false}>
        <TitleLayout id="ID ranges page" headingLevel="h1" text="ID ranges" />
      </PageSection>
      <PageSection hasBodyWrapper={false} isFilled={false}>
        <Flex direction={{ default: "column" }}>
          <FlexItem>
            <ToolbarLayout toolbarItems={toolbarItems} />
          </FlexItem>
          <FlexItem style={{ flex: "1 1 auto", overflow: "hidden" }}>
            <OuterScrollContainer
              style={{ height: "100%", overflow: "hidden" }}
            >
              <InnerScrollContainer
                style={{ height: "100%", overflow: "auto" }}
              >
                {batchError !== undefined && batchError ? (
                  <GlobalErrors errors={globalErrors.getAll()} />
                ) : (
                  <MainTable
                    tableTitle="ID ranges table"
                    shownElementsList={idRanges}
                    pk="cn"
                    keyNames={[
                      "cn",
                      "ipabaseid",
                      "ipaidrangesize",
                      "iparangetype",
                    ]}
                    columnNames={[
                      "Range name",
                      "First Posix ID of the range",
                      "Number of IDs in the range",
                      "Range type",
                    ]}
                    hasCheckboxes={true}
                    pathname="id-ranges"
                    showTableRows={showTableRows}
                    showLink={true}
                    elementsData={{
                      isElementSelectable: isIdRangeSelectable,
                      selectedElements,
                      selectableElementsTable: selectableIdRangesTable,
                      setElementsSelected: setIdRangesSelected,
                      clearSelectedElements,
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
              list={idRanges}
              paginationData={paginationData}
              variant={PaginationVariant.bottom}
              widgetId="pagination-options-menu-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>
    </div>
  );
};

export default IdRanges;
