import React, { useState } from "react";
// PatternFly
import { Button, Flex, Form, FormGroup } from "@patternfly/react-core";
// Forms
import IpaTextArea from "../../components/Form/IpaTextArea";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import TabLayout from "src/components/layouts/TabLayout";
// Utils
import { asRecord } from "../../utils/hostUtils";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Data types
import { HostGroup, Metadata } from "../../utils/datatypes/globalDataTypes";
// RPC
import { ErrorResult } from "src/services/rpc";
import { useSaveHostGroupMutation } from "src/services/rpcHostGroups";

interface PropsToGroupsSettings {
  hostGroup: Partial<HostGroup>;
  originalGroup: Partial<HostGroup>;
  metadata: Metadata;
  onGroupChange: (hostGroup: Partial<HostGroup>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<HostGroup>;
  onResetValues: () => void;
}

const HostGroupsSettings = (props: PropsToGroupsSettings) => {
  const dispatch = useAppDispatch();

  // API
  const [saveGroup] = useSaveHostGroupMutation();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "host-groups", noBreadcrumb: true });

  const [isSaving, setSaving] = useState(false);

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.hostGroup,
    props.onGroupChange
  );

  // 'Save' handler method
  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const modifiedValues = props.modifiedValues();
    modifiedValues.cn = props.hostGroup.cn;
    setSaving(true);

    saveGroup(modifiedValues).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Show toast notification: success
          dispatch(
            addAlert({
              name: "save-success",
              title: "Host group modified",
              variant: "success",
            })
          );
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
    dispatch(
      addAlert({
        name: "revert-success",
        title: "Host group data reverted",
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
          data-cy="host-groups-tab-settings-button-refresh"
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
          data-cy="host-groups-tab-settings-button-revert"
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
          data-cy="host-groups-tab-settings-button-save"
          isDisabled={!props.isModified || isSaving}
          type="submit"
          form="host-groups-settings-form"
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
      <Flex direction={{ default: "column" }} flex={{ default: "flex_1" }}>
        <TitleLayout
          key={0}
          headingLevel="h2"
          id="group-settings"
          text="Host group settings"
        />
        <Form
          className="pf-v6-u-mt-sm pf-v6-u-mb-lg pf-v6-u-mr-md"
          isHorizontal
          id="host-groups-settings-form"
          onSubmit={onSave}
        >
          <FormGroup label="Description" fieldId="description">
            <IpaTextArea
              dataCy="host-groups-tab-settings-textbox-description"
              name="description"
              ipaObject={ipaObject}
              onChange={recordOnChange}
              objectName="group"
              metadata={props.metadata}
            />
          </FormGroup>
        </Form>
      </Flex>
    </TabLayout>
  );
};

export default HostGroupsSettings;
