import React, { useState } from "react";
// PatternFly
import {
  Flex,
  Form,
  FormGroup,
  Label,
  Tab,
  Tabs,
  TabTitleText,
} from "@patternfly/react-core";
// Forms
import IpaTextArea from "src/components/Form/IpaTextArea";
import IpaTextInput from "src/components/Form/IpaTextInput";
import IpaCheckbox from "src/components/Form/IpaCheckbox";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import TabLayout from "src/components/layouts/TabLayout";
// Utils
import { asRecord } from "../../utils/hostUtils";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Data types
import { Netgroup, Metadata } from "../../utils/datatypes/globalDataTypes";
import NetgroupsMemberTable from "./NetgroupsMemberTable";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  useSaveAndCleanNetgroupMutation,
  AllowAllPayload,
} from "src/services/rpcNetgroups";

interface PropsToGroupsSettings {
  netgroup: Partial<Netgroup>;
  originalGroup: Partial<Netgroup>;
  metadata: Metadata;
  onGroupChange: (netgroup: Partial<Netgroup>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<Netgroup>;
  onResetValues: () => void;
}

const NetgroupsSettings = (props: PropsToGroupsSettings) => {
  const alerts = useAlerts();

  // API
  const [saveGroup] = useSaveAndCleanNetgroupMutation();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "netgroups", noBreadcrumb: true });

  const [cn, setNetgroupName] = useState<string>("");
  const [memberUsers, setMemberUsers] = useState<string[]>([]);
  const [memberGroups, setMemberGroups] = useState<string[]>([]);
  const [memberHosts, setMemberHosts] = useState<string[]>([]);
  const [memberHostGroups, setMemberHostGroups] = useState<string[]>([]);
  const [memberExternalHosts, setMemberExternalHosts] = useState<string[]>([]);

  React.useEffect(() => {
    // Process the member users and hosts
    let externalHosts: string[] = [];

    setNetgroupName(props.netgroup.cn ? props.netgroup.cn : "");
    if (props.netgroup.memberuser_user) {
      setMemberUsers(props.netgroup.memberuser_user);
    }
    if (props.netgroup.memberuser_group) {
      setMemberGroups(props.netgroup.memberuser_group);
    }
    if (props.netgroup.memberhost_host) {
      setMemberHosts(props.netgroup.memberhost_host);
    }
    if (props.netgroup.memberhost_hostgroup) {
      setMemberHostGroups(props.netgroup.memberhost_hostgroup);
    }
    externalHosts = props.netgroup.externalhost
      ? [...props.netgroup.externalhost]
      : [];
    setMemberExternalHosts(externalHosts);
  }, [props.netgroup]);

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
    props.netgroup,
    props.onGroupChange
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
      external: memberExternalHosts,
      modifiedValues,
    } as AllowAllPayload;

    setSaving(true);
    saveGroup(payload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Show toast notification: success
          alerts.addAlert("save-success", "Netgroup modified", "success");
          props.onRefresh();
          setHostTabKey(0);
          setUserTabKey(0);
        } else if (response.data?.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert("save-error", errorMessage.message, "danger");
          props.onResetValues();
        }
      }
      setSaving(false);
    });
  };

  // 'Revert' handler method
  const onRevert = () => {
    props.onGroupChange(props.originalGroup);
    alerts.addAlert("revert-success", "Netgroup data reverted", "success");
  };

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <SecondaryButton
          dataCy="netgroups-tab-settings-button-refresh"
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
          dataCy="netgroups-tab-settings-button-revert"
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
          dataCy="netgroups-tab-settings-button-save"
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

  // Render component
  return (
    <TabLayout id="settings-page" toolbarItems={toolbarFields}>
      <alerts.ManagedAlerts />
      <Flex direction={{ default: "column" }} flex={{ default: "flex_1" }}>
        <TitleLayout
          key={0}
          headingLevel="h1"
          id="group-settings"
          text="Netgroup settings"
        />
        <Form
          className="pf-v6-u-mt-sm pf-v6-u-mb-lg pf-v6-u-mr-md"
          isHorizontal
        >
          <FormGroup label="Description" fieldId="description">
            <IpaTextArea
              dataCy="netgroups-tab-settings-textbox-description"
              name="description"
              ipaObject={ipaObject}
              onChange={recordOnChange}
              objectName="netgroup"
              metadata={props.metadata}
            />
          </FormGroup>
          <FormGroup label="NIS domain name" fieldId="nisdomainname">
            <IpaTextInput
              dataCy="netgroups-tab-settings-textbox-nisdomainname"
              name="nisdomainname"
              ariaLabel={"NIS domain name"}
              ipaObject={ipaObject}
              onChange={recordOnChange}
              objectName="netgroup"
              metadata={props.metadata}
            />
          </FormGroup>
        </Form>
        <TitleLayout
          key={1}
          headingLevel="h2"
          id="user-category-tabs"
          text="User category"
          className="pf-v6-u-mt-lg"
        />
        <IpaCheckbox
          dataCy="netgroups-tab-settings-checkbox-usercategory"
          name="usercategory"
          value="usercategory"
          text="Allow anyone"
          className="pf-v6-u-ml-lg"
          ipaObject={ipaObject}
          onChange={recordOnChange}
          objectName="netgroup"
          metadata={props.metadata}
          altTrue="all"
          altFalse={""}
        />
        {ipaObject.usercategory === "" && (
          <Tabs
            activeKey={userTabKey}
            onSelect={handleUserTabClick}
            className="pf-v6-u-ml-md pf-v6-u-mr-md"
          >
            <Tab
              eventKey={0}
              name="users"
              data-cy="netgroups-tab-settings-tab-users"
              title={
                <TabTitleText>
                  Users <Label isCompact>{memberUsers.length}</Label>
                </TabTitleText>
              }
            >
              <NetgroupsMemberTable
                from="user"
                id={cn}
                members={memberUsers}
                onRefresh={props.onRefresh}
                unsetCategory={
                  ipaObject.usercategory !== props.originalGroup.usercategory
                }
              />
            </Tab>
            <Tab
              eventKey={1}
              name="groups"
              data-cy="netgroups-tab-settings-tab-groups"
              title={
                <TabTitleText>
                  Groups <Label isCompact>{memberGroups.length}</Label>
                </TabTitleText>
              }
            >
              <NetgroupsMemberTable
                from="group"
                id={cn}
                members={memberGroups}
                onRefresh={props.onRefresh}
                unsetCategory={
                  ipaObject.usercategory !== props.originalGroup.usercategory
                }
              />
            </Tab>
          </Tabs>
        )}
        <TitleLayout
          key={2}
          headingLevel="h2"
          id="host-category-tabs"
          text="Host category"
          className="pf-v6-u-mt-xl"
        />
        <IpaCheckbox
          dataCy="netgroups-tab-settings-checkbox-hostcategory"
          name="hostcategory"
          value="hostcategory"
          text="Allow any host"
          className="pf-v6-u-ml-lg"
          ipaObject={ipaObject}
          onChange={recordOnChange}
          objectName="netgroup"
          metadata={props.metadata}
          altTrue="all"
          altFalse={""}
        />
        {ipaObject.hostcategory === "" && (
          <Tabs
            activeKey={hostTabKey}
            onSelect={handleHostTabClick}
            className="pf-v6-u-ml-md pf-v6-u-mr-md"
          >
            <Tab
              eventKey={0}
              name="memberHosts"
              data-cy="netgroups-tab-settings-tab-hosts"
              title={
                <TabTitleText>
                  Hosts <Label isCompact>{memberHosts.length}</Label>
                </TabTitleText>
              }
            >
              <NetgroupsMemberTable
                from="host"
                id={cn}
                members={memberHosts}
                onRefresh={props.onRefresh}
                unsetCategory={
                  ipaObject.hostcategory !== props.originalGroup.hostcategory
                }
              />
            </Tab>
            <Tab
              eventKey={1}
              name="memberHostGroups"
              data-cy="netgroups-tab-settings-tab-hostgroups"
              title={
                <TabTitleText>
                  Host groups <Label isCompact>{memberHostGroups.length}</Label>
                </TabTitleText>
              }
            >
              <NetgroupsMemberTable
                from="hostgroup"
                id={cn}
                members={memberHostGroups}
                onRefresh={props.onRefresh}
                fromLabel={"Host group"}
                unsetCategory={
                  ipaObject.hostcategory !== props.originalGroup.hostcategory
                }
              />
            </Tab>
            <Tab
              eventKey={2}
              name="memberExternalHosts"
              data-cy="netgroups-tab-settings-tab-externalhosts"
              title={
                <TabTitleText>
                  External hosts{" "}
                  <Label isCompact>{memberExternalHosts.length}</Label>
                </TabTitleText>
              }
            >
              <NetgroupsMemberTable
                from="externalHost"
                id={cn}
                members={memberExternalHosts}
                onRefresh={props.onRefresh}
                fromLabel={"External host"}
                unsetCategory={
                  ipaObject.hostcategory !== props.originalGroup.hostcategory
                }
              />
            </Tab>
          </Tabs>
        )}
      </Flex>
    </TabLayout>
  );
};

export default NetgroupsSettings;
