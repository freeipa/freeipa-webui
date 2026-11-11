import React from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  PageSection,
  PaginationVariant,
} from "@patternfly/react-core";
import {
  InnerScrollContainer,
  OuterScrollContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@patternfly/react-table";
// Data types
import {
  AhdapaAuditEvent,
  formatIsoTimestamp,
} from "src/utils/datatypes/ahdapaDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import { useListAhdapaAuditEventsQuery } from "src/services/rpcAhdapaInfra";
// Components
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import PaginationLayout from "src/components/layouts/PaginationLayout";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";

const AhdapaAudit = () => {
  useUpdateRoute({ pathname: "ahdapa-audit" });

  const { page, perPage } = useListPageSearchParams();

  const {
    data: allEvents = [],
    isFetching,
    error,
    refetch,
  } = useListAhdapaAuditEventsQuery();

  // Client-side pagination
  const totalCount = allEvents.length;
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;
  const paged = allEvents.slice(firstIdx, lastIdx);

  // Refresh
  const refreshData = () => {
    refetch();
  };

  // Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <SecondaryButton
          dataCy="ahdapa-audit-button-refresh"
          onClickHandler={refreshData}
          isDisabled={isFetching}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 1,
      element: (
        <PaginationLayout
          list={paged}
          totalCount={totalCount}
          widgetId="ahdapa-audit-pagination-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  // Column definitions
  const columnNames = [
    "Time",
    "Event Type",
    "Subject",
    "Principal",
    "Outcome",
    "Detail",
  ] as const;

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="ahdapa-audit-page"
          headingLevel="h1"
          text="Audit Log"
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
                {isFetching ? (
                  <DataSpinner />
                ) : error ? (
                  <div style={{ padding: "1rem" }}>
                    Error loading audit events. Please try refreshing.
                  </div>
                ) : (
                  <Table aria-label="Audit Log table" variant="compact">
                    <Thead>
                      <Tr>
                        {columnNames.map((col) => (
                          <Th key={col}>{col}</Th>
                        ))}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {paged.length === 0 ? (
                        <Tr>
                          <Td colSpan={columnNames.length}>
                            <div
                              style={{
                                textAlign: "center",
                                padding: "2rem",
                              }}
                            >
                              No audit events found
                            </div>
                          </Td>
                        </Tr>
                      ) : (
                        paged.map((event: AhdapaAuditEvent, idx: number) => (
                          <Tr key={`${event.occurred_at}-${idx}`}>
                            <Td dataLabel={columnNames[0]}>
                              {formatIsoTimestamp(event.occurred_at)}
                            </Td>
                            <Td dataLabel={columnNames[1]}>
                              {event.event_type}
                            </Td>
                            <Td dataLabel={columnNames[2]}>
                              {event.subject || "—"}
                            </Td>
                            <Td dataLabel={columnNames[3]}>
                              {event.principal || "—"}
                            </Td>
                            <Td dataLabel={columnNames[4]}>
                              {event.outcome || "—"}
                            </Td>
                            <Td dataLabel={columnNames[5]}>
                              {event.detail || "—"}
                            </Td>
                          </Tr>
                        ))
                      )}
                    </Tbody>
                  </Table>
                )}
              </InnerScrollContainer>
            </OuterScrollContainer>
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}>
            <PaginationLayout
              list={paged}
              totalCount={totalCount}
              variant={PaginationVariant.bottom}
              widgetId="ahdapa-audit-pagination-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>
    </>
  );
};

export default AhdapaAudit;
