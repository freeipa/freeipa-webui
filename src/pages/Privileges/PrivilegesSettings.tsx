import React, { useState } from "react";
// PatternFly
import {
  Button,
  Flex,
  Form,
  FormGroup,
  Sidebar,
  SidebarContent,
  SidebarPanel,
} from "@patternfly/react-core";
// Forms
import IpaTextInput from "src/components/Form/IpaTextInput";
import IpaTextArea from "src/components/Form/IpaTextArea";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import TabLayout from "src/components/layouts/TabLayout";
// Utils
import { asRecord } from "src/utils/privilegesUtils";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Data types
import { Privilege, Metadata } from "src/utils/datatypes/globalDataTypes";
// RPC
import { ErrorResult } from "src/services/rpc";
import { useSavePrivilegeMutation } from "src/services/rpcPrivileges";

interface PropsToSettings {
  privilege: Partial<Privilege>;
  originalPrivilege: Partial<Privilege>;
  metadata: Metadata;
  onPrivilegeChange: (privilege: Partial<Privilege>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<Privilege>;
  onResetValues: () => void;
  onOpenContextualPanel?: () => void;
}

const PrivilegesSettings = (props: PropsToSettings) => {
  const dispatch = useAppDispatch();

  const [savePrivilege] = useSavePrivilegeMutation();

  useUpdateRoute({ pathname: "privileges", noBreadcrumb: true });

  const { ipaObject, recordOnChange } = asRecord(
    props.privilege,
    props.onPrivilegeChange
  );

  const [isSaving, setSaving] = useState(false);

  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const modifiedValues = props.modifiedValues();
    modifiedValues.cn = props.privilege.cn;
    setSaving(true);

    savePrivilege(modifiedValues)
      .then((response) => {
        if ("data" in response) {
          if (response.data?.result) {
            dispatch(
              addAlert({
                name: "save-success",
                title: "Privilege modified",
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
    props.onPrivilegeChange(props.originalPrivilege);
    dispatch(
      addAlert({
        name: "revert-success",
        title: "Privilege data reverted",
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
          data-cy="privileges-tab-settings-button-refresh"
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
          data-cy="privileges-tab-settings-button-revert"
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
          data-cy="privileges-tab-settings-button-save"
          isDisabled={!props.isModified || isSaving}
          type="submit"
          form="privileges-settings-form"
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
              id="privilege-settings"
              text="Privilege settings"
            />
            <Form
              className="pf-v6-u-mt-sm pf-v6-u-mb-lg pf-v6-u-mr-md"
              id="privileges-settings-form"
              isHorizontal
              onSubmit={onSave}
            >
              <FormGroup label="Privilege name" fieldId="cn">
                <IpaTextInput
                  dataCy="privileges-tab-settings-textinput-cn"
                  name="cn"
                  ariaLabel="Privilege name"
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="privilege"
                  metadata={props.metadata}
                />
              </FormGroup>
              <FormGroup label="Description" fieldId="description">
                <IpaTextArea
                  dataCy="privileges-tab-settings-textarea-description"
                  name="description"
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="privilege"
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

export default PrivilegesSettings;
