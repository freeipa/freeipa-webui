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
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import { addAlert } from "src/store/Global/alerts-slice";
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
import IpaTextInput from "src/components/Form/IpaTextInput";
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
  const dispatch = useAppDispatch();

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
    dispatch(
      addAlert({
        name: "revert-success",
        title: "Password policy data reverted",
        variant: "success",
      })
    );
  };

  // Helper method to build the payload based on values
  const buildPayload = (
    modifiedValues: Partial<PwPolicy>,
    keyArray: string[]
  ): PwPolicyModPayload => {
    const payload: PwPolicyModPayload = {
      pwPolicyId: props.pwPolicy.cn as string,
    };

    keyArray.forEach((key) => {
      // Modified values are either the value (in string) or an array ([]) when set to empty string
      if (modifiedValues[key] !== undefined) {
        if (modifiedValues[key] === "") {
          payload[key] = [];
        } else {
          payload[key] = modifiedValues[key];
        }
      }
    });
    return payload;
  };

  // on Save handler method
  const onSave = () => {
    setIsDataLoading(true);
    const modifiedValues = props.modifiedValues();

    // Generate payload
    const payload = buildPayload(modifiedValues, [
      "krbmaxpwdlife",
      "krbminpwdlife",
      "krbpwdhistorylength",
      "krbpwdmindiffchars",
      "krbpwdminlength",
      "krbpwdmaxfailure",
      "krbpwdfailurecountinterval",
      "krbpwdlockoutduration",
      "cospriority",
      "passwordgracelimit",
    ]);

    savePwPolicy(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        if (data?.error) {
          dispatch(
            addAlert({
              name: "error",
              title: (data.error as Error).message,
              variant: "danger",
            })
          );
        }
        if (data?.result) {
          props.onPwPolicyChange(data.result.result);
          dispatch(
            addAlert({
              name: "success",
              title: "Password policy '" + props.pwPolicy.cn + "' updated",
              variant: "success",
            })
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
        <SecondaryButton
          onClickHandler={props.onRefresh}
          dataCy="password-policies-button-refresh"
        >
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
          dataCy="password-policies-button-revert"
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
          dataCy="password-policies-button-save"
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
        <Sidebar isPanelRight>
          <SidebarPanel variant="sticky">
            <HelpTextWithIconLayout
              textContent="Help"
              icon={
                <OutlinedQuestionCircleIcon className="pf-v6-u-primary-color-100 pf-v6-u-mr-sm" />
              }
            />
          </SidebarPanel>
          <SidebarContent className="pf-v6-u-mr-xl">
            <Flex direction={{ default: "column", lg: "row" }}>
              <FlexItem flex={{ default: "flex_1" }}>
                <Form className="pf-v6-u-mb-lg">
                  <FormGroup label="Group" fieldId="group" role="group">
                    <IpaTextContent
                      dataCy="password-policies-text-group"
                      name={"cn"}
                      ariaLabel={"Group"}
                      ipaObject={ipaObject}
                      objectName="pwpolicy"
                      metadata={props.metadata}
                      linkTo={
                        "/password-policies/" + props.pwPolicy.cn?.toString()
                      }
                    />
                  </FormGroup>
                  <FormGroup
                    label="Max lifetime (days)"
                    fieldId="krbmaxpwdlife"
                  >
                    <IpaTextInput
                      dataCy="password-policies-tab-settings-textbox-max-lifetime"
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
                      dataCy="password-policies-tab-settings-textbox-min-lifetime"
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
                      dataCy="password-policies-tab-settings-textbox-history-size"
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
                      dataCy="password-policies-tab-settings-textbox-character-classes"
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
                      dataCy="password-policies-tab-settings-textbox-min-length"
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
                      dataCy="password-policies-tab-settings-textbox-max-failures"
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
                      dataCy="password-policies-tab-settings-textbox-failure-reset-interval"
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
                      dataCy="password-policies-tab-settings-textbox-lockout-duration"
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
                      dataCy="password-policies-tab-settings-textbox-priority"
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
                      dataCy="password-policies-tab-settings-textbox-grace-login-limit"
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
