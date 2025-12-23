import React, { useState } from "react";
// PatternFly
import {
  Flex,
  Form,
  FormGroup,
  JumpLinks,
  JumpLinksItem,
  Label,
  Sidebar,
  SidebarPanel,
  SidebarContent,
  Tab,
  Tabs,
  TabTitleText,
  Content,
  ContentVariants,
  Title,
} from "@patternfly/react-core";
// Forms
import IpaTextArea from "src/components/Form/IpaTextArea";
import IpaCheckbox from "src/components/Form/IpaCheckbox";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import TabLayout from "src/components/layouts/TabLayout";
// Utils
import { asRecord } from "../../utils/hostUtils";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Data types
import { HBACRule, Metadata } from "../../utils/datatypes/globalDataTypes";
import HBACRulesMemberTable from "./HBACRulesMemberTable";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  useSaveAndCleanHbacRuleMutation,
  AllowAllPayload,
} from "src/services/rpcHBACRules";

interface PropsToSettings {
  rule: Partial<HBACRule>;
  originalRule: Partial<HBACRule>;
  metadata: Metadata;
  onRuleChange: (rule: Partial<HBACRule>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<HBACRule>;
  onResetValues: () => void;
}

const HBACRulesSettings = (props: PropsToSettings) => {
  const dispatch = useAppDispatch();

  // API
  const [saveRule] = useSaveAndCleanHbacRuleMutation();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "hbac-rules", noBreadcrumb: true });

  const [cn, setRuleName] = useState<string>("");
  const [memberUsers, setMemberUsers] = useState<string[]>([]);
  const [memberGroups, setMemberGroups] = useState<string[]>([]);
  const [memberHosts, setMemberHosts] = useState<string[]>([]);
  const [memberHostGroups, setMemberHostGroups] = useState<string[]>([]);
  const [memberServices, setMemberServices] = useState<string[]>([]);
  const [memberServiceGroups, setMemberServiceGroups] = useState<string[]>([]);

  React.useEffect(() => {
    // Process the member users and hosts
    setRuleName(props.rule.cn ? props.rule.cn : "");
    if (props.rule.memberuser_user) {
      setMemberUsers(props.rule.memberuser_user);
    }
    if (props.rule.memberuser_group) {
      setMemberGroups(props.rule.memberuser_group);
    }
    if (props.rule.memberhost_host) {
      setMemberHosts(props.rule.memberhost_host);
    }
    if (props.rule.memberhost_hostgroup) {
      setMemberHostGroups(props.rule.memberhost_hostgroup);
    }
    if (props.rule.memberservice_hbacsvc) {
      setMemberServices(props.rule.memberservice_hbacsvc);
    }
    if (props.rule.memberservice_hbacsvcgroup) {
      setMemberServiceGroups(props.rule.memberservice_hbacsvcgroup);
    }
  }, [props.rule]);

  // Tabs
  const [userTabKey, setUserTabKey] = useState(0);
  const [hostTabKey, setHostTabKey] = useState(0);
  const [srvTabKey, setSrvTabKey] = useState(0);

  const handleUserTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setUserTabKey(tabIndex as number);
  };
  const handleHostTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setHostTabKey(tabIndex as number);
  };
  const handleSrvTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setSrvTabKey(tabIndex as number);
  };

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.rule,
    props.onRuleChange
  );

  const [isSaving, setSaving] = useState(false);

  // 'Save' handler method
  const onSave = () => {
    const modifiedValues = props.modifiedValues();
    const payload = {
      groupName: cn,
      users: memberUsers,
      groups: memberGroups,
      hosts: memberHosts,
      hostgroups: memberHostGroups,
      services: memberServices,
      servicegroups: memberServiceGroups,
      modifiedValues,
    } as AllowAllPayload;
    setSaving(true);

    saveRule(payload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Show toast notification: success
          dispatch(
            addAlert({
              name: "save-success",
              title: "HBAC rule modified",
              variant: "success",
            })
          );
          setHostTabKey(0);
          setUserTabKey(0);
          setSrvTabKey(0);
          props.onRefresh();
        } else if (response.data?.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          dispatch(
            addAlert({
              name: "save-error",
              title: errorMessage.message,
              variant: "danger",
            })
          );
          // Reset values. Disable 'revert' and 'save' buttons
          props.onResetValues();
        }
        setSaving(false);
      }
    });
  };

  // 'Revert' handler method
  const onRevert = () => {
    props.onRuleChange(props.originalRule);
    dispatch(
      addAlert({
        name: "revert-success",
        title: "HBAC rule data reverted",
        variant: "success",
      })
    );
  };

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <SecondaryButton
          dataCy="hbac-rules-tab-settings-button-refresh"
          onClickHandler={props.onRefresh}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 1,
      element: (
        <SecondaryButton
          dataCy="hbac-rules-tab-settings-button-revert"
          isDisabled={!props.isModified}
          onClickHandler={onRevert}
        >
          Revert
        </SecondaryButton>
      ),
    },
    {
      key: 2,
      element: (
        <SecondaryButton
          dataCy="hbac-rules-tab-settings-button-save"
          isDisabled={!props.isModified || isSaving}
          onClickHandler={onSave}
          isLoading={isSaving}
          spinnerAriaValueText="Saving"
          spinnerAriaLabelledBy="Saving"
          spinnerAriaLabel="Saving"
        >
          {isSaving ? "Saving" : "Save"}
        </SecondaryButton>
      ),
    },
  ];

  const whoLabel = (
    <Content component={ContentVariants.small}>Allow anyone</Content>
  );
  const whatLabel = (
    <Content component={ContentVariants.small}>Any host</Content>
  );
  const howLabel = (
    <Content component={ContentVariants.small}>Any service</Content>
  );

  // Render component
  return (
    <TabLayout id="settings-page" toolbarItems={toolbarFields}>
      <Sidebar isPanelRight>
        <SidebarPanel variant="sticky">
          <HelpTextWithIconLayout
            textContent="Help"
            icon={
              <OutlinedQuestionCircleIcon className="pf-v6-u-primary-color-100 pf-v6-u-mr-sm" />
            }
          />
          <JumpLinks
            isVertical
            label="Jump to section"
            scrollableSelector="#settings-page"
            expandable={{ default: "expandable", md: "nonExpandable" }}
          >
            <JumpLinksItem key={0} href="#hbacrule-settings">
              Settings
            </JumpLinksItem>
            <JumpLinksItem key={1} href="#usercategory">
              Who the rule applies to
            </JumpLinksItem>
            <JumpLinksItem key={2} href="#hostcategory">
              Gives access to
            </JumpLinksItem>
            <JumpLinksItem key={3} href="#servicecategory">
              Via the following services
            </JumpLinksItem>
          </JumpLinks>
        </SidebarPanel>
        <SidebarContent className="pf-v6-u-mr-xl">
          <Flex direction={{ default: "column" }} flex={{ default: "flex_1" }}>
            <TitleLayout
              key={0}
              headingLevel="h1"
              id="hbacrule-settings"
              text="HBAC rule settings"
            />
            <Form className="pf-v6-u-mt-sm pf-v6-u-mb-lg pf-v6-u-mr-md">
              <FormGroup label="Description" fieldId="description">
                <IpaTextArea
                  dataCy="hbac-rules-tab-settings-textbox-description"
                  name="description"
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="hbacrule"
                  metadata={props.metadata}
                />
              </FormGroup>
            </Form>
            <Content key="usercategory">
              <Title
                headingLevel="h2"
                id="usercategory"
                className="pf-v6-u-mt-lg pf-v6-u-display-flex"
              >
                Who the rule applies to
                <IpaCheckbox
                  dataCy="hbac-rules-tab-settings-checkbox-usercategory"
                  name="usercategory"
                  value="usercategory"
                  text="Allow anyone"
                  textNode={whoLabel}
                  className="pf-v6-u-ml-lg pf-v6-u-mt-xs"
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="hbacrule"
                  metadata={props.metadata}
                  altTrue="all"
                  altFalse={""}
                />
              </Title>
            </Content>
            {ipaObject.usercategory === "" && (
              <Tabs
                activeKey={userTabKey}
                onSelect={handleUserTabClick}
                className="pf-v6-u-ml-md pf-v6-u-mr-md"
              >
                <Tab
                  eventKey={0}
                  name="users"
                  data-cy="hbac-rules-tab-settings-tab-users"
                  title={
                    <TabTitleText>
                      Users <Label isCompact>{memberUsers.length}</Label>
                    </TabTitleText>
                  }
                >
                  <HBACRulesMemberTable
                    from="user"
                    id={cn}
                    members={memberUsers}
                    onRefresh={props.onRefresh}
                    unsetCategory={
                      ipaObject.usercategory !==
                        props.originalRule.usercategory &&
                      ipaObject.usercategory === ""
                    }
                  />
                </Tab>
                <Tab
                  eventKey={1}
                  name="groups"
                  data-cy="hbac-rules-tab-settings-tab-groups"
                  title={
                    <TabTitleText>
                      Groups <Label isCompact>{memberGroups.length}</Label>
                    </TabTitleText>
                  }
                >
                  <HBACRulesMemberTable
                    from="group"
                    id={cn}
                    members={memberGroups}
                    onRefresh={props.onRefresh}
                    unsetCategory={
                      ipaObject.usercategory !==
                        props.originalRule.usercategory &&
                      ipaObject.usercategory === ""
                    }
                  />
                </Tab>
              </Tabs>
            )}
            <Content key="hostcategory">
              <Title
                headingLevel="h2"
                id="hostcategory"
                className="pf-v6-u-mt-xl pf-v6-u-display-flex"
              >
                Gives access to
                <IpaCheckbox
                  dataCy="hbac-rules-tab-settings-checkbox-hostcategory"
                  name="hostcategory"
                  value="hostcategory"
                  text="Any host"
                  textNode={whatLabel}
                  className="pf-v6-u-ml-lg pf-v6-u-mt-xs"
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="hbacrule"
                  metadata={props.metadata}
                  altTrue="all"
                  altFalse={""}
                />
              </Title>
            </Content>
            {ipaObject.hostcategory === "" && (
              <Tabs
                activeKey={hostTabKey}
                onSelect={handleHostTabClick}
                className="pf-v6-u-ml-md pf-v6-u-mr-md"
              >
                <Tab
                  eventKey={0}
                  name="memberHosts"
                  data-cy="hbac-rules-tab-settings-tab-hosts"
                  title={
                    <TabTitleText>
                      Hosts <Label isCompact>{memberHosts.length}</Label>
                    </TabTitleText>
                  }
                >
                  <HBACRulesMemberTable
                    from="host"
                    id={cn}
                    members={memberHosts}
                    onRefresh={props.onRefresh}
                    unsetCategory={
                      ipaObject.hostcategory !==
                        props.originalRule.hostcategory &&
                      ipaObject.hostcategory === ""
                    }
                  />
                </Tab>
                <Tab
                  eventKey={1}
                  name="memberHostGroups"
                  data-cy="hbac-rules-tab-settings-tab-hostgroups"
                  title={
                    <TabTitleText>
                      Host groups{" "}
                      <Label isCompact>{memberHostGroups.length}</Label>
                    </TabTitleText>
                  }
                >
                  <HBACRulesMemberTable
                    from="hostgroup"
                    id={cn}
                    members={memberHostGroups}
                    onRefresh={props.onRefresh}
                    fromLabel={"Host group"}
                    unsetCategory={
                      ipaObject.hostcategory !==
                        props.originalRule.hostcategory &&
                      ipaObject.hostcategory === ""
                    }
                  />
                </Tab>
              </Tabs>
            )}
            <Content key="servicecategory">
              <Title
                headingLevel="h2"
                id="servicecategory"
                className="pf-v6-u-mt-xl pf-v6-u-display-flex"
              >
                Via the following services
                <IpaCheckbox
                  dataCy="hbac-rules-tab-settings-checkbox-servicecategory"
                  name="servicecategory"
                  value="servicecategory"
                  text="Any service"
                  textNode={howLabel}
                  className="pf-v6-u-ml-lg pf-v6-u-mt-xs"
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="hbacrule"
                  metadata={props.metadata}
                  altTrue="all"
                  altFalse={""}
                />
              </Title>
            </Content>
            {ipaObject.servicecategory === "" && (
              <Tabs
                activeKey={srvTabKey}
                onSelect={handleSrvTabClick}
                className="pf-v6-u-ml-md pf-v6-u-mr-md"
              >
                <Tab
                  eventKey={0}
                  name="services"
                  data-cy="hbac-rules-tab-settings-tab-services"
                  title={
                    <TabTitleText>
                      Services <Label isCompact>{memberServices.length}</Label>
                    </TabTitleText>
                  }
                >
                  <HBACRulesMemberTable
                    from="hbacsvc"
                    fromLabel="Service"
                    id={cn}
                    members={memberServices}
                    onRefresh={props.onRefresh}
                    unsetCategory={
                      ipaObject.servicecategory !==
                        props.originalRule.servicecategory &&
                      ipaObject.servicecategory === ""
                    }
                  />
                </Tab>
                <Tab
                  eventKey={1}
                  name="servicegroups"
                  data-cy="hbac-rules-tab-settings-tab-servicegroups"
                  title={
                    <TabTitleText>
                      Service groups{" "}
                      <Label isCompact>{memberServiceGroups.length}</Label>
                    </TabTitleText>
                  }
                >
                  <HBACRulesMemberTable
                    from="hbacsvcgroup"
                    fromLabel="Service group"
                    id={cn}
                    members={memberServiceGroups}
                    onRefresh={props.onRefresh}
                    unsetCategory={
                      ipaObject.servicecategory !==
                        props.originalRule.servicecategory &&
                      ipaObject.servicecategory === ""
                    }
                  />
                </Tab>
              </Tabs>
            )}
          </Flex>
        </SidebarContent>
      </Sidebar>
    </TabLayout>
  );
};

export default HBACRulesSettings;
