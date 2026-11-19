import React, { useEffect, useState } from "react";
// PatternFly
import {
  Button,
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
import IpaTextInput from "src/components/Form/IpaTextInput";
import IpaCheckbox from "src/components/Form/IpaCheckbox";
import IpaDropdownSearch from "src/components/Form/IpaDropdownSearch";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";

import TabLayout from "src/components/layouts/TabLayout";
// Utils
import { asRecord } from "../../utils/selinuxUserMapUtils";
import { API_VERSION_BACKUP } from "src/utils/utils";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import { toggleHelpPanel } from "src/store/Global/contextual-help-slice";
// Data types
import {
  SELinuxUserMap,
  Metadata,
} from "../../utils/datatypes/globalDataTypes";
import SELinuxUserMapsMemberTable from "./SELinuxUserMapsMemberTable";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
// RPC
import {
  ErrorResult,
  GenericPayload,
  useSearchEntriesMutation,
} from "src/services/rpc";
import {
  useSaveAndCleanSelinuxUserMapMutation,
  AllowAllPayload,
} from "src/services/rpcSelinuxUserMaps";

interface PropsToSettings {
  rule: Partial<SELinuxUserMap>;
  originalRule: Partial<SELinuxUserMap>;
  metadata: Metadata;
  onRuleChange: (rule: Partial<SELinuxUserMap>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<SELinuxUserMap>;
  onResetValues: () => void;
}

const SELinuxUserMapsSettings = (props: PropsToSettings) => {
  const dispatch = useAppDispatch();
  useContextualHelpTopic("selinux-user-maps-settings");

  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  // API
  const [saveRule] = useSaveAndCleanSelinuxUserMapMutation();

  // HBAC rules for 'seealso' dropdown
  const [hbacRules, setHbacRules] = useState<string[]>([]);
  const [retrieveHbacRules] = useSearchEntriesMutation({});

  const fetchHbacRules = (searchValue = "") => {
    retrieveHbacRules({
      searchValue,
      sizeLimit: 1000,
      apiVersion: apiVersion || API_VERSION_BACKUP,
      startIdx: 0,
      stopIdx: 1000,
      entryType: "hbacrule",
    } as GenericPayload).then((result) => {
      if ("data" in result) {
        const rulesResult = result.data?.result.results || [];
        const rulesCount = result.data?.result.count || 0;
        const rulesList: string[] = [];
        for (let i = 0; i < rulesCount; i++) {
          rulesList.push(rulesResult[i].result.cn[0]);
        }
        setHbacRules(rulesList);
      }
    });
  };

  useEffect(() => {
    fetchHbacRules();
  }, []);

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "selinux-user-maps", noBreadcrumb: true });

  const [cn, setRuleName] = useState<string>("");
  const [memberUsers, setMemberUsers] = useState<string[]>([]);
  const [memberGroups, setMemberGroups] = useState<string[]>([]);
  const [memberHosts, setMemberHosts] = useState<string[]>([]);
  const [memberHostGroups, setMemberHostGroups] = useState<string[]>([]);

  React.useEffect(() => {
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
  }, [props.rule]);

  // Tabs
  const [userTabKey, setUserTabKey] = useState(0);
  const [hostTabKey, setHostTabKey] = useState(0);

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

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.rule,
    props.onRuleChange
  );

  const [isSaving, setSaving] = useState(false);

  // 'Save' handler method
  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const modifiedValues = props.modifiedValues();
    const payload = {
      groupName: cn,
      users: memberUsers,
      groups: memberGroups,
      hosts: memberHosts,
      hostgroups: memberHostGroups,
      modifiedValues,
    } as AllowAllPayload;
    setSaving(true);

    saveRule(payload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          dispatch(
            addAlert({
              name: "save-success",
              title: "SELinux user map modified",
              variant: "success",
            })
          );
          setHostTabKey(0);
          setUserTabKey(0);
          props.onRefresh();
        } else if (response.data?.error) {
          const errorMessage = response.data.error as ErrorResult;
          dispatch(
            addAlert({
              name: "save-error",
              title: errorMessage.message,
              variant: "danger",
            })
          );
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
        title: "SELinux user map data reverted",
        variant: "success",
      })
    );
  };

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <Button
          variant="secondary"
          data-cy="selinux-usermaps-tab-settings-button-refresh"
          onClick={props.onRefresh}
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
          data-cy="selinux-usermaps-tab-settings-button-revert"
          isDisabled={!props.isModified}
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
          variant="primary"
          data-cy="selinux-usermaps-tab-settings-button-save"
          isDisabled={!props.isModified || isSaving}
          type="submit"
          form="selinux-usermaps-settings-form"
          isLoading={isSaving}
          spinnerAriaValueText="Saving"
          spinnerAriaLabel="Saving"
        >
          {isSaving ? "Saving" : "Save"}
        </Button>
      ),
    },
  ];

  const whoLabel = (
    <Content component={ContentVariants.small}>Allow anyone</Content>
  );
  const whatLabel = (
    <Content component={ContentVariants.small}>Any host</Content>
  );

  // Render component
  return (
    <>
      <TabLayout id="settings-page" toolbarItems={toolbarFields}>
        <Sidebar isPanelRight>
          <SidebarPanel variant="sticky">
            <HelpTextWithIconLayout
              textContent="Help"
              icon={
                <OutlinedQuestionCircleIcon className="pf-v6-u-primary-color-100 pf-v6-u-mr-sm" />
              }
              onClick={() => dispatch(toggleHelpPanel())}
            />
            <JumpLinks
              isVertical
              label="Jump to section"
              scrollableSelector="#settings-page"
              expandable={{ default: "expandable", md: "nonExpandable" }}
            >
              <JumpLinksItem key={0} href="#selinuxusermap-settings">
                General
              </JumpLinksItem>
              <JumpLinksItem key={1} href="#usercategory">
                Who the rule applies to
              </JumpLinksItem>
              <JumpLinksItem key={2} href="#hostcategory">
                Accessing
              </JumpLinksItem>
            </JumpLinks>
          </SidebarPanel>
          <SidebarContent className="pf-v6-u-mr-xl">
            <Flex
              direction={{ default: "column" }}
              flex={{ default: "flex_1" }}
            >
              <TitleLayout
                key={0}
                headingLevel="h1"
                id="selinuxusermap-settings"
                text="General"
              />
              <Form
                className="pf-v6-u-mt-sm pf-v6-u-mb-lg pf-v6-u-mr-md"
                id="selinux-usermaps-settings-form"
                onSubmit={onSave}
              >
                <FormGroup label="Rule name" fieldId="cn">
                  <IpaTextInput
                    dataCy="selinux-usermaps-tab-settings-textbox-cn"
                    name="cn"
                    ariaLabel="Rule name"
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="selinuxusermap"
                    metadata={props.metadata}
                    readOnly
                  />
                </FormGroup>
                <FormGroup label="Description" fieldId="description">
                  <IpaTextArea
                    dataCy="selinux-usermaps-tab-settings-textbox-description"
                    name="description"
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="selinuxusermap"
                    metadata={props.metadata}
                  />
                </FormGroup>
                <FormGroup
                  label="SELinux user"
                  fieldId="ipaselinuxuser"
                  isRequired
                >
                  <IpaTextInput
                    dataCy="selinux-usermaps-tab-settings-textbox-ipaselinuxuser"
                    name="ipaselinuxuser"
                    ariaLabel="SELinux user"
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="selinuxusermap"
                    metadata={props.metadata}
                  />
                </FormGroup>
                <FormGroup label="HBAC rule" fieldId="seealso">
                  <IpaDropdownSearch
                    dataCy="selinux-usermaps-tab-settings-dropdown-seealso"
                    id="seealso"
                    name="seealso"
                    options={hbacRules}
                    ipaObject={ipaObject}
                    setIpaObject={recordOnChange}
                    objectName="selinuxusermap"
                    metadata={props.metadata}
                    onSearch={fetchHbacRules}
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
                    dataCy="selinux-usermaps-tab-settings-checkbox-usercategory"
                    name="usercategory"
                    value="usercategory"
                    text="Allow anyone"
                    textNode={whoLabel}
                    className="pf-v6-u-ml-lg pf-v6-u-mt-xs"
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="selinuxusermap"
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
                    data-cy="selinux-usermaps-tab-settings-tab-users"
                    title={
                      <TabTitleText>
                        Users <Label isCompact>{memberUsers.length}</Label>
                      </TabTitleText>
                    }
                  >
                    <SELinuxUserMapsMemberTable
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
                    data-cy="selinux-usermaps-tab-settings-tab-groups"
                    title={
                      <TabTitleText>
                        Groups <Label isCompact>{memberGroups.length}</Label>
                      </TabTitleText>
                    }
                  >
                    <SELinuxUserMapsMemberTable
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
                  Accessing
                  <IpaCheckbox
                    dataCy="selinux-usermaps-tab-settings-checkbox-hostcategory"
                    name="hostcategory"
                    value="hostcategory"
                    text="Any host"
                    textNode={whatLabel}
                    className="pf-v6-u-ml-lg pf-v6-u-mt-xs"
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="selinuxusermap"
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
                    data-cy="selinux-usermaps-tab-settings-tab-hosts"
                    title={
                      <TabTitleText>
                        Hosts <Label isCompact>{memberHosts.length}</Label>
                      </TabTitleText>
                    }
                  >
                    <SELinuxUserMapsMemberTable
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
                    data-cy="selinux-usermaps-tab-settings-tab-hostgroups"
                    title={
                      <TabTitleText>
                        Host groups{" "}
                        <Label isCompact>{memberHostGroups.length}</Label>
                      </TabTitleText>
                    }
                  >
                    <SELinuxUserMapsMemberTable
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
            </Flex>
          </SidebarContent>
        </Sidebar>
      </TabLayout>
    </>
  );
};

export default SELinuxUserMapsSettings;
