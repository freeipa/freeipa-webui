import React from "react";
// PatternFly
import {
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Label,
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
  AhdapaNode,
  formatUnixTimestamp,
} from "src/utils/datatypes/ahdapaDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import {
  useListAhdapaNodesQuery,
  useGetAhdapaNodeStatsQuery,
} from "src/services/rpcAhdapaInfra";
// Components
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import PaginationLayout from "src/components/layouts/PaginationLayout";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";

const AhdapaNodes = () => {
  useUpdateRoute({ pathname: "ahdapa-nodes" });

  const { page, perPage } = useListPageSearchParams();

  const {
    data: allNodes = [],
    isFetching: isNodesFetching,
    error: nodesError,
    refetch: refetchNodes,
  } = useListAhdapaNodesQuery();

  const {
    data: stats,
    isFetching: isStatsFetching,
    refetch: refetchStats,
  } = useGetAhdapaNodeStatsQuery();

  const isFetching = isNodesFetching || isStatsFetching;

  // Client-side pagination
  const totalCount = allNodes.length;
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;
  const paged = allNodes.slice(firstIdx, lastIdx);

  // Refresh
  const refreshData = () => {
    refetchNodes();
    refetchStats();
  };

  // Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <SecondaryButton
          dataCy="ahdapa-nodes-button-refresh"
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
          widgetId="ahdapa-nodes-pagination-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  // Column definitions
  const columnNames = [
    "Node ID",
    "KEM Enrolled",
    "Gossip Signing",
    "Added At",
  ] as const;

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="ahdapa-nodes-page"
          headingLevel="h1"
          text="Cluster Nodes"
        />
      </PageSection>

      {/* Gossip stats summary card */}
      {stats && (
        <PageSection hasBodyWrapper={false} isFilled={false}>
          <Card isCompact>
            <CardTitle>Gossip Statistics</CardTitle>
            <CardBody>
              <DescriptionList isHorizontal isCompact>
                <DescriptionListGroup>
                  <DescriptionListTerm>Node</DescriptionListTerm>
                  <DescriptionListDescription>
                    {stats.node_id}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Rounds completed</DescriptionListTerm>
                  <DescriptionListDescription>
                    {stats.gossip.rounds_completed}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Peers</DescriptionListTerm>
                  <DescriptionListDescription>
                    {stats.peers.length > 0 ? stats.peers.join(", ") : "None"}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>CRDT generation</DescriptionListTerm>
                  <DescriptionListDescription>
                    {stats.crdt_generation}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Active signing key</DescriptionListTerm>
                  <DescriptionListDescription>
                    {stats.active_signing_kid ? (
                      <code>{stats.active_signing_kid}</code>
                    ) : (
                      "—"
                    )}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Persist errors</DescriptionListTerm>
                  <DescriptionListDescription>
                    {stats.gossip.persist_errors}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Started at</DescriptionListTerm>
                  <DescriptionListDescription>
                    {formatUnixTimestamp(stats.gossip.started_at)}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                {stats.gossip.last_round_at && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Last round at</DescriptionListTerm>
                    <DescriptionListDescription>
                      {formatUnixTimestamp(stats.gossip.last_round_at)}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                )}
              </DescriptionList>
            </CardBody>
          </Card>
        </PageSection>
      )}

      <PageSection hasBodyWrapper={false} isFilled={false}>
        <Flex direction={{ default: "column" }}>
          <FlexItem>
            <ToolbarLayout toolbarItems={toolbarItems} />
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto" }}>
            <OuterScrollContainer>
              <InnerScrollContainer
                style={{ height: "50vh", overflow: "auto" }}
              >
                {isNodesFetching ? (
                  <DataSpinner />
                ) : nodesError ? (
                  <div style={{ padding: "1rem" }}>
                    Error loading cluster nodes. Please try refreshing.
                  </div>
                ) : (
                  <Table aria-label="Cluster Nodes table" variant="compact">
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
                              No cluster nodes found
                            </div>
                          </Td>
                        </Tr>
                      ) : (
                        paged.map((node: AhdapaNode) => (
                          <Tr key={node.node_id}>
                            <Td dataLabel={columnNames[0]}>
                              <code>{node.node_id}</code>
                            </Td>
                            <Td dataLabel={columnNames[1]}>
                              {node.kem_enrolled ? (
                                <Label color="green">Yes</Label>
                              ) : (
                                <Label color="grey">No</Label>
                              )}
                            </Td>
                            <Td dataLabel={columnNames[2]}>
                              {node.gossip_signing_enrolled ? (
                                <Label color="green">Yes</Label>
                              ) : (
                                <Label color="grey">No</Label>
                              )}
                            </Td>
                            <Td dataLabel={columnNames[3]}>
                              {formatUnixTimestamp(node.added_at)}
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
              widgetId="ahdapa-nodes-pagination-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>
    </>
  );
};

export default AhdapaNodes;
