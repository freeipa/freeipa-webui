import React, { useState } from "react";
import { Button, Flex, Form, FormGroup } from "@patternfly/react-core";
import IpaTextInput from "src/components/Form/IpaTextInput";
import IpaCheckboxes from "src/components/Form/IpaCheckboxes";
import IpaSimpleSelector from "src/components/Form/IpaSimpleSelector";
import TitleLayout from "src/components/layouts/TitleLayout";
import TabLayout from "src/components/layouts/TabLayout";
import SidebarLayout from "src/components/layouts/SidebarLayout";
import { asRecord } from "src/utils/permissionsUtils";
import { useAppDispatch } from "src/store/hooks";
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import { Permission, Metadata } from "src/utils/datatypes/globalDataTypes";
import { ErrorResult } from "src/services/rpc";
import { useSavePermissionMutation } from "src/services/rpcPermissions";

const BIND_RULE_OPTIONS = [
  { key: "permission", value: "permission" },
  { key: "all", value: "all" },
  { key: "anonymous", value: "anonymous" },
  { key: "self", value: "self" },
];

const GRANTED_RIGHTS_OPTIONS = [
  { value: "read", text: "read" },
  { value: "search", text: "search" },
  { value: "compare", text: "compare" },
  { value: "write", text: "write" },
  { value: "add", text: "add" },
  { value: "delete", text: "delete" },
  { value: "all", text: "all" },
];

interface PropsToSettings {
  permission: Partial<Permission>;
  originalPermission: Partial<Permission>;
  metadata: Metadata;
  onPermissionChange: (permission: Partial<Permission>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<Permission>;
  onResetValues: () => void;
  onOpenContextualPanel?: () => void;
}

const PermissionsSettings = (props: PropsToSettings) => {
  const dispatch = useAppDispatch();

  const [savePermission] = useSavePermissionMutation();

  useUpdateRoute({ pathname: "permissions", noBreadcrumb: true });

  const { ipaObject, recordOnChange } = asRecord(
    props.permission,
    props.onPermissionChange
  );

  const [isSaving, setSaving] = useState(false);

  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const modifiedValues = props.modifiedValues();
    modifiedValues.cn = props.permission.cn;
    setSaving(true);

    savePermission(modifiedValues)
      .then((response) => {
        if ("data" in response) {
          if (response.data?.result) {
            dispatch(
              addAlert({
                name: "save-success",
                title: "Permission modified",
                variant: "success",
              })
            );
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
        }
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const onRevert = () => {
    props.onPermissionChange(props.originalPermission);
    dispatch(
      addAlert({
        name: "revert-success",
        title: "Permission data reverted",
        variant: "success",
      })
    );
  };

  const toolbarFields = [
    {
      key: 0,
      element: (
        <Button
          variant="secondary"
          data-cy="permissions-tab-settings-button-refresh"
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
          data-cy="permissions-tab-settings-button-revert"
          isDisabled={!props.isModified || isSaving || props.isDataLoading}
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
          data-cy="permissions-tab-settings-button-save"
          isDisabled={!props.isModified || isSaving || props.isDataLoading}
          type="submit"
          form="permissions-settings-form"
          isLoading={isSaving}
          spinnerAriaValueText="Saving"
          spinnerAriaLabel="Saving"
        >
          {isSaving ? "Saving" : "Save"}
        </Button>
      ),
    },
  ];

  return (
    <TabLayout id="settings-page" toolbarItems={toolbarFields}>
      <SidebarLayout
        itemNames={["Permission settings", "Target"]}
        onHelpClick={props.onOpenContextualPanel}
      >
        <Form
          className="pf-v6-u-mt-sm pf-v6-u-mb-lg pf-v6-u-mr-md"
          id="permissions-settings-form"
          isHorizontal
          onSubmit={onSave}
        >
          <Flex direction={{ default: "column" }} flex={{ default: "flex_1" }}>
            <TitleLayout
              headingLevel="h2"
              id="permission-settings"
              text="Permission settings"
            />
            <FormGroup label="Permission name" fieldId="cn">
              <IpaTextInput
                dataCy="permissions-tab-settings-textbox-cn"
                name="cn"
                ariaLabel="Permission name"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="permission"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="Bind rule type" fieldId="ipapermbindruletype">
              <IpaSimpleSelector
                dataCy="permissions-tab-settings-select-ipapermbindruletype"
                name="ipapermbindruletype"
                ariaLabel="Bind rule type"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="permission"
                metadata={props.metadata}
                options={BIND_RULE_OPTIONS}
              />
            </FormGroup>
            <FormGroup label="Granted rights" fieldId="ipapermright">
              <IpaCheckboxes
                dataCy="permissions-tab-settings-checkbox-ipapermright"
                name="ipapermright"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="permission"
                metadata={props.metadata}
                withGrid
                options={GRANTED_RIGHTS_OPTIONS}
              />
            </FormGroup>
          </Flex>
          <Flex
            direction={{ default: "column" }}
            flex={{ default: "flex_1" }}
            className="pf-v6-u-mt-xl"
          >
            <TitleLayout headingLevel="h2" id="target" text="Target" />
            <FormGroup label="Type" fieldId="type">
              <IpaTextInput
                dataCy="permissions-tab-settings-textbox-type"
                name="type"
                ariaLabel="Type"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="permission"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="Subtree" fieldId="ipapermlocation">
              <IpaTextInput
                dataCy="permissions-tab-settings-textbox-ipapermlocation"
                name="ipapermlocation"
                ariaLabel="Subtree"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="permission"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="Extra target filter" fieldId="extratargetfilter">
              <IpaTextInput
                dataCy="permissions-tab-settings-textbox-extratargetfilter"
                name="extratargetfilter"
                ariaLabel="Extra target filter"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="permission"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="Target DN" fieldId="ipapermtarget">
              <IpaTextInput
                dataCy="permissions-tab-settings-textbox-ipapermtarget"
                name="ipapermtarget"
                ariaLabel="Target DN"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="permission"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="Member of group" fieldId="memberof">
              <IpaTextInput
                dataCy="permissions-tab-settings-textbox-memberof"
                name="memberof"
                ariaLabel="Member of group"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="permission"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="Effective attributes" fieldId="attrs">
              <IpaTextInput
                dataCy="permissions-tab-settings-textbox-attrs"
                name="attrs"
                ariaLabel="Effective attributes"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="permission"
                metadata={props.metadata}
              />
            </FormGroup>
          </Flex>
        </Form>
      </SidebarLayout>
    </TabLayout>
  );
};

export default PermissionsSettings;
