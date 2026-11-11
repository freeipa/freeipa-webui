import React from "react";
// PatternFly
import {
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
import { AhdapaSaml2Idp } from "src/utils/datatypes/ahdapaDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import {
  useListAhdapaSaml2IdpsQuery,
  useCreateAhdapaSaml2IdpMutation,
  useDeleteAhdapaSaml2IdpMutation,
} from "src/services/rpcAhdapaSaml";
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

const AhdapaSaml2Idps = () => {
  const dispatch = useAppDispatch();

  useUpdateRoute({ pathname: "ahdapa-saml2-idps" });

  const { page, perPage, searchValue } = useListPageSearchParams();

  const {
    data: allIdps = [],
    isFetching,
    error,
    refetch,
  } = useListAhdapaSaml2IdpsQuery();

  const [deleteIdp] = useDeleteAhdapaSaml2IdpMutation();
  const [createIdp] = useCreateAhdapaSaml2IdpMutation();

  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [addFormEntityId, setAddFormEntityId] = React.useState("");
  const [addFormLocalId, setAddFormLocalId] = React.useState("");
  const [addFormSsoUrl, setAddFormSsoUrl] = React.useState("");
  const [addFormSloUrl, setAddFormSloUrl] = React.useState("");
  const [addFormPreferredBinding, setAddFormPreferredBinding] =
    React.useState("");
  const [addFormDefaultGroups, setAddFormDefaultGroups] = React.useState("");
  const [addFormCertsPem, setAddFormCertsPem] = React.useState("");
  const [isAdding, setIsAdding] = React.useState(false);

  const resetAddForm = () => {
    setAddFormEntityId("");
    setAddFormLocalId("");
    setAddFormSsoUrl("");
    setAddFormSloUrl("");
    setAddFormPreferredBinding("");
    setAddFormDefaultGroups("");
    setAddFormCertsPem("");
  };

  const onAddSubmit = async () => {
    setIsAdding(true);
    const defaultGroups = addFormDefaultGroups
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const certsPem = addFormCertsPem.trim()
      ? [addFormCertsPem.trim()]
      : undefined;
    try {
      await createIdp({
        entity_id: addFormEntityId,
        local_id: addFormLocalId,
        sso_url: addFormSsoUrl,
        slo_url: addFormSloUrl || undefined,
        preferred_binding: addFormPreferredBinding || undefined,
        default_groups: defaultGroups.length > 0 ? defaultGroups : undefined,
        certificates_pem: certsPem,
      }).unwrap();
      dispatch(
        addAlert({
          name: "create-saml2-idp-success",
          title: "SAML2 Upstream IdP created",
          variant: "success",
        })
      );
      setIsAddModalOpen(false);
      resetAddForm();
    } catch {
      dispatch(
        addAlert({
          name: "create-saml2-idp-error",
          title: "Failed to create SAML2 Upstream IdP",
          variant: "danger",
        })
      );
    }
    setIsAdding(false);
  };

  // Client-side search filtering
  const filtered = React.useMemo(() => {
    if (!searchValue) return allIdps;
    const lower = searchValue.toLowerCase();
    return allIdps.filter(
      (idp) =>
        idp.entity_id.toLowerCase().includes(lower) ||
        idp.local_id.toLowerCase().includes(lower) ||
        idp.sso_url.toLowerCase().includes(lower)
    );
  }, [allIdps, searchValue]);

  // Client-side pagination
  const totalCount = filtered.length;
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;
  const paged = filtered.slice(firstIdx, lastIdx);

  // Selection state
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const isSelected = (localId: string) => selectedIds.has(localId);

  const toggleSelect = (localId: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(localId);
      } else {
        next.delete(localId);
      }
      return next;
    });
  };

  const selectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(new Set(filtered.map((idp) => idp.local_id)));
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
      for (const localId of ids) {
        await deleteIdp(localId).unwrap();
      }
      dispatch(
        addAlert({
          name: "delete-saml2-idps-success",
          title: `Deleted ${ids.length} SAML2 IdP(s)`,
          variant: "success",
        })
      );
      clearSelection();
    } catch {
      dispatch(
        addAlert({
          name: "delete-saml2-idps-error",
          title: "Failed to delete SAML2 IdP(s)",
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
          dataCy="ahdapa-saml2-idps-search"
          name="search"
          ariaLabel="Search SAML2 Upstream IdPs"
          placeholder="Search upstream IdPs"
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
          dataCy="ahdapa-saml2-idps-button-refresh"
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
          dataCy="ahdapa-saml2-idps-button-delete"
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
          dataCy="ahdapa-saml2-idps-button-add"
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
          widgetId="ahdapa-saml2-idps-pagination-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  // Column definitions
  const columnNames = [
    "Entity ID",
    "Local ID",
    "SSO URL",
    "Preferred Binding",
    "Certificate Count",
  ] as const;

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="ahdapa-saml2-idps-page"
          headingLevel="h1"
          text="SAML2 Upstream Identity Providers"
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
                    Error loading SAML2 Upstream IdPs. Please try refreshing.
                  </div>
                ) : (
                  <Table
                    aria-label="SAML2 Upstream IdPs table"
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
                              No SAML2 Upstream IdPs found
                            </div>
                          </Td>
                        </Tr>
                      ) : (
                        paged.map((idp: AhdapaSaml2Idp) => (
                          <Tr key={idp.local_id}>
                            <Td
                              select={{
                                rowIndex: 0,
                                onSelect: (_event, isSelecting) =>
                                  toggleSelect(idp.local_id, isSelecting),
                                isSelected: isSelected(idp.local_id),
                              }}
                            />
                            <Td dataLabel={columnNames[0]}>{idp.entity_id}</Td>
                            <Td dataLabel={columnNames[1]}>
                              <Link
                                to={`/ahdapa-saml2-idps/${encodeURIComponent(idp.local_id)}`}
                              >
                                {idp.local_id}
                              </Link>
                            </Td>
                            <Td dataLabel={columnNames[2]}>{idp.sso_url}</Td>
                            <Td dataLabel={columnNames[3]}>
                              {idp.preferred_binding}
                            </Td>
                            <Td dataLabel={columnNames[4]}>
                              {idp.certificate_count}
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
              widgetId="ahdapa-saml2-idps-pagination-bottom"
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
        <ModalHeader title="Add SAML2 Upstream Identity Provider" />
        <ModalBody>
          <Form>
            <FormGroup label="Entity ID" fieldId="add-entity-id" isRequired>
              <TextInput
                id="add-entity-id"
                data-cy="ahdapa-saml2-idps-add-entity-id"
                value={addFormEntityId}
                onChange={(_event, value) => setAddFormEntityId(value)}
                placeholder="https://idp.example.org/metadata"
              />
            </FormGroup>
            <FormGroup label="Local ID" fieldId="add-local-id" isRequired>
              <TextInput
                id="add-local-id"
                data-cy="ahdapa-saml2-idps-add-local-id"
                value={addFormLocalId}
                onChange={(_event, value) => setAddFormLocalId(value)}
                placeholder="my-upstream-idp"
              />
            </FormGroup>
            <FormGroup label="SSO URL" fieldId="add-sso-url" isRequired>
              <TextInput
                id="add-sso-url"
                data-cy="ahdapa-saml2-idps-add-sso-url"
                value={addFormSsoUrl}
                onChange={(_event, value) => setAddFormSsoUrl(value)}
                placeholder="https://idp.example.org/sso"
              />
            </FormGroup>
            <FormGroup label="SLO URL" fieldId="add-slo-url">
              <TextInput
                id="add-slo-url"
                data-cy="ahdapa-saml2-idps-add-slo-url"
                value={addFormSloUrl}
                onChange={(_event, value) => setAddFormSloUrl(value)}
                placeholder="https://idp.example.org/slo"
              />
            </FormGroup>
            <FormGroup
              label="Preferred Binding"
              fieldId="add-preferred-binding"
            >
              <TextInput
                id="add-preferred-binding"
                data-cy="ahdapa-saml2-idps-add-preferred-binding"
                value={addFormPreferredBinding}
                onChange={(_event, value) => setAddFormPreferredBinding(value)}
                placeholder="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
              />
            </FormGroup>
            <FormGroup
              label="Default Groups (comma-separated)"
              fieldId="add-default-groups"
            >
              <TextInput
                id="add-default-groups"
                data-cy="ahdapa-saml2-idps-add-default-groups"
                value={addFormDefaultGroups}
                onChange={(_event, value) => setAddFormDefaultGroups(value)}
                placeholder="group1, group2"
              />
            </FormGroup>
            <FormGroup label="Certificates (PEM)" fieldId="add-certs-pem">
              <TextArea
                id="add-certs-pem"
                data-cy="ahdapa-saml2-idps-add-certs-pem"
                value={addFormCertsPem}
                onChange={(_event, value) => setAddFormCertsPem(value)}
                rows={6}
                placeholder="-----BEGIN CERTIFICATE-----"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            data-cy="ahdapa-saml2-idps-add-modal-button-add"
            key="add"
            variant="primary"
            onClick={onAddSubmit}
            isDisabled={
              !addFormEntityId || !addFormLocalId || !addFormSsoUrl || isAdding
            }
            isLoading={isAdding}
          >
            Add
          </Button>
          <Button
            data-cy="ahdapa-saml2-idps-add-modal-button-cancel"
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

export default AhdapaSaml2Idps;
