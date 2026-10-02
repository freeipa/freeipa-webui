import React from "react";
// PatternFly
import {
  Checkbox,
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
import { AhdapaSaml2Sp } from "src/utils/datatypes/ahdapaDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import {
  useListAhdapaSaml2SpsQuery,
  useCreateAhdapaSaml2SpMutation,
  useDeleteAhdapaSaml2SpMutation,
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

const AhdapaSaml2Sps = () => {
  const dispatch = useAppDispatch();

  useUpdateRoute({ pathname: "ahdapa-saml2-sps" });

  const { page, perPage, searchValue } = useListPageSearchParams();

  const {
    data: allSps = [],
    isFetching,
    error,
    refetch,
  } = useListAhdapaSaml2SpsQuery();

  const [deleteSp] = useDeleteAhdapaSaml2SpMutation();
  const [createSp] = useCreateAhdapaSaml2SpMutation();

  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [addFormEntityId, setAddFormEntityId] = React.useState("");
  const [addFormAcsUrls, setAddFormAcsUrls] = React.useState("");
  const [addFormSloUrl, setAddFormSloUrl] = React.useState("");
  const [addFormNameIdFormat, setAddFormNameIdFormat] = React.useState("");
  const [addFormCertPem, setAddFormCertPem] = React.useState("");
  const [addFormWantSigned, setAddFormWantSigned] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);

  const resetAddForm = () => {
    setAddFormEntityId("");
    setAddFormAcsUrls("");
    setAddFormSloUrl("");
    setAddFormNameIdFormat("");
    setAddFormCertPem("");
    setAddFormWantSigned(false);
  };

  const onAddSubmit = async () => {
    setIsAdding(true);
    const acsUrls = addFormAcsUrls
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      await createSp({
        entity_id: addFormEntityId,
        acs_urls: acsUrls,
        slo_url: addFormSloUrl || undefined,
        name_id_format: addFormNameIdFormat || undefined,
        certificate_pem: addFormCertPem || undefined,
        want_assertions_signed: addFormWantSigned,
      }).unwrap();
      dispatch(
        addAlert({
          name: "create-saml2-sp-success",
          title: "SAML2 Service Provider created",
          variant: "success",
        })
      );
      setIsAddModalOpen(false);
      resetAddForm();
    } catch {
      dispatch(
        addAlert({
          name: "create-saml2-sp-error",
          title: "Failed to create SAML2 Service Provider",
          variant: "danger",
        })
      );
    }
    setIsAdding(false);
  };

  // Client-side search filtering
  const filtered = React.useMemo(() => {
    if (!searchValue) return allSps;
    const lower = searchValue.toLowerCase();
    return allSps.filter(
      (sp) =>
        sp.entity_id.toLowerCase().includes(lower) ||
        sp.acs_urls.some((u) => u.toLowerCase().includes(lower))
    );
  }, [allSps, searchValue]);

  // Client-side pagination
  const totalCount = filtered.length;
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;
  const paged = filtered.slice(firstIdx, lastIdx);

  // Selection state
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const isSelected = (entityId: string) => selectedIds.has(entityId);

  const toggleSelect = (entityId: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(entityId);
      } else {
        next.delete(entityId);
      }
      return next;
    });
  };

  const selectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(new Set(filtered.map((sp) => sp.entity_id)));
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
      for (const entityId of ids) {
        await deleteSp(entityId).unwrap();
      }
      dispatch(
        addAlert({
          name: "delete-saml2-sps-success",
          title: `Deleted ${ids.length} SAML2 SP(s)`,
          variant: "success",
        })
      );
      clearSelection();
    } catch {
      dispatch(
        addAlert({
          name: "delete-saml2-sps-error",
          title: "Failed to delete SAML2 SP(s)",
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
          dataCy="ahdapa-saml2-sps-search"
          name="search"
          ariaLabel="Search SAML2 Service Providers"
          placeholder="Search service providers"
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
          dataCy="ahdapa-saml2-sps-button-refresh"
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
          dataCy="ahdapa-saml2-sps-button-delete"
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
          dataCy="ahdapa-saml2-sps-button-add"
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
          widgetId="ahdapa-saml2-sps-pagination-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  // Column definitions
  const columnNames = [
    "Entity ID",
    "ACS URLs",
    "Name ID Format",
    "Assertions Signed",
    "Has Certificate",
  ] as const;

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="ahdapa-saml2-sps-page"
          headingLevel="h1"
          text="SAML2 Service Providers"
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
                    Error loading SAML2 Service Providers. Please try
                    refreshing.
                  </div>
                ) : (
                  <Table
                    aria-label="SAML2 Service Providers table"
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
                              No SAML2 Service Providers found
                            </div>
                          </Td>
                        </Tr>
                      ) : (
                        paged.map((sp: AhdapaSaml2Sp) => (
                          <Tr key={sp.entity_id}>
                            <Td
                              select={{
                                rowIndex: 0,
                                onSelect: (_event, isSelecting) =>
                                  toggleSelect(sp.entity_id, isSelecting),
                                isSelected: isSelected(sp.entity_id),
                              }}
                            />
                            <Td dataLabel={columnNames[0]}>
                              <Link
                                to={`/ahdapa-saml2-sps/${encodeURIComponent(sp.entity_id)}`}
                              >
                                {sp.entity_id}
                              </Link>
                            </Td>
                            <Td dataLabel={columnNames[1]}>
                              {sp.acs_urls.join(", ")}
                            </Td>
                            <Td dataLabel={columnNames[2]}>
                              {sp.name_id_format || "—"}
                            </Td>
                            <Td dataLabel={columnNames[3]}>
                              {sp.want_assertions_signed ? "Yes" : "No"}
                            </Td>
                            <Td dataLabel={columnNames[4]}>
                              {sp.has_certificate ? "Yes" : "No"}
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
              widgetId="ahdapa-saml2-sps-pagination-bottom"
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
        <ModalHeader title="Add SAML2 Service Provider" />
        <ModalBody>
          <Form>
            <FormGroup label="Entity ID" fieldId="add-entity-id" isRequired>
              <TextInput
                id="add-entity-id"
                data-cy="ahdapa-saml2-sps-add-entity-id"
                value={addFormEntityId}
                onChange={(_event, value) => setAddFormEntityId(value)}
                placeholder="https://sp.example.org/metadata"
              />
            </FormGroup>
            <FormGroup
              label="ACS URLs (one per line)"
              fieldId="add-acs-urls"
              isRequired
            >
              <TextArea
                id="add-acs-urls"
                data-cy="ahdapa-saml2-sps-add-acs-urls"
                value={addFormAcsUrls}
                onChange={(_event, value) => setAddFormAcsUrls(value)}
                rows={3}
                placeholder="https://sp.example.org/acs"
              />
            </FormGroup>
            <FormGroup label="SLO URL" fieldId="add-slo-url">
              <TextInput
                id="add-slo-url"
                data-cy="ahdapa-saml2-sps-add-slo-url"
                value={addFormSloUrl}
                onChange={(_event, value) => setAddFormSloUrl(value)}
                placeholder="https://sp.example.org/slo"
              />
            </FormGroup>
            <FormGroup label="Name ID Format" fieldId="add-name-id-format">
              <TextInput
                id="add-name-id-format"
                data-cy="ahdapa-saml2-sps-add-name-id-format"
                value={addFormNameIdFormat}
                onChange={(_event, value) => setAddFormNameIdFormat(value)}
                placeholder="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"
              />
            </FormGroup>
            <FormGroup label="Certificate (PEM)" fieldId="add-cert-pem">
              <TextArea
                id="add-cert-pem"
                data-cy="ahdapa-saml2-sps-add-cert-pem"
                value={addFormCertPem}
                onChange={(_event, value) => setAddFormCertPem(value)}
                rows={6}
                placeholder="-----BEGIN CERTIFICATE-----"
              />
            </FormGroup>
            <FormGroup fieldId="add-want-signed">
              <Checkbox
                id="add-want-signed"
                data-cy="ahdapa-saml2-sps-add-want-signed"
                label="Want assertions signed"
                isChecked={addFormWantSigned}
                onChange={(_event, checked) => setAddFormWantSigned(checked)}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            data-cy="ahdapa-saml2-sps-add-modal-button-add"
            key="add"
            variant="primary"
            onClick={onAddSubmit}
            isDisabled={!addFormEntityId || !addFormAcsUrls || isAdding}
            isLoading={isAdding}
          >
            Add
          </Button>
          <Button
            data-cy="ahdapa-saml2-sps-add-modal-button-cancel"
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

export default AhdapaSaml2Sps;
