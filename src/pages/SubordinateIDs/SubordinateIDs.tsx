import React from "react";
// PatternFly
import {
  Button,
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
import { SubId } from "src/utils/datatypes/globalDataTypes";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// Redux
import { useAppSelector, useAppDispatch } from "src/store/hooks";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import PaginationLayout from "src/components/layouts/PaginationLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import MainTable from "src/components/tables/MainTable";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
// RPC
import {
  SubIdDataPayload,
  useGetSubIdEntriesQuery,
  useSearchSubIdEntriesMutation,
} from "src/services/rpcSubIds";
// Modals
import AddModal from "src/components/modals/SubIdsModals/AddModal";

const SubordinateIDs = () => {
  const dispatch = useAppDispatch();

  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({ pathname: "subordinate-ids" });

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
  const [subIds, setSubIds] = React.useState<SubId[]>([]);
  const [searchDisabled, setSearchIsDisabled] = React.useState<boolean>(false);
  const [totalCount, setTotalCount] = React.useState<number>(0);

  // API calls
  const subIdsDataResponse = useGetSubIdEntriesQuery({
    searchValue: searchValue,
    apiVersion,
    sizelimit: 100,
    startIdx: firstUserIdx,
    stopIdx: lastUserIdx,
  } as SubIdDataPayload);

  const {
    data: batchResponse,
    isLoading: isBatchLoading,
    error: batchError,
  } = subIdsDataResponse;

  // Handle data when the API call is finished
  React.useEffect(() => {
    if (subIdsDataResponse.isFetching) {
      setShowTableRows(false);
      // Reset selected elements on refresh
      setTotalCount(0);
      globalErrors.clear();
      return;
    }

    // API response: Success
    if (
      subIdsDataResponse.isSuccess &&
      subIdsDataResponse.data &&
      batchResponse !== undefined
    ) {
      const listResult = batchResponse.result.results;
      const totalCount = batchResponse.result.totalCount;
      const listSize = batchResponse.result.count;
      const elementsList: SubId[] = [];

      for (let i = 0; i < listSize; i++) {
        elementsList.push(listResult[i].result);
      }

      setTotalCount(totalCount);
      // Update the list of elements
      setSubIds(elementsList);
      // Show table elements
      setShowTableRows(true);
    }

    // API response: Error
    if (
      !subIdsDataResponse.isLoading &&
      subIdsDataResponse.isError &&
      subIdsDataResponse.error !== undefined
    ) {
      // This normally happens when the user is not authorized to view the data
      // So instead of adding an error, refresh page
      window.location.reload();
    }
  }, [batchResponse]);

  // Refresh button handling
  const refreshData = () => {
    // Hide table
    setShowTableRows(false);

    // Reset selected elements on refresh
    setTotalCount(0);

    subIdsDataResponse.refetch().then(() => {
      setShowTableRows(true);
    });
  };

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  React.useEffect(() => {
    subIdsDataResponse.refetch();
  }, []);

  // Show table rows
  const [showTableRows, setShowTableRows] = React.useState(!isBatchLoading);

  // Show table rows only when data is fully retrieved
  React.useEffect(() => {
    if (showTableRows !== !isBatchLoading) {
      setShowTableRows(!isBatchLoading);
    }
  }, [isBatchLoading]);

  // Pagination
  const updatePage = (newPage: number) => {
    setPage(newPage);
  };

  const updatePerPage = (newSetPerPage: number) => {
    setPerPage(newSetPerPage);
  };

  // Elements displayed on the first page
  const updateShownElementsList = (newShownElementsList: SubId[]) => {
    setSubIds(newShownElementsList);
  };

  // Update search input valie
  const updateSearchValue = (value: string) => {
    setSearchValue(value);
  };

  // Search API call
  const [searchEntry] = useSearchSubIdEntriesMutation();

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
          dispatch(
            addAlert({
              name: "submit-search-value-error",
              title: error || "Error when searching for subordinate IDs",
              variant: "danger",
            })
          );
        } else {
          // Success
          const listResult = result.data?.result.results || [];
          const listSize = result.data?.result.count || 0;
          const totalCount = result.data?.result.totalCount || 0;
          const elementsList: SubId[] = [];

          for (let i = 0; i < listSize; i++) {
            elementsList.push(listResult[i].result);
          }

          setTotalCount(totalCount);
          setSubIds(elementsList);
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
    updateSelectedPerPage: () => {},
    updateShownElementsList: updateShownElementsList,
    totalCount,
  };

  // SearchInputLayout
  const searchValueData = {
    searchValue,
    updateSearchValue,
    submitSearchValue,
  };

  // Modals functionality
  const [showAddModal, setShowAddModal] = React.useState(false);

  const onOpenAddModal = () => {
    setShowAddModal(true);
  };

  const onCloseAddModal = () => {
    setShowAddModal(false);
  };

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <SearchInputLayout
          dataCy="search"
          name="search"
          ariaLabel="Search subIds"
          placeholder="Search"
          searchValueData={searchValueData}
          isDisabled={searchDisabled}
        />
      ),
      toolbarItemVariant: ToolbarItemVariant.label,
      toolbarItemGap: { default: "gapMd" },
    },
    {
      key: 1,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 2,
      element: (
        <Button
          data-cy="subids-button-refresh"
          onClick={refreshData}
          isDisabled={!showTableRows}
          variant="secondary"
        >
          Refresh
        </Button>
      ),
    },
    {
      key: 3,
      element: (
        <Button
          data-cy="subids-button-add"
          isDisabled={!showTableRows}
          onClick={onOpenAddModal}
          variant="secondary"
        >
          Add
        </Button>
      ),
    },
    {
      key: 4,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 5,
      element: <HelpTextWithIconLayout textContent="Help" />,
    },
    {
      key: 6,
      element: (
        <PaginationLayout
          list={subIds}
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
        <TitleLayout
          id="Subordinate IDs page"
          headingLevel="h1"
          text="Subordinate IDs"
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
                  <MainTable
                    tableTitle="Subordinate IDs table"
                    shownElementsList={subIds}
                    pk="ipauniqueid"
                    keyNames={[
                      "ipauniqueid",
                      "ipaowner",
                      "ipasubgidnumber",
                      "ipasubuidnumber",
                    ]}
                    columnNames={[
                      "Unique ID",
                      "Owner",
                      "SubGID range start",
                      "SubUID range start",
                    ]}
                    hasCheckboxes={false}
                    pathname="subordinate-ids"
                    showTableRows={showTableRows}
                    showLink={true}
                  />
                )}
              </InnerScrollContainer>
            </OuterScrollContainer>
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}>
            <PaginationLayout
              list={subIds}
              paginationData={paginationData}
              variant={PaginationVariant.bottom}
              widgetId="pagination-options-menu-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>
      <AddModal
        isOpen={showAddModal}
        onCloseModal={onCloseAddModal}
        onRefresh={refreshData}
        title="Add Subordinate ID"
      />
    </div>
  );
};

export default SubordinateIDs;
