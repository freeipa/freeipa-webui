import React, { useState } from "react";
// PatternFly
import {
  Flex,
  Form,
  FormGroup,
  Label,
  PageSection,
  PageSectionVariants,
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
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
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
import { useSaveNetgroupMutation } from "src/services/rpcNetgroups";

interface PropsToGroupsSettings {
  netgroup: Partial<Netgroup>;
  originalGroup: Partial<Netgroup>;
  metadata: Metadata;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onGroupChange: (hostGroup: Partial<Netgroup>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<Netgroup>;
  onResetValues: () => void;
}

const NetgroupsSettings = (props: PropsToGroupsSettings) => {
  const alerts = useAlerts();

  // API
  const [saveGroup] = useSaveNetgroupMutation();

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
    modifiedValues.cn = props.netgroup.cn;
    setSaving(true);

    saveGroup(modifiedValues).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Show toast notification: success
          alerts.addAlert("save-success", "Netgroup modified", "success");
        } else if (response.data.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert("save-error", errorMessage.message, "danger");
        }
        // Reset values. Disable 'revert' and 'save' buttons
        props.onResetValues();
        setSaving(false);
      }
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
        <SecondaryButton onClickHandler={props.onRefresh}>
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 1,
      element: (
        <SecondaryButton
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
    <>
      <alerts.ManagedAlerts />
      <PageSection
        id="settings-page"
        variant={PageSectionVariants.light}
        className="pf-v5-u-pr-0 pf-v5-u-ml-lg pf-v5-u-mr-sm"
        style={{ overflowY: "scroll", height: `calc(100vh - 319px)` }}
      >
        <Flex direction={{ default: "column" }} flex={{ default: "flex_1" }}>
          <TitleLayout
            key={0}
            headingLevel="h1"
            id="group-settings"
            text="Netgroup settings"
          />
          <Form
            className="pf-v5-u-mt-sm pf-v5-u-mb-lg pf-v5-u-mr-md"
            isHorizontal
          >
            <FormGroup label="Description" fieldId="description">
              <IpaTextArea
                name="description"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="netgroup"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="NIS domain name" fieldId="nisdomainname">
              <IpaTextInput
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
            className="pf-v5-u-mt-lg"
          />
          <IpaCheckbox
            name="usercategory"
            value="usercategory"
            text="Allow anyone"
            className="pf-v5-u-ml-lg"
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
              className="pf-v5-u-ml-md pf-v5-u-mr-md"
            >
              <Tab
                eventKey={0}
                name="users"
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
                />
              </Tab>
              <Tab
                eventKey={1}
                name="groups"
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
                />
              </Tab>
            </Tabs>
          )}
          <TitleLayout
            key={2}
            headingLevel="h2"
            id="host-category-tabs"
            text="Host category"
            className="pf-v5-u-mt-xl"
          />
          <IpaCheckbox
            name="hostcategory"
            value="hostcategory"
            text="Allow any host"
            className="pf-v5-u-ml-lg"
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
              className="pf-v5-u-ml-md pf-v5-u-mr-md"
            >
              <Tab
                eventKey={0}
                name="memberHosts"
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
                />
              </Tab>
              <Tab
                eventKey={1}
                name="memberHostGroups"
                title={
                  <TabTitleText>
                    Host groups{" "}
                    <Label isCompact>{memberHostGroups.length}</Label>
                  </TabTitleText>
                }
              >
                <NetgroupsMemberTable
                  from="hostgroup"
                  id={cn}
                  members={memberHostGroups}
                  onRefresh={props.onRefresh}
                  fromLabel={"Host group"}
                />
              </Tab>
              <Tab
                eventKey={2}
                name="memberExternalHosts"
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
                />
              </Tab>
            </Tabs>
          )}
        </Flex>
      </PageSection>
      <ToolbarLayout
        isSticky={true}
        className={"pf-v5-u-p-md pf-v5-u-ml-lg pf-v5-u-mr-lg"}
        toolbarItems={toolbarFields}
      />
    </>
  );
};

export default NetgroupsSettings;
