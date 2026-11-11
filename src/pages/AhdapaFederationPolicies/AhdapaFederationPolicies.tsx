import React from "react";
// PatternFly
import {
  Button,
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
import { AhdapaFederationPolicy } from "src/utils/datatypes/ahdapaDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import {
  useListAhdapaFederationPoliciesQuery,
  useCreateAhdapaFederationPolicyMutation,
  useDeleteAhdapaFederationPolicyMutation,
} from "src/services/rpcAhdapaFederation";
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

const AhdapaFederationPolicies = () => {
  const dispatch = useAppDispatch();

  useUpdateRoute({ pathname: "ahdapa-federation-policies" });

  const { page, perPage, searchValue } = useListPageSearchParams();

  const {
    data: allPolicies = [],
    isFetching,
    error,
    refetch,
  } = useListAhdapaFederationPoliciesQuery();

  const [createPolicy] = useCreateAhdapaFederationPolicyMutation();
  const [deletePolicy] = useDeleteAhdapaFederationPolicyMutation();

  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [newUpstreamIss, setNewUpstreamIss] = React.useState("");
  const [newSubjectPattern, setNewSubjectPattern] = React.useState("");
  const [newLocalSub, setNewLocalSub] = React.useState("");
  const [newPriority, setNewPriority] = React.useState("0");
  const [isCreating, setIsCreating] = React.useState(false);

  // Client-side search filtering
  const filtered = React.useMemo(() => {
    if (!searchValue) return allPolicies;
    const lower = searchValue.toLowerCase();
    return allPolicies.filter(
      (p) =>
        p.key.toLowerCase().includes(lower) ||
        p.upstream_iss.toLowerCase().includes(lower) ||
        p.subject_pattern.toLowerCase().includes(lower) ||
        p.local_sub.toLowerCase().includes(lower)
    );
  }, [allPolicies, searchValue]);

  // Client-side pagination
  const totalCount = filtered.length;
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;
  const paged = filtered.slice(firstIdx, lastIdx);

  // Selection state
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
    new Set()
  );

  const isSelected = (key: string) => selectedKeys.has(key);

  const toggleSelect = (key: string, selected: boolean) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(key);
      } else {
        next.delete(key);
      }
      return next;
    });
  };

  const selectAll = (selected: boolean) => {
    if (selected) {
      setSelectedKeys(new Set(filtered.map((p) => p.key)));
    } else {
      setSelectedKeys(new Set());
    }
  };

  const clearSelection = () => setSelectedKeys(new Set());

  // Refresh
  const refreshData = () => {
    clearSelection();
    refetch();
  };

  // Delete
  const isDeleteDisabled = selectedKeys.size === 0 || isFetching;

  const onDelete = async () => {
    const keys = Array.from(selectedKeys);
    let successCount = 0;
    let failCount = 0;
    for (const key of keys) {
      try {
        await deletePolicy(key).unwrap();
        successCount++;
      } catch {
        failCount++;
      }
    }
    if (successCount > 0) {
      dispatch(
        addAlert({
          name: "delete-ahdapa-fedpol-success",
          title: `Deleted ${successCount} federation policy(ies)`,
          variant: "success",
        })
      );
    }
    if (failCount > 0) {
      dispatch(
        addAlert({
          name: "delete-ahdapa-fedpol-error",
          title: `Failed to delete ${failCount} federation policy(ies)`,
          variant: "danger",
        })
      );
    }
    clearSelection();
  };

  // Add modal handlers
  const openAddModal = () => {
    setNewUpstreamIss("");
    setNewSubjectPattern("");
    setNewLocalSub("");
    setNewPriority("0");
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const onAddPolicy = async () => {
    if (
      !newUpstreamIss.trim() ||
      !newSubjectPattern.trim() ||
      !newLocalSub.trim()
    )
      return;
    setIsCreating(true);
    try {
      await createPolicy({
        upstream_iss: newUpstreamIss.trim(),
        subject_pattern: newSubjectPattern.trim(),
        local_sub: newLocalSub.trim(),
        priority: parseInt(newPriority, 10) || 0,
      }).unwrap();
      dispatch(
        addAlert({
          name: "create-ahdapa-fedpol-success",
          title: "Federation policy created",
          variant: "success",
        })
      );
      closeAddModal();
    } catch {
      dispatch(
        addAlert({
          name: "create-ahdapa-fedpol-error",
          title: "Failed to create federation policy",
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
          dataCy="ahdapa-fedpol-search"
          name="search"
          ariaLabel="Search federation policies"
          placeholder="Search policies"
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
          dataCy="ahdapa-fedpol-button-refresh"
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
          dataCy="ahdapa-fedpol-button-delete"
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
          dataCy="ahdapa-fedpol-button-add"
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
          widgetId="ahdapa-fedpol-pagination-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  // Column definitions
  const columnNames = [
    "Key",
    "Upstream Issuer",
    "Subject Pattern",
    "Local Subject",
    "Priority",
  ] as const;

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="ahdapa-fedpol-page"
          headingLevel="h1"
          text="Federation Policies"
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
                    Error loading federation policies. Please try refreshing.
                  </div>
                ) : (
                  <Table
                    aria-label="Federation Policies table"
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
                              selectedKeys.size === filtered.length,
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
                              No federation policies found
                            </div>
                          </Td>
                        </Tr>
                      ) : (
                        paged.map((policy: AhdapaFederationPolicy) => (
                          <Tr key={policy.key}>
                            <Td
                              select={{
                                rowIndex: 0,
                                onSelect: (_event, isSelecting) =>
                                  toggleSelect(policy.key, isSelecting),
                                isSelected: isSelected(policy.key),
                              }}
                            />
                            <Td dataLabel={columnNames[0]}>
                              <Link
                                to={`/ahdapa-federation-policies/${encodeURIComponent(policy.key)}`}
                              >
                                {policy.key}
                              </Link>
                            </Td>
                            <Td dataLabel={columnNames[1]}>
                              {policy.upstream_iss}
                            </Td>
                            <Td dataLabel={columnNames[2]}>
                              {policy.subject_pattern}
                            </Td>
                            <Td dataLabel={columnNames[3]}>
                              {policy.local_sub}
                            </Td>
                            <Td dataLabel={columnNames[4]}>
                              {policy.priority}
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
              widgetId="ahdapa-fedpol-pagination-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>

      {/* Add Federation Policy Modal */}
      <Modal
        variant={ModalVariant.small}
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        aria-labelledby="add-fedpol-modal-title"
      >
        <ModalHeader
          title="Add Federation Policy"
          labelId="add-fedpol-modal-title"
        />
        <ModalBody>
          <Form
            id="add-fedpol-form"
            onSubmit={(e) => {
              e.preventDefault();
              onAddPolicy();
            }}
          >
            <FormGroup
              label="Upstream Issuer"
              fieldId="new-pol-upstream-iss"
              isRequired
            >
              <TextInput
                id="new-pol-upstream-iss"
                data-cy="ahdapa-fedpol-add-upstream-iss"
                value={newUpstreamIss}
                onChange={(_event, value) => setNewUpstreamIss(value)}
                isRequired
                aria-label="Upstream issuer"
              />
            </FormGroup>
            <FormGroup
              label="Subject Pattern"
              fieldId="new-pol-subject-pattern"
              isRequired
            >
              <TextInput
                id="new-pol-subject-pattern"
                data-cy="ahdapa-fedpol-add-subject-pattern"
                value={newSubjectPattern}
                onChange={(_event, value) => setNewSubjectPattern(value)}
                isRequired
                aria-label="Subject pattern"
              />
            </FormGroup>
            <FormGroup
              label="Local Subject"
              fieldId="new-pol-local-sub"
              isRequired
            >
              <TextInput
                id="new-pol-local-sub"
                data-cy="ahdapa-fedpol-add-local-sub"
                value={newLocalSub}
                onChange={(_event, value) => setNewLocalSub(value)}
                isRequired
                aria-label="Local subject"
              />
            </FormGroup>
            <FormGroup label="Priority" fieldId="new-pol-priority">
              <TextInput
                id="new-pol-priority"
                data-cy="ahdapa-fedpol-add-priority"
                type="number"
                value={newPriority}
                onChange={(_event, value) => setNewPriority(value)}
                aria-label="Priority"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            data-cy="ahdapa-fedpol-add-modal-confirm"
            key="add"
            variant="primary"
            onClick={onAddPolicy}
            isDisabled={
              !newUpstreamIss.trim() ||
              !newSubjectPattern.trim() ||
              !newLocalSub.trim() ||
              isCreating
            }
            isLoading={isCreating}
            form="add-fedpol-form"
          >
            Add
          </Button>
          <Button
            data-cy="ahdapa-fedpol-add-modal-cancel"
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

export default AhdapaFederationPolicies;
