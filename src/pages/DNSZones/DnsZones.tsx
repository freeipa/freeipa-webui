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
import { DNSZone } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useApiError from "src/hooks/useApiError";
// Redux
import { useAppSelector } from "src/store/hooks";
// RPC
import {
  useGetDnsZonesFullDataQuery,
  useSearchDnsZonesEntriesMutation,
} from "src/services/rpcDnsZones";
// Utils
import { isDnsZoneSelectable } from "src/utils/utils";
import { apiToDnsZone } from "src/utils/dnsZonesUtils";
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
import AddDnsZoneModal from "src/components/modals/DnsZones/AddDnsZoneModal";
import DeleteDnsZonesModal from "src/components/modals/DnsZones/DeleteDnsZonesModal";
import EnableDisableDnsZonesModal from "src/components/modals/DnsZones/EnableDisableDnsZonesModal";

const DnsZones = () => {
  const navigate = useNavigate();

  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({
    pathname: "dns-zones",
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
  const [dnsZones, setDnsZones] = React.useState<DNSZone[]>([]);
  const [isSearchDisabled, setIsSearchDisabled] =
    React.useState<boolean>(false);
  const [totalCount, setTotalCount] = React.useState<number>(0);

  // API calls
  const dnsZonesResponse = useGetDnsZonesFullDataQuery({
    searchValue,
    apiVersion,
    sizelimit: 100,
    startIdx: firstUserIdx,
    stopIdx: lastUserIdx,
  });

  const { data, isLoading, error } = dnsZonesResponse;

  // Handle data when the API call is finished
  React.useEffect(() => {
    if (dnsZonesResponse.isFetching) {
      setShowTableRows(false);
      // Reset selected elements on refresh
      setTotalCount(0);
      globalErrors.clear();
      return;
    }

    // API response: Success
    if (
      dnsZonesResponse.isSuccess &&
      dnsZonesResponse.data &&
      data !== undefined
    ) {
      const listResult = data.result.results;
      const listSize = data.result.count;
      const elementsList: DNSZone[] = [];

      for (let i = 0; i < listSize; i++) {
        elementsList.push(apiToDnsZone(listResult[i].result));
      }

      setTotalCount(dnsZonesResponse.data.result.totalCount);
      // Update the list of elements
      setDnsZones(elementsList);
      // Show table elements
      setShowTableRows(true);
    }

    // API response: Error
    if (
      !dnsZonesResponse.isLoading &&
      dnsZonesResponse.isError &&
      dnsZonesResponse.error !== undefined
    ) {
      // This normally happens when the user is not authorized to view the data
      // So instead of adding an error, refresh page
      navigate("/login");
      window.location.reload();
    }
  }, [dnsZonesResponse]);

  // Selected elements
  const [selectedElements, setSelectedElements] = React.useState<DNSZone[]>([]);
  const [selectedPerPage, setSelectedPerPage] = React.useState<number>(0);

  // Refresh button handling
  const refreshData = () => {
    // Hide table
    setShowTableRows(false);

    // Reset selected elements on refresh
    setTotalCount(0);

    dnsZonesResponse.refetch().then(() => {
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
  const selectableDnsZonesTable = dnsZones.filter(isDnsZoneSelectable); // elements per Table

  // - Manage the selected elements in the table (add/remove)
  const updateSelectedDnsZones = (dnsZones: DNSZone[], isSelected: boolean) => {
    let newSelectedDnsZones: DNSZone[] = [];
    if (isSelected) {
      newSelectedDnsZones = JSON.parse(JSON.stringify(selectedElements));
      for (let i = 0; i < dnsZones.length; i++) {
        if (
          selectedElements.find(
            (selectedDnsZone) =>
              selectedDnsZone.idnsname === dnsZones[i].idnsname
          )
        ) {
          // Already in the list
          continue;
        }
        // Add element to list
        newSelectedDnsZones.push(dnsZones[i]);
      }
    } else {
      // Remove element
      for (let i = 0; i < selectedElements.length; i++) {
        let found = false;
        for (let ii = 0; ii < dnsZones.length; ii++) {
          if (selectedElements[i].idnsname === dnsZones[ii].idnsname) {
            found = true;
            break;
          }
        }
        if (!found) {
          // Keep this valid selected entry
          newSelectedDnsZones.push(selectedElements[i]);
        }
      }
    }
    setSelectedElements(newSelectedDnsZones);
    setIsDeleteButtonDisabled(newSelectedDnsZones.length === 0);
  };

  // - Helper method to set the selected entries from the table
  const setDnsZonesSelected = (dnsZone: DNSZone, isSelecting = true) => {
    if (isDnsZoneSelectable(dnsZone)) {
      updateSelectedDnsZones([dnsZone], isSelecting);
    }
  };

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  React.useEffect(() => {
    dnsZonesResponse.refetch();
  }, []);

  // Show table rows
  const [showTableRows, setShowTableRows] = React.useState<boolean>(!isLoading);

  // Show table rows only when data is fully retrieved
  React.useEffect(() => {
    if (showTableRows !== !isLoading) {
      setShowTableRows(!isLoading);
    }
  }, [isLoading]);

  // Search API call
  const [searchEntry] = useSearchDnsZonesEntriesMutation();

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
            error || "Error when searching for elements",
            "danger"
          );
        } else {
          // Success
          const dnsZones = result.data?.result || [];

          setTotalCount(totalCount);
          setDnsZones(dnsZones);
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
    updateSelectedPerPage: setSelectedPerPage,
    updateShownElementsList: setDnsZones,
    totalCount,
  };

  // SearchInputLayout
  const searchValueData = {
    searchValue,
    updateSearchValue: setSearchValue,
    submitSearchValue,
  };

  // - 'BulkSelectorrep'
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

  // Modals functionality
  const [showAddModal, setShowAddModal] = React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [showEnableDisableModal, setShowEnableDisableModal] =
    React.useState<boolean>(false);
  const [operation, setOperation] = React.useState<"enable" | "disable">(
    "disable"
  );

  // Open modal and set operation to 'disable' or "enable"
  const onEnableOperation = () => {
    setOperation("enable");
    setShowEnableDisableModal(true);
  };

  const onDisableOperation = () => {
    setOperation("disable");
    setShowEnableDisableModal(true);
  };

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={dnsZones}
          shownElementsList={dnsZones}
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
          ariaLabel="Search dns zones"
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
          dataCy="dns-zones-button-refresh"
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
          onClickHandler={() => setShowDeleteModal(true)}
          dataCy="dns-zones-button-delete"
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
          onClickHandler={() => setShowAddModal(true)}
          dataCy="dns-zones-button-add"
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
          onClickHandler={onDisableOperation}
          dataCy="dns-zones-button-disable"
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
          onClickHandler={onEnableOperation}
          dataCy="dns-zones-button-enable"
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
          list={dnsZones}
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
    <>
      <alerts.ManagedAlerts />
      <PageSection hasBodyWrapper={false}>
        <TitleLayout id="DNS zones page" headingLevel="h1" text="DNS zones" />
      </PageSection>
      <PageSection
        hasBodyWrapper={false}
        isFilled={false}
        className="pf-v6-u-m-lg pf-v6-u-pb-md pf-v6-u-pl-0 pf-v6-u-pr-0"
      >
        <ToolbarLayout
          className="pf-v6-u-pt-0 pf-v6-u-pl-lg pf-v6-u-pr-md"
          contentClassName="pf-v6-u-p-0"
          toolbarItems={toolbarItems}
        />
        <div style={{ height: `calc(100vh - 352.2px)` }}>
          <OuterScrollContainer>
            <InnerScrollContainer>
              {error !== undefined && error ? (
                <GlobalErrors errors={globalErrors.getAll()} />
              ) : (
                <MainTable
                  tableTitle="DNS zones table"
                  shownElementsList={dnsZones}
                  pk="idnsname"
                  keyNames={["idnsname", "idnszoneactive"]}
                  columnNames={["Zone name", "Status"]}
                  hasCheckboxes={true}
                  pathname="dns-zones"
                  showTableRows={showTableRows}
                  showLink={true}
                  elementsData={{
                    isElementSelectable: isDnsZoneSelectable,
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
          list={dnsZones}
          paginationData={paginationData}
          variant={PaginationVariant.bottom}
          widgetId="pagination-options-menu-bottom"
          className="pf-v6-u-pb-0 pf-v6-u-pr-md"
        />
      </PageSection>
      <AddDnsZoneModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add DNS zone"
        onRefresh={refreshData}
      />
      <DeleteDnsZonesModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        elementsToDelete={selectedElements}
        clearSelectedElements={() => setSelectedElements([])}
        columnNames={["DNS zone name"]}
        keyNames={["idnsname"]}
        onRefresh={refreshData}
        updateIsDeleteButtonDisabled={setIsDeleteButtonDisabled}
        updateIsDeletion={setIsDeletion}
      />
      <EnableDisableDnsZonesModal
        isOpen={showEnableDisableModal}
        onClose={() => setShowEnableDisableModal(false)}
        elementsList={selectedElements.map((dnszone) => dnszone.idnsname)}
        setElementsList={() => {}}
        operation={operation}
        setShowTableRows={setShowTableRows}
        onRefresh={refreshData}
      />
    </>
  );
};

export default DnsZones;
