import React from "react";
// PatternFly
import {
  Button,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Sidebar,
  SidebarContent,
  SidebarPanel,
} from "@patternfly/react-core";
// Redux
import { useAppDispatch } from "src/store/hooks";
// RPC
import {
  OtpTokensModifyPayload,
  useModifyOtpTokensMutation,
} from "src/services/rpcOtpTokens";
// Data types
import { OtpToken, Metadata, User } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
// Components
import TabLayout from "src/components/layouts/TabLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import IpaCalendar from "src/components/Form/IpaCalendar";
import IpaTextArea from "src/components/Form/IpaTextArea";
import IpaTextInput from "src/components/Form/IpaTextInput";
import { asRecord } from "src/utils/otpTokensUtils";
import IpaSelect from "src/components/Form/IpaSelect";
import { addAlert } from "src/store/Global/alerts-slice";
import TitleLayout from "src/components/layouts/TitleLayout";

interface OtpTokensSettingsProps {
  otpToken: Partial<OtpToken>;
  originalOtpToken: Partial<OtpToken>;
  users: Partial<User>[];
  metadata: Metadata;
  onOtpTokenChange: (otpToken: Partial<OtpToken>) => void;
  onRefresh: () => void;
  isDataLoading: boolean;
  modifiedValues: () => Partial<OtpToken>;
  isModified: boolean;
  onResetValues: () => void;
  pathname: string;
}

