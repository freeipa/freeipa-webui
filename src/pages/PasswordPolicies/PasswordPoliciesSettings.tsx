import React from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Sidebar,
  SidebarContent,
  SidebarPanel,
} from "@patternfly/react-core";
// Data types
import { PwPolicy, Metadata } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useAlerts from "src/hooks/useAlerts";
// Utils
import { asRecord } from "src/utils/subIdUtils";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
// RPC
import {
  PwPolicyModPayload,
  usePwPolicyModMutation,
} from "src/services/rpcPwdPolicies";
// Components
import IpaTextInput from "src/components/Form/IpaTextInput/IpaTextInput";
import TabLayout from "src/components/layouts/TabLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import IpaTextContent from "src/components/Form/IpaTextContent";

interface PropsToPwPolicySettings {
  pwPolicy: Partial<PwPolicy>;
  originalPwPolicy: Partial<PwPolicy>;
  metadata: Metadata;
  onPwPolicyChange: (pwPolicy: Partial<PwPolicy>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<PwPolicy>;
  onResetValues: () => void;
  pathname: string;
}

const PasswordPolicySettings = (props: PropsToPwPolicySettings) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: props.pathname });

  // States
  const [isDataLoading, setIsDataLoading] = React.useState(false);

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.pwPolicy,
    props.onPwPolicyChange
  );

  // API calls
  const [savePwPolicy] = usePwPolicyModMutation();

  // 'Revert' handler method
  const onRevert = () => {
    props.onPwPolicyChange(props.originalPwPolicy);
    props.onRefresh();
    alerts.addAlert(
      "revert-success",
      "Password policy data reverted",
      "success"
    );
  };

  // on Save handler method
  const onSave = () => {
    setIsDataLoading(true);
    const modifiedValues = props.modifiedValues();
    const payload: PwPolicyModPayload = {
      pwPolicyId: props.pwPolicy.cn as string,
    };

    if (modifiedValues.krbmaxpwdlife) {
      payload.krbmaxpwdlife = modifiedValues.krbmaxpwdlife;
    }
    if (modifiedValues.krbminpwdlife) {
      payload.krbminpwdlife = modifiedValues.krbminpwdlife;
    }
    if (modifiedValues.krbpwdhistorylength) {
      payload.krbpwdhistorylength = modifiedValues.krbpwdhistorylength;
    }
    if (modifiedValues.krbpwdmindiffchars) {
      payload.krbpwdmindiffchars = modifiedValues.krbpwdmindiffchars;
    }
    if (modifiedValues.krbpwdminlength) {
      payload.krbpwdminlength = modifiedValues.krbpwdminlength;
    }
    if (modifiedValues.krbpwdmaxfailure) {
      payload.krbpwdmaxfailure = modifiedValues.krbpwdmaxfailure;
    }
    if (modifiedValues.krbpwdfailurecountinterval) {
      payload.krbpwdfailurecountinterval =
        modifiedValues.krbpwdfailurecountinterval;
    }
    if (modifiedValues.krbpwdlockoutduration) {
      payload.krbpwdlockoutduration = modifiedValues.krbpwdlockoutduration;
    }
    if (modifiedValues.cospriority) {
      payload.cospriority = modifiedValues.cospriority;
    }
    if (modifiedValues.passwordgracelimit) {
      payload.passwordgracelimit = modifiedValues.passwordgracelimit;
    }

    savePwPolicy(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        if (data.error) {
          alerts.addAlert("error", (data.error as Error).message, "danger");
        }
        if (data.result) {
          props.onPwPolicyChange(data.result.result);
          alerts.addAlert(
            "success",
            "Subordinate ID " + props.pwPolicy.cn + " updated",
            "success"
          );
          // Reset values. Disable 'revert' and 'save' buttons
          props.onResetValues();
        }
      }
      setIsDataLoading(false);
    });
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
          isDisabled={!props.isModified || isDataLoading}
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
          isDisabled={!props.isModified || isDataLoading}
          onClickHandler={onSave}
        >
          Save
        </SecondaryButton>
      ),
    },
  ];

  // Render component
  return (
    <>
      <TabLayout id="settings-page" toolbarItems={toolbarFields}>
        <alerts.ManagedAlerts />
        <Sidebar isPanelRight>
          <SidebarPanel variant="sticky">
            <HelpTextWithIconLayout
              textContent="Help"
              icon={
                <OutlinedQuestionCircleIcon className="pf-v5-u-primary-color-100 pf-v5-u-mr-sm" />
              }
            />
          </SidebarPanel>
          <SidebarContent className="pf-v5-u-mr-xl">
            <Flex direction={{ default: "column", lg: "row" }}>
              <FlexItem flex={{ default: "flex_1" }}>
                <Form className="pf-v5-u-mb-lg">
                  <FormGroup label="Group" fieldId="group">
                    <IpaTextContent
                      name={"cn"}
                      ariaLabel={"Group"}
                      ipaObject={ipaObject}
                      objectName="pwpolicy"
                      metadata={props.metadata}
                      linkTo={"/user-groups/" + props.pwPolicy.cn?.toString()}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Max lifetime (days)"
                    fieldId="krbmaxpwdlife"
                  >
                    <IpaTextInput
                      name={"krbmaxpwdlife"}
                      ariaLabel={"Max lifetime in days"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="pwpolicy"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Min lifetime (hours)"
                    fieldId="krbminpwdlife"
                  >
                    <IpaTextInput
                      name={"krbminpwdlife"}
                      ariaLabel={"Min lifetime in hours"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="pwpolicy"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="History size (number of passwords)"
                    fieldId="krbpwdhistorylength"
                  >
                    <IpaTextInput
                      name={"krbpwdhistorylength"}
                      ariaLabel={"History size by number of passwords"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="pwpolicy"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Character classes"
                    fieldId="krbpwdmindiffchars"
                  >
                    <IpaTextInput
                      name={"krbpwdmindiffchars"}
                      ariaLabel={"Character classes"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="pwpolicy"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup label="Min length" fieldId="krbpwdminlength">
                    <IpaTextInput
                      name={"krbpwdminlength"}
                      ariaLabel={"Min length"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="pwpolicy"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup label="Max failures" fieldId="krbpwdmaxfailure">
                    <IpaTextInput
                      name={"krbpwdmaxfailure"}
                      ariaLabel={"Max failures"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="pwpolicy"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Failure reset interval (seconds)"
                    fieldId="krbpwdfailurecountinterval"
                  >
                    <IpaTextInput
                      name={"krbpwdfailurecountinterval"}
                      ariaLabel={"Failure reset interval in seconds"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="pwpolicy"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Lockout duration (seconds)"
                    fieldId="krbpwdlockoutduration"
                  >
                    <IpaTextInput
                      name={"krbpwdlockoutduration"}
                      ariaLabel={"Lockout duration in seconds"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="pwpolicy"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup label="Priority" fieldId="cospriority" isRequired>
                    <IpaTextInput
                      name={"cospriority"}
                      ariaLabel={"Priority"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="pwpolicy"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Grace login limit"
                    fieldId="passwordgracelimit"
                  >
                    <IpaTextInput
                      name={"passwordgracelimit"}
                      ariaLabel={"Grace login limit"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="pwpolicy"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                </Form>
              </FlexItem>
            </Flex>
          </SidebarContent>
        </Sidebar>
      </TabLayout>
    </>
  );
};

export default PasswordPolicySettings;
