import React from "react";
// PatternFly
import {
  Button,
  Checkbox,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Label,
  LabelGroup,
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
  useGetAhdapaHBACRuleQuery,
  usePatchAhdapaHBACRuleMutation,
} from "src/services/rpcAhdapaHbac";
// Data types
import { AhdapaHBACRuleDetail } from "src/utils/datatypes/ahdapaDataTypes";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { addAlert } from "src/store/Global/alerts-slice";

// Membership list display component
interface MembershipListProps {
  label: string;
  items: string[];
  categoryEnabled: boolean;
  categoryLabel: string;
}

const MembershipList = (props: MembershipListProps) => (
  <FormGroup label={props.label} fieldId={props.label.toLowerCase()}>
    {props.categoryEnabled ? (
      <Label>All (category)</Label>
    ) : props.items.length > 0 ? (
      <LabelGroup>
        {props.items.map((item) => (
          <Label key={item}>{item}</Label>
        ))}
      </LabelGroup>
    ) : (
      <span
        style={{
          color: "var(--pf-t--global--color--nonstatus--gray--default)",
        }}
      >
        None
      </span>
    )}
  </FormGroup>
);

const AhdapaHbacTabs = ({ section }: { section?: string }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const pathname = "ahdapa-hbac";

  useUpdateRoute({ pathname });

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  const [activeTabKey, setActiveTabKey] = React.useState(section || "settings");

  const {
    data: rule,
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useGetAhdapaHBACRuleQuery(id || "");

  const [patchRule] = usePatchAhdapaHBACRuleMutation();

  // Editable copy for settings form
  const [editedRule, setEditedRule] = React.useState<
    AhdapaHBACRuleDetail | undefined
  >(rule);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (rule && !isFetching) {
      setEditedRule({ ...rule });
    }
  }, [rule, isFetching]);

  // Detect modifications
  const isModified = React.useMemo(() => {
    if (!editedRule || !rule) return false;
    return (
      editedRule.name !== rule.name ||
      editedRule.description !== rule.description ||
      editedRule.enabled !== rule.enabled
    );
  }, [editedRule, rule]);

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
        name: "Identity HBAC Rules",
        url: "/" + pathname,
      },
      {
        name: rule?.name || id || "",
        url: "/" + pathname + "/" + encodeURIComponent(id || ""),
        isActive: true,
      },
    ];
    setBreadcrumbItems(currentPath);
    setActiveTabKey(section || "settings");
  }, [id, section, rule]);

  // Save general fields
  const onSave = async () => {
    if (!editedRule || !id) return;
    setIsSaving(true);
    try {
      await patchRule({
        id,
        body: {
          name: editedRule.name,
          description: editedRule.description,
          enabled: editedRule.enabled,
        },
      }).unwrap();
      dispatch(
        addAlert({
          name: "save-ahdapa-hbac-success",
          title: `HBAC rule '${editedRule.name}' updated`,
          variant: "success",
        })
      );
      refetch();
    } catch {
      dispatch(
        addAlert({
          name: "save-ahdapa-hbac-error",
          title: "Failed to update HBAC rule",
          variant: "danger",
        })
      );
    }
    setIsSaving(false);
  };

  // Revert
  const onRevert = () => {
    if (rule) {
      setEditedRule({ ...rule });
    }
    refetch();
    dispatch(
      addAlert({
        name: "revert-ahdapa-hbac-success",
        title: "HBAC rule settings reverted",
        variant: "success",
      })
    );
  };

  // Enable/Disable toggle
  const onToggleEnabled = async (checked: boolean) => {
    if (!id) return;
    try {
      await patchRule({
        id,
        body: { enabled: checked },
      }).unwrap();
      dispatch(
        addAlert({
          name: "toggle-ahdapa-hbac-success",
          title: `HBAC rule ${checked ? "enabled" : "disabled"}`,
          variant: "success",
        })
      );
      refetch();
    } catch {
      dispatch(
        addAlert({
          name: "toggle-ahdapa-hbac-error",
          title: `Failed to ${checked ? "enable" : "disable"} HBAC rule`,
          variant: "danger",
        })
      );
    }
  };

  if (isLoading || (isFetching && !rule)) {
    return <DataSpinner />;
  }

  if (!isLoading && (isError || !rule)) {
    return <NotFound />;
  }

  // Toolbar buttons for settings tab
  const toolbarFields: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <Button
          data-cy="ahdapa-hbac-settings-button-refresh"
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
          data-cy="ahdapa-hbac-settings-button-revert"
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
          data-cy="ahdapa-hbac-settings-button-save"
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
          preText="HBAC Rule:"
          text={rule?.name || id || ""}
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
            {editedRule && (
              <TabLayout
                id="ahdapa-hbac-settings-page"
                toolbarItems={toolbarFields}
              >
                <Form className="pf-v6-u-mb-lg">
                  {/* General fields */}
                  <TitleLayout
                    id="general-settings"
                    text="General"
                    headingLevel="h2"
                    className="pf-v6-u-mt-lg pf-v6-u-mb-md"
                  />
                  <Flex direction={{ default: "column", lg: "row" }}>
                    <FlexItem flex={{ default: "flex_1" }}>
                      <FormGroup label="Rule ID" fieldId="rule_id">
                        <TextInput
                          id="rule_id"
                          data-cy="ahdapa-hbac-settings-rule-id"
                          value={editedRule.id}
                          isDisabled
                          aria-label="Rule ID"
                        />
                      </FormGroup>
                      <FormGroup label="Name" fieldId="rule_name" isRequired>
                        <TextInput
                          id="rule_name"
                          data-cy="ahdapa-hbac-settings-name"
                          value={editedRule.name}
                          onChange={(_event, value) =>
                            setEditedRule({ ...editedRule, name: value })
                          }
                          aria-label="Rule name"
                        />
                      </FormGroup>
                      <FormGroup label="Description" fieldId="rule_description">
                        <TextInput
                          id="rule_description"
                          data-cy="ahdapa-hbac-settings-description"
                          value={editedRule.description}
                          onChange={(_event, value) =>
                            setEditedRule({
                              ...editedRule,
                              description: value,
                            })
                          }
                          aria-label="Rule description"
                        />
                      </FormGroup>
                      <FormGroup label="Enabled" fieldId="rule_enabled">
                        <Checkbox
                          id="rule_enabled"
                          data-cy="ahdapa-hbac-settings-enabled"
                          label={editedRule.enabled ? "Enabled" : "Disabled"}
                          isChecked={editedRule.enabled}
                          onChange={(_event, checked) => {
                            setEditedRule({
                              ...editedRule,
                              enabled: checked,
                            });
                            onToggleEnabled(checked);
                          }}
                        />
                      </FormGroup>
                      <FormGroup label="MFA Bypass" fieldId="mfa_bypass">
                        <TextInput
                          id="mfa_bypass"
                          data-cy="ahdapa-hbac-settings-mfa-bypass"
                          value={editedRule.mfa_bypass ? "Yes" : "No"}
                          isDisabled
                          aria-label="MFA Bypass"
                        />
                      </FormGroup>
                      <FormGroup label="Required ACR" fieldId="required_acr">
                        <TextInput
                          id="required_acr"
                          data-cy="ahdapa-hbac-settings-required-acr"
                          value={editedRule.required_acr || "None"}
                          isDisabled
                          aria-label="Required ACR"
                        />
                      </FormGroup>
                    </FlexItem>
                  </Flex>

                  {/* Membership lists */}
                  <TitleLayout
                    id="membership-settings"
                    text="Membership"
                    headingLevel="h2"
                    className="pf-v6-u-mt-lg pf-v6-u-mb-md"
                  />
                  <Flex direction={{ default: "column", lg: "row" }}>
                    <FlexItem flex={{ default: "flex_1" }}>
                      <MembershipList
                        label="Users"
                        items={rule.users}
                        categoryEnabled={rule.user_category}
                        categoryLabel="All users"
                      />
                      <MembershipList
                        label="User Groups"
                        items={rule.user_groups}
                        categoryEnabled={rule.user_category}
                        categoryLabel="All user groups"
                      />
                      <MembershipList
                        label="Hosts"
                        items={rule.hosts}
                        categoryEnabled={rule.host_category}
                        categoryLabel="All hosts"
                      />
                      <MembershipList
                        label="Host Groups"
                        items={rule.host_groups}
                        categoryEnabled={rule.host_category}
                        categoryLabel="All host groups"
                      />
                      <MembershipList
                        label="Services"
                        items={rule.services}
                        categoryEnabled={rule.service_category}
                        categoryLabel="All services"
                      />
                      <MembershipList
                        label="Service Groups"
                        items={rule.service_groups}
                        categoryEnabled={rule.service_category}
                        categoryLabel="All service groups"
                      />
                      <MembershipList
                        label="Clients"
                        items={rule.clients}
                        categoryEnabled={rule.client_category}
                        categoryLabel="All clients"
                      />
                      <MembershipList
                        label="Client Groups"
                        items={rule.client_groups}
                        categoryEnabled={rule.client_category}
                        categoryLabel="All client groups"
                      />
                      <MembershipList
                        label="Allowed Scopes"
                        items={rule.allowed_scopes}
                        categoryEnabled={rule.scope_category}
                        categoryLabel="All scopes"
                      />
                      <MembershipList
                        label="Source Networks"
                        items={rule.source_networks}
                        categoryEnabled={rule.network_category}
                        categoryLabel="All networks"
                      />
                      <MembershipList
                        label="Device Groups"
                        items={rule.device_groups}
                        categoryEnabled={rule.device_category}
                        categoryLabel="All device groups"
                      />
                      <MembershipList
                        label="Delegation Targets"
                        items={rule.delegation_targets}
                        categoryEnabled={rule.delegation_target_category}
                        categoryLabel="All delegation targets"
                      />
                      <MembershipList
                        label="Registry Repositories"
                        items={rule.registry_repositories}
                        categoryEnabled={rule.registry_repository_category}
                        categoryLabel="All registry repositories"
                      />
                      <MembershipList
                        label="Registry Actions"
                        items={rule.registry_actions}
                        categoryEnabled={rule.registry_action_category}
                        categoryLabel="All registry actions"
                      />
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

export default AhdapaHbacTabs;
