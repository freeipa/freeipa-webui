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
// Data types
import { AhdapaScopeDefinition } from "src/utils/datatypes/ahdapaDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import {
  useListAhdapaScopesQuery,
  useDeleteAhdapaScopeMutation,
} from "src/services/rpcAhdapaScopes";
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

const AhdapaScopes = () => {
  const dispatch = useAppDispatch();

  useUpdateRoute({ pathname: "ahdapa-scopes" });

  const { page, perPage, searchValue } = useListPageSearchParams();

  const {
    data: allScopes = [],
    isFetching,
    error,
    refetch,
  } = useListAhdapaScopesQuery();

  const [deleteScope] = useDeleteAhdapaScopeMutation();

  // Client-side search filtering
  const filtered = React.useMemo(() => {
    if (!searchValue) return allScopes;
    const lower = searchValue.toLowerCase();
    return allScopes.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        s.description.toLowerCase().includes(lower)
    );
  }, [allScopes, searchValue]);

  // Client-side pagination
  const totalCount = filtered.length;
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;
  const paged = filtered.slice(firstIdx, lastIdx);

  // Selection state (only non-system scopes can be selected for deletion)
  const [selectedNames, setSelectedNames] = React.useState<Set<string>>(
    new Set()
  );

  const isSelected = (name: string) => selectedNames.has(name);

  const toggleSelect = (scope: AhdapaScopeDefinition, selected: boolean) => {
    if (scope.is_system) return;
    setSelectedNames((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(scope.name);
      } else {
        next.delete(scope.name);
      }
      return next;
    });
  };

  const selectAll = (selected: boolean) => {
    if (selected) {
      setSelectedNames(
        new Set(filtered.filter((s) => !s.is_system).map((s) => s.name))
      );
    } else {
      setSelectedNames(new Set());
    }
  };

  const clearSelection = () => setSelectedNames(new Set());

  // Refresh
  const refreshData = () => {
    clearSelection();
    refetch();
  };

  // Delete
  const isDeleteDisabled = selectedNames.size === 0 || isFetching;

  const onDelete = async () => {
    const names = Array.from(selectedNames);
    let successCount = 0;
    for (const name of names) {
      try {
        await deleteScope(name).unwrap();
        successCount++;
      } catch {
        dispatch(
          addAlert({
            name: `delete-scope-error-${name}`,
            title: `Failed to delete scope '${name}'`,
            variant: "danger",
          })
        );
      }
    }
    if (successCount > 0) {
      dispatch(
        addAlert({
          name: "delete-scopes-success",
          title: `Deleted ${successCount} scope(s)`,
          variant: "success",
        })
      );
    }
    clearSelection();
  };

  // Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <SearchInputLayout
          dataCy="ahdapa-scopes-search"
          name="search"
          ariaLabel="Search OAuth2 scopes"
          placeholder="Search scopes"
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
          dataCy="ahdapa-scopes-button-refresh"
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
          dataCy="ahdapa-scopes-button-delete"
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
        <PaginationLayout
          list={paged}
          totalCount={totalCount}
          widgetId="ahdapa-scopes-pagination-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  // Column definitions
  const columnNames = ["Name", "Description", "Claims", "System"] as const;

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="ahdapa-scopes-page"
          headingLevel="h1"
          text="OAuth2 Scopes"
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
                    Error loading OAuth2 scopes. Please try refreshing.
                  </div>
                ) : (
                  <Table aria-label="OAuth2 Scopes table" variant="compact">
                    <Thead>
                      <Tr>
                        <Th
                          select={{
                            onSelect: (_event, isSelecting) =>
                              selectAll(isSelecting),
                            isSelected:
                              filtered.filter((s) => !s.is_system).length > 0 &&
                              selectedNames.size ===
                                filtered.filter((s) => !s.is_system).length,
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
                              style={{
                                textAlign: "center",
                                padding: "2rem",
                              }}
                            >
                              No scopes found
                            </div>
                          </Td>
                        </Tr>
                      ) : (
                        paged.map((scope: AhdapaScopeDefinition) => (
                          <Tr key={scope.name}>
                            <Td
                              select={{
                                rowIndex: 0,
                                onSelect: (_event, isSelecting) =>
                                  toggleSelect(scope, isSelecting),
                                isSelected: isSelected(scope.name),
                                isDisabled: scope.is_system,
                              }}
                            />
                            <Td dataLabel={columnNames[0]}>{scope.name}</Td>
                            <Td dataLabel={columnNames[1]}>
                              {scope.description}
                            </Td>
                            <Td dataLabel={columnNames[2]}>
                              {scope.claims.join(", ")}
                            </Td>
                            <Td dataLabel={columnNames[3]}>
                              {scope.is_system ? "Yes" : "No"}
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
              widgetId="ahdapa-scopes-pagination-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>
    </>
  );
};

export default AhdapaScopes;
