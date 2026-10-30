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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  Button,
  Form,
  FormGroup,
  TextArea,
  TextInput,
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
import { AhdapaSpiffeEntry } from "src/utils/datatypes/ahdapaDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import {
  useListAhdapaSpiffeEntriesQuery,
  useCreateAhdapaSpiffeEntryMutation,
  useDeleteAhdapaSpiffeEntryMutation,
  useGetAhdapaSpiffeStatusQuery,
} from "src/services/rpcAhdapaSpiffe";
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

const AhdapaSpiffe = () => {
  const dispatch = useAppDispatch();

  useUpdateRoute({ pathname: "ahdapa-spiffe" });

  const { page, perPage, searchValue } = useListPageSearchParams();

  const {
    data: allEntries = [],
    isFetching,
    error,
    refetch,
  } = useListAhdapaSpiffeEntriesQuery();

  const { data: spiffeStatus } = useGetAhdapaSpiffeStatusQuery();

  const [deleteEntry] = useDeleteAhdapaSpiffeEntryMutation();
  const [createEntry] = useCreateAhdapaSpiffeEntryMutation();

  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [addFormSpiffeId, setAddFormSpiffeId] = React.useState("");
  const [addFormSelectors, setAddFormSelectors] = React.useState("");
  const [addFormNodeConstraint, setAddFormNodeConstraint] = React.useState("");
  const [addFormTtl, setAddFormTtl] = React.useState("");
  const [isAdding, setIsAdding] = React.useState(false);

  const resetAddForm = () => {
    setAddFormSpiffeId("");
    setAddFormSelectors("");
    setAddFormNodeConstraint("");
    setAddFormTtl("");
  };

  const onAddSubmit = async () => {
    setIsAdding(true);
    const selectors = addFormSelectors
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      await createEntry({
        spiffe_id: addFormSpiffeId,
        selectors,
        node_constraint: addFormNodeConstraint || null,
        ttl_seconds: addFormTtl ? parseInt(addFormTtl, 10) : undefined,
      }).unwrap();
      dispatch(
        addAlert({
          name: "create-spiffe-entry-success",
          title: "SPIFFE entry created",
          variant: "success",
        })
      );
      setIsAddModalOpen(false);
      resetAddForm();
    } catch {
      dispatch(
        addAlert({
          name: "create-spiffe-entry-error",
          title: "Failed to create SPIFFE entry",
          variant: "danger",
        })
      );
    }
    setIsAdding(false);
  };

  // Client-side search filtering
  const filtered = React.useMemo(() => {
    if (!searchValue) return allEntries;
    const lower = searchValue.toLowerCase();
    return allEntries.filter(
      (e) =>
        e.id.toLowerCase().includes(lower) ||
        e.spiffe_id.toLowerCase().includes(lower) ||
        e.selectors.some((s) => s.toLowerCase().includes(lower))
    );
  }, [allEntries, searchValue]);

  // Client-side pagination
  const totalCount = filtered.length;
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;
  const paged = filtered.slice(firstIdx, lastIdx);

  // Selection state
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const isSelected = (id: string) => selectedIds.has(id);

  const toggleSelect = (id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const selectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(new Set(filtered.map((e) => e.id)));
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
      for (const id of ids) {
        await deleteEntry(id).unwrap();
      }
      dispatch(
        addAlert({
          name: "delete-spiffe-entries-success",
          title: `Deleted ${ids.length} SPIFFE entry(ies)`,
          variant: "success",
        })
      );
      clearSelection();
    } catch {
      dispatch(
        addAlert({
          name: "delete-spiffe-entries-error",
          title: "Failed to delete SPIFFE entry(ies)",
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
          dataCy="ahdapa-spiffe-search"
          name="search"
          ariaLabel="Search SPIFFE entries"
          placeholder="Search entries"
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
          dataCy="ahdapa-spiffe-button-refresh"
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
          dataCy="ahdapa-spiffe-button-delete"
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
          dataCy="ahdapa-spiffe-button-add"
          isDisabled={isFetching}
          onClickHandler={() => setIsAddModalOpen(true)}
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
          widgetId="ahdapa-spiffe-pagination-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  // Column definitions
  const columnNames = [
    "ID",
    "SPIFFE ID",
    "Selectors",
    "Node Constraint",
    "TTL (seconds)",
  ] as const;

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="ahdapa-spiffe-page"
          headingLevel="h1"
          text="SPIFFE Workload Entries"
        />
      </PageSection>

      {spiffeStatus && (
        <PageSection hasBodyWrapper={false}>
          <Card isCompact>
            <CardTitle>SPIFFE Status</CardTitle>
            <CardBody>
              <DescriptionList isHorizontal isCompact>
                <DescriptionListGroup>
                  <DescriptionListTerm>Trust Domain</DescriptionListTerm>
                  <DescriptionListDescription>
                    {spiffeStatus.trust_domain || "Not configured"}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>CA Algorithm</DescriptionListTerm>
                  <DescriptionListDescription>
                    {spiffeStatus.ca_algorithm}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Entry Count</DescriptionListTerm>
                  <DescriptionListDescription>
                    {spiffeStatus.entry_count}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Workload Socket</DescriptionListTerm>
                  <DescriptionListDescription>
                    {spiffeStatus.workload_socket}
                  </DescriptionListDescription>
                </DescriptionListGroup>
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
                style={{ height: "60vh", overflow: "auto" }}
              >
                {isFetching ? (
                  <DataSpinner />
                ) : error ? (
                  <div style={{ padding: "1rem" }}>
                    Error loading SPIFFE entries. Please try refreshing.
                  </div>
                ) : (
                  <Table
                    aria-label="SPIFFE Workload Entries table"
                    variant="compact"
                  >
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
                              No SPIFFE entries found
                            </div>
                          </Td>
                        </Tr>
                      ) : (
                        paged.map((entry: AhdapaSpiffeEntry) => (
                          <Tr key={entry.id}>
                            <Td
                              select={{
                                rowIndex: 0,
                                onSelect: (_event, isSelecting) =>
                                  toggleSelect(entry.id, isSelecting),
                                isSelected: isSelected(entry.id),
                              }}
                            />
                            <Td dataLabel={columnNames[0]}>
                              <Link
                                to={`/ahdapa-spiffe/${encodeURIComponent(entry.id)}`}
                              >
                                {entry.id}
                              </Link>
                            </Td>
                            <Td dataLabel={columnNames[1]}>
                              {entry.spiffe_id}
                            </Td>
                            <Td dataLabel={columnNames[2]}>
                              {entry.selectors.join(", ")}
                            </Td>
                            <Td dataLabel={columnNames[3]}>
                              {entry.node_constraint || "—"}
                            </Td>
                            <Td dataLabel={columnNames[4]}>
                              {entry.ttl_seconds}
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
              widgetId="ahdapa-spiffe-pagination-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>

      {/* Add Modal */}
      <Modal
        variant={ModalVariant.medium}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetAddForm();
        }}
      >
        <ModalHeader title="Add SPIFFE Workload Entry" />
        <ModalBody>
          <Form>
            <FormGroup label="SPIFFE ID" fieldId="add-spiffe-id" isRequired>
              <TextInput
                id="add-spiffe-id"
                data-cy="ahdapa-spiffe-add-spiffe-id"
                value={addFormSpiffeId}
                onChange={(_event, value) => setAddFormSpiffeId(value)}
                placeholder="spiffe://example.org/workload"
              />
            </FormGroup>
            <FormGroup
              label="Selectors (one per line)"
              fieldId="add-selectors"
              isRequired
            >
              <TextArea
                id="add-selectors"
                data-cy="ahdapa-spiffe-add-selectors"
                value={addFormSelectors}
                onChange={(_event, value) => setAddFormSelectors(value)}
                rows={4}
                placeholder={"unix:uid:1000\nunix:gid:1000"}
              />
            </FormGroup>
            <FormGroup label="Node Constraint" fieldId="add-node-constraint">
              <TextInput
                id="add-node-constraint"
                data-cy="ahdapa-spiffe-add-node-constraint"
                value={addFormNodeConstraint}
                onChange={(_event, value) => setAddFormNodeConstraint(value)}
              />
            </FormGroup>
            <FormGroup label="TTL (seconds)" fieldId="add-ttl">
              <TextInput
                id="add-ttl"
                data-cy="ahdapa-spiffe-add-ttl"
                type="number"
                value={addFormTtl}
                onChange={(_event, value) => setAddFormTtl(value)}
                placeholder="3600"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            data-cy="ahdapa-spiffe-add-modal-button-add"
            key="add"
            variant="primary"
            onClick={onAddSubmit}
            isDisabled={!addFormSpiffeId || !addFormSelectors || isAdding}
            isLoading={isAdding}
          >
            Add
          </Button>
          <Button
            data-cy="ahdapa-spiffe-add-modal-button-cancel"
            key="cancel"
            variant="link"
            onClick={() => {
              setIsAddModalOpen(false);
              resetAddForm();
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AhdapaSpiffe;
