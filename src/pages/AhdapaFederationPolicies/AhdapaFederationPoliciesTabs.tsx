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
  useGetAhdapaFederationPolicyQuery,
  useUpdateAhdapaFederationPolicyMutation,
} from "src/services/rpcAhdapaFederation";
// Data types
import { AhdapaFederationPolicy } from "src/utils/datatypes/ahdapaDataTypes";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { addAlert } from "src/store/Global/alerts-slice";

const AhdapaFederationPoliciesTabs = ({ section }: { section?: string }) => {
  const { key } = useParams<{ key: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const pathname = "ahdapa-federation-policies";

  useUpdateRoute({ pathname });

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  const [activeTabKey, setActiveTabKey] = React.useState(section || "settings");

  const {
    data: policy,
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useGetAhdapaFederationPolicyQuery(key || "");

  const [updatePolicy] = useUpdateAhdapaFederationPolicyMutation();

  // Editable copy
  const [editedPolicy, setEditedPolicy] = React.useState<
    AhdapaFederationPolicy | undefined
  >(policy);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (policy && !isFetching) {
      setEditedPolicy({ ...policy });
    }
  }, [policy, isFetching]);

  // Detect modifications
  const isModified = React.useMemo(() => {
    if (!editedPolicy || !policy) return false;
    return JSON.stringify(editedPolicy) !== JSON.stringify(policy);
  }, [editedPolicy, policy]);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as string);
    if (tabIndex === "settings") {
      navigate("/" + pathname + "/" + encodeURIComponent(key || ""));
    }
  };

  React.useEffect(() => {
    const currentPath: BreadCrumbItem[] = [
      {
        name: "Federation Policies",
        url: "/" + pathname,
      },
      {
        name: key || "",
        url: "/" + pathname + "/" + encodeURIComponent(key || ""),
        isActive: true,
      },
    ];
    setBreadcrumbItems(currentPath);
    setActiveTabKey(section || "settings");
  }, [key, section]);

  // Save
  const onSave = async () => {
    if (!editedPolicy || !key) return;
    setIsSaving(true);
    try {
      await updatePolicy({
        key,
        body: {
          upstream_iss: editedPolicy.upstream_iss,
          subject_pattern: editedPolicy.subject_pattern,
          local_sub: editedPolicy.local_sub,
          scopes: editedPolicy.scopes,
          priority: editedPolicy.priority,
        },
      }).unwrap();
      dispatch(
        addAlert({
          name: "save-ahdapa-fedpol-success",
          title: `Federation policy '${key}' updated`,
          variant: "success",
        })
      );
      refetch();
    } catch {
      dispatch(
        addAlert({
          name: "save-ahdapa-fedpol-error",
          title: "Failed to update federation policy",
          variant: "danger",
        })
      );
    }
    setIsSaving(false);
  };

  // Revert
  const onRevert = () => {
    if (policy) {
      setEditedPolicy({ ...policy });
    }
    refetch();
    dispatch(
      addAlert({
        name: "revert-ahdapa-fedpol-success",
        title: "Federation policy settings reverted",
        variant: "success",
      })
    );
  };

  if (isLoading || (isFetching && !policy)) {
    return <DataSpinner />;
  }

  if (!isLoading && (isError || !policy)) {
    return <NotFound />;
  }

  // Toolbar buttons
  const toolbarFields: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <Button
          data-cy="ahdapa-fedpol-settings-button-refresh"
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
          data-cy="ahdapa-fedpol-settings-button-revert"
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
          data-cy="ahdapa-fedpol-settings-button-save"
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
          id={key || ""}
          preText="Federation Policy:"
          text={key || ""}
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
            {editedPolicy && (
              <TabLayout
                id="ahdapa-fedpol-settings-page"
                toolbarItems={toolbarFields}
              >
                <Form className="pf-v6-u-mb-lg">
                  <TitleLayout
                    id="policy-settings"
                    text="Policy Settings"
                    headingLevel="h2"
                    className="pf-v6-u-mt-lg pf-v6-u-mb-md"
                  />
                  <Flex direction={{ default: "column", lg: "row" }}>
                    <FlexItem flex={{ default: "flex_1" }}>
                      <FormGroup label="Key" fieldId="policy_key">
                        <TextInput
                          id="policy_key"
                          data-cy="ahdapa-fedpol-settings-key"
                          value={editedPolicy.key}
                          isDisabled
                          aria-label="Policy key"
                        />
                      </FormGroup>
                      <FormGroup
                        label="Upstream Issuer"
                        fieldId="upstream_iss"
                        isRequired
                      >
                        <TextInput
                          id="upstream_iss"
                          data-cy="ahdapa-fedpol-settings-upstream-iss"
                          value={editedPolicy.upstream_iss}
                          onChange={(_event, value) =>
                            setEditedPolicy({
                              ...editedPolicy,
                              upstream_iss: value,
                            })
                          }
                          aria-label="Upstream issuer"
                        />
                      </FormGroup>
                      <FormGroup
                        label="Subject Pattern"
                        fieldId="subject_pattern"
                        isRequired
                      >
                        <TextInput
                          id="subject_pattern"
                          data-cy="ahdapa-fedpol-settings-subject-pattern"
                          value={editedPolicy.subject_pattern}
                          onChange={(_event, value) =>
                            setEditedPolicy({
                              ...editedPolicy,
                              subject_pattern: value,
                            })
                          }
                          aria-label="Subject pattern"
                        />
                      </FormGroup>
                      <FormGroup
                        label="Local Subject"
                        fieldId="local_sub"
                        isRequired
                      >
                        <TextInput
                          id="local_sub"
                          data-cy="ahdapa-fedpol-settings-local-sub"
                          value={editedPolicy.local_sub}
                          onChange={(_event, value) =>
                            setEditedPolicy({
                              ...editedPolicy,
                              local_sub: value,
                            })
                          }
                          aria-label="Local subject"
                        />
                      </FormGroup>
                      <FormGroup
                        label="Scopes (comma-separated)"
                        fieldId="scopes"
                      >
                        <TextInput
                          id="scopes"
                          data-cy="ahdapa-fedpol-settings-scopes"
                          value={(editedPolicy.scopes || []).join(", ")}
                          onChange={(_event, value) =>
                            setEditedPolicy({
                              ...editedPolicy,
                              scopes: value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                          aria-label="Scopes"
                        />
                      </FormGroup>
                      <FormGroup label="Priority" fieldId="priority">
                        <TextInput
                          id="priority"
                          data-cy="ahdapa-fedpol-settings-priority"
                          type="number"
                          value={String(editedPolicy.priority)}
                          onChange={(_event, value) =>
                            setEditedPolicy({
                              ...editedPolicy,
                              priority: parseInt(value, 10) || 0,
                            })
                          }
                          aria-label="Priority"
                        />
                      </FormGroup>
                    </FlexItem>
                  </Flex>
                </Form>
              </TabLayout>
            )}
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default AhdapaFederationPoliciesTabs;
