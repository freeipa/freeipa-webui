import React from "react";
// PatternFly
import {
  Page,
  PageSection,
  PageSectionVariants,
  PaginationVariant,
  TextContent,
  Text,
  Spinner,
} from "@patternfly/react-core";
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Data types
import { DNSRecord } from "src/utils/datatypes/globalDataTypes";
// RPC
import {
  FindDnsRecordPayload,
  useDnsRecordFindQuery,
  useSearchDnsRecordsEntriesMutation,
} from "src/services/rpcDnsZones";
// React router
import { useNavigate } from "react-router";
// Utils
import { isDnsRecordSelectable } from "src/utils/utils";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useAlerts from "src/hooks/useAlerts";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useApiError from "src/hooks/useApiError";
// Components
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import GlobalErrors from "src/components/errors/GlobalErrors";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import PaginationLayout from "src/components/layouts/PaginationLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
import MainTable from "src/components/tables/MainTable";
import AddDnsRecordsModal from "src/components/modals/DnsZones/AddDnsRecordsModal";
import DeleteDnsRecordsModal from "src/components/modals/DnsZones/DeleteDnsRecords";

interface DnsResourceRecordsProps {
  dnsZoneId: string;
}

const DnsResourceRecords = (props: DnsResourceRecordsProps) => {
  const navigate = useNavigate();

  // Alerts to show in the UI
  const alerts = useAlerts();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "dns-records" });

  // URL parameters: page number, page size, search value
  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  // Handle API calls errors
  const globalErrors = useApiError([]);

  // States
  const [dnsRecords, setDnsRecords] = React.useState<DNSRecord[]>([]);
  const [isSearchDisabled, setIsSearchDisabled] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);

  // API calls
  const dnsRecordsResponse = useDnsRecordFindQuery({
    dnsZoneId: props.dnsZoneId,
    recordName: searchValue,
    sizeLimit: perPage,
  });

  const { data, isLoading, error } = dnsRecordsResponse;

  // Handle data when the API call is finished
  React.useEffect(() => {
    if (dnsRecordsResponse.isFetching) {
      setShowTableRows(false);
      // Reset selected elements on refresh
      setTotalCount(0);
      globalErrors.clear();
      return;
    }

    // API response: Success
    if (
      dnsRecordsResponse.isSuccess &&
      dnsRecordsResponse.data &&
      data !== undefined
    ) {
      setTotalCount(data.result.length);
      // Update the list of elements
      setDnsRecords(data.result);
      // Show table elements
      setShowTableRows(true);
    }

    // API response: Error
    if (
      !dnsRecordsResponse.isLoading &&
      dnsRecordsResponse.isError &&
      dnsRecordsResponse.error !== undefined
    ) {
      // This normally happens when the user is not authorized to view the data
      // So instead of adding an error, refresh page
      navigate("/login");
      window.location.reload();
    }
  }, [dnsRecordsResponse]);

  // Selected elements
  const [selectedElements, setSelectedElements] = React.useState<DNSRecord[]>(
    []
  );
  const [selectedPerPage, setSelectedPerPage] = React.useState<number>(0);

  // Refresh button handling
  const refreshData = () => {
    // Hide table
    setShowTableRows(false);

    // Reset selected elements on refresh
    setTotalCount(0);

    dnsRecordsResponse.refetch().then(() => {
      setShowTableRows(true);
    });
  };

  // 'Delete' button state
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    React.useState<boolean>(true);

  const [isDeletion, setIsDeletion] = React.useState<boolean>(false);

  // Table-related shared functionality
  // - Selectable checkboxes on table
  const selectableDnsRecordsTable = dnsRecords.filter(isDnsRecordSelectable); // elements per Table

  // - Manage the selected elements in the table (add/remove)
  const updateSelectedDnsRecords = (
    dnsRecords: DNSRecord[],
    isSelected: boolean
  ) => {
    let newSelectedDnsRecords: DNSRecord[] = [];
    if (isSelected) {
      newSelectedDnsRecords = JSON.parse(JSON.stringify(selectedElements));
      for (let i = 0; i < dnsRecords.length; i++) {
        if (
          selectedElements.find(
            (selectedDnsRecord) =>
              selectedDnsRecord.idnsname === dnsRecords[i].idnsname
          )
        ) {
          // Already in the list
          continue;
        }
        // Add element to list
        newSelectedDnsRecords.push(dnsRecords[i]);
      }
    } else {
      // Remove element
      for (let i = 0; i < selectedElements.length; i++) {
        let found = false;
        for (let ii = 0; ii < dnsRecords.length; ii++) {
          if (selectedElements[i].idnsname === dnsRecords[ii].idnsname) {
            found = true;
            break;
          }
        }
        if (!found) {
          // Keep this valid selected entry
          newSelectedDnsRecords.push(selectedElements[i]);
        }
      }
    }
    setSelectedElements(newSelectedDnsRecords);
    setIsDeleteButtonDisabled(newSelectedDnsRecords.length === 0);
  };

  // - Helper method to set the selected entries from the table
  const setDnsRecordsSelected = (dnsRecord: DNSRecord, isSelecting = true) => {
    if (isDnsRecordSelectable(dnsRecord)) {
      updateSelectedDnsRecords([dnsRecord], isSelecting);
    }
  };

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  React.useEffect(() => {
    dnsRecordsResponse.refetch();
  }, []);

  // Show table rows
  const [showTableRows, setShowTableRows] = React.useState<boolean>(!isLoading);

  // Show table rows only when data is fully retrieved
  React.useEffect(() => {
    if (showTableRows !== !isLoading) {
      setShowTableRows(!isLoading);
    }
  }, [isLoading]);

  // Search DNS records
  const [searchDnsRecords] = useSearchDnsRecordsEntriesMutation();

  const submitSearchValue = () => {
    const payload: FindDnsRecordPayload = {
      dnsZoneId: props.dnsZoneId,
      recordName: "",
    };
    searchDnsRecords(payload).then((result) => {
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
          const dnsRecords = result.data?.result || [];

          setTotalCount(totalCount);
          setDnsRecords(dnsRecords);
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
    updateShownElementsList: setDnsRecords,
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
    updateSelected: updateSelectedDnsRecords,
    selectableTable: selectableDnsRecordsTable,
    nameAttr: "idnsname",
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
          list={dnsRecords}
          shownElementsList={dnsRecords}
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
          ariaLabel="Search DNS records"
          placeholder="Search"
          searchValueData={searchValueData}
          isDisabled={isSearchDisabled}
          dataCy="search-dns-records"
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
          onClickHandler={refreshData}
          isDisabled={!showTableRows}
          dataCy="refresh-dns-records"
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
          dataCy="delete-dns-records"
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
          dataCy="add-dns-records"
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
          list={dnsRecords}
          paginationData={paginationData}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignRight" },
    },
  ];

  const spinner = (
    <TextContent className="pf-v5-u-m-xl">
      <Text component="h3">
        <i>Loading data</i>
        <Spinner isInline size="xl" className="pf-v5-u-ml-md" />
      </Text>
    </TextContent>
  );

  // Render component
  return (
    <Page>
      <alerts.ManagedAlerts />
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
              {error !== undefined && error ? (
                <GlobalErrors errors={globalErrors.getAll()} />
              ) : (
                <>
                  {isLoading || !showTableRows ? (
                    spinner
                  ) : (
                    <MainTable
                      tableTitle="DNS records table"
                      shownElementsList={dnsRecords}
                      pk="idnsname"
                      keyNames={[
                        "idnsname",
                        "dnsrecord_types",
                        "dnsrecord_data",
                      ]}
                      columnNames={["Record name", "Record type", "Data"]}
                      hasCheckboxes={true}
                      pathname="dns-records"
                      showTableRows={showTableRows}
                      showLink={false}
                      elementsData={{
                        isElementSelectable: isDnsRecordSelectable,
                        selectedElements,
                        selectableElementsTable: selectableDnsRecordsTable,
                        setElementsSelected: setDnsRecordsSelected,
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
                </>
              )}
            </InnerScrollContainer>
          </OuterScrollContainer>
        </div>
        <PaginationLayout
          list={dnsRecords}
          paginationData={paginationData}
          variant={PaginationVariant.bottom}
          widgetId="pagination-options-menu-bottom"
          className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        />
      </PageSection>
      <AddDnsRecordsModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onRefresh={refreshData}
        dnsZoneId={props.dnsZoneId}
      />
      <DeleteDnsRecordsModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onRefresh={refreshData}
        dnsZoneId={props.dnsZoneId}
        elementsToDelete={selectedElements}
        clearSelectedElements={() => setSelectedElements([])}
        columnNames={["Record name", "Record type"]}
        keyNames={["idnsname", "dnsrecord_types"]}
        updateIsDeleteButtonDisabled={setIsDeleteButtonDisabled}
        updateIsDeletion={setIsDeletion}
      />
    </Page>
  );
};

export default DnsResourceRecords;
