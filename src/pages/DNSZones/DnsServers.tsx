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
  Td,
  Th,
  Tr,
} from "@patternfly/react-table";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useApiError from "src/hooks/useApiError";
// Redux
import { useAppSelector } from "src/store/hooks";
// RPC
import {
  useDnsServersFindQuery,
  useSearchDnsServersEntriesMutation,
} from "src/services/rpcDnsServers";
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
import TableLayout from "src/components/layouts/TableLayout";
import SkeletonOnTableLayout from "src/components/layouts/Skeleton/SkeletonOnTableLayout";

const DnsServers = () => {
  const navigate = useNavigate();

  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({
    pathname: "dns-servers",
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
  const [dnsServersId, setDnsServersId] = React.useState<string[]>([]);
  const [isSearchDisabled, setIsSearchDisabled] =
    React.useState<boolean>(false);
  const [totalCount, setTotalCount] = React.useState<number>(0);

  // API calls
  const dnsServersResponse = useDnsServersFindQuery({
    searchValue,
    pkeyOnly: true,
    sizeLimit: 100,
    version: apiVersion,
  });

  const { data, isLoading, error } = dnsServersResponse;

  // Handle data when the API call is finished
  React.useEffect(() => {
    if (dnsServersResponse.isFetching) {
      setShowTableRows(false);
      setTotalCount(0);
      globalErrors.clear();
      return;
    }

    if (
      dnsServersResponse.isSuccess &&
      dnsServersResponse.data &&
      data !== undefined &&
      "data" in data
    ) {
      setTotalCount(data.data.length || 0);
      setDnsServersId(data.data.slice(firstUserIdx, lastUserIdx) || []);
      setShowTableRows(true);
    }

    if (
      !dnsServersResponse.isLoading &&
      dnsServersResponse.isError &&
      dnsServersResponse.error !== undefined &&
      "error" in dnsServersResponse.error
    ) {
      // This normally happens when the user is not authorized to view the data
      // So instead of adding an error, refresh page
      navigate("/login");
      window.location.reload();
    }
  }, [dnsServersResponse]);

  // Refresh button handling
  const refreshData = () => {
    setShowTableRows(false);
    setTotalCount(0);

    dnsServersResponse.refetch().then(() => {
      setShowTableRows(true);
    });
  };

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  React.useEffect(() => {
    dnsServersResponse.refetch();
  }, []);

  // Show table rows
  const [showTableRows, setShowTableRows] = React.useState<boolean>(!isLoading);

  // Show table rows only when data is fully retrieved
  React.useEffect(() => {
    if (dnsServersResponse.isSuccess && dnsServersResponse.data) {
      setShowTableRows(true);
    }
  }, [dnsServersResponse.isSuccess, dnsServersResponse.data]);

  // Search API call
  const [searchEntry] = useSearchDnsServersEntriesMutation();

  const submitSearchValue = () => {
    searchEntry({
      searchValue: searchValue,
      pkeyOnly: true,
      sizeLimit: 100,
      version: apiVersion,
    }).then((result) => {
      if ("data" in result && result.data !== undefined) {
        const searchError = result.data?.error as
          | FetchBaseQueryError
          | SerializedError;

        if (searchError) {
          // Error
          let error: string | undefined = "";
          if ("error" in searchError) {
            error = searchError.error;
          }
          alerts.addAlert(
            "submit-search-value-error",
            error || "Error when searching for elements",
            "danger"
          );
        } else {
          // Success
          const dnsServers = result.data || [];

          setTotalCount(totalCount);
          setDnsServersId(
            dnsServers.data.slice(firstUserIdx, lastUserIdx) || []
          );
          setShowTableRows(true);
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
    updateSelectedPerPage: () => {},
    updateShownElementsList: setDnsServersId,
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
        <SearchInputLayout
          dataCy="search"
          name="search"
          ariaLabel="Search dns servers"
          placeholder="Search"
          searchValueData={searchValueData}
          isDisabled={isSearchDisabled}
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
        <SecondaryButton
          dataCy="dns-servers-button-refresh"
          onClickHandler={refreshData}
          isDisabled={!showTableRows}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 3,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 4,
      element: <HelpTextWithIconLayout textContent="Help" />,
    },
    {
      key: 5,
      element: (
        <PaginationLayout
          list={dnsServersId}
          paginationData={paginationData}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  // Table header
  const header = (
    <Tr key="header" id="table-header">
      <Th modifier="wrap" key="idnsserverid">
        Server name
      </Th>
    </Tr>
  );

  const body = (
    <>
      {dnsServersId.map((dnsServerId) => (
        <Tr
          key={`body-row-${dnsServerId}`}
          id={`table-body-row-${dnsServerId}`}
        >
          <Td key={`idnsserverid-${dnsServerId}`}>{dnsServerId}</Td>
        </Tr>
      ))}
    </>
  );

  const skeleton = (
    <SkeletonOnTableLayout
      rows={4}
      colSpan={9}
      screenreaderText={"Loading table rows"}
    />
  );

  // Render component
  return (
    <div>
      <alerts.ManagedAlerts />
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="DNS servers page"
          headingLevel="h1"
          text="DNS servers"
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
                {error !== undefined && error ? (
                  <GlobalErrors errors={globalErrors.getAll()} />
                ) : (
                  <TableLayout
                    ariaLabel={"DNS servers table"}
                    variant={"compact"}
                    hasBorders={true}
                    classes={"pf-v6-u-mt-md"}
                    tableId={"dns-servers-table"}
                    isStickyHeader={true}
                    tableHeader={header}
                    tableBody={!showTableRows ? skeleton : body}
                  />
                )}
              </InnerScrollContainer>
            </OuterScrollContainer>
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}>
            <PaginationLayout
              list={dnsServersId}
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

export default DnsServers;
