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
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@patternfly/react-table";
// React Router
import { Link } from "react-router";
// Data types
import { AhdapaClient } from "src/utils/datatypes/ahdapaDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import {
  useListAhdapaClientsQuery,
  useDeleteAhdapaClientsMutation,
} from "src/services/rpcAhdapaClients";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { addAlert } from "src/store/Global/alerts-slice";
// Components
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import PaginationLayout from "src/components/layouts/PaginationLayout";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";

const AhdapaClients = () => {
  const dispatch = useAppDispatch();

  useUpdateRoute({ pathname: "ahdapa-clients" });

  const { page, perPage, searchValue } = useListPageSearchParams();

  const {
    data: allClients = [],
    isFetching,
    error,
    refetch,
  } = useListAhdapaClientsQuery();

  const [deleteClients] = useDeleteAhdapaClientsMutation();

  // Client-side search filtering
  const filtered = React.useMemo(() => {
    if (!searchValue) return allClients;
    const lower = searchValue.toLowerCase();
    return allClients.filter(
      (c) =>
        c.client_id.toLowerCase().includes(lower) ||
        c.client_name.toLowerCase().includes(lower)
    );
  }, [allClients, searchValue]);

  // Client-side pagination
  const totalCount = filtered.length;
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;
  const paged = filtered.slice(firstIdx, lastIdx);

  // Selection state
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const isSelected = (clientId: string) => selectedIds.has(clientId);

  const toggleSelect = (clientId: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(clientId);
      } else {
        next.delete(clientId);
      }
      return next;
    });
  };

  const selectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(new Set(filtered.map((c) => c.client_id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  // Refresh
  const refreshData = () => {
    clearSelection();
    refetch();
  };

  // Delete
  const isDeleteDisabled = selectedIds.size === 0 || isFetching;

  const onDelete = async () => {
    const ids = Array.from(selectedIds);
    try {
      await deleteClients(ids).unwrap();
      dispatch(
        addAlert({
          name: "delete-ahdapa-clients-success",
          title: `Deleted ${ids.length} client(s)`,
          variant: "success",
        })
      );
      clearSelection();
    } catch {
      dispatch(
        addAlert({
          name: "delete-ahdapa-clients-error",
          title: "Failed to delete client(s)",
          variant: "danger",
        })
      );
    }
  };

  // Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <SearchInputLayout
          dataCy="ahdapa-clients-search"
          name="search"
          ariaLabel="Search OAuth2 clients"
          placeholder="Search clients"
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
          dataCy="ahdapa-clients-button-refresh"
          onClickHandler={refreshData}
          isDisabled={isFetching}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 3,
      element: (
        <SecondaryButton
          dataCy="ahdapa-clients-button-delete"
          isDisabled={isDeleteDisabled}
          onClickHandler={onDelete}
        >
          Delete
        </SecondaryButton>
      ),
    },
    {
      key: 4,
      element: (
        <SecondaryButton
          dataCy="ahdapa-clients-button-add"
          isDisabled={isFetching}
          onClickHandler={() => {
            /* TODO: open add modal */
          }}
        >
          Add
        </SecondaryButton>
      ),
    },
    {
      key: 5,
      element: (
        <PaginationLayout
          list={paged}
          totalCount={totalCount}
          widgetId="ahdapa-clients-pagination-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  // Column definitions
  const columnNames = [
    "Client ID",
    "Client Name",
    "Auth Method",
    "Source",
  ] as const;

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="ahdapa-clients-page"
          headingLevel="h1"
          text="OAuth2 Clients"
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
                    Error loading OAuth2 clients. Please try refreshing.
                  </div>
                ) : (
                  <Table aria-label="OAuth2 Clients table" variant="compact">
                    <Thead>
                      <Tr>
                        <Th
                          select={{
                            onSelect: (_event, isSelecting) =>
                              selectAll(isSelecting),
                            isSelected:
                              filtered.length > 0 &&
                              selectedIds.size === filtered.length,
                          }}
                        />
                        {columnNames.map((col) => (
                          <Th key={col}>{col}</Th>
                        ))}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {paged.length === 0 ? (
                        <Tr>
                          <Td colSpan={columnNames.length + 1}>
                            <div
                              style={{ textAlign: "center", padding: "2rem" }}
                            >
                              No clients found
                            </div>
                          </Td>
                        </Tr>
                      ) : (
                        paged.map((client: AhdapaClient) => (
                          <Tr key={client.client_id}>
                            <Td
                              select={{
                                rowIndex: 0,
                                onSelect: (_event, isSelecting) =>
                                  toggleSelect(client.client_id, isSelecting),
                                isSelected: isSelected(client.client_id),
                              }}
                            />
                            <Td dataLabel={columnNames[0]}>
                              <Link
                                to={`/ahdapa-clients/${encodeURIComponent(client.client_id)}`}
                              >
                                {client.client_id}
                              </Link>
                            </Td>
                            <Td dataLabel={columnNames[1]}>
                              {client.client_name}
                            </Td>
                            <Td dataLabel={columnNames[2]}>
                              {client.token_endpoint_auth_method}
                            </Td>
                            <Td dataLabel={columnNames[3]}>{client.source}</Td>
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
              widgetId="ahdapa-clients-pagination-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>
    </>
  );
};

export default AhdapaClients;
