import React from "react";
// PatternFly
import {
  Flex,
  Form,
  FormGroup,
  JumpLinks,
  JumpLinksItem,
  Sidebar,
  SidebarPanel,
  SidebarContent,
} from "@patternfly/react-core";
// Forms
import IpaTextArea from "src/components/Form/IpaTextArea/IpaTextArea";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import TabLayout from "src/components/layouts/TabLayout";
// Utils
import { asRecord } from "../../utils/hostUtils";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Data types
import {
  automemberType,
  Metadata,
} from "../../utils/datatypes/globalDataTypes";
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  AutomemberModPayload,
  useSaveAutomemberMutation,
} from "src/services/rpcAutomember";

interface PropsToSettings {
  automemberRule: Partial<automemberType>;
  originalAutomemberRule: Partial<automemberType>;
  automemberType: string;
  metadata: Metadata;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAutomemberChange: (automember: Partial<automemberType>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<automemberType>;
  onResetValues: () => void;
}

const AutoMemSettings = (props: PropsToSettings) => {
  const alerts = useAlerts();

  // RPC calls
  const [saveAutomember] = useSaveAutomemberMutation();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "user-group-rules", noBreadcrumb: true });

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.automemberRule,
    props.onAutomemberChange
  );

  const [isSaving, setSaving] = React.useState(false);

  // 'Save' handler method
  const onSave = () => {
    const modifiedValues = props.modifiedValues();
    const payload = {
      description: modifiedValues.description,
      ...modifiedValues,
    } as AutomemberModPayload;

    setSaving(true);

    saveAutomember(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Show toast notification: success
          alerts.addAlert("save-success", "Entry updated", "success");
          // Refresh the page
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
    props.onAutomemberChange(props.originalAutomemberRule);
    alerts.addAlert(
      "revert-success",
      "Automember rule data reverted",
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
    <TabLayout id="automember-settings-page" toolbarItems={toolbarFields}>
      <alerts.ManagedAlerts />
      <Sidebar isPanelRight>
        <SidebarPanel variant="sticky">
          <HelpTextWithIconLayout
            textContent="Help"
            icon={
              <OutlinedQuestionCircleIcon className="pf-v5-u-primary-color-100 pf-v5-u-mr-sm" />
            }
          />
          <JumpLinks
            isVertical
            label="Jump to section"
            scrollableSelector="#settings-page"
            offset={220} // for masthead
            expandable={{ default: "expandable", md: "nonExpandable" }}
          >
            <JumpLinksItem key={0} href="#rule-general">
              General
            </JumpLinksItem>
            <JumpLinksItem key={1} href="#inclusive">
              Inclusive
            </JumpLinksItem>
            <JumpLinksItem key={2} href="#exclusive">
              Exclusive
            </JumpLinksItem>
          </JumpLinks>
        </SidebarPanel>
        <SidebarContent className="pf-v5-u-mr-xl">
          <Flex direction={{ default: "column" }} flex={{ default: "flex_1" }}>
            <TitleLayout
              key={0}
              headingLevel="h1"
              id="rule-general"
              text="HBAC rule settings"
            />
            <Form className="pf-v5-u-mt-sm pf-v5-u-mb-lg pf-v5-u-mr-md">
              <FormGroup label="Description" fieldId="description">
                <IpaTextArea
                  name="description"
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="hbacrule"
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

export default AutoMemSettings;
