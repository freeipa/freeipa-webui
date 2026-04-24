import React from "react";
// PatternFly
import {
  Button,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  JumpLinks,
  JumpLinksItem,
  Sidebar,
  SidebarContent,
  SidebarPanel,
} from "@patternfly/react-core";
// Data types
import { Trust, Metadata } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Utils
import { asRecord, isValidSID } from "src/utils/trustsUtils";
// RPC
import { TrustModPayload, useTrustModMutation } from "src/services/rpcTrusts";
// Components
import IpaTextInput from "src/components/Form/IpaTextInput/IpaTextInput";
import TabLayout from "src/components/layouts/TabLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import IpaTextboxList from "src/components/Form/IpaTextboxList";
import TitleLayout from "src/components/layouts/TitleLayout";
// Redux
import { addAlert } from "src/store/Global/alerts-slice";
import { useAppDispatch } from "src/store/hooks";

interface TrustsSettingsProps {
  trust: Partial<Trust>;
  originalTrust: Partial<Trust>;
  metadata: Metadata;
  onTrustChange: (trust: Partial<Trust>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading: boolean;
  modifiedValues: () => Partial<Trust>;
  onResetValues: () => void;
  pathname: string;
}

const TrustsSettings = (props: TrustsSettingsProps) => {
  // Alerts to show in the UI
  const dispatch = useAppDispatch();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: props.pathname });

  // States
  const [isDataLoading, setIsDataLoading] = React.useState(false);

  // API calls
  const [saveTrust] = useTrustModMutation();

  // 'Revert' handler method
  const onRevert = () => {
    props.onTrustChange(props.originalTrust);
    props.onRefresh();
    dispatch(
      addAlert({
        name: "revert-success",
        title: "Trust data reverted",
        variant: "success",
      })
    );
  };

  // Helper method to build the payload based on values
  const buildPayload = (
    modifiedValues: Partial<Trust>,
    keyArray: string[]
  ): TrustModPayload => {
    const payload: TrustModPayload = { cn: props.trust.cn || "" };

    keyArray.forEach((key) => {
      if (modifiedValues[key] !== undefined) {
        payload[key] = modifiedValues[key];
      }
    });
    return payload;
  };

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.trust,
    props.onTrustChange
  );

  // 'Save' handler method
  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsDataLoading(true);
    const modifiedValues = props.modifiedValues();

    const payload = buildPayload(modifiedValues, [
      "ipantadditionalsuffixes",
      "ipantsidblacklistincoming",
      "ipantsidblacklistoutgoing",
    ]);

    saveTrust(payload)
      .then((response) => {
        if ("data" in response) {
          const data = response.data;
          if (data?.error) {
            dispatch(
              addAlert({
                name: "save-error",
                title: (data.error as Error).message,
                variant: "danger",
              })
            );
          }
          if (data?.result) {
            props.onTrustChange(data.result.result);
            dispatch(
              addAlert({
                name: "save-success",
                title: "Trust data updated",
                variant: "success",
              })
            );
            props.onRefresh();
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
          data-cy="trusts-tab-settings-button-refresh"
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
          data-cy="trusts-tab-settings-button-revert"
          isDisabled={!props.isModified || isDataLoading}
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
          data-cy="trusts-tab-settings-button-save"
          isDisabled={!props.isModified || isDataLoading}
          type="submit"
          form="trusts-settings-form"
        >
          Save
        </Button>
      ),
    },
  ];

  // Return component
  return (
    <TabLayout
      id="settings-page"
      toolbarItems={toolbarFields}
      dataCy="trusts-settings"
    >
      <Sidebar isPanelRight>
        <SidebarPanel variant="sticky">
          <HelpTextWithIconLayout textContent="Help" />
          <JumpLinks
            isVertical
            label="Jump to section"
            scrollableSelector="#settings-page"
            expandable={{ default: "expandable", md: "nonExpandable" }}
          >
            <JumpLinksItem key={0} href="#trusts-settings">
              Trusts settings
            </JumpLinksItem>
            <JumpLinksItem key={1} href="#alternative-upn-suffixes">
              Alternative UPN suffixes
            </JumpLinksItem>
            <JumpLinksItem key={2} href="#sid-blocklists">
              SID blocklists
            </JumpLinksItem>
          </JumpLinks>
        </SidebarPanel>
        <SidebarContent className="pf-v6-u-mr-xl">
          <Form
            className="pf-v6-u-mb-lg"
            id="trusts-settings-form"
            onSubmit={onSave}
          >
            <Flex direction={{ default: "column", lg: "row" }}>
              <FlexItem flex={{ default: "flex_1" }}>
                <TitleLayout
                  key={0}
                  headingLevel="h2"
                  id="trusts-settings"
                  text="Trusts settings"
                />
                <FormGroup label="Realm Name" fieldId="cn" role="group">
                  <IpaTextInput
                    dataCy="trusts-tab-settings-input-realm-name"
                    name="cn"
                    objectName="trust"
                    metadata={props.metadata}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                  />
                </FormGroup>
                <FormGroup
                  label="Domain NetBIOS name"
                  fieldId="ipantflatname"
                  role="group"
                >
                  <IpaTextInput
                    dataCy="trusts-tab-settings-input-domain-netbios-name"
                    name="ipantflatname"
                    objectName="trust"
                    metadata={props.metadata}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                  />
                </FormGroup>
                <FormGroup label="Trust Type" fieldId="trusttype" role="group">
                  <IpaTextInput
                    dataCy="trusts-tab-settings-input-trust-type"
                    name="trusttype"
                    objectName="trust"
                    metadata={props.metadata}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                  />
                </FormGroup>
                <TitleLayout
                  key={1}
                  headingLevel="h2"
                  id="alternative-upn-suffixes"
                  text="Alternative UPN suffixes"
                  className="pf-v6-u-mt-lg"
                />
                <FormGroup
                  label="Alternative UPN suffixes"
                  fieldId="ipantadditionalsuffixes"
                  role="group"
                >
                  <IpaTextboxList
                    dataCy="trusts-tab-settings-textbox-alternative-upn-suffixes"
                    name="ipantadditionalsuffixes"
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="trust"
                    metadata={props.metadata}
                    ariaLabel="Alternative UPN suffixes list"
                  />
                </FormGroup>
              </FlexItem>
              <FlexItem flex={{ default: "flex_1" }}>
                <TitleLayout
                  key={2}
                  headingLevel="h2"
                  id="sid-blocklists"
                  text="SID blocklists"
                />
                <FormGroup
                  label="SID blocklists incoming"
                  fieldId="ipantsidblacklistincoming"
                  role="group"
                >
                  <IpaTextboxList
                    dataCy="trusts-tab-settings-textbox-sid-blocklists"
                    name="ipantsidblacklistincoming"
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="trust"
                    metadata={props.metadata}
                    ariaLabel="SID blocklists incoming list"
                    validator={isValidSID}
                  />
                </FormGroup>
                <FormGroup
                  label="SID blocklists outgoing"
                  fieldId="ipantsidblacklistoutgoing"
                  role="group"
                  className="pf-v6-u-mt-lg"
                >
                  <IpaTextboxList
                    dataCy="trusts-tab-settings-textbox-sid-blocklists-outgoing"
                    name="ipantsidblacklistoutgoing"
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="trust"
                    metadata={props.metadata}
                    ariaLabel="SID blocklists outgoing list"
                    validator={isValidSID}
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

export default TrustsSettings;
