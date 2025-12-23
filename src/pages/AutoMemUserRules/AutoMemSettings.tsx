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
import IpaTextArea from "src/components/Form/IpaTextArea";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import TabLayout from "src/components/layouts/TabLayout";
// Utils
import { asRecord } from "../../utils/hostUtils";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Data types
import { Automember, Metadata } from "../../utils/datatypes/globalDataTypes";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  AutomemberModPayload,
  Condition,
  useSaveAutomemberMutation,
} from "src/services/rpcAutomember";
import InclusiveExclusiveSection from "src/components/AutomemberSections/InclusiveExclusiveSection";

interface PropsToSettings {
  automemberRule: Partial<Automember>;
  originalAutomemberRule: Partial<Automember>;
  automemberType: string;
  metadata: Metadata;
  onAutomemberChange: (automember: Partial<Automember>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<Automember>;
  onResetValues: () => void;
}

const AutoMemSettings = (props: PropsToSettings) => {
  const dispatch = useAppDispatch();

  // RPC calls
  const [saveAutomember] = useSaveAutomemberMutation();

  // Infer pathname from automemberType
  const pathname =
    props.automemberType === "group" ? "user-group-rules" : "host-group-rules";

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: pathname, noBreadcrumb: true });

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.automemberRule,
    props.onAutomemberChange
  );

  // States
  const [inclusiveRules, setInclusiveRules] = React.useState<Condition[]>([]);
  const [exclusiveRules, setExclusiveRules] = React.useState<Condition[]>([]);
  const [isSaving, setSaving] = React.useState(false);

  // Keep the 'rule' state updated
  React.useEffect(() => {
    // Convert the automember inclusive/exclusive rules ('employeetype=SE') to Condition[] format
    if (props.automemberRule.automemberinclusiveregex !== undefined) {
      const inclusive = props.automemberRule.automemberinclusiveregex.map(
        (rule) => {
          const splittedRule = rule.split("=");
          const key = splittedRule[0];
          const value = splittedRule[1];

          return {
            key: key,
            automemberregex: value,
          } as Condition;
        }
      );

      setInclusiveRules(inclusive);
    }

    if (props.automemberRule.automemberexclusiveregex !== undefined) {
      const exclusive = props.automemberRule.automemberexclusiveregex.map(
        (rule) => {
          const splittedRule = rule.split("=");
          const key = splittedRule[0];
          const value = splittedRule[1];

          return {
            key: key,
            automemberregex: value,
          } as Condition;
        }
      );
      setExclusiveRules(exclusive);
    }
  }, [props.automemberRule]);

  // 'Save' handler method
  const onSave = () => {
    const modifiedValues = props.modifiedValues();
    const payload = {
      automemberId: props.automemberRule.cn?.toString(),
      description: modifiedValues.description,
      type: props.automemberType,
    } as AutomemberModPayload;

    setSaving(true);

    saveAutomember(payload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Show toast notification: success
          dispatch(
            addAlert({
              name: "save-success",
              title: "Entry updated",
              variant: "success",
            })
          );
          // Refresh the page
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
    props.onAutomemberChange(props.originalAutomemberRule);
    props.onRefresh();
    dispatch(
      addAlert({
        name: "revert-success",
        title: "Automember rule data reverted",
        variant: "success",
      })
    );
  };

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <SecondaryButton
          dataCy="auto-member-tab-settings-button-refresh"
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
          dataCy="auto-member-tab-settings-button-revert"
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
          dataCy="auto-member-tab-settings-button-save"
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
      <Sidebar isPanelRight>
        <SidebarPanel variant="sticky">
          <HelpTextWithIconLayout
            textContent="Help"
            icon={
              <OutlinedQuestionCircleIcon className="pf-v6-u-primary-color-100 pf-v6-u-mr-sm" />
            }
          />
          <JumpLinks
            isVertical
            label="Jump to section"
            scrollableSelector="#settings-page"
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
        <SidebarContent className="pf-v6-u-mr-xl">
          <Flex direction={{ default: "column" }} flex={{ default: "flex_1" }}>
            <TitleLayout
              key={0}
              headingLevel="h1"
              id="rule-general"
              text="General"
            />
            <Form className="pf-v6-u-mt-sm pf-v6-u-mb-lg pf-v6-u-mr-md">
              <FormGroup label="Description" fieldId="description" role="group">
                <IpaTextArea
                  dataCy="auto-member-tab-settings-textbox-description"
                  name="description"
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="automember"
                  metadata={props.metadata}
                />
              </FormGroup>
            </Form>
            <Form className="pf-v6-u-mt-sm pf-v6-u-mb-lg pf-v6-u-mr-md">
              <TitleLayout
                key={1}
                headingLevel="h1"
                id="rule-inclusive"
                text="Inclusive"
              />
              <InclusiveExclusiveSection
                entityId={props.automemberRule.cn?.toString() as string}
                automemberType={props.automemberType}
                conditionType={"inclusive"}
                tableElements={inclusiveRules}
                metadata={props.metadata}
                columnNames={["Attribute", "Expression"]}
                onRefresh={props.onRefresh}
              />
            </Form>
            <Form className="pf-v6-u-mt-sm pf-v6-u-mb-lg pf-v6-u-mr-md">
              <TitleLayout
                key={1}
                headingLevel="h1"
                id="rule-exclusive"
                text="Exclusive"
              />
              <InclusiveExclusiveSection
                entityId={props.automemberRule.cn?.toString() as string}
                automemberType={props.automemberType}
                conditionType={"exclusive"}
                tableElements={exclusiveRules}
                metadata={props.metadata}
                columnNames={["Attribute", "Expression"]}
                onRefresh={props.onRefresh}
              />
            </Form>
          </Flex>
        </SidebarContent>
      </Sidebar>
    </TabLayout>
  );
};

export default AutoMemSettings;
