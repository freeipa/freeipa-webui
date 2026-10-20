import React, { useState } from "react";
import {
  Button,
  Flex,
  Form,
  FormGroup,
  Sidebar,
  SidebarContent,
  SidebarPanel,
} from "@patternfly/react-core";
import IpaTextInput from "src/components/Form/IpaTextInput";
import IpaCheckboxes from "src/components/Form/IpaCheckboxes";
import TitleLayout from "src/components/layouts/TitleLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import TabLayout from "src/components/layouts/TabLayout";
import IpaTypeAheadWithCheckbox from "src/components/Form/IpaTypeAheadWithCheckbox";
import {
  asRecord,
  SELF_SERVICE_ATTR_OPTIONS,
} from "src/utils/selfServicePermissionsUtils";
import { useAppDispatch } from "src/store/hooks";
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import { SelfServicePermission } from "src/utils/datatypes/globalDataTypes";
import { Metadata } from "src/services/types/metadata";
import { ErrorResult } from "src/services/rpc";
import { useSaveSelfServicePermissionMutation } from "src/services/rpcSelfServicePermissions";

const PERMISSION_OPTIONS = [
  { value: "read", text: "read" },
  { value: "write", text: "write" },
];

interface PropsToSettings {
  permission: Partial<SelfServicePermission>;
  originalPermission: Partial<SelfServicePermission>;
  metadata: Metadata;
  onPermissionChange: (permission: Partial<SelfServicePermission>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<SelfServicePermission>;
  onResetValues: () => void;
  onOpenContextualPanel?: () => void;
}

const SelfServicePermissionsSettings = (props: PropsToSettings) => {
  const dispatch = useAppDispatch();

  const [saveSelfServicePermission] = useSaveSelfServicePermissionMutation();

  useUpdateRoute({ pathname: "selfservice-permissions", noBreadcrumb: true });

  const { ipaObject, recordOnChange } = asRecord(
    props.permission,
    props.onPermissionChange
  );

  const [isSaving, setSaving] = useState(false);

  const hasRequiredValues =
    (props.permission.permissions?.length || 0) > 0 &&
    (props.permission.attrs?.length || 0) > 0;

  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const modifiedValues = props.modifiedValues();
    modifiedValues.aciname = props.permission.aciname;
    setSaving(true);

    saveSelfServicePermission(modifiedValues)
      .then((response) => {
        if ("data" in response) {
          if (response.data?.result) {
            dispatch(
              addAlert({
                name: "save-success",
                title: "Self-service permission modified",
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
        title: "Self-service permission data reverted",
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
          data-cy="selfservice-permissions-tab-settings-button-refresh"
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
          data-cy="selfservice-permissions-tab-settings-button-revert"
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
          data-cy="selfservice-permissions-tab-settings-button-save"
          isDisabled={
            !props.isModified ||
            !hasRequiredValues ||
            isSaving ||
            props.isDataLoading
          }
          type="submit"
          form="selfservice-permissions-settings-form"
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
      <Sidebar isPanelRight>
        <SidebarPanel variant="sticky">
          <HelpTextWithIconLayout
            textContent="Help"
            onClick={props.onOpenContextualPanel}
          />
        </SidebarPanel>
        <SidebarContent className="pf-v6-u-mr-xl">
          <Flex direction={{ default: "column" }} flex={{ default: "flex_1" }}>
            <TitleLayout
              key={0}
              headingLevel="h1"
              id="selfservice-permission-settings"
              text="Self-service permission settings"
            />
            <Form
              className="pf-v6-u-mt-sm pf-v6-u-mb-lg pf-v6-u-mr-md"
              id="selfservice-permissions-settings-form"
              isHorizontal
              onSubmit={onSave}
            >
              <FormGroup label="Self-service name" fieldId="aciname">
                <IpaTextInput
                  dataCy="selfservice-permissions-tab-settings-textinput-aciname"
                  name="aciname"
                  ariaLabel="Self-service name"
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="selfservice"
                  metadata={props.metadata}
                />
              </FormGroup>
              <FormGroup label="Permissions" fieldId="permissions" isRequired>
                <IpaCheckboxes
                  dataCy="selfservice-permissions-tab-settings-checkbox-permissions"
                  name="permissions"
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="selfservice"
                  metadata={props.metadata}
                  options={PERMISSION_OPTIONS}
                />
              </FormGroup>
              <FormGroup label="Attributes" fieldId="attrs" isRequired>
                <IpaTypeAheadWithCheckbox
                  id="selfservice-permissions-tab-settings-attrs"
                  dataCy="selfservice-permissions-tab-settings-select-attrs"
                  name="attrs"
                  options={SELF_SERVICE_ATTR_OPTIONS}
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="selfservice"
                  metadata={props.metadata}
                />
              </FormGroup>
            </Form>
          </Flex>
        </SidebarContent>
      </Sidebar>
    </TabLayout>
  );
};

export default SelfServicePermissionsSettings;
