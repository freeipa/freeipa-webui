import React from "react";
// PatternFly
import {
  PageSection,
  PaginationVariant,
  ToolbarItemVariant,
} from "@patternfly/react-core";
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Data types
import { DNSForwardZone } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useApiError from "src/hooks/useApiError";
// Redux
import { useAppSelector } from "src/store/hooks";
// RPC
import {
  useGetDnsForwardZonesFullDataQuery,
  useSearchDnsForwardZonesEntriesMutation,
} from "src/services/rpcDnsForwardZones";
// Utils
import { isDnsForwardZoneSelectable } from "src/utils/utils";
// React router
import { useNavigate } from "react-router";
// Components
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
import { apiToDnsForwardZone } from "src/utils/dnsForwardZonesUtils";

const DnsForwardZones = () => {
  const navigate = useNavigate();

  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({
    pathname: "dns-forward-zones",
  });

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
  const [dnsForwardZones, setDnsForwardZones] = React.useState<
    DNSForwardZone[]
  >([]);
  const [isSearchDisabled, setIsSearchDisabled] =
    React.useState<boolean>(false);
  const [totalCount, setTotalCount] = React.useState<number>(0);

  // API calls
  const forwardDnsZonesResponse = useGetDnsForwardZonesFullDataQuery({
    searchValue,
    apiVersion,
    startIdx: firstUserIdx,
    stopIdx: lastUserIdx,
  });

  const { data, isLoading, error } = forwardDnsZonesResponse;

  // Handle data when the API call is finished
  React.useEffect(() => {
    if (forwardDnsZonesResponse.isFetching) {
      setShowTableRows(false);
      // Reset selected elements on refresh
      setTotalCount(0);
      globalErrors.clear();
      return;
    }

    // API response: Success
    if (
      forwardDnsZonesResponse.isSuccess &&
      forwardDnsZonesResponse.data &&
      data != undefined
    ) {
      const listResult = data.result.results;
      const elementsList: DNSForwardZone[] = (
        listResult as unknown as Record<string, unknown>[]
      )
        .filter((result) => "result" in result)
        .map((result) => apiToDnsForwardZone(result.result));

      setTotalCount(forwardDnsZonesResponse.data.result.totalCount);
      // Update the list of elements
      setDnsForwardZones(elementsList);
      // Show table elements
      setShowTableRows(true);
    }

    // API response: Error
    if (
      !forwardDnsZonesResponse.isLoading &&
      forwardDnsZonesResponse.isError &&
      forwardDnsZonesResponse.error !== undefined
    ) {
      // This normally happens when the user is not authorized to view the data
      // So instead of adding an error, refresh page
      navigate("/login");
      window.location.reload();
    }
  }, [forwardDnsZonesResponse]);

  // Selected elements
  const [selectedElements, setSelectedElements] = React.useState<
    DNSForwardZone[]
  >([]);
  const [selectedPerPage, setSelectedPerPage] = React.useState<number>(0);

  // Refresh button handling
  const refreshData = () => {
    // Hide table
    setShowTableRows(false);

    // Reset selected elements on refresh
    setTotalCount(0);

    forwardDnsZonesResponse.refetch().then(() => {
      setShowTableRows(true);
    });
  };

  // 'Delete' button state
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    React.useState<boolean>(true);

  const [isDeletion, setIsDeletion] = React.useState<boolean>(false);

  // 'Enable' button state
  const [isEnableButtonDisabled, setIsEnableButtonDisabled] =
    React.useState<boolean>(true);

  // 'Disable' button state
  const [isDisableButtonDisabled, setIsDisableButtonDisabled] =
    React.useState<boolean>(true);

  // Table-related shared functionality
  // - Selectable checkboxes on table
  const selectableDnsZonesTable = dnsForwardZones.filter(
    isDnsForwardZoneSelectable
  ); // elements per Table

  const updateSelectedDnsZones = (
    dnsZones: DNSForwardZone[],
    isSelected: boolean
  ) => {
    if (isSelected) {
      setSelectedElements((current) => [...new Set([...current, ...dnsZones])]);
    } else {
      const newSelectedDnsZones = selectedElements.filter(
        (current) =>
          !dnsZones.some((newZone) => newZone.idnsname === current.idnsname)
      );
      setSelectedElements(newSelectedDnsZones);
    }
  };

  // - Helper method to set the selected entries from the table
  const setDnsZonesSelected = (dnsZone: DNSForwardZone, isSelecting = true) => {
    if (isDnsForwardZoneSelectable(dnsZone)) {
      updateSelectedDnsZones([dnsZone], isSelecting);
    }
  };

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  React.useEffect(() => {
    forwardDnsZonesResponse.refetch();
  }, []);

  // Show table rows
  const [showTableRows, setShowTableRows] = React.useState(!isLoading);

  // Show table rows only when data is fully retrieved
  React.useEffect(() => {
    if (showTableRows !== !isLoading) {
      setShowTableRows(!isLoading);
    }
  }, [isLoading]);

  // Search API call
  const [searchEntry] = useSearchDnsForwardZonesEntriesMutation();

  const submitSearchValue = () => {
    searchEntry({
      searchValue: searchValue,
      apiVersion,
      startIdx: 0,
      stopIdx: 200, // Search will consider a max. of elements
    }).then((result) => {
      if ("error" in result && !("data" in result)) {
        const searchError = result.error;
        let error: string | undefined = "";
        if ("error" in searchError) {
          error = searchError.error;
        } else if ("message" in searchError) {
          error = searchError.message;
        }
        alerts.addAlert(
          "submit-search-value-error",
          error || "Error when searching for elements",
          "danger"
        );
      } else {
        // Success
        const dnsForwardZones = result.data?.result || [];

        setTotalCount(dnsForwardZones.length);
        setDnsForwardZones(dnsForwardZones);
        setShowTableRows(true);
      }
      setIsSearchDisabled(false);
    });
  };

  // Data wrappers
  // TODO: Better separation of concerns
  // - 'PaginationLayout'
  const paginationData = {
    page,
    perPage,
    updatePage: setPage,
    updatePerPage: setPerPage,
    updateSelectedPerPage: setSelectedPerPage,
    updateShownElementsList: setDnsForwardZones,
    totalCount,
  };

  // SearchInputLayout
  const searchValueData = {
    searchValue,
    updateSearchValue: setSearchValue,
    submitSearchValue,
  };

  // - 'BulkSelectorPrep'
  const bulkSelectorData = {
    selected: selectedElements,
    updateSelected: updateSelectedDnsZones,
    selectableTable: selectableDnsZonesTable,
    nameAttr: "idnsname",
  };

  const selectedPerPageData = {
    selectedPerPage,
    updateSelectedPerPage: setSelectedPerPage,
  };

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={dnsForwardZones}
          shownElementsList={dnsForwardZones}
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
          name="search"
          ariaLabel="Search dns zones"
          placeholder="Search"
          searchValueData={searchValueData}
          isDisabled={isSearchDisabled}
          dataCy={"search"}
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
          onClickHandler={refreshData}
          isDisabled={!showTableRows}
          dataCy={"dns-forward-zones-refresh"}
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
          dataCy={"dns-forward-zones-delete"}
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
          dataCy={"dns-forward-zones-add"}
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
          dataCy={"dns-forward-zones-disable"}
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
          dataCy={"dns-forward-zones-enable"}
        >
          Enable
        </SecondaryButton>
      ),
    },
    {
      key: 8,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 9,
      element: <HelpTextWithIconLayout textContent="Help" />,
    },
    {
      key: 10,
      element: (
        <PaginationLayout
          list={dnsForwardZones}
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
        <TitleLayout
          id="DNS forward zones page"
          headingLevel="h1"
          text="DNS forward zones"
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
                  tableTitle="DNS forward zones table"
                  shownElementsList={dnsForwardZones}
                  pk="idnsname"
                  keyNames={[
                    "idnsname",
                    "idnszoneactive",
                    "idnsforwarders",
                    "idnsforwardpolicy",
                  ]}
                  columnNames={[
                    "Zone name",
                    "Status",
                    "Zone Forwarders",
                    "Forward policy",
                  ]}
                  hasCheckboxes={true}
                  pathname="dns-forward-zones"
                  showTableRows={showTableRows}
                  showLink={false}
                  elementsData={{
                    isElementSelectable: isDnsForwardZoneSelectable,
                    selectedElements,
                    selectableElementsTable: selectableDnsZonesTable,
                    setElementsSelected: setDnsZonesSelected,
                    clearSelectedElements: () => setSelectedElements([]),
                  }}
                  buttonsData={{
                    updateIsDeleteButtonDisabled: (value) =>
                      setIsDeleteButtonDisabled(value),
                    isDeletion,
                    updateIsDeletion: (value) => setIsDeletion(value),
                    updateIsEnableButtonDisabled: (value) =>
                      setIsEnableButtonDisabled(value),
                    updateIsDisableButtonDisabled: (value) =>
                      setIsDisableButtonDisabled(value),
                    isDisableEnableOp: true,
                  }}
                  paginationData={{
                    selectedPerPage,
                    updateSelectedPerPage: setSelectedPerPage,
                  }}
                  statusElementName="idnszoneactive"
                />
              )}
            </InnerScrollContainer>
          </OuterScrollContainer>
        </div>
        <PaginationLayout
          list={dnsForwardZones}
          paginationData={paginationData}
          variant={PaginationVariant.bottom}
          widgetId="pagination-options-menu-bottom"
          className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        />
      </PageSection>
    </div>
  );
};

export default DnsForwardZones;
