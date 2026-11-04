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
// Data types
import { AhdapaFederatedAccount } from "src/utils/datatypes/ahdapaDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import {
  useListAhdapaFederatedAccountsQuery,
  useCreateAhdapaFederatedAccountMutation,
  useDeleteAhdapaFederatedAccountMutation,
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

const formatDate = (epoch: number): string => {
  if (!epoch) return "—";
  return new Date(epoch * 1000).toLocaleString();
};

const AhdapaFederatedAccounts = () => {
  const dispatch = useAppDispatch();

  useUpdateRoute({ pathname: "ahdapa-federated-accounts" });

  const { page, perPage, searchValue } = useListPageSearchParams();

  const {
    data: allAccounts = [],
    isFetching,
    error,
    refetch,
  } = useListAhdapaFederatedAccountsQuery();

  const [createAccount] = useCreateAhdapaFederatedAccountMutation();
  const [deleteAccount] = useDeleteAhdapaFederatedAccountMutation();

  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [newUpstreamIss, setNewUpstreamIss] = React.useState("");
  const [newUpstreamSub, setNewUpstreamSub] = React.useState("");
  const [newLocalSub, setNewLocalSub] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  // Client-side search filtering
  const filtered = React.useMemo(() => {
    if (!searchValue) return allAccounts;
    const lower = searchValue.toLowerCase();
    return allAccounts.filter(
      (a) =>
        a.upstream_iss.toLowerCase().includes(lower) ||
        a.upstream_sub.toLowerCase().includes(lower) ||
        a.local_sub.toLowerCase().includes(lower) ||
        String(a.id).includes(lower)
    );
  }, [allAccounts, searchValue]);

  // Client-side pagination
  const totalCount = filtered.length;
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;
  const paged = filtered.slice(firstIdx, lastIdx);

  // Selection state
  const [selectedIds, setSelectedIds] = React.useState<Set<number>>(new Set());

  const isSelected = (id: number) => selectedIds.has(id);

  const toggleSelect = (id: number, selected: boolean) => {
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
      setSelectedIds(new Set(filtered.map((a) => a.id)));
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
        await deleteAccount(id).unwrap();
        successCount++;
      } catch {
        failCount++;
      }
    }
    if (successCount > 0) {
      dispatch(
        addAlert({
          name: "delete-ahdapa-fedacct-success",
          title: `Deleted ${successCount} federated account(s)`,
          variant: "success",
        })
      );
    }
    if (failCount > 0) {
      dispatch(
        addAlert({
          name: "delete-ahdapa-fedacct-error",
          title: `Failed to delete ${failCount} federated account(s)`,
          variant: "danger",
        })
      );
    }
    clearSelection();
  };

  // Add modal handlers
  const openAddModal = () => {
    setNewUpstreamIss("");
    setNewUpstreamSub("");
    setNewLocalSub("");
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const onAddAccount = async () => {
    if (!newUpstreamIss.trim() || !newUpstreamSub.trim() || !newLocalSub.trim())
      return;
    setIsCreating(true);
    try {
      await createAccount({
        upstream_iss: newUpstreamIss.trim(),
        upstream_sub: newUpstreamSub.trim(),
        local_sub: newLocalSub.trim(),
      }).unwrap();
      dispatch(
        addAlert({
          name: "create-ahdapa-fedacct-success",
          title: "Federated account link created",
          variant: "success",
        })
      );
      closeAddModal();
    } catch {
      dispatch(
        addAlert({
          name: "create-ahdapa-fedacct-error",
          title: "Failed to create federated account link",
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
          dataCy="ahdapa-fedacct-search"
          name="search"
          ariaLabel="Search federated accounts"
          placeholder="Search accounts"
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
          dataCy="ahdapa-fedacct-button-refresh"
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
          dataCy="ahdapa-fedacct-button-delete"
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
          dataCy="ahdapa-fedacct-button-add"
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
          widgetId="ahdapa-fedacct-pagination-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  // Column definitions
  const columnNames = [
    "ID",
    "Upstream Issuer",
    "Upstream Subject",
    "Local Subject",
    "Linked At",
  ] as const;

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="ahdapa-fedacct-page"
          headingLevel="h1"
          text="Federated Accounts"
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
                    Error loading federated accounts. Please try refreshing.
                  </div>
                ) : (
                  <Table
                    aria-label="Federated Accounts table"
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
                              No federated accounts found
                            </div>
                          </Td>
                        </Tr>
                      ) : (
                        paged.map((acct: AhdapaFederatedAccount) => (
                          <Tr key={acct.id}>
                            <Td
                              select={{
                                rowIndex: 0,
                                onSelect: (_event, isSelecting) =>
                                  toggleSelect(acct.id, isSelecting),
                                isSelected: isSelected(acct.id),
                              }}
                            />
                            <Td dataLabel={columnNames[0]}>{acct.id}</Td>
                            <Td dataLabel={columnNames[1]}>
                              {acct.upstream_iss}
                            </Td>
                            <Td dataLabel={columnNames[2]}>
                              {acct.upstream_sub}
                            </Td>
                            <Td dataLabel={columnNames[3]}>{acct.local_sub}</Td>
                            <Td dataLabel={columnNames[4]}>
                              {formatDate(acct.linked_at)}
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
              widgetId="ahdapa-fedacct-pagination-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>

      {/* Add Federated Account Modal */}
      <Modal
        variant={ModalVariant.small}
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        aria-labelledby="add-fedacct-modal-title"
      >
        <ModalHeader
          title="Add Federated Account Link"
          labelId="add-fedacct-modal-title"
        />
        <ModalBody>
          <Form
            id="add-fedacct-form"
            onSubmit={(e) => {
              e.preventDefault();
              onAddAccount();
            }}
          >
            <FormGroup
              label="Upstream Issuer"
              fieldId="new-upstream-iss"
              isRequired
            >
              <TextInput
                id="new-upstream-iss"
                data-cy="ahdapa-fedacct-add-upstream-iss"
                value={newUpstreamIss}
                onChange={(_event, value) => setNewUpstreamIss(value)}
                isRequired
                aria-label="Upstream issuer URL"
              />
            </FormGroup>
            <FormGroup
              label="Upstream Subject"
              fieldId="new-upstream-sub"
              isRequired
            >
              <TextInput
                id="new-upstream-sub"
                data-cy="ahdapa-fedacct-add-upstream-sub"
                value={newUpstreamSub}
                onChange={(_event, value) => setNewUpstreamSub(value)}
                isRequired
                aria-label="Upstream subject"
              />
            </FormGroup>
            <FormGroup label="Local Subject" fieldId="new-local-sub" isRequired>
              <TextInput
                id="new-local-sub"
                data-cy="ahdapa-fedacct-add-local-sub"
                value={newLocalSub}
                onChange={(_event, value) => setNewLocalSub(value)}
                isRequired
                aria-label="Local subject"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            data-cy="ahdapa-fedacct-add-modal-confirm"
            key="add"
            variant="primary"
            onClick={onAddAccount}
            isDisabled={
              !newUpstreamIss.trim() ||
              !newUpstreamSub.trim() ||
              !newLocalSub.trim() ||
              isCreating
            }
            isLoading={isCreating}
            form="add-fedacct-form"
          >
            Add
          </Button>
          <Button
            data-cy="ahdapa-fedacct-add-modal-cancel"
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

export default AhdapaFederatedAccounts;
