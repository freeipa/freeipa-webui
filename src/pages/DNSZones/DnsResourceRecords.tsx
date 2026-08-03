import React from "react";
// PatternFly
import {
  PageSection,
  PaginationVariant,
  Content,
  Spinner,
  ToolbarItemVariant,
  Flex,
  FlexItem,
} from "@patternfly/react-core";
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Data types
import { DNSRecord } from "src/utils/datatypes/globalDataTypes";
// RPC
import { useDnsRecordFindQuery } from "src/services/rpcDnsZones";
// Utils
import { isDnsRecordSelectable } from "src/utils/utils";
import {
  getSelectedPerPageData,
  ipaPrimaryKey,
} from "src/utils/selectedPerPage";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import { addAlert } from "src/store/Global/alerts-slice";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useApiError from "src/hooks/useApiError";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import { toggleHelpPanel } from "src/store/Global/contextual-help-slice";
// Components
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import GlobalErrors from "src/components/errors/GlobalErrors";
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
  const dispatch = useAppDispatch();
  useContextualHelpTopic("dns-resource-records");

  // Contextual help panel

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "dns-records" });

  // URL parameters: page number, page size, search value
  const { page, perPage, searchValue } = useListPageSearchParams();

  // Handle API calls errors
  const globalErrors = useApiError([]);

  // States
  const [dnsRecords, setDnsRecords] = React.useState<DNSRecord[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);

  // Calculate pagination parameters for server-side pagination
  const startIdx = (page - 1) * perPage;
  const stopIdx = startIdx + perPage;

  // API calls
  const dnsRecordsResponse = useDnsRecordFindQuery({
    dnsZoneId: props.dnsZoneId,
    recordName: searchValue,
    sizeLimit: perPage,
    startIdx: startIdx,
    stopIdx: stopIdx,
  });

  const { data, isFetching, error } = dnsRecordsResponse;

  // Handle data when the API call is finished
  React.useEffect(() => {
    if (dnsRecordsResponse.isFetching) {
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
      setDnsRecords(data.result);
      setTotalCount(data.count);
    }
  }, [dnsRecordsResponse]);

  // Selected elements
  const [selectedElements, setSelectedElements] = React.useState<DNSRecord[]>(
    []
  );

  // Refresh button handling
  const refreshData = () => {
    // Reset selected elements on refresh
    setTotalCount(0);
    setSelectedElements([]);

    dnsRecordsResponse.refetch().catch(() => {
      dispatch(
        addAlert({
          name: "refresh-dns-records-error",
          title: "Error refreshing DNS records",
          variant: "danger",
        })
      );
    });
  };

  // 'Delete' button state
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    React.useState<boolean>(true);

  const [isDeletion, setIsDeletion] = React.useState<boolean>(false);

  // Table-related shared functionality
  // - Selectable checkboxes on table
  const selectableDnsRecordsTable = dnsRecords.filter(isDnsRecordSelectable); // Current page selectable elements

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

  // Show table rows
  // Show table rows only when data is fully retrieved
  const selectedPerPageData = getSelectedPerPageData(
    dnsRecords,
    selectedElements.map((dnsRecord) => ipaPrimaryKey(dnsRecord.idnsname)),
    (dnsRecord) => ipaPrimaryKey(dnsRecord.idnsname)
  );

  // Data wrappers
  // - 'BulkSelectorPrep'
  const bulkSelectorData = {
    selected: selectedElements,
    updateSelected: updateSelectedDnsRecords,
    selectableTable: selectableDnsRecordsTable,
    nameAttr: "idnsname",
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
          placeholder="Search DNS records"
          dataCy="search"
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
          isDisabled={isFetching}
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
          isDisabled={isDeleteButtonDisabled || isFetching}
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
          isDisabled={isFetching}
          onClickHandler={() => setShowAddModal(true)}
          dataCy="add-dns-records"
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
      element: (
        <HelpTextWithIconLayout
          textContent="Help"
          onClick={() => dispatch(toggleHelpPanel())}
        />
      ),
    },
    {
      key: 8,
      element: (
        <PaginationLayout
          list={dnsRecords}
          totalCount={totalCount}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  const spinner = (
    <Content className="pf-v6-u-m-xl">
      <Content component="h3">
        <i>Loading data</i>
        <Spinner isInline size="xl" className="pf-v6-u-ml-md" />
      </Content>
    </Content>
  );

  // Render component
  return (
    <>
      <div
        style={{
          height: `var(--subsettings-calc)`,
        }}
        data-cy={"dns-zones-dns-records"}
      >
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
                  {error !== undefined && error ? (
                    <GlobalErrors errors={globalErrors.getAll()} />
                  ) : (
                    <>
                      {isFetching ? (
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
                          showTableRows={!isFetching}
                          showLink={false}
                          elementsData={{
                            isElementSelectable: isDnsRecordSelectable,
                            selectedElements,
                            selectableElementsTable: selectableDnsRecordsTable,
                            setElementsSelected: setDnsRecordsSelected,
                            clearSelectedElements: () =>
                              setSelectedElements([]),
                          }}
                          buttonsData={{
                            updateIsDeleteButtonDisabled: (value) =>
                              setIsDeleteButtonDisabled(value),
                            isDeletion,
                            updateIsDeletion: (value) => setIsDeletion(value),
                            isDisableEnableOp: true,
                          }}
                          paginationData={selectedPerPageData}
                        />
                      )}
                    </>
                  )}
                </InnerScrollContainer>
              </OuterScrollContainer>
            </FlexItem>
            <FlexItem
              style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}
            >
              <PaginationLayout
                list={dnsRecords}
                totalCount={totalCount}
                variant={PaginationVariant.bottom}
                widgetId="pagination-options-menu-bottom"
                className="pf-v6-u-pb-0 pf-v6-u-pr-md"
              />
            </FlexItem>
          </Flex>
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
      </div>
    </>
  );
};

export default DnsResourceRecords;