const OtpTokensSettings = (props: OtpTokensSettingsProps) => {
  const dispatch = useAppDispatch();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: props.pathname });

  // States
  const [isDataLoading, setIsDataLoading] = React.useState(false);

  // RPC calls
  const [modifyOtpToken] = useModifyOtpTokensMutation();

  const { ipaObject, recordOnChange } = asRecord(
    props.otpToken,
    props.onOtpTokenChange
  );

  // 'Revert' handler method
  const onRevert = () => {
    props.onOtpTokenChange(props.originalOtpToken);
    props.onRefresh();
    dispatch(
      addAlert({
        name: "revert-success",
        title: "OTP token data reverted",
        variant: "success",
      })
    );
  };

  // Helper method to build the payload based on values
  const buildPayload = (
    modifiedValues: Partial<OtpToken>,
    keyArray: string[]
  ): OtpTokensModifyPayload => {
    const payload: OtpTokensModifyPayload = {
      ipatokenuniqueid: props.otpToken.ipatokenuniqueid || "",
    };

    keyArray.forEach((key) => {
      if (modifiedValues[key] !== undefined) {
        if (modifiedValues[key] === "") {
          payload[key] = [];
        } else {
          payload[key] = modifiedValues[key].toString();
        }
      }
    });
    return payload;
  };

  // 'Save' handler method
  const onSave = () => {
    setIsDataLoading(true);
    const modifiedValues = props.modifiedValues();

    const payload = buildPayload(modifiedValues, [
      "ipatokenowner",
      "description",
      "ipatokennotbefore",
      "ipatokennotafter",
      "ipatokenvendor",
      "ipatokenmodel",
      "ipatokenserial",
    ]);

    modifyOtpToken([payload])
      .then((response) => {
        if ("data" in response) {
          const data = response.data;
          if (data?.error) {
            dispatch(
              addAlert({
                name: "error",
                title: data.error,
                variant: "danger",
              })
            );
          }
          if (data?.result) {
            props.onOtpTokenChange(data.result.results[0].result);
            if (data.result.results[0].error) {
              dispatch(
                addAlert({
                  name: "error",
                  title: data.result.results[0].error,
                  variant: "danger",
                })
              );
            } else {
              dispatch(
                addAlert({
                  name: "success",
                  title:
                    "OTP token '" +
                    props.otpToken.ipatokenuniqueid +
                    "' updated",
                  variant: "success",
                })
              );
              props.onResetValues();
              props.onRefresh();
            }
          }
        }
      })
      .finally(() => {
        setIsDataLoading(false);
      });
  };

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <Button
          variant="secondary"
          data-cy="otp-tokens-tab-settings-button-refresh"
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
          data-cy="otp-tokens-tab-settings-button-revert"
          onClick={onRevert}
          isDisabled={!props.isModified || isDataLoading}
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
          data-cy="otp-tokens-tab-settings-button-save"
          onClick={onSave}
          isDisabled={!props.isModified || isDataLoading}
        >
          Save
        </Button>
      ),
    },
  ];

  return (
    <TabLayout
      id="settings-page"
      toolbarItems={toolbarFields}
      dataCy="id-ranges-settings"
    >
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
          <TitleLayout
            key={0}
            id="otp-token-settings"
            text="OTP token settings"
            headingLevel="h2"
            className="pf-v6-u-mt-md pf-v6-u-mb-lg"
          />
          <Form className="pf-v6-u-mb-lg">
            <Flex direction={{ default: "column", lg: "row" }}>
              <FlexItem flex={{ default: "flex_1" }}>
                <FormGroup
                  label="Unique ID"
                  data-cy="otp-tokens-tab-settings-textbox-ipatokenuniqueid"
                  role="ipatokenuniqueid"
                  className="pf-v6-u-mb-md"
                >
                  <IpaTextInput
                    dataCy="otp-tokens-tab-settings-textbox-ipatokenuniqueid"
                    name={"ipatokenuniqueid"}
                    ariaLabel={"Unique ID text input"}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="otptoken"
                    metadata={props.metadata}
                  />
                </FormGroup>
                <FormGroup
                  label="Type"
                  data-cy="otp-tokens-tab-settings-textbox-type"
                  role="type"
                  className="pf-v6-u-mb-md"
                >
                  <IpaTextInput
                    dataCy="otp-tokens-tab-settings-textbox-type"
                    name={"type"}
                    ariaLabel={"Type text input"}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="otptoken"
                    metadata={props.metadata}
                  />
                </FormGroup>
                <FormGroup
                  label="Description"
                  data-cy="otp-tokens-tab-settings-textbox-description"
                  role="description"
                  className="pf-v6-u-mb-md"
                >
                  <IpaTextArea
                    name={"description"}
                    aria-label={"Description text input"}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="otptoken"
                    metadata={props.metadata}
                    dataCy="otp-tokens-tab-settings-textbox-description"
                  />
                </FormGroup>
                <FormGroup
                  label="Owner"
                  data-cy="otp-tokens-tab-settings-textbox-ipatokenowner"
                  role="ipatokenowner"
                  className="pf-v6-u-mb-md"
                >
                  <IpaSelect
                    dataCy="otp-tokens-tab-settings-select-ipatokenowner"
                    name={"ipatokenowner"}
                    ariaLabel={"Owner select"}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="otptoken"
                    metadata={props.metadata}
                    options={props.users.map(
                      (user) => user.uid?.toString() || ""
                    )}
                  />
                </FormGroup>
                <FormGroup
                  label="Validity start"
                  data-cy="otp-tokens-tab-settings-textbox-ipatokennotbefore"
                  role="validity-start"
                  className="pf-v6-u-mb-md"
                >
                  <IpaCalendar
                    name={"ipatokennotbefore"}
                    ariaLabel={"Validity start date"}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="otptoken"
                    metadata={props.metadata}
                    dataCy="otp-tokens-tab-settings-calendar-ipatokennotbefore"
                  />
                </FormGroup>
                <FormGroup
                  label="Validity end"
                  data-cy="otp-tokens-tab-settings-textbox-ipatokennotafter"
                  role="validity-end"
                  className="pf-v6-u-mb-md"
                >
                  <IpaCalendar
                    name={"ipatokennotafter"}
                    ariaLabel={"Validity end date"}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="otptoken"
                    metadata={props.metadata}
                    dataCy="otp-tokens-tab-settings-calendar-ipatokennotafter"
                  />
                </FormGroup>
              </FlexItem>
              <FlexItem flex={{ default: "flex_1" }}>
                <FormGroup
                  label="Vendor"
                  data-cy="otp-tokens-tab-settings-textbox-ipatokenvendor"
                  role="vendor"
                  className="pf-v6-u-mb-md"
                >
                  <IpaTextInput
                    dataCy="otp-tokens-tab-settings-textbox-ipatokenvendor"
                    name={"ipatokenvendor"}
                    ariaLabel={"Vendor text input"}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="otptoken"
                    metadata={props.metadata}
                  />
                </FormGroup>
                <FormGroup
                  label="Model"
                  data-cy="otp-tokens-tab-settings-textbox-ipatokenmodel"
                  role="model"
                  className="pf-v6-u-mb-md"
                >
                  <IpaTextInput
                    dataCy="otp-tokens-tab-settings-textbox-ipatokenmodel"
                    name={"ipatokenmodel"}
                    ariaLabel={"Model text input"}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="otptoken"
                    metadata={props.metadata}
                  />
                </FormGroup>
                <FormGroup
                  label="Serial"
                  data-cy="otp-tokens-tab-settings-textbox-ipatokenserial"
                  role="serial"
                  className="pf-v6-u-mb-md"
                >
                  <IpaTextInput
                    dataCy="otp-tokens-tab-settings-textbox-ipatokenmodel"
                    name={"ipatokenserial"}
                    ariaLabel={"Serial text input"}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="otptoken"
                    metadata={props.metadata}
                  />
                </FormGroup>
                <FormGroup
                  label="Algorithm"
                  data-cy="otp-tokens-tab-settings-textbox-ipatokenotpalgorithm"
                  role="algorithm"
                  className="pf-v6-u-mb-md"
                >
                  <IpaTextInput
                    dataCy="otp-tokens-tab-settings-textbox-ipatokenmodel"
                    name={"ipatokenotpalgorithm"}
                    ariaLabel={"Algorithm text input"}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="otptoken"
                    metadata={props.metadata}
                  />
                </FormGroup>
                <FormGroup
                  label="Digits"
                  data-cy="otp-tokens-tab-settings-textbox-ipatokenotpdigits"
                  role="digits"
                  className="pf-v6-u-mb-md"
                >
                  <IpaTextInput
                    dataCy="otp-tokens-tab-settings-textbox-ipatokenotpdigits"
                    name={"ipatokenotpdigits"}
                    ariaLabel={"Digits text input"}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="otptoken"
                    metadata={props.metadata}
                  />
                </FormGroup>
                <FormGroup
                  label="Clock offset (seconds)"
                  data-cy="otp-tokens-tab-settings-textbox-ipatokentotpclockoffset"
                  role="clock-offset"
                  className="pf-v6-u-mb-md"
                >
                  <IpaTextInput
                    dataCy="otp-tokens-tab-settings-textbox-ipatokentotpclockoffset"
                    name={"ipatokentotpclockoffset"}
                    ariaLabel={"Clock offset text input"}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="otptoken"
                    metadata={props.metadata}
                  />
                </FormGroup>
                <FormGroup
                  label="Clock interval (seconds)"
                  data-cy="otp-tokens-tab-settings-textbox-ipatokentotptimestep"
                  role="clock-interval"
                  className="pf-v6-u-mb-md"
                >
                  <IpaTextInput
                    dataCy="otp-tokens-tab-settings-textbox-ipatokentotptimestep"
                    name={"ipatokentotptimestep"}
                    ariaLabel={"Clock interval text input"}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="otptoken"
                    metadata={props.metadata}
                  />
                </FormGroup>
              </FlexItem>
            </Flex>
          </Form>
        </SidebarContent>
      </Sidebar>
    </TabLayout>
  );
};

export default OtpTokensSettings;
