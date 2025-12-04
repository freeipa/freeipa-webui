import React, { useState } from "react";
// PatternFly
import { Button, Flex, Form, FormGroup } from "@patternfly/react-core";
// Forms
import IpaTextArea from "src/components/Form/IpaTextArea";
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
import { HBACService, Metadata } from "../../utils/datatypes/globalDataTypes";
// RPC
import { ErrorResult } from "src/services/rpc";
import { useSaveHbacServiceMutation } from "src/services/rpcHBACServices";

interface PropsToSettings {
  service: Partial<HBACService>;
  originalService: Partial<HBACService>;
  metadata: Metadata;
  onServiceChange: (service: Partial<HBACService>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<HBACService>;
  onResetValues: () => void;
}

const HBACServicesSettings = (props: PropsToSettings) => {
  const dispatch = useAppDispatch();

  // API
  const [saveService] = useSaveHbacServiceMutation();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "hbac-services", noBreadcrumb: true });

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.service,
    props.onServiceChange
  );

  const [isSaving, setSaving] = useState(false);

  // 'Save' handler method
  const onSave = () => {
    const modifiedValues = props.modifiedValues();
    modifiedValues.cn = props.service.cn;
    setSaving(true);

    saveService(modifiedValues).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Show toast notification: success
          dispatch(
            addAlert({
              name: "save-success",
              title: "HBAC service modified",
              variant: "success",
            })
          );
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
    props.onServiceChange(props.originalService);
    dispatch(
      addAlert({
        name: "revert-success",
        title: "HBAC service data reverted",
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
          data-cy="hbac-services-tab-settings-button-refresh"
          onClick={props.onRefresh}
          variant="secondary"
        >
          Refresh
        </Button>
      ),
    },
    {
      key: 1,
      element: (
        <Button
          data-cy="hbac-services-tab-settings-button-revert"
          isDisabled={!props.isModified}
          onClick={onRevert}
          variant="secondary"
        >
          Revert
        </Button>
      ),
    },
    {
      key: 2,
      element: (
        <Button
          data-cy="hbac-services-tab-settings-button-save"
          isDisabled={!props.isModified || isSaving}
          onClick={onSave}
          isLoading={isSaving}
          spinnerAriaValueText="Saving"
          spinnerAriaLabelledBy="Saving"
          spinnerAriaLabel="Saving"
          variant="secondary"
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
          headingLevel="h1"
          id="hbacservice-settings"
          text="HBAC service settings"
        />
        <Form className="pf-v6-u-mt-sm pf-v6-u-mb-lg pf-v6-u-mr-md">
          <FormGroup label="Description" fieldId="description">
            <IpaTextArea
              dataCy="hbac-services-tab-settings-textbox-description"
              name="description"
              ipaObject={ipaObject}
              onChange={recordOnChange}
              objectName="hbacsvc"
              metadata={props.metadata}
            />
          </FormGroup>
        </Form>
      </Flex>
    </TabLayout>
  );
};

export default HBACServicesSettings;
