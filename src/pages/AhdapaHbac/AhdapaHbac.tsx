import React from "react";
// PatternFly
import {
  Badge,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  PageSection,
  PaginationVariant,
  TextInput,
  ToolbarItemVariant,
  Button,
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
import { AhdapaHBACRuleInfo } from "src/utils/datatypes/ahdapaDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import {
  useListAhdapaHBACRulesQuery,
  useCreateAhdapaHBACRuleMutation,
  useDeleteAhdapaHBACRuleMutation,
} from "src/services/rpcAhdapaHbac";
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

const AhdapaHbac = () => {
  const dispatch = useAppDispatch();

  useUpdateRoute({ pathname: "ahdapa-hbac" });

  const { page, perPage, searchValue } = useListPageSearchParams();

  const {
    data: allRules = [],
    isFetching,
    error,
    refetch,
  } = useListAhdapaHBACRulesQuery();

  const [createRule] = useCreateAhdapaHBACRuleMutation();
  const [deleteRule] = useDeleteAhdapaHBACRuleMutation();

  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [newRuleName, setNewRuleName] = React.useState("");
  const [newRuleDescription, setNewRuleDescription] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  // Client-side search filtering
  const filtered = React.useMemo(() => {
    if (!searchValue) return allRules;
    const lower = searchValue.toLowerCase();
    return allRules.filter(
      (r) =>
        r.name.toLowerCase().includes(lower) ||
        r.description.toLowerCase().includes(lower)
    );
  }, [allRules, searchValue]);

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
      setSelectedIds(new Set(filtered.map((r) => r.id)));
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
    let successCount = 0;
    let failCount = 0;
    for (const id of ids) {
      try {
        await deleteRule(id).unwrap();
        successCount++;
      } catch {
        failCount++;
      }
    }
    if (successCount > 0) {
      dispatch(
        addAlert({
          name: "delete-ahdapa-hbac-success",
          title: `Deleted ${successCount} HBAC rule(s)`,
          variant: "success",
        })
      );
    }
    if (failCount > 0) {
      dispatch(
        addAlert({
          name: "delete-ahdapa-hbac-error",
          title: `Failed to delete ${failCount} HBAC rule(s)`,
          variant: "danger",
        })
      );
    }
    clearSelection();
  };

  // Add modal handlers
  const openAddModal = () => {
    setNewRuleName("");
    setNewRuleDescription("");
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const onAddRule = async () => {
    if (!newRuleName.trim()) return;
    setIsCreating(true);
    try {
      await createRule({
        name: newRuleName.trim(),
        description: newRuleDescription.trim(),
      }).unwrap();
      dispatch(
        addAlert({
          name: "create-ahdapa-hbac-success",
          title: `HBAC rule '${newRuleName.trim()}' created`,
          variant: "success",
        })
      );
      closeAddModal();
    } catch {
      dispatch(
        addAlert({
          name: "create-ahdapa-hbac-error",
          title: "Failed to create HBAC rule",
          variant: "danger",
        })
      );
    }
    setIsCreating(false);
  };

  // Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <SearchInputLayout
          dataCy="ahdapa-hbac-search"
          name="search"
          ariaLabel="Search HBAC rules"
          placeholder="Search HBAC rules"
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
          dataCy="ahdapa-hbac-button-refresh"
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
          dataCy="ahdapa-hbac-button-delete"
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
          dataCy="ahdapa-hbac-button-add"
          isDisabled={isFetching}
          onClickHandler={openAddModal}
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
          widgetId="ahdapa-hbac-pagination-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  // Column definitions
  const columnNames = [
    "Name",
    "Description",
    "Enabled",
    "Users",
    "Clients",
    "Scopes",
  ] as const;

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="ahdapa-hbac-page"
          headingLevel="h1"
          text="Identity HBAC Rules"
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
                    Error loading HBAC rules. Please try refreshing.
                  </div>
                ) : (
                  <Table
                    aria-label="Identity HBAC Rules table"
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
                              No HBAC rules found
                            </div>
                          </Td>
                        </Tr>
                      ) : (
                        paged.map((rule: AhdapaHBACRuleInfo) => (
                          <Tr key={rule.id}>
                            <Td
                              select={{
                                rowIndex: 0,
                                onSelect: (_event, isSelecting) =>
                                  toggleSelect(rule.id, isSelecting),
                                isSelected: isSelected(rule.id),
                              }}
                            />
                            <Td dataLabel={columnNames[0]}>
                              <Link
                                to={`/ahdapa-hbac/${encodeURIComponent(rule.id)}`}
                              >
                                {rule.name}
                              </Link>
                            </Td>
                            <Td dataLabel={columnNames[1]}>
                              {rule.description}
                            </Td>
                            <Td dataLabel={columnNames[2]}>
                              <Badge
                                screenReaderText={
                                  rule.enabled ? "Enabled" : "Disabled"
                                }
                              >
                                {rule.enabled ? "Yes" : "No"}
                              </Badge>
                            </Td>
                            <Td dataLabel={columnNames[3]}>
                              {rule.user_count}
                            </Td>
                            <Td dataLabel={columnNames[4]}>
                              {rule.client_count}
                            </Td>
                            <Td dataLabel={columnNames[5]}>
                              {rule.scope_count}
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
              widgetId="ahdapa-hbac-pagination-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>

      {/* Add HBAC Rule Modal */}
      <Modal
        variant={ModalVariant.small}
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        aria-labelledby="add-hbac-rule-modal-title"
      >
        <ModalHeader
          title="Add HBAC rule"
          labelId="add-hbac-rule-modal-title"
        />
        <ModalBody>
          <Form
            id="add-hbac-rule-form"
            onSubmit={(e) => {
              e.preventDefault();
              onAddRule();
            }}
          >
            <FormGroup label="Name" fieldId="new-rule-name" isRequired>
              <TextInput
                id="new-rule-name"
                data-cy="ahdapa-hbac-add-name"
                value={newRuleName}
                onChange={(_event, value) => setNewRuleName(value)}
                isRequired
                aria-label="Rule name"
              />
            </FormGroup>
            <FormGroup label="Description" fieldId="new-rule-description">
              <TextInput
                id="new-rule-description"
                data-cy="ahdapa-hbac-add-description"
                value={newRuleDescription}
                onChange={(_event, value) => setNewRuleDescription(value)}
                aria-label="Rule description"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            data-cy="ahdapa-hbac-add-modal-confirm"
            key="add"
            variant="primary"
            onClick={onAddRule}
            isDisabled={!newRuleName.trim() || isCreating}
            isLoading={isCreating}
            form="add-hbac-rule-form"
          >
            Add
          </Button>
          <Button
            data-cy="ahdapa-hbac-add-modal-cancel"
            key="cancel"
            variant="link"
            onClick={closeAddModal}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AhdapaHbac;
