import React, { useState } from "react";
// PatternFly
import {
  Flex,
  Form,
  FormGroup,
  PageSection,
  PageSectionVariants,
} from "@patternfly/react-core";
// Forms
import IpaTextArea from "src/components/Form/IpaTextArea";
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
import {
  HBACServiceGroup,
  Metadata,
} from "../../utils/datatypes/globalDataTypes";
// RPC
import { ErrorResult } from "src/services/rpc";
import { useSaveHbacServiceGroupMutation } from "src/services/rpcHBAC";

interface PropsToSettings {
  svcGroup: Partial<HBACServiceGroup>;
  originalSvcGrp: Partial<HBACServiceGroup>;
  metadata: Metadata;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSvcGrpChange: (service: Partial<HBACServiceGroup>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<HBACServiceGroup>;
  onResetValues: () => void;
}

const HBACServiceGroupsSettings = (props: PropsToSettings) => {
  const alerts = useAlerts();

  // API
  const [saveService] = useSaveHbacServiceGroupMutation();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "hbac-service-groups", noBreadcrumb: true });

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.svcGroup,
    props.onSvcGrpChange
  );

  const [isSaving, setSaving] = useState(false);

  // 'Save' handler method
  const onSave = () => {
    const modifiedValues = props.modifiedValues();
    modifiedValues.cn = props.svcGroup.cn;
    setSaving(true);

    saveService(modifiedValues).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Show toast notification: success
          alerts.addAlert(
            "save-success",
            "HBAC service group modified",
            "success"
          );
          props.onRefresh();
        } else if (response.data.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert("save-error", errorMessage.message, "danger");
          // Reset values. Disable 'revert' and 'save' buttons
          props.onResetValues();
        }
        setSaving(false);
      }
    });
  };

  // 'Revert' handler method
  const onRevert = () => {
    props.onSvcGrpChange(props.originalSvcGrp);
    alerts.addAlert(
      "revert-success",
      "HBAC service group data reverted",
      "success"
    );
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
            id="hbacservice-group-settings"
            text="HBAC service group settings"
          />
          <Form className="pf-v5-u-mt-sm pf-v5-u-mb-lg pf-v5-u-mr-md">
            <FormGroup label="Description" fieldId="description">
              <IpaTextArea
                name="description"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="hbacsvc"
                metadata={props.metadata}
              />
            </FormGroup>
          </Form>
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

export default HBACServiceGroupsSettings;
