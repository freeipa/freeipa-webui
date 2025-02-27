import React from "react";
// PatternFly
import {
  Page,
  PageSection,
  PageSectionVariants,
  PaginationVariant,
} from "@patternfly/react-core";
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Data types
import { SubId } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// Redux
import { useAppSelector } from "src/store/hooks";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import PaginationLayout from "src/components/layouts/PaginationLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import MainTable from "src/components/tables/MainTable";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
// RPC
import {
  SubIdDataPayload,
  useGetSubIdEntriesQuery,
  useSearchSubIdEntriesMutation,
} from "src/services/rpcSubordinateIDs";
// Modals
import AddModal from "src/components/modals/SubIdsModals/AddModal";

const SubordinateIDs = () => {
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
            error || "Error when searching for subordinate IDs",
            "danger"
          );
        } else {
          // Success
          const listResult = result.data.result.results;
          const listSize = result.data.result.count;
          const totalCount = result.data.result.totalCount;
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
    // As of now, this function is not used
    // eslint-disable-next-line @typescript-eslint/no-empty-function
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
          name="search"
          ariaLabel="Search subIds"
          placeholder="Search"
          searchValueData={searchValueData}
          isDisabled={searchDisabled}
        />
      ),
      toolbarItemVariant: "search-filter",
      toolbarItemSpacer: { default: "spacerMd" },
    },
    {
      key: 1,
      toolbarItemVariant: "separator",
    },
    {
      key: 2,
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
      key: 3,
      element: (
        <SecondaryButton
          isDisabled={!showTableRows}
          onClickHandler={onOpenAddModal}
        >
          Add
        </SecondaryButton>
      ),
    },
    {
      key: 4,
      toolbarItemVariant: "separator",
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
      toolbarItemAlignment: { default: "alignRight" },
    },
  ];

  // Render component
  return (
    <Page>
      <alerts.ManagedAlerts />
      <PageSection variant={PageSectionVariants.light}>
        <TitleLayout
          id="Subordinate IDs page"
          headingLevel="h1"
          text="Subordinate IDs"
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
                  showLink={false}
                />
              )}
            </InnerScrollContainer>
          </OuterScrollContainer>
        </div>
        <PaginationLayout
          list={subIds}
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
        title="Add Subordinate ID"
      />
    </Page>
  );
};

export default SubordinateIDs;
