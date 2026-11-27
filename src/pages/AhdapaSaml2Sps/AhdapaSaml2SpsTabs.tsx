import React from "react";
// PatternFly
import {
  Button,
  Checkbox,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextArea,
  TextInput,
  PageSection,
  Tabs,
  Tab,
  TabTitleText,
} from "@patternfly/react-core";
// React Router
import { useNavigate, useParams } from "react-router";
// Data types
import { AhdapaSaml2Sp } from "src/utils/datatypes/ahdapaDataTypes";
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
  useGetAhdapaSaml2SpQuery,
  useUpdateAhdapaSaml2SpMutation,
  useDeleteAhdapaSaml2SpMutation,
} from "src/services/rpcAhdapaSaml";

const AhdapaSaml2SpsTabs = ({ section }: { section?: string }) => {
  const { entityId } = useParams<{ entityId: string }>();
  const decodedEntityId = entityId ? decodeURIComponent(entityId) : "";
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const pathname = "ahdapa-saml2-sps";

  useUpdateRoute({ pathname });

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  const [activeTabKey, setActiveTabKey] = React.useState(section || "settings");

  const {
    data: sp,
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useGetAhdapaSaml2SpQuery(decodedEntityId);

  const [updateSp] = useUpdateAhdapaSaml2SpMutation();
  const [deleteSp] = useDeleteAhdapaSaml2SpMutation();

  // Editable copy
  const [editedSp, setEditedSp] = React.useState<AhdapaSaml2Sp | undefined>(sp);

  React.useEffect(() => {
    if (sp && !isFetching) {
      setEditedSp({ ...sp });
    }
  }, [sp, isFetching]);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as string);
    if (tabIndex === "settings") {
      navigate("/" + pathname + "/" + encodeURIComponent(decodedEntityId));
    }
  };

  React.useEffect(() => {
    const currentPath: BreadCrumbItem[] = [
      {
        name: "SAML2 Service Providers",
        url: "/" + pathname,
      },
      {
        name: decodedEntityId,
        url: "/" + pathname + "/" + encodeURIComponent(decodedEntityId),
        isActive: true,
      },
    ];
    setBreadcrumbItems(currentPath);
    setActiveTabKey(section || "settings");
  }, [decodedEntityId, section]);

  // Detect modifications
  const isModified = React.useMemo(() => {
    return JSON.stringify(editedSp) !== JSON.stringify(sp);
  }, [editedSp, sp]);

  // Field change helpers
  const updateField = <K extends keyof AhdapaSaml2Sp>(
    field: K,
    value: AhdapaSaml2Sp[K]
  ) => {
    if (editedSp) {
      setEditedSp({ ...editedSp, [field]: value });
    }
  };

  // Revert
  const onRevert = () => {
    if (sp) {
      setEditedSp({ ...sp });
    }
    refetch();
    dispatch(
      addAlert({
        name: "revert-saml2-sp-success",
        title: "SAML2 SP settings reverted",
        variant: "success",
      })
    );
  };

  // Save
  const [isSaving, setIsSaving] = React.useState(false);

  const onSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editedSp) return;
    setIsSaving(true);

    try {
      await updateSp({
        entityId: decodedEntityId,
        body: {
          acs_urls: editedSp.acs_urls,
          slo_url: editedSp.slo_url,
          name_id_format: editedSp.name_id_format,
          want_assertions_signed: editedSp.want_assertions_signed,
        },
      }).unwrap();
      dispatch(
        addAlert({
          name: "save-saml2-sp-success",
          title: `SAML2 SP '${decodedEntityId}' updated`,
          variant: "success",
        })
      );
      refetch();
    } catch {
      dispatch(
        addAlert({
          name: "save-saml2-sp-error",
          title: "Failed to update SAML2 SP",
          variant: "danger",
        })
      );
    }
    setIsSaving(false);
  };

  // Delete
  const onDelete = async () => {
    try {
      await deleteSp(decodedEntityId).unwrap();
      dispatch(
        addAlert({
          name: "delete-saml2-sp-success",
          title: `SAML2 SP '${decodedEntityId}' deleted`,
          variant: "success",
        })
      );
      navigate("/" + pathname);
    } catch {
      dispatch(
        addAlert({
          name: "delete-saml2-sp-error",
          title: "Failed to delete SAML2 SP",
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
          data-cy="ahdapa-saml2-sp-settings-button-refresh"
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
          data-cy="ahdapa-saml2-sp-settings-button-revert"
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
          data-cy="ahdapa-saml2-sp-settings-button-delete"
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
          data-cy="ahdapa-saml2-sp-settings-button-save"
          isDisabled={!isModified || isSaving}
          type="submit"
          form="ahdapa-saml2-sp-settings-form"
        >
          Save
        </Button>
      ),
    },
  ];

  if (isLoading || (isFetching && !sp)) {
    return <DataSpinner />;
  }

  if (!isLoading && (isError || !sp)) {
    return <NotFound />;
  }

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb breadcrumbItems={breadcrumbItems} />
        <TitleLayout
          id={decodedEntityId}
          preText="SAML2 SP:"
          text={decodedEntityId}
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
            {editedSp && (
              <TabLayout
                id="ahdapa-saml2-sp-settings-page"
                toolbarItems={toolbarFields}
              >
                <Form
                  className="pf-v6-u-mb-lg"
                  id="ahdapa-saml2-sp-settings-form"
                  onSubmit={onSave}
                >
                  <TitleLayout
                    id="sp-identity"
                    text="Service Provider Identity"
                    headingLevel="h2"
                    className="pf-v6-u-mt-lg pf-v6-u-mb-md"
                  />
                  <Flex direction={{ default: "column", lg: "row" }}>
                    <FlexItem flex={{ default: "flex_1" }}>
                      <FormGroup label="Entity ID" fieldId="entity_id">
                        <TextInput
                          id="entity_id"
                          data-cy="ahdapa-saml2-sp-settings-entity-id"
                          value={editedSp.entity_id}
                          isDisabled
                          aria-label="Entity ID"
                        />
                      </FormGroup>
                      <FormGroup
                        label="ACS URLs (one per line)"
                        fieldId="acs_urls"
                        isRequired
                      >
                        <TextArea
                          id="acs_urls"
                          data-cy="ahdapa-saml2-sp-settings-acs-urls"
                          value={editedSp.acs_urls.join("\n")}
                          onChange={(_event, value) =>
                            updateField(
                              "acs_urls",
                              value
                                .split("\n")
                                .map((s) => s.trim())
                                .filter(Boolean)
                            )
                          }
                          rows={3}
                          aria-label="ACS URLs"
                        />
                      </FormGroup>
                      <FormGroup label="SLO URL" fieldId="slo_url">
                        <TextInput
                          id="slo_url"
                          data-cy="ahdapa-saml2-sp-settings-slo-url"
                          value={editedSp.slo_url || ""}
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
                          data-cy="ahdapa-saml2-sp-settings-name-id-format"
                          value={editedSp.name_id_format || ""}
                          onChange={(_event, value) =>
                            updateField("name_id_format", value || undefined)
                          }
                          aria-label="Name ID Format"
                        />
                      </FormGroup>
                      <FormGroup fieldId="want_assertions_signed">
                        <Checkbox
                          id="want_assertions_signed"
                          data-cy="ahdapa-saml2-sp-settings-want-signed"
                          label="Want assertions signed"
                          isChecked={editedSp.want_assertions_signed}
                          onChange={(_event, checked) =>
                            updateField("want_assertions_signed", checked)
                          }
                        />
                      </FormGroup>
                    </FlexItem>
                  </Flex>

                  {/* Certificate info (read-only) */}
                  {sp!.has_certificate && sp!.certificate && (
                    <>
                      <TitleLayout
                        id="sp-certificate"
                        text="Certificate"
                        headingLevel="h2"
                        className="pf-v6-u-mt-lg pf-v6-u-mb-md"
                      />
                      <DescriptionList isHorizontal isCompact>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Subject</DescriptionListTerm>
                          <DescriptionListDescription>
                            {sp!.certificate.subject}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Issuer</DescriptionListTerm>
                          <DescriptionListDescription>
                            {sp!.certificate.issuer}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Not Before</DescriptionListTerm>
                          <DescriptionListDescription>
                            {sp!.certificate.not_before}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Not After</DescriptionListTerm>
                          <DescriptionListDescription>
                            {sp!.certificate.not_after}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Algorithm</DescriptionListTerm>
                          <DescriptionListDescription>
                            {sp!.certificate.algorithm}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            SHA-256 Fingerprint
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            <code>{sp!.certificate.fingerprint_sha256}</code>
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      </DescriptionList>
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

export default AhdapaSaml2SpsTabs;
