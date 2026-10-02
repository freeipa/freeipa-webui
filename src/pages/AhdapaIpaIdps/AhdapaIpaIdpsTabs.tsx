import React from "react";
// PatternFly
import {
  Button,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  PageSection,
  Tabs,
  Tab,
  TabTitleText,
  TextInput,
} from "@patternfly/react-core";
// React Router
import { useNavigate, useParams } from "react-router";
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
// RPC
import {
  useGetAhdapaIpaIdpQuery,
  useUpdateAhdapaIpaIdpOverridesMutation,
} from "src/services/rpcAhdapaFederation";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { addAlert } from "src/store/Global/alerts-slice";

const AhdapaIpaIdpsTabs = ({ section }: { section?: string }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const pathname = "ahdapa-ipa-idps";

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
  } = useGetAhdapaIpaIdpQuery(id || "");

  const [updateOverrides] = useUpdateAhdapaIpaIdpOverridesMutation();

  // Editable override fields
  const [editedAcr, setEditedAcr] = React.useState<string>("");
  const [editedAmr, setEditedAmr] = React.useState<string>("");
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (idp && !isFetching) {
      setEditedAcr(idp.default_acr || "");
      setEditedAmr(idp.default_amr.join(", "));
    }
  }, [idp, isFetching]);

  // Detect modifications (only for override fields)
  const isModified = React.useMemo(() => {
    if (!idp) return false;
    const origAcr = idp.default_acr || "";
    const origAmr = idp.default_amr.join(", ");
    return editedAcr !== origAcr || editedAmr !== origAmr;
  }, [editedAcr, editedAmr, idp]);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as string);
    if (tabIndex === "settings") {
      navigate("/" + pathname + "/" + encodeURIComponent(id || ""));
    }
  };

  React.useEffect(() => {
    const currentPath: BreadCrumbItem[] = [
      {
        name: "IPA Upstream IdPs",
        url: "/" + pathname,
      },
      {
        name: idp?.display_name || id || "",
        url: "/" + pathname + "/" + encodeURIComponent(id || ""),
        isActive: true,
      },
    ];
    setBreadcrumbItems(currentPath);
    setActiveTabKey(section || "settings");
  }, [id, section, idp]);

  // Save overrides
  const onSave = async () => {
    if (!id) return;
    setIsSaving(true);
    try {
      await updateOverrides({
        id,
        body: {
          default_acr: editedAcr.trim() || null,
          default_amr: editedAmr
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
      }).unwrap();
      dispatch(
        addAlert({
          name: "save-ahdapa-ipa-idp-success",
          title: `IPA IdP '${idp?.display_name || id}' overrides updated`,
          variant: "success",
        })
      );
      refetch();
    } catch {
      dispatch(
        addAlert({
          name: "save-ahdapa-ipa-idp-error",
          title: "Failed to update IPA IdP overrides",
          variant: "danger",
        })
      );
    }
    setIsSaving(false);
  };

  // Revert
  const onRevert = () => {
    if (idp) {
      setEditedAcr(idp.default_acr || "");
      setEditedAmr(idp.default_amr.join(", "));
    }
    refetch();
    dispatch(
      addAlert({
        name: "revert-ahdapa-ipa-idp-success",
        title: "IPA IdP override settings reverted",
        variant: "success",
      })
    );
  };

  if (isLoading || (isFetching && !idp)) {
    return <DataSpinner />;
  }

  if (!isLoading && (isError || !idp)) {
    return <NotFound />;
  }

  // Toolbar buttons
  const toolbarFields: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <Button
          data-cy="ahdapa-ipa-idp-settings-button-refresh"
          variant="secondary"
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
          data-cy="ahdapa-ipa-idp-settings-button-revert"
          variant="secondary"
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
          data-cy="ahdapa-ipa-idp-settings-button-save"
          variant="primary"
          isDisabled={!isModified || isSaving}
          onClick={onSave}
          isLoading={isSaving}
        >
          Save
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb breadcrumbItems={breadcrumbItems} />
        <TitleLayout
          id={id || ""}
          preText="IPA IdP:"
          text={idp?.display_name || id || ""}
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
            <TabLayout
              id="ahdapa-ipa-idp-settings-page"
              toolbarItems={toolbarFields}
            >
              <Form className="pf-v6-u-mb-lg">
                {/* IPA-sourced fields (read-only) */}
                <TitleLayout
                  id="idp-identity"
                  text="IdP Identity (from IPA)"
                  headingLevel="h2"
                  className="pf-v6-u-mt-lg pf-v6-u-mb-md"
                />
                <Flex direction={{ default: "column", lg: "row" }}>
                  <FlexItem flex={{ default: "flex_1" }}>
                    <FormGroup label="ID" fieldId="idp_id">
                      <TextInput
                        id="idp_id"
                        data-cy="ahdapa-ipa-idp-settings-id"
                        value={idp.id}
                        isDisabled
                        aria-label="IdP ID"
                      />
                    </FormGroup>
                    <FormGroup label="Display Name" fieldId="display_name">
                      <TextInput
                        id="display_name"
                        data-cy="ahdapa-ipa-idp-settings-display-name"
                        value={idp.display_name}
                        isDisabled
                        aria-label="Display name"
                      />
                    </FormGroup>
                    <FormGroup label="Issuer" fieldId="issuer">
                      <TextInput
                        id="issuer"
                        data-cy="ahdapa-ipa-idp-settings-issuer"
                        value={idp.issuer}
                        isDisabled
                        aria-label="Issuer"
                      />
                    </FormGroup>
                    <FormGroup label="Client ID" fieldId="client_id">
                      <TextInput
                        id="client_id"
                        data-cy="ahdapa-ipa-idp-settings-client-id"
                        value={idp.client_id}
                        isDisabled
                        aria-label="Client ID"
                      />
                    </FormGroup>
                    <FormGroup label="Scopes" fieldId="scopes">
                      <TextInput
                        id="scopes"
                        data-cy="ahdapa-ipa-idp-settings-scopes"
                        value={idp.scopes.join(", ")}
                        isDisabled
                        aria-label="Scopes"
                      />
                    </FormGroup>
                    <FormGroup label="Callback Path" fieldId="callback_path">
                      <TextInput
                        id="callback_path"
                        data-cy="ahdapa-ipa-idp-settings-callback-path"
                        value={idp.callback_path}
                        isDisabled
                        aria-label="Callback path"
                      />
                    </FormGroup>
                    <FormGroup label="Source" fieldId="source">
                      <TextInput
                        id="source"
                        data-cy="ahdapa-ipa-idp-settings-source"
                        value={idp.source}
                        isDisabled
                        aria-label="Source"
                      />
                    </FormGroup>
                  </FlexItem>
                </Flex>

                {/* Ahdapa override fields (editable) */}
                <TitleLayout
                  id="idp-overrides"
                  text="Ahdapa Overrides"
                  headingLevel="h2"
                  className="pf-v6-u-mt-lg pf-v6-u-mb-md"
                />
                <Flex direction={{ default: "column", lg: "row" }}>
                  <FlexItem flex={{ default: "flex_1" }}>
                    <FormGroup
                      label="Default ACR (override)"
                      fieldId="default_acr"
                    >
                      <TextInput
                        id="default_acr"
                        data-cy="ahdapa-ipa-idp-settings-default-acr"
                        value={editedAcr}
                        onChange={(_event, value) => setEditedAcr(value)}
                        aria-label="Default ACR"
                      />
                    </FormGroup>
                    <FormGroup
                      label="Default AMR (comma-separated)"
                      fieldId="default_amr"
                    >
                      <TextInput
                        id="default_amr"
                        data-cy="ahdapa-ipa-idp-settings-default-amr"
                        value={editedAmr}
                        onChange={(_event, value) => setEditedAmr(value)}
                        aria-label="Default AMR"
                      />
                    </FormGroup>
                  </FlexItem>
                </Flex>
              </Form>
            </TabLayout>
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default AhdapaIpaIdpsTabs;
