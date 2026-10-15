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
import IpaNumberInput from "src/components/Form/IpaNumberInput/IpaNumberInput";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import TabLayout from "src/components/layouts/TabLayout";
// Utils
import { asRecord } from "src/utils/radiusServersUtils";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Data types
import { RadiusServer, Metadata } from "src/utils/datatypes/globalDataTypes";
// RPC
import { ErrorResult } from "src/services/rpc";
import { useSaveRadiusServerMutation } from "src/services/rpcRadiusServers";

interface PropsToRadiusServersSettings {
  radiusServer: Partial<RadiusServer>;
  originalRadiusServer: Partial<RadiusServer>;
  metadata: Metadata;
  onRadiusServerChange: (server: Partial<RadiusServer>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<RadiusServer>;
  onResetValues: () => void;
  onOpenContextualPanel?: () => void;
}

const RadiusServersSettings = (props: PropsToRadiusServersSettings) => {
  const dispatch = useAppDispatch();

  // API
  const [saveRadiusServer] = useSaveRadiusServerMutation();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "radius-servers", noBreadcrumb: true });

  // Get 'ipaObject' and 'recordOnChange' to use in form fields
  const { ipaObject, recordOnChange } = asRecord(
    props.radiusServer,
    props.onRadiusServerChange
  );

  const [isSaving, setSaving] = useState(false);

  // 'Save' handler method
  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const modifiedValues = props.modifiedValues();
    modifiedValues.cn = props.radiusServer.cn;
    setSaving(true);

    saveRadiusServer(modifiedValues)
      .then((response) => {
        if ("data" in response) {
          if (response.data?.result) {
            dispatch(
              addAlert({
                name: "save-success",
                title: "RADIUS server modified",
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

  // 'Revert' handler method
  const onRevert = () => {
    props.onRadiusServerChange(props.originalRadiusServer);
    dispatch(
      addAlert({
        name: "revert-success",
        title: "RADIUS server data reverted",
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
          data-cy="radius-servers-tab-settings-button-refresh"
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
          data-cy="radius-servers-tab-settings-button-revert"
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
          data-cy="radius-servers-tab-settings-button-save"
          isDisabled={!props.isModified || isSaving}
          type="submit"
          form="radius-servers-settings-form"
          isLoading={isSaving}
          spinnerAriaValueText="Saving"
          spinnerAriaLabel="Saving"
        >
          {isSaving ? "Saving" : "Save"}
        </Button>
      ),
    },
  ];

  // Render component
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
              id="radius-proxy-server-settings"
              text="RADIUS Proxy Server Settings"
            />
            <Form
              className="pf-v6-u-mt-sm pf-v6-u-mb-lg pf-v6-u-mr-md"
              id="radius-servers-settings-form"
              isHorizontal
              onSubmit={onSave}
            >
              <FormGroup label="RADIUS proxy server name" fieldId="cn">
                <IpaTextInput
                  dataCy="radius-servers-tab-settings-textinput-cn"
                  name="cn"
                  ariaLabel="RADIUS proxy server name"
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="radiusproxy"
                  metadata={props.metadata}
                />
              </FormGroup>
              <FormGroup label="Description" fieldId="description">
                <IpaTextArea
                  dataCy="radius-servers-tab-settings-textarea-description"
                  name="description"
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="radiusproxy"
                  metadata={props.metadata}
                />
              </FormGroup>
              <FormGroup
                label="Server"
                fieldId="ipatokenradiusserver"
                isRequired
              >
                <IpaTextInput
                  dataCy="radius-servers-tab-settings-textinput-ipatokenradiusserver"
                  name="ipatokenradiusserver"
                  ariaLabel="Server"
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="radiusproxy"
                  metadata={props.metadata}
                />
              </FormGroup>
              <FormGroup
                label="User attribute"
                fieldId="ipatokenusermapattribute"
              >
                <IpaTextInput
                  dataCy="radius-servers-tab-settings-textinput-ipatokenusermapattribute"
                  name="ipatokenusermapattribute"
                  ariaLabel="User attribute"
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="radiusproxy"
                  metadata={props.metadata}
                />
              </FormGroup>
              <FormGroup label="Timeout" fieldId="ipatokenradiustimeout">
                <IpaNumberInput
                  dataCy="radius-servers-tab-settings-numberinput-ipatokenradiustimeout"
                  id="ipatokenradiustimeout"
                  name="ipatokenradiustimeout"
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="radiusproxy"
                  metadata={props.metadata}
                  numCharsShown={10}
                  minValue={1}
                  maxValue={2147483647}
                />
              </FormGroup>
              <FormGroup label="Retries" fieldId="ipatokenradiusretries">
                <IpaNumberInput
                  dataCy="radius-servers-tab-settings-numberinput-ipatokenradiusretries"
                  id="ipatokenradiusretries"
                  name="ipatokenradiusretries"
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="radiusproxy"
                  metadata={props.metadata}
                  numCharsShown={10}
                  minValue={0}
                  maxValue={10}
                />
              </FormGroup>
            </Form>
          </Flex>
        </SidebarContent>
      </Sidebar>
    </TabLayout>
  );
};

export default RadiusServersSettings;
