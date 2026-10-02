import React from "react";
// PatternFly
import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextInput,
  PageSection,
  Tabs,
  Tab,
  TabTitleText,
} from "@patternfly/react-core";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
// React Router
import { useNavigate, useParams } from "react-router";
// Data types
import {
  AhdapaSaml2Idp,
  AhdapaCertificateInfo,
} from "src/utils/datatypes/ahdapaDataTypes";
// Components
import { NotFound } from "src/components/errors/PageErrors";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
import BreadCrumb, {
  BreadCrumbItem,
} from "src/components/layouts/BreadCrumb/BreadCrumb";
import TabLayout from "src/components/layouts/TabLayout";
import { ToolbarItem } from "src/components/layouts/ToolbarLayout";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { addAlert } from "src/store/Global/alerts-slice";
// RPC
import {
  useGetAhdapaSaml2IdpQuery,
  useUpdateAhdapaSaml2IdpMutation,
  useDeleteAhdapaSaml2IdpMutation,
} from "src/services/rpcAhdapaSaml";

const AhdapaSaml2IdpsTabs = ({ section }: { section?: string }) => {
  const { localId } = useParams<{ localId: string }>();
  const decodedLocalId = localId ? decodeURIComponent(localId) : "";
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const pathname = "ahdapa-saml2-idps";

  useUpdateRoute({ pathname });

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  const [activeTabKey, setActiveTabKey] = React.useState(section || "settings");

  const {
    data: idp,
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useGetAhdapaSaml2IdpQuery(decodedLocalId);

  const [updateIdp] = useUpdateAhdapaSaml2IdpMutation();
  const [deleteIdp] = useDeleteAhdapaSaml2IdpMutation();

  // Editable copy
  const [editedIdp, setEditedIdp] = React.useState<AhdapaSaml2Idp | undefined>(
    idp
  );

  React.useEffect(() => {
    if (idp && !isFetching) {
      setEditedIdp({ ...idp });
    }
  }, [idp, isFetching]);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as string);
    if (tabIndex === "settings") {
      navigate("/" + pathname + "/" + encodeURIComponent(decodedLocalId));
    }
  };

  React.useEffect(() => {
    const currentPath: BreadCrumbItem[] = [
      {
        name: "SAML2 Upstream IdPs",
        url: "/" + pathname,
      },
      {
        name: decodedLocalId,
        url: "/" + pathname + "/" + encodeURIComponent(decodedLocalId),
        isActive: true,
      },
    ];
    setBreadcrumbItems(currentPath);
    setActiveTabKey(section || "settings");
  }, [decodedLocalId, section]);

  // Detect modifications
  const isModified = React.useMemo(() => {
    return JSON.stringify(editedIdp) !== JSON.stringify(idp);
  }, [editedIdp, idp]);

  // Field change helpers
  const updateField = <K extends keyof AhdapaSaml2Idp>(
    field: K,
    value: AhdapaSaml2Idp[K]
  ) => {
    if (editedIdp) {
      setEditedIdp({ ...editedIdp, [field]: value });
    }
  };

  const updateArrayField = (field: keyof AhdapaSaml2Idp, value: string) => {
    const arr = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (editedIdp) {
      setEditedIdp({ ...editedIdp, [field]: arr });
    }
  };

  // Revert
  const onRevert = () => {
    if (idp) {
      setEditedIdp({ ...idp });
    }
    refetch();
    dispatch(
      addAlert({
        name: "revert-saml2-idp-success",
        title: "SAML2 IdP settings reverted",
        variant: "success",
      })
    );
  };

  // Save
  const [isSaving, setIsSaving] = React.useState(false);

  const onSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editedIdp) return;
    setIsSaving(true);

    try {
      await updateIdp({
        localId: decodedLocalId,
        body: {
          sso_url: editedIdp.sso_url,
          slo_url: editedIdp.slo_url,
          name_id_format: editedIdp.name_id_format,
          preferred_binding: editedIdp.preferred_binding,
          default_groups: editedIdp.default_groups,
        },
      }).unwrap();
      dispatch(
        addAlert({
          name: "save-saml2-idp-success",
          title: `SAML2 IdP '${decodedLocalId}' updated`,
          variant: "success",
        })
      );
      refetch();
    } catch {
      dispatch(
        addAlert({
          name: "save-saml2-idp-error",
          title: "Failed to update SAML2 IdP",
          variant: "danger",
        })
      );
    }
    setIsSaving(false);
  };

  // Delete
  const onDelete = async () => {
    try {
      await deleteIdp(decodedLocalId).unwrap();
      dispatch(
        addAlert({
          name: "delete-saml2-idp-success",
          title: `SAML2 IdP '${decodedLocalId}' deleted`,
          variant: "success",
        })
      );
      navigate("/" + pathname);
    } catch {
      dispatch(
        addAlert({
          name: "delete-saml2-idp-error",
          title: "Failed to delete SAML2 IdP",
          variant: "danger",
        })
      );
    }
  };

  // Toolbar buttons
  const toolbarFields: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <Button
          variant="secondary"
          data-cy="ahdapa-saml2-idp-settings-button-refresh"
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      ),
    },
    {
      key: 1,
      element: (
        <Button
          variant="secondary"
          data-cy="ahdapa-saml2-idp-settings-button-revert"
          isDisabled={!isModified || isSaving}
          onClick={onRevert}
        >
          Revert
        </Button>
      ),
    },
    {
      key: 2,
      element: (
        <Button
          variant="secondary"
          data-cy="ahdapa-saml2-idp-settings-button-delete"
          isDanger
          onClick={onDelete}
        >
          Delete
        </Button>
      ),
    },
    {
      key: 3,
      element: (
        <Button
          variant="primary"
          data-cy="ahdapa-saml2-idp-settings-button-save"
          isDisabled={!isModified || isSaving}
          type="submit"
          form="ahdapa-saml2-idp-settings-form"
        >
          Save
        </Button>
      ),
    },
  ];

  // Certificate columns
  const certColumns = ["Subject", "Issuer", "Not After"] as const;

  if (isLoading || (isFetching && !idp)) {
    return <DataSpinner />;
  }

  if (!isLoading && (isError || !idp)) {
    return <NotFound />;
  }

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb breadcrumbItems={breadcrumbItems} />
        <TitleLayout
          id={decodedLocalId}
          preText="SAML2 IdP:"
          text={decodedLocalId}
          headingLevel="h1"
        />
      </PageSection>
      <PageSection hasBodyWrapper={false} type="tabs" isFilled>
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          variant="secondary"
          isBox
          className="pf-v6-u-ml-lg"
          mountOnEnter
          unmountOnExit
        >
          <Tab
            eventKey={"settings"}
            name="settings-details"
            title={<TabTitleText>Settings</TabTitleText>}
          >
            {editedIdp && (
              <TabLayout
                id="ahdapa-saml2-idp-settings-page"
                toolbarItems={toolbarFields}
              >
                <Form
                  className="pf-v6-u-mb-lg"
                  id="ahdapa-saml2-idp-settings-form"
                  onSubmit={onSave}
                >
                  <TitleLayout
                    id="idp-identity"
                    text="Identity Provider"
                    headingLevel="h2"
                    className="pf-v6-u-mt-lg pf-v6-u-mb-md"
                  />
                  <Flex direction={{ default: "column", lg: "row" }}>
                    <FlexItem flex={{ default: "flex_1" }}>
                      <FormGroup label="Entity ID" fieldId="entity_id">
                        <TextInput
                          id="entity_id"
                          data-cy="ahdapa-saml2-idp-settings-entity-id"
                          value={editedIdp.entity_id}
                          isDisabled
                          aria-label="Entity ID"
                        />
                      </FormGroup>
                      <FormGroup label="Local ID" fieldId="local_id">
                        <TextInput
                          id="local_id"
                          data-cy="ahdapa-saml2-idp-settings-local-id"
                          value={editedIdp.local_id}
                          isDisabled
                          aria-label="Local ID"
                        />
                      </FormGroup>
                      <FormGroup label="SSO URL" fieldId="sso_url" isRequired>
                        <TextInput
                          id="sso_url"
                          data-cy="ahdapa-saml2-idp-settings-sso-url"
                          value={editedIdp.sso_url}
                          onChange={(_event, value) =>
                            updateField("sso_url", value)
                          }
                          aria-label="SSO URL"
                        />
                      </FormGroup>
                      <FormGroup label="SLO URL" fieldId="slo_url">
                        <TextInput
                          id="slo_url"
                          data-cy="ahdapa-saml2-idp-settings-slo-url"
                          value={editedIdp.slo_url || ""}
                          onChange={(_event, value) =>
                            updateField("slo_url", value || undefined)
                          }
                          aria-label="SLO URL"
                        />
                      </FormGroup>
                      <FormGroup
                        label="Name ID Format"
                        fieldId="name_id_format"
                      >
                        <TextInput
                          id="name_id_format"
                          data-cy="ahdapa-saml2-idp-settings-name-id-format"
                          value={editedIdp.name_id_format || ""}
                          onChange={(_event, value) =>
                            updateField("name_id_format", value || undefined)
                          }
                          aria-label="Name ID Format"
                        />
                      </FormGroup>
                      <FormGroup
                        label="Preferred Binding"
                        fieldId="preferred_binding"
                      >
                        <TextInput
                          id="preferred_binding"
                          data-cy="ahdapa-saml2-idp-settings-preferred-binding"
                          value={editedIdp.preferred_binding}
                          onChange={(_event, value) =>
                            updateField("preferred_binding", value)
                          }
                          aria-label="Preferred Binding"
                        />
                      </FormGroup>
                      <FormGroup
                        label="Default Groups (comma-separated)"
                        fieldId="default_groups"
                      >
                        <TextInput
                          id="default_groups"
                          data-cy="ahdapa-saml2-idp-settings-default-groups"
                          value={editedIdp.default_groups.join(", ")}
                          onChange={(_event, value) =>
                            updateArrayField("default_groups", value)
                          }
                          aria-label="Default Groups"
                        />
                      </FormGroup>
                    </FlexItem>
                  </Flex>

                  {/* Certificates table */}
                  {idp!.certificates.length > 0 && (
                    <>
                      <TitleLayout
                        id="idp-certificates"
                        text="Certificates"
                        headingLevel="h2"
                        className="pf-v6-u-mt-lg pf-v6-u-mb-md"
                      />
                      <DescriptionList isHorizontal isCompact>
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            Certificate Count
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            {idp!.certificate_count}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      </DescriptionList>
                      <Table
                        aria-label="IdP Certificates"
                        variant="compact"
                        className="pf-v6-u-mt-md"
                      >
                        <Thead>
                          <Tr>
                            {certColumns.map((col) => (
                              <Th key={col}>{col}</Th>
                            ))}
                          </Tr>
                        </Thead>
                        <Tbody>
                          {idp!.certificates.map(
                            (cert: AhdapaCertificateInfo, idx: number) => (
                              <Tr key={idx}>
                                <Td dataLabel={certColumns[0]}>
                                  {cert.subject}
                                </Td>
                                <Td dataLabel={certColumns[1]}>
                                  {cert.issuer}
                                </Td>
                                <Td dataLabel={certColumns[2]}>
                                  {cert.not_after}
                                </Td>
                              </Tr>
                            )
                          )}
                        </Tbody>
                      </Table>
                    </>
                  )}
                </Form>
              </TabLayout>
            )}
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default AhdapaSaml2IdpsTabs;
